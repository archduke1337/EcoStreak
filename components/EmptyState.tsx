import { Card, CardBody } from '@nextui-org/react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    action?: ReactNode;
}

/**
 * Reusable empty state component
 * Used when lists, tables, or content areas have no data
 */
export default function EmptyState({
    icon = '📭',
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <Card className="w-full">
            <CardBody className="text-center py-12">
                <div className="text-6xl mb-4">{icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {description}
                </p>
                {action && <div className="flex justify-center">{action}</div>}
            </CardBody>
        </Card>
    );
}
