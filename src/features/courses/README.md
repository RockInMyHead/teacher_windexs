# Courses Feature Module

Модуль управления курсами и уроками. Предоставляет функциональность для просмотра, фильтрации, прохождения курсов и отслеживания прогресса.

## 📁 Структура

```
features/courses/
├── api/
│   └── coursesApi.ts           # API функции для курсов
├── model/
│   └── coursesModel.ts         # State management hooks
├── ui/
│   ├── CourseCard.tsx          # Карточка курса
│   ├── CoursesList.tsx         # Список курсов с фильтрами
│   └── LessonCard.tsx          # Карточка урока
├── data/
│   ├── courseRegistry.ts       # Реестр курсов
│   └── legacyAdapter.ts        # Адаптер для старых данных
├── types.ts                    # TypeScript типы
├── index.ts                    # Public API
└── README.md                   # Документация
```

## 🎯 Особенности

- ✅ **107 курсов** из legacy данных (coursePlans.ts - 20895 строк)
- ✅ **Модульная архитектура** - легко расширять
- ✅ **Адаптер legacy данных** - плавная миграция без поломок
- ✅ **Прогресс трекинг** - отслеживание прохождения
- ✅ **Фильтрация** - по классу, предмету, уровню
- ✅ **Поиск** - полнотекстовый поиск курсов
- ✅ **Prerequisites** - система пререквизитов для уроков

## 📖 Использование

### Список курсов

```typescript
import { CoursesList, useCoursesModel } from '@/features/courses';

function CoursesPage() {
  const { courses, isLoading, error, filterByGrade, search } = useCoursesModel();

  React.useEffect(() => {
    courses.loadCourses();
  }, []);

  return (
    <CoursesList
      courses={courses}
      isLoading={isLoading}
      error={error}
      onFilterChange={(filter) => {
        if (filter.grade) filterByGrade(filter.grade);
        if (filter.searchQuery) search(filter.searchQuery);
      }}
      onCourseSelect={(course) => console.log('Selected:', course)}
      onCourseStart={(course) => console.log('Start:', course)}
    />
  );
}
```

### Отдельный курс

```typescript
import { useCourseModel, LessonCard } from '@/features/courses';

function CoursePage({ grade }: { grade: number }) {
  const { course, isLoading, getLessonByNumber } = useCourseModel(grade);

  if (isLoading) return <p>Загрузка...</p>;
  if (!course) return <p>Курс не найден</p>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <div className="grid gap-4">
        {course.lessons.map(lesson => (
          <LessonCard
            key={lesson.number}
            lesson={lesson}
            onStart={() => console.log('Start lesson:', lesson.number)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Отслеживание прогресса

```typescript
import { useCourseProgress } from '@/features/courses';

function CourseWithProgress({ courseId, grade }: { courseId: number; grade: number }) {
  const { progress, completeLesson, canStartLesson, setCurrentLesson } = useCourseProgress(courseId, grade);

  const handleLessonComplete = async () => {
    await completeLesson({
      lessonId: 1,
      completedAt: new Date(),
      timeSpent: 45,
      score: 85
    });
  };

  return (
    <div>
      <p>Прогресс: {progress.overallProgress}%</p>
      <p>Завершено: {progress.completedLessons.length} уроков</p>
      <button onClick={handleLessonComplete}>Завершить урок</button>
    </div>
  );
}
```

### API функции

```typescript
import {
  getAllCourses,
  getCourseByGrade,
  getLesson,
  searchCourses,
  getTestQuestions,
  getRecommendedCourses
} from '@/features/courses';

// Получить все курсы
const courses = await getAllCourses();

// Получить курс по классу
const course = await getCourseByGrade(5);

// Найти урок
const lesson = await getLesson(5, 10);

// Поиск
const results = await searchCourses('английский');

// Тестовые вопросы
const questions = await getTestQuestions(1, 5);

