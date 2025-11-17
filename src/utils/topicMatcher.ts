import { COURSE_PLANS, LessonPlan, CoursePlan } from './coursePlans';

/**
 * Получить курс по названию предмета и классу
 */
export function getCoursePlanBySubjectAndGrade(subjectName: string, grade: number): CoursePlan | null {
  return COURSE_PLANS.find(course =>
    course.title.toLowerCase().includes(subjectName.toLowerCase()) &&
    course.grade === grade
  ) || null;
}

/**
 * Получить все курсы по названию предмета
 */
export function getCoursesBySubject(subjectName: string): CoursePlan[] {
  return COURSE_PLANS.filter(course =>
    course.title.toLowerCase().includes(subjectName.toLowerCase())
  );
}

/**
 * Получить доступные классы для предмета
 */
export function getAvailableGradesForSubject(subjectName: string): number[] {
  return getCoursesBySubject(subjectName)
    .map(course => course.grade)
    .sort((a, b) => a - b);
}

/**
 * Найти урок в курсе по названию предмета, классу и описанию темы
 */
export function findLessonByTopic(
  subjectName: string,
  grade: number,
  userDescription: string
): { lesson: LessonPlan; course: CoursePlan; lessonIndex: number } | null {
  const course = getCoursePlanBySubjectAndGrade(subjectName, grade);
  if (!course) return null;

  // Приводим описание пользователя к нижнему регистру
  const userInput = userDescription.toLowerCase().trim();

  // Разбиваем описание на ключевые слова
  const keywords = userInput
    .split(/[,;\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());

  // Вычисляем релевантность для каждого урока
  const scoredLessons = course.lessons.map((lesson, index) => {
    let score = 0;

    // Текст для поиска: название + тема + аспекты
    const lessonText = `${lesson.title} ${lesson.topic} ${lesson.aspects}`.toLowerCase();

    // Проверяем точное совпадение тема
    if (lessonText.includes(userInput)) {
      score += 100;
    }

    // Проверяем совпадение по каждому ключевому слову
    keywords.forEach((keyword) => {
      if (keyword.length > 0) {
        // Поиск в названии (самый высокий приоритет)
        if (lesson.title.toLowerCase().includes(keyword)) {
          score += 30;
        }
        // Поиск в теме
        if (lesson.topic.toLowerCase().includes(keyword)) {
          score += 20;
        }
        // Поиск в аспектах
        if (lesson.aspects.toLowerCase().includes(keyword)) {
          score += 10;
        }
      }
    });

    return { lesson, index, score };
  });

  // Находим урок с наибольшей релевантностью
  const bestMatch = scoredLessons.sort((a, b) => b.score - a.score)[0];

  // Если нашли релевантный урок (score > 0)
  if (bestMatch && bestMatch.score > 0) {
    return {
      lesson: bestMatch.lesson,
      course,
      lessonIndex: bestMatch.index
    };
  }

  // Если ничего не найдено, возвращаем первый урок по умолчанию
  if (course.lessons.length > 0) {
    return {
      lesson: course.lessons[0],
      course,
      lessonIndex: 0
    };
  }

  return null;
}

/**
 * Создать персонализированный план обучения начиная с найденного урока + 1
 */
export function createPersonalizedPlanFromTopic(
  subjectName: string,
  grade: number,
  userDescription: string,
  lessonsCount: number = 10 // Сколько уроков включить в план
) {
  const matchResult = findLessonByTopic(subjectName, grade, userDescription);

  if (!matchResult) {
    return {
      success: false,
      message: 'Курс не найден',
      lessons: []
    };
  }

  const { lesson, course, lessonIndex } = matchResult;

  // Начинаем со следующего урока после найденного
  const startIndex = Math.min(lessonIndex + 1, course.lessons.length - 1);

  // Берём уроки начиная с startIndex
  const plannedLessons = course.lessons.slice(startIndex, startIndex + lessonsCount);

  return {
    success: true,
    foundTopic: {
      lessonNumber: lesson.number,
      title: lesson.title,
      topic: lesson.topic
    },
    message: `Найден урок "${lesson.title}" (Тема: ${lesson.topic}). Начинаем обучение с урока "${plannedLessons[0]?.title || 'Неизвестно'}"`,
    lessons: plannedLessons,
    course: {
      courseId: 0, // Will be set by the calling component
      title: course.title,
      grade: course.grade
    }
  };
}

/**
 * Получить список уроков, подходящих по теме (все подходящие, не только лучший)
 */
export function findAllLessonsByTopic(
  subjectName: string,
  grade: number,
  userDescription: string
): Array<{ lesson: LessonPlan; index: number; relevance: number }> {
  const course = getCoursePlanBySubjectAndGrade(subjectName, grade);
  if (!course) return [];

  const userInput = userDescription.toLowerCase().trim();
  const keywords = userInput
    .split(/[,;\s]+/)
    .filter((word) => word.length > 2);

  return course.lessons
    .map((lesson, index) => {
      let relevance = 0;
      const lessonText = `${lesson.title} ${lesson.topic} ${lesson.aspects}`.toLowerCase();

      if (lessonText.includes(userInput)) {
        relevance += 100;
      }

      keywords.forEach((keyword) => {
        if (lesson.title.toLowerCase().includes(keyword)) {
          relevance += 30;
        }
        if (lesson.topic.toLowerCase().includes(keyword)) {
          relevance += 20;
        }
        if (lesson.aspects.toLowerCase().includes(keyword)) {
          relevance += 10;
        }
      });

      return { lesson, index, relevance };
    })
    .filter((item) => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
}

