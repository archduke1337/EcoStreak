'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import Navbar from '@/components/Navbar';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, Query } from '@/lib/appwrite';
import { User } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { logError } from '@/lib/error-handler';

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

    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push('/dashboard');
        } else if (user && isAdmin(user)) {
            fetchCollegeStats();
        }
    }, [user, loading, router]);

    const fetchCollegeStats = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.limit(1000)]
            );
            const users = response.documents as unknown as User[];

            // Group by college
            const collegeMap = new Map<string, { users: number; totalPoints: number; avgPoints: number }>();

            users.forEach((u) => {
                const current = collegeMap.get(u.college) || { users: 0, totalPoints: 0, avgPoints: 0 };
                current.users += 1;
                current.totalPoints += u.points;
                collegeMap.set(u.college, current);
            });

            // Calculate averages and sort
            const stats = Array.from(collegeMap.entries())
                .map(([name, data]) => ({
                    college: name,
                    users: data.users,
                    totalPoints: data.totalPoints,
                    avgPoints: Math.round(data.totalPoints / data.users),
                }))
                .sort((a, b) => b.totalPoints - a.totalPoints);

            setCollegeStats(stats);
        } catch (error) {
            logError(error, 'AdminCollegesPage.fetchCollegeStats');
        }
    };

    if (loading || !user || !isAdmin(user)) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">🏫 College Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Performance metrics by educational institution
                    </p>
                </div>

                {/* Top Colleges Chart */}
                <Card className="mb-8">
                    <CardHeader className="bg-green-100 dark:bg-green-900">
                        <h3 className="text-xl font-bold">Top 15 Colleges by Total Points</h3>
                    </CardHeader>
                    <CardBody className="p-6 overflow-x-auto">
                        <BarChart width={1000} height={400} data={collegeStats.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="college" angle={-45} textAnchor="end" height={150} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalPoints" fill="#10b981" name="Total Points" />
                        </BarChart>
                    </CardBody>
                </Card>

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
                                <TableBody>
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
            </div>
        </div>
    );
}
