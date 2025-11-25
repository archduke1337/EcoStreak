'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, ID, Query } from '@/lib/appwrite';
import { User } from '@/types';
import { Models } from 'appwrite';
import { getAdminEmails } from '@/lib/admin-auth';
import { logError, handleError } from '@/lib/error-handler';

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

// Convert a raw DB document into the frontend User shape, handling schema typos and badge conversion
const mapDocToUser = (doc: Models.Document, email: string): User => {
    // Badges are stored as a JSON string (max 100 chars). Convert to array for UI.
    let badgesArray: string[] = [];
    const rawBadges = (doc as any).badges;
    if (Array.isArray(rawBadges)) {
        badgesArray = rawBadges as string[];
    } else if (typeof rawBadges === 'string') {
        try {
            badgesArray = JSON.parse(rawBadges);
        } catch {
            badgesArray = [];
        }
    }

    return {
        ...doc,
        $id: doc.$id,
        email,
        college: (doc as any).college || 'Unknown College',
        lastActiveDate: (doc as any).lastActiveDate || new Date().toISOString().split('T')[0],
        badges: badgesArray,
    } as unknown as User;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ---------------------------------------------------------------------
    // Fetch user data from Appwrite DB (or create a placeholder if missing)
    // ---------------------------------------------------------------------
    const fetchUserData = async (accountData: Models.User<Models.Preferences>): Promise<void> => {
        try {
            // Prefer fetching by the Auth account ID (most reliable)
            const doc = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                accountData.$id
            );
            setUser(mapDocToUser(doc, accountData.email));
        } catch (error: any) {
            if (error.code === 404) {
                // No document – create a minimal one
                const newUser = {
                    name: accountData.name || 'Eco Warrior',
                    // email not stored in collection
                    college: 'Unknown College',
                    points: 0,
                    level: 1,
                    badges: [],
                    streak: 0,
                    lastActiveDate: new Date().toISOString().split('T')[0],
                    role: 'student',
                };
                const created = await databases.createDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    accountData.$id,
                    newUser
                );
                setUser(mapDocToUser(created, accountData.email));
            } else {
                throw error;
            }
        }
    };

    // ---------------------------------------------------------------------
    // Initialise on mount
    // ---------------------------------------------------------------------
    useEffect(() => {
        const init = async () => {
            try {
                const acc = await account.get();
                await fetchUserData(acc);
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // ---------------------------------------------------------------------
    // Auth actions
    // ---------------------------------------------------------------------
    const login = async (email: string, password: string): Promise<void> => {
        try {
            console.log('Attempting login for:', email);
            await account.createEmailPasswordSession(email, password);
            console.log('Session created successfully. Fetching account...');
            const acc = await account.get();
            console.log('Account fetched:', acc.$id);
            await fetchUserData(acc);
            console.log('User data fetched successfully');
        } catch (e: any) {
            console.error('Login error details:', e);
            // Check if it's specifically the account.get() failing
            if (e.message && e.message.includes('missing scope')) {
                console.error('Session cookie was not persisted!');
            }
            const msg = handleError(e, 'AuthContext.login');
            throw new Error(msg);
        }
    };

    const signup = async (email: string, password: string, name: string, college: string): Promise<void> => {
        try {
            // 1. Create the account
            const newAcc = await account.create(ID.unique(), email, password, name);

            // 2. Create the session immediately so we have permission to write to the database
            await account.createEmailPasswordSession(email, password);

            // 3. Create the user document
            const adminEmails = getAdminEmails();
            const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'student';

            const userDoc = await databases.createDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                newAcc.$id,
                {
                    name,
                    // email omitted from schema
                    college: college,
                    points: 0,
                    level: 1,
                    badges: [],
                    streak: 0,
                    lastActiveDate: new Date().toISOString().split('T')[0],
                    role,
                }
            );

            setUser(mapDocToUser(userDoc, email));
        } catch (e) {
            const msg = handleError(e, 'AuthContext.signup');
            throw new Error(msg);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (e) {
            const msg = handleError(e, 'AuthContext.logout');
            throw new Error(msg);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const acc = await account.get();
            await fetchUserData(acc);
        } catch (e) {
            logError(e, 'AuthContext.refreshUser');
        }
    };

    // ---------------------------------------------------------------------
    // Profile update (name & college)
    // ---------------------------------------------------------------------
    const updateProfile = async (name: string, college: string): Promise<void> => {
        if (!user) throw new Error('User not logged in');
        try {
            await account.updateName(name);
            try {
                const updated = await databases.updateDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    user.$id,
                    { name, college: college }
                );
                setUser(mapDocToUser(updated, user.email));
            } catch (e: any) {
                if (e.code === 404) {
                    const created = await databases.createDocument(
                        DATABASE_ID,
                        USERS_COLLECTION_ID,
                        user.$id,
                        {
                            name,
                            // email omitted
                            college: college,
                            points: user.points || 0,
                            level: user.level || 1,
                            badges: user.badges || [],
                            streak: user.streak || 0,
                            lastActiveDate: user.lastActiveDate || new Date().toISOString().split('T')[0],
                            role: user.role || 'student',
                        }
                    );
                    setUser(mapDocToUser(created, user.email));
                } else {
                    throw e;
                }
            }
        } catch (e) {
            const msg = handleError(e, 'AuthContext.updateProfile');
            throw new Error(msg);
        }
    };

    // ---------------------------------------------------------------------
    // Generic user stats update (points, level, badges, streak, lastActiveDate, etc.)
    // ---------------------------------------------------------------------
    const updateUserStats = async (updates: Partial<User>): Promise<void> => {
        if (!user) throw new Error('User not logged in');
        const dbUpdates: any = { ...updates };
        if (updates.college) {
            dbUpdates.college = updates.college;
        }
        if (updates.lastActiveDate) {
            dbUpdates.lastActiveDate = updates.lastActiveDate;
        }
        if (updates.badges) {
            dbUpdates.badges = updates.badges;
        }
        // Ensure email never gets sent
        if (dbUpdates.email) delete dbUpdates.email;
        try {
            const updated = await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                user.$id,
                dbUpdates
            );
            setUser(mapDocToUser(updated, user.email));
        } catch (e: any) {
            if (e.code === 404) {
                const created = await databases.createDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    user.$id,
                    {
                        name: user.name || 'Eco Warrior',
                        // email omitted
                        college: user.college || 'Unknown College',
                        points: updates.points ?? user.points ?? 0,
                        level: updates.level ?? user.level ?? 1,
                        badges: dbUpdates.badges ?? user.badges ?? [],
                        streak: updates.streak ?? user.streak ?? 0,
                        lastActiveDate: updates.lastActiveDate ?? new Date().toISOString().split('T')[0],
                        role: user.role || 'student',
                    }
                );
                setUser(mapDocToUser(created, user.email));
            } else {
                const msg = handleError(e, 'AuthContext.updateUserStats');
                throw new Error(msg);
            }
        }
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
