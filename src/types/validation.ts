/**
 * Validation Types & Schemas
 * Type-safe validation utilities for the application
 */

import type { Message, AssessmentQuestion, AssessmentResult } from './index';

/**
 * Validation result
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Single validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * Validator function type
 */
export type Validator<T> = (value: any) => ValidationResult<T>;

/**
 * Validation rules
 */
export interface ValidationRules<T> {
  [key: string]: Validator<any>;
}

/**
 * Type guard for string
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

/**
 * Type guard for number
 */
export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Type guard for boolean
 */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Type guard for array
 */
export const isArray = <T,>(value: any): value is T[] => {
  return Array.isArray(value);
};

/**
 * Type guard for object
 */
export const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Type guard for Date
 */
export const isDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

/**
 * Type guard for Message
 */
export const isMessage = (value: any): value is Message => {
  return (
    isObject(value) &&
    isString(value.id) &&
    (value.role === 'user' || value.role === 'assistant') &&
    isString(value.content) &&
    isDate(value.timestamp)
  );
};

/**
 * Type guard for array of Messages
 */
export const isMessageArray = (value: any): value is Message[] => {
  return isArray<Message>(value) && value.every(isMessage);
};

/**
 * Validator for Message
 */
export const validateMessage = (value: any): ValidationResult<Message> => {
  if (!isObject(value)) {
    return {
      isValid: false,
      errors: [{ field: 'message', message: 'Must be an object', code: 'INVALID_TYPE' }],
    };
  }

  const errors: ValidationError[] = [];

  if (!isString(value.id) || value.id.length === 0) {
    errors.push({ field: 'id', message: 'ID must be a non-empty string', code: 'INVALID_ID' });
  }

  if (value.role !== 'user' && value.role !== 'assistant') {
    errors.push({ field: 'role', message: 'Role must be "user" or "assistant"', code: 'INVALID_ROLE' });
  }

  if (!isString(value.content) || value.content.length === 0) {
    errors.push({ field: 'content', message: 'Content must be a non-empty string', code: 'INVALID_CONTENT' });
  }

  if (!isDate(value.timestamp)) {
    errors.push({ field: 'timestamp', message: 'Timestamp must be a valid Date', code: 'INVALID_TIMESTAMP' });
  }

  return errors.length === 0
    ? { isValid: true, data: value as Message }
    : { isValid: false, errors };
};

/**
 * Validator for array of Messages
 */
export const validateMessageArray = (value: any): ValidationResult<Message[]> => {
  if (!isArray<Message>(value)) {
    return {
      isValid: false,
      errors: [{ field: 'messages', message: 'Must be an array', code: 'INVALID_TYPE' }],
    };
  }

  const errors: ValidationError[] = [];

  value.forEach((msg, index) => {
    const result = validateMessage(msg);
    if (!result.isValid && result.errors) {
      errors.push(
        ...result.errors.map(err => ({
          ...err,
          field: `messages[${index}].${err.field}`,
        }))
      );
    }
  });

  return errors.length === 0
    ? { isValid: true, data: value }
    : { isValid: false, errors };
};

/**
 * Type guard for AssessmentQuestion
 */
export const isAssessmentQuestion = (value: any): value is AssessmentQuestion => {
  return (
    isObject(value) &&
    isString(value.concept) &&
    isString(value.question) &&
    isArray<string>(value.options) &&
    isNumber(value.correctAnswerIndex)
  );
};

/**
 * Validator for AssessmentQuestion
 */
export const validateAssessmentQuestion = (value: any): ValidationResult<AssessmentQuestion> => {
  if (!isObject(value)) {
    return {
      isValid: false,
      errors: [{ field: 'question', message: 'Must be an object', code: 'INVALID_TYPE' }],
    };
  }

  const errors: ValidationError[] = [];

  if (!isString(value.concept) || value.concept.length === 0) {
    errors.push({ field: 'concept', message: 'Concept must be a non-empty string', code: 'INVALID_CONCEPT' });
  }

  if (!isString(value.question) || value.question.length === 0) {
    errors.push({ field: 'question', message: 'Question must be a non-empty string', code: 'INVALID_QUESTION' });
  }

  if (!isArray<string>(value.options) || value.options.length < 2) {
    errors.push({ field: 'options', message: 'Options must be an array with at least 2 items', code: 'INVALID_OPTIONS' });
  }

  if (!isNumber(value.correctAnswerIndex) || value.correctAnswerIndex < 0) {
    errors.push({
      field: 'correctAnswerIndex',
      message: 'Correct answer index must be a non-negative number',
      code: 'INVALID_INDEX',
    });
  }

  return errors.length === 0
    ? { isValid: true, data: value as AssessmentQuestion }
    : { isValid: false, errors };
};

