/**
 * FileUploadArea - Drag and drop file upload component
 */

import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, FileIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FileUploadAreaProps } from './types';
import { logger } from '@/utils/logger';
import { formatFileSize, getFileIcon } from '@/utils/fileProcessing';
import { getFileType } from '@/utils/fileProcessing';
import { FILE_CONFIG } from '@/utils/constants';

export const FileUploadArea = React.memo(
  ({
    onFilesSelected,
    uploadedFiles = [],
    onFileRemove,
    isProcessing = false,
    disabled = false,
    maxFiles = FILE_CONFIG.MAX_FILES,
  }: FileUploadAreaProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files || []);
      handleFiles(files);
    };

    const handleClick = () => {
      if (!disabled && uploadedFiles.length < maxFiles) {
        fileInputRef.current?.click();
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.currentTarget.files || []);
      handleFiles(files);
      e.currentTarget.value = '';
    };

    const handleFiles = (files: File[]) => {
      if (files.length === 0) return;

      // Validate total file count
      if (uploadedFiles.length + files.length > maxFiles) {
        logger.warn('Too many files', {
          current: uploadedFiles.length,
          new: files.length,
          max: maxFiles,
        });
        return;
      }

      // Validate file sizes and formats
      const validFiles: File[] = [];
      files.forEach(file => {
        if (file.size > FILE_CONFIG.MAX_FILE_SIZE) {
          logger.warn('File too large', { name: file.name, size: file.size });
          return;
        }

        if (!FILE_CONFIG.ALLOWED_FORMATS.ALL.includes(file.type)) {
          logger.warn('Invalid file type', { name: file.name, type: file.type });
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        logger.debug('Files selected', { count: validFiles.length });
        onFilesSelected(validFiles);
      }
    };

    const handleRemoveFile = (index: number) => {
      logger.debug('Removing file', { index });
      onFileRemove?.(index);
    };

    const renderFileIcon = (file: File) => {
      const type = getFileType(file);
      switch (type) {
        case 'pdf':
          return <FileIcon className="h-4 w-4 text-red-500" />;
        case 'image':
          return <ImageIcon className="h-4 w-4 text-blue-500" />;
        case 'text':
          return <FileText className="h-4 w-4 text-green-500" />;
        default:
          return <FileIcon className="h-4 w-4 text-muted-foreground" />;
      }
    };

    const canAddMore = uploadedFiles.length < maxFiles && !disabled;

    return (
      <div className="space-y-2 rounded-lg border border-border bg-background p-4">
        {/* Upload area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Перетащите файлы сюда или{' '}
            <span className="text-primary">кликните для выбора</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Максимум {maxFiles} файлов, до {formatFileSize(FILE_CONFIG.MAX_FILE_SIZE)} каждый
          </p>
        </div>

        {/* File list */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Загруженные файлы ({uploadedFiles.length}):</p>
            <div className="space-y-1">
              {uploadedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded bg-muted p-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {renderFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  {isProcessing && index === uploadedFiles.length - 1 ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isProcessing}
                      className="h-6 w-6 p-0"
                      title="Удалить файл"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">PDF</Badge>
          <Badge variant="secondary">PNG/JPG</Badge>
          <Badge variant="secondary">TXT</Badge>
          {!canAddMore && (
            <Badge variant="destructive">Максимум файлов</Badge>
          )}
        </div>
      </div>
    );
  }
);

FileUploadArea.displayName = 'FileUploadArea';

export default FileUploadArea;

