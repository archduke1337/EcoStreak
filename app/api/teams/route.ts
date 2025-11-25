import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { SESSION_COOKIE } from '@/lib/auth-constants';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;

// GET - Fetch team info
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get('teamId');

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

        if (!teamId) {
            return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
        }

        const teamDoc = await databases.getDocument(
            DATABASE_ID,
            TEAMS_COLLECTION_ID,
            teamId
        );

        // Fetch team members
        const membersResponse = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('teamId', teamId)]
        );

        const members = membersResponse.documents.map((doc: any) => ({
            $id: doc.$id,
            name: doc.name,
            college: doc.college || 'Unknown',
            points: doc.points || 0,
            level: doc.level || 1,
        }));

        return NextResponse.json({
            team: {
                $id: teamDoc.$id,
                teamName: teamDoc.teamName,
                teamCode: teamDoc.teamCode,
                leaderId: teamDoc.leaderId,
                totalPoints: teamDoc.totalPoints || 0,
                members: teamDoc.members || [],
            },
            members,
        });
    } catch (error: any) {
        console.error('Teams GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or join team
export async function POST(request: Request) {
    try {
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
        const body = await request.json();
        const { action, teamName, teamCode, userId, userPoints } = body;

        if (action === 'create') {
            if (!teamName || !userId) {
                return NextResponse.json({ error: 'Team name and user ID required' }, { status: 400 });
            }

            // Generate team code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Create team
            const team = await databases.createDocument(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                ID.unique(),
                {
                    teamName,
                    teamCode: code,
                    leaderId: userId,
                    members: [userId],
                    totalPoints: userPoints || 0,
                }
            );

            // Update user with team ID
            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                { teamId: team.$id }
            );

            return NextResponse.json({
                team: {
                    $id: team.$id,
                    teamName: team.teamName,
                    teamCode: team.teamCode,
                    leaderId: team.leaderId,
                    totalPoints: team.totalPoints,
                    members: team.members,
                },
            });
        }

        if (action === 'join') {
            if (!teamCode || !userId) {
                return NextResponse.json({ error: 'Team code and user ID required' }, { status: 400 });
            }

            // Find team by code
            const teamsResponse = await databases.listDocuments(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                [Query.equal('teamCode', teamCode.toUpperCase())]
            );

            if (teamsResponse.documents.length === 0) {
                return NextResponse.json({ error: 'Invalid team code' }, { status: 404 });
            }

            const team = teamsResponse.documents[0];

            // Check if already a member
            if (team.members && team.members.includes(userId)) {
                return NextResponse.json({ error: 'Already a member of this team' }, { status: 400 });
            }

            // Update team members
            await databases.updateDocument(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                team.$id,
                {
                    members: [...(team.members || []), userId],
                    totalPoints: (team.totalPoints || 0) + (userPoints || 0),
                }
            );

            // Update user with team ID
            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                { teamId: team.$id }
            );

            return NextResponse.json({
                team: {
                    $id: team.$id,
                    teamName: team.teamName,
                    teamCode: team.teamCode,
                    leaderId: team.leaderId,
                    totalPoints: (team.totalPoints || 0) + (userPoints || 0),
                    members: [...(team.members || []), userId],
                },
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Teams POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
