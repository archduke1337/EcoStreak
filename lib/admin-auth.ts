import { User } from '@/types';

// Admin whitelist emails
export const ADMIN_EMAILS = [
    'gauravramyadav@gmail.com',
    'jaydeepshirsath13@gmail.com',
    'principal@yourcollege.ac.in',
];

export function isAdmin(user: User | null): boolean {
    if (!user) {
        console.log('[isAdmin] User is null');
        return false;
    }

    console.log('[isAdmin] Checking user:', { email: user.email, role: user.role });

    // Check database role first
    if (user.role === 'admin') {
        console.log('[isAdmin] User is admin via role');
        return true;
    }

    // Fallback to hardcoded whitelist
    const emailLower = user.email?.toLowerCase() || '';
    const isInWhitelist = ADMIN_EMAILS.includes(emailLower);
    console.log('[isAdmin] Email check:', { email: emailLower, isInWhitelist, adminEmails: ADMIN_EMAILS });
    return isInWhitelist;
}

export function getAdminEmails(): string[] {
    return ADMIN_EMAILS;
}