// Рекомендации
const recommendations = await getRecommendedCourses({
  grade: 5,
  subject: 'english',
  score: 75,
  weakAreas: ['grammar']
});
```

## 🎨 Компоненты

### CourseCard
Карточка курса с прогрессом.

**Props:**
- `course: CoursePlan` - Данные курса
- `progress?: number` - Прогресс (0-100)
- `onSelect?: () => void` - Callback при клике
- `onStart?: () => void` - Callback при старте курса

### CoursesList
Список курсов с фильтрацией и поиском.

**Props:**
- `courses: CoursePlan[]` - Массив курсов
- `isLoading?: boolean` - Статус загрузки
- `error?: string | null` - Ошибка
- `filter?: CourseFilter` - Текущий фильтр
- `onFilterChange?: (filter: CourseFilter) => void` - Изменение фильтра
- `onCourseSelect?: (course: CoursePlan) => void` - Выбор курса
- `onCourseStart?: (course: CoursePlan) => void` - Начало курса

### LessonCard
Карточка урока с статусом.

**Props:**
- `lesson: LessonPlan` - Данные урока
- `isCompleted?: boolean` - Урок завершён
- `isLocked?: boolean` - Урок заблокирован
- `isCurrent?: boolean` - Текущий урок
- `onStart?: () => void` - Начало урока

## 🔧 Хуки

### useCoursesModel()
Управление списком курсов.

**Returns:**
- `courses: CoursePlan[]` - Список курсов
- `isLoading: boolean` - Статус загрузки
- `error: string | null` - Ошибка
- `loadCourses(filter?)` - Загрузить курсы
- `search(query)` - Поиск
- `filterByGrade(grade)` - Фильтр по классу
- `filterBySubject(subject)` - Фильтр по предмету
- `clearFilters()` - Очистить фильтры

### useCourseModel(grade)
Управление отдельным курсом.

**Returns:**
- `course: CoursePlan | null` - Данные курса
- `isLoading: boolean` - Статус загрузки
- `error: string | null` - Ошибка
- `getLessonByNumber(number)` - Получить урок
- `getLessonsByDifficulty(difficulty)` - Фильтр по сложности

### useLessonModel(grade, lessonNumber)
Управление отдельным уроком.

**Returns:**
- `lesson: LessonPlan | null` - Данные урока
- `isLoading: boolean` - Статус загрузки
- `error: string | null` - Ошибка

### useCourseProgress(courseId, grade)
Отслеживание прогресса курса.

**Returns:**
- `progress: CourseProgress` - Прогресс
- `completeLesson(result)` - Завершить урок
- `setCurrentLesson(number)` - Установить текущий урок
- `canStartLesson(number)` - Проверка доступности урока
- `resetProgress()` - Сбросить прогресс

## 📊 Legacy Adapter

Адаптер для плавной миграции данных из `coursePlans.ts` (20895 строк!):

```typescript
import { getLegacyDataStats } from '@/features/courses';

const stats = getLegacyDataStats();
console.log(stats);
// {
//   totalCourses: 107,
//   totalLessons: ~2000+,
//   availableGrades: [1, 2, 3, ..., 11, 90, 100],
//   subjects: ['Английский язык', 'Математика', ...],
//   testQuestionsCount: 1000+
// }
```

## 🚀 Преимущества новой архитектуры

### До рефакторинга:
- ❌ 20895 строк в одном файле (coursePlans.ts)
- ❌ Трудно найти нужный курс
- ❌ Невозможно фильтровать/искать
- ❌ Нет трекинга прогресса
- ❌ Сложно добавлять новые курсы

### После рефакторинга:
- ✅ Модульная структура (API / Model / UI / Data)
- ✅ Удобные хуки для управления состоянием
- ✅ Компоненты для быстрого UI
- ✅ Фильтрация и поиск из коробки
- ✅ Прогресс трекинг с localStorage
- ✅ Legacy adapter для плавной миграции
- ✅ Легко расширять и тестировать

## 🔄 Миграция данных

Данные из `coursePlans.ts` доступны через Legacy Adapter:

```typescript
import { getLegacyCoursePlans, getLegacyCourseByGrade } from '@/features/courses';

// Все старые данные доступны
const allCourses = getLegacyCoursePlans(); // 107 курсов
const course = getLegacyCourseByGrade(5); // Курс для 5 класса
```

В будущем данные будут мигрированы в отдельные файлы по предметам:
```
data/
├── english/
│   ├── grade1.ts
│   ├── grade2.ts
│   └── ...
├── mathematics/
│   ├── grade1.ts
│   └── ...
└── ...
```

## 📝 Примеры

### Пример: Страница всех курсов

```typescript
import { CoursesList, useCoursesModel, useAvailableGrades } from '@/features/courses';

export function AllCoursesPage() {
  const { courses, isLoading, filterByGrade } = useCoursesModel();
  const { grades } = useAvailableGrades();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Все курсы</h1>
      <CoursesList
        courses={courses}
        isLoading={isLoading}
        availableGrades={grades}
        onFilterChange={(filter) => {
          if (filter.grade) filterByGrade(filter.grade);
        }}
      />
    </div>
  );
}
```

### Пример: Страница курса

```typescript
import { useCourseModel, useCourseProgress, LessonCard } from '@/features/courses';

export function CoursePage({ courseId, grade }: { courseId: number; grade: number }) {
  const { course, isLoading } = useCourseModel(grade);
  const { progress, canStartLesson } = useCourseProgress(courseId, grade);

  if (isLoading) return <div>Загрузка...</div>;
  if (!course) return <div>Курс не найден</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-muted-foreground mb-6">{course.description}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {course.lessons.map(lesson => (
          <LessonCard
            key={lesson.number}
            lesson={lesson}
            isCompleted={progress.completedLessons.includes(lesson.number)}
            isCurrent={progress.currentLesson === lesson.number}
            isLocked={!canStartLesson(lesson.number)}
          />
        ))}
      </div>
    </div>
  );
}
```

## 🎯 Технологии

- **TypeScript** - Полная типизация
- **React Hooks** - Современное управление состоянием
- **Shadcn/ui** - Красивые UI компоненты
- **LocalStorage** - Сохранение прогресса
- **Legacy Adapter** - Совместимость со старыми данными

## 📈 Статистика

- **Курсов**: 107
- **Уроков**: ~2000+
- **Тестовых вопросов**: 1000+
- **Предметов**: 10+
- **Классов**: 1-11 + специальные (90, 100)
- **Строк кода**: 20895 → ~800 (модульных)

---

**Feature-Sliced Design в действии!** 🚀



