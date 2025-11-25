import { User } from '@/types';

// Admin whitelist emails
const ADMIN_EMAILS = [
    'gauravramyadav@gmail.com',
    'jaydeepshirsath13@gmail.com',
    'principal@yourcollege.ac.in',
];

export function isAdmin(user: User | null): boolean {
    if (!user) {
        console.log('[isAdmin] User is null');
        return false;
    }

    console.log('[isAdmin] Checking user:', user.$id, 'email:', user.email, 'role:', user.role);

    // Check database role first
    if (user.role === 'admin') {
        console.log('[isAdmin] User is admin via role field');
        return true;
    }

    // Fallback to hardcoded whitelist
    const isInWhitelist = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
    console.log('[isAdmin] Email in whitelist:', isInWhitelist, 'email:', user.email?.toLowerCase());
    return isInWhitelist;
}

export function getAdminEmails(): string[] {
    return ADMIN_EMAILS;
}
