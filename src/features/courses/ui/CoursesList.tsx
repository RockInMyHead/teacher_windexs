/**
 * Courses List Component
 * Displays a list/grid of courses with filtering
 * @module features/courses/ui/CoursesList
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { LoadingIndicator } from '@/features/chat';
import type { CoursePlan, CourseFilter } from '../types';

interface CoursesListProps {
  courses: CoursePlan[];
  isLoading?: boolean;
  error?: string | null;
  filter?: CourseFilter;
  onFilterChange?: (filter: CourseFilter) => void;
  onCourseSelect?: (course: CoursePlan) => void;
  onCourseStart?: (course: CoursePlan) => void;
  availableGrades?: number[];
  courseProgress?: Record<string, number>; // courseKey -> progress
  className?: string;
}

export function CoursesList({
  courses,
  isLoading = false,
  error = null,
  filter = {},
  onFilterChange,
  onCourseSelect,
  onCourseStart,
  availableGrades = [],
  courseProgress = {},
  className = ''
}: CoursesListProps) {
  const [searchQuery, setSearchQuery] = React.useState(filter.searchQuery || '');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (onFilterChange) {
      onFilterChange({ ...filter, searchQuery: value });
    }
  };

  const handleGradeChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filter, grade: value === 'all' ? undefined : parseInt(value) });
    }
  };

  const handleSubjectChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange({ ...filter, subject: value === 'all' ? undefined : value });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const hasActiveFilters = filter.grade || filter.subject || filter.searchQuery;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск курсов..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grade and Subject filters */}
        <div className="flex gap-3">
          <Select value={filter.grade?.toString() || 'all'} onValueChange={handleGradeChange}>
            <SelectTrigger className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Класс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все классы</SelectItem>
              {availableGrades.map(grade => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade} класс
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.subject || 'all'} onValueChange={handleSubjectChange}>
            <SelectTrigger className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Предмет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все предметы</SelectItem>
              <SelectItem value="английский">Английский язык</SelectItem>
              <SelectItem value="математика">Математика</SelectItem>
              <SelectItem value="русский">Русский язык</SelectItem>
              <SelectItem value="литература">Литература</SelectItem>
              <SelectItem value="история">История</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={clearFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <LoadingIndicator message="Загрузка курсов..." />
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Курсы не найдены</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Сбросить фильтры
            </Button>
          )}
        </div>
      )}

      {/* Courses grid */}
      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseKey = `${course.grade}_${course.title}`;
            const progress = courseProgress[courseKey] || 0;

            return (
              <CourseCard
                key={courseKey}
                course={course}
                progress={progress}
                onSelect={() => onCourseSelect?.(course)}
                onStart={() => onCourseStart?.(course)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}




