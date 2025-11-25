'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/auth-actions';

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
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
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
    }, [fetchCurrentUser]);

    const login = async (email: string, password: string): Promise<void> => {
        console.log('Attempting login for:', email);
        const result = await signInWithEmail({ email, password });
        
        if (!result.success) {
            console.error('Login failed:', result.error);
            throw new Error(result.error);
        }
        
        console.log('Login successful, user data:', result.user);
        // Set user directly from server action response
        if (result.user) {
            setUser(result.user);
        } else {
            // Fallback to fetching user data
            await fetchCurrentUser();
        }
    };

    const signup = async (email: string, password: string, name: string, college: string): Promise<void> => {
        console.log('Attempting signup for:', email);
        const result = await signUpWithEmail({ email, password, name, college });
        
        if (!result.success) {
            console.error('Signup failed:', result.error);
            throw new Error(result.error);
        }
        
        console.log('Signup successful, user data:', result.user);
        // Set user directly from server action response
        if (result.user) {
            setUser(result.user);
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
        const response = await fetch('/api/auth/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, college }),
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update profile');
        }
        
        await fetchCurrentUser();
    };

    const updateUserStats = async (updates: Partial<User>): Promise<void> => {
        const response = await fetch('/api/auth/update-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update stats');
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
