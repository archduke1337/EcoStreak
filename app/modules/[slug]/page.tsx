'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Quiz from '@/components/Quiz';
import WasteSortingGame from '@/components/WasteSortingGame';
import CarbonCalculator from '@/components/CarbonCalculator';
import { ALL_MODULES } from '@/data/modules';
import { Card, CardBody, Button, Tabs, Tab } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getErrorMessage } from '@/types/errors';

export default function ModulePage() {
    const { user, loading, updateUserStats } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;

    const [activeTab, setActiveTab] = useState('content');
    const [quizStarted, setQuizStarted] = useState(false);
    const [miniGameStarted, setMiniGameStarted] = useState(false);

    const currentModule = ALL_MODULES.find((m) => m.slug === slug);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || !currentModule) return null;

    const handleQuizComplete = async (score: number, totalPoints: number) => {
        try {
            const newPoints = (user.points || 0) + totalPoints;
            const newLevel = Math.floor(newPoints / 100) + 1;

            await updateUserStats({
                points: newPoints,
                level: newLevel
            });

            toast.success(`Module completed! You earned ${totalPoints} points! 🎉`);

            setTimeout(() => {
                router.push('/modules');
            }, 2000);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleMiniGameComplete = async (points: number) => {
        try {
            const newPoints = (user.points || 0) + points;
            const newLevel = Math.floor(newPoints / 100) + 1;

            await updateUserStats({
                points: newPoints,
                level: newLevel
            });

            toast.success(`Mini-game completed! You earned ${points} points! 🎮`);
            setMiniGameStarted(false);
            setActiveTab('quiz');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Module Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className={`bg-gradient-to-r ${currentModule.color} text-white rounded-lg p-8 mb-6`}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-6xl">{currentModule.icon}</span>
                            <div>
                                <h1 className="text-4xl font-bold">{currentModule.title}</h1>
                                <p className="text-lg opacity-90">{currentModule.description}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Tabs */}
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    size="lg"
                    color="success"
                    className="mb-6"
                >
                    <Tab key="content" title="📖 Content" />
                    {currentModule.miniGame && <Tab key="mini-game" title="🎮 Mini Game" />}
                    <Tab key="quiz" title="📝 Quiz" />
                </Tabs>

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card>
                            <CardBody className="p-8">
                                <p className="text-lg mb-6">{currentModule.content.introduction}</p>

                                {currentModule.content.sections.map((section, index) => (
                                    <div key={index} className="mb-8">
                                        <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                ))}

                                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-6">
                                    <h3 className="text-xl font-bold mb-4">💡 Key Facts:</h3>
                                    <ul className="space-y-2">
                                        {currentModule.content.facts.map((fact, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-green-600">•</span>
                                                <span>{fact}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4">✅ Action Items:</h3>
                                    <ul className="space-y-2">
                                        {currentModule.content.actionItems.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-blue-600">→</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex justify-end gap-3">
                            {currentModule.miniGame && (
                                <Button
                                    color="primary"
                                    onPress={() => setActiveTab('mini-game')}
                                    size="lg"
                                >
                                    Play Mini Game 🎮
                                </Button>
                            )}
                            <Button
                                color="success"
                                onPress={() => setActiveTab('quiz')}
                                size="lg"
                            >
                                Start Quiz 📝
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Mini Game Tab */}
                {activeTab === 'mini-game' && currentModule.miniGame && (
                    <motion.div
                        key="mini-game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {!miniGameStarted ? (
                            <Card>
                                <CardBody className="text-center p-12">
                                    <div className="text-6xl mb-4">🎮</div>
                                    <h2 className="text-3xl font-bold mb-4">
                                        {currentModule.miniGame === 'waste-sorting' ? 'Waste Sorting Challenge' : 'Carbon Footprint Calculator'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {currentModule.miniGame === 'waste-sorting'
                                            ? 'Drag and drop waste items into the correct bins!'
                                            : 'Calculate your carbon footprint and learn how to reduce it!'}
                                    </p>
                                    <Button color="primary" size="lg" onPress={() => setMiniGameStarted(true)}>
                                        Start Game
                                    </Button>
                                </CardBody>
                            </Card>
                        ) : (
                            <>
                                {currentModule.miniGame === 'waste-sorting' && (
                                    <WasteSortingGame onComplete={handleMiniGameComplete} />
                                )}
                                {currentModule.miniGame === 'carbon-calculator' && (
                                    <CarbonCalculator onComplete={handleMiniGameComplete} />
                                )}
                            </>
                        )}
                    </motion.div>
                )}

                {/* Quiz Tab */}
                {activeTab === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {!quizStarted ? (
                            <Card>
                                <CardBody className="text-center p-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h2 className="text-3xl font-bold mb-4">Ready for the Quiz?</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        {currentModule.quiz.length} questions • {currentModule.quiz.reduce((sum, q) => sum + q.points, 0)} points
                                    </p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Test your knowledge and earn points!
                                    </p>
                                    <Button color="success" size="lg" onPress={() => setQuizStarted(true)}>
                                        Start Quiz
                                    </Button>
                                </CardBody>
                            </Card>
                        ) : (
                            <Quiz questions={currentModule.quiz} onComplete={handleQuizComplete} />
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
