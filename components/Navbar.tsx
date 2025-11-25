'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Avatar, Divider } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { isAdmin } from '@/lib/admin-auth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (!user) return null;

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <Button
                            isIconOnly
                            variant="light"
                            className="md:hidden"
                            onPress={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
                        </Button>

                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image
                                src="/leaf-earth.svg"
                                alt="EcoStreak Logo"
                                width={40}
                                height={40}
                            />
                            <span className="text-xl font-bold gradient-text hidden sm:block">EcoStreak</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
                        <Link href="/modules" className="hover:text-green-600 transition-colors">Modules</Link>
                        <Link href="/leaderboard" className="hover:text-green-600 transition-colors">Leaderboard</Link>
                        <Link href="/teams" className="hover:text-green-600 transition-colors">Teams</Link>
                        <Link href="/challenges" className="hover:text-green-600 transition-colors">Daily Challenges</Link>
                        <Link href="/certificate" className="hover:text-green-600 transition-colors">Certificate</Link>
                        {isAdmin(user) && (
                            <Link href="/admin" className="hover:text-orange-600 transition-colors text-orange-600 font-semibold">
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            isIconOnly
                            variant="flat"
                            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {mounted && (theme === 'dark' ? '☀️' : '🌙')}
                        </Button>

                        <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Avatar
                                name={user.name}
                                size="sm"
                                className="cursor-pointer"
                            />
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {user.points} pts
                                </p>
                            </div>
                        </Link>

                        <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={handleLogout}
                            className="hidden sm:flex"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4 dark:border-gray-700"
                    >
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                            <Avatar name={user.name} size="sm" />
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-500">View Profile</p>
                            </div>
                        </Link>
                        <Divider />
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Dashboard</Link>
                        <Link href="/modules" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Modules</Link>
                        <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Leaderboard</Link>
                        <Link href="/teams" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Teams</Link>
                        <Link href="/challenges" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Daily Challenges</Link>
                        <Link href="/certificate" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Certificate</Link>
                        {isAdmin(user) && (
                            <>
                                <Divider />
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-orange-600 font-semibold">
                                    🔑 Admin Panel
                                </Link>
                            </>
                        )}
                        <Button color="danger" variant="flat" onPress={handleLogout} className="w-full">Logout</Button>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
