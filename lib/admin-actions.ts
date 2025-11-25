"use server";

import { createAdminClient } from "./appwrite-server";
import { Query } from "node-appwrite";
import { ADMIN_EMAILS } from "./admin-auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;

export async function fetchAdminStats(userEmail: string) {
    try {
        // Verify user is admin
        if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
            throw new Error("Unauthorized - Admin access required");
        }

        const { databases } = await createAdminClient();

        // Fetch all users
        const usersResponse = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.limit(1000)]
        );
        const users = usersResponse.documents;

        // Calculate stats
        const totalUsers = users.length;
        const totalPoints = users.reduce((sum: number, user: any) => sum + (user.points || 0), 0);
        const certificatesIssued = users.filter((user: any) => user.points >= 1000).length;
        
        const today = new Date().toLocaleDateString('en-CA');
        const activeToday = users.filter((user: any) => user.lastActiveDate === today).length;

        // Fetch teams
        const teamsResponse = await databases.listDocuments(
            DATABASE_ID,
            TEAMS_COLLECTION_ID,
            [Query.limit(1000)]
        );
        const totalTeams = teamsResponse.documents.length;

        // College data
        const collegeMap = new Map<string, number>();
        users.forEach((user: any) => {
            const college = user.college || "Unknown";
            collegeMap.set(college, (collegeMap.get(college) || 0) + 1);
        });
        const collegeData = Array.from(collegeMap.entries()).map(([name, count]) => ({
            name,
            count,
        }));

        // Level data
        const levelMap = new Map<number, number>();
        users.forEach((user: any) => {
            const level = user.level || 1;
            levelMap.set(level, (levelMap.get(level) || 0) + 1);
        });
        const levelData = Array.from(levelMap.entries())
            .map(([level, count]) => ({
                level: `Level ${level}`,
                count,
            }))
            .sort((a, b) => parseInt(a.level) - parseInt(b.level));

        return {
            success: true,
            stats: {
                totalUsers,
                totalPoints,
                certificatesIssued,
                activeToday,
                totalTeams,
            },
            collegeData,
            levelData,
        };
    } catch (error: any) {
        console.error('Admin stats error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch admin stats',
        };
    }
}
