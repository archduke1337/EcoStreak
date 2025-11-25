import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function POST(request: NextRequest) {
    try {
        const updates = await request.json();
        
        const { account, databases } = await createSessionClient();
        const accountData = await account.get();
        
        // Remove email from updates if present
        if (updates.email) delete updates.email;
        
        // Update user document
        await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            accountData.$id,
            updates
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
