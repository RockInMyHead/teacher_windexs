/**
 * File Store - Zustand-like API for file management state
 */

import type { FileStore } from './types';
import { logger } from '@/utils/logger';

type FileStoreListener = (state: FileStore) => void;

class FileStoreImpl implements FileStore {
  private listeners: Set<FileStoreListener> = new Set();

  // State
  uploadedFiles: File[] = [];
  processedFiles: Array<{ name: string; content: string; type: string }> = [];
  isProcessing = false;
  error: Error | null = null;

  /**
   * Subscribe to store changes
   */
  subscribe(listener: FileStoreListener): () => void {
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
  getState(): FileStore {
    return {
      uploadedFiles: this.uploadedFiles,
      processedFiles: this.processedFiles,
      isProcessing: this.isProcessing,
      error: this.error,
      addFiles: this.addFiles.bind(this),
      removeFile: this.removeFile.bind(this),
      clearFiles: this.clearFiles.bind(this),
      setProcessedFiles: this.setProcessedFiles.bind(this),
      addProcessedFile: this.addProcessedFile.bind(this),
      setIsProcessing: this.setIsProcessing.bind(this),
      setError: this.setError.bind(this),
      getFileCount: this.getFileCount.bind(this),
      getCombinedText: this.getCombinedText.bind(this),
    };
  }

  // ============= ACTIONS =============

  addFiles(files: File[]): void {
    try {
      logger.debug('Adding files', { count: files.length });
      this.uploadedFiles = [...this.uploadedFiles, ...files];
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add files');
      this.setError(error);
    }
  }

  removeFile(index: number): void {
    try {
      logger.debug('Removing file', { index });
      this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
      this.processedFiles = this.processedFiles.filter((_, i) => i !== index);
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove file');
      this.setError(error);
    }
  }

  clearFiles(): void {
    try {
      logger.debug('Clearing all files');
      this.uploadedFiles = [];
      this.processedFiles = [];
      this.isProcessing = false;
      this.error = null;
      this.notifyListeners();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear files');
      this.setError(error);
    }
  }

  setProcessedFiles(files: Array<{ name: string; content: string; type: string }>): void {
    logger.debug('Setting processed files', { count: files.length });
    this.processedFiles = files;
    this.error = null;
    this.notifyListeners();
  }

  addProcessedFile(file: { name: string; content: string; type: string }): void {
    logger.debug('Adding processed file', { name: file.name });
    this.processedFiles = [...this.processedFiles, file];
    this.error = null;
    this.notifyListeners();
  }

  setIsProcessing(processing: boolean): void {
    if (this.isProcessing === processing) return;
    logger.debug('Setting processing state', { processing });
    this.isProcessing = processing;
    this.notifyListeners();
  }

  setError(error: Error | null): void {
    if (error) {
      logger.error('File store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  getFileCount(): number {
    return this.uploadedFiles.length;
  }

  getCombinedText(): string {
    return this.processedFiles
      .map((file, i) => `--- File ${i + 1}: ${file.name} ---\n${file.content}`)
      .join('\n\n');
  }
}

export const fileStore = new FileStoreImpl();

export const useFileStore = (): FileStore => fileStore.getState();

export const subscribeToFileStore = (listener: FileStoreListener): (() => void) => {
  return fileStore.subscribe(listener);
};

export default fileStore;

