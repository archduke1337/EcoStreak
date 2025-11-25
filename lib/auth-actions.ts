"use server";

import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { createAdminClient } from "./appwrite-server";
import { SESSION_COOKIE } from "./auth-constants";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function signUpWithEmail(formData: {
    email: string;
    password: string;
    name: string;
    college: string;
}) {
    const { email, password, name, college } = formData;

    try {
        const { account: adminAccount, databases } = await createAdminClient();

        // 1. Create the user account using admin client
        const newUser = await adminAccount.create(ID.unique(), email, password, name);

        // 2. Create user document in database FIRST (before session)
        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            newUser.$id,
            {
                name,
                email,
                college,
                points: 0,
                level: 1,
                badges: "[]",
                streak: 0,
                lastActiveDate: new Date().toISOString().split("T")[0],
                role: "student",
            }
        );

        // 3. Create a session using a separate client (no API key)
        const { Client, Account } = await import("node-appwrite");
        const sessionClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
        
        const sessionAccount = new Account(sessionClient);
        const session = await sessionAccount.createEmailPasswordSession(email, password);

        // 4. Set session cookie (first-party cookie on your domain)
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(session.expire),
        });

        // Return user data directly
        const userData = {
            $id: newUser.$id,
            email,
            name,
            college,
            points: 0,
            level: 1,
            badges: [],
            streak: 0,
            lastActiveDate: new Date().toISOString().split("T")[0],
            role: "student",
        };

        return { success: true, userId: newUser.$id, user: userData };
    } catch (error: any) {
        console.error("Signup error:", error);
        return { 
            success: false, 
            error: error.message || "Failed to create account" 
        };
    }
}

export async function signInWithEmail(formData: {
    email: string;
    password: string;
}) {
    const { email, password } = formData;

    try {
        // Create session using a client without API key
        const { Client, Account } = await import("node-appwrite");
        const sessionClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
        
        const sessionAccount = new Account(sessionClient);
        console.log('[Login] Creating session for:', email);
        const session = await sessionAccount.createEmailPasswordSession(email, password);
        console.log('[Login] Session created, expires:', session.expire);

        // Set session cookie (first-party cookie on your domain)
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(session.expire),
        });
        console.log('[Login] Cookie set successfully');

        // Fetch user data from database using admin client
        const { databases } = await createAdminClient();
        let userData = null;
        try {
            const userDoc = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                session.userId
            );
            
            // Parse badges
            let badges = userDoc.badges || [];
            if (typeof badges === 'string') {
                try { badges = JSON.parse(badges); } catch { badges = []; }
            }
            
            userData = {
                $id: userDoc.$id,
                email: email,
                name: userDoc.name,
                college: userDoc.college || 'Unknown College',
                points: userDoc.points || 0,
                level: userDoc.level || 1,
                badges,
                streak: userDoc.streak || 0,
                lastActiveDate: userDoc.lastActiveDate || new Date().toISOString().split('T')[0],
                role: userDoc.role || 'student',
            };
        } catch (e) {
            console.log('[Login] User doc not found, using basic data');
        }

        return { success: true, userId: session.userId, user: userData };
    } catch (error: any) {
        console.error("Login error:", error);
        
        if (error.code === 401) {
            return { success: false, error: "Invalid email or password" };
        }
        
        return { 
            success: false, 
            error: error.message || "Failed to sign in" 
        };
    }
}

export async function signOut() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE);
        return { success: true };
    } catch (error: any) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}
