// Adaptive Assessment System for Personalized Learning

export type GradeCluster = 'grade1' | 'grade2' | 'grade3_4' | 'grade5_6' | 'grade7_8' | 'grade9' | 'grade10_11' | 'grade12' | 'grade13';

export interface ConceptScore {
  concept: string;
  p: number; // 1.0 | 0.7 | 0.4 | 0.2
}

export interface SessionPlan {
  session: number;
  targets: string[];
  mix: {
    review: number;    // 20-30%
    weak: number;      // 40-50%
    new: number;       // 20-30%
  };
}

export interface MicroProfile {
  concept: string;
  p: number;
}

export interface AssessmentResult {
  classGrade: string;
  lastTopic: string;
  cluster: GradeCluster;
  profile: MicroProfile[];
  plan2w: SessionPlan[];
  timestamp: Date;
}

export interface AssessmentQuestion {
  id: string;
  concept: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompt: string;
  options?: string[];
  correctAnswer?: number | string;
  key?: string | number;
}

// Map grade to cluster
export function mapGradeToCluster(grade: string): GradeCluster {
  // Extract number from string (handles "в 1", "1 класс", "первый класс", etc.)
  const gradeLower = grade.toLowerCase().trim();

  // Check for text-based grade indicators
  if (gradeLower.includes('первый') || gradeLower.includes('1')) return 'grade1';
  if (gradeLower.includes('второй') || gradeLower.includes('2')) return 'grade2';
  if (gradeLower.includes('третий') || gradeLower.includes('3')) return 'grade3_4';
  if (gradeLower.includes('четвертый') || gradeLower.includes('4')) return 'grade3_4';
  if (gradeLower.includes('пятый') || gradeLower.includes('5')) return 'grade5_6';
  if (gradeLower.includes('шестой') || gradeLower.includes('6')) return 'grade5_6';
  if (gradeLower.includes('седьмой') || gradeLower.includes('7')) return 'grade7_8';
  if (gradeLower.includes('восьмой') || gradeLower.includes('8')) return 'grade7_8';
  if (gradeLower.includes('девятый') || gradeLower.includes('9')) return 'grade9';
  if (gradeLower.includes('десятый') || gradeLower.includes('10')) return 'grade10_11';
  if (gradeLower.includes('одиннадцатый') || gradeLower.includes('11')) return 'grade10_11';
  if (gradeLower.includes('окончил') || gradeLower.includes('выпускник') || gradeLower.includes('после вуза') || gradeLower.includes('карьера') || gradeLower.includes('работаю') || gradeLower.includes('graduate')) return 'grade13';
  if (gradeLower.includes('вуз') || gradeLower.includes('университет') || gradeLower.includes('универ') || gradeLower.includes('студент') || gradeLower.includes('бакалавр') || gradeLower.includes('магистр') || gradeLower.includes('college')) return 'grade12';

  // Extract number using regex - improved to handle ranges like "10-11"
  const numberMatches = grade.match(/\d+/g);
  if (numberMatches && numberMatches.length > 0) {
    // If we have multiple numbers (like "10-11"), take the highest
    const numbers = numberMatches.map(n => parseInt(n)).sort((a, b) => b - a);
    const highestGrade = numbers[0];

    if (highestGrade === 1) return 'grade1';
    if (highestGrade === 2) return 'grade2';
    if (highestGrade === 3 || highestGrade === 4) return 'grade3_4';
    if (highestGrade === 5 || highestGrade === 6) return 'grade5_6';
    if (highestGrade === 7 || highestGrade === 8) return 'grade7_8';
    if (highestGrade === 9) return 'grade9';
    if (highestGrade === 10 || highestGrade === 11) return 'grade10_11';
    if (highestGrade === 12) return 'grade12';
    return 'grade13';
  }

  // Default to grade1 if nothing matches
  return 'grade1';
}

