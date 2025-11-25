'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { handleError } from '@/lib/error-handler';
import { updateStreak } from '@/lib/gamification';

const DAILY_CHALLENGES = [
    { id: 'no-plastic', title: 'Say No to Single-Use Plastic', description: 'Avoid using any single-use plastic items today', points: 30, icon: '🚫', category: 'Waste' },
    { id: 'public-transport', title: 'Use Public Transport', description: 'Use public transportation, cycling, or walking instead of private vehicles', points: 40, icon: '🚌', category: 'Transport' },
    { id: 'save-water', title: 'Water Conservation', description: 'Save water by taking shorter showers and fixing leaky taps', points: 25, icon: '💧', category: 'Water' },
    { id: 'plant-based-meal', title: 'Plant-Based Meal', description: 'Have at least one completely plant-based meal today', points: 35, icon: '🥗', category: 'Food' },
    { id: 'lights-off', title: 'Lights Off', description: 'Turn off all unnecessary lights and electronics when not in use', points: 20, icon: '💡', category: 'Energy' },
    { id: 'recycle', title: 'Recycle Today', description: 'Properly segregate and recycle your waste', points: 30, icon: '♻️', category: 'Waste' },
    { id: 'composting', title: 'Compost Organic Waste', description: 'Start or add to your compost bin with kitchen scraps', points: 35, icon: '🌿', category: 'Waste' },
    { id: 'reusable-bags', title: 'Use Reusable Bags', description: 'Carry and use reusable shopping bags', points: 25, icon: '👜', category: 'Waste' },
    { id: 'unplug-devices', title: 'Unplug Devices', description: 'Unplug chargers and devices when not in use', points: 20, icon: '🔌', category: 'Energy' },
    { id: 'natural-light', title: 'Use Natural Light', description: 'Use natural daylight instead of artificial lighting during the day', points: 25, icon: '☀️', category: 'Energy' },
    { id: 'air-dry-clothes', title: 'Air Dry Clothes', description: 'Hang clothes to dry instead of using a dryer', points: 30, icon: '👕', category: 'Energy' },
    { id: 'fix-leaks', title: 'Fix Water Leaks', description: 'Check and repair any leaky faucets or pipes', points: 40, icon: '🔧', category: 'Water' },
    { id: 'shorter-shower', title: 'Take Shorter Shower', description: 'Limit your shower to 5 minutes or less', points: 25, icon: '🚿', category: 'Water' },
    { id: 'carpool', title: 'Carpool or Rideshare', description: 'Share a ride with others going in the same direction', points: 35, icon: '�', category: 'Transport' },
    { id: 'bike-ride', title: 'Bike or Walk', description: 'Use a bicycle or walk for short distance travel', points: 40, icon: '🚲', category: 'Transport' },
    { id: 'meatless-monday', title: 'Meatless Monday', description: 'Eat vegetarian for the entire day', points: 40, icon: '🌱', category: 'Food' },
    { id: 'local-produce', title: 'Buy Local Produce', description: 'Purchase fruits and vegetables from local farmers', points: 35, icon: '🥬', category: 'Food' },
    { id: 'educate-others', title: 'Educate Someone', description: 'Share an environmental fact with a friend or family member', points: 30, icon: '🗣️', category: 'Awareness' },
    { id: 'eco-shopping', title: 'Eco-Friendly Shopping', description: 'Choose products with minimal packaging', points: 30, icon: '🛒', category: 'Awareness' },
    { id: 'digital-declutter', title: 'Digital Declutter', description: 'Delete old emails and unused files to reduce digital carbon footprint', points: 20, icon: '📱', category: 'Awareness' },
];

interface CompletedTask {
    date: string;
    tasks: string[];
}

