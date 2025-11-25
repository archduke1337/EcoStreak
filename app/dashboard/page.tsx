'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Progress } from '@nextui-org/react';
import Navbar from '@/components/Navbar';
import VirtualForest from '@/components/VirtualForest';
import BadgeDisplay from '@/components/BadgeDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatCard from '@/components/StatCard';
import { getProgressToNextLevel } from '@/lib/gamification';
import { useKeyboardShortcuts } from '@/lib/hooks';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [modulesCompleted, setModulesCompleted] = useState(0);

    // Enable keyboard shortcuts
    useKeyboardShortcuts();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <LoadingSpinner fullScreen label="Loading your dashboard..." />;
    }

    const progressToNext = getProgressToNextLevel(user.points);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {user.college}
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="⭐"
                        value={user.points}
                        label="Total Points"
                        color="text-green-600"
                        delay={0.1}
                    />

                    <StatCard
                        icon="🎯"
                        value={`Level ${user.level}`}
                        label="Current Level"
                        color="text-blue-600"
                        delay={0.2}
                    >
                        <Progress
                            value={progressToNext}
                            color="primary"
                            size="sm"
                            className="mt-2"
                        />
                    </StatCard>

                    <StatCard
                        icon="🔥"
                        value={user.streak}
                        label="Day Streak"
                        color="text-orange-600"
                        delay={0.3}
                    />

                    <StatCard
                        icon="🏅"
                        value={(typeof user.badges === 'string' ? JSON.parse(user.badges || '[]') : user.badges || []).length}
                        label="Badges Earned"
                        color="text-purple-600"
                        delay={0.4}
                    />
                </div>

                {/* Virtual Forest */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <Card>
                        <CardBody>
                            <h2 className="text-2xl font-bold mb-4">🌳 Your Virtual Forest</h2>
                            <VirtualForest points={user.points} />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                                Your forest grows as you earn points! Keep learning to make it flourish 🌱
                            </p>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardBody>
                            <h2 className="text-2xl font-bold mb-4">🏅 Your Badges</h2>
                            <BadgeDisplay
                                userBadges={typeof user.badges === 'string' ? JSON.parse(user.badges || '[]') : user.badges || []}
                                points={user.points}
                                streak={user.streak}
                                modulesCompleted={modulesCompleted}
                            />
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
