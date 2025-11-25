'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardBody, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
    $id: string;
    name: string;
    college: string;
    points: number;
    level: number;
    streak: number;
}

interface LeaderboardTeam {
    $id: string;
    name: string;
    description: string;
    totalPoints: number;
    memberCount: number;
}

export default function LeaderboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [globalUsers, setGlobalUsers] = useState<LeaderboardUser[]>([]);
    const [collegeUsers, setCollegeUsers] = useState<LeaderboardUser[]>([]);
    const [teams, setTeams] = useState<LeaderboardTeam[]>([]);
    const [activeTab, setActiveTab] = useState('global');
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaderboards = useCallback(async () => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            // Fetch all leaderboards in parallel
            const [globalRes, collegeRes, teamsRes] = await Promise.all([
                fetch('/api/leaderboard?type=global'),
                fetch(`/api/leaderboard?type=college&college=${encodeURIComponent(user.college)}`),
                fetch('/api/leaderboard?type=teams'),
            ]);

            if (globalRes.ok) {
                const data = await globalRes.json();
                setGlobalUsers(data.users || []);
            }

            if (collegeRes.ok) {
                const data = await collegeRes.json();
                setCollegeUsers(data.users || []);
            }

            if (teamsRes.ok) {
                const data = await teamsRes.json();
                setTeams(data.teams || []);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboards:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchLeaderboards();
        }
    }, [user, loading, router, fetchLeaderboards]);

    // Refresh leaderboards every 30 seconds
    useEffect(() => {
        if (!user) return;
        
        const interval = setInterval(() => {
            fetchLeaderboards();
        }, 30000);

        return () => clearInterval(interval);
    }, [user, fetchLeaderboards]);

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

                {isLoading ? (
                    <Card>
                        <CardBody className="flex items-center justify-center py-12">
                            <Spinner size="lg" color="success" />
                            <p className="mt-4 text-gray-600">Loading leaderboards...</p>
                        </CardBody>
                    </Card>
                ) : (
                    <>
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
                                        <TableBody emptyContent="No users found">
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
                                        <TableBody emptyContent="No users found from your college">
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
                                        <TableBody emptyContent="No teams found">
                                            {teams.map((team, index) => (
                                                <TableRow
                                                    key={team.$id}
                                                    className={team.$id === user.teamId ? 'bg-green-100 dark:bg-green-900' : ''}
                                                >
                                                    <TableCell>
                                                        <span className="text-xl font-bold">{getMedal(index + 1)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold">{team.name}</span>
                                                        {team.$id === user.teamId && (
                                                            <span className="text-green-600 ml-2">(Your Team)</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{team.memberCount}</TableCell>
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
                    </>
                )}

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    🔄 Leaderboards refresh every 30 seconds
                </p>
            </div>
        </div>
    );
}
