'use client';

import { BADGES } from '@/lib/gamification';
import { Card, CardBody, Tooltip, Progress } from '@nextui-org/react';
import { motion } from 'framer-motion';

interface BadgeDisplayProps {
    userBadges: string[];
    points: number;
    streak: number;
    modulesCompleted: number;
}

export default function BadgeDisplay({ userBadges, points, streak, modulesCompleted }: BadgeDisplayProps) {
    const isUnlocked = (badgeId: string): boolean => {
        return userBadges.includes(badgeId);
    };

    const canUnlock = (badge: typeof BADGES[0]): boolean => {
        if (badge.type === 'points') return points >= badge.requirement;
        if (badge.type === 'streak') return streak >= badge.requirement;
        if (badge.type === 'modules') return modulesCompleted >= badge.requirement;
        if (badge.type === 'special') {
            if (badge.id === 'first-login') return true;
        }
        return false;
    };

    const getProgress = (badge: typeof BADGES[0]): number => {
        if (badge.type === 'points') return Math.min((points / badge.requirement) * 100, 100);
        if (badge.type === 'streak') return Math.min((streak / badge.requirement) * 100, 100);
        if (badge.type === 'modules') return Math.min((modulesCompleted / badge.requirement) * 100, 100);
        return 0;
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BADGES.map((badge, index) => {
                const unlocked = isUnlocked(badge.id);
                const canBeUnlocked = canUnlock(badge);
                const progress = getProgress(badge);

                return (
                    <Tooltip
                        key={badge.id}
                        content={
                            <div className="p-2">
                                <p className="font-bold">{badge.name}</p>
                                <p className="text-sm">{badge.description}</p>
                                {!unlocked && badge.requirement > 0 && (
                                    <p className="text-xs mt-1 opacity-70">
                                        {badge.type === 'points' && `${points}/${badge.requirement} points`}
                                        {badge.type === 'streak' && `${streak}/${badge.requirement} days`}
                                        {badge.type === 'modules' && `${modulesCompleted}/${badge.requirement} modules`}
                                    </p>
                                )}
                            </div>
                        }
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
                            className={unlocked ? 'animate-badge-pop' : ''}
                        >
                            <Card
                                className={`cursor-pointer transition-all h-full ${unlocked
                                        ? 'shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                                        : canBeUnlocked
                                            ? 'border-2 border-dashed'
                                            : 'opacity-70'
                                    }`}
                                style={{
                                    backgroundColor: unlocked ? badge.color : `${badge.color}30`,
                                    borderColor: canBeUnlocked && !unlocked ? badge.color : undefined,
                                }}
                            >
                                <CardBody className="text-center p-3 flex flex-col items-center justify-between min-h-[100px]">
                                    <div className={`text-3xl mb-1 ${!unlocked && 'grayscale opacity-50'}`}>
                                        {badge.icon}
                                    </div>
                                    <p
                                        className={`text-xs font-semibold leading-tight ${unlocked ? 'text-gray-900' : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                        style={{
                                            textShadow: unlocked ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        {badge.name}
                                    </p>
                                    {!unlocked && progress > 0 && progress < 100 && (
                                        <Progress
                                            value={progress}
                                            size="sm"
                                            className="mt-1 w-full"
                                            style={{
                                                backgroundColor: `${badge.color}20`,
                                            }}
                                            classNames={{
                                                indicator: "transition-all"
                                            }}
                                        />
                                    )}
                                    {unlocked && (
                                        <div className="absolute top-1 right-1 text-xs bg-white bg-opacity-95 rounded-full w-5 h-5 flex items-center justify-center font-bold text-green-600 shadow-sm">
                                            ✓
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </motion.div>
                    </Tooltip>
                );
            })}
        </div>
    );
}
