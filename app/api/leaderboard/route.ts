import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Client, Databases, Query } from 'node-appwrite';
import { SESSION_COOKIE } from '@/lib/auth-constants';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, DATABASE_ID, USERS_COLLECTION_ID, TEAMS_COLLECTION_ID } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'global';
        const college = searchParams.get('college') || '';

        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE);

        if (!sessionCookie?.value) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const client = new Client()
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)
            .setSession(sessionCookie.value);

        const databases = new Databases(client);

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
