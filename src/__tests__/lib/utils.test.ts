import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    expect(cn('class1', null, 'class2')).toBe('class1 class2')
  })

  it('should handle Tailwind CSS class conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('bg-white', 'bg-black')).toBe('bg-black')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const isDisabled = false

    expect(cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )).toBe('base-class active-class')

    expect(cn(
      'base-class',
      isActive ? 'active-class' : 'inactive-class'
    )).toBe('base-class active-class')
  })

  it('should handle arrays and objects', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
    expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(undefined, null, '')).toBe('')
  })
})