/**
 * File size validator
 */
export const validateFileSize = (file: File, maxSizeBytes: number): ValidationResult => {
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errors: [
        {
          field: 'fileSize',
          message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSizeBytes / 1024 / 1024).toFixed(2)}MB`,
          code: 'FILE_TOO_LARGE',
          value: file.size,
        },
      ],
    };
  }

  return { isValid: true };
};

/**
 * File type validator
 */
export const validateFileType = (file: File, allowedTypes: string[]): ValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      errors: [
        {
          field: 'fileType',
          message: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`,
          code: 'INVALID_FILE_TYPE',
          value: file.type,
        },
      ],
    };
  }

  return { isValid: true };
};

/**
 * Email validator
 */
export const validateEmail = (email: any): ValidationResult<string> => {
  if (!isString(email)) {
    return {
      isValid: false,
      errors: [{ field: 'email', message: 'Email must be a string', code: 'INVALID_TYPE' }],
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errors: [{ field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' }],
    };
  }

  return { isValid: true, data: email };
};

/**
 * URL validator
 */
export const validateUrl = (url: any): ValidationResult<string> => {
  if (!isString(url)) {
    return {
      isValid: false,
      errors: [{ field: 'url', message: 'URL must be a string', code: 'INVALID_TYPE' }],
    };
  }

  try {
    new URL(url);
    return { isValid: true, data: url };
  } catch {
    return {
      isValid: false,
      errors: [{ field: 'url', message: 'Invalid URL format', code: 'INVALID_FORMAT' }],
    };
  }
};

/**
 * String length validator
 */
export const validateStringLength = (
  value: any,
  min: number,
  max: number
): ValidationResult<string> => {
  if (!isString(value)) {
    return {
      isValid: false,
      errors: [{ field: 'value', message: 'Must be a string', code: 'INVALID_TYPE' }],
    };
  }

  if (value.length < min || value.length > max) {
    return {
      isValid: false,
      errors: [
        {
          field: 'value',
          message: `String length must be between ${min} and ${max} characters`,
          code: 'INVALID_LENGTH',
          value: value.length,
        },
      ],
    };
  }

  return { isValid: true, data: value };
};

/**
 * Number range validator
 */
export const validateNumberRange = (
  value: any,
  min: number,
  max: number
): ValidationResult<number> => {
  if (!isNumber(value)) {
    return {
      isValid: false,
      errors: [{ field: 'value', message: 'Must be a number', code: 'INVALID_TYPE' }],
    };
  }

  if (value < min || value > max) {
    return {
      isValid: false,
      errors: [
        {
          field: 'value',
          message: `Number must be between ${min} and ${max}`,
          code: 'INVALID_RANGE',
          value,
        },
      ],
    };
  }

  return { isValid: true, data: value };
};

/**
 * Enum validator
 */
export const validateEnum = <T,>(value: any, enumValues: T[]): ValidationResult<T> => {
  if (!enumValues.includes(value as T)) {
    return {
      isValid: false,
      errors: [
        {
          field: 'value',
          message: `Value must be one of: ${enumValues.join(', ')}`,
          code: 'INVALID_ENUM',
          value,
        },
      ],
    };
  }

  return { isValid: true, data: value as T };
};

/**
 * Compose multiple validators
 */
export const composeValidators =
  <T,>(...validators: Validator<T>[]): Validator<T> =>
  (value: any) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, data: value };
  };

export default {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isDate,
  isMessage,
  isMessageArray,
  isAssessmentQuestion,
  validateMessage,
  validateMessageArray,
  validateAssessmentQuestion,
  validateFileSize,
  validateFileType,
  validateEmail,
  validateUrl,
  validateStringLength,
  validateNumberRange,
  validateEnum,
  composeValidators,
};

