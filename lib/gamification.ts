import { Badge } from '@/types';
import { GAME_CONFIG } from './config';

export const BADGES: Badge[] = [
    // Points-based badges
    {
        id: 'beginner',
        name: 'Beginner',
        description: 'Earned your first 50 points',
        icon: '🌱',
        color: '#86efac',
        requirement: 50,
        type: 'points',
    },
    {
        id: 'eco-warrior',
        name: 'Eco Warrior',
        description: 'Earned 100 points',
        icon: '🌿',
        color: '#4ade80',
        requirement: 100,
        type: 'points',
    },
    {
        id: 'rising-star',
        name: 'Rising Star',
        description: 'Earned 250 points',
        icon: '⭐',
        color: '#fbbf24',
        requirement: 250,
        type: 'points',
    },
    {
        id: 'climate-champion',
        name: 'Climate Champion',
        description: 'Earned 500 points',
        icon: '🌍',
        color: '#22d3ee',
        requirement: 500,
        type: 'points',
    },
    {
        id: 'sustainability-hero',
        name: 'Sustainability Hero',
        description: 'Earned 1000 points',
        icon: '🦸',
        color: '#a78bfa',
        requirement: 1000,
        type: 'points',
    },
    {
        id: 'planet-protector',
        name: 'Planet Protector',
        description: 'Earned 2000 points',
        icon: '🛡️',
        color: '#f472b6',
        requirement: 2000,
        type: 'points',
    },
    {
        id: 'expert',
        name: 'Expert',
        description: 'Earned 3500 points',
        icon: '💎',
        color: '#60a5fa',
        requirement: 3500,
        type: 'points',
    },
    {
        id: 'master',
        name: 'Master',
        description: 'Earned 5000 points',
        icon: '👑',
        color: '#fbbf24',
        requirement: 5000,
        type: 'points',
    },
    {
        id: 'legend',
        name: 'Legend',
        description: 'Earned 10000 points',
        icon: '🏆',
        color: '#f59e0b',
        requirement: 10000,
        type: 'points',
    },

    // Streak-based badges
    {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Maintained 3-day streak',
        icon: '🔥',
        color: '#fb923c',
        requirement: 3,
        type: 'streak',
    },
    {
        id: 'week-streak',
        name: '7-Day Streak',
        description: 'Maintained 7-day streak',
        icon: '🔥',
        color: '#f97316',
        requirement: 7,
        type: 'streak',
    },
    {
        id: 'two-week-streak',
        name: '14-Day Streak',
        description: 'Maintained 14-day streak',
        icon: '💪',
        color: '#ea580c',
        requirement: 14,
        type: 'streak',
    },
    {
        id: 'month-streak',
        name: '30-Day Streak',
        description: 'Maintained 30-day streak',
        icon: '🎯',
        color: '#dc2626',
        requirement: 30,
        type: 'streak',
    },
    {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Maintained 60-day streak',
        icon: '💯',
        color: '#991b1b',
        requirement: 60,
        type: 'streak',
    },
    {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Maintained 100-day streak',
        icon: '⚡',
        color: '#7c2d12',
        requirement: 100,
        type: 'streak',
    },

    // Module-based badges
    {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Completed 1 module',
        icon: '📖',
        color: '#93c5fd',
        requirement: 1,
        type: 'modules',
    },
    {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Completed 3 modules',
        icon: '📚',
        color: '#60a5fa',
        requirement: 3,
        type: 'modules',
    },
    {
        id: 'scholar',
        name: 'Scholar',
        description: 'Completed 5 modules',
        icon: '🎓',
        color: '#3b82f6',
        requirement: 5,
        type: 'modules',
    },
    {
        id: 'master-learner',
        name: 'Master Learner',
        description: 'Completed all 8 modules',
        icon: '🏅',
        color: '#1d4ed8',
        requirement: 8,
        type: 'modules',
    },

    // Special badges
    {
        id: 'first-login',
        name: 'Welcome Aboard',
        description: 'First login to EcoStreak',
        icon: '👋',
        color: '#d4d4d8',
        requirement: 0,
        type: 'special',
    },
    {
        id: 'team-player',
        name: 'Team Player',
        description: 'Joined or created a team',
        icon: '👥',
        color: '#a3e635',
        requirement: 0,
        type: 'special',
    },
    {
        id: 'challenge-master',
        name: 'Challenge Master',
        description: 'Completed 10 daily challenges',
        icon: '🎖️',
        color: '#fb7185',
        requirement: 10,
        type: 'special',
    },
    {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Completed a challenge before 9 AM',
        icon: '🌅',
        color: '#fcd34d',
        requirement: 0,
        type: 'special',
    },
];

export function calculateLevel(points: number): number {
    return Math.floor(points / GAME_CONFIG.POINTS_PER_LEVEL) + 1;
}

export function getNextLevelPoints(currentLevel: number): number {
    return currentLevel * GAME_CONFIG.POINTS_PER_LEVEL;
}

export function getProgressToNextLevel(points: number): number {
    const currentLevel = calculateLevel(points);
    const pointsInCurrentLevel = points % GAME_CONFIG.POINTS_PER_LEVEL;
    return (pointsInCurrentLevel / GAME_CONFIG.POINTS_PER_LEVEL) * 100;
}

export function checkBadgeUnlock(
    points: number,
    streak: number,
    modulesCompleted: number,
    hasTeam: boolean = false,
    challengesCompleted: number = 0
): string[] {
    const unlockedBadges: string[] = [];

    BADGES.forEach((badge) => {
        if (badge.type === 'points' && points >= badge.requirement) {
            unlockedBadges.push(badge.id);
        } else if (badge.type === 'streak' && streak >= badge.requirement) {
            unlockedBadges.push(badge.id);
        } else if (badge.type === 'modules' && modulesCompleted >= badge.requirement) {
            unlockedBadges.push(badge.id);
        } else if (badge.type === 'special') {
            // Special badge logic
            if (badge.id === 'first-login') {
                unlockedBadges.push(badge.id); // Always unlocked
            } else if (badge.id === 'team-player' && hasTeam) {
                unlockedBadges.push(badge.id);
            } else if (badge.id === 'challenge-master' && challengesCompleted >= 10) {
                unlockedBadges.push(badge.id);
            }
            // early-bird is awarded separately when completing a challenge before 9 AM
        }
    });

    return unlockedBadges;
}

export function updateStreak(lastActiveDate: string, currentStreak: number): { newStreak: number; today: string } {
    // Use local date to avoid timezone issues (e.g. early morning in India being previous day in UTC)
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const lastDate = new Date(lastActiveDate);
    const todayDate = new Date(today);

    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = 0;
    if (diffDays === 0) {
        // Same day, keep current streak
        newStreak = currentStreak;
    } else if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak = currentStreak + 1;
    } else {
        // Streak broken, reset to 1
        newStreak = 1;
    }

    return { newStreak, today };
}
