'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import Navbar from '@/components/Navbar';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, TEAMS_COLLECTION_ID, Query } from '@/lib/appwrite';
import { User, Team } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { logError } from '@/lib/error-handler';

interface CollegeData {
    name: string;
    count: number;
}

interface LevelData {
    level: string;
    count: number;
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPoints: 0,
        certificatesIssued: 0,
        activeToday: 0,
        totalTeams: 0,
    });
    const [collegeData, setCollegeData] = useState<CollegeData[]>([]);
    const [levelData, setLevelData] = useState<LevelData[]>([]);

    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push('/dashboard');
        } else if (user && isAdmin(user)) {
            fetchAdminData();
        }
    }, [user, loading, router]);

    const fetchAdminData = async () => {
        try {
            // Fetch all users
            const usersResponse = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.limit(1000)]
            );
            const users = usersResponse.documents as unknown as User[];

            // Calculate stats
            const totalUsers = users.length;
            const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
            const certificatesIssued = users.filter(u => u.points >= 1000).length;

            const today = new Date().toISOString().split('T')[0];
            const activeToday = users.filter(u => u.lastActiveDate === today).length;

            // Fetch teams
            const teamsResponse = await databases.listDocuments(
                DATABASE_ID,
                TEAMS_COLLECTION_ID,
                [Query.limit(500)]
            );
            const totalTeams = teamsResponse.documents.length;

            setStats({
                totalUsers,
                totalPoints,
                certificatesIssued,
                activeToday,
                totalTeams,
            });

            // College-wise data
            const collegeMap = new Map<string, number>();
            users.forEach(u => {
                collegeMap.set(u.college, (collegeMap.get(u.college) || 0) + 1);
            });
            const topColleges = Array.from(collegeMap.entries())
                .map(([name, count]) => ({ name: name.substring(0, 30), count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            setCollegeData(topColleges);

            // Level distribution
            const levelMap = new Map<number, number>();
            users.forEach(u => {
                levelMap.set(u.level, (levelMap.get(u.level) || 0) + 1);
            });
            const levels = Array.from(levelMap.entries())
                .map(([level, count]) => ({ level: `Level ${level}`, count }))
                .sort((a, b) => parseInt(a.level.split(' ')[1]) - parseInt(b.level.split(' ')[1]))
                .slice(0, 15);
            setLevelData(levels);

        } catch (error) {
            logError(error, 'AdminPage.fetchAdminData');
        }
    };

    if (loading || !user || !isAdmin(user)) return null;

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">🔑 Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor platform analytics and user engagement
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardBody className="text-center p-6">
                            <p className="text-4xl mb-2">👥</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="text-center p-6">
                            <p className="text-4xl mb-2">⭐</p>
                            <p className="text-3xl font-bold text-green-600">{stats.totalPoints.toLocaleString()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="text-center p-6">
                            <p className="text-4xl mb-2">🎓</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.certificatesIssued}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Certificates</p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="text-center p-6">
                            <p className="text-4xl mb-2">🟢</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.activeToday}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Today</p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="text-center p-6">
                            <p className="text-4xl mb-2">👥</p>
                            <p className="text-3xl font-bold text-pink-600">{stats.totalTeams}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Teams</p>
                        </CardBody>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link href="/admin/users">
                        <Card className="cursor-pointer hover:scale-105 transition-transform">
                            <CardBody className="p-6 flex flex-row items-center gap-4">
                                <span className="text-5xl">👤</span>
                                <div>
                                    <h3 className="text-2xl font-bold">User Management</h3>
                                    <p className="text-gray-600 dark:text-gray-400">View and manage all users</p>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>

                    <Link href="/admin/colleges">
                        <Card className="cursor-pointer hover:scale-105 transition-transform">
                            <CardBody className="p-6 flex flex-row items-center gap-4">
                                <span className="text-5xl">🏫</span>
                                <div>
                                    <h3 className="text-2xl font-bold">College Analytics</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Institution-wise performance</p>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* College Participation */}
                    <Card>
                        <CardHeader className="bg-green-100 dark:bg-green-900">
                            <h3 className="text-xl font-bold">Top 10 Colleges by Users</h3>
                        </CardHeader>
                        <CardBody className="p-6 overflow-x-auto">
                            <BarChart width={500} height={300} data={collegeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </CardBody>
                    </Card>

                    {/* Level Distribution */}
                    <Card>
                        <CardHeader className="bg-blue-100 dark:bg-blue-900">
                            <h3 className="text-xl font-bold">User Level Distribution</h3>
                        </CardHeader>
                        <CardBody className="p-6 overflow-x-auto">
                            <BarChart width={500} height={300} data={levelData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="level" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
