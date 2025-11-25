'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Keyboard shortcuts hook
 * Provides keyboard navigation and shortcuts throughout the app
 */
export function useKeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            // Ctrl/Cmd + K: Command palette (future feature)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toast.info('Command palette coming soon!');
                return;
            }

            // Navigation shortcuts
            switch (e.key) {
                case '?':
                    // Show keyboard shortcuts help
                    showShortcutsHelp();
                    break;

                case 'd':
                    // Go to dashboard
                    if (!e.ctrlKey && !e.metaKey) {
                        router.push('/dashboard');
                    }
                    break;

                case 'm':
                    // Go to modules
                    if (!e.ctrlKey && !e.metaKey) {
                        router.push('/modules');
                    }
                    break;

                case 'l':
                    // Go to leaderboard
                    if (!e.ctrlKey && !e.metaKey) {
                        router.push('/leaderboard');
                    }
                    break;

                case 't':
                    // Go to teams
                    if (!e.ctrlKey && !e.metaKey) {
                        router.push('/teams');
                    }
                    break;

                case 'c':
                    // Go to challenges
                    if (!e.ctrlKey && !e.metaKey) {
                        router.push('/challenges');
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [router]);
}

function showShortcutsHelp() {
    const message = `Keyboard Shortcuts:
D - Dashboard
M - Modules  
L - Leaderboard
T - Teams
C - Challenges
? - Show this help`;

    toast.info(message, { duration: 5000 });
}