// Grade 1 Question Bank
const GRADE1_QUESTIONS: AssessmentQuestion[] = [
  // BEGINNER questions only for Grade 1
  {
    id: 'g1_greet_1',
    concept: 'greetings_basic',
    difficulty: 'beginner',
    prompt: 'Что значит "Hello" по-русски?',
    options: ['привет', 'до свидания', 'спасибо'],
    correctAnswer: 'привет'
  },
  {
    id: 'g1_greet_2',
    concept: 'greetings_basic',
    difficulty: 'beginner',
    prompt: 'Что значит "Goodbye" по-русски?',
    options: ['привет', 'до свидания', 'спасибо'],
    correctAnswer: 'до свидания'
  },
  {
    id: 'g1_numbers_1',
    concept: 'numbers_1_5',
    difficulty: 'beginner',
    prompt: 'Какое число идёт после двух?',
    options: ['one', 'two', 'three', 'four'],
    correctAnswer: 'three'
  },
  {
    id: 'g1_numbers_2',
    concept: 'numbers_1_5',
    difficulty: 'beginner',
    prompt: 'Как сказать "пять" на английском?',
    options: ['four', 'five', 'six', 'seven'],
    correctAnswer: 'five'
  },
  {
    id: 'g1_colors_1',
    concept: 'colors_basic',
    difficulty: 'beginner',
    prompt: 'Какой цвет по-английски: красный?',
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'red'
  },
  {
    id: 'g1_colors_2',
    concept: 'colors_basic',
    difficulty: 'beginner',
    prompt: 'Какой цвет по-английски: синий?',
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'blue'
  },
  {
    id: 'g1_alphabet_1',
    concept: 'alphabet_A_G',
    difficulty: 'beginner',
    prompt: 'Первая буква английского алфавита:',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A'
  },
  {
    id: 'g1_this_is_1',
    concept: 'this_is_noun',
    difficulty: 'beginner',
    prompt: 'Закончи: "This is a …" (животное)',
    options: ['cat', 'dog', 'bird', 'fish'],
    correctAnswer: 'cat'
  },
];

// Grade 2 Question Bank
const GRADE2_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g2_alphabet_1',
    concept: 'full_alphabet',
    difficulty: 'beginner',
    prompt: 'Третья буква английского алфавита:',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'C'
  },
  {
    id: 'g2_numbers_1',
    concept: 'numbers_1_20',
    difficulty: 'beginner',
    prompt: 'Как сказать "десять" по-английски?',
    options: ['eight', 'nine', 'ten', 'eleven'],
    correctAnswer: 'ten'
  },
  {
    id: 'g2_tobe_1',
    concept: 'to_be_present',
    difficulty: 'intermediate',
    prompt: 'Вставь "am/is/are": He __ a boy.',
    options: ['am', 'is', 'are'],
    correctAnswer: 'is'
  },
  {
    id: 'g2_family_1',
    concept: 'family_basic',
    difficulty: 'beginner',
    prompt: 'Женский родитель (мама) по-английски:',
    options: ['father', 'mother', 'sister', 'brother'],
    correctAnswer: 'mother'
  },
  {
    id: 'g2_what_who_1',
    concept: 'what_who_questions',
    difficulty: 'intermediate',
    prompt: 'Начало вопроса о имени:',
    options: ['Who is', 'What is', 'Where is', 'Why is'],
    correctAnswer: 'What is'
  },
];

// Grade 3-4 Question Bank
const GRADE3_4_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g34_tobe_full',
    concept: 'to_be_full',
    difficulty: 'intermediate',
    prompt: 'Вставь is для третьего лица: She __ a teacher.',
    options: ['am', 'is', 'are'],
    correctAnswer: 'is'
  },
  {
    id: 'g34_present_simple_1',
    concept: 'present_simple',
    difficulty: 'intermediate',
    prompt: 'Я люблю читать:',
    options: ['I like reading', 'I reading like', 'I like to read', 'I reading'],
    correctAnswer: 'I like reading'
  },
  {
    id: 'g34_have_got_1',
    concept: 'have_got',
    difficulty: 'intermediate',
    prompt: 'У неё есть кот: She __ got a cat.',
    options: ['have', 'has', 'had'],
    correctAnswer: 'has'
  },
  {
    id: 'g34_prepositions_1',
    concept: 'prepositions_place',
    difficulty: 'intermediate',
    prompt: 'The book is __ the table.',
    options: ['in', 'on', 'under', 'at'],
    correctAnswer: 'on'
  },
  {
    id: 'g34_reading_1',
    concept: 'reading_2_3_sent',
    difficulty: 'intermediate',
    prompt: 'Прочитай: "My name is Tom. I am 10 years old." - Как его зовут?',
    options: ['John', 'Tom', 'Tom', 'Mike'],
    correctAnswer: 'Tom'
  },
];

