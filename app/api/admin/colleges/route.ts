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
        console.log('[admin/colleges] Session cookie exists:', !!sessionCookie?.value);
        
        // Verify user is authenticated via session
        let accountData;
        try {
            const sessionClient = await createSessionClient();
            accountData = await sessionClient.account.get();
            console.log('[admin/colleges] Auth successful');
        } catch (e: any) {
            console.error('[admin/colleges] Auth failed:', e.message);
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
            [Query.limit(1000)]
        );
        const users = response.documents;

        // Group by college
        const collegeMap = new Map<string, { users: number; totalPoints: number }>();

        users.forEach((u: any) => {
            const college = u.college || 'Unknown';
            const current = collegeMap.get(college) || { users: 0, totalPoints: 0 };
            current.users += 1;
            current.totalPoints += (u.points || 0);
            collegeMap.set(college, current);
        });

        // Calculate averages and sort
        const collegeStats = Array.from(collegeMap.entries())
            .map(([college, data]) => ({
                college,
                users: data.users,
                totalPoints: data.totalPoints,
                avgPoints: Math.round(data.totalPoints / data.users),
            }))
            .sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json({ collegeStats });
    } catch (error: any) {
        console.error('Admin colleges error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
