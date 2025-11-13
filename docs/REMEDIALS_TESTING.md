# 🧪 Тестирование системы ремедиалов

## Unit тесты для LessonProgressTracker

```typescript
// src/__tests__/utils/adaptiveLessonFlow.test.ts

import { LessonProgressTracker, generateRemedialsPrompt, insertRemedialsIntoLesson } from '../../utils/adaptiveLessonFlow';

describe('LessonProgressTracker', () => {
  let tracker: LessonProgressTracker;

  beforeEach(() => {
    tracker = new LessonProgressTracker('test-lesson', 15);
  });

  describe('recordAnswer', () => {
    it('should record correct answer', () => {
      const isCorrect = tracker.recordAnswer(
        1, 'practice', 'Test Block', 'topic', 'q1', 
        'What is test?', 'answer', 'answer', 'beginner'
      );
      
      expect(isCorrect).toBe(true);
      expect(tracker.getFailedBlocks().length).toBe(0);
    });

    it('should record incorrect answer', () => {
      const isCorrect = tracker.recordAnswer(
        1, 'practice', 'Test Block', 'topic', 'q1',
        'What is test?', 'wrong', 'correct', 'beginner'
      );
      
      expect(isCorrect).toBe(false);
      expect(tracker.getFailedBlocks().length).toBe(1);
      expect(tracker.getFailedBlocks()[0].blockId).toBe(1);
    });

    it('should increment failure count for repeated wrong answers', () => {
      // First wrong answer
      tracker.recordAnswer(1, 'practice', 'Block', 'topic', 'q1', 'Q', 'A', 'B', 'beginner');
      
      // Second wrong answer for same block
      tracker.recordAnswer(1, 'practice', 'Block', 'topic', 'q2', 'Q', 'A', 'B', 'beginner');
      
      const failed = tracker.getFailedBlocks();
      expect(failed[0].failureCount).toBe(2);
    });
  });

  describe('getStatistics', () => {
    it('should calculate accuracy correctly', () => {
      tracker.recordAnswer(1, 'practice', 'B1', 'topic', 'q1', 'Q', 'A', 'A', 'beginner'); // ✓
      tracker.recordAnswer(2, 'practice', 'B2', 'topic', 'q2', 'Q', 'B', 'C', 'beginner'); // ✗
      
      const stats = tracker.getStatistics();
      
      expect(stats.totalAnswers).toBe(2);
      expect(stats.correctAnswers).toBe(1);
      expect(stats.accuracy).toBe(50);
    });

    it('should count failed blocks correctly', () => {
      tracker.recordAnswer(1, 'practice', 'B1', 'topic', 'q1', 'Q', 'A', 'B', 'beginner');
      tracker.recordAnswer(2, 'practice', 'B2', 'topic', 'q2', 'Q', 'A', 'A', 'beginner');
      tracker.recordAnswer(3, 'practice', 'B3', 'topic', 'q3', 'Q', 'A', 'B', 'beginner');
      
      const stats = tracker.getStatistics();
      
      expect(stats.failedBlocksCount).toBe(2);
    });
  });

  describe('shouldAddRemedials', () => {
    it('should return false when no failed blocks', () => {
      tracker.recordAnswer(1, 'practice', 'B1', 'topic', 'q1', 'Q', 'A', 'A', 'beginner');
      
      expect(tracker.shouldAddRemedials()).toBe(false);
    });

    it('should return true when there are failed blocks', () => {
      tracker.recordAnswer(1, 'practice', 'B1', 'topic', 'q1', 'Q', 'A', 'B', 'beginner');
      
      expect(tracker.shouldAddRemedials()).toBe(true);
    });
  });

  describe('getFailedBlocks', () => {
    it('should return failed blocks with correct structure', () => {
      tracker.recordAnswer(
        5, 'practice', 'Modal Verbs', 'modals', 'q1', 
        'Choose must or should', 'wrong', 'must', 'intermediate'
      );
      
      const failed = tracker.getFailedBlocks();
      
      expect(failed).toHaveLength(1);
      expect(failed[0]).toMatchObject({
        blockId: 5,
        blockTitle: 'Modal Verbs',
        topic: 'modals',
        failureCount: 1,
        difficulty: 'intermediate'
      });
    });
  });

  describe('recordRemedialsAdded', () => {
    it('should record remedials added correctly', () => {
      tracker.recordAnswer(1, 'practice', 'B1', 'topic', 'q1', 'Q', 'A', 'B', 'beginner');
      tracker.recordRemedialsAdded([1], 15);
      
      const progress = tracker.getProgress();
      
      expect(progress.remedialsAdded).toHaveLength(1);
      expect(progress.remedialsAdded[0]).toMatchObject({
        originalBlockId: 1,
        addedAfterBlockId: 15
      });
    });
  });
});
```

