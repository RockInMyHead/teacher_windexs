/**
 * Анализ результатов тестирования и генерация персонализированного курса
 */

import { COURSE_PLANS, LessonPlan } from './coursePlans';

export interface AssessmentAnswer {
  questionIndex: number;
  isCorrect: boolean;
  question: string;
}

export interface TopicAnalysis {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  level: 'excellent' | 'good' | 'moderate' | 'weak';
}

export interface PersonalizedCourseData {
  strongTopics: TopicAnalysis[];
  weakTopics: TopicAnalysis[];
  overallPercentage: number;
  recommendedLessons: LessonPlan[];
  courseId: number;
  grade: number;
}

/**
 * Определить темы тестовых вопросов (базируется на ключевых словах и структуре вопроса)
 */
export function identifyTopicsFromQuestions(
  questions: Array<{ question: string }>,
  courseId: number
): string[] {
  // Ключевые слова для определения тем
  const topicKeywords: { [key: string]: string[] } = {
    // Английский язык
    'Present Simple': ['present', 'simple', 'verb', 'глагол', 'настоящее'],
    'Past Simple': ['past', 'простое', 'did', 'was', 'were'],
    'Present Perfect': ['perfect', 'совершенное', 'has', 'have'],
    'Грамматика': ['grammar', 'глагол', 'время', 'залог', 'тense'],
    'Лексика': ['vocabulary', 'слово', 'meaning', 'значение'],
    'Приветствия': ['hello', 'greetings', 'привет', 'greeting'],
    'Числа': ['number', 'numbers', 'цифра', 'count'],
    'Цвета': ['colour', 'color', 'цвет'],
    'Семья': ['family', 'brother', 'sister', 'семья'],
    'Животные': ['animal', 'animals', 'животное', 'pet'],
  };

  const detectedTopics = new Set<string>();

  questions.forEach(({ question }) => {
    const lowerQuestion = question.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        detectedTopics.add(topic);
      }
    });
  });

  return Array.from(detectedTopics).length > 0 
    ? Array.from(detectedTopics)
    : ['Основной материал'];
}

/**
 * Анализировать результаты тестирования
 */
export function analyzeAssessmentResults(
  answers: AssessmentAnswer[],
  questions: Array<{ question: string }>,
  courseId: number
): TopicAnalysis[] {
  const topics = identifyTopicsFromQuestions(questions, courseId);
  
  // Простой анализ: распределить вопросы по темам поровну
  const questionsPerTopic = Math.ceil(questions.length / topics.length);
  const analysis: TopicAnalysis[] = [];

  topics.forEach((topic, topicIndex) => {
    const startIdx = topicIndex * questionsPerTopic;
    const endIdx = Math.min(startIdx + questionsPerTopic, answers.length);
    
    const topicAnswers = answers.slice(startIdx, endIdx);
    const correctCount = topicAnswers.filter(a => a.isCorrect).length;
    const percentage = topicAnswers.length > 0 
      ? Math.round((correctCount / topicAnswers.length) * 100)
      : 0;

    let level: 'excellent' | 'good' | 'moderate' | 'weak';
    if (percentage >= 90) level = 'excellent';
    else if (percentage >= 70) level = 'good';
    else if (percentage >= 50) level = 'moderate';
    else level = 'weak';

    analysis.push({
      topic,
      totalQuestions: topicAnswers.length,
      correctAnswers: correctCount,
      percentage,
      level
    });
  });

  return analysis;
}

/**
 * Получить рекомендованные уроки на основе анализа
 */
export function getRecommendedLessons(
  strongTopics: TopicAnalysis[],
  weakTopics: TopicAnalysis[],
  courseId: number,
  grade: number,
  maxLessons: number = 15
): LessonPlan[] {
  const coursePlan = COURSE_PLANS.find(
    plan => {
      // Найти курс по ID (приблизительное совпадение)
      if (courseId === 0 || courseId === 1) return true; // Русский/Английский
      return false;
    }
  );

  if (!coursePlan) return [];

  const recommendedLessons: LessonPlan[] = [];
  const weakTopicNames = weakTopics.map(t => t.topic.toLowerCase());
  const strongTopicNames = strongTopics.map(t => t.topic.toLowerCase());

  // Приоритет: уроки по слабым темам
  coursePlan.lessons.forEach(lesson => {
    const lessonTopicLower = lesson.topic.toLowerCase();
    
    // Если это слабая тема - добавить в начало
    if (weakTopicNames.some(t => lessonTopicLower.includes(t))) {
      recommendedLessons.push(lesson);
    }
  });

  // Затем - уроки по сильным темам (для повторения)
  coursePlan.lessons.forEach(lesson => {
    const lessonTopicLower = lesson.topic.toLowerCase();
    
    if (
      strongTopicNames.some(t => lessonTopicLower.includes(t)) &&
      !recommendedLessons.includes(lesson)
    ) {
      recommendedLessons.push(lesson);
    }
  });

  // Если недостаточно уроков, добавить остальные
  coursePlan.lessons.forEach(lesson => {
    if (!recommendedLessons.includes(lesson)) {
      recommendedLessons.push(lesson);
    }
  });

  return recommendedLessons.slice(0, maxLessons);
}

/**
 * Составить полные данные персонализированного курса
 */
export function createPersonalizedCourseData(
  answers: AssessmentAnswer[],
  questions: Array<{ question: string }>,
  courseId: number,
  grade: number
): PersonalizedCourseData {
  const topicAnalysis = analyzeAssessmentResults(answers, questions, courseId);
  
  const strongTopics = topicAnalysis.filter(t => 
    t.level === 'excellent' || t.level === 'good'
  );
  const weakTopics = topicAnalysis.filter(t => 
    t.level === 'weak' || t.level === 'moderate'
  );

  const overallPercentage = Math.round(
    (answers.filter(a => a.isCorrect).length / answers.length) * 100
  );

  const recommendedLessons = getRecommendedLessons(
    strongTopics,
    weakTopics,
    courseId,
    grade
  );

  return {
    strongTopics,
    weakTopics,
    overallPercentage,
    recommendedLessons,
    courseId,
    grade
  };
}

