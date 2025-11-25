'use client';

import React, { Component, ReactNode } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors
 * Provides a user-friendly fallback UI when errors occur
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // In production, you could send to error tracking service
        // if (process.env.NODE_ENV === 'production') {
        //     // Send to Sentry or similar
        // }
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                    <Card className="max-w-md w-full">
                        <CardBody className="text-center p-8">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We encountered an unexpected error. Don&apos;t worry, your progress is safe!
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                                    <p className="text-sm font-mono text-red-600 dark:text-red-400">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <Button
                                    color="primary"
                                    onClick={this.handleReset}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="flat"
                                    onClick={() => window.location.href = '/dashboard'}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
