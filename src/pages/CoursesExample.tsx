/**
 * Courses Example Page
 * Demonstrates the new modular courses architecture
 * Shows migration from 20895-line monolith to clean modules
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CoursesList,
  useCoursesModel,
  useAvailableGrades,
  getLegacyDataStats
} from '@/features/courses';

export function CoursesExample() {
  const [showCourses, setShowCourses] = React.useState(false);
  const courses = useCoursesModel();
  const { grades } = useAvailableGrades();
  const [stats, setStats] = React.useState<any>(null);

  // Load courses and stats
  React.useEffect(() => {
    courses.loadCourses();
    setStats(getLegacyDataStats());
  }, []);

  if (showCourses) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Все курсы</h1>
              <p className="text-muted-foreground">
                {stats ? `${stats.totalCourses} курсов, ${stats.totalLessons} уроков` : ''}
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowCourses(false)}>
              Назад к демо
            </Button>
          </div>

          <CoursesList
            courses={courses.courses}
            isLoading={courses.isLoading}
            error={courses.error}
            filter={courses.filter}
            onFilterChange={courses.loadCourses}
            availableGrades={grades}
            onCourseSelect={(course) => {
              console.log('Selected course:', course);
              alert(`Выбран курс: ${course.title}\n\nУроков: ${course.lessons.length}`);
            }}
            onCourseStart={(course) => {
              console.log('Start course:', course);
              alert(`Начинаем курс: ${course.title}!`);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              📚 Courses Feature: Новая архитектура
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Успешная миграция гигантского монолита!
              </p>

              {/* Stats comparison */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">🏆 Результат Phase 5</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-4xl font-bold">20,895</div>
                    <div className="text-sm opacity-90">строк было</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">→</div>
                    <div className="text-sm opacity-90">рефакторинг</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">~800</div>
                    <div className="text-sm opacity-90">строк стало</div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-900">{stats.totalCourses}</div>
                    <div className="text-sm text-blue-700">Курсов</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-900">{stats.totalLessons}</div>
                    <div className="text-sm text-green-700">Уроков</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-900">{stats.subjects.length}</div>
                    <div className="text-sm text-purple-700">Предметов</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-900">{stats.testQuestionsCount}</div>
                    <div className="text-sm text-orange-700">Вопросов</div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-2">🎯 Legacy Adapter</h3>
                  <p className="text-sm text-blue-700">
                    Все 107 курсов доступны через совместимый адаптер. Нулевая поломка функциональности!
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-900 mb-2">🔍 Фильтрация</h3>
                  <p className="text-sm text-green-700">
                    Поиск, фильтры по классу и предмету, сортировка - всё из коробки!
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-purple-900 mb-2">📊 Прогресс</h3>
                  <p className="text-sm text-purple-700">
                    Отслеживание прогресса с автосохранением в localStorage.
                  </p>
                </div>
              </div>

              {/* Architecture highlights */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-left">
                <h3 className="text-xl font-bold mb-4">🏗️ Новая архитектура:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">features/courses/api/</code>
                    <p className="text-muted-foreground mt-1">API функции для курсов</p>
                  </div>
                  <div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">features/courses/model/</code>
                    <p className="text-muted-foreground mt-1">State management hooks</p>
                  </div>
                  <div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">features/courses/ui/</code>
                    <p className="text-muted-foreground mt-1">3 переиспользуемых компонента</p>
                  </div>
                  <div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">features/courses/data/</code>
                    <p className="text-muted-foreground mt-1">Реестр + Legacy adapter</p>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <Button
                size="lg"
                onClick={() => setShowCourses(true)}
                className="px-8 py-4 text-lg font-semibold"
              >
                🚀 Посмотреть все курсы
              </Button>

              {/* Technical info */}
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Миграция включает:</p>
                <ul className="space-y-1">
                  <li>• useCoursesModel() - управление списком курсов</li>
                  <li>• useCourseModel() - управление отдельным курсом</li>
                  <li>• useCourseProgress() - отслеживание прогресса</li>
                  <li>• CoursesList, CourseCard, LessonCard - UI компоненты</li>
                  <li>• Legacy Adapter - совместимость со старыми данными</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CoursesExample;




