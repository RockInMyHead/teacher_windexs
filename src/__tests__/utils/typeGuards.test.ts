/**
 * Unit tests for typeGuards utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isDate,
  isMessage,
  isMessageArray,
  isAssessmentQuestion,
  validateAssessmentQuestion,
} from '../../types/validation';

import {
  ensureType,
  assertType,
  safeJsonParse,
  safeGet,
  typedKeys,
  typedValues,
  omit,
  pick,
  merge,
  assign,
} from '../../utils/typeGuards';

describe('Type Guards', () => {
  describe('Basic type guards', () => {
    it('isString should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });

    it('isNumber should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber('123')).toBe(false);
    });

    it('isBoolean should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });

    it('isArray should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
      expect(isArray(null)).toBe(false);
    });

    it('isObject should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });

    it('isDate should return true for Date instances', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2023-01-01'))).toBe(true);
      expect(isDate(new Date('invalid'))).toBe(false);
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(1234567890)).toBe(false);
    });
  });

  describe('Complex type guards', () => {
    it('isMessage should validate Message objects', () => {
      const validMessage = {
        id: 'msg-1',
        role: 'user' as const,
        content: 'Hello',
        timestamp: new Date(),
      };

      const invalidMessage = {
        id: 123, // should be string
        role: 'invalid', // should be 'user' | 'assistant'
        content: '',
        timestamp: 'invalid', // should be Date
      };

      expect(isMessage(validMessage)).toBe(true);
      expect(isMessage(invalidMessage)).toBe(false);
      expect(isMessage({})).toBe(false);
      expect(isMessage(null)).toBe(false);
    });

    it('isMessageArray should validate arrays of Messages', () => {
      const validMessages = [
        {
          id: 'msg-1',
          role: 'user' as const,
          content: 'Hello',
          timestamp: new Date(),
        },
        {
          id: 'msg-2',
          role: 'assistant' as const,
          content: 'Hi there!',
          timestamp: new Date(),
        },
      ];

      const invalidMessages = [
        {
          id: 'msg-1',
          role: 'user' as const,
          content: 'Hello',
          timestamp: new Date(),
        },
        {
          id: 'msg-2',
          role: 'invalid' as any, // invalid role
          content: 'Hi there!',
          timestamp: new Date(),
        },
      ];

      expect(isMessageArray(validMessages)).toBe(true);
      expect(isMessageArray(invalidMessages)).toBe(false);
      expect(isMessageArray([])).toBe(true);
      expect(isMessageArray([1, 2, 3])).toBe(false);
    });

    it('isAssessmentQuestion should validate AssessmentQuestion objects', () => {
      const validQuestion = {
        concept: 'Math',
        question: 'What is 2+2?',
        options: ['3', '4', '5'],
        correctAnswerIndex: 1,
      };

      const invalidQuestion = {
        concept: '', // empty concept
        question: 'What is 2+2?',
        options: ['3'], // only one option
        correctAnswerIndex: -1, // negative index
      };

      expect(isAssessmentQuestion(validQuestion)).toBe(true);
      expect(isAssessmentQuestion(invalidQuestion)).toBe(true); // Type guard only checks types, not business logic
      expect(isAssessmentQuestion({})).toBe(false);
    });
  });

  describe('Type safety utilities', () => {
    it('ensureType should return value if valid or throw', () => {
      expect(ensureType('hello', isString, 'Not a string')).toBe('hello');
      expect(() => ensureType(123, isString, 'Not a string')).toThrow('Not a string');
    });

    it('assertType should throw if invalid', () => {
      expect(() => assertType('hello', isString, 'Not a string')).not.toThrow();
      expect(() => assertType(123, isString, 'Not a string')).toThrow('Not a string');
    });
  });

  describe('Safe access utilities', () => {
    const testObj = {
      user: {
        name: 'John',
        profile: {
          age: 30,
          email: 'john@example.com',
        },
      },
      items: ['a', 'b', 'c'],
    };

    it('safeGet should safely access nested properties', () => {
      expect(safeGet(testObj, 'user.name')).toBe('John');
      expect(safeGet(testObj, 'user.profile.email')).toBe('john@example.com');
      expect(safeGet(testObj, 'user.profile.phone', 'N/A')).toBe('N/A');
      expect(safeGet(testObj, 'nonexistent.deep.path', 'default')).toBe('default');
    });

    it('safeJsonParse should safely parse JSON', () => {
      expect(safeJsonParse('{"name": "John"}', {})).toEqual({ name: 'John' });
      expect(safeJsonParse('invalid json', { fallback: true })).toEqual({ fallback: true });
      expect(safeJsonParse('', { fallback: true })).toEqual({ fallback: true });
    });
  });

  describe('Typed collection utilities', () => {
    const testObj = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };

    it('typedKeys should return typed keys', () => {
      const keys = typedKeys(testObj);
      expect(keys).toEqual(['name', 'age', 'email']);
      expect(typeof keys[0]).toBe('string'); // keyof T
    });

    it('typedValues should return typed values', () => {
      const values = typedValues(testObj);
      expect(values).toEqual(['John', 30, 'john@example.com']);
    });
  });

  describe('Object manipulation utilities', () => {
    const testObj = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      password: 'secret',
    };

    it('omit should exclude specified keys', () => {
      const result = omit(testObj, 'password', 'age');
      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('age');
    });

    it('pick should include only specified keys', () => {
      const result = pick(testObj, 'name', 'email');
      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
      expect(result).not.toHaveProperty('age');
      expect(result).not.toHaveProperty('password');
    });

    it('merge should merge objects', () => {
      const result = merge(testObj, { name: 'Jane', city: 'NYC' });
      expect(result).toEqual({
        name: 'Jane', // overwritten
        age: 30,
        email: 'john@example.com',
        password: 'secret',
        city: 'NYC', // added
      });
    });

    it('assign should assign properties', () => {
      const target = { ...testObj };
      const result = assign(target, { name: 'Jane', city: 'NYC' });
      expect(result).toBe(target); // same reference
      expect(result.name).toBe('Jane');
      expect(result.city).toBe('NYC');
    });
  });
});
