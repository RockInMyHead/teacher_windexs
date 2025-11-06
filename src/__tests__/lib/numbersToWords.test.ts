import { describe, it, expect } from 'vitest'
import { numberToWords, replaceNumbersInText } from '@/lib/numbersToWords'

describe('numberToWords', () => {
  it('should convert basic numbers correctly', () => {
    expect(numberToWords(0)).toBe('ноль')
    expect(numberToWords(1)).toBe('один')
    expect(numberToWords(5)).toBe('пять')
    expect(numberToWords(10)).toBe('десять')
    expect(numberToWords(15)).toBe('пятнадцать')
    expect(numberToWords(20)).toBe('двадцать')
    expect(numberToWords(25)).toBe('двадцать пять')
  })

  it('should convert tens correctly', () => {
    expect(numberToWords(30)).toBe('тридцать')
    expect(numberToWords(40)).toBe('сорок')
    expect(numberToWords(50)).toBe('пятьдесят')
    expect(numberToWords(90)).toBe('девяносто')
  })

  it('should convert hundreds correctly', () => {
    expect(numberToWords(100)).toBe('сто')
    expect(numberToWords(200)).toBe('двести')
    expect(numberToWords(300)).toBe('триста')
    expect(numberToWords(400)).toBe('четыреста')
    expect(numberToWords(500)).toBe('пятьсот')
  })

  it('should convert complex numbers correctly', () => {
    expect(numberToWords(123)).toBe('сто двадцать три')
    expect(numberToWords(456)).toBe('четыреста пятьдесят шесть')
    expect(numberToWords(789)).toBe('семьсот восемьдесят девять')
    expect(numberToWords(999)).toBe('девятьсот девяносто девять')
  })

  it('should convert thousands correctly', () => {
    expect(numberToWords(1000)).toBe('одна тысяча')
    expect(numberToWords(2000)).toBe('две тысячи')
    expect(numberToWords(5000)).toBe('пять тысяч')
    expect(numberToWords(11000)).toBe('одиннадцать тысяч')
  })

  it('should convert large numbers correctly', () => {
    expect(numberToWords(1000000)).toBe('один миллион')
    expect(numberToWords(2000000)).toBe('два миллиона')
    expect(numberToWords(15000000)).toBe('пятнадцать миллионов')
  })

  it('should convert complex large numbers correctly', () => {
    expect(numberToWords(1234567)).toBe('один миллион двести тридцать четыре тысяч пятьсот шестьдесят семь')
    expect(numberToWords(999999)).toBe('девятьсот девяносто девять тысяч девятьсот девяносто девять')
  })
})

describe('replaceNumbersInText', () => {
  it('should replace numbers in regular text', () => {
    expect(replaceNumbersInText('У меня 5 яблок'))
      .toBe('У меня пять яблок')

    expect(replaceNumbersInText('В классе 25 учеников'))
      .toBe('В классе двадцать пять учеников')

    expect(replaceNumbersInText('Цена 150 рублей'))
      .toBe('Цена сто пятьдесят рублей')
  })

  it('should handle dates correctly', () => {
    expect(replaceNumbersInText('12 апреля 2023 года'))
      .toBe('двенадцатого апреля две тысячи двадцать третьего года')

    expect(replaceNumbersInText('23 февраля 1991 года'))
      .toBe('двадцать третьего февраля одна тысяча девятьсот девяносто первого года')
  })

  it('should not replace day numbers in dates', () => {
    const result = replaceNumbersInText('12 апреля 2023 года')
    expect(result).toContain('двенадцатого апреля')
    expect(result).toContain('две тысячи двадцать третьего года')
  })

  it('should handle multiple numbers in text', () => {
    expect(replaceNumbersInText('В 2023 году было 150 участников'))
      .toBe('В две тысячи двадцать третьем году было сто пятьдесят участников')
  })

  it('should not replace numbers greater than 999999', () => {
    expect(replaceNumbersInText('Население 1500000 человек'))
      .toBe('Население 1500000 человек')
  })

  it('should handle empty text', () => {
    expect(replaceNumbersInText('')).toBe('')
  })

  it('should handle text without numbers', () => {
    expect(replaceNumbersInText('Это обычный текст без чисел'))
      .toBe('Это обычный текст без чисел')
  })
})
