/**
 * ChatRefactored - Refactored Chat page using new ChatContainer component
 * 
 * This page demonstrates the new architecture from PHASE 2
 * All the old Chat.tsx complexity is now split into manageable components
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChatContainer } from '@/components/Chat';
import { getSystemPrompt } from '@/utils/prompts';
import { logger } from '@/utils/logger';

export const ChatRefactored: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      logger.warn('User not authenticated, redirecting to auth');
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChatStart = () => {
    logger.info('Chat session started', { userId: user?.id });
  };

  const handleChatEnd = () => {
    logger.info('Chat session ended', { userId: user?.id });
    navigate(-1); // Go back
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <ChatContainer
        initialSystemPrompt={getSystemPrompt('DEFAULT_TEACHER')}
        maxMessages={100}
        onChatStart={handleChatStart}
        onChatEnd={handleChatEnd}
      />
    </div>
  );
};

export default ChatRefactored;