// Grade 5-6 Question Bank
const GRADE5_6_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g56_past_simple_reg',
    concept: 'past_simple_regular',
    difficulty: 'intermediate',
    prompt: 'Play в Past Simple:',
    options: ['play', 'played', 'plays', 'playing'],
    correctAnswer: 'played'
  },
  {
    id: 'g56_past_simple_reg2',
    concept: 'past_simple_regular',
    difficulty: 'intermediate',
    prompt: 'Walk в Past Simple:',
    options: ['walk', 'walked', 'walks', 'walking'],
    correctAnswer: 'walked'
  },
  {
    id: 'g56_past_simple_irreg',
    concept: 'past_simple_irregular',
    difficulty: 'advanced',
    prompt: 'Go в Past Simple ("я пошёл"):',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went'
  },
  {
    id: 'g56_past_simple_irreg2',
    concept: 'past_simple_irregular',
    difficulty: 'advanced',
    prompt: 'See в Past Simple ("она видела"):',
    options: ['see', 'sees', 'saw', 'seeing'],
    correctAnswer: 'saw'
  },
  {
    id: 'g56_present_continuous_1',
    concept: 'present_continuous',
    difficulty: 'intermediate',
    prompt: 'They __ playing football.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'are'
  },
  {
    id: 'g56_present_continuous_2',
    concept: 'present_continuous',
    difficulty: 'intermediate',
    prompt: 'I ___ eating now.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am'
  },
  {
    id: 'g56_comparative_1',
    concept: 'comparative',
    difficulty: 'intermediate',
    prompt: 'A cat is __ than a dog.',
    options: ['fast', 'faster', 'fastest', 'more fast'],
    correctAnswer: 'faster'
  },
  {
    id: 'g56_comparative_2',
    concept: 'comparative',
    difficulty: 'intermediate',
    prompt: 'Big → bigger →:',
    options: ['bigger', 'biggest', 'most big', 'more big'],
    correctAnswer: 'biggest'
  },
  {
    id: 'g56_have_got',
    concept: 'have_got',
    difficulty: 'beginner',
    prompt: 'Вставь "have/has": She ___ got a cat.',
    options: ['have', 'has', 'is'],
    correctAnswer: 'has'
  },
  {
    id: 'g56_prepositions',
    concept: 'prepositions_place',
    difficulty: 'beginner',
    prompt: 'Предлоги места: The book is ___ the table.',
    options: ['in', 'on', 'under'],
    correctAnswer: 'on'
  },
];

// Grade 7-8 Question Bank
const GRADE7_8_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g78_pres_perf_1',
    concept: 'present_perfect',
    difficulty: 'advanced',
    prompt: 'Present Perfect для "только что прочитал":',
    options: ['have read', 'has read', 'read', 'has been read'],
    correctAnswer: 'have read'
  },
  {
    id: 'g78_pres_perf_2',
    concept: 'present_perfect',
    difficulty: 'advanced',
    prompt: 'Present Perfect для "никогда не была":',
    options: ['has never been', 'has never go', 'never has been', 'not has been'],
    correctAnswer: 'has never been'
  },
  {
    id: 'g78_modals_1',
    concept: 'modals_basic',
    difficulty: 'intermediate',
    prompt: 'You __ help him (необходимо):',
    options: ['can', 'should', 'must', 'may'],
    correctAnswer: 'must'
  },
  {
    id: 'g78_modals_2',
    concept: 'modals_basic',
    difficulty: 'intermediate',
    prompt: 'You ___ swim here (опасно):',
    options: ['can', 'should', 'mustn\'t', 'may'],
    correctAnswer: 'mustn\'t'
  },
  {
    id: 'g78_zero_cond_1',
    concept: 'zero_conditional',
    difficulty: 'advanced',
    prompt: 'If you heat ice, it __:',
    options: ['melted', 'melts', 'will melt', 'melt'],
    correctAnswer: 'melts'
  },
  {
    id: 'g78_zero_cond_2',
    concept: 'zero_conditional',
    difficulty: 'advanced',
    prompt: 'If you mix blue and yellow, you ___ green:',
    options: ['get', 'gets', 'will get', 'got'],
    correctAnswer: 'get'
  },
  {
    id: 'g78_past_simple_reg',
    concept: 'past_simple_regular',
    difficulty: 'intermediate',
    prompt: 'Play → played. Past Simple:',
    options: ['play', 'played', 'plays', 'playing'],
    correctAnswer: 'played'
  },
  {
    id: 'g78_past_simple_irreg',
    concept: 'past_simple_irregular',
    difficulty: 'advanced',
    prompt: 'Go в Past Simple ("я пошёл"):',
    options: ['go', 'goes', 'went', 'gone'],
    correctAnswer: 'went'
  },
  {
    id: 'g78_present_continuous',
    concept: 'present_continuous',
    difficulty: 'intermediate',
    prompt: 'They __ playing football:',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'are'
  },
  {
    id: 'g78_comparative',
    concept: 'comparative',
    difficulty: 'intermediate',
    prompt: 'A cat is __ than a dog:',
    options: ['fast', 'faster', 'fastest', 'more fast'],
    correctAnswer: 'faster'
  },
];