export default function ChallengesPage() {
    const { user, loading, updateUserStats } = useAuth();
    const router = useRouter();
    const [completedToday, setCompletedToday] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(DAILY_CHALLENGES.map(c => c.category)))];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            // Load today's completed tasks
            try {
                const completedTasks: CompletedTask[] = user.completedTasks
                    ? (typeof user.completedTasks === 'string' ? JSON.parse(user.completedTasks) : user.completedTasks)
                    : [];

                const today = new Date().toLocaleDateString('en-CA');
                const todaysTasks = completedTasks.find(ct => ct.date === today);
                if (todaysTasks) {
                    setCompletedToday(todaysTasks.tasks);
                }
            } catch (error) {
                console.error('Error loading completed tasks:', error);
            }
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    const handleCompleteChallenge = async (challengeId: string, points: number) => {
        setSubmitting(challengeId);

        try {
            const today = new Date().toLocaleDateString('en-CA');

            // Check if early bird (before 9 AM)
            const currentHour = new Date().getHours();
            const isEarlyBird = currentHour < 9;

            // Update streak
            const { newStreak } = updateStreak(user.lastActiveDate, user.streak);

            // Update completed tasks
            const completedTasks: CompletedTask[] = user.completedTasks
                ? (typeof user.completedTasks === 'string' ? JSON.parse(user.completedTasks) : user.completedTasks)
                : [];

            const todayIndex = completedTasks.findIndex(ct => ct.date === today);
            if (todayIndex >= 0) {
                completedTasks[todayIndex].tasks.push(challengeId);
            } else {
                completedTasks.push({ date: today, tasks: [challengeId] });
            }

            // Keep only last 7 days of data
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const filteredTasks = completedTasks.filter(ct => new Date(ct.date) >= sevenDaysAgo);

            // Calculate total challenges completed
            const totalChallenges = filteredTasks.reduce((sum, ct) => sum + ct.tasks.length, 0);

            // Update user badges if early bird
            let currentBadges: string[] = [];
            if (user.badges) {
                currentBadges = typeof user.badges === 'string' ? JSON.parse(user.badges) : user.badges;
            }
            let newBadges = [...currentBadges];
            if (isEarlyBird && !newBadges.includes('early-bird')) {
                newBadges.push('early-bird');
                toast.success('🌅 Early Bird badge unlocked!');
            }
            if (totalChallenges >= 10 && !newBadges.includes('challenge-master')) {
                newBadges.push('challenge-master');
                toast.success('🎖️ Challenge Master badge unlocked!');
            }

            await updateUserStats({
                points: user.points + points,
                level: Math.floor((user.points + points) / 100) + 1,
                streak: newStreak,
                lastActiveDate: today,
                badges: JSON.stringify(newBadges),
                completedTasks: JSON.stringify(filteredTasks),
            });

            setCompletedToday([...completedToday, challengeId]);
            toast.success(`Challenge completed! +${points} points 🎉`);

            if (newStreak > user.streak) {
                toast.success(`Streak updated: ${newStreak} days! 🔥`);
            }
        } catch (error) {
            toast.error(handleError(error, 'ChallengesPage.handleCompleteChallenge'));
        } finally {
            setSubmitting(null);
        }
    };

    const filteredChallenges = selectedCategory === 'All'
        ? DAILY_CHALLENGES
        : DAILY_CHALLENGES.filter(c => c.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">🔥 Daily Challenges</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete real-world environmental actions and earn points!</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Current Streak: <span className="text-2xl font-bold text-orange-600">{user.streak} 🔥</span>
                            </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Completed Today: <span className="text-2xl font-bold text-green-600">{completedToday.length}/20 ✅</span>
                            </p>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {categories.map(category => (
                            <Button
                                key={category}
                                size="sm"
                                variant={selectedCategory === category ? 'solid' : 'bordered'}
                                color={selectedCategory === category ? 'primary' : 'default'}
                                onPress={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChallenges.map((challenge, index) => {
                        const isCompleted = completedToday.includes(challenge.id);

                        return (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={isCompleted ? 'opacity-60 ring-2 ring-green-500' : ''}>
                                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="text-4xl">{challenge.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold">{challenge.title}</h3>
                                                <p className="text-xs opacity-90">{challenge.category}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="p-6">
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                            {challenge.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-green-600">+{challenge.points} pts</span>
                                            {isCompleted ? (
                                                <Button color="success" disabled size="sm">
                                                    ✅ Completed
                                                </Button>
                                            ) : (
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    onPress={() => handleCompleteChallenge(challenge.id, challenge.points)}
                                                    isLoading={submitting === challenge.id}
                                                >
                                                    Mark as Done
                                                </Button>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <Card className="mt-8 bg-blue-50 dark:bg-blue-900">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-bold mb-3">ℹ️ How it Works</h3>
                        <ul className="space-y-2 text-sm">
                            <li>✅ Complete real environmental actions in your daily life</li>
                            <li>✅ Each challenge can only be completed once per day</li>
                            <li>✅ Earn points and maintain your daily streak</li>
                            <li>✅ Complete challenges before 9 AM to unlock the Early Bird badge! 🌅</li>
                            <li>✅ Complete 10 total challenges to unlock Challenge Master badge! 🎖️</li>
                            <li>✅ Consistent participation unlocks special streak badges!</li>
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
