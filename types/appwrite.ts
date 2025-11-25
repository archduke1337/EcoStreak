/**
 * Enhanced type definitions for Appwrite documents
 * Provides better type safety throughout the application
 */

import { Models } from 'appwrite';

/**
 * User document from Appwrite with proper typing
 */
export interface UserDocument extends Models.Document {
    name: string;
    collage: string; // Note: typo in schema, should be 'college'
    points: number;
    level: number;
    badges: string; // JSON string of badge IDs
    streak: number;
    lastActiveData: string; // Note: typo in schema, should be 'lastActiveDate'
    role: 'student' | 'admin';
    teamId?: string;
    completedTasks?: string; // JSON string of CompletedTask[]
}

/**
 * Team document from Appwrite with proper typing
 */
export interface TeamDocument extends Models.Document {
    teamName: string;
    teamCode: string;
    leaderId: string;
    members: string[]; // Array of user IDs
    totalPoints: number;
}

/**
 * Challenge document from Appwrite with proper typing
 */
export interface ChallengeDocument extends Models.Document {
    date: string;
    title: string;
    description: string;
    points: number;
}

/**
 * Completed task tracking
 */
export interface CompletedTask {
    id: string;
    completedAt: string; // ISO date string
    type: 'challenge' | 'quiz' | 'minigame';
}
