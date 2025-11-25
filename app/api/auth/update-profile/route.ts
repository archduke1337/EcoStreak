import { NextRequest, NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function POST(request: NextRequest) {
    try {
        const { name, college } = await request.json();
        
        // Verify user is authenticated via session
        let accountData;
        try {
            const { account } = await createSessionClient();
            accountData = await account.get();
            // Update account name using session client
            await account.updateName(name);
        } catch (e) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        // Use admin client for database operations
        const { databases } = await createAdminClient();
        
        // Update user document
        await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            accountData.$id,
            { name, college }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: 500 }
        );
    }
}