// Grade 9-11 Question Bank
const GRADE9_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g9_reported_1',
    concept: 'reported_speech',
    difficulty: 'advanced',
    prompt: '"He said that he was busy." Косвенная речь означает:',
    options: ['Он сказал, что занят', 'Он сказал мне', 'Он был занят', 'Он сказал'],
    correctAnswer: 'Он сказал, что занят'
  },
  {
    id: 'g9_reported_2',
    concept: 'reported_speech',
    difficulty: 'advanced',
    prompt: '"He said that I would come." правильно для:',
    options: ['He said I come', 'He said I came', 'I will come', 'I come tomorrow'],
    correctAnswer: 'I will come tomorrow'
  },
  {
    id: 'g9_passive_1',
    concept: 'passive_present',
    difficulty: 'advanced',
    prompt: '"They write a letter." в Passive:',
    options: ['A letter is written', 'They are written', 'A letter writes', 'Is written a letter'],
    correctAnswer: 'A letter is written'
  },
  {
    id: 'g9_passive_2',
    concept: 'passive_present',
    difficulty: 'advanced',
    prompt: '"The book was written by him." в Active:',
    options: ['He wrote the book', 'The book writes him', 'He was writing', 'He writes'],
    correctAnswer: 'He wrote the book'
  },
  {
    id: 'g9_past_simple_regular',
    concept: 'past_simple_regular',
    difficulty: 'intermediate',
    prompt: 'Need в Past Simple:',
    options: ['need', 'needed', 'needing', 'needs'],
    correctAnswer: 'needed'
  },
  {
    id: 'g9_past_simple_irregular',
    concept: 'past_simple_irregular',
    difficulty: 'advanced',
    prompt: 'Fly в Past Simple:',
    options: ['fly', 'flew', 'flying', 'flown'],
    correctAnswer: 'flew'
  },
  {
    id: 'g9_present_perfect',
    concept: 'present_perfect',
    difficulty: 'intermediate',
    prompt: '"I have lived here for 5 years." в Past Simple:',
    options: ['I live here', 'I lived here', 'I have been living', 'I am living'],
    correctAnswer: 'I lived here'
  },
  {
    id: 'g9_modals',
    concept: 'modals_basic',
    difficulty: 'intermediate',
    prompt: '"You must study hard." вместо must:',
    options: ['can', 'should', 'may', 'might'],
    correctAnswer: 'should'
  },
];

const GRADE12_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g12_future_perfect',
    concept: 'future_perfect',
    difficulty: 'advanced',
    prompt: 'Выберите правильную форму: "By next semester, she ___ her master\'s thesis."',
    options: ['will have completed', 'has completed', 'will complete', 'will be completing'],
    correctAnswer: 'will have completed'
  },
  {
    id: 'g12_academic_vocab',
    concept: 'academic_vocab',
    difficulty: 'advanced',
    prompt: 'Какое слово лучше всего завершает предложение: "The professor emphasized the ___ implications of the theory."',
    options: ['practical', 'theoretical', 'occasional', 'random'],
    correctAnswer: 'theoretical'
  },
  {
    id: 'g12_passive_advanced',
    concept: 'passive_voice_advanced',
    difficulty: 'advanced',
    prompt: 'Выберите корректный вариант пассивного залога: "The data ___ before publication."',
    options: ['were thoroughly reviewed', 'have thoroughly reviewing', 'thoroughly reviewed', 'were thoroughly review'],
    correctAnswer: 'were thoroughly reviewed'
  },
  {
    id: 'g12_reported_speech',
    concept: 'reported_speech',
    difficulty: 'advanced',
    prompt: 'Преобразуйте в косвенную речь: "I am preparing for the conference," she said.',
    options: [
      'She said that she was preparing for the conference.',
      'She said she is preparing for the conference.',
      'She said that she had preparing for the conference.',
      'She said that she will prepare for the conference.'
    ],
    correctAnswer: 'She said that she was preparing for the conference.'
  },
  {
    id: 'g12_linking_words',
    concept: 'cohesive_devices',
    difficulty: 'advanced',
    prompt: 'Выберите наиболее подходящий союз: "___ the lack of funding, the research continued."',
    options: ['Despite', 'Because', 'Although', 'Unless'],
    correctAnswer: 'Despite'
  }
];

