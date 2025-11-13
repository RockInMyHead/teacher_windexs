/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Integrates with error tracking and reporting
 */

import React, { ReactNode, ReactElement } from 'react';
import { logger } from '@/utils/logger';
import { ErrorSeverity, ErrorCategory } from '@/types/errors';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props for ErrorBoundary
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
}

/**
 * State for ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays error UI
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  /**
   * Update state so next render will show fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  /**
   * Log error to external service
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const errorId = this.generateErrorId();

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error
    logger.error(`Error Boundary (${this.props.level || 'component'})`, {
      errorId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call parent callback
    this.props.onError?.(error, errorInfo);

    // Report to external service
    this.reportErrorToService(error, errorInfo, errorId);
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Report error to external service
   */
  private reportErrorToService(error: Error, errorInfo: React.ErrorInfo, errorId: string): void {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      console.error('Error reported to service:', errorId);
    }
  }

  /**
   * Handle retry
   */
  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Handle home navigation
   */
  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  /**
   * Render error UI
   */
  private renderErrorUI(): ReactElement {
    const { error, errorInfo, errorId } = this.state;
    const { fallback, showDetails = process.env.NODE_ENV === 'development', level = 'component' } =
      this.props;

    if (fallback && error) {
      return fallback(error, this.handleRetry);
    }

    return (
      <Card className={`w-full ${level === 'page' ? 'h-screen flex items-center justify-center' : ''}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>We've encountered an error. Please try again.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Error ID */}
            <div className="rounded-lg bg-slate-100 p-3">
              <p className="text-xs font-mono text-slate-600">Error ID: {errorId}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div>
                <p className="font-medium text-red-600">{error.message}</p>
              </div>
            )}

            {/* Details (development only) */}
            {showDetails && errorInfo && (
              <details className="rounded-lg bg-slate-50 p-3">
                <summary className="cursor-pointer font-medium text-slate-700">Error Details</summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-slate-600">Stack Trace:</p>
                    <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-green-400">
                      {error?.stack}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600">Component Stack:</p>
                    <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-green-400">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Support */}
            <p className="text-xs text-slate-500">
              If the problem persists, please contact support with Error ID: <code>{errorId}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Render
   */
  render(): ReactElement {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;

