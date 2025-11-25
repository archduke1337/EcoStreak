/**
 * Centralized error handling and logging for EcoStreak
 */

import { getErrorMessage, getUserFriendlyMessage } from '@/types/errors';

/**
 * Log error to console in development only
 */
export function logError(error: unknown, context?: string): void {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
        const prefix = context ? `[${context}]` : '[Error]';
        console.error(prefix, error);
    }

    // In production, you could send to error tracking service (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //     // Send to error tracking service
    // }
}

/**
 * Handle error and return user-friendly message
 */
export function handleError(error: unknown, context?: string): string {
    logError(error, context);
    return getUserFriendlyMessage(error);
}

/**
 * Handle async errors in try-catch blocks
 */
export async function handleAsyncError<T>(
    fn: () => Promise<T>,
    context?: string
): Promise<{ data?: T; error?: string }> {
    try {
        const data = await fn();
        return { data };
    } catch (error) {
        const errorMessage = handleError(error, context);
        return { error: errorMessage };
    }
}
