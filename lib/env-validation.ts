/**
 * Environment variable validation
 * Ensures all required environment variables are present at build/runtime
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
    'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID',
] as const;

export function validateEnvironmentVariables(): void {
    const missing: string[] = [];

    // Next.js requires explicit access to process.env variables for them to be bundled correctly on the client
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) missing.push('NEXT_PUBLIC_APPWRITE_ENDPOINT');
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) missing.push('NEXT_PUBLIC_APPWRITE_PROJECT_ID');
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) missing.push('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
    if (!process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID) missing.push('NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID');
    if (!process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID) missing.push('NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID');
    if (!process.env.NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID) missing.push('NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID');

    if (missing.length > 0) {
        const message = `
╔════════════════════════════════════════════════════════╗
║  Missing Required Environment Variables                ║
╚════════════════════════════════════════════════════════╝

The following environment variables are required but not set:

${missing.map(v => `  ❌ ${v}`).join('\n')}

Please check your .env.local file and ensure all variables are set.
See .env.local.example for reference.

For setup instructions, see: SETUP.md
        `.trim();

        throw new Error(message);
    }
}

export function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key];

    if (!value && !fallback) {
        throw new Error(`Environment variable ${key} is not set and no fallback provided`);
    }

    return value || fallback!;
}

export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}
