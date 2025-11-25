'use client';

import { motion } from 'framer-motion';

interface VirtualForestProps {
    points: number;
}

export default function VirtualForest({ points }: VirtualForestProps) {
    // Calculate number of trees based on points (1 tree per 50 points, max 20 trees)
    const numberOfTrees = Math.min(Math.floor(points / 50), 20);

    // Calculate tree sizes based on points
    const getTreeSize = (index: number): number => {
        const basePoints = (index + 1) * 50;
        if (points >= basePoints) {
            return 100; // Full grown
        } else if (points >= basePoints - 25) {
            return ((points - (basePoints - 50)) / 50) * 100; // Growing
        }
        return 0; // Not yet
    };

    return (
        <div className="bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900 dark:to-green-900 rounded-lg p-8 min-h-[300px] relative overflow-hidden">
            {/* Sun */}
            <motion.div
                className="absolute top-4 right-8 w-16 h-16 bg-yellow-400 rounded-full shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-600 dark:bg-green-800 rounded-b-lg" />

            {/* Trees */}
            <div className="flex flex-wrap justify-center items-end gap-4 absolute bottom-16 left-0 right-0 px-4">
                {Array.from({ length: numberOfTrees }).map((_, index) => {
                    const size = getTreeSize(index);
                    const treeHeight = 40 + (size / 100) * 40; // 40-80px
                    const treeWidth = 30 + (size / 100) * 20; // 30-50px

                    return (
                        <motion.div
                            key={index}
                            className="relative tree-animation"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: size / 100, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Tree crown */}
                            <div
                                className="bg-green-500 dark:bg-green-600 rounded-full mx-auto shadow-md"
                                style={{
                                    width: `${treeWidth}px`,
                                    height: `${treeHeight}px`,
                                }}
                            />
                            {/* Tree trunk */}
                            <div
                                className="bg-amber-700 dark:bg-amber-800 mx-auto rounded"
                                style={{
                                    width: `${treeWidth / 3}px`,
                                    height: `${treeHeight / 2}px`,
                                }}
                            />
                        </motion.div>
                    );
                })}

                {numberOfTrees === 0 && (
                    <div className="text-center text-gray-600 dark:text-gray-400 my-12">
                        <p className="text-lg font-semibold">🌱 Your forest is waiting to grow!</p>
                        <p className="text-sm">Complete quizzes and challenges to plant trees</p>
                    </div>
                )}
            </div>

            {/* Forest Stats */}
            <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 shadow-md">
                <p className="text-sm font-semibold">🌳 Trees: {numberOfTrees}/20</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Next tree at {Math.ceil(points / 50) * 50} pts
                </p>
            </div>
        </div>
    );
}
