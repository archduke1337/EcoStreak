'use client';

import { Button, Card, CardBody, Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { value: '10K+', label: 'Active Learners', icon: '👥' },
        { value: '8', label: 'Learning Modules', icon: '📚' },
        { value: '24', label: 'Unique Badges', icon: '🏅' },
        { value: '20', label: 'Daily Challenges', icon: '🔥' },
    ];

    const features = [
        {
            icon: '🎮',
            title: 'Gamified Learning',
            description: 'Complete quizzes, play mini-games, and earn XP points for every achievement',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: '🏆',
            title: 'Compete & Collaborate',
            description: 'Join teams, climb leaderboards, and compete with students across India',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: '🎓',
            title: 'Real Certificates',
            description: 'Earn downloadable certificates on reaching 1000+ points to showcase your skills',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: '🌱',
            title: 'Virtual Forest',
            description: 'Watch your virtual forest grow as you earn points and contribute to sustainability',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: '📚',
            title: '8 Learning Modules',
            description: 'Climate Change, Renewable Energy, Waste Management, and more with real Indian context',
            color: 'from-indigo-500 to-purple-500',
        },
        {
            icon: '🔥',
            title: 'Daily Challenges',
            description: 'Complete daily environmental challenges and maintain your streak to unlock special badges',
            color: 'from-red-500 to-orange-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Animated background elements */}
            {mounted && (
                <>
                    <motion.div
                        className="absolute top-20 left-10 w-32 h-32 bg-green-200 dark:bg-green-900 rounded-full opacity-20 blur-3xl"
                        animate={{
                            y: [0, 30, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </>
            )}

            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    {/* Logo and Title */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <motion.img
                            src="/leaf-earth.svg"
                            alt="EcoStreak Logo"
                            className="w-20 h-20 md:w-28 md:h-28"
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text">
                            EcoStreak
                        </h1>
                    </div>

                    {/* Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p className="text-2xl md:text-4xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                            Turn Environmental Learning into an{' '}
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text font-bold">
                                Addictive Game
                            </span>
                        </p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Earn points, unlock 24 colorful badges, compete on leaderboards, complete 20 daily challenges,
                            and get real certificates while saving the planet! 🌍
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-4 mt-8 mb-12"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="text-3xl mb-1">{stat.icon}</div>
                                <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            color="success"
                            className="text-xl px-12 py-7 h-auto font-bold shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
                            onPress={() => router.push('/signup')}
                        >
                            🚀 Start Your Journey
                        </Button>
                        <Button
                            size="lg"
                            variant="bordered"
                            className="text-xl px-12 py-7 h-auto font-bold border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform hover:scale-105"
                            onPress={() => router.push('/login')}
                        >
                            🔑 Login
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
                        Why Choose <span className="gradient-text">EcoStreak</span>?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <Card className="h-full shadow-xl hover:shadow-2xl transition-all border-t-4 border-transparent hover:border-green-500">
                                    <CardBody className="p-6">
                                        <div
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-4 shadow-lg`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Social Proof / How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl">
                        <CardBody className="p-8 md:p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">🌟 Join the Movement</h2>
                            <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95">
                                Be part of India&apos;s largest environmental education platform.
                                Learn, compete, and make a real difference while having fun!
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="text-4xl mb-2">✅</div>
                                    <div className="text-sm opacity-90">Free Forever</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="text-4xl mb-2">📱</div>
                                    <div className="text-sm opacity-90">Mobile Friendly</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="text-4xl mb-2">🎯</div>
                                    <div className="text-sm opacity-90">Real Results</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <div className="text-sm opacity-90">Certificates</div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Problem Code: <span className="font-semibold">SIH 25009</span> | Theme: <span className="font-semibold">Sustainable Science</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        © 2025 EcoStreak. Making environmental education fun and engaging.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
