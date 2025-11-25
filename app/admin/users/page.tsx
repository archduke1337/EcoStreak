'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import Navbar from '@/components/Navbar';
import { Card, CardBody, Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, Query } from '@/lib/appwrite';
import { User } from '@/types';
import { toast } from 'sonner';
import { handleError } from '@/lib/error-handler';

export default function AdminUsersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push('/dashboard');
        } else if (user && isAdmin(user)) {
            fetchUsers();
        }
    }, [user, loading, router]);

    const fetchUsers = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.limit(1000), Query.orderDesc('points')]
            );
            const usersData = response.documents as unknown as User[];
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            toast.error(handleError(error, 'AdminUsersPage.fetchUsers'));
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (u) =>
                    u.name.toLowerCase().includes(query.toLowerCase()) ||
                    u.email.toLowerCase().includes(query.toLowerCase()) ||
                    u.college.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'College', 'Points', 'Level', 'Badges', 'Streak', 'Role'];
        const rows = filteredUsers.map((u) => [
            u.name,
            u.email,
            u.college,
            u.points,
            u.level,
            u.badges.length,
            u.streak,
            u.role,
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `ecoquest_users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('CSV exported successfully!');
    };

    if (loading || !user || !isAdmin(user)) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">👥 User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Total Users: {users.length}</p>
                </div>

                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="flex gap-4 items-end">
                            <Input
                                label="Search"
                                placeholder="Search by name, email, or college..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="flex-1"
                                size="lg"
                            />
                            <Button color="success" onPress={exportToCSV} size="lg">
                                📥 Export CSV
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <Table aria-label="Users table">
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>EMAIL</TableColumn>
                                    <TableColumn>COLLEGE</TableColumn>
                                    <TableColumn>POINTS</TableColumn>
                                    <TableColumn>LEVEL</TableColumn>
                                    <TableColumn>BADGES</TableColumn>
                                    <TableColumn>STREAK</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((u) => (
                                        <TableRow key={u.$id}>
                                            <TableCell>
                                                <span className="font-semibold">{u.name}</span>
                                            </TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>{u.college}</TableCell>
                                            <TableCell>
                                                <span className="font-bold text-green-600">{u.points}</span>
                                            </TableCell>
                                            <TableCell>{u.level}</TableCell>
                                            <TableCell>{u.badges.length}</TableCell>
                                            <TableCell>
                                                <span className="text-orange-600">{u.streak} 🔥</span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={u.role === 'admin' ? 'warning' : 'default'} size="sm">
                                                    {u.role}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Showing {filteredUsers.length} of {users.length} users
                </p>
            </div>
        </div>
    );
}
