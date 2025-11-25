'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardBody, Button, Input, Divider, Chip } from '@nextui-org/react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, TEAMS_COLLECTION_ID, ID, Query } from '@/lib/appwrite';
import { Team, User } from '@/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { logError, handleError } from '@/lib/error-handler';

export default function TeamsPage() {
    const { user, loading, refreshUser, updateUserStats } = useAuth();
    const router = useRouter();
    const [teamName, setTeamName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [myTeam, setMyTeam] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [joiningTeam, setJoiningTeam] = useState(false);

    const fetchTeam = useCallback(async () => {
        if (!user?.teamId) return;

        try {
            const teamDoc = await databases.getDocument(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                user.teamId
            );
            setMyTeam(teamDoc as unknown as Team);

            // Fetch team members
            const membersResponse = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal('teamId', user.teamId)]
            );
            setTeamMembers(membersResponse.documents as unknown as User[]);
        } catch (error) {
            logError(error, 'TeamsPage.fetchTeam');
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user && user.teamId) {
            fetchTeam();
        }
    }, [user, loading, router, fetchTeam]);

    const generateTeamCode = (): string => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            toast.error('Please enter a team name');
            return;
        }

        setCreatingTeam(true);

        try {
            const code = generateTeamCode();

            // Create team
            const team = await databases.createDocument(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                ID.unique(),
                {
                    teamName,
                    teamCode: code,
                    leaderId: user!.$id,
                    members: [user!.$id],
                    totalPoints: user!.points,
                }
            );

            // Update user with team ID
            await updateUserStats({
                teamId: team.$id
            });

            // await refreshUser(); // updateUserStats updates local user
            toast.success(`Team created! Share code: ${code}`);
            setMyTeam(team as unknown as Team);
        } catch (error) {
            toast.error(handleError(error, 'TeamsPage.handleCreateTeam'));
        } finally {
            setCreatingTeam(false);
        }
    };

    const handleJoinTeam = async () => {
        if (!joinCode.trim()) {
            toast.error('Please enter a team code');
            return;
        }

        setJoiningTeam(true);

        try {
            // Find team by code
            const teamsResponse = await databases.listDocuments(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                [Query.equal('teamCode', joinCode.toUpperCase())]
            );

            if (teamsResponse.documents.length === 0) {
                toast.error('Invalid team code');
                return;
            }

            const team = teamsResponse.documents[0] as unknown as Team;

            // Update team members
            await databases.updateDocument(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                team.$id,
                {
                    members: [...team.members, user!.$id],
                    totalPoints: team.totalPoints + user!.points,
                }
            );

            // Update user with team ID
            await updateUserStats({
                teamId: team.$id
            });

            // await refreshUser(); // updateUserStats updates local user
            toast.success(`Joined team: ${team.teamName}!`);
            setMyTeam(team);
        } catch (error) {
            toast.error(handleError(error, 'TeamsPage.handleJoinTeam'));
        } finally {
            setJoiningTeam(false);
        }
    };

    if (loading || !user) return null;

    // If user has a team
    if (myTeam || user.teamId) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold mb-2">👥 Your Team</h1>
                    </motion.div>

                    <Card>
                        <CardBody className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold">{myTeam?.teamName}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Team Code: <Chip color="success" variant="flat">{myTeam?.teamCode}</Chip>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-bold text-green-600">{myTeam?.totalPoints || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                                </div>
                            </div>

                            <Divider className="my-6" />

                            <h3 className="text-xl font-bold mb-4">Team Members ({teamMembers.length})</h3>
                            <div className="space-y-3">
                                {teamMembers.map((member) => (
                                    <div
                                        key={member.$id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {member.name}
                                                {member.$id === myTeam?.leaderId && (
                                                    <Chip size="sm" color="warning" className="ml-2">Leader</Chip>
                                                )}
                                                {member.$id === user.$id && (
                                                    <span className="text-green-600 ml-2">(You)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.college}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">{member.points} pts</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Level {member.level}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-2">📢 Invite Friends:</p>
                                <p className="text-sm">Share your team code <strong>{myTeam?.teamCode}</strong> with friends to join!</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    // If user doesn't have a team
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold mb-2">👥 Teams</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create or join a team to collaborate and compete together!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Create Team */}
                    <Card>
                        <CardBody className="p-8">
                            <div className="text-center mb-6">
                                <div className="text-5xl mb-3">🎨</div>
                                <h3 className="text-2xl font-bold">Create Team</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Start your own team and invite friends
                                </p>
                            </div>

                            <Input
                                label="Team Name"
                                placeholder="Enter your team name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                size="lg"
                                className="mb-4"
                            />

                            <Button
                                color="success"
                                size="lg"
                                onPress={handleCreateTeam}
                                isLoading={creatingTeam}
                                className="w-full"
                            >
                                Create Team
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Join Team */}
                    <Card>
                        <CardBody className="p-8">
                            <div className="text-center mb-6">
                                <div className="text-5xl mb-3">🔗</div>
                                <h3 className="text-2xl font-bold">Join Team</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Enter a team code to join an existing team
                                </p>
                            </div>

                            <Input
                                label="Team Code"
                                placeholder="Enter 6-character code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                size="lg"
                                className="mb-4"
                            />

                            <Button
                                color="primary"
                                size="lg"
                                onPress={handleJoinTeam}
                                isLoading={joiningTeam}
                                className="w-full"
                            >
                                Join Team
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
