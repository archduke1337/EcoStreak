'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Certificate from '@/components/Certificate';
import { Card, CardBody, Button } from '@nextui-org/react';
import { generateCertificatePDF } from '@/lib/certificate-generator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { handleError } from '@/lib/error-handler';

const REQUIRED_POINTS = 1000;

export default function CertificatePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    const eligible = user.points >= REQUIRED_POINTS;

    const handleDownload = async () => {
        setGenerating(true);
        toast.info('Generating your certificate...');

        try {
            await generateCertificatePDF(
                'certificate',
                `EcoStreak_Certificate_${user.name.replace(/\s+/g, '_')}.pdf`
            );
            toast.success('Certificate downloaded successfully! 🎉');
        } catch (error) {
            toast.error(handleError(error, 'CertificatePage.handleDownload'));
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold mb-2">🎓 Your Certificate</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {eligible
                            ? 'Congratulations! Download your achievement certificate'
                            : `Earn ${REQUIRED_POINTS - user.points} more points to unlock your certificate`}
                    </p>
                </motion.div>

                {!eligible ? (
                    <Card className="max-w-2xl mx-auto">
                        <CardBody className="text-center p-12">
                            <div className="text-6xl mb-4">🔒</div>
                            <h3 className="text-2xl font-bold mb-4">Certificate Locked</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You need <strong>{REQUIRED_POINTS}</strong> points to unlock your certificate.
                            </p>
                            <div className="mb-6">
                                <p className="text-lg">
                                    Current Points: <span className="text-2xl font-bold text-green-600">{user.points}</span>
                                </p>
                                <p className="text-lg">
                                    Points Needed: <span className="text-2xl font-bold text-orange-600">
                                        {REQUIRED_POINTS - user.points}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                <p className="font-semibold mb-2">How to earn more points:</p>
                                <ul className="text-sm text-left space-y-1">
                                    <li>✅ Complete module quizzes (100 points per quiz)</li>
                                    <li>✅ Play mini-games (up to 50 points)</li>
                                    <li>✅ Complete daily challenges (50 points each)</li>
                                    <li>✅ Maintain your streak for bonus badges</li>
                                </ul>
                            </div>
                            <Button
                                color="success"
                                size="lg"
                                className="mt-6"
                                onPress={() => router.push('/modules')}
                            >
                                Go to Modules
                            </Button>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <Button
                                color="success"
                                size="lg"
                                onPress={handleDownload}
                                isLoading={generating}
                                className="text-xl px-12 py-6"
                            >
                                {generating ? 'Generating PDF...' : '📥 Download Certificate'}
                            </Button>
                        </div>

                        <div className="flex justify-center overflow-x-auto">
                            <div className="inline-block" style={{ transform: 'scale(0.7)', transformOrigin: 'top center' }}>
                                <Certificate user={user} />
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            🎉 Share your achievement on social media!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
