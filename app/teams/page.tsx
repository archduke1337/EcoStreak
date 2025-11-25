'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardBody, Button, Input, Divider, Chip, Spinner } from '@nextui-org/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TeamMember {
    $id: string;
    name: string;
    college: string;
    points: number;
    level: number;
}

interface Team {
    $id: string;
    teamName: string;
    teamCode: string;
    leaderId: string;
    totalPoints: number;
    members: string[];
}

export default function TeamsPage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [teamName, setTeamName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [myTeam, setMyTeam] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [joiningTeam, setJoiningTeam] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeam = useCallback(async () => {
        if (!user?.teamId) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/teams?teamId=${user.teamId}`);
            if (res.ok) {
                const data = await res.json();
                setMyTeam(data.team);
                setTeamMembers(data.members || []);
            }
        } catch (error) {
            console.error('Failed to fetch team:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.teamId]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchTeam();
        }
    }, [user, loading, router, fetchTeam]);

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            toast.error('Please enter a team name');
            return;
        }

        setCreatingTeam(true);

        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    teamName,
                    userId: user!.$id,
                    userPoints: user!.points,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to create team');
                return;
            }

            toast.success(`Team created! Share code: ${data.team.teamCode}`);
            setMyTeam(data.team);
            await refreshUser();
        } catch (error) {
            console.error('Failed to create team:', error);
            toast.error('Failed to create team');
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
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'join',
                    teamCode: joinCode,
                    userId: user!.$id,
                    userPoints: user!.points,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to join team');
                return;
            }

            toast.success(`Joined team: ${data.team.teamName}!`);
            setMyTeam(data.team);
            await refreshUser();
        } catch (error) {
            console.error('Failed to join team:', error);
            toast.error('Failed to join team');
        } finally {
            setJoiningTeam(false);
        }
    };

    if (loading || !user) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="container mx-auto px-4 py-8 flex items-center justify-center">
                    <Spinner size="lg" color="success" />
                </div>
            </div>
        );
    }

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
