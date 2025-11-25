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
        console.log('[Auth] fetchCurrentUser called');
        try {
            const response = await fetch('/api/auth/me');
            console.log('[Auth] /api/auth/me response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('[Auth] User data received:', data.user ? `${data.user.$id}` : 'null');
                setUser(data.user);
            } else {
                console.log('[Auth] Auth failed, setting user to null');
                setUser(null);
            }
        } catch (error) {
            console.error('[Auth] Error fetching user:', error);
            setUser(null);
        } finally {
            console.log('[Auth] Setting loading to false');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        console.log('[Auth] login() called for:', email);
        const result = await signInWithEmail({ email, password });
        
        if (!result.success) {
            console.error('[Auth] Login failed:', result.error);
            throw new Error(result.error);
        }
        
        console.log('[Auth] Login successful, user data:', result.user ? `${result.user.$id}` : 'null');
        // Set user directly from server action response
        if (result.user) {
            console.log('[Auth] Setting user from login response');
            setUser(result.user);
            setLoading(false);
        } else {
            // Fallback to fetching user data
            console.log('[Auth] No user in response, fetching from API');
            await fetchCurrentUser();
        }
    };

    const signup = async (email: string, password: string, name: string, college: string): Promise<void> => {
        console.log('[Auth] signup() called for:', email);
        const result = await signUpWithEmail({ email, password, name, college });
        
        if (!result.success) {
            console.error('[Auth] Signup failed:', result.error);
            throw new Error(result.error);
        }
        
        console.log('[Auth] Signup successful, user data:', result.user ? `${result.user.$id}` : 'null');
        // Set user directly from server action response
        if (result.user) {
            console.log('[Auth] Setting user from signup response');
            setUser(result.user);
            setLoading(false);
        } else {
            // Fallback to fetching user data
            console.log('[Auth] No user in response, fetching from API');
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
