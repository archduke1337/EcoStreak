/** 
 * TypeScript declaration file for environment variables
 * Provides type safety and autocomplete for process.env
 */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Build-time variables
            NODE_ENV: 'development' | 'production' | 'test';

            // Appwrite configuration
            NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
            NEXT_PUBLIC_APPWRITE_PROJECT_ID: string;
            NEXT_PUBLIC_APPWRITE_DATABASE_ID: string;
            NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID: string;
            NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID: string;
            NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID: string;

            // Optional: Analytics, monitoring, etc.
            NEXT_PUBLIC_GA_ID?: string;
            SENTRY_DSN?: string;
        }
    }
}

export { };
