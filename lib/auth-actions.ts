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
        const { account, databases } = await createAdminClient();

        // 1. Create the user account
        const newUser = await account.create(ID.unique(), email, password, name);

        // 2. Create a session
        const session = await account.createEmailPasswordSession(email, password);

        // 3. Set session cookie (first-party cookie on your domain)
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            expires: new Date(session.expire),
        });

        // 4. Create user document in database
        const userDoc = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            newUser.$id,
            {
                name,
                college,
                points: 0,
                level: 1,
                badges: "[]",
                streak: 0,
                lastActiveDate: new Date().toISOString().split("T")[0],
                role: "student",
            }
        );

        return { success: true, userId: newUser.$id };
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
        const { account } = await createAdminClient();

        // Create session
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie (first-party cookie on your domain)
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            expires: new Date(session.expire),
        });

        return { success: true, userId: session.userId };
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
