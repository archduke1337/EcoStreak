import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import { getAdminEmails } from "@/lib/admin-auth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

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
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.limit(1000), Query.orderDesc('points')]
        );

        // Add email to each user from their account (email is not stored in collection)
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
                email: doc.email || `user_${doc.$id}@ecostreak.app`, // Placeholder since email not in collection
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
