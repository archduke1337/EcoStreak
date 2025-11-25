import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import { getAdminEmails } from "@/lib/admin-auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function GET(request: NextRequest) {
    try {
        const { account, databases } = await createSessionClient();
        const accountData = await account.get();
        
        // Check if user is admin
        const adminEmails = getAdminEmails();
        if (!adminEmails.includes(accountData.email.toLowerCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Fetch all users
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
