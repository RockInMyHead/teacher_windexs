// Функция для преобразования цифр в слова на русском языке

const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const unitsFeminine = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const teens = ['', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const tens = ['', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

const thousands = ['', 'тысяча', 'тысячи', 'тысяч'];
const millions = ['', 'миллион', 'миллиона', 'миллионов'];

function getThousandForm(n: number): string {
  if (n === 1) return thousands[1]; // тысяча (единственное, женский род)
  if (n >= 2 && n <= 4) return thousands[2]; // тысячи (множественное)
  return thousands[3]; // тысяч (множественное)
}

function getMillionForm(n: number): string {
  if (n === 1) return millions[1];
  if (n >= 2 && n <= 4) return millions[2];
  return millions[3];
}

function numberToWordsFeminineLessThanThousand(n: number): string {
  // Специальная версия для тысяч (женский род)
  if (n === 0) return '';

  let result = '';

  // Сотни
  const h = Math.floor(n / 100);
  if (h > 0) {
    result += hundreds[h] + ' ';
  }

  // Десятки и единицы
  const remainder = n % 100;
  if (remainder === 0) {
    return result.trim();
  }

  if (remainder < 10) {
    result += unitsFeminine[remainder];
  } else if (remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const t = Math.floor(remainder / 10);
    const u = remainder % 10;
    result += tens[t];
    if (u > 0) {
      result += ' ' + unitsFeminine[u];
    }
  }

  return result.trim();
}

function numberToWordsLessThanThousand(n: number): string {
  if (n === 0) return 'ноль';

  let result = '';

  // Сотни
  const h = Math.floor(n / 100);
  if (h > 0) {
    result += hundreds[h] + ' ';
  }

  // Десятки и единицы
  const remainder = n % 100;
  if (remainder === 0) {
    return result.trim();
  }

  if (remainder === 10) {
    result += tens[1]; // десять
  } else if (remainder < 10) {
    result += units[remainder];
  } else if (remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const t = Math.floor(remainder / 10);
    const u = remainder % 10;
    result += tens[t];
    if (u > 0) {
      result += ' ' + units[u];
    }
  }

  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return 'ноль';
  if (num < 0) return 'минус ' + numberToWords(-num);

  const parts: string[] = [];
  let remaining = num;

  // Миллионы
  const millionPart = Math.floor(remaining / 1000000);
  if (millionPart > 0) {
    parts.push(numberToWordsLessThanThousand(millionPart) + ' ' + getMillionForm(millionPart));
    remaining %= 1000000;
  }

  // Тысячи
  const thousandPart = Math.floor(remaining / 1000);
  if (thousandPart > 0) {
    parts.push(numberToWordsFeminineLessThanThousand(thousandPart) + ' ' + getThousandForm(thousandPart));
    remaining %= 1000;
  }

  // Единицы
  if (remaining > 0) {
    parts.push(numberToWordsLessThanThousand(remaining));
  }

  return parts.join(' ').trim();
}

// Месяцы для преобразования дат
const months = {
  'января': 'января',
  'февраля': 'февраля',
  'марта': 'марта',
  'апреля': 'апреля',
  'мая': 'мая',
  'июня': 'июня',
  'июля': 'июля',
  'августа': 'августа',
  'сентября': 'сентября',
  'октября': 'октября',
  'ноября': 'ноября',
  'декабря': 'декабря'
};

const monthForms = {
  'январь': ['января', 'январе'],
  'февраль': ['февраля', 'феврале'],
  'март': ['марта', 'марте'],
  'апрель': ['апреля', 'апреле'],
  'май': ['мая', 'мае'],
  'июнь': ['июня', 'июне'],
  'июль': ['июля', 'июле'],
  'август': ['августа', 'августе'],
  'сентябрь': ['сентября', 'сентябре'],
  'октябрь': ['октября', 'октябре'],
  'ноябрь': ['ноября', 'ноябре'],
  'декабрь': ['декабря', 'декабре']
};

function getOrdinalForm(num: number): string {
  // Преобразует число в порядковую форму (1 -> первого, 2 -> второго и т.д.)
  const ordinals = [
    '', 'первого', 'второго', 'третьего', 'четвертого', 'пятого', 'шестого',
    'седьмого', 'восьмого', 'девятого', 'десятого', 'одиннадцатого', 'двенадцатого',
    'тринадцатого', 'четырнадцатого', 'пятнадцатого', 'шестнадцатого', 'семнадцатого',
    'восемнадцатого', 'девятнадцатого', 'двадцатого', 'двадцать первого', 'двадцать второго',
    'двадцать третьего', 'двадцать четвертого', 'двадцать пятого', 'двадцать шестого',
    'двадцать седьмого', 'двадцать восьмого', 'двадцать девятого', 'тридцатого', 'тридцать первого'
  ];

  if (num >= 1 && num <= 31) {
    return ordinals[num];
  }
  return numberToWords(num) + 'ого';
}

function processDateForTTS(text: string): string {
  // Обрабатываем даты в формате "число месяц год"
  // Например: "12 апреля 1961 года" -> "двенадцатого апреля тысяча девятьсот шестьдесят первого года"

  const dateRegex = /(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})\s+(года?|г\.?)/gi;

  return text.replace(dateRegex, (match, day, month, year, suffix) => {
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    const dayWords = getOrdinalForm(dayNum);
    const monthWords = months[month.toLowerCase()] || month;

    // Для годов в датах используем правильную форму
    let yearWords = numberToWords(yearNum);
    const lastDigit = yearNum % 10;
    const lastTwoDigits = yearNum % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      yearWords += 'ого';
    } else {
      switch (lastDigit) {
        case 1: yearWords = yearWords.replace(/ один$/, ' первого'); break;
        case 2: yearWords = yearWords.replace(/ два$/, ' второго'); break;
        case 3: yearWords = yearWords.replace(/ три$/, ' третьего'); break;
        case 4: yearWords = yearWords.replace(/ четыре$/, ' четвертого'); break;
        case 5: yearWords += 'ого'; break;
        case 6: yearWords += 'ого'; break;
        case 7: yearWords += 'ого'; break;
        case 8: yearWords += 'ого'; break;
        case 9: yearWords += 'ого'; break;
        case 0: yearWords += 'ого'; break;
      }
    }

    return `${dayWords} ${monthWords} ${yearWords} ${suffix}`;
  });
}

