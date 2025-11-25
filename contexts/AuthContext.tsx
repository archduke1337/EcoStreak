'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { signInWithEmail, signUpWithEmail, signOut, updateUserStats as updateUserStatsAction, updateUserProfile as updateUserProfileAction, getCurrentUser } from '@/lib/auth-actions';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, college: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (name: string, college: string) => Promise<void>;
    updateUserStats: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user on mount
    const fetchCurrentUser = useCallback(async () => {
        try {
            const result = await getCurrentUser();
            if (result.success && result.user) {
                setUser(result.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('[Auth] Error fetching user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const result = await signInWithEmail({ email, password });
        
        if (!result.success) {
            console.error('[Auth] Login failed:', result.error);
            throw new Error(result.error);
        }
        
        // Set user directly from server action response
        if (result.user) {
            setUser(result.user);
            setLoading(false);
        } else {
            // Fallback to fetching user data
            await fetchCurrentUser();
        }
    };

    const signup = async (email: string, password: string, name: string, college: string): Promise<void> => {
        const result = await signUpWithEmail({ email, password, name, college });
        
        if (!result.success) {
            console.error('[Auth] Signup failed:', result.error);
            throw new Error(result.error);
        }
        
        // Set user directly from server action response
        if (result.user) {
            setUser(result.user);
            setLoading(false);
        } else {
            // Fallback to fetching user data
            await fetchCurrentUser();
        }
    };

    const logout = async (): Promise<void> => {
        await signOut();
        setUser(null);
    };

    const refreshUser = async (): Promise<void> => {
        await fetchCurrentUser();
    };

    const updateProfile = async (name: string, college: string): Promise<void> => {
        if (!user) {
            throw new Error('User not logged in');
        }

        const result = await updateUserProfileAction(user.$id, name, college);
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to update profile');
        }
        
        await fetchCurrentUser();
    };

    const updateUserStats = async (updates: Partial<User>): Promise<void> => {
        if (!user) {
            throw new Error('User not logged in');
        }

        const result = await updateUserStatsAction(user.$id, updates);
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to update stats');
        }
        
        await fetchCurrentUser();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                refreshUser,
                updateProfile,
                updateUserStats,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
