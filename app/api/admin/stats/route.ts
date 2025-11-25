import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import { getAdminEmails } from "@/lib/admin-auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;

export async function GET(request: NextRequest) {
    try {
        let sessionClient;
        try {
            sessionClient = await createSessionClient();
        } catch (e) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        const { account, databases } = sessionClient;
        const accountData = await account.get();
        
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

        // Fetch all users
        const usersResponse = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.limit(1000)]
        );
        const users = usersResponse.documents;

        // Calculate stats
        const totalUsers = users.length;
        const totalPoints = users.reduce((sum: number, u: any) => sum + (u.points || 0), 0);
        const certificatesIssued = users.filter((u: any) => (u.points || 0) >= 1000).length;

        const today = new Date().toISOString().split('T')[0];
        const activeToday = users.filter((u: any) => u.lastActiveDate === today).length;

        // Fetch teams
        const teamsResponse = await databases.listDocuments(
            DATABASE_ID,
            TEAMS_COLLECTION_ID,
            [Query.limit(500)]
        );
        const totalTeams = teamsResponse.documents.length;

        // College-wise data
        const collegeMap = new Map<string, number>();
        users.forEach((u: any) => {
            const college = u.college || 'Unknown';
            collegeMap.set(college, (collegeMap.get(college) || 0) + 1);
        });
        const collegeData = Array.from(collegeMap.entries())
            .map(([name, count]) => ({ name: name.substring(0, 30), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Level distribution
        const levelMap = new Map<number, number>();
        users.forEach((u: any) => {
            const level = u.level || 1;
            levelMap.set(level, (levelMap.get(level) || 0) + 1);
        });
        const levelData = Array.from(levelMap.entries())
            .map(([level, count]) => ({ level: `Level ${level}`, count }))
            .sort((a, b) => parseInt(a.level.split(' ')[1]) - parseInt(b.level.split(' ')[1]))
            .slice(0, 15);

        return NextResponse.json({
            stats: {
                totalUsers,
                totalPoints,
                certificatesIssued,
                activeToday,
                totalTeams,
            },
            collegeData,
            levelData,
        });
    } catch (error: any) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
