'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ALL_MODULES } from '@/data/modules';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ModulesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">📚 Learning Modules</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Explore 8 comprehensive environmental topics with quizzes and mini-games
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALL_MODULES.map((module, index) => (
                        <motion.div
                            key={module.slug}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/modules/${module.slug}`}>
                                <Card className="cursor-pointer hover:scale-105 transition-all h-full">
                                    <CardHeader className={`bg-gradient-to-r ${module.color} text-white`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="text-4xl">{module.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold">{module.title}</h3>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {module.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-600">📝 {module.quiz.length} Questions</span>
                                            {module.miniGame && (
                                                <span className="text-blue-600">🎮 Mini Game</span>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
