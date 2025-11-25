import { User } from '@/types';

// Admin whitelist emails
const ADMIN_EMAILS = [
    'gauravramyadav@gmail.com',
    'jaydeepshirsath13@gmail.com',
    'principal@yourcollege.ac.in',
];

export function isAdmin(user: User | null): boolean {
    if (!user) return false;

    // Check database role first
    if (user.role === 'admin') return true;

    // Fallback to hardcoded whitelist
    return ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
}

export function getAdminEmails(): string[] {
    return ADMIN_EMAILS;
}
