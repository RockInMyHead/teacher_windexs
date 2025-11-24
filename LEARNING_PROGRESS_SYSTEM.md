# Система прогресса обучения

## Обзор

Реализована полноценная система персонализированного обучения с прогрессом, домашними заданиями и интеграцией контекста курса в LLM.

## Архитектура

### 1. База данных (SQLite)

#### Таблицы для прогресса:

**`user_courses`** - Прогресс пользователя по курсу
- `id` - уникальный идентификатор
- `user_id` - ID пользователя
- `course_id` - ID курса
- `current_lesson_number` - текущий номер урока
- `completed_lessons` - количество завершенных уроков
- `progress_percentage` - процент прогресса (0-100)
- `total_study_time_minutes` - общее время обучения
- `average_score` - средний балл
- `status` - статус (active, completed, paused, dropped)

**`user_lessons`** - Прогресс по конкретным урокам
- `id` - уникальный идентификатор
- `user_id` - ID пользователя
- `lesson_id` - ID урока
- `user_course_id` - связь с прогрессом курса
- `status` - статус (not_started, in_progress, completed, reviewed)
- `score` - оценка за урок
- `time_spent_minutes` - время на урок
- `homework_submitted` - сдано ли ДЗ
- `homework_content` - содержимое ДЗ (JSON)
- `homework_feedback` - отзыв учителя (JSON)

### 2. Backend API

#### Маршруты (`/api/learning-progress`):

1. **POST `/enroll`** - Записать пользователя на курс
2. **GET `/users/:userId/courses/:courseId`** - Получить прогресс по курсу
3. **POST `/lessons/start`** - Начать урок
4. **POST `/lessons/complete`** - Завершить урок
5. **POST `/homework/submit`** - Отправить домашнее задание
6. **GET `/users/:userId/homeworks`** - Получить список ДЗ
7. **GET `/users/:userId/courses/:courseId/llm-context`** - Получить контекст для LLM ⭐
8. **GET `/users/:userId/courses/:courseId/next-lesson`** - Получить следующий урок
9. **POST `/study-time/update`** - Обновить время обучения
10. **GET `/users/:userId/stats`** - Получить статистику

### 3. Frontend Services

#### `learningProgressService.ts`

Сервис для работы с прогрессом:
- `enrollInCourse()` - запись на курс
- `getUserCourseProgress()` - получение прогресса
- `startLesson()` - начало урока
- `completeLesson()` - завершение урока
- `submitHomework()` - отправка ДЗ
- `getCourseContextForLLM()` - получение контекста для LLM ⭐
- `updateStudyTime()` - обновление времени
- `getLearningStats()` - статистика

### 4. React Hooks

#### `useLLMContext.ts`

Хук для управления контекстом LLM:

```typescript
const { 
  context,          // Контекст курса
  isLoading,        // Загрузка
  error,            // Ошибка
  loadContext,      // Загрузить контекст
  refreshContext,   // Обновить контекст
  generateSystemPrompt  // Генерация промпта ⭐
} = useLLMContext(userId, courseId);
```

**Генерация System Prompt:**

Хук автоматически генерирует детальный system prompt для LLM, включающий:
- Информацию о курсе (название, класс, предмет)
- Текущий урок и его цели
- Прогресс обучения
- Предыдущее домашнее задание
- Историю пройденных тем
- Инструкции для учителя

### 5. React Components

#### `ChatWithLLMContext.tsx`

Компонент чата с автоматической интеграцией контекста:

```typescript
<ChatWithLLMContext
  userId={userId}
  courseId={courseId}
  onMessageSent={(msg) => console.log(msg)}
  onResponseReceived={(res) => console.log(res)}
/>
```

#### `ProgressCard.tsx`

Карточка прогресса обучения:
- Общий прогресс курса
- Статистика уроков
- Информация о текущем уроке
- Пройденные темы

#### `HomeworkCard.tsx`

Карточка домашнего задания:
- Статус ДЗ (сдано/не сдано)
- Текст задания
- Отзыв учителя
- Кнопка отправки

## Процесс обучения

### 1. Выбор курса и класса

Когда пользователь выбирает курс и свой класс в `AvailableCourses.tsx`:

```typescript
// Пользователь автоматически записывается на курс в БД
await learningProgressService.enrollInCourse({
  userId: 'user_id',
  courseId: 'course_id'
});
```

### 2. Начало урока

При переходе к уроку в `CourseDetail.tsx`:

```typescript
// Урок стартует в БД
await learningProgressService.startLesson({
  userId,
  lessonId,
  userCourseId
});
```

### 3. Загрузка контекста в чат

При входе в чат автоматически:

