import { Client, Account, Databases, ID, Query } from 'appwrite';
import { validateEnvironmentVariables } from './env-validation';

// Validate all required environment variables
validateEnvironmentVariables();

// Log configuration (helps debug deployment issues)
if (typeof window !== 'undefined') {
    console.log('[Appwrite] Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('[Appwrite] Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;
export const CHALLENGES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID!;

export { ID, Query };
export { client };