## Integration тесты

```typescript
// src/__tests__/integration/remedials.integration.test.ts

describe('Remedials Integration Flow', () => {
  it('should handle complete lesson flow with remedials', async () => {
    const tracker = new LessonProgressTracker('lesson-123', 15);
    
    // Simulate student answering 15 questions
    const answers = [
      { blockId: 1, userAnswer: 'A', correct: 'A' }, // ✓
      { blockId: 2, userAnswer: 'B', correct: 'C' }, // ✗
      { blockId: 3, userAnswer: 'C', correct: 'C' }, // ✓
      // ... more answers
    ];

    answers.forEach(ans => {
      tracker.recordAnswer(
        ans.blockId, 'practice', `Block ${ans.blockId}`, 
        'topic', 'q1', 'Question', ans.userAnswer, ans.correct, 'beginner'
      );
    });

    // Check if remedials are needed
    expect(tracker.shouldAddRemedials()).toBe(true);
    
    // Get failed blocks
    const failedBlocks = tracker.getFailedBlocks();
    expect(failedBlocks.length).toBeGreaterThan(0);
    
    // Generate prompt
    const prompt = generateRemedialsPrompt(failedBlocks, 'English');
    expect(prompt).toContain('ремедиальные');
    expect(prompt).toContain('Block 2'); // Failed block
  });

  it('should not add remedials when all answers correct', () => {
    const tracker = new LessonProgressTracker('lesson-456', 5);
    
    // All correct answers
    for (let i = 1; i <= 5; i++) {
      tracker.recordAnswer(
        i, 'practice', `Block ${i}`, 'topic', 'q1',
        'Question', 'answer', 'answer', 'beginner'
      );
    }

    expect(tracker.shouldAddRemedials()).toBe(false);
    expect(tracker.getFailedBlocks().length).toBe(0);
  });
});
```

## Component тесты

```typescript
// src/__tests__/components/RemedialsSystem.test.tsx

import { render, screen } from '@testing-library/react';
import { RemedialsSystemComponent } from '../../components/RemedialsSystem';
import { LessonProgressTracker } from '../../utils/adaptiveLessonFlow';

describe('RemedialsSystemComponent', () => {
  let tracker: LessonProgressTracker;

  beforeEach(() => {
    tracker = new LessonProgressTracker('test', 15);
  });

  it('should render statistics cards', () => {
    tracker.recordAnswer(1, 'practice', 'B', 'topic', 'q1', 'Q', 'A', 'A', 'beginner');
    
    const { container } = render(<RemedialsSystemComponent tracker={tracker} />);
    
    expect(screen.getByText(/Всего вопросов/)).toBeInTheDocument();
    expect(screen.getByText(/Правильно/)).toBeInTheDocument();
    expect(screen.getByText(/Точность/)).toBeInTheDocument();
  });

  it('should display failed blocks when present', () => {
    tracker.recordAnswer(1, 'practice', 'Modal Verbs', 'modals', 'q1', 'Q', 'A', 'B', 'beginner');
    
    const { container } = render(<RemedialsSystemComponent tracker={tracker} />);
    
    expect(screen.getByText(/Modal Verbs/)).toBeInTheDocument();
    expect(screen.getByText(/Блоки для повторения/)).toBeInTheDocument();
  });

  it('should not display failed blocks section when none exist', () => {
    tracker.recordAnswer(1, 'practice', 'B', 'topic', 'q1', 'Q', 'A', 'A', 'beginner');
    
    const { container } = render(<RemedialsSystemComponent tracker={tracker} />);
    
    expect(screen.queryByText(/Блоки для повторения/)).not.toBeInTheDocument();
  });

  it('should show remedials success message', () => {
    tracker.recordAnswer(1, 'practice', 'B', 'topic', 'q1', 'Q', 'A', 'B', 'beginner');
    tracker.recordRemedialsAdded([1], 15);
    
    const { container } = render(<RemedialsSystemComponent tracker={tracker} />);
    
    expect(screen.getByText(/Ремедиалы созданы/)).toBeInTheDocument();
  });
});
```

## Тестирование с мок данными