```typescript
// Загружается контекст курса
const context = await learningProgressService.getCourseContextForLLM(userId, courseId);

// Генерируется system prompt для LLM
const systemPrompt = generateSystemPrompt(context);
```

### 4. Взаимодействие с LLM

LLM получает полный контекст:
- **Информация о курсе**: название, класс, описание
- **Текущий урок**: номер, тема, цели
- **Прогресс**: сколько пройдено, сколько осталось
- **Домашнее задание**: есть ли несданное ДЗ с прошлого урока
- **История**: какие темы уже пройдены

LLM знает:
- Нужно ли проверить домашнее задание
- Какую тему объяснять сейчас
- Какие цели у текущего урока
- На каком уровне объяснять материал (класс)

### 5. Завершение урока

После урока:

```typescript
// Урок завершается в БД
await learningProgressService.completeLesson({
  userId,
  lessonId,
  score: 85,
  timeSpentMinutes: 45
});

// Автоматически обновляется:
// - Прогресс курса
// - Статистика пользователя
// - Переход к следующему уроку
```

### 6. Домашнее задание

LLM дает домашнее задание в конце урока:

```typescript
// ДЗ автоматически сохраняется в БД
await learningProgressService.submitHomework({
  userId,
  lessonId,
  homeworkContent: { task: "...", answers: [...] }
});

// На следующем уроке LLM получит информацию о несданном ДЗ
// и ОБЯЗАТЕЛЬНО спросит о его выполнении
```

## Преимущества системы

### 1. Бесшовный опыт обучения

- Пользователь просто выбирает курс и начинает учиться
- Вся логика прогресса работает автоматически
- LLM всегда знает контекст и адаптирует обучение

### 2. Персонализация

- LLM знает уровень ученика (класс)
- Учитывается история обучения
- Адаптация под прогресс

### 3. Мотивация

- Виден прогресс обучения
- Отслеживание времени
- Система домашних заданий

### 4. Целостность данных

- Все в БД, ничего не теряется
- localStorage только для кэширования
- Синхронизация между сессиями

## Использование в коде

### Быстрый старт

```typescript
// 1. В компоненте курса - записать на курс
import { learningProgressService } from '@/services';

await learningProgressService.enrollInCourse({
  userId,
  courseId
});

// 2. В чате - использовать контекст
import { useLLMContext } from '@/hooks/useLLMContext';

const { context, generateSystemPrompt } = useLLMContext(userId, courseId);
const systemPrompt = generateSystemPrompt();

// Передать systemPrompt в ChatContainer
<ChatContainer initialSystemPrompt={systemPrompt} />

// 3. Показать прогресс
import { ProgressCard, HomeworkCard } from '@/components/LearningProgress';

<ProgressCard context={context} />
<HomeworkCard context={context} />
```

## API Endpoints Summary

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/enroll` | POST | Записать на курс |
| `/users/:userId/courses/:courseId` | GET | Получить прогресс |
| `/lessons/start` | POST | Начать урок |
| `/lessons/complete` | POST | Завершить урок |
| `/homework/submit` | POST | Отправить ДЗ |
| `/users/:userId/homeworks` | GET | Список ДЗ |
| `/users/:userId/courses/:courseId/llm-context` | GET | **Контекст для LLM** |
| `/users/:userId/courses/:courseId/next-lesson` | GET | Следующий урок |
| `/study-time/update` | POST | Обновить время |
| `/users/:userId/stats` | GET | Статистика |

## Примеры ответов API

### Контекст для LLM

```json
{
  "context": {
    "courseTitle": "Английский язык для 5 класса",
    "courseDescription": "Базовый курс...",
    "grade": 5,
    "subject": "Английский язык",
    "currentLessonNumber": 3,
    "completedLessons": 2,
    "totalLessons": 10,
    "progressPercentage": 20,
    "currentLessonTitle": "Цвета и числа",
    "currentLessonTopic": "Основная лексика",
    "currentLessonObjectives": [
      "Выучить названия цветов",
      "Считать от 1 до 20"
    ],
    "previousHomework": {
      "task": "Выучить 10 новых слов",
      "submitted": false
    },
    "studyHistory": {
      "topicsCovered": ["Алфавит", "Приветствия"],
      "lastStudyDate": "2025-11-24T...",
      "totalStudyTime": 90
    }
  }
}
```

## Roadmap

- [ ] Интеграция с VoiceCallPage
- [ ] Автоматическая генерация тестов
- [ ] Геймификация (достижения, уровни)
- [ ] Аналитика обучения
- [ ] Рекомендательная система
- [ ] Адаптивная сложность

## Заключение

Система обеспечивает полноценный цикл обучения с отслеживанием прогресса, автоматическими домашними заданиями и персонализацией через LLM контекст. Все компоненты интегрированы и работают бесшовно.

