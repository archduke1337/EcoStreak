import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            animation: {
                'tree-grow': 'treeGrow 2s ease-out',
                'badge-pop': 'badgePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'confetti': 'confetti 3s ease-in-out',
            },
            keyframes: {
                treeGrow: {
                    '0%': { transform: 'scale(0) translateY(20px)', opacity: '0' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
                badgePop: {
                    '0%': { transform: 'scale(0) rotate(-180deg)' },
                    '100%': { transform: 'scale(1) rotate(0deg)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(-100vh)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui({
        themes: {
            light: {
                colors: {
                    primary: {
                        DEFAULT: '#10b981',
                        foreground: '#ffffff',
                    },
                    success: {
                        DEFAULT: '#22c55e',
                        foreground: '#ffffff',
                    },
                },
            },
            dark: {
                colors: {
                    primary: {
                        DEFAULT: '#10b981',
                        foreground: '#ffffff',
                    },
                    success: {
                        DEFAULT: '#22c55e',
                        foreground: '#ffffff',
                    },
                },
            },
        },
    })],
}
export default config
