import { Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
    icon: string | ReactNode;
    value: string | number;
    label: string;
    color?: string;
    delay?: number;
    subtitle?: string;
    children?: ReactNode;
}

/**
 * Reusable stat card component for displaying metrics
 * Used across dashboard, admin panel, and profile pages
 */
export default function StatCard({
    icon,
    value,
    label,
    color = 'text-green-600',
    delay = 0,
    subtitle,
    children,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            <Card>
                <CardBody className="text-center">
                    <div className="text-4xl mb-2">
                        {typeof icon === 'string' ? icon : icon}
                    </div>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </CardBody>
            </Card>
        </motion.div>
    );
}