function getYearOrdinalForm(year: number): string {
  // Преобразует год в порядковую форму
  let yearWords = numberToWords(year);

  // Получаем последнюю цифру года для определения правильного окончания
  const lastDigit = year % 10;
  const lastTwoDigits = year % 100;

  // Специальная обработка для составных чисел (20, 30, etc.)
  if (lastTwoDigits >= 20) {
    const tensPart = Math.floor(lastTwoDigits / 10) * 10;
    const unitsPart = lastTwoDigits % 10;

    if (unitsPart === 1) {
      // Заменяем "двадцать один" на "двадцать первом"
      const tensWords = numberToWords(tensPart);
      return yearWords.replace(tensWords + ' один', tensWords + ' первом');
    } else if (unitsPart === 2) {
      // Заменяем "двадцать два" на "двадцать втором"
      const tensWords = numberToWords(tensPart);
      return yearWords.replace(tensWords + ' два', tensWords + ' втором');
    } else if (unitsPart === 3) {
      // Заменяем "двадцать три" на "двадцать третьем"
      const tensWords = numberToWords(tensPart);
      return yearWords.replace(tensWords + ' три', tensWords + ' третьем');
    } else if (unitsPart === 4) {
      // Заменяем "двадцать четыре" на "двадцать четвертом"
      const tensWords = numberToWords(tensPart);
      return yearWords.replace(tensWords + ' четыре', tensWords + ' четвертом');
    }
  }

  // Специальная обработка для "тридцать три" -> "тридцать третьем" и т.д.
  if (yearWords.includes(' тридцать три')) {
    return yearWords.replace(' тридцать три', ' тридцать третьем');
  }
  if (yearWords.includes(' сорок три')) {
    return yearWords.replace(' сорок три', ' сорок третьем');
  }
  if (yearWords.includes(' пятьдесят три')) {
    return yearWords.replace(' пятьдесят три', ' пятьдесят третьем');
  }

  // Определяем правильное окончание
  let ordinalEnding = '';

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    // Исключения для 11-19
    ordinalEnding = 'ом';
  } else {
    switch (lastDigit) {
      case 1:
        ordinalEnding = 'ом'; // первый -> первом (специальный случай для годов)
        // Для единицы в конце составного числа
        if (yearWords.endsWith(' один')) {
          return yearWords.slice(0, -5) + ' первом';
        }
        break;
      case 2:
        ordinalEnding = 'ом'; // второй -> втором
        if (yearWords.endsWith(' два')) {
          return yearWords.slice(0, -4) + ' втором';
        }
        break;
      case 3:
        ordinalEnding = 'ем'; // третий -> третьем
        if (yearWords.endsWith(' три')) {
          return yearWords.slice(0, -4) + ' третьем';
        }
        break;
      case 4:
        ordinalEnding = 'ом'; // четвертый -> четвертом
        if (yearWords.endsWith(' четыре')) {
          return yearWords.slice(0, -7) + ' четвертом';
        }
        break;
      case 5:
        ordinalEnding = 'ом'; // пятый -> пятом
        if (yearWords.endsWith(' пять')) {
          return yearWords.slice(0, -5) + ' пятом';
        }
        break;
      case 6:
        ordinalEnding = 'ом'; // шестой -> шестом
        if (yearWords.endsWith(' шесть')) {
          return yearWords.slice(0, -6) + ' шестом';
        }
        break;
      case 7:
        ordinalEnding = 'ом'; // седьмой -> седьмом
        if (yearWords.endsWith(' семь')) {
          return yearWords.slice(0, -5) + ' седьмом';
        }
        break;
      case 8:
        ordinalEnding = 'ом'; // восьмой -> восьмом
        if (yearWords.endsWith(' восемь')) {
          return yearWords.slice(0, -7) + ' восьмом';
        }
        break;
      case 9:
        ordinalEnding = 'ом'; // девятый -> девятом
        if (yearWords.endsWith(' девять')) {
          return yearWords.slice(0, -7) + ' девятом';
        }
        break;
      case 0:
        ordinalEnding = 'ом'; // десятый -> десятом и т.д.
        if (yearWords.endsWith(' десять')) {
          return yearWords.slice(0, -7) + ' десятом';
        }
        break;
    }
  }

  // Если не нашли специальный случай, добавляем окончание
  if (ordinalEnding) {
    return yearWords + ordinalEnding;
  }

  // Fallback для сложных случаев
  return yearWords + 'ом';
}

