import { NextRequest, NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/appwrite-server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { Query } from "node-appwrite";
import { getAdminEmails } from "@/lib/admin-auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function GET(request: NextRequest) {
    try {
        // Debug: Check for session cookie
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE);
        console.log('[admin/users] Session cookie exists:', !!sessionCookie?.value);
        
        // Verify user is authenticated via session
        let accountData;
        try {
            const sessionClient = await createSessionClient();
            accountData = await sessionClient.account.get();
            console.log('[admin/users] Auth successful');
        } catch (e: any) {
            console.error('[admin/users] Auth failed:', e.message);
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        // Use admin client for database operations (full access)
        const { databases } = await createAdminClient();
        
        // Check if user is admin by email
        const adminEmails = getAdminEmails();
        const isAdminByEmail = adminEmails.includes(accountData.email.toLowerCase());
        
        // Also check user's role in database
        let isAdminByRole = false;
        try {
            const userDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, accountData.$id);
            isAdminByRole = userDoc.role === 'admin';
        } catch (e) {
            // User doc might not exist yet
        }
        
        if (!isAdminByEmail && !isAdminByRole) {
            return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
        }

        // Fetch all users using admin client
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.limit(1000), Query.orderDesc('points')]
        );

        // Map user documents (email is now stored in collection)
        const users = response.documents.map((doc: any) => {
            // Parse badges if stored as string
            let badges = doc.badges || [];
            if (typeof badges === 'string') {
                try {
                    badges = JSON.parse(badges);
                } catch {
                    badges = [];
                }
            }
            return {
                $id: doc.$id,
                name: doc.name,
                email: doc.email || 'N/A',
                college: doc.college || 'Unknown',
                points: doc.points || 0,
                level: doc.level || 1,
                badges,
                streak: doc.streak || 0,
                lastActiveDate: doc.lastActiveDate,
                role: doc.role || 'student',
            };
        });

        return NextResponse.json({ users });
    } catch (error: any) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
