import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function POST(request: NextRequest) {
    try {
        const updates = await request.json();
        
        let sessionClient;
        try {
            sessionClient = await createSessionClient();
        } catch (e) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        const { account, databases } = sessionClient;
        const accountData = await account.get();
        
        // Remove email from updates if present (can't change email this way)
        if (updates.email) delete updates.email;
        if (updates.$id) delete updates.$id;
        if (updates.$createdAt) delete updates.$createdAt;
        
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