function processYearsForTTS(text: string): string {
  // Обрабатываем года отдельно (если они не в составе полной даты)
  // Например: "в 2023 году" -> "в две тысячи двадцать третьем году"

  // Находим года, которые не являются частью даты
  const yearRegex = /(\d{4})\s+(год[аау]?|г\.?)/gi;

  return text.replace(yearRegex, (match, year, suffix) => {
    // Проверяем, не является ли это частью уже обработанной даты
    if (match.includes('ого') || match.includes('его') || match.includes('ом')) {
      return match; // Уже обработано
    }

    const yearNum = parseInt(year, 10);
    const yearWords = getYearOrdinalForm(yearNum);

    return `${yearWords} ${suffix}`;
  });
}

export function replaceNumbersInText(text: string): string {
  let processedText = text;

  // Сначала обрабатываем полные даты
  processedText = processDateForTTS(processedText);

  // Затем обрабатываем года
  processedText = processYearsForTTS(processedText);

  // Наконец, обрабатываем оставшиеся числа
  const numberRegex = /\b\d+\b/g;
  processedText = processedText.replace(numberRegex, (match) => {
    const num = parseInt(match, 10);
    // Преобразуем только числа до 999999, чтобы избежать слишком длинных слов
    if (num <= 999999 && num > 0) {
      return numberToWords(num);
    }
    return match; // Оставляем большие числа и числа дней как есть
  });

  return processedText;
}

// Тест функции
if (import.meta.env.DEV) {
  console.log('Тесты функции numberToWords:');
  console.log('400 ->', numberToWords(400));
  console.log('123 ->', numberToWords(123));
  console.log('1000 ->', numberToWords(1000));
  console.log('2000 ->', numberToWords(2000));
  console.log('15000 ->', numberToWords(15000));
  console.log('1961 ->', numberToWords(1961));

  console.log('Тесты TTS обработки:');
  console.log('В 2023 году было 400 участников ->', replaceNumbersInText('В 2023 году было 400 участников'));
  console.log('12 апреля 1961 года ->', replaceNumbersInText('12 апреля 1961 года'));
  console.log('В 1991 году случилось событие ->', replaceNumbersInText('В 1991 году случилось событие'));
  console.log('23 февраля 2024 года ->', replaceNumbersInText('23 февраля 2024 года'));

  console.log('Тесты getYearOrdinalForm:');
  console.log('getYearOrdinalForm(1961) ->', getYearOrdinalForm(1961));
  console.log('getYearOrdinalForm(2023) ->', getYearOrdinalForm(2023));
  console.log('getYearOrdinalForm(1991) ->', getYearOrdinalForm(1991));
}
