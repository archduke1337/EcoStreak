'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardBody, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, TEAMS_COLLECTION_ID, Query } from '@/lib/appwrite';
import { User, Team } from '@/types';
import { motion } from 'framer-motion';
import client from '@/lib/appwrite';
import { logError } from '@/lib/error-handler';

export default function LeaderboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [globalUsers, setGlobalUsers] = useState<User[]>([]);
    const [collegeUsers, setCollegeUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [activeTab, setActiveTab] = useState('global');

    const fetchLeaderboards = useCallback(async () => {
        try {
            // Global leaderboard
            const globalResponse = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.orderDesc('points'), Query.limit(100)]
            );
            setGlobalUsers(globalResponse.documents as unknown as User[]);

            // College leaderboard
            if (user) {
                const collegeResponse = await databases.listDocuments(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    [Query.equal('college', user.college), Query.orderDesc('points'), Query.limit(50)]
                );
                setCollegeUsers(collegeResponse.documents as unknown as User[]);
            }

            // Team leaderboard
            const teamsResponse = await databases.listDocuments(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                [Query.orderDesc('totalPoints'), Query.limit(50)]
            );
            setTeams(teamsResponse.documents as unknown as Team[]);
        } catch (error) {
            logError(error, 'LeaderboardPage.fetchLeaderboards');
        }
    }, [user]);

    const subscribeToUpdates = useCallback(() => {
        // Subscribe to real-time updates
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${USERS_COLLECTION_ID}.documents`,
            () => {
                fetchLeaderboards();
            }
        );

        return () => {
            unsubscribe();
        };
    }, [fetchLeaderboards]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchLeaderboards();
            subscribeToUpdates();
        }
    }, [user, loading, router, fetchLeaderboards, subscribeToUpdates]);

    if (loading || !user) return null;

    const getMedal = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Compete with students across India and your college
                    </p>
                </motion.div>

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    size="lg"
                    color="success"
                    className="mb-6"
                >
                    <Tab key="global" title="🌍 Global" />
                    <Tab key="college" title="🎓 My College" />
                    <Tab key="teams" title="👥 Teams" />
                </Tabs>

                {/* Global Leaderboard */}
                {activeTab === 'global' && (
                    <Card>
                        <CardBody>
                            <Table aria-label="Global Leaderboard">
                                <TableHeader>
                                    <TableColumn>RANK</TableColumn>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>COLLEGE</TableColumn>
                                    <TableColumn>POINTS</TableColumn>
                                    <TableColumn>LEVEL</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {globalUsers.map((u, index) => (
                                        <TableRow
                                            key={u.$id}
                                            className={u.$id === user.$id ? 'bg-green-100 dark:bg-green-900' : ''}
                                        >
                                            <TableCell>
                                                <span className="text-xl font-bold">{getMedal(index + 1)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold">{u.name}</span>
                                                {u.$id === user.$id && <span className="text-green-600 ml-2">(You)</span>}
                                            </TableCell>
                                            <TableCell>{u.college}</TableCell>
                                            <TableCell>
                                                <span className="font-bold text-green-600">{u.points}</span>
                                            </TableCell>
                                            <TableCell>Level {u.level}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                )}

                {/* College Leaderboard */}
                {activeTab === 'college' && (
                    <Card>
                        <CardBody>
                            <h3 className="text-xl font-bold mb-4">{user.college}</h3>
                            <Table aria-label="College Leaderboard">
                                <TableHeader>
                                    <TableColumn>RANK</TableColumn>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>POINTS</TableColumn>
                                    <TableColumn>LEVEL</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {collegeUsers.map((u, index) => (
                                        <TableRow
                                            key={u.$id}
                                            className={u.$id === user.$id ? 'bg-green-100 dark:bg-green-900' : ''}
                                        >
                                            <TableCell>
                                                <span className="text-xl font-bold">{getMedal(index + 1)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold">{u.name}</span>
                                                {u.$id === user.$id && <span className="text-green-600 ml-2">(You)</span>}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-green-600">{u.points}</span>
                                            </TableCell>
                                            <TableCell>Level {u.level}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                )}

                {/* Team Leaderboard */}
                {activeTab === 'teams' && (
                    <Card>
                        <CardBody>
                            <Table aria-label="Team Leaderboard">
                                <TableHeader>
                                    <TableColumn>RANK</TableColumn>
                                    <TableColumn>TEAM NAME</TableColumn>
                                    <TableColumn>MEMBERS</TableColumn>
                                    <TableColumn>TOTAL POINTS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {teams.map((team, index) => (
                                        <TableRow
                                            key={team.$id}
                                            className={team.$id === user.teamId ? 'bg-green-100 dark:bg-green-900' : ''}
                                        >
                                            <TableCell>
                                                <span className="text-xl font-bold">{getMedal(index + 1)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold">{team.teamName}</span>
                                                {team.$id === user.teamId && (
                                                    <span className="text-green-600 ml-2">(Your Team)</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{team.members.length}</TableCell>
                                            <TableCell>
                                                <span className="font-bold text-green-600">{team.totalPoints}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                )}

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    🔄 Leaderboards update in real-time
                </p>
            </div>
        </div>
    );
}