const GRADE13_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'g13_business_english',
    concept: 'business_english',
    difficulty: 'advanced',
    prompt: 'Что означает выражение "to touch base" в деловом контексте?',
    options: ['Связаться и обсудить обновления', 'Прекратить сотрудничество', 'Подписать контракт', 'Договориться о цене'],
    correctAnswer: 'Связаться и обсудить обновления'
  },
  {
    id: 'g13_negotiations',
    concept: 'negotiations_language',
    difficulty: 'advanced',
    prompt: 'Выберите наиболее подходящую фразу для начала переговоров:',
    options: [
      'Let\'s outline our objectives first.',
      'I disagree completely.',
      'We refuse your offer.',
      'This is unacceptable.'
    ],
    correctAnswer: 'Let\'s outline our objectives first.'
  },
  {
    id: 'g13_email_formal',
    concept: 'emails_formal',
    difficulty: 'advanced',
    prompt: 'Какое завершение письма наиболее уместно для формального делового письма?',
    options: ['Best regards,', 'Cheers,', 'See ya,', 'Take care,'],
    correctAnswer: 'Best regards,'
  },
  {
    id: 'g13_idioms',
    concept: 'idioms_advanced',
    difficulty: 'advanced',
    prompt: 'Что означает идиома "to read between the lines"?',
    options: ['Понять скрытый смысл', 'Прочитать вслух', 'Пропустить абзац', 'Сделать выводы из статистики'],
    correctAnswer: 'Понять скрытый смысл'
  },
  {
    id: 'g13_presentation',
    concept: 'presentation_skills',
    difficulty: 'advanced',
    prompt: 'Выберите наиболее подходящую фразу для перехода между разделами презентации:',
    options: [
      'Let\'s move on to the next point.',
      'I forgot the next slide.',
      'This isn\'t important.',
      'You already know this.'
    ],
    correctAnswer: 'Let\'s move on to the next point.'
  }
];

