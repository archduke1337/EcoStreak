'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button, Card, CardBody, CardHeader, Input, Divider } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getErrorMessage } from '@/types/errors';

export default function ProfilePage() {
    const { user, loading, updateProfile } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [college, setCollege] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setCollege(user.college);
        }
    }, [user, loading, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await updateProfile(name, college);
            toast.success('Profile updated successfully! ✨');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌍</div>
                    <p className="text-xl">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>

                    <div className="grid gap-6">
                        {/* Stats Overview */}
                        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                            <CardBody className="flex flex-row justify-around items-center py-8">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{user.points}</p>
                                    <p className="text-sm opacity-90">Total Points</p>
                                </div>
                                <div className="h-12 w-px bg-white/30"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">Lvl {user.level}</p>
                                    <p className="text-sm opacity-90">Current Level</p>
                                </div>
                                <div className="h-12 w-px bg-white/30"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{user.badges.length}</p>
                                    <p className="text-sm opacity-90">Badges</p>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Edit Profile Form */}
                        <Card>
                            <CardHeader className="pb-0">
                                <h2 className="text-xl font-bold">Edit Details</h2>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={handleSave} className="flex flex-col gap-6">
                                    <Input
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        variant="bordered"
                                        isRequired
                                    />

                                    <Input
                                        label="College / Institution"
                                        placeholder="Enter your college name"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        variant="bordered"
                                        isRequired
                                        description="This will be displayed on the leaderboard"
                                    />

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-500">Email Address</label>
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                                            {user.email}
                                            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Read-only</span>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            isLoading={isSaving}
                                            className="font-semibold"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
