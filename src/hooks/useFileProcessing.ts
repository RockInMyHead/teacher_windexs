/**
 * useFileProcessing Hook - Manage file uploads and processing
 */

import { useState, useCallback } from 'react';
import type { UseFileProcessingReturn, ProcessedFile, FileProcessingOptions, AppError } from '@/types';
import {
  processFile,
  processMultipleFiles,
  validateFile,
} from '@/utils/fileProcessing';
import { handleApiError } from '@/services/api/errorHandler';
import { logger } from '@/utils/logger';

interface UseFileProcessingOptions {
  maxFiles?: number;
  onFileProcessed?: (file: ProcessedFile) => void;
  onError?: (error: AppError) => void;
  fileProcessingOptions?: FileProcessingOptions;
}

export const useFileProcessing = (
  options: UseFileProcessingOptions = {}
): UseFileProcessingReturn => {
  const {
    maxFiles = 5,
    onFileProcessed,
    onError,
    fileProcessingOptions,
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [error, setError] = useState<AppError | null>(null);

  /**
   * Process single file
   */
  const processSingleFile = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setIsProcessing(true);

        // Validate file
        const validation = validateFile(file, fileProcessingOptions);
        if (!validation.valid) {
          const appError = new Error(validation.error);
          const err = handleApiError(appError);
          setError(err);
          onError?.(err);
          logger.warn('File validation failed', { filename: file.name, error: validation.error });
          return { success: false, error: validation.error };
        }

        // Process file
        const result = await processFile(file, fileProcessingOptions);

        if (!result.success) {
          const appError = new Error(result.error);
          const err = handleApiError(appError);
          setError(err);
          onError?.(err);
          logger.error('File processing failed', new Error(result.error));
          return result;
        }

        if (result.file) {
          setProcessedFiles(prev => [...prev, result.file]);
          onFileProcessed?.(result.file);
          logger.debug('File processed successfully', { filename: file.name });
        }

        return result;
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        onError?.(appError);
        logger.error('File processing error', err as Error);
        return { success: false, error: appError.message };
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileProcessed, onError, fileProcessingOptions]
  );

  /**
   * Process multiple files
   */
  const processMultiple = useCallback(
    async (files: File[]) => {
      try {
        setError(null);
        setIsProcessing(true);

        if (files.length > maxFiles) {
          const appError = new Error(`Maximum ${maxFiles} files allowed`);
          const err = handleApiError(appError);
          setError(err);
          onError?.(err);
          return;
        }

        const results = await processMultipleFiles(files, fileProcessingOptions);

        const successful: ProcessedFile[] = [];
        const failed: string[] = [];

        results.forEach(result => {
          if (result.success && result.file) {
            successful.push(result.file);
            onFileProcessed?.(result.file);
          } else {
            failed.push(result.error || 'Unknown error');
          }
        });

        setProcessedFiles(prev => [...prev, ...successful]);

        if (failed.length > 0) {
          logger.warn('Some files failed to process', { failed });
        }

        logger.debug('Batch file processing completed', {
          successful: successful.length,
          failed: failed.length,
        });
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        onError?.(appError);
        logger.error('Batch file processing error', err as Error);
      } finally {
        setIsProcessing(false);
      }
    },
    [maxFiles, onFileProcessed, onError, fileProcessingOptions]
  );

  /**
   * Clear files
   */
  const clearFiles = useCallback(() => {
    setProcessedFiles([]);
    setError(null);
    logger.debug('Processed files cleared');
  }, []);

  /**
   * Remove file by index
   */
  const removeFile = useCallback((index: number) => {
    setProcessedFiles(prev => prev.filter((_, i) => i !== index));
    logger.debug(`File removed at index ${index}`);
  }, []);

  /**
   * Get file by name
   */
  const getFileByName = useCallback(
    (name: string): ProcessedFile | undefined => {
      return processedFiles.find(f => f.name === name);
    },
    [processedFiles]
  );

  /**
   * Get extracted texts
   */
  const getExtractedTexts = useCallback((): string[] => {
    return processedFiles.map(f => f.extractedText);
  }, [processedFiles]);

  /**
   * Get combined text
   */
  const getCombinedText = useCallback((): string => {
    return processedFiles
      .map((f, i) => `--- File ${i + 1}: ${f.name} ---\n${f.extractedText}`)
      .join('\n\n');
  }, [processedFiles]);

  return {
    isProcessing,
    processedFiles,
    processSingleFile,
    processMultiple,
    clearFiles,
    removeFile,
    getFileByName,
    getExtractedTexts,
    getCombinedText,
    error,
  };
};

export default useFileProcessing;

