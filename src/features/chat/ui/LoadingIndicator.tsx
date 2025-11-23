/**
 * LoadingIndicator Component
 * Shows loading state with animated dots
 * @module features/chat/ui/LoadingIndicator
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export function LoadingIndicator({
  message = 'Обрабатываю запрос',
  className = ''
}: LoadingIndicatorProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="animate-pulse">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {message}
              <span className="inline-block w-8">{dots}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GenerationStepsIndicatorProps {
  currentStep: string;
  className?: string;
}

export function GenerationStepsIndicator({
  currentStep,
  className = ''
}: GenerationStepsIndicatorProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center gap-3 p-6 bg-muted rounded-lg">
        <div className="animate-pulse">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">
            Генерирую урок{dots}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStep}
          </p>
        </div>
      </div>
    </div>
  );
}





