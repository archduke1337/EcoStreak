'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="light">
                <AuthProvider>
                    {children}
                    <Toaster richColors position="top-center" />
                </AuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    );
}
