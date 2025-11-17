// Stub implementation for lesson context manager

export interface LessonBlock {
  id: number;
  title: string;
  content: string;
  type: string;
}

export interface LessonContext {
  currentTopic?: string;
}

export class LessonContextManager {
  getCurrentContext(): LessonContext | null {
    return null;
  }

  getSystemPrompt(): string {
    return '';
  }

  startLesson(data: any): void {
    // stub
  }

  updateCurrentBlock(block: LessonBlock, blockIndex?: number, totalBlocks?: number): void {
    // stub
  }

  endLesson(): void {
    // stub
  }
}