```typescript
// src/__tests__/utils/mockData.ts

export const mockFailedBlocks = [
  {
    blockId: 2,
    blockTitle: 'Модальные глаголы',
    topic: 'modals',
    failureCount: 1,
    lastFailedAt: new Date(),
    difficulty: 'beginner'
  },
  {
    blockId: 11,
    blockTitle: 'Past Simple',
    topic: 'past_simple',
    failureCount: 2,
    lastFailedAt: new Date(),
    difficulty: 'intermediate'
  }
];

export const mockRemedialsBlocks = [
  {
    id: 'remedial_2_v1',
    type: 'practice',
    title: 'Повторение: Модальные глаголы (Подход #2)',
    originalBlockId: 2,
    content: 'Давайте разберем...',
    instructions: 'Попробуй снова',
    difficulty: 'beginner',
    questions: [
      {
        id: 'q1',
        question: 'Что означает must?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1,
        explanation: 'Объяснение...'
      }
    ]
  }
];

export const mockOriginalBlocks = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  type: 'practice',
  title: `Block ${i + 1}`,
  topic: 'test',
  difficulty: 'beginner',
  questions: []
}));
```

## E2E тесты

```typescript
// e2e/remedials-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Remedials E2E Flow', () => {
  test('should show remedials after failing blocks', async ({ page }) => {
    await page.goto('http://localhost:3000/lesson/1');
    
    // Answer some questions incorrectly
    await page.click('text=Вариант B'); // Wrong answer
    await page.click('button:has-text("Далее")');
    
    await page.click('text=Вариант A'); // Wrong answer
    await page.click('button:has-text("Далее")');
    
    // Complete lesson
    await page.click('button:has-text("Завершить урок")');
    
    // Wait for remedials to generate
    await page.waitForTimeout(3000);
    
    // Check if remedials section appears
    const remedialsSection = await page.locator('text=Повторение трудного материала');
    expect(await remedialsSection.isVisible()).toBe(true);
  });

  test('should show statistics', async ({ page }) => {
    await page.goto('http://localhost:3000/lesson/1');
    
    // Answer some questions
    await page.click('text=Вариант A');
    
    // Check statistics
    const accuracyText = await page.locator('text=Точность:').textContent();
    expect(accuracyText).toContain('%');
  });

  it('should allow skipping remedials', async ({ page }) => {
    await page.goto('http://localhost:3000/lesson/1');
    
    // Complete lesson with some errors
    // ...
    
    // Skip remedials
    await page.click('button:has-text("Пропустить повторение")');
    
    // Should show next lesson
    expect(page.url()).toContain('/lesson/2');
  });
});
```

## Тестовые сценарии

### Сценарий 1: Идеальный ученик

```typescript
test('perfect student - no remedials', () => {
  const tracker = new LessonProgressTracker('lesson', 15);
  
  // All correct
  for (let i = 1; i <= 15; i++) {
    tracker.recordAnswer(i, 'practice', `B${i}`, 'topic', 'q1', 'Q', 'A', 'A', 'beginner');
  }
  
  expect(tracker.shouldAddRemedials()).toBe(false);
  expect(tracker.getStatistics().accuracy).toBe(100);
});
```

### Сценарий 2: Ученик с ошибками

```typescript
test('student with errors - generate remedials', () => {
  const tracker = new LessonProgressTracker('lesson', 15);
  
  const correctAnswers = [1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15];
  const wrongAnswers = [3, 7, 11, 13];
  
  for (let i = 1; i <= 15; i++) {
    const isCorrect = correctAnswers.includes(i);
    tracker.recordAnswer(
      i, 'practice', `B${i}`, 'topic', 'q1', 'Q',
      isCorrect ? 'A' : 'X',
      'A',
      'beginner'
    );
  }
  
  expect(tracker.shouldAddRemedials()).toBe(true);
  expect(tracker.getStatistics().accuracy).toBe(73);
  expect(tracker.getFailedBlocks().length).toBe(4);
});
```

### Сценарий 3: Повторяющиеся ошибки

```typescript
test('student failing same block multiple times', () => {
  const tracker = new LessonProgressTracker('lesson', 15);
  
  // Block 3 failed twice
  tracker.recordAnswer(3, 'practice', 'B3', 'topic', 'q1', 'Q', 'X', 'A', 'beginner');
  tracker.recordAnswer(3, 'practice', 'B3', 'topic', 'q2', 'Q', 'X', 'A', 'beginner');
  
  const failed = tracker.getFailedBlocks();
  expect(failed[0].failureCount).toBe(2);
});
```

## Запуск тестов

```bash
# Unit тесты
npm run test -- adaptiveLessonFlow

# Component тесты
npm run test -- RemedialsSystem

# Integration тесты
npm run test -- integration

# E2E тесты
npm run test:e2e -- remedials-flow

# Все тесты
npm run test:all

# С покрытием
npm run test:coverage
```

## Утверждение покрытия

```typescript
// Целевое покрытие: 80%+
expect(coverage.statements).toBeGreaterThan(80);
expect(coverage.branches).toBeGreaterThan(75);
expect(coverage.functions).toBeGreaterThan(80);
expect(coverage.lines).toBeGreaterThan(80);
```

---

**Документация версии:** 1.0  
**Дата:** Ноябрь 2025

