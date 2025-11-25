'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { getErrorMessage } from '@/types/errors';

export default function SignupPage() {
    const router = useRouter();
    const { signup, user, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        college: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name, formData.college);
            toast.success('Welcome to EcoStreak! 🎉');
            router.push('/dashboard');
        } catch (error) {
            toast.error(getErrorMessage(error));
            setIsLoading(false);
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
                        <p className="text-gray-600 dark:text-gray-400">Start your environmental journey!</p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSignup} className="flex flex-col gap-4">
                            <Input
                                type="text"
                                name="name"
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                size="lg"
                            />
                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                size="lg"
                            />
                            <Input
                                type="text"
                                name="college"
                                label="College/Institution Name"
                                placeholder="Enter your college name"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                size="lg"
                            />
                            <Input
                                type="password"
                                name="password"
                                label="Password"
                                placeholder="Create a password (min 8 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                size="lg"
                            />
                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                size="lg"
                            />
                            <Button
                                type="submit"
                                color="success"
                                size="lg"
                                isLoading={isLoading}
                                className="font-semibold"
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-green-600 font-semibold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
