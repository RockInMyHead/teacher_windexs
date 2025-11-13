/**
 * UI Store - Zustand-like API for UI state
 */

import type { UIStore } from './types';
import { logger } from '@/utils/logger';

type UIStoreListener = (state: UIStore) => void;

class UIStoreImpl implements UIStore {
  private listeners: Set<UIStoreListener> = new Set();

  // State
  isCameraActive = false;
  isAudioTaskActive = false;
  isTestQuestionActive = false;
  showSphere = false;
  selectedTheme: 'light' | 'dark' | 'system' = 'system';
  sidebarOpen = true;
  tooltipsEnabled = true;
  error: Error | null = null;

  /**
   * Subscribe to store changes
   */
  subscribe(listener: UIStoreListener): () => void {
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
  getState(): UIStore {
    return {
      isCameraActive: this.isCameraActive,
      isAudioTaskActive: this.isAudioTaskActive,
      isTestQuestionActive: this.isTestQuestionActive,
      showSphere: this.showSphere,
      selectedTheme: this.selectedTheme,
      sidebarOpen: this.sidebarOpen,
      tooltipsEnabled: this.tooltipsEnabled,
      error: this.error,
      setCameraActive: this.setCameraActive.bind(this),
      setAudioTaskActive: this.setAudioTaskActive.bind(this),
      setTestQuestionActive: this.setTestQuestionActive.bind(this),
      setShowSphere: this.setShowSphere.bind(this),
      setTheme: this.setTheme.bind(this),
      toggleSidebar: this.toggleSidebar.bind(this),
      setSidebarOpen: this.setSidebarOpen.bind(this),
      setTooltipsEnabled: this.setTooltipsEnabled.bind(this),
      setError: this.setError.bind(this),
      isDarkMode: this.isDarkMode.bind(this),
    };
  }

  // ============= ACTIONS =============

  setCameraActive(active: boolean): void {
    if (this.isCameraActive === active) return;
    logger.debug('Setting camera active', { active });
    this.isCameraActive = active;
    this.notifyListeners();
  }

  setAudioTaskActive(active: boolean): void {
    if (this.isAudioTaskActive === active) return;
    logger.debug('Setting audio task active', { active });
    this.isAudioTaskActive = active;
    this.notifyListeners();
  }

  setTestQuestionActive(active: boolean): void {
    if (this.isTestQuestionActive === active) return;
    logger.debug('Setting test question active', { active });
    this.isTestQuestionActive = active;
    this.notifyListeners();
  }

  setShowSphere(show: boolean): void {
    if (this.showSphere === show) return;
    logger.debug('Setting show sphere', { show });
    this.showSphere = show;
    this.notifyListeners();
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    logger.debug('Setting theme', { theme });
    this.selectedTheme = theme;
    this.notifyListeners();
  }

  toggleSidebar(): void {
    logger.debug('Toggling sidebar');
    this.sidebarOpen = !this.sidebarOpen;
    this.notifyListeners();
  }

  setSidebarOpen(open: boolean): void {
    if (this.sidebarOpen === open) return;
    logger.debug('Setting sidebar open', { open });
    this.sidebarOpen = open;
    this.notifyListeners();
  }

  setTooltipsEnabled(enabled: boolean): void {
    if (this.tooltipsEnabled === enabled) return;
    logger.debug('Setting tooltips enabled', { enabled });
    this.tooltipsEnabled = enabled;
    this.notifyListeners();
  }

  setError(error: Error | null): void {
    if (error) {
      logger.error('UI store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  isDarkMode(): boolean {
    if (this.selectedTheme === 'dark') return true;
    if (this.selectedTheme === 'light') return false;
    
    // System preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  }
}

export const uiStore = new UIStoreImpl();

export const useUIStore = (): UIStore => uiStore.getState();

export const subscribeToUIStore = (listener: UIStoreListener): (() => void) => {
  return uiStore.subscribe(listener);
};

export default uiStore;

