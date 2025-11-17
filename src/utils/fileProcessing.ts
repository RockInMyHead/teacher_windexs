/**
 * File processing utility functions
 */

import type { ProcessedFile, FileProcessingResult, FileProcessingOptions } from '@/types';
import { logger } from './logger';

const DEFAULT_OPTIONS: FileProcessingOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
  compressImages: true,
};

/**
 * Validate file before processing
 */
export const validateFile = (
  file: File,
  options: FileProcessingOptions = {}
): { valid: boolean; error?: string } => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Check file size
  if (mergedOptions.maxSize && file.size > mergedOptions.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${mergedOptions.maxSize / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (mergedOptions.allowedFormats && !mergedOptions.allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
};

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // This requires pdfjs-dist which is already in dependencies
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf');

    // Set up worker
    const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
    const pdfjsDistPath = '/node_modules/pdfjs-dist/legacy/build';

    const fileData = await file.arrayBuffer();
    const pdf = await getDocument({ data: fileData }).promise;

    let fullText = '';

    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      // Limit to first 50 pages
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    logger.debug(`Extracted ${fullText.length} characters from PDF`);
    return fullText;
  } catch (error) {
    logger.error('Failed to extract text from PDF', error as Error);
    throw new Error('Could not extract text from PDF');
  }
};

/**
 * Extract text from image using OCR (if available)
 * For now, returns error message
 */
export const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    // This would require Tesseract.js or similar
    // For now, return placeholder
    logger.warn('OCR not yet implemented for image files');
    return `[Image: ${file.name}]`;
  } catch (error) {
    logger.error('Failed to extract text from image', error as Error);
    throw new Error('Could not extract text from image');
  }
};

/**
 * Read file as text
 */
export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Compress image file
 */
export const compressImage = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Calculate new dimensions (max 1024px)
          let { width, height } = img;
          const maxDim = 1024;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not create blob'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              });

              logger.debug(
                `Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(
                  compressedFile.size / 1024
                ).toFixed(2)}KB`
              );
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };

        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Determine file type
 */
export const getFileType = (
  file: File
): 'pdf' | 'image' | 'text' | 'unknown' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('text/')) return 'text';
  return 'unknown';
};

/**
 * Process file (main function)
 */
export const processFile = async (
  file: File,
  options: FileProcessingOptions = {}
): Promise<FileProcessingResult> => {
  try {
    // Validate file
    const validation = validateFile(file, options);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    let extractedText = '';
    let processedFile = file;
    const fileType = getFileType(file);

    // Process based on type
    if (fileType === 'pdf') {
      extractedText = await extractTextFromPDF(file);
    } else if (fileType === 'image') {
      if (options.compressImages) {
        processedFile = await compressImage(file);
      }
      extractedText = await extractTextFromImage(processedFile);
    } else if (fileType === 'text') {
      extractedText = await readFileAsText(file);
    } else {
      return {
        success: false,
        error: 'Unsupported file type',
      };
    }

    const result: ProcessedFile = {
      originalFile: file,
      extractedText,
      fileType,
      size: processedFile.size,
      name: file.name,
    };

    logger.debug(`File processed successfully: ${file.name}`);
    return { success: true, file: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to process file: ${message}`, error as Error);
    return {
      success: false,
      error: message,
    };
  }
};

/**
 * Process multiple files
 */
export const processMultipleFiles = async (
  files: File[],
  options: FileProcessingOptions = {}
): Promise<FileProcessingResult[]> => {
  return Promise.all(files.map(file => processFile(file, options)));
};

/**
 * Get file icon based on type
 */
export const getFileIcon = (fileType: 'pdf' | 'image' | 'text' | 'unknown'): string => {
  const icons: Record<string, string> = {
    pdf: '📄',
    image: '🖼️',
    text: '📝',
    unknown: '📎',
  };
  return icons[fileType] || icons.unknown;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

