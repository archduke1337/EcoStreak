import { NextRequest, NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/appwrite-server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function GET(request: NextRequest) {
    try {
        // Verify user is authenticated via session
        let accountData;
        try {
            const { account } = await createSessionClient();
            accountData = await account.get();
        } catch (e: any) {
            // No valid session
            return NextResponse.json({ user: null }, { status: 401 });
        }
        
        // Use admin client for database access (full permissions)
        const { databases } = await createAdminClient();
        
        // Get user document from database
        let userDoc;
        try {
            userDoc = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                accountData.$id
            );
        } catch (e: any) {
            if (e.code === 404) {
                // User document doesn't exist, return basic account info
                return NextResponse.json({
                    user: {
                        $id: accountData.$id,
                        email: accountData.email,
                        name: accountData.name || 'Eco Warrior',
                        college: 'Unknown College',
                        points: 0,
                        level: 1,
                        badges: [],
                        streak: 0,
                        lastActiveDate: new Date().toISOString().split('T')[0],
                        role: 'student',
                        teamId: undefined,
                        completedTasks: '[]',
                        $createdAt: new Date().toISOString(),
                    }
                });
            }
            throw e;
        }

        // Parse badges if stored as string
        let badges = userDoc.badges || [];
        if (typeof badges === 'string') {
            try {
                badges = JSON.parse(badges);
            } catch {
                badges = [];
            }
        }

        return NextResponse.json({
            user: {
                $id: userDoc.$id,
                email: accountData.email,
                name: userDoc.name,
                college: userDoc.college || 'Unknown College',
                points: userDoc.points || 0,
                level: userDoc.level || 1,
                badges,
                streak: userDoc.streak || 0,
                lastActiveDate: userDoc.lastActiveDate || new Date().toISOString().split('T')[0],
                role: userDoc.role || 'student',
                teamId: userDoc.teamId || undefined,
                completedTasks: userDoc.completedTasks || '[]',
                $createdAt: userDoc.$createdAt || new Date().toISOString(),
            }
        });
    } catch (error: any) {
        console.error('Auth me error:', error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
