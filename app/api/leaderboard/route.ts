import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { createSessionClient, createAdminClient } from '@/lib/appwrite-server';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'global';
        const college = searchParams.get('college') || '';

        // Verify user is authenticated via session
        try {
            const { account } = await createSessionClient();
            await account.get();
        } catch (e) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Use admin client for database operations
        const { databases } = await createAdminClient();

        if (type === 'global') {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.orderDesc('points'), Query.limit(100)]
            );

            const users = response.documents.map((doc: any) => ({
                $id: doc.$id,
                name: doc.name,
                college: doc.college || 'Unknown',
                points: doc.points || 0,
                level: doc.level || 1,
                streak: doc.streak || 0,
            }));

            return NextResponse.json({ users });
        }

        if (type === 'college' && college) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal('college', college), Query.orderDesc('points'), Query.limit(50)]
            );

            const users = response.documents.map((doc: any) => ({
                $id: doc.$id,
                name: doc.name,
                college: doc.college || 'Unknown',
                points: doc.points || 0,
                level: doc.level || 1,
                streak: doc.streak || 0,
            }));

            return NextResponse.json({ users });
        }

        if (type === 'teams') {
            const response = await databases.listDocuments(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                [Query.orderDesc('totalPoints'), Query.limit(50)]
            );

            const teams = response.documents.map((doc: any) => ({
                $id: doc.$id,
                name: doc.teamName,
                teamCode: doc.teamCode,
                totalPoints: doc.totalPoints || 0,
                memberCount: doc.members?.length || 0,
            }));

            return NextResponse.json({ teams });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error: any) {
        console.error('Leaderboard API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
