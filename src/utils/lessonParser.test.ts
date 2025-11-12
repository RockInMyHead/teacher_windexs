import { describe, it, expect } from 'vitest';
import { parseLessonFromAI } from '@/components/InteractiveLesson';

describe('Lesson Parser', () => {
  it('should reject lesson with less than 12 steps', () => {
    const input = `\`\`\`json
[
  {
    "type": "theory",
    "title": "Test Title",
    "content": "Test content"
  }
]
\`\`\``;

    const result = parseLessonFromAI(input);
    expect(result).toBeNull(); // Should be null because less than 5 steps
  });

  it('should reject lesson without minimum 2 questions per block', () => {
    const input = `[
  {
    "type": "theory",
    "title": "Theory",
    "content": "Content"
  },
  {
    "type": "question",
    "title": "Test Question",
    "content": "Choose the answer",
    "questions": [
      {
        "id": "q1",
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "explanation": "2+2=4"
      }
    ]
  },
  {
    "type": "theory",
    "title": "Theory 2",
    "content": "Content 2"
  },
  {
    "type": "question",
    "title": "Practice",
    "content": "More practice",
    "questions": [
      {
        "id": "q2",
        "question": "What is 3+3?",
        "options": ["5", "6", "7", "8"],
        "correctAnswer": 1,
        "explanation": "3+3=6"
      }
    ]
  },
  {
    "type": "summary",
    "title": "Summary",
    "content": "Done"
  }
]`;

    const result = parseLessonFromAI(input);
    expect(result).toBeNull(); // Should fail because each question block has only 1 question
  });

  it('should return null for invalid JSON', () => {
    const input = 'This is just plain text without JSON';
    const result = parseLessonFromAI(input);
    expect(result).toBeNull();
  });

  it('should parse valid lesson structure with 15 steps', () => {
    const input = `\`\`\`json
[
  {"type":"theory","title":"Введение","content":"Теория 1"},
  {"type":"theory","title":"Основы","content":"Теория 2"},
  {"type":"question","title":"Тест 1","content":"Вопросы","questions":[
    {"id":"q1","question":"Q1","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp1"},
    {"id":"q2","question":"Q2","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp2"},
    {"id":"q3","question":"Q3","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Exp3"}
  ]},
  {"type":"theory","title":"Подробности","content":"Теория 3"},
  {"type":"question","title":"Тест 2","content":"Вопросы","questions":[
    {"id":"q4","question":"Q4","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp4"},
    {"id":"q5","question":"Q5","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp5"}
  ]},
  {"type":"theory","title":"Нюансы","content":"Теория 4"},
  {"type":"question","title":"Тест 3","content":"Вопросы","questions":[
    {"id":"q6","question":"Q6","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp6"},
    {"id":"q7","question":"Q7","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp7"}
  ]},
  {"type":"theory","title":"Продвинутые","content":"Теория 5"},
  {"type":"theory","title":"Особенности","content":"Теория 6"},
  {"type":"question","title":"Тест 4","content":"Вопросы","questions":[
    {"id":"q8","question":"Q8","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp8"},
    {"id":"q9","question":"Q9","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp9"},
    {"id":"q10","question":"Q10","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Exp10"}
  ]},
  {"type":"theory","title":"Применение","content":"Теория 7"},
  {"type":"question","title":"Финальный тест","content":"Вопросы","questions":[
    {"id":"q11","question":"Q11","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp11"},
    {"id":"q12","question":"Q12","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp12"},
    {"id":"q13","question":"Q13","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Exp13"},
    {"id":"q14","question":"Q14","options":["A","B","C","D"],"correctAnswer":3,"explanation":"Exp14"}
  ]},
  {"type":"theory","title":"Советы","content":"Теория 8"},
  {"type":"theory","title":"Ошибки","content":"Теория 9"},
  {"type":"summary","title":"Итоги","content":"Резюме"}
]
\`\`\``;

    const result = parseLessonFromAI(input);
    expect(result).toBeTruthy();
    expect(result?.length).toBe(15);
    expect(result?.[0].type).toBe('theory');
    expect(result?.[2].type).toBe('question');
    expect(result?.[14].type).toBe('summary');
    expect(result?.[2].questions?.length).toBe(3);
    expect(result?.[11].questions?.length).toBe(4);
  });

  it('should handle JSON with extra text before and after', () => {
    const input = `Here is your lesson:
\`\`\`json
[
  {"type":"theory","title":"Intro","content":"Content"},
  {"type":"theory","title":"Basics","content":"Content"},
  {"type":"question","title":"Test1","content":"Questions","questions":[
    {"id":"q1","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp"},
    {"id":"q2","question":"Q?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp"}
  ]},
  {"type":"theory","title":"Details","content":"Content"},
  {"type":"question","title":"Test2","content":"Questions","questions":[
    {"id":"q3","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp"},
    {"id":"q4","question":"Q?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp"}
  ]},
  {"type":"theory","title":"Advanced","content":"Content"},
  {"type":"question","title":"Test3","content":"Questions","questions":[
    {"id":"q5","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp"},
    {"id":"q6","question":"Q?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp"}
  ]},
  {"type":"theory","title":"Expert","content":"Content"},
  {"type":"theory","title":"Special","content":"Content"},
  {"type":"question","title":"Test4","content":"Questions","questions":[
    {"id":"q7","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp"},
    {"id":"q8","question":"Q?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp"},
    {"id":"q9","question":"Q?","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Exp"}
  ]},
  {"type":"theory","title":"Application","content":"Content"},
  {"type":"question","title":"Final Test","content":"Questions","questions":[
    {"id":"q10","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Exp"},
    {"id":"q11","question":"Q?","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Exp"},
    {"id":"q12","question":"Q?","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Exp"},
    {"id":"q13","question":"Q?","options":["A","B","C","D"],"correctAnswer":3,"explanation":"Exp"}
  ]},
  {"type":"theory","title":"Tips","content":"Content"},
  {"type":"theory","title":"Errors","content":"Content"},
  {"type":"summary","title":"Summary","content":"Content"}
]
\`\`\`
Good luck!`;

    const result = parseLessonFromAI(input);
    expect(result).toBeTruthy();
    expect(result?.length).toBe(15);
  });
});