// Load question bank by cluster
export function loadQuestionBank(cluster: GradeCluster, lastTopic?: string): AssessmentQuestion[] {
  let bank: AssessmentQuestion[] = [];

  switch (cluster) {
    case 'grade1':
      bank = GRADE1_QUESTIONS;
      break;
    case 'grade2':
      bank = GRADE2_QUESTIONS;
      break;
    case 'grade3_4':
      bank = GRADE3_4_QUESTIONS;
      break;
    case 'grade5_6':
      bank = GRADE5_6_QUESTIONS;
      break;
    case 'grade7_8':
      bank = GRADE7_8_QUESTIONS;
      break;
    case 'grade9':
      bank = GRADE9_QUESTIONS;
      break;
    case 'grade10_11':
      bank = GRADE9_QUESTIONS; // Use grade 9 questions for now
      break;
    case 'grade12':
      bank = GRADE12_QUESTIONS;
      break;
    case 'grade13':
      bank = GRADE13_QUESTIONS;
      break;
  }

  // Sort by difficulty: beginner → intermediate → advanced
  return bank.sort((a, b) => {
    const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
}

// Check answer (simplified)
export function checkAnswer(userAnswer: string, correctAnswer: string | number): boolean {
  const userLower = userAnswer.toLowerCase().trim();
  const correctLower = String(correctAnswer).toLowerCase().trim();
  
  console.log(`   🔍 Checking answer: "${userAnswer}" vs "${correctAnswer}"`);
  
  // Check for "I don't know" type responses - always wrong
  const negativeResponses = ['не знаю', 'не помню', 'не могу', 'не понимаю', 'не знаю', 'не могу ответить', 'не в курсе'];
  if (negativeResponses.some(neg => userLower.includes(neg))) {
    console.log(`   ❌ Negative response detected`);
    return false;
  }
  
  // Check exact match
  if (userLower === correctLower) {
    console.log(`   ✅ Exact match`);
    return true;
  }
  
  // For single/short answers, be lenient
  if (userLower.length < 50) {
    // Check if user's answer contains key words
    const correctWords = correctLower.split(/\s+/);
    
    // If correct answer has multiple words, check if all are present
    if (correctWords.length > 1) {
      const result = correctWords.every(word => userLower.includes(word));
      console.log(`   ${result ? '✅' : '❌'} Multi-word match (need all words)`);
      return result;
    }
    
    // For single word, check exact or partial match
    const result = userLower.includes(correctLower) || correctLower.includes(userLower);
    console.log(`   ${result ? '✅' : '❌'} Single word match`);
    return result;
  }
  
  // For longer answers (like essays), check if key concepts are present
  const correctWords = correctLower.split(/\s+/).filter(w => w.length > 3);
  const matchedWords = correctWords.filter(word => userLower.includes(word));
  
  // Need at least 50% of key words to match
  const result = matchedWords.length >= correctWords.length * 0.5;
  console.log(`   ${result ? '✅' : '❌'} Essay match (${matchedWords.length}/${correctWords.length} keywords)`);
  return result;
}

// Compute mastery level
function computeMastery(correct: number, total: number): number {
  const ratio = correct / total;
  if (ratio === 1.0) return 1.0;
  if (ratio >= 0.7) return 0.7;
  if (ratio >= 0.4) return 0.4;
  return 0.2;
}

// Run adaptive assessment
export async function runAdaptiveAssessment(
  classGrade: string,
  lastTopic: string,
  onQuestion: (question: AssessmentQuestion, questionNum: number, totalQuestions: number) => Promise<string>,
  onProgress?: (progress: number) => void
): Promise<AssessmentResult> {
  const cluster = mapGradeToCluster(classGrade);
  console.log('🎯 Adaptive Assessment Debug:');
  console.log('  Input grade:', classGrade);
  console.log('  Detected cluster:', cluster);
  console.log('  Last topic:', lastTopic);

  const questionBank = loadQuestionBank(cluster, lastTopic);
  console.log('  Question bank size:', questionBank.length);
  console.log('  First 3 questions:', questionBank.slice(0, 3).map(q => q.prompt));

  const conceptScores: Map<string, { correct: number; total: number }> = new Map();
  let streakOk = 0;
  let streakBad = 0;
  let currentDifficulty = 'beginner';
  const usedQuestionIndices: Set<number> = new Set();
  const results: Array<[string, boolean]> = [];

  // Initialize concept scores
  questionBank.forEach(q => {
    if (!conceptScores.has(q.concept)) {
      conceptScores.set(q.concept, { correct: 0, total: 0 });
    }
  });

  // Adaptive loop - ask 6-8 questions
  const maxQuestions = 8;
  let questionCount = 0;

  while (questionCount < maxQuestions) {
    // Find next unused question with current difficulty or fallback to any unused
    let question: AssessmentQuestion | null = null;
    
    // First try to find question with current difficulty
    for (let i = 0; i < questionBank.length; i++) {
      if (!usedQuestionIndices.has(i) && questionBank[i].difficulty === currentDifficulty) {
        question = questionBank[i];
        usedQuestionIndices.add(i);
        break;
      }
    }
    
    // If no question with current difficulty, take any unused
    if (!question) {
      for (let i = 0; i < questionBank.length; i++) {
        if (!usedQuestionIndices.has(i)) {
          question = questionBank[i];
          usedQuestionIndices.add(i);
          break;
        }
      }
    }
    
    // If no questions left, stop
    if (!question) {
      console.log(`❌ No more questions available. Used indices:`, Array.from(usedQuestionIndices));
      console.log(`❌ Current difficulty:`, currentDifficulty);
      console.log(`❌ Question bank size:`, questionBank.length);
      break;
    }

    // Get user answer
    console.log(`❓ Question ${questionCount + 1}:`, question.prompt);
    console.log(`🎯 Expected key:`, question.key);

    const userAnswer = await onQuestion(question, questionCount + 1, maxQuestions);
    const isCorrect = checkAnswer(userAnswer, question.key || question.correctAnswer || '');

    console.log(`👤 User answer:`, userAnswer);
    console.log(`✅ Is correct:`, isCorrect);
    
    // Update scores
    results.push([question.concept, isCorrect]);
    const scores = conceptScores.get(question.concept)!;
    scores.total++;
    if (isCorrect) scores.correct++;

    // Track streaks for adaptive difficulty
    streakOk = isCorrect ? streakOk + 1 : 0;
    streakBad = isCorrect ? 0 : streakBad + 1;

    // Adaptive difficulty adjustment (but keep beginner level for lower grades)
    const allowAdvance = cluster !== 'grade1' && cluster !== 'grade2';
    
    if (streakOk >= 2 && currentDifficulty !== 'advanced' && allowAdvance) {
      currentDifficulty = currentDifficulty === 'beginner' ? 'intermediate' : 'advanced';
      streakOk = 0;
    }
    if (streakBad >= 2 && currentDifficulty !== 'beginner') {
      currentDifficulty = currentDifficulty === 'advanced' ? 'intermediate' : 'beginner';
      streakBad = 0;
    }

    questionCount++;
    if (onProgress) onProgress((questionCount / maxQuestions) * 100);

    // Early stop if we have enough data and tested at least 4 questions
    // Check if we have data for at least 3 different concepts or completed minimum questions
    const uniqueConcepts = new Set(results.map(([concept, _]) => concept)).size;
    if (questionCount >= 4 && uniqueConcepts >= 3) {
      console.log(`✅ Enough data collected: ${questionCount} questions, ${uniqueConcepts} concepts`);
      break;
    }
  }

  // Compute micro-profile
  const profile: MicroProfile[] = Array.from(conceptScores.entries()).map(([concept, scores]) => ({
    concept,
    p: computeMastery(scores.correct, scores.total),
  }));

  // Adaptive cluster adjustment based on performance
  let finalCluster = cluster;
  const totalQuestions = results.length;
  const correctAnswers = results.filter(([_, isCorrect]) => isCorrect).length;
  const successRate = correctAnswers / totalQuestions;

  console.log('📊 Performance metrics:');
  console.log('  Total questions:', totalQuestions);
  console.log('  Correct answers:', correctAnswers);
  console.log('  Success rate:', (successRate * 100).toFixed(0) + '%');
  console.log('  Initial cluster:', cluster);

  // Adjust cluster based on success rate and current cluster
  if (successRate >= 0.8) {
    // High success rate - consider moving up one level
    if (cluster === 'grade1') finalCluster = 'grade2';
    else if (cluster === 'grade2') finalCluster = 'grade3_4';
    else if (cluster === 'grade3_4') finalCluster = 'grade5_6';
    else if (cluster === 'grade5_6') finalCluster = 'grade7_8';
    else if (cluster === 'grade7_8') finalCluster = 'grade9';
    else if (cluster === 'grade9') finalCluster = 'grade10_11';
    else if (cluster === 'grade10_11') finalCluster = 'grade12';
    else if (cluster === 'grade12') finalCluster = 'grade13';
    console.log('  🎉 Excellent performance! Moving up to:', finalCluster);
  } else if (successRate <= 0.1) {
    // Very low success rate (<=10%) - move down significantly
    if (cluster === 'grade13') finalCluster = 'grade7_8';
    else if (cluster === 'grade12') finalCluster = 'grade5_6';
    else if (cluster === 'grade10_11') finalCluster = 'grade3_4';
    else if (cluster === 'grade9') finalCluster = 'grade3_4';
    else if (cluster === 'grade7_8') finalCluster = 'grade2';
    else if (cluster === 'grade5_6') finalCluster = 'grade1';
    else if (cluster === 'grade3_4') finalCluster = 'grade1';
    else if (cluster === 'grade2') finalCluster = 'grade1';
    // grade1 stays grade1
    console.log('  📉 Very poor performance! Moving down significantly to:', finalCluster);
  } else if (successRate <= 0.3) {
    // Low success rate (11-30%) - move down moderately
    if (cluster === 'grade13') finalCluster = 'grade10_11';
    else if (cluster === 'grade12') finalCluster = 'grade7_8';
    else if (cluster === 'grade10_11') finalCluster = 'grade7_8';
    else if (cluster === 'grade9') finalCluster = 'grade5_6';
    else if (cluster === 'grade7_8') finalCluster = 'grade3_4';
    else if (cluster === 'grade5_6') finalCluster = 'grade2';
    else if (cluster === 'grade3_4') finalCluster = 'grade1';
    else if (cluster === 'grade2') finalCluster = 'grade1';
    // grade1 stays grade1
    console.log('  📉 Poor performance! Moving down to:', finalCluster);
  } else if (successRate <= 0.5) {
    // Below average (31-50%) - move down slightly
    if (cluster === 'grade13') finalCluster = 'grade12';
    else if (cluster === 'grade12') finalCluster = 'grade10_11';
    else if (cluster === 'grade10_11') finalCluster = 'grade9';
    else if (cluster === 'grade9') finalCluster = 'grade7_8';
    else if (cluster === 'grade7_8') finalCluster = 'grade5_6';
    else if (cluster === 'grade5_6') finalCluster = 'grade3_4';
    else if (cluster === 'grade3_4') finalCluster = 'grade2';
    else if (cluster === 'grade2') finalCluster = 'grade1';
    // grade1 stays grade1
    console.log('  📉 Below average. Moving down slightly to:', finalCluster);
  } else {
    console.log('  ✅ Performance matches current cluster:', finalCluster);
  }

  // Filter profile to only include concepts from the final cluster
  const finalClusterConcepts = loadQuestionBank(finalCluster).map(q => q.concept);
  const filteredProfile = profile.filter(p => finalClusterConcepts.includes(p.concept));
  
  console.log('🔄 Profile adjustment:');
  console.log('  Original profile concepts:', profile.map(p => p.concept));
  console.log('  Final cluster concepts:', finalClusterConcepts);
  console.log('  Filtered profile concepts:', filteredProfile.map(p => p.concept));
  console.log('  Success rate:', (successRate * 100).toFixed(0) + '%');

  // If filtered profile is empty, create a default profile for the cluster
  // But use the actual success rate to determine mastery level!
  let defaultMastery: number;
  if (successRate >= 0.8) defaultMastery = 1.0;    // Excellent (100%)
  else if (successRate >= 0.7) defaultMastery = 0.7; // Good (70%)
  else if (successRate >= 0.4) defaultMastery = 0.4; // Average (40%)
  else defaultMastery = 0.2;                          // Poor (20%)
  
  console.log(`  Creating default profile with mastery: ${(defaultMastery * 100).toFixed(0)}%`);
  
  const finalProfile = filteredProfile.length > 0 ? filteredProfile : 
    finalClusterConcepts.slice(0, 5).map(concept => ({ concept, p: defaultMastery }));

  // Build 2-week plan with adjusted cluster and filtered profile
  const plan2w = buildTwoWeekPlan(finalProfile, finalCluster);

  return {
    classGrade,
    lastTopic,
    cluster: finalCluster,
    profile: finalProfile,
    plan2w,
    timestamp: new Date(),
  };
}

// Build 2-week plan
export function buildTwoWeekPlan(profile: MicroProfile[], cluster: GradeCluster): SessionPlan[] {
  const weak = profile.filter(c => c.p < 0.7).map(c => c.concept);
  const review = profile.filter(c => c.p >= 0.7).map(c => c.concept);
  const profiled = profile.map(p => p.concept);

  // Get new concepts from the cluster
  const allConceptIds = loadQuestionBank(cluster).map(q => q.concept);
  const newConcepts = allConceptIds.filter(id => !profiled.includes(id)).slice(0, 4);

  const sessions: SessionPlan[] = [];

  // 4-6 sessions
  for (let i = 1; i <= 4; i++) {
    const targets: string[] = [];

    // Distribute targets
    if (i === 1) {
      targets.push(...weak.slice(0, 2));
    } else if (i === 2) {
      targets.push(...weak.slice(2, 4));
      targets.push(...newConcepts.slice(0, 1));
    } else if (i === 3) {
      targets.push(...review.slice(0, 1));
      targets.push(...newConcepts.slice(1, 2));
    } else {
      targets.push(...newConcepts.slice(2, 4));
    }

    sessions.push({
      session: i,
      targets: targets.filter(Boolean),
      mix: {
        review: 0.25,
        weak: 0.5,
        new: 0.25,
      },
    });
  }

  return sessions;
}

