'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { getErrorMessage } from '@/types/errors';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back! 🌱');
            // Use router.refresh() to sync the cookie, then navigate
            router.refresh();
            router.push('/dashboard');
        } catch (error) {
            toast.error(getErrorMessage(error));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-4">
                    <CardHeader className="flex flex-col gap-3 text-center">
                        <h1 className="text-4xl font-bold gradient-text">🌍 EcoStreak</h1>
                        <p className="text-gray-600 dark:text-gray-400">Welcome back, Eco Warrior!</p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                size="lg"
                            />
                            <Input
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                                size="lg"
                            />
                            <Button
                                type="submit"
                                color="success"
                                size="lg"
                                isLoading={loading}
                                className="font-semibold"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-green-600 font-semibold hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
