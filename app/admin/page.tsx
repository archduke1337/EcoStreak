'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import Navbar from '@/components/Navbar';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

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
    const [dataLoading, setDataLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
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
        console.log('[Admin] useEffect - loading:', loading, 'user:', user?.email, 'authChecked:', authChecked);
        
        // Wait for auth to finish loading before checking
        if (loading) return;
        
        // Give a small delay to ensure user state is properly set
        const timer = setTimeout(() => {
            console.log('[Admin] Timer fired - user:', user?.email, 'isAdmin:', user ? isAdmin(user) : 'no user');
            if (!user) {
                console.log('[Admin] No user, redirecting to login');
                router.push('/login');
            } else if (!isAdmin(user)) {
                console.log('[Admin] Not admin, redirecting to dashboard');
                toast.error('Admin access required');
                router.push('/dashboard');
            } else {
                console.log('[Admin] Admin verified, fetching data');
                setAuthChecked(true);
                fetchAdminData();
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }, [user, loading, router]);

    const fetchAdminData = async () => {
        try {
            setDataLoading(true);
            const response = await fetch('/api/admin/stats');
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    toast.error('Please log in to access admin panel');
                    router.push('/login');
                    return;
                }
                if (response.status === 403) {
                    toast.error('Unauthorized - Admin access required');
                    router.push('/dashboard');
                    return;
                }
                throw new Error(errorData.error || 'Failed to fetch admin data');
            }
            
            const data = await response.json();
            setStats(data.stats);
            setCollegeData(data.collegeData);
            setLevelData(data.levelData);
        } catch (error: any) {
            console.error('Admin data error:', error);
            toast.error(error.message || 'Failed to load admin data');
        } finally {
            setDataLoading(false);
        }
    };

    // Show loading while checking auth
    if (loading || !authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="success" label="Loading..." />
            </div>
        );
    }

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

                {dataLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="success" label="Loading admin data..." />
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
