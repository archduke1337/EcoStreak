'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import Navbar from '@/components/Navbar';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from '@nextui-org/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { logError } from '@/lib/error-handler';
import Link from 'next/link';
import { toast } from 'sonner';

interface CollegeStat {
    college: string;
    users: number;
    totalPoints: number;
    avgPoints: number;
}

export default function AdminCollegesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [collegeStats, setCollegeStats] = useState<CollegeStat[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push('/dashboard');
        } else if (user && isAdmin(user)) {
            fetchCollegeStats();
        }
    }, [user, loading, router]);

    const fetchCollegeStats = async () => {
        try {
            setLoadingStats(true);
            const response = await fetch('/api/admin/colleges');
            if (!response.ok) {
                if (response.status === 403) {
                    toast.error('Unauthorized access');
                    router.push('/dashboard');
                    return;
                }
                throw new Error('Failed to fetch college stats');
            }
            const data = await response.json();
            setCollegeStats(data.collegeStats || []);
        } catch (error) {
            logError(error, 'AdminCollegesPage.fetchCollegeStats');
            toast.error('Failed to load college data');
        } finally {
            setLoadingStats(false);
        }
    };

    if (loading || !user || !isAdmin(user)) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/admin">
                            <Button variant="light" size="sm">← Back to Admin</Button>
                        </Link>
                        <h1 className="text-4xl font-bold">🏫 College Analytics</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Performance metrics by educational institution ({collegeStats.length} colleges)
                    </p>
                </div>

                {loadingStats ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="success" />
                    </div>
                ) : (
                    <>
                        {/* Top Colleges Chart */}
                        {collegeStats.length > 0 && (
                        <Card className="mb-8">
                            <CardHeader className="bg-green-100 dark:bg-green-900">
                                <h3 className="text-xl font-bold">Top 15 Colleges by Total Points</h3>
                            </CardHeader>
                            <CardBody className="p-6">
                                <div className="w-full overflow-x-auto">
                                    <div className="min-w-[800px]">
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={collegeStats.slice(0, 15)}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="college" angle={-45} textAnchor="end" height={150} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="totalPoints" fill="#10b981" name="Total Points" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        )}

                        {/* College Table */}
                        <Card>
                            <CardHeader className="bg-blue-100 dark:bg-blue-900">
                                <h3 className="text-xl font-bold">All Colleges</h3>
                            </CardHeader>
                            <CardBody className="p-0">
                                <div className="overflow-x-auto">
                                    <Table aria-label="Colleges table">
                                        <TableHeader>
                                            <TableColumn>RANK</TableColumn>
                                            <TableColumn>COLLEGE NAME</TableColumn>
                                            <TableColumn>USERS</TableColumn>
                                            <TableColumn>TOTAL POINTS</TableColumn>
                                            <TableColumn>AVG POINTS/USER</TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent="No colleges found.">
                                            {collegeStats.map((college, index) => (
                                                <TableRow key={college.college}>
                                                    <TableCell>
                                                        <span className="text-xl font-bold">
                                                            {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `#${index + 1}`}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold">{college.college}</span>
                                                    </TableCell>
                                                    <TableCell>{college.users}</TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-green-600">
                                                            {college.totalPoints.toLocaleString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-blue-600">{college.avgPoints}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
