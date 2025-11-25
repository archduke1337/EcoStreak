/**
 * Custom error types for EcoStreak application
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public userMessage?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class AuthError extends AppError {
    constructor(message: string) {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 'DATABASE_ERROR', 500);
        this.name = 'DatabaseError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Type guard to check if error is a standard Error
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

/**
 * Get error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
    if (isError(error)) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
    if (isAppError(error)) {
        return error.userMessage || error.message;
    }

    if (isError(error)) {
        // Check for common error patterns
        const message = error.message.toLowerCase();

        // Appwrite-specific errors
        if (message.includes('user (role: guests) missing scope')) {
            return 'Please log in to access this feature.';
        }

        if (message.includes('invalid credentials') || message.includes('invalid email or password')) {
            return 'Invalid email or password. Please try again.';
        }

        if (message.includes('user with the requested id could not be found')) {
            return 'User account not found. Please sign up first.';
        }

        if (message.includes('rate limit')) {
            return 'Too many attempts. Please wait a moment and try again.';
        }

        if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
            return 'Network error. Please check your connection and try again.';
        }

        if (message.includes('unauthorized') || message.includes('authentication')) {
            return 'Authentication failed. Please check your credentials.';
        }

        if (message.includes('not found')) {
            return 'The requested resource was not found.';
        }

        // Return the original error message for other known errors
        return error.message;
    }

    // Check if it's an Appwrite error object (has code and type properties)
    if (typeof error === 'object' && error !== null) {
        const appwriteError = error as { message?: string; code?: number; type?: string };
        if (appwriteError.message) {
            return getUserFriendlyMessage(new Error(appwriteError.message));
        }
    }

    return 'Something went wrong. Please try again.';
}
