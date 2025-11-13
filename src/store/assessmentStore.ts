/**
 * Assessment Store - Zustand-like API for assessment state
 */

import type { AssessmentQuestion, AssessmentResult } from '@/types';
import type { AssessmentStore } from './types';
import { logger } from '@/utils/logger';

type AssessmentStoreListener = (state: AssessmentStore) => void;

class AssessmentStoreImpl implements AssessmentStore {
  private listeners: Set<AssessmentStoreListener> = new Set();

  // State
  isActive = false;
  state: AssessmentStore['state'] = 'initial';
  classGrade = '';
  lastTopic = '';
  currentQuestion: AssessmentQuestion | null = null;
  questionCount = 0;
  result: AssessmentResult | null = null;
  error: Error | null = null;

  /**
   * Subscribe to store changes
   */
  subscribe(listener: AssessmentStoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Get current state
   */
  getState(): AssessmentStore {
    return {
      isActive: this.isActive,
      state: this.state,
      classGrade: this.classGrade,
      lastTopic: this.lastTopic,
      currentQuestion: this.currentQuestion,
      questionCount: this.questionCount,
      result: this.result,
      error: this.error,
      startAssessment: this.startAssessment.bind(this),
      endAssessment: this.endAssessment.bind(this),
      setClassGrade: this.setClassGrade.bind(this),
      setLastTopic: this.setLastTopic.bind(this),
      setState: this.setState.bind(this),
      setCurrentQuestion: this.setCurrentQuestion.bind(this),
      setQuestionCount: this.setQuestionCount.bind(this),
      incrementQuestionCount: this.incrementQuestionCount.bind(this),
      setResult: this.setResult.bind(this),
      setError: this.setError.bind(this),
      reset: this.reset.bind(this),
      isCollectingGrade: this.isCollectingGrade.bind(this),
      isCollectingTopic: this.isCollectingTopic.bind(this),
      isInProgress: this.isInProgress.bind(this),
      isCompleted: this.isCompleted.bind(this),
    };
  }

  // ============= ACTIONS =============

  startAssessment(): void {
    logger.debug('Starting assessment');
    this.isActive = true;
    this.state = 'collecting_grade';
    this.error = null;
    this.notifyListeners();
  }

  endAssessment(): void {
    logger.debug('Ending assessment');
    this.isActive = false;
    this.error = null;
    this.notifyListeners();
  }

  setClassGrade(grade: string): void {
    logger.debug('Setting class grade', { grade });
    this.classGrade = grade;
    this.error = null;
    this.notifyListeners();
  }

  setLastTopic(topic: string): void {
    logger.debug('Setting last topic', { topic });
    this.lastTopic = topic;
    this.error = null;
    this.notifyListeners();
  }

  setState(state: AssessmentStore['state']): void {
    logger.debug('Setting assessment state', { state });
    this.state = state;
    this.error = null;
    this.notifyListeners();
  }

  setCurrentQuestion(question: AssessmentQuestion | null): void {
    logger.debug('Setting current question', {
      hasQuestion: question !== null,
      concept: question?.concept,
    });
    this.currentQuestion = question;
    this.error = null;
    this.notifyListeners();
  }

  setQuestionCount(count: number): void {
    logger.debug('Setting question count', { count });
    this.questionCount = Math.max(0, count);
    this.error = null;
    this.notifyListeners();
  }

  incrementQuestionCount(): void {
    this.setQuestionCount(this.questionCount + 1);
  }

  setResult(result: AssessmentResult | null): void {
    logger.debug('Setting assessment result', {
      hasResult: result !== null,
      cluster: result?.cluster,
    });
    this.result = result;
    if (result) {
      this.state = 'completed';
    }
    this.error = null;
    this.notifyListeners();
  }

  setError(error: Error | null): void {
    if (error) {
      logger.error('Assessment store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  reset(): void {
    logger.debug('Resetting assessment');
    this.isActive = false;
    this.state = 'initial';
    this.classGrade = '';
    this.lastTopic = '';
    this.currentQuestion = null;
    this.questionCount = 0;
    this.result = null;
    this.error = null;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  isCollectingGrade(): boolean {
    return this.state === 'collecting_grade';
  }

  isCollectingTopic(): boolean {
    return this.state === 'collecting_topic';
  }

  isInProgress(): boolean {
    return this.state === 'in_progress';
  }

  isCompleted(): boolean {
    return this.state === 'completed';
  }
}

export const assessmentStore = new AssessmentStoreImpl();

export const useAssessmentStore = (): AssessmentStore => assessmentStore.getState();

export const subscribeToAssessmentStore = (listener: AssessmentStoreListener): (() => void) => {
  return assessmentStore.subscribe(listener);
};

export default assessmentStore;

