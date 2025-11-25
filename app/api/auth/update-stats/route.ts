import { NextRequest, NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

// Define allowed attributes that exist in the Users collection
const ALLOWED_ATTRIBUTES = [
    'name',
    'college', 
    'points',
    'level',
    'badges',
    'streak',
    'lastActiveDate',
    'role',
    'teamId',
    'completedTasks',
];

export async function POST(request: NextRequest) {
    try {
        const updates = await request.json();
        
        // Verify user is authenticated via session
        let accountData;
        try {
            const { account } = await createSessionClient();
            accountData = await account.get();
        } catch (e) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        // Use admin client for database operations
        const { databases } = await createAdminClient();
        
        // Filter updates to only include allowed attributes
        const filteredUpdates: Record<string, any> = {};
        for (const key of ALLOWED_ATTRIBUTES) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }
        
        if (Object.keys(filteredUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }
        
        // Update user document
        await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            accountData.$id,
            filteredUpdates
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update stats error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update stats' },
            { status: 500 }
        );
    }
}
