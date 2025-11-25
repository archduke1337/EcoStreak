import { Client, Account, Databases, ID, Query } from 'appwrite';
import { validateEnvironmentVariables } from './env-validation';

// Validate all required environment variables
validateEnvironmentVariables();

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID!;
export const CHALLENGES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID!;

export { ID, Query };
export default client;

