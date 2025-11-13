# Пример формата урока для AI учителя

Когда пользователь сообщает свой класс и последнюю изученную тему, AI должен ответить в формате JSON:

## Формат ответа:

```json
[
  {
    "type": "theory",
    "title": "Present Simple",
    "content": "Present Simple используется для описания регулярных действий и фактов. Формула: Subject + Verb (для he/she/it добавляем -s). Например: I work, He works."
  },
  {
    "type": "question",
    "title": "Практика: Выбор правильной формы",
    "content": "Выберите правильную форму глагола для каждого предложения:",
    "questions": [
      {
        "id": "q1",
        "question": "She ___ to school every day.",
        "options": ["go", "goes", "going", "went"],
        "correctAnswer": 1,
        "explanation": "С местоимением 'she' (3-е лицо единственное число) глагол в Present Simple принимает окончание -s."
      },
      {
        "id": "q2",
        "question": "They ___ English on Mondays.",
        "options": ["studies", "study", "studying", "studied"],
        "correctAnswer": 1,
        "explanation": "С местоимением 'they' (множественное число) используется базовая форма глагола без окончания."
      },
      {
        "id": "q3",
        "question": "My brother ___ football.",
        "options": ["like", "likes", "liking", "to like"],
        "correctAnswer": 1,
        "explanation": "'My brother' - 3-е лицо единственное число, поэтому добавляем -s к глаголу."
      }
    ]
  },
  {
    "type": "theory",
    "title": "Отрицательная форма",
    "content": "Для отрицания используем don't/doesn't + базовая форма глагола. Don't - для I/you/we/they, doesn't - для he/she/it. Например: I don't like, He doesn't like."
  },
  {
    "type": "question",
    "title": "Практика: Отрицания",
    "content": "Выберите правильное отрицание:",
    "questions": [
      {
        "id": "q4",
        "question": "We ___ pizza.",
        "options": ["don't like", "doesn't like", "not like", "aren't like"],
        "correctAnswer": 0,
        "explanation": "С 'we' используем don't, так как это множественное число."
      },
      {
        "id": "q5",
        "question": "He ___ coffee.",
        "options": ["don't drink", "doesn't drinks", "doesn't drink", "not drink"],
        "correctAnswer": 2,
        "explanation": "С 'he' используем doesn't, а глагол остается в базовой форме (без -s)."
      }
    ]
  },
  {
    "type": "summary",
    "title": "Итоги урока",
    "content": "Отлично! Вы изучили Present Simple: утвердительную и отрицательную формы. Запомните: добавляем -s для he/she/it, используем don't/doesn't для отрицаний. Готовы к следующей теме?"
  }
]
```

## Важные правила:

1. **Теория должна быть краткой** - максимум 2-4 предложения
2. **Каждый вопрос имеет 4 варианта ответа**
3. **correctAnswer** - это индекс от 0 (первый вариант)
4. **Всегда добавляйте explanation** к каждому вопросу
5. **План урока: 3-5 шагов** (теория → практика → теория → практика → итоги)
6. **Итоги в конце** - краткое резюме изученного

## Что НЕ делать:

❌ Длинные объяснения (больше 4 предложений)
❌ Вопросы с менее чем 4 вариантами ответа
❌ Отсутствие explanation
❌ Отсутствие итогового summary
❌ Больше 5 шагов в уроке




