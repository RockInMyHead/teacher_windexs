/**
 * Тесты для планов курсов
 */

import { describe, it, expect } from 'vitest';
import { COURSE_PLANS, getCoursePlan, getLessonFromPlan, getAvailableGrades, getCourseRecommendation, determineStudentLevel, generateLessonModules, populateCoursePlanModules } from './coursePlans';
import { AssessmentResult } from './adaptiveAssessment';

describe('Course Plans', () => {
  it('should have course plans defined', () => {
    expect(COURSE_PLANS).toBeDefined();
    expect(Array.isArray(COURSE_PLANS)).toBe(true);
    expect(COURSE_PLANS.length).toBe(48);
  });

  it('should have grade 1 course plan', () => {
    const grade1Plans = COURSE_PLANS.filter(plan => plan.grade === 1);
    expect(grade1Plans).toHaveLength(4); // Четыре курса для 1 класса: английский, русский, китайский и арабский

    const englishPlan = grade1Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade1Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade1Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade1Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык для 1 класса');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 1 класса');
    expect(russianPlan?.lessons.length).toBe(32);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 1 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 1 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 2 course plan', () => {
    const grade2Plans = COURSE_PLANS.filter(plan => plan.grade === 2);
    expect(grade2Plans).toHaveLength(4); // Четыре курса для 2 класса: английский, русский, китайский и арабский

    const englishPlan = grade2Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade2Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade2Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade2Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 2 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 2 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 2 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 2 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 3 course plan', () => {
    const grade3Plans = COURSE_PLANS.filter(plan => plan.grade === 3);
    expect(grade3Plans).toHaveLength(4); // Четыре курса для 3 класса: английский, русский, китайский и арабский

    const englishPlan = grade3Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade3Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade3Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade3Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 3 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 3 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 3 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 3 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 4 course plan', () => {
    const grade4Plans = COURSE_PLANS.filter(plan => plan.grade === 4);
    expect(grade4Plans).toHaveLength(4); // Четыре курса для 4 класса: английский, русский, китайский и арабский

    const englishPlan = grade4Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade4Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade4Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade4Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 4 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 4 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 4 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 4 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 5 course plan', () => {
    const grade5Plans = COURSE_PLANS.filter(plan => plan.grade === 5);
    expect(grade5Plans).toHaveLength(4); // Четыре курса для 5 класса: английский, русский, китайский и арабский

    const englishPlan = grade5Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade5Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade5Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade5Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 5 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 5 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 5 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 5 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 6 course plan', () => {
    const grade6Plans = COURSE_PLANS.filter(plan => plan.grade === 6);
    expect(grade6Plans).toHaveLength(4); // Четыре курса для 6 класса: английский, русский, китайский и арабский

    const englishPlan = grade6Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade6Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade6Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade6Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 6 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 6 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 6 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 6 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 7 course plan', () => {
    const grade7Plans = COURSE_PLANS.filter(plan => plan.grade === 7);
    expect(grade7Plans).toHaveLength(4); // Четыре курса для 7 класса: английский, русский, китайский и арабский

    const englishPlan = grade7Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade7Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade7Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade7Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 7 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 7 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 7 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 7 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 8 course plan', () => {
    const grade8Plans = COURSE_PLANS.filter(plan => plan.grade === 8);
    expect(grade8Plans).toHaveLength(4); // Четыре курса для 8 класса: английский, русский, китайский и арабский

    const englishPlan = grade8Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade8Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade8Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade8Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 8 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 8 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 8 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 8 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 9 course plan', () => {
    const grade9Plans = COURSE_PLANS.filter(plan => plan.grade === 9);
    expect(grade9Plans).toHaveLength(4); // Четыре курса для 9 класса: английский, русский, китайский и арабский

    const englishPlan = grade9Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade9Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade9Plans.find(plan => plan.title.includes('Китайский'));
    const arabicPlan = grade9Plans.find(plan => plan.title.includes('Арабский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 9 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 9 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 9 класса');
    expect(chinesePlan?.lessons.length).toBe(34);

    expect(arabicPlan).toBeDefined();
    expect(arabicPlan?.title).toBe('Арабский язык для 9 класса');
    expect(arabicPlan?.lessons.length).toBe(34);
  });

  it('should have grade 10 course plan', () => {
    const grade10Plans = COURSE_PLANS.filter(plan => plan.grade === 10);
    expect(grade10Plans).toHaveLength(3); // Три курса для 10 класса: английский, русский и китайский

    const englishPlan = grade10Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade10Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade10Plans.find(plan => plan.title.includes('Китайский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 10 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 10 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 10 класса');
    expect(chinesePlan?.lessons.length).toBe(34);
  });

  it('should have grade 11 course plan', () => {
    const grade11Plans = COURSE_PLANS.filter(plan => plan.grade === 11);
    expect(grade11Plans).toHaveLength(3); // Три курса для 11 класса: английский, русский и китайский

    const englishPlan = grade11Plans.find(plan => plan.title.includes('Английский'));
    const russianPlan = grade11Plans.find(plan => plan.title.includes('Русский'));
    const chinesePlan = grade11Plans.find(plan => plan.title.includes('Китайский'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Английский язык, 11 класс');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Русский язык для 11 класса');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для 11 класса');
    expect(chinesePlan?.lessons.length).toBe(34);
  });

  it('should have OGE preparation course plan', () => {
    const ogePlans = COURSE_PLANS.filter(plan => plan.grade === 90);
    expect(ogePlans).toHaveLength(2); // Два курса подготовки к ОГЭ: английский и русский

    const englishPlan = ogePlans.find(plan => plan.title.includes('английскому'));
    const russianPlan = ogePlans.find(plan => plan.title.includes('русскому'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Подготовка к ОГЭ по английскому языку');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Подготовка к ОГЭ по русскому языку');
    expect(russianPlan?.lessons.length).toBe(36);
  });

  it('should have EGE preparation course plan', () => {
    const egePlans = COURSE_PLANS.filter(plan => plan.grade === 100);
    expect(egePlans).toHaveLength(2); // Два курса подготовки к ЕГЭ: английский и русский

    const englishPlan = egePlans.find(plan => plan.title.includes('английскому'));
    const russianPlan = egePlans.find(plan => plan.title.includes('русскому'));

    expect(englishPlan).toBeDefined();
    expect(englishPlan?.title).toBe('Подготовка к ЕГЭ по английскому языку');
    expect(englishPlan?.lessons.length).toBe(32);

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Подготовка к ЕГЭ по русскому языку');
    expect(russianPlan?.lessons.length).toBe(36);
  });

  it('should have university preparation course plan', () => {
    const universityPlans = COURSE_PLANS.filter(plan => plan.grade === 200);
    expect(universityPlans).toHaveLength(2); // Два курса для вуза: русский и китайский

    const russianPlan = universityPlans.find(plan => plan.title.includes('русскому'));
    const chinesePlan = universityPlans.find(plan => plan.title.includes('Китайский'));

    expect(russianPlan).toBeDefined();
    expect(russianPlan?.title).toBe('Подготовка к ВУЗу по русскому языку');
    expect(russianPlan?.lessons.length).toBe(36);

    expect(chinesePlan).toBeDefined();
    expect(chinesePlan?.title).toBe('Китайский язык для вуза');
    expect(chinesePlan?.lessons.length).toBe(34);
  });

  it('should get course plan by grade', () => {
    const plan = getCoursePlan(1);
    expect(plan).toBeDefined();
    expect(plan?.grade).toBe(1);
    expect(plan?.lessons.length).toBe(32);
  });

  it('should return null for non-existent grade', () => {
    const plan = getCoursePlan(999);
    expect(plan).toBeNull();
  });

  it('should get lesson from plan', () => {
    const lesson = getLessonFromPlan(1, 1);
    expect(lesson).toBeDefined();
    expect(lesson?.number).toBe(1);
    expect(lesson?.title).toBe('Hello, English!');
  });

  it('should return null for non-existent lesson', () => {
    const lesson = getLessonFromPlan(1, 999);
    expect(lesson).toBeNull();
  });

  it('should get available grades', () => {
    const grades = getAvailableGrades();
    expect(grades).toContain(1);
    expect(grades).toContain(2);
    expect(grades).toContain(3);
    expect(grades).toContain(4);
    expect(grades).toContain(5);
    expect(grades).toContain(6);
    expect(grades).toContain(7);
    expect(grades).toContain(8);
    expect(grades).toContain(9);
    expect(grades).toContain(10);
    expect(grades).toContain(11);
    expect(grades).toContain(90);
    expect(grades).toContain(100);
    expect(grades).toContain(200);
    expect(grades).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 90, 100, 200]);
  });

  describe('Course Recommendation', () => {
    it('should recommend OGE course for grade 9', () => {
      const mockResult: AssessmentResult = {
        classGrade: '9',
        lastTopic: 'Present Simple',
        cluster: 'grade9',
        profile: [
          { concept: 'present_simple', p: 0.8 },
          { concept: 'past_simple', p: 0.3 },
          { concept: 'future_simple', p: 0.2 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const recommendation = getCourseRecommendation(mockResult);

      expect(recommendation).toBeDefined();
      expect(recommendation?.plan.grade).toBe(90);
      expect(recommendation?.plan.title).toBe('Подготовка к ОГЭ по английскому языку');
      expect(recommendation?.recommendedLessonNumber).toBe(1);
    });

    it('should recommend EGE course for grade 11', () => {
      const mockResult: AssessmentResult = {
        classGrade: '11',
        lastTopic: 'Conditionals',
        cluster: 'grade11',
        profile: [
          { concept: 'conditionals', p: 0.9 },
          { concept: 'passive', p: 0.4 },
          { concept: 'reported_speech', p: 0.3 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const recommendation = getCourseRecommendation(mockResult);

      expect(recommendation).toBeDefined();
      expect(recommendation?.plan.grade).toBe(100);
      expect(recommendation?.plan.title).toBe('Подготовка к ЕГЭ по английскому языку');
      expect(recommendation?.recommendedLessonNumber).toBe(1);
    });

    it('should recommend regular course for grade 7', () => {
      const mockResult: AssessmentResult = {
        classGrade: '7',
        lastTopic: 'Present Continuous',
        cluster: 'grade7',
        profile: [
          { concept: 'present_simple', p: 0.8 },
          { concept: 'present_continuous', p: 0.8 },
          { concept: 'past_simple', p: 0.4 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const recommendation = getCourseRecommendation(mockResult);

      expect(recommendation).toBeDefined();
      expect(recommendation?.plan.grade).toBe(7);
      expect(recommendation?.plan.title).toBe('Английский язык, 7 класс');
    });

    it('should start with lesson 1 for exam courses', () => {
      const mockResult: AssessmentResult = {
        classGrade: '9',
        lastTopic: 'Present Simple',
        cluster: 'grade9',
        profile: [
          { concept: 'present_simple', p: 0.9 },
          { concept: 'past_simple', p: 0.9 },
          { concept: 'future_simple', p: 0.9 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const recommendation = getCourseRecommendation(mockResult);

      expect(recommendation?.recommendedLessonNumber).toBe(1);
    });

    it('should provide reasoning for recommendation', () => {
      const mockResult: AssessmentResult = {
        classGrade: '9',
        lastTopic: 'Present Simple',
        cluster: 'grade9',
        profile: [
          { concept: 'present_simple', p: 0.8 },
          { concept: 'past_simple', p: 0.4 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const recommendation = getCourseRecommendation(mockResult);

      expect(recommendation?.reasoning).toContain('Подготовка к ОГЭ по английскому языку');
      expect(recommendation?.reasoning).toContain('9 классу');
      expect(recommendation?.reasoning).toContain('2 проверенных тем');
      expect(recommendation?.reasoning).toContain('хорошо знаете 1');
      expect(recommendation?.studentLevel).toBeDefined();
      expect(recommendation?.lessonModules).toBeDefined();
      expect(recommendation?.lessonModules.length).toBeGreaterThan(0);
    });
  });

  describe('Student Level Determination', () => {
    it('should determine beginner level for low mastery', () => {
      const mockResult: AssessmentResult = {
        classGrade: '7',
        lastTopic: 'Present Simple',
        cluster: 'grade7',
        profile: [
          { concept: 'present_simple', p: 0.3 },
          { concept: 'past_simple', p: 0.2 },
          { concept: 'future_simple', p: 0.4 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const level = determineStudentLevel(mockResult);
      expect(level).toBe('beginner');
    });

    it('should determine intermediate level for medium mastery', () => {
      const mockResult: AssessmentResult = {
        classGrade: '7',
        lastTopic: 'Present Simple',
        cluster: 'grade7',
        profile: [
          { concept: 'present_simple', p: 0.6 },
          { concept: 'past_simple', p: 0.7 },
          { concept: 'future_simple', p: 0.8 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const level = determineStudentLevel(mockResult);
      expect(level).toBe('intermediate');
    });

    it('should determine advanced level for high mastery', () => {
      const mockResult: AssessmentResult = {
        classGrade: '7',
        lastTopic: 'Present Simple',
        cluster: 'grade7',
        profile: [
          { concept: 'present_simple', p: 0.9 },
          { concept: 'past_simple', p: 0.8 },
          { concept: 'future_simple', p: 0.9 }
        ],
        plan2w: [],
        timestamp: new Date()
      };

      const level = determineStudentLevel(mockResult);
      expect(level).toBe('advanced');
    });
  });

  describe('Lesson Modules Generation', () => {
    const mockLesson = {
      number: 1,
      title: 'Past Simple Introduction',
      topic: 'Past Simple (правильные глаголы)',
      aspects: 'Образование и употребление Past Simple с правильными глаголами',
      modules: [],
      difficulty: 'beginner' as const
    };

    it('should generate basic modules for beginner student', () => {
      const modules = generateLessonModules(mockLesson, 'beginner');

      expect(modules.length).toBe(4);
      expect(modules[0].type).toBe('conspectus');
      expect(modules[1].type).toBe('theory');
      expect(modules[2].type).toBe('practice');
      expect(modules[3].type).toBe('test');
    });

    it('should add advanced modules for intermediate student', () => {
      const modules = generateLessonModules(mockLesson, 'intermediate');

      expect(modules.length).toBe(5);
      expect(modules[4].title).toContain('Углубленная практика');
      expect(modules[4].type).toBe('practice');
    });

    it('should add preparation module for advanced lesson with beginner student', () => {
      const advancedLesson = { ...mockLesson, difficulty: 'advanced' as const };
      const modules = generateLessonModules(advancedLesson, 'beginner');

      expect(modules.length).toBe(5);
      expect(modules[0].title).toContain('Подготовка');
      expect(modules[0].type).toBe('theory');
    });

    it('should add all advanced modules for advanced student', () => {
      const modules = generateLessonModules(mockLesson, 'advanced');

      expect(modules.length).toBe(6);
      expect(modules[4].title).toContain('Углубленная практика');
      expect(modules[5].title).toContain('Продвинутый тест');
      expect(modules[5].type).toBe('test');
    });
  });

  describe('Course Plan Population', () => {
    it('should populate modules for lessons without modules', () => {
      const mockPlan: any = {
        grade: 7,
        title: 'Test Course',
        description: 'Test description',
        lessons: [
          {
            number: 1,
            title: 'Test Lesson',
            topic: 'Test Topic',
            aspects: 'Test aspects'
          }
        ]
      };

      const populatedPlan = populateCoursePlanModules(mockPlan);

      expect(populatedPlan.lessons[0].modules).toBeDefined();
      expect(populatedPlan.lessons[0].modules.length).toBe(4);
      expect(populatedPlan.lessons[0].difficulty).toBe('beginner');
    });

    it('should preserve existing modules and difficulty', () => {
      const mockPlan: any = {
        grade: 7,
        title: 'Test Course',
        description: 'Test description',
        lessons: [
          {
            number: 1,
            title: 'Test Lesson',
            topic: 'Test Topic',
            aspects: 'Test aspects',
            modules: [
              {
                number: 1,
                title: 'Custom Module',
                type: 'theory' as const,
                content: 'Custom content'
              }
            ],
            difficulty: 'advanced' as const
          }
        ]
      };

      const populatedPlan = populateCoursePlanModules(mockPlan);

      expect(populatedPlan.lessons[0].modules.length).toBe(1);
      expect(populatedPlan.lessons[0].modules[0].title).toBe('Custom Module');
      expect(populatedPlan.lessons[0].difficulty).toBe('advanced');
    });
  });

  it('should have proper lesson structure', () => {
    const plan = getCoursePlan(1);
    if (plan) {
      plan.lessons.forEach(lesson => {
        expect(lesson).toHaveProperty('number');
        expect(lesson).toHaveProperty('title');
        expect(lesson).toHaveProperty('topic');
        expect(lesson).toHaveProperty('aspects');
        expect(typeof lesson.number).toBe('number');
        expect(typeof lesson.title).toBe('string');
        expect(typeof lesson.topic).toBe('string');
        expect(typeof lesson.aspects).toBe('string');
      });
    }
  });
});
