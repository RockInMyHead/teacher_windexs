import { describe, it, expect } from 'vitest'
import { getCEFRScore, getCEFRLevelName, getCEFRLevelDescription, CEFRLevel } from '@/lib/CEFRUtils'

describe('CEFR Scoring System', () => {
  describe('getCEFRScore', () => {
    it('should return C2 for scores 90-100', () => {
      expect(getCEFRScore(90)).toEqual({ level: 'C2', score: 90 })
      expect(getCEFRScore(95)).toEqual({ level: 'C2', score: 95 })
      expect(getCEFRScore(100)).toEqual({ level: 'C2', score: 100 })
    })

    it('should return C1 for scores 80-89', () => {
      expect(getCEFRScore(80)).toEqual({ level: 'C1', score: 80 })
      expect(getCEFRScore(85)).toEqual({ level: 'C1', score: 85 })
      expect(getCEFRScore(89)).toEqual({ level: 'C1', score: 89 })
    })

    it('should return B2 for scores 70-79', () => {
      expect(getCEFRScore(70)).toEqual({ level: 'B2', score: 70 })
      expect(getCEFRScore(75)).toEqual({ level: 'B2', score: 75 })
      expect(getCEFRScore(79)).toEqual({ level: 'B2', score: 79 })
    })

    it('should return B1 for scores 60-69', () => {
      expect(getCEFRScore(60)).toEqual({ level: 'B1', score: 60 })
      expect(getCEFRScore(65)).toEqual({ level: 'B1', score: 65 })
      expect(getCEFRScore(69)).toEqual({ level: 'B1', score: 69 })
    })

    it('should return A2 for scores 40-59', () => {
      expect(getCEFRScore(40)).toEqual({ level: 'A2', score: 40 })
      expect(getCEFRScore(50)).toEqual({ level: 'A2', score: 50 })
      expect(getCEFRScore(59)).toEqual({ level: 'A2', score: 59 })
    })

    it('should return A1 for scores below 40', () => {
      expect(getCEFRScore(0)).toEqual({ level: 'A1', score: 0 })
      expect(getCEFRScore(20)).toEqual({ level: 'A1', score: 20 })
      expect(getCEFRScore(39)).toEqual({ level: 'A1', score: 39 })
    })

    it('should handle edge cases', () => {
      expect(getCEFRScore(0)).toEqual({ level: 'A1', score: 0 })
      expect(getCEFRScore(100)).toEqual({ level: 'C2', score: 100 })
    })
  })

  describe('getCEFRLevelName', () => {
    it('should return correct Russian names for all levels', () => {
      expect(getCEFRLevelName('A1')).toBe('Элементарный (A1)')
      expect(getCEFRLevelName('A2')).toBe('Базовый (A2)')
      expect(getCEFRLevelName('B1')).toBe('Средний (B1)')
      expect(getCEFRLevelName('B2')).toBe('Выше среднего (B2)')
      expect(getCEFRLevelName('C1')).toBe('Продвинутый (C1)')
      expect(getCEFRLevelName('C2')).toBe('В совершенстве (C2)')
    })
  })

  describe('getCEFRLevelDescription', () => {
    it('should return appropriate descriptions for each level', () => {
      expect(getCEFRLevelDescription('A1')).toContain('повседневные выражения')
      expect(getCEFRLevelDescription('A2')).toContain('предложения и часто используемые выражения')
      expect(getCEFRLevelDescription('B1')).toContain('основные идеи ясных сообщений')
      expect(getCEFRLevelDescription('B2')).toContain('основные идеи сложных текстов')
      expect(getCEFRLevelDescription('C1')).toContain('широкий спектр сложных длинных текстов')
      expect(getCEFRLevelDescription('C2')).toContain('практически всё, что слышу или читаю')
    })

    it('should return non-empty descriptions', () => {
      const levels: ('A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

      levels.forEach(level => {
        const description = getCEFRLevelDescription(level)
        expect(description).toBeTruthy()
        expect(description.length).toBeGreaterThan(10)
        expect(typeof description).toBe('string')
      })
    })
  })

  describe('CEFR Level Ranges', () => {
    it('should have logical score ranges for each level', () => {
      // A1: 0-39
      for (let score = 0; score <= 39; score++) {
        expect(getCEFRScore(score).level).toBe('A1')
      }

      // A2: 40-59
      for (let score = 40; score <= 59; score++) {
        expect(getCEFRScore(score).level).toBe('A2')
      }

      // B1: 60-69
      for (let score = 60; score <= 69; score++) {
        expect(getCEFRScore(score).level).toBe('B1')
      }

      // B2: 70-79
      for (let score = 70; score <= 79; score++) {
        expect(getCEFRScore(score).level).toBe('B2')
      }

      // C1: 80-89
      for (let score = 80; score <= 89; score++) {
        expect(getCEFRScore(score).level).toBe('C1')
      }

      // C2: 90-100
      for (let score = 90; score <= 100; score++) {
        expect(getCEFRScore(score).level).toBe('C2')
      }
    })

    it('should maintain score accuracy', () => {
      expect(getCEFRScore(42).score).toBe(42)
      expect(getCEFRScore(73).score).toBe(73)
      expect(getCEFRScore(91).score).toBe(91)
    })
  })

  describe('CEFR Scoring Integration', () => {
    it('should work with typical assessment results', () => {
      // Beginner level assessment (typically 20-40%)
      const beginnerResult = getCEFRScore(35)
      expect(beginnerResult.level).toBe('A1')
      expect(beginnerResult.score).toBe(35)

      // Intermediate level assessment (typically 50-70%)
      const intermediateResult = getCEFRScore(65)
      expect(intermediateResult.level).toBe('B1')
      expect(intermediateResult.score).toBe(65)

      // Advanced level assessment (typically 80-95%)
      const advancedResult = getCEFRScore(88)
      expect(advancedResult.level).toBe('C1')
      expect(advancedResult.score).toBe(88)
    })

    it('should handle perfect scores', () => {
      const perfectResult = getCEFRScore(100)
      expect(perfectResult.level).toBe('C2')
      expect(perfectResult.score).toBe(100)
    })

    it('should handle zero scores', () => {
      const zeroResult = getCEFRScore(0)
      expect(zeroResult.level).toBe('A1')
      expect(zeroResult.score).toBe(0)
    })
  })
})
