import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";
import { Databases } from "node-appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function GET(request: NextRequest) {
    try {
        const { account, databases } = await createSessionClient();
        
        // Get account info
        const accountData = await account.get();
        
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
            }
        });
    } catch (error: any) {
        // No valid session
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
