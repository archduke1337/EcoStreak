import { Spinner } from '@nextui-org/react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    fullScreen?: boolean;
}

/**
 * Reusable loading spinner component
 * Can be used inline or as a full-screen loader
 */
export default function LoadingSpinner({
    size = 'lg',
    label = 'Loading...',
    fullScreen = false
}: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-6xl animate-bounce">🌍</div>
            <Spinner size={size} color="success" />
            {label && (
                <p className="text-lg text-gray-600 dark:text-gray-400">{label}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                {content}
            </div>
        );
    }

    return content;
}
