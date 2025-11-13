/**
 * Advanced Type Guards & Utilities
 * Type-safe predicates and utilities for runtime type checking
 */

import type { Message, AssessmentQuestion, AssessmentResult } from '@/types';
import type { Result, BaseError } from '@/types/errors';

/**
 * Type guard: is value nullable
 */
export const isNullable = <T,>(value: T | null | undefined): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Type guard: is value not nullable
 */
export const isNotNullable = <T,>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Type guard: is value truthy
 */
export const isTruthy = <T,>(value: T | null | undefined | false | 0 | ''): value is T => {
  return Boolean(value);
};

/**
 * Type guard: has property
 */
export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, any> => {
  return key in obj;
};

/**
 * Type guard: has own property
 */
export const hasOwnProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, any> => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Type guard: is instance of
 */
export const isInstanceOf = <T,>(value: any, ctor: new (...args: any[]) => T): value is T => {
  return value instanceof ctor;
};

/**
 * Type guard: is Result success
 */
export const isResultSuccess = <T,>(result: Result<T>): result is { success: true; data: T } => {
  return result.success === true;
};

/**
 * Type guard: is Result error
 */
export const isResultError = (result: any): result is { success: false; error: BaseError } => {
  return result.success === false;
};

/**
 * Type guard for callable
 */
export const isCallable = (value: any): value is (...args: any[]) => any => {
  return typeof value === 'function';
};

/**
 * Type guard for async callable
 */
export const isAsyncCallable = (value: any): value is (...args: any[]) => Promise<any> => {
  return isCallable(value);
};

/**
 * Type guard: is plain object
 */
export const isPlainObject = (value: any): value is Record<string, any> => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

/**
 * Type guard: is Message
 */
export const isMessageType = (value: any): value is Message => {
  return (
    isPlainObject(value) &&
    typeof value.id === 'string' &&
    (value.role === 'user' || value.role === 'assistant') &&
    typeof value.content === 'string' &&
    value.timestamp instanceof Date
  );
};

/**
 * Type guard: is AssessmentQuestion
 */
export const isAssessmentQuestionType = (value: any): value is AssessmentQuestion => {
  return (
    isPlainObject(value) &&
    typeof value.concept === 'string' &&
    typeof value.question === 'string' &&
    Array.isArray(value.options) &&
    typeof value.correctAnswerIndex === 'number'
  );
};

/**
 * Type guard: is AssessmentResult
 */
export const isAssessmentResultType = (value: any): value is AssessmentResult => {
  return (
    isPlainObject(value) &&
    typeof value.cluster === 'string' &&
    typeof value.score === 'number'
  );
};

/**
 * Ensure type at runtime
 */
export const ensureType = <T,>(
  value: any,
  predicate: (value: any) => value is T,
  message: string
): T => {
  if (!predicate(value)) {
    throw new TypeError(message);
  }
  return value;
};

/**
 * Assert type at runtime
 */
export const assertType = <T,>(
  value: any,
  predicate: (value: any) => value is T,
  message: string
): asserts value is T => {
  if (!predicate(value)) {
    throw new TypeError(message);
  }
};

/**
 * Type narrowing helper
 */
export const narrows = <T,>(value: any, predicate: (value: any) => value is T): T | null => {
  return predicate(value) ? value : null;
};

/**
 * Deep freeze object
 */
export const deepFreeze = <T extends object>(obj: T): Readonly<T> => {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach(prop => {
    const val = (obj as any)[prop];

    if (val !== null && (typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });

  return obj as Readonly<T>;
};

/**
 * Deep equals
 */
export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEquals(a[key], b[key]));
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T,>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

/**
 * Safe object access
 */
export const safeGet = <T,>(obj: any, path: string, fallback?: T): T | undefined => {
  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result == null) {
      return fallback;
    }
    result = result[key];
  }

  return result ?? fallback;
};

/**
 * Type-safe object entries
 */
export const typedEntries = <T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> => {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
};

/**
 * Type-safe object keys
 */
export const typedKeys = <T extends Record<string, any>>(obj: T): Array<keyof T> => {
  return Object.keys(obj) as Array<keyof T>;
};

/**
 * Type-safe object values
 */
export const typedValues = <T extends Record<string, any>>(obj: T): Array<T[keyof T]> => {
  return Object.values(obj) as Array<T[keyof T]>;
};

/**
 * Omit properties from object type
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

/**
 * Pick properties from object type
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
};

/**
 * Merge objects with type safety
 */
export const merge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  return Object.assign({}, target, ...sources);
};

/**
 * Assign properties with type safety
 */
export const assign = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  return Object.assign(target, ...sources);
};

export default {
  isNullable,
  isNotNullable,
  isTruthy,
  hasProperty,
  hasOwnProperty,
  isInstanceOf,
  isResultSuccess,
  isResultError,
  isCallable,
  isAsyncCallable,
  isPlainObject,
  isMessageType,
  isAssessmentQuestionType,
  isAssessmentResultType,
  ensureType,
  assertType,
  narrows,
  deepFreeze,
  deepEquals,
  safeJsonParse,
  safeGet,
  typedEntries,
  typedKeys,
  typedValues,
  omit,
  pick,
  merge,
  assign,
};

