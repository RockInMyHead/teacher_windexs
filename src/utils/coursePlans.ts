/**
 * Планы курсов для разных классов
 * Структурированные данные для генерации персонализированных программ обучения
 */

import { AssessmentResult } from './adaptiveAssessment';

export interface LessonModule {
  number: number;
  title: string;
  type: 'theory' | 'practice' | 'test' | 'conspectus';
  content: string;
  estimatedTime?: number; // в минутах
}

export interface LessonPlan {
  number: number;
  title: string;
  topic: string;
  aspects: string;
  modules?: LessonModule[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

export interface CoursePlan {
  grade: number;
  title: string;
  description: string;
  lessons: LessonPlan[];
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseTestQuestions {
  [courseId: number]: {
    [grade: number]: TestQuestion[];
  };
}

export const COURSE_PLANS: CoursePlan[] = [
  {
    grade: 1,
    title: "Английский язык для 1 класса",
    description: "Базовый курс английского языка для первоклассников с акцентом на развитие основных навыков общения, знакомство с алфавитом и простыми лексическими темами.",
    lessons: [
      {
        number: 1,
        title: "Hello, English!",
        topic: "Знакомство с предметом",
        aspects: "Лексика: hello, hi, bye, English, teacher, pupil. Фразы: Hello! / Hi! / Bye!; My name is __. Алфавит: знакомство со звуком [h], [b]. Навыки: приветствие, представление себя по образцу. Игра на запоминание имен.",
        modules: [], // Будет заполнено динамически на основе уровня ученика
        difficulty: 'beginner'
      },
      {
        number: 2,
        title: "Say hello",
        topic: "Приветствия и вежливость",
        aspects: "Лексика: good morning, good afternoon, good evening, good night. Фразы: How are you? – I'm fine, thank you. Повтор: My name is __. Навыки: диалог-приветствие в паре; отработка интонации. Мини-ролевая игра «встреча друзей»."
      },
      {
        number: 3,
        title: "What's your name?",
        topic: "Представление себя и друга",
        aspects: "Лексика: friend, boy, girl. Модели: What's your name? – My name is __. This is __. Навыки: простейший диалог «знакомство», представление одноклассника: This is Masha. Отработка произношения звуков [w], [n], [m]."
      },
      {
        number: 4,
        title: "In the classroom",
        topic: "Предметы в классе",
        aspects: "Лексика: book, pen, pencil, bag, desk, chair, board. Фразы: This is a pen. It's a book. Команды учителя: Stand up / Sit down / Listen / Look. Навыки: понимание инструкций учителя, указание на предметы в классе."
      },
      {
        number: 5,
        title: "Colours 1",
        topic: "Цвета (часть 1)",
        aspects: "Лексика: red, blue, green, yellow. Фразы: It's red. It's blue. Комбинация с предметами: a red book, a blue pen. Навыки: раскрашивание по инструкции, игра «Покажи цвет»."
      },
      {
        number: 6,
        title: "Colours 2 + review",
        topic: "Цвета (часть 2) и повторение",
        aspects: "Лексика: black, white, brown, orange, pink. Повтор: все цвета. Фразы: What colour is it? – It's __. Навыки: работа по картинкам, раскраска с проговариванием, игра «угадай цвет»."
      },
      {
        number: 7,
        title: "Numbers 1–5",
        topic: "Числа 1–5",
        aspects: "Лексика: one, two, three, four, five. Фразы: How many? – Three pens. Навыки: счёт предметов в классе, игры «Посчитай и скажи», отработка ритма при счёте."
      },
      {
        number: 8,
        title: "Numbers 1–10",
        topic: "Числа 1–10 + How many?",
        aspects: "Лексика: six, seven, eight, nine, ten. Повтор: 1–10. Модели: How many books? – Five books. Навыки: счёт игрушек / картинок, настольные игры с кубиком."
      },
      {
        number: 9,
        title: "My toys",
        topic: "Игрушки",
        aspects: "Лексика: ball, doll, car, train, teddy bear. Фразы: This is my ball. I have a doll. Повтор чисел и цветов: one red ball. Навыки: рассказ о любимой игрушке по образцу, игра «Guess the pet» (угадать по описанию / звуку)."
      },
      {
        number: 10,
        title: "Favourite toys",
        topic: "Любимые игрушки + This is / These are",
        aspects: "Лексика: kite, robot и повт. предыдущей. Модели: This is a car. These are cars. Навыки: различение единственного/множественного на уровне образцов, работа с карточками «одна — много»."
      },
      {
        number: 11,
        title: "My family 1",
        topic: "Члены семьи (базово)",
        aspects: "Лексика: mum, dad, mother, father, sister, brother. Модели: This is my mum. This is my dad. Навыки: мини-рассказ по картинке «Моя семья», работа с семейным деревом (упрощённо)."
      },
      {
        number: 12,
        title: "My family 2",
        topic: "Семья + местоимения my, his, her",
        aspects: "Лексика: grandma, grandpa, family. Модели: My mum, his dad, her sister (на уровне узнавания). Навыки: соотнесение «кто чей» по картинкам, устные мини-диалоги «Who is this? – This is my…»."
      },
      {
        number: 13,
        title: "My body 1",
        topic: "Части тела (основные)",
        aspects: "Лексика: head, nose, mouth, eyes, ears. Фразы: This is my head. Навыки: игра «Touch your…», песенка с движениями. Закрепление команд: stand up, sit down, turn around."
      },
      {
        number: 14,
        title: "My body 2",
        topic: "Части тела (руки, ноги) + песенка",
        aspects: "Лексика: arm, hand, leg, foot, feet. Повтор: head, shoulders, knees, toes (через песню). Навыки: выполнение команд «Touch your…», физкультминутка английской песенкой."
      },
      {
        number: 15,
        title: "Pets",
        topic: "Домашние животные",
        aspects: "Лексика: cat, dog, fish, bird, hamster. Фразы: It's a cat. I have a dog. Навыки: классификация животных, игра «Guess the pet» (угадать по описанию / звуку)."
      },
      {
        number: 16,
        title: "Wild animals",
        topic: "Дикие животные",
        aspects: "Лексика: lion, tiger, elephant, monkey, bear. Прилагательные: big / small. Фразы: It's a big elephant. Навыки: сортировка животных (big/small), работа с картинками «зоопарк»."
      },
      {
        number: 17,
        title: "Colours & animals",
        topic: "Описание животных",
        aspects: "Повтор: цвета + животные. Модели: It's a brown bear. It's a white cat. Навыки: устное описание животных по картинкам, игра «найди животное по описанию»."
      },
      {
        number: 18,
        title: "Clothes 1",
        topic: "Одежда (часть 1)",
        aspects: "Лексика: T-shirt, dress, skirt, trousers, shoes. Фразы: This is a dress. These are shoes. Навыки: подбор одежды к картинке персонажа, игра «одень куклу»."
      },
      {
        number: 19,
        title: "Clothes 2",
        topic: "Одежда (часть 2) + I'm wearing",
        aspects: "Лексика: cap, jacket, coat, socks. Модели: I'm wearing a red cap. Навыки: описание своей одежды по образцу, игра «Кто как одет?»."
      },
      {
        number: 20,
        title: "Food 1: fruit",
        topic: "Еда: фрукты",
        aspects: "Лексика: apple, banana, orange, pear, grapes. Фразы: I like apples. Навыки: различение I like / (на узнавание) I don't like, игра «favourite fruit»."
      },
      {
        number: 21,
        title: "Food 2: snacks",
        topic: "Еда: базовые продукты",
        aspects: "Лексика: bread, milk, juice, water, sweets, ice cream. Модели: I like juice. I don't like milk (на уровне подстановки). Навыки: мини-опрос класса «Who likes…?»"
      },
      {
        number: 22,
        title: "Weather",
        topic: "Погода",
        aspects: "Лексика: sunny, rainy, windy, cloudy, cold, hot. Фразы: It's sunny. It's cold. Навыки: описание картинки с погодой, игра «Weather today» (что за погода сегодня)."
      },
      {
        number: 23,
        title: "Seasons",
        topic: "Времена года",
        aspects: "Лексика: spring, summer, autumn, winter. Связка с одеждой и погодой: It's winter. It's cold. Навыки: распределение картинок по сезонам, устные мини-описания «My favourite season is…» (на подстановке)."
      },
      {
        number: 24,
        title: "All about me",
        topic: "Повторение: «Я»",
        aspects: "Повтор лексики: имя, возраст (цифры), части тела, любимые цвета. Структуры: My name is __. I am seven. I like __. Навыки: собрать «портрет» ученика (мини-презентация о себе)."
      },
      {
        number: 25,
        title: "My family & home",
        topic: "Повторение: семья и дом",
        aspects: "Повтор лексики семьи + комнат (room, kitchen, bathroom – на узнавание). Модели: This is my family. This is my room. Навыки: рассказ по картинке «мой дом и семья», простые диалоги."
      },
      {
        number: 26,
        title: "Toys, colours, numbers",
        topic: "Большое повторение",
        aspects: "Повтор: игрушки, цвета, числа 1–10. Модели: How many toys? What colour is the car? Навыки: игровые задания на скорость/команду, мини-квест в классе."
      },
      {
        number: 27,
        title: "Animals & body",
        topic: "Повторение животных и частей тела",
        aspects: "Повтор: животные, части тела, big/small. Навыки: игры типа «Simon says» на части тела, описания животных «It's a big brown bear»."
      },
      {
        number: 28,
        title: "I can…",
        topic: "Способности: can / can't",
        aspects: "Лексика: jump, run, swim, fly, climb. Модели: I can jump. I can't fly. Навыки: физические активности с проговариванием (TPR), игра «Can you…?» в парах."
      },
      {
        number: 29,
        title: "I have got…",
        topic: "Наличие: have got (на уровне клише)",
        aspects: "Модели: I have got a cat. I haven't got a dog (на узнавание). Повтор: pets, toys. Навыки: рассказ «что у меня есть» (игрушки, животные) по шаблону."
      },
      {
        number: 30,
        title: "My school day",
        topic: "Простой распорядок дня",
        aspects: "Лексика: get up, go to school, play, sleep (на узнавание). Модели: I go to school. I play. Навыки: составление очень простого «дневного цикла» из картинок, устный рассказ по картинкам."
      },
      {
        number: 31,
        title: "My birthday",
        topic: "Праздники: день рождения",
        aspects: "Лексика: birthday, cake, balloon, present. Фразы: Happy birthday! This is a present. Навыки: разыгрывание сценки «день рождения», повтор чисел при свечах на торте."
      },
      {
        number: 32,
        title: "My English picture book",
        topic: "Итоговый: презентация знаний",
        aspects: "Повтор всех ключевых тем года: я, семья, игрушки, животные, цвета, еда, одежда. Активность: каждый ребёнок создаёт/показывает «книжку-картинку» и говорит 3–5 простых предложений о себе и своём мире на английском."
      }
    ]
  },
  {
    grade: 2,
    title: "Английский язык, 2 класс",
    description: "Продвинутый курс английского языка для второклассников с расширением лексики, введением грамматических конструкций и развитием навыков чтения и письма.",
    lessons: [
      {
        number: 1,
        title: "Back to English",
        topic: "Повтор 1 класса",
        aspects: "Повтор: приветствия, представление, цвета, числа 1–10, семья, игрушки. Фразы: Hello! My name is __. I’m seven/eight. Навыки: «реактивация» словаря, диагностические мини-диалоги в парах."
      },
      {
        number: 2,
        title: "My new class",
        topic: "Школьный класс, одноклассники",
        aspects: "Лексика: class, pupil, teacher, boy, girl, friend. Фразы: This is my friend. He/She is my friend. Повтор: приветствия. Навыки: короткое устное представление одноклассника."
      },
      {
        number: 3,
        title: "School things 2.0",
        topic: "Школьные предметы (расширение)",
        aspects: "Лексика: ruler, rubber, pencil case, notebook, markers. Структуры: I have a ruler. I have a red ruler. Навыки: говорение по картинкам, игра «Что у меня в пенале?»."
      },
      {
        number: 4,
        title: "School subjects",
        topic: "Учебные предметы",
        aspects: "Лексика: Maths, Russian, English, PE, Art, Music. Структуры: I have English on Monday. I like Art. Навыки: составление простого расписания по дням недели (на шаблонах)."
      },
      {
        number: 5,
        title: "Days of the week",
        topic: "Дни недели",
        aspects: "Лексика: Monday–Sunday. Фразы: Today is Monday. On Tuesday I have… Навыки: песенка/рифмовка про дни недели, работа с расписанием."
      },
      {
        number: 6,
        title: "Numbers 1–20",
        topic: "Числа до 20",
        aspects: "Лексика: eleven–twenty. Фразы: How old are you? – I am eight / nine. Навыки: устный счёт, игры с карточками и кубиком, счёт предметов."
      },
      {
        number: 7,
        title: "My timetable",
        topic: "Моё расписание",
        aspects: "Интеграция: дни недели + предметы + числа. Структуры: I have PE on Friday. Two English lessons. Навыки: устное описание упрощённого расписания по образцу."
      },
      {
        number: 8,
        title: "My family again",
        topic: "Семья (расширение и грамматика)",
        aspects: "Повтор: mum, dad, sister, brother, grandma, grandpa. Добавить: parents, family tree. Структуры: This is my mother. Her name is __. His name is __. Навыки: устный рассказ по семейному дереву (по шаблону)."
      },
      {
        number: 9,
        title: "Have got 1",
        topic: "Конструкция have got (я/мы)",
        aspects: "Структуры: I have got a brother. I haven’t got a sister (на подстановке). We have got a big family. Навыки: диалоги «расскажи, кто у тебя есть», работа в парах с таблицей."
      },
      {
        number: 10,
        title: "Have got 2",
        topic: "Have got (he/she)",
        aspects: "Структуры: He has got a cat. She hasn’t got a dog (на уровне узнавания и подстановки). Повтор: pets. Навыки: описание картинок «кто что имеет», игра «угадай семью»."
      },
      {
        number: 11,
        title: "My house",
        topic: "Дом и комнаты",
        aspects: "Лексика: house, flat, room, living room, bedroom, kitchen, bathroom. Структуры: This is my room. There is a bed. Навыки: соотнесение слов с планом дома, устные мини-описания."
      },
      {
        number: 12,
        title: "There is / There are 1",
        topic: "Есть/имеется (единственное/множественное)",
        aspects: "Структуры: There is a bed in my room. There are two chairs. Навыки: описание комнаты по картинке, заполнение шаблона «my room»."
      },
      {
        number: 13,
        title: "There is / There are 2 + prepositions",
        topic: "Предлоги места",
        aspects: "Лексика: on, in, under, next to, behind. Структуры: The book is on the table. The cat is under the chair. Навыки: работа с картинками/игрушками (расставляем и описываем местоположение)."
      },
      {
        number: 14,
        title: "My town 1",
        topic: "Город: места",
        aspects: "Лексика: school, park, shop, cinema, playground, house. Структуры: There is a park. I go to the shop. Навыки: составление простой карты города, устное описание «В моём городе есть…»."
      },
      {
        number: 15,
        title: "My town 2",
        topic: "Как добраться / перемещение",
        aspects: "Лексика: go, walk, bus, car, bike. Структуры: I go to school by bus. I walk to the park. Навыки: устные мини-описания маршрутов по карте."
      },
      {
        number: 16,
        title: "Daily routine 1",
        topic: "Ежедневный режим (утро/вечер)",
        aspects: "Лексика: get up, have breakfast, go to school, have lunch, go home, watch TV, sleep. Структуры: I get up at seven. I go to school at eight. (Время пока на уровне «at seven».) Навыки: составление простого «дневного расписания» по картинкам."
      },
      {
        number: 17,
        title: "Present Simple 1",
        topic: "Настоящее простое (I/you)",
        aspects: "Структуры: I get up at seven. I go to school. I play football. Do you play football? – Yes, I do / No, I don't (на узнавание). Навыки: формирование простых предложений по схеме «кто? что делает? когда?»."
      },
      {
        number: 18,
        title: "Present Simple 2",
        topic: "Настоящее простое (he/she)",
        aspects: "Структуры: He gets up at seven. She goes to school. Does he play football? – Yes, he does. Навыки: различение I play / He plays, работа с таблицей-сравнением, подстановочные упражнения."
      },
      {
        number: 19,
        title: "Hobbies & sports",
        topic: "Хобби и спорт",
        aspects: "Лексика: play football, play computer games, draw, read, dance, swim. Структуры: I like dancing. He likes football. Навыки: рассказ о хобби по шаблону, мини-опрос класса «Who likes…?»."
      },
      {
        number: 20,
        title: "Can / Can’t 2.0",
        topic: "Умения (расширение)",
        aspects: "Повтор: can / can't + новые глаголы (skate, ride a bike, sing). Структуры: I can skate. I can't swim. Can you ride a bike? Навыки: игровые задания с движениями и вопросами, работа в парах."
      },
      {
        number: 21,
        title: "Clothes & seasons",
        topic: "Одежда и время года",
        aspects: "Лексика: shirt, jeans, sweater, boots, hat + seasons (повтор). Структуры: In winter I wear boots. It's cold. Навыки: подбор одежды к сезону, устные мини-описания «What do you wear in…?»."
      },
      {
        number: 22,
        title: "Weather 2.0",
        topic: "Погода (расширение)",
        aspects: "Повтор: sunny, rainy, windy, cloudy, hot, cold + new: snowy, foggy (по возможности). Структуры: What's the weather like today? – It's sunny and cold. Навыки: описание погоды по картинкам, игра «Weather forecast»."
      },
      {
        number: 23,
        title: "Food & drinks",
        topic: "Еда и напитки (расширение)",
        aspects: "Лексика: cheese, egg, meat, salad, tea, coffee, lemonade. Структуры: I like cheese. I don't like tea. Do you like…? Навыки: опрос «favourite food», составление простого «menu»."
      },
      {
        number: 24,
        title: "At the café",
        topic: "Заказ еды в кафе (упрощённо)",
        aspects: "Лексика: menu, please, thank you. Структуры: I'd like juice, please. Here you are. Thank you. Навыки: ролевая игра «кафе» с простейшими репликами."
      },
      {
        number: 25,
        title: "My best friend",
        topic: "Описание человека",
        aspects: "Лексика: tall, short, big, small, happy, funny (на уровне набора прилагательных). Структуры: He is tall and funny. She has got long hair. Навыки: устное описание друга по картинке/фото (по шаблону)."
      },
      {
        number: 26,
        title: "Animals 2.0",
        topic: "Животные и их характеристики",
        aspects: "Лексика: fast, slow, strong, weak, long, short. Структуры: The tiger is fast. The elephant is big and strong. Навыки: сравнение животных по признакам (без формальной степени сравнения, только слова)."
      },
      {
        number: 27,
        title: "Time for revision 1",
        topic: "Большое повторение (семья, дом, школа)",
        aspects: "Повтор блоков: семья, have got, дом, there is/are, школа, предметы. Навыки: комплексные задания: прочитать текст и ответить на вопросы, составить мини-текст о себе и своей комнате."
      },
      {
        number: 28,
        title: "Time for revision 2",
        topic: "Большое повторение (рутина, хобби, город)",
        aspects: "Повтор: daily routine, hobbies, town, can/can't, present simple (I/he/she). Навыки: диалог «О дне» (What do you do every day?), устное описание дня друга по картинке."
      },
      {
        number: 29,
        title: "Reading skills 1",
        topic: "Навык чтения на уровне предложений",
        aspects: "Отработка чтения коротких предложений по знакомой лексике, разделение на «кто? что делает?». Структуры: I go to school. He plays football. Навыки: чтение вслух, поиск информации в предложениях («подчеркни, кто что делает»)."
      },
      {
        number: 30,
        title: "Reading skills 2",
        topic: "Чтение короткого текста",
        aspects: "Небольшой текст 4–6 предложений (о ребёнке, семье, хобби). Задания: ответить на простые вопросы: Who is he? How old is he? What does he like? Навыки: работа с текстом, проверка понимания."
      },
      {
        number: 31,
        title: "My English project",
        topic: "Итоговый проект",
        aspects: "Задача: подготовить простую мини-презентацию/постер о себе: My name…, I am…, I have got…, I like…, My family…, My day… Навыки: интеграция всего выученного материала в краткое связное выступление."
      },
      {
        number: 32,
        title: "Fun English day",
        topic: "Игровое закрепление года",
        aspects: "Игровые станции: «Слова», «Чтение», «Диалоги», «Карты города», «Кафе». Повтор ключевых структур: Present Simple, can/can't, have got, there is/are, лексика по основным темам. Навыки: свободное использование языка в игровых ситуациях."
      }
    ]
  },
  {
    grade: 3,
    title: "Английский язык, 3 класс",
    description: "Углубленный курс английского языка для третьеклассников с введением временных форм глаголов, сравнительной степени прилагательных и развитием навыков чтения и письма.",
    lessons: [
      {
        number: 1,
        title: "Back to school",
        topic: "Повтор 1–2 класса",
        aspects: "Повтор: приветствия, семья, школа, дом, хобби. Грамматика: Present Simple (I/you/he/she), can/can't, have got, there is/are. Диагностические задания: чтение коротких предложений, мини-диалоги."
      },
      {
        number: 2,
        title: "My summer holidays",
        topic: "Летние каникулы, ввод Past Simple (лексически)",
        aspects: "Лексика: summer, holidays, sea, mountains, camp, friends. Фразы: I was at the sea. I went to the country. Глаголы на уровне клише: played, visited, swam (узнавание). Навыки: устный рассказ по картинкам «Как я провёл лето»."
      },
      {
        number: 3,
        title: "My school day",
        topic: "Повтор Present Simple (распорядок дня)",
        aspects: "Лексика: get up, have breakfast, go to school, do homework, play, sleep. Структуры: I get up at 7 o'clock. I go to school at 8. Навыки: составление устного «дня» по картинкам, линейка «утро — день — вечер»."
      },
      {
        number: 4,
        title: "Every day or sometimes?",
        topic: "Частотные наречия",
        aspects: "Лексика: always, usually, often, sometimes, never. Структуры: I usually get up at 7. I never go to school on Sunday. Навыки: интеграция наречий в Present Simple, опрос в классе «How often do you…?»."
      },
      {
        number: 5,
        title: "What time is it?",
        topic: "Время по часам",
        aspects: "Лексика: o'clock, half past, quarter past, quarter to. Структуры: It's three o'clock. It's half past four. Навыки: чтение времени по моделям, привязка ко времени подъёма/уроков."
      },
      {
        number: 6,
        title: "Months and birthdays",
        topic: "Месяцы, даты, дни рождения",
        aspects: "Лексика: months (January–December), birthday, in January, on 5th May (на уровне клише). Фразы: My birthday is in… Навыки: календарь класса, устные мини-диалоги о дне рождения."
      },
      {
        number: 7,
        title: "My hobbies 2.0",
        topic: "Хобби (расширение)",
        aspects: "Лексика: collect stickers, ride a scooter, play the guitar, draw comics, watch cartoons. Структуры: I like… I don't like… I usually… Навыки: описание своих хобби в формате мини-презентации."
      },
      {
        number: 8,
        title: "Now vs every day",
        topic: "Введение Present Continuous (1)",
        aspects: "Сопоставление: what I do every day vs what I'm doing now. Структуры: I am playing now. He is reading now. Навыки: различение по маркерам now / every day, работа с картинками «Что делает герой сейчас?»."
      },
      {
        number: 9,
        title: "What are you doing?",
        topic: "Present Continuous (2): вопросы",
        aspects: "Структуры: What are you doing? – I'm reading. What is he doing? – He's playing. Повтор форм am/is/are. Навыки: диалоги по картинкам, «живая картинка» – ученики показывают действие, остальные спрашивают."
      },
      {
        number: 10,
        title: "My home 2.0",
        topic: "Дом, мебель, расширение there is/are",
        aspects: "Лексика: sofa, armchair, table, shelf, carpet, window, door. Структуры: There is a big sofa in the living room. There are two chairs. Навыки: описание комнаты по плану/картинке, краткий письменный текст «My room»."
      },
      {
        number: 11,
        title: "Where is the cat?",
        topic: "Предлоги места (расширение)",
        aspects: "Повтор: in, on, under, next to + новые: between, in front of, behind. Структуры: The cat is between the chairs. Навыки: размещение предметов/игрушек и их описание."
      },
      {
        number: 12,
        title: "In my town",
        topic: "Город: места и ориентиры",
        aspects: "Лексика: bank, supermarket, library, hospital, bus stop, bridge. Структуры: There is a… in my town. There are two parks. Навыки: описание своего города/посёлка, работа с условной картой."
      },
      {
        number: 13,
        title: "Go straight, turn left",
        topic: "Направления движения",
        aspects: "Лексика: go straight, turn left, turn right, at the corner, across the street. Структуры: Go straight and turn left. Навыки: игра «экскурсия по городу» по карте, понимание устных инструкций."
      },
      {
        number: 14,
        title: "Let's go shopping",
        topic: "Покупки: магазин, покупки одежды",
        aspects: "Лексика: shop, size, try on, T-shirt, jeans, dress, shoes (повтор и расширение). Структуры: I'd like a T-shirt, please. What size? – Small/large. Навыки: ролевая игра «магазин одежды» по шаблону."
      },
      {
        number: 15,
        title: "How much is it?",
        topic: "Цены, числительные до 100",
        aspects: "Лексика: numbers 20–100 (десятки), pound, euro, cheap, expensive (на узнавание). Структуры: How much is it? – It's ten euros. Навыки: работа с ценниками, устные диалоги «покупатель–продавец»."
      },
      {
        number: 16,
        title: "Food and drinks 3.0",
        topic: "Еда: countable/uncountable (на интуитивном уровне)",
        aspects: "Лексика: apple, bread, rice, juice, water, sugar, cheese, salad. Структуры: I'd like some juice. I haven't got any water (на узнавание). Навыки: деление на «можно посчитать / нельзя посчитать» в виде игры."
      },
      {
        number: 17,
        title: "At the café 2.0",
        topic: "Диалог в кафе (расширенный)",
        aspects: "Структуры: Can I have… please? Here you are. Anything else? – No, thank you. Навыки: ролевая игра «кафе» с меню, отработка вежливых формул."
      },
      {
        number: 18,
        title: "The world around us",
        topic: "Природа, ландшафты",
        aspects: "Лексика: forest, lake, river, mountain, field, village, city. Структуры: There is a river near my town. Навыки: описание местности по картинкам, сопоставление «город–деревня»."
      },
      {
        number: 19,
        title: "Animals and habitats",
        topic: "Животные и места обитания",
        aspects: "Лексика: forest animals, sea animals, farm animals, desert. Структуры: A camel lives in the desert. A bear lives in the forest. Навыки: распределение животных по «домам», устные мини-описания."
      },
      {
        number: 20,
        title: "What was it like?",
        topic: "Past Simple to be (was/were)",
        aspects: "Структуры: I was happy. We were in the park. It was sunny. Навыки: рассказ о вчерашнем дне/празднике по шаблону, сравнение: Today I am… / Yesterday I was…."
      },
      {
        number: 21,
        title: "Yesterday",
        topic: "Past Simple (регулярные глаголы, базово)",
        aspects: "Лексика: played, watched, visited, walked, cooked. Структуры: I played football yesterday. Did you play football? – Yes, I did / No, I didn't (на уровне шаблона). Навыки: простые рассказы о выходных, упражнения на форму прошедшего времени."
      },
      {
        number: 22,
        title: "My weekend",
        topic: "Практика Past Simple",
        aspects: "Интеграция: was/were + регулярные глаголы. Структуры: On Saturday I played… It was sunny. Мы: We went to the park (went как частный случай). Навыки: устный и короткий письменный рассказ «My weekend»."
      },
      {
        number: 23,
        title: "Bigger, faster, stronger",
        topic: "Сравнительная степень прилагательных (comparatives)",
        aspects: "Лексика: big, small, fast, slow, tall, short. Структуры: A tiger is faster than a cat. My bag is bigger than your bag. Навыки: сравнение предметов/животных по картинкам, работа с таблицей «A vs B»."
      },
      {
        number: 24,
        title: "The biggest, the best",
        topic: "Превосходная степень (superlatives)",
        aspects: "Структуры: the biggest, the smallest, the fastest, the tallest. Фразы: The elephant is the biggest animal. Навыки: выбор «самого-самого» из набора картинок, мини-проекты «My best friend is the funniest»."
      },
      {
        number: 25,
        title: "British culture: London",
        topic: "Страна изучаемого языка (Великобритания, Лондон)",
        aspects: "Лексика: London, capital, Big Ben, the Thames, bus, taxi. Структуры: London is the capital of Great Britain. There are many buses. Навыки: страноведческий текст + вопросы, простое описание города."
      },
      {
        number: 26,
        title: "British culture: school & traditions",
        topic: "Школа и традиции в Британии",
        aspects: "Лексика: uniform, lunch, break, Christmas, Halloween (узнавание), present, decorations. Структуры: British children wear a uniform. Навыки: сравнение своей школы и британской, обсуждение праздников."
      },
      {
        number: 27,
        title: "Reading skills 3.0",
        topic: "Чтение адаптированного текста",
        aspects: "Текст 6–8 предложений (про ребёнка, семью, школу, хобби, выходные). Навыки: чтение вслух, поиск информации, ответы на вопросы Who/What/Where/When, заполнение простой таблицы по тексту."
      },
      {
        number: 28,
        title: "Writing skills 3.0",
        topic: "Письмо: короткое письмо/открытка",
        aspects: "Формат: Dear…, Love,… Структуры: My name is… I live in… I like… Yesterday I… Навыки: написание короткого письма другу / открытки из поездки по образцу."
      },
      {
        number: 29,
        title: "My favourite place",
        topic: "Проект: любимое место",
        aspects: "Интеграция лексики «город, природа, дом, погода». Структуры: My favourite place is… There is/are… It is… I like it because… Навыки: подготовка постера/слайда и устное выступление."
      },
      {
        number: 30,
        title: "Big revision 1",
        topic: "Обобщение грамматики",
        aspects: "Повтор: Present Simple (все лица), Present Continuous, Past Simple (was/were, регулярные глаголы), can/can't, there is/are, comparatives/superlatives. Навыки: комплексные устные и письменные задания."
      },
      {
        number: 31,
        title: "Big revision 2",
        topic: "Обобщение лексики и навыков",
        aspects: "Повтор ключевых тематических блоков: семья, дом, город, еда, хобби, путешествия, животные, праздники. Навыки: чтение текста + письмо мини-ответа, диалоги по карточкам."
      },
      {
        number: 32,
        title: "My English year",
        topic: "Итоговый урок-проект",
        aspects: "Презентации/мини-проекты детей: «My English year» / «All about me» с включением: Present/Past, хобби, семья, школа, любимое место. Игровые активности по темам года, подведение итогов."
      }
    ]
  },
  {
    grade: 4,
    title: "Английский язык, 4 класс",
    description: "Расширенный курс английского языка для четвероклассников с углубленным изучением грамматических конструкций, развитием навыков чтения и письма, а также страноведческим материалом.",
    lessons: [
      {
        number: 1,
        title: "Back to English 4",
        topic: "Повтор 2–3 класса",
        aspects: "Диагностика: приветствия, семья, дом, город, хобби. Грамматика на повтор: Present Simple (I/you/he/she), Present Continuous (на уровне «сейчас»), Past Simple was/were, can/can't, there is/are, comparatives. Навык: короткий устный рассказ «About me» и мини-тест по лексике."
      },
      {
        number: 2,
        title: "My profile",
        topic: "Расширенное представление о себе",
        aspects: "Лексика: surname, age, grade, hobbies, favourite subject, favourite food. Структуры: I am in the 4th grade. My favourite subject is… I am good at… Навыки: устное и письменное «анкета-резюме» ученика, мини-презентация «My profile»."
      },
      {
        number: 3,
        title: "School life",
        topic: "Школьная жизнь, предметы, расписание",
        aspects: "Повтор и расширение school subjects: Science, IT, History, Geography. Структуры: I have Math three times a week. I usually have English on Monday and Wednesday. Навыки: описание реального расписания, работа с таблицей «timetable»."
      },
      {
        number: 4,
        title: "Classroom rules",
        topic: "Правила в классе (must / mustn't)",
        aspects: "Лексика: be quiet, listen, run, shout, use phone. Структуры: You must listen to the teacher. You mustn't run in the classroom. Навыки: формулировка и обсуждение правил класса, постер «Our classroom rules»."
      },
      {
        number: 5,
        title: "Daily routine 2.0",
        topic: "Ежедневный распорядок, время",
        aspects: "Повтор лексики: get up, get dressed, have breakfast, do homework + новые маркеры времени: in the morning/afternoon/evening, at night. Структуры: I get up at half past seven. I usually do my homework in the evening. Навыки: линейка «My day» (устно + короткий письменный текст)."
      },
      {
        number: 6,
        title: "Present Simple vs Present Continuous",
        topic: "Контраст «обычно» vs «сейчас»",
        aspects: "Структуры: I go to school every day. I am going to school now. Маркеры: every day, usually, often vs now, at the moment. Навыки: классификация предложений по времени, устные упражнения по картинкам «Что делает герой обычно/сейчас»."
      },
      {
        number: 7,
        title: "Hobbies & free time 3.0",
        topic: "Досуг, интересы, like/love/hate + -ing",
        aspects: "Лексика: play chess, go swimming, go skating, read comics, watch videos. Структуры: I love playing football. I like reading. I hate getting up early. Навыки: рассказ о себе, мини-опрос «What do you like doing?»."
      },
      {
        number: 8,
        title: "Gadgets & media",
        topic: "Гаджеты и медиа",
        aspects: "Лексика: phone, tablet, computer, headphones, games, music, internet, smartphone. Структуры: I use my phone to… I watch videos on… Навыки: обсуждение правил безопасного использования, мини-диалог о любимых медиа-активностях."
      },
      {
        number: 9,
        title: "My home revisited",
        topic: "Дом, мебель, there is/there are (углубление)",
        aspects: "Повтор: rooms, furniture + усиление there is/are, some/any на уровне: There is some milk in the fridge. Структуры: There is a big sofa in the living room. There aren't any chairs in the kitchen. Навыки: устное и письменное описание комнаты/дома."
      },
      {
        number: 10,
        title: "In my town 2.0",
        topic: "Город, транспорт, направления",
        aspects: "Повтор и расширение лексики: bus station, museum, theatre, stadium, traffic lights, roundabout. Структуры: There is a stadium near my house. I go to school by bus. Навыки: работа с картой, описание маршрута, диалоги с использованием go straight, turn left/right."
      },
      {
        number: 11,
        title: "Weather & seasons 3.0",
        topic: "Погода и времена года (углубление)",
        aspects: "Лексика: stormy, windy, foggy, icy, warm, cool. Структуры: In winter it is cold and snowy. It's raining now (Present Continuous для погоды). Навыки: прогноз погоды по картинам/иконкам, устные мини-сообщения «Weather report»."
      },
      {
        number: 12,
        title: "Travelling",
        topic: "Путешествия и транспорт",
        aspects: "Лексика: travel, trip, journey, plane, train, ship, suitcase, ticket. Структуры: I usually travel by train. We go to the sea in summer. Навыки: рассказ о типичном путешествии, диалог «At the station» (очень упрощённый)."
      },
      {
        number: 13,
        title: "Plans: going to",
        topic: "Будущее время (be going to)",
        aspects: "Структуры: I am going to visit my grandma. We are going to travel in summer. What are you going to do at the weekend? Навыки: устный и письменный план выходных/каникул."
      },
      {
        number: 14,
        title: "Countries & nationalities",
        topic: "Страны и национальности",
        aspects: "Лексика: Russia – Russian, Britain – British, America – American, France – French, Germany – German, China – Chinese. Структуры: I am from Russia. I am Russian. Навыки: карта мира, сопоставление страна–национальность+флаг, мини-диалоги."
      },
      {
        number: 15,
        title: "The UK and London 2.0",
        topic: "Страноведение: Великобритания и Лондон",
        aspects: "Повтор и расширение: United Kingdom, England, Scotland, Wales, Northern Ireland, London, capital, the Queen/King, sights: Big Ben, Tower Bridge, London Eye. Структуры: London is the capital of the UK. There are many famous places in London. Навыки: работа с страноведческим текстом, ответы на вопросы."
      },
      {
        number: 16,
        title: "Food & drinks 4.0",
        topic: "Еда, здоровое питание, some/any",
        aspects: "Лексика: vegetables, fruit, cereal, yoghurt, sugar, salt, healthy, unhealthy. Структуры: I usually have cereal for breakfast. I eat a lot of fruit. I don't eat much sugar. Навыки: сортировка продуктов на healthy/unhealthy, устный рассказ «My healthy breakfast»."
      },
      {
        number: 17,
        title: "At the supermarket",
        topic: "Покупки в супермаркете",
        aspects: "Лексика: basket, trolley, cashier, bill, price, kilo, bottle, packet. Структуры: I'd like a kilo of apples. Can I have a bottle of water, please? Навыки: ролевая игра «supermarket», чтение и заполнение простого «shopping list»."
      },
      {
        number: 18,
        title: "Past Simple: was/were",
        topic: "Прошедшее время глагола to be",
        aspects: "Структуры: I was at home yesterday. We were at the park. Was it cold? – Yes, it was. Навыки: контраст am/is/are vs was/were, устные рассказы «Where were you yesterday?», короткий текст «Yesterday»."
      },
      {
        number: 19,
        title: "Past Simple: regular verbs",
        topic: "Прошедшее время: правильные глаголы",
        aspects: "Лексика: play – played, watch – watched, visit – visited, walk – walked, travel – travelled. Маркеры: yesterday, last week, last year, two days ago. Структуры: I played football yesterday. Did you watch TV yesterday? Навыки: преобразование предложений из Present в Past, устные рассказы о прошедших выходных."
      },
      {
        number: 20,
        title: "Past Simple: irregular verbs 1",
        topic: "Неправильные глаголы (базовый набор)",
        aspects: "Лексика: go – went, have – had, see – saw, do – did, come – came, eat – ate. Структуры: We went to the park. I had ice cream. Did you go to the cinema? Навыки: карточки «present–past», устные истории по картинкам."
      },
      {
        number: 21,
        title: "Past Simple: stories",
        topic: "Истории в прошедшем времени",
        aspects: "Интеграция: was/were + regular/irregular verbs. Структуры: First…, then…, after that…, finally…. Навыки: рассказывание короткой истории (storytelling) по серии картинок, простая письменная история из 4–6 предложений."
      },
      {
        number: 22,
        title: "Comparatives & superlatives 2.0",
        topic: "Степени сравнения прилагательных (углубление)",
        aspects: "Расширение: big – bigger – the biggest, small – smaller, fast – faster, funny – funnier, interesting – more interesting – the most interesting. Структуры: English is more interesting than Math. The tiger is the fastest animal. Навыки: сравнение предметов/людей/занятий, упражнения по таблицам."
      },
      {
        number: 23,
        title: "My duties & rules",
        topic: "Обязанности и правила (must / have to)",
        aspects: "Лексика: tidy my room, walk the dog, wash the dishes, do homework, help my parents. Структуры: I must tidy my room. I have to do my homework. We mustn't be late for school. Навыки: обсуждение домашних обязанностей, постер «My responsibilities»."
      },
      {
        number: 24,
        title: "Future plans",
        topic: "Будущее: планы и мечты (going to + лексика)",
        aspects: "Повтор/расширение be going to: I am going to be a doctor. I am going to learn English better. Навыки: устный и письменный мини-проект «My future plans» (5–6 предложений)."
      },
      {
        number: 25,
        title: "Environment & eco habits",
        topic: "Окружающая среда, экологические привычки",
        aspects: "Лексика: recycle, reuse, reduce, rubbish, bin, plastic, paper, save water, save energy. Структуры: We must save water. I always recycle paper. Навыки: разработка простых «eco-rules» для класса/дома."
      },
      {
        number: 26,
        title: "Reading skills: story",
        topic: "Чтение художественного текста",
        aspects: "Адаптированная история 8–10 предложений (ребёнок, семья, поездка, приключение). Навыки: чтение вслух, выделение ключевых событий, ответы на вопросы Who? Where? When? What happened? Составление простой схемы сюжета."
      },
      {
        number: 27,
        title: "Reading skills: fact file",
        topic: "Чтение информационного текста (non-fiction)",
        aspects: "Текст в формате «fact file» о животном/городе/человеке (таблица + короткие предложения). Навыки: чтение с выбором информации, заполнение таблицы, превращение fact file в устное мини-сообщение."
      },
      {
        number: 28,
        title: "Writing: email",
        topic: "Письмо: электронное письмо другу",
        aspects: "Формат: To/From/Subject, Dear…, Best wishes/Your friend. Структуры: Thank you for your letter. I want to tell you about… Навыки: написание простого e-mail (8–10 предложений) о себе, семье, хобби, выходных."
      },
      {
        number: 29,
        title: "Writing: description",
        topic: "Письменное описание человека/места",
        aspects: "Структуры: He/She has got…, He is…, She is…, There is/are…, It is…, It has…. Навыки: написание описания друга/своей комнаты/любимого места по плану (внешность/характер/место)."
      },
      {
        number: 30,
        title: "Big revision: grammar",
        topic: "Большое повторение грамматики",
        aspects: "Повтор: Present Simple, Present Continuous, Past Simple (was/were, regular/irregular), be going to, comparatives/superlatives, must/mustn't, there is/are, some/any, much/many (на уровне узнавания). Навыки: комплексные грамматические задания, трансформация предложений, тест-формат."
      },
      {
        number: 31,
        title: "Big revision: vocabulary & skills",
        topic: "Большое повторение лексики и речевых навыков",
        aspects: "Повтор ключевых тематических блоков: школа, дом, город, погода, путешествия, еда, хобби, экология, Великобритания. Навыки: чтение текста + краткое письмо-ответ, диалоги по карточкам, устные мини-презентации."
      },
      {
        number: 32,
        title: "My English portfolio",
        topic: "Итоговый проект года",
        aspects: "Итоговый продукт: «портфолио» / постер / слайд о себе и своём мире на английском: About me, My family, My day, My school, My town, My future plans. Навыки: интеграция всего изученного материала, устная защита мини-проекта."
      }
    ]
  },
  {
    grade: 5,
    title: "Английский язык, 5 класс",
    description: "Комплексный курс английского языка для пятиклассников с углубленным изучением грамматических конструкций, развитием всех языковых навыков и подготовкой к экзаменационным форматам.",
    lessons: [
      {
        number: 1,
        title: "Back to English 5",
        topic: "Повтор 3–4 класса, диагностика",
        aspects: "Повтор: Present Simple / Continuous, Past Simple, be going to, comparatives/superlatives, must/mustn't. Короткие устные self-presentations: About me, my family, my school. Мини-тест по грамматике и лексике."
      },
      {
        number: 2,
        title: "Who am I?",
        topic: "Характер и личность",
        aspects: "Лексика: clever, friendly, shy, brave, lazy, hard-working, funny, kind. Структуры: I am friendly and hard-working. I am good at… I am bad at… Навыки: устное и письменное самоописание по плану."
      },
      {
        number: 3,
        title: "School life 2.0",
        topic: "Школа, предметы, мнение",
        aspects: "Повтор/расш.: subject, timetable, break, mark, test, exam. Структуры: My favourite subject is… I like English because it is interesting. I don't like… Навыки: высказывание мнения с because, мини-дискуссии в парах."
      },
      {
        number: 4,
        title: "Present Simple: систематизация",
        topic: "Present Simple: утв., отриц., вопросы",
        aspects: "Повтор: I/you/we/they + he/she/it. Структуры: He doesn't like…, Do they play…? Маркеры: always, often, usually, sometimes, never. Навыки: трансформация предложений, опрос класса: How often do you…?"
      },
      {
        number: 5,
        title: "Present Continuous 2.0",
        topic: "Действия сейчас, процесс",
        aspects: "Повтор/углубление: am/is/are + V-ing, исключения (write → writing, swim → swimming). Структуры: She is doing her homework now. What are they doing? Навыки: описание картинок, «живая картинка» в классе."
      },
      {
        number: 6,
        title: "Present Simple vs Present Continuous",
        topic: "Контраст «обычно» vs «сейчас»",
        aspects: "Сравнение: I go to school every day vs I am going to school now. Маркеры: every day, on Mondays vs now, at the moment. Навыки: классификация предложений, заполнение таблицы, устные мини-диалоги."
      },
      {
        number: 7,
        title: "Past Simple: регулярные глаголы",
        topic: "Прошедшее время, правильные глаголы",
        aspects: "Образование: V + -ed, особенности: play–played, study–studied, stop–stopped. Структуры: I played football yesterday. Did you watch TV? – Yes, I did / No, I didn't. Навыки: трансформация из Present в Past, рассказ о вчерашнем дне."
      },
      {
        number: 8,
        title: "Past Simple: неправильные глаголы 1",
        topic: "Irregular verbs: базовый набор",
        aspects: "Лексика: go–went, have–had, see–saw, do–did, come–came. Структуры: We went to the park. I saw my friend. Навыки: карточки Present ↔ Past, упражнения «закончи историю» по картинкам."
      },
      {
        number: 9,
        title: "Past Simple: неправильные глаголы 2",
        topic: "Irregular verbs: расширение",
        aspects: "Лексика: eat–ate, drink–drank, take–took, give–gave, make–made, swim–swam. Структуры: They ate pizza. He took photos. Навыки: мини-истории в прошедшем, письменные упражнения на выбор правильной формы."
      },
      {
        number: 10,
        title: "Past Continuous (вводно)",
        topic: "Прошедшее длительное время",
        aspects: "Структуры: was/were + V-ing: I was watching TV at 7 o'clock. They were playing football. Контраст с Past Simple: I was watching TV when my mum came. Навыки: понимание по картинкам/таймлайну, базовые упражнения."
      },
      {
        number: 11,
        title: "Stories in the past",
        topic: "Истории в прошедшем времени",
        aspects: "Интеграция: Past Simple + Past Continuous. Маркеры: yesterday, last week, when, while. Структуры: While I was walking, I saw… Навыки: составление короткого рассказа по серии картинок, письменный story из 5–7 предложений."
      },
      {
        number: 12,
        title: "Talking about the future",
        topic: "Будущее: will vs be going to",
        aspects: "Структуры: I will help you. It will be sunny tomorrow (прогноз). I am going to visit my grandma (план). Навыки: различение по смыслу (спонтанное решение vs запланировано), упражнения на подстановку."
      },
      {
        number: 13,
        title: "Modal verbs 1",
        topic: "Can, must, have to",
        aspects: "Структуры: I can swim. I must do my homework. I have to get up early. You mustn't use your phone in class. Навыки: формулировка правил/обязанностей дома и в школе."
      },
      {
        number: 14,
        title: "Modal verbs 2",
        topic: "Should/shouldn't (совет)",
        aspects: "Структуры: You should eat more fruit. You shouldn't watch TV so much. Навыки: диалоги-советы (здоровье, учёба), упражнения «Что посоветуешь?»."
      },
      {
        number: 15,
        title: "Daily life & technology",
        topic: "Технологии и цифровая жизнь",
        aspects: "Лексика: social media, message, chat, download, upload, website, app, online, safe. Структуры: I use the internet to… I usually chat with my friends online. Навыки: обсуждение правил безопасного поведения онлайн (you mustn't…)."
      },
      {
        number: 16,
        title: "Food, health & lifestyle",
        topic: "Еда и здоровый образ жизни",
        aspects: "Повтор: fruit, vegetables, meat, sweets + расширение: junk food, vitamins, diet, exercise. Грамматика: countable/uncountable, some/any, much/many, a lot of. Структуры: I eat a lot of fruit. I don't drink much cola. Навыки: составление «healthy menu», устное описание привычек."
      },
      {
        number: 17,
        title: "At the restaurant",
        topic: "Функциональный язык: кафе/ресторан",
        aspects: "Лексика: main course, dessert, starter, bill, waiter/waitress, order. Структуры: Can I have…? I'd like…, please. Anything else? – That's all, thank you. Навыки: ролевая игра «ресторан», заполнение мини-меню."
      },
      {
        number: 18,
        title: "Travelling 2.0",
        topic: "Путешествия, транспорт, аэропорт/вокзал",
        aspects: "Лексика: airport, station, platform, gate, passport, luggage, ticket, boarding pass. Структуры: We are going to travel by plane. Last year we went to… Навыки: интеграция времён (Past / Present / Future), диалоги на кассе/регистрации (очень упрощённо)."
      },
      {
        number: 19,
        title: "Countries & the world",
        topic: "Страны, национальности, география",
        aspects: "Повтор/расширение: continent, capital, population, flag, language. Структуры: France is in Europe. The capital of France is Paris. People speak French. Навыки: работа с картой, mini fact file о стране."
      },
      {
        number: 20,
        title: "Nature & environment",
        topic: "Природа, экология",
        aspects: "Лексика: forest, ocean, rainforest, pollution, rubbish, climate, endangered animals. Структуры: We must protect nature. We should recycle paper. Навыки: обсуждение eco-habits, мини-проект «Green rules for our class»."
      },
      {
        number: 21,
        title: "Comparatives & superlatives 3.0",
        topic: "Степени сравнения (расширение)",
        aspects: "Правила: односложные, двухсложные, длинные прилагательные; more / the most, -er / -est; исключения: good–better–the best, bad–worse–the worst. Дополнительно: as…as, not as…as. Навыки: сравнение людей, предметов, видов спорта и т.п."
      },
      {
        number: 22,
        title: "Adverbs & word order",
        topic: "Наречия (частоты и образа действия)",
        aspects: "Лексика: quickly, slowly, carefully, loudly, quietly. Повтор always, often, never. Структуры: He always gets up early. She speaks English very well. Навыки: корректный порядок слов, трансформация прилагательное → наречие."
      },
      {
        number: 23,
        title: "Time & place",
        topic: "Предлоги времени и места",
        aspects: "Лексика/структуры: in the morning, in June, on Monday, on the 5th of May, at night, at 7 o'clock; предлоги места: opposite, near, between, next to. Навыки: заполнение расписания/календаря, описание расположения объектов в городе/комнате."
      },
      {
        number: 24,
        title: "Reading: story",
        topic: "Чтение художественного текста",
        aspects: "Адаптированная история 10–12 предложений. Фокус: Past Simple, Past Continuous, описания. Навыки: чтение с пониманием, выделение ключевых событий, ответы на Who/Where/When/Why, составление плана истории."
      },
      {
        number: 25,
        title: "Reading: article",
        topic: "Чтение информационного текста (non-fiction)",
        aspects: "Тексты о животных, странах, технологиях. Навыки: поиск конкретной информации (scanning), понимание общей идеи (skimming), работа с заголовками и подзаголовками, заполнение таблиц/диаграмм по тексту."
      },
      {
        number: 26,
        title: "Writing: email 2.0",
        topic: "Информальное письмо/e-mail (расширение)",
        aspects: "Структура письма: greeting, opening, main part, closing. Структуры: Thanks for your letter. I'm going to tell you about… Write back soon. Навыки: написание связного письма 10–12 предложений с абзацами."
      },
      {
        number: 27,
        title: "Writing: story in the past",
        topic: "Письменный рассказ в прошедшем времени",
        aspects: "План: beginning – main events – ending. Использование Past Simple + Past Continuous, связки: first, then, after that, finally. Навыки: написание истории по серии картинок, проверка логики и связности."
      },
      {
        number: 28,
        title: "My favourite person",
        topic: "Проект: человек/герой",
        aspects: "Лексика: appearance (tall, short, slim, curly hair), character (kind, brave, funny, smart). Структуры: He/She is…, He/She has got…, He/She is good at…, He/She likes…. Навыки: подготовка постера/слайда и устное выступление о реальном или вымышленном герое."
      },
      {
        number: 29,
        title: "Big revision: grammar",
        topic: "Обобщение грамматики",
        aspects: "Повтор: Present Simple/Continuous, Past Simple/Continuous, will vs be going to, модальные (can, must, have to, should), comparatives/superlatives, предлоги времени/места, some/any, much/many. Навыки: комплексные грамматические упражнения и мини-тест."
      },
      {
        number: 30,
        title: "Big revision: vocabulary & skills",
        topic: "Обобщение лексики и речевых умений",
        aspects: "Повтор тематических блоков: личность, школа, дом, город, путешествия, еда и здоровье, природа и экология, технологии, страны и культуры. Навыки: чтение + задания, диалоги, мини-письмо."
      },
      {
        number: 31,
        title: "Exam practice",
        topic: "Подготовка к проверочным/ВПР-формату",
        aspects: "Типовые задания: чтение с выбором ответа, установление соответствия, лексико-грамматические задания, письмо (короткое письмо/рассказ), устный монолог по плану. Навыки: управление временем, понимание формата."
      },
      {
        number: 32,
        title: "My English portfolio 5",
        topic: "Итоговый проект года",
        aspects: "Портфолио/презентация: About me, My school life, My hobbies, My favourite person, My future plans, My eco-rules. Навыки: интеграция всего материала, устная защита проекта, рефлексия «что я уже умею на английском»."
      }
    ]
  },
  {
    grade: 6,
    title: "Английский язык, 6 класс",
    description: "Продвинутый курс английского языка для шестиклассников с углубленным изучением грамматических конструкций, развитием академических навыков и подготовкой к комплексному использованию языка.",
    lessons: [
      {
        number: 1,
        title: "Back to English 6",
        topic: "Повтор 5 класса, диагностика",
        aspects: "Повтор: Present Simple / Continuous, Past Simple, Future (will / be going to), модальные глаголы (can, must, should), comparatives/superlatives. Диагностические задания: чтение короткого текста, мини-монолог «About me», базовый лексико-грамматический тест."
      },
      {
        number: 2,
        title: "Teen life",
        topic: "Подростки, интересы и навыки",
        aspects: "Лексика: teenager, hobby, skill, goal, confident, shy, creative, lazy. Структуры: I am good at…, I want to…, I'm interested in…. Навыки: устное и письменное самоописание «кто я и что мне интересно»."
      },
      {
        number: 3,
        title: "Friends & relations",
        topic: "Дружба, характер, отношения",
        aspects: "Лексика: friendly, honest, helpful, rude, polite, reliable, selfish. Структуры: A good friend is…, He/She is… because…. Навыки: описание друзей, высказывание мнения с because/and/but."
      },
      {
        number: 4,
        title: "School life & routine",
        topic: "Школьная жизнь и режим дня",
        aspects: "Лексика: timetable, grades, homework, extra classes, revise, exam. Грамматика: Present Simple (habits) + наречия частоты. Структуры: I usually…, I hardly ever…, I often have to…. Навыки: устный и письменный «My school day»."
      },
      {
        number: 5,
        title: "Present Simple vs Continuous 2.0",
        topic: "Контраст «обычно» vs «прямо сейчас»",
        aspects: "Повтор форм: do/does + V, am/is/are + V-ing. Маркеры: every day, usually, often vs now, at the moment, today. Навыки: классификация предложений, описание картинок (что делает герой обычно / сейчас)."
      },
      {
        number: 6,
        title: "Past Simple: расширение",
        topic: "Прошедшее время, повтор и расширение",
        aspects: "Повтор образования Past Simple (регулярные/неправильные глаголы), маркеры: yesterday, last week, two days ago. Лексика: travel, meet, enjoy, decide, visit. Навыки: трансформация предложений из настоящего в прошедшее, устные мини-истории."
      },
      {
        number: 7,
        title: "Past Continuous",
        topic: "Прошедшее длительное время",
        aspects: "Формы: was/were + V-ing. Структуры: I was doing homework at 7. They were playing football. Контраст с Past Simple: When I was walking home, I saw…. Навыки: описание действий «на линии времени», упражнения «Что происходило в момент…»."
      },
      {
        number: 8,
        title: "Past Simple vs Past Continuous",
        topic: "Истории в прошлом",
        aspects: "Структуры: While I was…, I saw…; I was watching TV when my friend called. Навыки: построение короткой истории по серии картинок, устный и письменный рассказ (6–8 предложений)."
      },
      {
        number: 9,
        title: "I used to…",
        topic: "Привычки в прошлом",
        aspects: "Конструкция used to (лексически): I used to play with toys, now I play computer games. Контраст: now vs in the past. Навыки: сравнение «раньше/сейчас» в устной и письменной форме."
      },
      {
        number: 10,
        title: "Future plans",
        topic: "Будущее: планы и решения",
        aspects: "Повтор/развод: be going to (планы), will (спонтанные решения, обещания). Структуры: I'm going to study harder. I think it will rain. Навыки: планирование каникул/будущего, диалоги «What are you going to do…?»."
      },
      {
        number: 11,
        title: "Modal verbs: can, could, may, might",
        topic: "Возможность, просьба, разрешение",
        aspects: "Структуры: Can I…? Could you…? May I…? It might rain. Навыки: вежливые просьбы, просьбы о помощи, выражение вероятности/возможности."
      },
      {
        number: 12,
        title: "Modal verbs: must, have to, should",
        topic: "Обязанности и советы",
        aspects: "Структуры: I must do my homework. I have to get up early. You don't have to…, You should/shouldn't…. Навыки: формулировка правил дома/в школе, советы по здоровью и учебе."
      },
      {
        number: 13,
        title: "Present Perfect 1",
        topic: "Введение Present Perfect (ever/never)",
        aspects: "Форма: have/has + V3. Лексика: be, go, see, do, try, visit. Структуры: Have you ever…? – Yes, I have / No, I haven't. I have never…. Навыки: устные диалоги «жизненный опыт», отличие от Past Simple на уровне смысловых маркеров."
      },
      {
        number: 14,
        title: "Present Perfect 2",
        topic: "Just, already, yet, gone/been",
        aspects: "Маркеры: just, already, yet. Структуры: I've just finished my homework. I've already seen this film. I haven't done it yet. Отличие gone / been: He has gone to London vs He has been to London. Навыки: подстановочные упражнения, диалоги."
      },
      {
        number: 15,
        title: "Present Perfect vs Past Simple",
        topic: "Опыт vs конкретное время",
        aspects: "Сопоставление: I've visited London (опыт) vs I visited London last year (конкретное событие). Маркеры: ever, never, just, already, yet vs yesterday, last…, ago. Навыки: выбор правильного времени в контексте, короткие тексты с пропусками."
      },
      {
        number: 16,
        title: "Comparing things",
        topic: "Сравнение предметов и людей",
        aspects: "Повтор/расширение comparatives/superlatives, модификаторы: much, a bit, far, slightly. Структуры: A is more interesting than B. This film is much better. It isn't as difficult as…. Навыки: сравнение школ, предметов, хобби, людей."
      },
      {
        number: 17,
        title: "Quantity & amounts",
        topic: "Количественные слова и исчисляемость",
        aspects: "Повтор: some/any, a lot of + расширение: much/many, (a) few, (a) little. Структуры: I don't have much time. I have a few friends in… Навыки: классификация слов на countable/uncountable, работа с диалогами о покупках/еде."
      },
      {
        number: 18,
        title: "Passive voice (Present Simple)",
        topic: "Ввод страдательного залога",
        aspects: "Формы: am/is/are + V3. Структуры: English is spoken in many countries. The book is used at school. Навыки: преобразование активных предложений в пассив, чтение и понимание пассивных конструкций в текстах."
      },
      {
        number: 19,
        title: "Reported speech (вводно)",
        topic: "Косвенная речь: утверждения (Present→Past)",
        aspects: "Глаголы: say, tell. Структуры: He said, 'I like English.' → He said (that) he liked English. Навыки: преобразование простых прямых высказываний в косвенную речь, понимание сдвига времени на базовом уровне."
      },
      {
        number: 20,
        title: "Conditions: If…",
        topic: "Условные предложения (тип 0 и 1)",
        aspects: "Тип 0: If you heat water, it boils. Тип 1: If it rains, I will stay at home. Навыки: построение условных предложений для правил, привычек и реальных будущих ситуаций."
      },
      {
        number: 21,
        title: "Media & entertainment",
        topic: "Медиа, фильмы, музыка, игры",
        aspects: "Лексика: series, episode, cartoon, action film, comedy, news, channel, download, upload, subscribe. Грамматика: Present Simple/Continuous, мнения: I think…, In my opinion…. Навыки: обсуждение любимых фильмов/каналов/игр, аргументация своего мнения."
      },
      {
        number: 22,
        title: "Sport & healthy lifestyle",
        topic: "Спорт, здоровье, привычки",
        aspects: "Лексика: training, competition, champion, fit, injury, exercise, diet. Грамматика: should/shouldn't, must, Present Simple/Continuous. Навыки: обсуждение режима дня, тренировок, «healthy vs unhealthy habits», мини-проект «My healthy plan»."
      },
      {
        number: 23,
        title: "Travel & holidays 3.0",
        topic: "Путешествия, каникулы, опыт",
        aspects: "Лексика: sightseeing, tour, journey, trip, hostel, hotel, campsite, souvenir. Грамматика: Past Simple/Present Perfect. Навыки: рассказы о прошлых поездках, планы будущих путешествий, диалоги «At the hotel/at the station» (упрощённо)."
      },
      {
        number: 24,
        title: "The world & environment",
        topic: "Мир, природа, экопроблемы",
        aspects: "Лексика: pollution, recycle, climate change, global warming, protect, wildlife, endangered. Грамматика: модальные (must/should), Present Simple/Passive: Trees are cut down…. Навыки: формулировка «eco-rules», устный мини-проект о защите природы."
      },
      {
        number: 25,
        title: "Culture & traditions",
        topic: "Культура, праздники, традиции",
        aspects: "Лексика: tradition, celebration, festival, custom, costume, parade. Страноведение: британские/американские праздники (Christmas, Halloween, Thanksgiving и др.). Навыки: сравнение традиций своей страны и англоязычных, чтение страноведческого текста с заданиями."
      },
      {
        number: 26,
        title: "Reading: story & character",
        topic: "Чтение художественного текста, персонажи",
        aspects: "Адаптированная история 12–14 предложений. Фокус: Past Simple/Continuous, описания персонажей. Навыки: чтение с пониманием, анализ характера героя, ответы на вопросы, краткий пересказ."
      },
      {
        number: 27,
        title: "Reading: article & opinion",
        topic: "Чтение информационного текста + мнение",
        aspects: "Небольшая статья (технологии, экология, школа). Навыки: выделение главной мысли, поиск деталей, выражение согласия/несогласия: I agree/disagree because…."
      },
      {
        number: 28,
        title: "Writing: opinion paragraph",
        topic: "Письмо-мнение (1 абзац / короткое эссе)",
        aspects: "Структура: topic sentence → reasons → conclusion. Связки: first, also, besides, however, in my opinion. Навыки: написание связного абзаца (8–10 предложений) на тему «School uniforms», «Computer games», «Social networks» и т.п."
      },
      {
        number: 29,
        title: "Writing: story in the past",
        topic: "Письменный рассказ в прошедшем времени",
        aspects: "План: beginning – problem – solution – ending. Грамматика: Past Simple/Continuous, связки first, then, suddenly, finally. Навыки: написание короткой истории по картинкам или по заданному началу (10–12 предложений)."
      },
      {
        number: 30,
        title: "Speaking: discussion & role play",
        topic: "Развитие устной речи",
        aspects: "Форматы: мини-дебаты, парные диалоги, ролевые игры (кафе, путешествие, спор о мнениях). Интеграция всех ключевых грамматических структур. Навыки: удержание монолога 1–2 минуты по плану, активное участие в диалоге."
      },
      {
        number: 31,
        title: "Big revision & exam practice",
        topic: "Итоговое повторение и тренировка формата проверок",
        aspects: "Повтор: все ключевые времена, модальные, условные, сравнительные степени, пассив и Present Perfect (на базовом уровне). Типовые задания: чтение с выбором, грамматический тест, письмо (письмо/мнение/история), устный монолог по плану."
      },
      {
        number: 32,
        title: "My English portfolio 6",
        topic: "Итоговый проект года",
        aspects: "Портфолио/презентация: «Who I am now in English» – About me, My friends, My school life, My hobbies and media, My travels (real/imagined), My future plans, My eco-rules. Навыки: интеграция материала года, презентация проекта, самооценка прогресса."
      }
    ]
  },
  {
    grade: 7,
    title: "Английский язык, 7 класс",
    description: "Расширенный курс английского языка для семиклассников с углубленным изучением грамматических конструкций, развитием академических и коммуникативных навыков, а также формированием критического мышления.",
    lessons: [
      {
        number: 1,
        title: "Back to English 7",
        topic: "Повтор 5–6 классов, диагностика",
        aspects: "Повтор: Present/Past/Future (Simple/Continuous), модальные (can, must, should), Present Perfect (базово), comparatives/superlatives, some/any, much/many, Passive (Present). Диагностика: короткий монолог «About me», лексико-грамматический мини-тест, чтение небольшого текста."
      },
      {
        number: 2,
        title: "Teen world",
        topic: "Подростки, идентичность, интересы",
        aspects: "Лексика: teenager, identity, pressure, trend, peer, confident, insecure, responsible. Структуры: I feel…, I'm into…, I'm worried about…. Навыки: монолог «Who I am as a teenager», обсуждение типичных проблем подростков."
      },
      {
        number: 3,
        title: "Looks & personality 2.0",
        topic: "Внешность и характер (расширение)",
        aspects: "Лексика: appearance (slim, well-built, pale, freckles), character (outgoing, stubborn, jealous, generous). Структуры: He seems…, She looks…, He is the kind of person who…. Навыки: описание людей, сопоставление внешности и характера, работа с фото/иллюстрациями."
      },
      {
        number: 4,
        title: "Friends & family dynamics",
        topic: "Отношения в семье и с друзьями",
        aspects: "Лексика: argue, support, get on well with, respect, trust, depend on. Структуры: We get on well because…, We often argue about…. Навыки: обсуждение конфликтов/поддержки, мини-диалоги «problem–advice»."
      },
      {
        number: 5,
        title: "Present tenses: систематизация",
        topic: "Present Simple / Continuous / Perfect",
        aspects: "Контраст: habits vs now vs result. Структуры: I've lived here for… / since…, I'm studying for a test now, I usually… Маркеры: for, since, just, already, yet. Навыки: выбор времени по контексту, трансформация предложений."
      },
      {
        number: 6,
        title: "Past tenses: расширенный блок",
        topic: "Past Simple / Past Continuous / Past Perfect (вводно)",
        aspects: "Структуры: When I came home, my parents had already left. I was doing my homework when…. Фокус: последовательность действий в прошлом. Навыки: расстановка событий по таймлайну, короткие истории с Past Perfect на уровне клише."
      },
      {
        number: 7,
        title: "Future forms: will, going to, Present Continuous",
        topic: "Будущее: планы, решения, расписание",
        aspects: "Структуры: I'll help you (решение сейчас). I'm going to start a new hobby (план). I'm meeting my friend tomorrow (расписание/договорённость). Навыки: выбор формы под ситуацию, планирование недели/каникул."
      },
      {
        number: 8,
        title: "Modal verbs 3.0",
        topic: "Обязанность, разрешение, вероятность",
        aspects: "Повтор/расширение: must, have to, don't have to, should, may, might, could. Структуры: You don't have to…, You might be right, You should talk to…. Навыки: формулировка правил, советов, вероятности."
      },
      {
        number: 9,
        title: "Verb patterns",
        topic: "Герундий и инфинитив",
        aspects: "Модели: like/love/hate doing; want/decide/plan to do; good at doing, interested in doing. Навыки: подстановка правильной формы, типовые высказывания о хобби, планах, интересах."
      },
      {
        number: 10,
        title: "Degrees & emphasis",
        topic: "Усилители и смягчители",
        aspects: "Лексика: really, quite, very, too, enough, a bit, pretty. Структуры: It's really interesting, It's too difficult, I'm quite tired, I'm not confident enough. Навыки: нюансировка мнения, более естественное говорение."
      },
      {
        number: 11,
        title: "Relative clauses 1",
        topic: "Относительные придаточные (who/which/that)",
        aspects: "Структуры: A friend who understands you…, A job which is dangerous…, That's the film that I like most. Навыки: соединение предложений, описание людей/предметов через relative clauses."
      },
      {
        number: 12,
        title: "Relative clauses 2",
        topic: "Расширение: where, when, whose",
        aspects: "Структуры: a place where…, a time when…, a person whose…. Навыки: построение более сложных описаний (города, школ, людей), переработка простых предложений в сложные."
      },
      {
        number: 13,
        title: "Conditionals 0–1",
        topic: "Условные предложения типа 0 и 1",
        aspects: "Тип 0: If you don't sleep enough, you feel tired. Тип 1: If I have time, I will… Навыки: формулировка правил и реальных будущих ситуаций, подстановочные упражнения."
      },
      {
        number: 14,
        title: "Conditionals 2",
        topic: "Условные предложения типа 2",
        aspects: "Структуры: If I had more free time, I would…. If I were you, I would…. Навыки: обсуждение гипотетических ситуаций, советы в формате If I were you."
      },
      {
        number: 15,
        title: "Reported speech 1",
        topic: "Косвенная речь: утверждения",
        aspects: "Сдвиг времени: Present → Past. Структуры: He said (that) he liked…, She told me (that)… Навыки: преобразование простых высказываний, понимание логики backshift."
      },
      {
        number: 16,
        title: "Reported speech 2",
        topic: "Косвенная речь: вопросы и просьбы",
        aspects: "Структуры: 'Do you like it?' → He asked if I liked it. 'Can you help me?' → She asked me to help her. Навыки: преобразование yes/no и Wh-вопросов и команд/просьб, тренировка типовых паттернов."
      },
      {
        number: 17,
        title: "Media & social networks",
        topic: "Медиа, соцсети, контент",
        aspects: "Лексика: social network, follower, post, comment, like, share, privacy, fake news. Грамматика: модальные (should, must) + лексика рисков. Навыки: обсуждение цифровой безопасности, плюсов/минусов соцсетей, формулировка правил safe online."
      },
      {
        number: 18,
        title: "Technology & future",
        topic: "Технологии и будущее",
        aspects: "Лексика: gadget, device, artificial intelligence, robot, virtual reality, app, innovation. Грамматика: Future (will, might) для прогнозов: In the future, people will…, There might be…. Навыки: прогнозы и дискуссия о будущем технологий."
      },
      {
        number: 19,
        title: "Global issues",
        topic: "Глобальные проблемы мира",
        aspects: "Лексика: poverty, hunger, pollution, climate change, war, peace, human rights, charity. Грамматика: модальные (must, should) + Passive: Trees are cut down…. Навыки: обсуждение глобальных проблем, формулировка простых решений."
      },
      {
        number: 20,
        title: "Health & wellbeing",
        topic: "Здоровье, стресс, баланс",
        aspects: "Лексика: stress, anxiety, relax, meditate, take a break, balanced diet, mental health. Грамматика: should/shouldn't, too/enough. Навыки: советы по управлению стрессом, мини-проект «My wellbeing plan»."
      },
      {
        number: 21,
        title: "Travel & tourism 4.0",
        topic: "Туризм, типы отдыха",
        aspects: "Лексика: sightseeing, tour, journey, trip, hostel, hotel, campsite, local culture. Грамматика: Present Perfect/Past Simple для опыта путешествий. Навыки: описание реальных/воображаемых поездок, выбор типа отдыха и аргументация."
      },
      {
        number: 22,
        title: "Cultures & diversity",
        topic: "Культура, мультикультурность",
        aspects: "Лексика: culture, tradition, custom, stereotype, respect, diversity, tolerance. Структуры: It is important to…, People in … usually…, In my culture…. Навыки: обсуждение различий/общего между культурами, развитие толерантности."
      },
      {
        number: 23,
        title: "Reading: narrative",
        topic: "Чтение художественного текста (повествование)",
        aspects: "Текст 14–16 предложений (история подростка/приключение). Фокус: Past tenses, разговорная лексика. Навыки: чтение с пониманием, выделение структуры истории (начало–проблема–развитие–финал), пересказ по плану."
      },
      {
        number: 24,
        title: "Reading: article / blog",
        topic: "Чтение информационного/блогового текста",
        aspects: "Текст в формате статьи/блога (про соцсети, здоровье, учебу, хобби). Навыки: skimming/scanning, работа с заголовками, выделение аргументов «за/против», подготовка собственного мнения на основе текста."
      },
      {
        number: 25,
        title: "Writing: informal email/message",
        topic: "Неформальное письмо / сообщение",
        aspects: "Структура: greeting, opening, main part, closing. Фразы: Thanks for your message, Sorry I haven't written…, Write back soon. Навыки: письмо другу о новостях, планах, впечатлениях (120–140 слов в перспективе, можно меньше)."
      },
      {
        number: 26,
        title: "Writing: opinion paragraph/essay",
        topic: "Краткое эссе-мнение",
        aspects: "Структура: введение (мнение), 2–3 аргумента, вывод. Связки: firstly, moreover, however, in my opinion, on the one hand/on the other hand. Темы: «School uniforms», «Social networks», «Homework». Навыки: логичная структура, связность, аргументация."
      },
      {
        number: 27,
        title: "Writing: story",
        topic: "История в прошлом",
        aspects: "План: beginning – problem – solution – ending; включение диалога. Грамматика: Past Simple/Continuous, возможно Past Perfect; связки: suddenly, then, a few minutes later, finally. Навыки: написание истории по картинкам/заданному началу, контроль длины и структуры."
      },
      {
        number: 28,
        title: "Speaking: monologue",
        topic: "Монолог по плану",
        aspects: "Типовые планы: «My typical day», «My best friend», «The role of the Internet», «My future job». Навыки: структурирование речи (introduction–main part–conclusion), использование связок, удержание монолога 2–3 минуты."
      },
      {
        number: 29,
        title: "Speaking: dialogue & discussion",
        topic: "Диалог, мини-дискуссия",
        aspects: "Сценарии: «problem–advice», «for/against», «plan together» (путешествие, мероприятие). Навыки: задавать уточняющие вопросы, выражать согласие/несогласие, вежливо прерывать/дополнять."
      },
      {
        number: 30,
        title: "Big revision: grammar",
        topic: "Обобщение грамматики года",
        aspects: "Повтор: все ключевые времена, условные 0–2, модальные, Perfect vs Past Simple, Relative clauses, Reported speech, Passive (Present). Навыки: комплексные грамматические задания в формате контрольных/ВПР-подобных."
      },
      {
        number: 31,
        title: "Big revision: vocabulary & skills",
        topic: "Обобщение лексики и коммуникативных навыков",
        aspects: "Повтор тематических блоков: подростки, отношения, здоровье, технологии, медиа, путешествия, глобальные проблемы, культура. Навыки: чтение + задания, письмо (email/мнение), устный монолог/диалог по карточкам."
      },
      {
        number: 32,
        title: "My English portfolio 7",
        topic: "Итоговый проект года",
        aspects: "Портфолио/презентация: «Me as a teenager in the modern world» – блоки про себя, друзей, школу, онлайн-жизнь, здоровье, глобальные темы, планы на будущее. Навыки: подготовка и защита проекта, рефлексия для ученика «что я реально умею на английском»."
      }
    ]
  },
  {
    grade: 8,
    title: "Английский язык, 8 класс",
    description: "Продвинутый курс английского языка для восьмклассников с углубленным изучением сложных грамматических конструкций, развитием критического мышления, медиаграмотности и академических навыков.",
    lessons: [
      {
        number: 1,
        title: "Back to English 8",
        topic: "Повтор 7 класса, диагностика",
        aspects: "Повтор: времена (Present/Past/Future Simple/Continuous/Perfect), модальные, Conditionals 0–2, Relative clauses, Reported speech (базово), Passive (Present). Диагностика: короткий тест + монолог «About me and my life now»."
      },
      {
        number: 2,
        title: "Teen identity 2.0",
        topic: "Личность, самоидентичность",
        aspects: "Лексика: identity, independent, mature, responsible, ambitious, frustrated, confused. Структуры: I consider myself…, I'm proud of…, I struggle with…. Навык: монолог/мини-эссе о себе «who I am now»."
      },
      {
        number: 3,
        title: "Values & choices",
        topic: "Ценности, выбор, давление среды",
        aspects: "Лексика: values, choice, influence, peer pressure, expectations, priority. Грамматика: модальные (must, have to, should, ought to) в значении внутреннего/внешнего долга. Навык: обсуждение сложных выборов, совет в формате If I were you, I would…."
      },
      {
        number: 4,
        title: "School & education",
        topic: "Школа, образование, траектория",
        aspects: "Лексика: curriculum, grade, compulsory, optional, subject, exam, revision, mark/grade. Структуры: Education is important because…, I would like to study…. Навык: обсуждение системы образования, плюсов/минусов предметов."
      },
      {
        number: 5,
        title: "Present tenses: focus on nuance",
        topic: "Present Simple / Continuous / Perfect / Perfect Continuous (вводно)",
        aspects: "Контраст: I've known him for… vs I've been studying for… Структуры: I've been learning English for 8 years. Навык: выбор нужной формы по контексту, работа с маркерами for/since, lately, recently, all day."
      },
      {
        number: 6,
        title: "Past tenses: system",
        topic: "Past Simple / Continuous / Perfect",
        aspects: "Обобщение: цепочка событий в прошлом. Структуры: When I arrived, they had already started. I was doing… when…. Навык: выстраивание таймлайна, реконструкция истории."
      },
      {
        number: 7,
        title: "Future in detail",
        topic: "Все формы будущего",
        aspects: "Will / be going to / Present Continuous / Future Perfect (вводно: By 2030 I will have finished school). Навык: выбор формы по коммуникативной задаче (план, расписание, прогноз, обещание, результат к дедлайну)."
      },
      {
        number: 8,
        title: "Modal verbs: nuance & style",
        topic: "Модальные: значение и оттенки",
        aspects: "Повтор/расширение: can, could, may, might, must, have to, should, ought to, needn't. Введение модального перфекта: should have done, could have done (на понимание и базовое использование). Навык: объяснение «что было бы лучше/правильно»."
      },
      {
        number: 9,
        title: "Verb patterns 2.0",
        topic: "Герундий/инфинитив, сложные схемы",
        aspects: "Схемы: enjoy/avoid/keep doing; decide/plan/hope to do; forget/remember doing/to do; stop doing/to do. Навык: выбор формы после глагола, отработка в контексте типичных школьных ситуаций."
      },
      {
        number: 10,
        title: "Passive voice 2.0",
        topic: "Страдательный залог (расширение)",
        aspects: "Present/Past Simple Passive + вводно Present Perfect Passive: The project has been done. Лексика: invented, discovered, produced, built. Навык: перестройка активных предложений, работа с текстами о науке/технике."
      },
      {
        number: 11,
        title: "Reported speech: full block",
        topic: "Косвенная речь: утверждения и вопросы",
        aspects: "Сдвиг времени: Present/Past/Future → Past. Вопросы: yes/no + Wh-questions. Навык: преобразование диалогов в косвенный пересказ, работа с типовым диалогом «parents–teenager»."
      },
      {
        number: 12,
        title: "Reported speech: commands & advice",
        topic: "Косвенная речь: просьбы, приказы, советы",
        aspects: "Структуры: tell/ask sb to do; advise sb to do; He told me not to…, She asked me to…. Навык: пересказ диалогов, раздел «problem–advice»."
      },
      {
        number: 13,
        title: "Conditionals 0–2: system",
        topic: "Условные 0, 1, 2 (систематизация)",
        aspects: "Повтор форм, фокус на значении: реальное/нереальное, правила, советы If I were you…. Навык: формулировка правил, гипотетических ситуаций, советов."
      },
      {
        number: 14,
        title: "Conditionals 3 (вводно)",
        topic: "Условное 3 типа (на понимание и клише)",
        aspects: "Структуры: If I had studied harder, I would have passed. Фокус: сожаления о прошлом, missed opportunities. Навык: базовое использование в готовых шаблонах, обсуждение «что было бы, если…»."
      },
      {
        number: 15,
        title: "Mixed conditionals (основа)",
        topic: "Смешанные условные (вводно)",
        aspects: "Примеры: If I had gone to bed earlier, I wouldn't be so tired now. Навык: понимание связки «прошлое → настоящее», использование 1–2 типовых шаблонов."
      },
      {
        number: 16,
        title: "Relative clauses 3.0",
        topic: "Относительные придаточные (кратко/расширено)",
        aspects: "Повтор: who/which/that/where/when/whose. Введение сокращённых форм: the man standing near the door…. Навык: уплотнение текста, естественные описания людей/мест."
      },
      {
        number: 17,
        title: "Participles & compression",
        topic: "Причастные конструкции (вводно)",
        aspects: "Participle I/II: Walking along the street, I…, Tired and stressed, he…. Навык: понимание при чтении + 1–2 простых шаблона для письменной речи."
      },
      {
        number: 18,
        title: "Linking devices",
        topic: "Связки и логика текста",
        aspects: "Лексика: however, moreover, therefore, in addition, on the one hand…, on the other hand…, as a result. Навык: построение логичных аргументов в эссе/монологе, переформатирование «разрозненного» текста в связный."
      },
      {
        number: 19,
        title: "Media literacy",
        topic: "Медиа, критическое мышление",
        aspects: "Лексика: headline, source, bias, fact, opinion, reliable, fake news, clickbait. Грамматика: Passive, Reported speech. Навык: различать факт/мнение, обсуждать надёжность источников, пересказывать новость."
      },
      {
        number: 20,
        title: "Science & technology",
        topic: "Наука и технологии",
        aspects: "Лексика: invention, discovery, experiment, research, progress, device, artificial intelligence. Грамматика: Passive, Future (прогнозы). Навык: краткие «science reports», прогнозы о будущем науки."
      },
      {
        number: 21,
        title: "Environment & global problems 2.0",
        topic: "Экология и глобальные вызовы",
        aspects: "Лексика: sustainable, renewable energy, waste, recycling, climate crisis, carbon footprint. Грамматика: модальные (must, should), Conditionals 1–2. Навык: формулировка проблем и решений, мини-проект «Green plan for our school»."
      },
      {
        number: 22,
        title: "Social issues & equality",
        topic: "Социальные вопросы",
        aspects: "Лексика: inequality, discrimination, bullying, racism, gender, human rights, volunteer. Навык: аккуратное обсуждение чувствительных тем, выражение позиции с уважительными формулировками (In my view…, I strongly believe…)."
      },
      {
        number: 23,
        title: "Work & career",
        topic: "Профессии, карьерный путь",
        aspects: "Лексика: profession, career, skills, qualifications, salary, promotion, part-time job. Грамматика: Future forms (plans), Conditionals 2 (If I became…, I would…). Навык: обсуждение планов на профессию, «job profile» по шаблону."
      },
      {
        number: 24,
        title: "Travel, culture & tourism",
        topic: "Путешествия, культурные контакты",
        aspects: "Лексика: culture shock, local customs, sightseeing, accommodation, itinerary, tourist trap. Грамматика: Present Perfect (опыт), Past Simple (конкретные поездки). Навык: рассказ о поездке, советы туристу, работа с «travel blog»."
      },
      {
        number: 25,
        title: "Reading: fiction",
        topic: "Чтение художественного текста повышенной сложности",
        aspects: "Текст ~18–20 предложений (рассказ/отрывок). Много Past tenses, диалоги, описания. Навык: анализ персонажей, мотивов, атмосферы; пересказ + краткое мнение."
      },
      {
        number: 26,
        title: "Reading: article/report",
        topic: "Чтение статьи/отчёта",
        aspects: "Тексты о науке, обществе, технологиях. Навык: skimming/scanning, расположение абзацев в логическом порядке, выбор заголовков, выделение аргументов автора."
      },
      {
        number: 27,
        title: "Writing: formal vs informal",
        topic: "Формальное / неформальное письмо",
        aspects: "Сравнение стиля: Dear Sir or Madam vs Hi Alex; I am writing to… vs Just wanted to say…. Навык: подбор лексики и регистров под адресата, написание короткого formal email (жалоба/запрос) и informal message."
      },
      {
        number: 28,
        title: "Writing: opinion essay",
        topic: "Эссе-мнение (базовый экзаменационный формат)",
        aspects: "Структура: введение (переформулировка темы), 2–3 аргумента «за/против», вывод. Связки: on the one hand, on the other hand, moreover, however, in conclusion. Навык: написание связного текста 150–180 слов."
      },
      {
        number: 29,
        title: "Writing: narrative",
        topic: "Наратив (история)",
        aspects: "Использование Past Simple/Continuous/Perfect, диалога, описаний; клише для начала/конца истории. Навык: написание истории по картинкам/заданному началу с чёткой структурой."
      },
      {
        number: 30,
        title: "Speaking: extended monologue",
        topic: "Развёрнутый монолог (экзаменационный)",
        aspects: "Работа по плану (3–4 пункта), длительность 2–3 минуты, использование связок, примеров, личного опыта. Темы: технологии, профессия, соцсети, экология."
      },
      {
        number: 31,
        title: "Speaking: discussion & problem-solving",
        topic: "Диалог, обсуждение, принятие решений",
        aspects: "Ситуации: планирование мероприятия, спор о пользе/вреде, обсуждение проблемы и вариантов решения. Навык: задавать уточняющие вопросы, соглашаться/возражать, предлагать компромиссы."
      },
      {
        number: 32,
        title: "Big revision & portfolio 8",
        topic: "Итоговое повторение и проект",
        aspects: "Повтор ключевой грамматики и лексики года через проект: личное «портфолио 8 класса» (presentation/буклет/мини-сайт): «Me, my choices, my future, my world». Устная защита и рефлексия."
      }
    ]
  },
  {
    grade: 9,
    title: "Английский язык, 9 класс",
    description: "Подготовительный курс английского языка для девятиклассников с фокусом на экзаменационные форматы ОГЭ, развитием академических навыков и подготовкой к переходу в старшую школу.",
    lessons: [
      {
        number: 1,
        title: "Back to English 9",
        topic: "Повтор 7–8 классов, диагностика",
        aspects: "Повтор: все группы времён (Present/Past/Future Simple/Continuous/Perfect), модальные, Passive (Present/Past), Conditionals 0–2, Reported Speech (базово). Диагностика: мини-тест + устный монолог «About me and my plans» (OGЭ-фокус)."
      },
      {
        number: 2,
        title: "Teen life & choices",
        topic: "Подростковая жизнь, выборы и ответственность",
        aspects: "Лексика: responsibility, independence, priorities, pressure, goals, achievements, failure. Структуры: I have to…, I managed to…, I failed to…. Навык: монолог/дискуссия о выборе и жизненных целях."
      },
      {
        number: 3,
        title: "Education & exams",
        topic: "Школа, экзамены, образовательные траектории",
        aspects: "Лексика: final exams, OGE, revision, pressure, stress, vocational school, college, university. Структуры: I'm going to take…, I'm planning to…, I'm worried about…. Навык: обсуждение экзаменов, планов после 9 класса."
      },
      {
        number: 4,
        title: "Grammar system check",
        topic: "Систематизация времён",
        aspects: "Чёткая матрица времён: формы, значения, маркеры. Сравнение: Present Perfect vs Past Simple, Future forms (will / going to / Present Continuous). Навык: выбор времени по контексту, типовые экзаменационные задания."
      },
      {
        number: 5,
        title: "Present & Past Perfect Continuous",
        topic: "Совершенный длительный",
        aspects: "Формы: have/has been doing, had been doing. Значение: длительность до момента в настоящем/прошлом. Структуры: I've been studying for two hours. She had been waiting before he came. Навык: распознавание и базовое использование в контексте."
      },
      {
        number: 6,
        title: "Advanced modals",
        topic: "Модальные глаголы и модальный перфект",
        aspects: "Повтор: must, have to, should, may, might, could + конструкции: should have done, could have done, must have done, can't have done. Навык: выражение предположений о прошлом, сожаления и «упущенных возможностей»."
      },
      {
        number: 7,
        title: "Conditionals 0–3",
        topic: "Система условных предложений",
        aspects: "Повтор 0–2, ввод/отработка 3-го типа: If I had known, I would have…. Обсуждение типичных ошибок. Навык: выбор правильного типа условия, трансформация предложений, экзаменационный формат."
      },
      {
        number: 8,
        title: "Mixed conditionals",
        topic: "Смешанные условные",
        aspects: "Модели: If I had studied harder, I would be more confident now и др. Навык: понимание связки «прошлое–настоящее/настоящее–будущее», базовое использование 2–3 шаблонов в письменной речи."
      },
      {
        number: 9,
        title: "Passive voice: full block",
        topic: "Пассив во всех основных временах",
        aspects: "Формы: Present/Past/Future Simple Passive, Present Perfect Passive, модальные + Passive (can be done, must be done). Темы: наука, техника, СМИ (was invented, is produced). Навык: преобразование Active → Passive и работа с текстами."
      },
      {
        number: 10,
        title: "Reported speech: tenses & pronouns",
        topic: "Косвенная речь: время, местоимения",
        aspects: "Тщательный отработанный backshift: He said, 'I will go' → He said he would go. Сдвиг местоимений и обстоятельств (here/there, now/then, today/that day). Навык: преобразование диалога в связный косвенный пересказ."
      },
      {
        number: 11,
        title: "Reported speech: questions & requests",
        topic: "Косвенная речь: вопросы/приказы/советы",
        aspects: "Структуры: He asked me if…, She asked where…, He told me to…, She warned me not to…. Навык: отработка типичных экзаменационных форматов, пересказ «диалог → связный текст»."
      },
      {
        number: 12,
        title: "Verb patterns & complex object",
        topic: "Герундий, инфинитив, сложное дополнение",
        aspects: "Модели: want/expect/ask sb to do, let/make sb do, like/hate doing, stop doing/to do, remember/forget doing/to do. Навык: выбор правильной конструкции, типичные задачи «преобразуй предложение»."
      },
      {
        number: 13,
        title: "Relative & participle clauses",
        topic: "Относительные и причастные конструкции",
        aspects: "Повтор relative clauses (who/which/where/whose) + причастные обороты: The boy standing near the door…, Built in 1990, the… Навык: уплотнение текста, понимание при чтении, 1–2 шаблонных конструкции в письме."
      },
      {
        number: 14,
        title: "Linking & cohesion",
        topic: "Связки и логическая связность текста",
        aspects: "Лексика: firstly, moreover, however, on the one hand…, on the other hand…, therefore, as a result, in conclusion. Навык: перестройка «рубленого» текста в связный, подготовка к письменным заданиям (эссе, письмо)."
      },
      {
        number: 15,
        title: "Mass media & communication",
        topic: "СМИ и коммуникации",
        aspects: "Лексика: mass media, influence, advertisement, target audience, social networks, privacy, addiction. Грамматика: модальные (должен/не должен), Conditionals 1–2 для прогнозов/гипотез. Навык: обсуждение роли СМИ, плюсы/минусы соцсетей."
      },
      {
        number: 16,
        title: "Technology & digital world",
        topic: "Технологии и цифровая среда",
        aspects: "Лексика: device, gadget, artificial intelligence, data, privacy, cybersecurity, online identity. Грамматика: Future (прогнозы), модальные (may/might). Навык: выстраивание прогнозов о будущем технологий, дискуссия «for/against»."
      },
      {
        number: 17,
        title: "Environment & global challenges",
        topic: "Экология, климат, глобальные проблемы",
        aspects: "Лексика: climate change, global warming, pollution, recycling, renewable energy, extinction, sustainable. Грамматика: Passive, модальные (must/should), Conditionals. Навык: обсуждение проблем и решений, мини-проект «Green school»."
      },
      {
        number: 18,
        title: "Society & social problems",
        topic: "Социальные темы (аккуратно)",
        aspects: "Лексика: poverty, unemployment, bullying, discrimination, equality, human rights. Регистры: корректные формулировки мнения (In my view…, I strongly believe…). Навык: аккуратное обсуждение чувствительных вопросов в нейтральном тоне."
      },
      {
        number: 19,
        title: "Health, lifestyle & stress",
        topic: "Здоровье, привычки, стресс",
        aspects: "Лексика: balanced diet, harmful habits, addiction, stress, relaxation, coping strategies. Грамматика: should/shouldn't, too/enough, модальный перфект (You should have…). Навык: советы, монолог «Healthy lifestyle of a teenager»."
      },
      {
        number: 20,
        title: "Culture, countries & traditions",
        topic: "Страноведение: Россия и англоязычные страны",
        aspects: "Лексика: heritage, landmark, custom, tradition, symbol, national identity. Темы: Россия / Великобритания / США / другие англоязычные страны. Навык: монолог по плану (OGЭ-ориентированный) о стране/городе/празднике."
      },
      {
        number: 21,
        title: "Work, jobs & future career",
        topic: "Профессии и карьера",
        aspects: "Лексика: qualification, skills, responsibilities, promotion, salary, opportunity, career path. Грамматика: Future forms, Conditionals 2–3 (If I became…, If I had chosen…). Навык: монолог «My future profession», аргументация выбора."
      },
      {
        number: 22,
        title: "Travel & tourism",
        topic: "Путешествия, туризм, межкультурное общение",
        aspects: "Лексика: destination, sightseeing, package tour, independent travel, accommodation, local customs. Грамматика: Present Perfect (опыт), Past Simple (конкретная поездка). Навык: устный рассказ о поездке, обсуждение плюсов/минусов видов отдыха."
      },
      {
        number: 23,
        title: "Reading: exam format",
        topic: "Чтение в формате ОГЭ",
        aspects: "Тексты разных типов: объявления, письма, статьи. Навык: задания на соответствие, множественный выбор, извлечение главной мысли, работа с временем и деталями текста."
      },
      {
        number: 24,
        title: "Use of English",
        topic: "Лексико-грамматические задания (ОГЭ)",
        aspects: "Типы: словообразование, грамматика в контексте, выбор формы. Фокус: временные формы, модальные, Passive, Conditionals, linking words. Навык: стратегия выполнения, типичные ловушки."
      },
      {
        number: 25,
        title: "Writing: личное письмо (OGЭ)",
        topic: "Письмо в формате экзамена",
        aspects: "Структура: адресат, благодарность за письмо, ответы на вопросы, вопросы адресату, завершающая фраза. Фразовые клише: Thanks for your letter…, I'm sorry I haven't written…, Write back soon. Навык: письмо 100–120 слов по формату."
      },
      {
        number: 26,
        title: "Writing: краткое высказывание с элементами рассуждения",
        topic: "Opinion/for–against (OGЭ-ориентир)",
        aspects: "Структура: введение (переформулировка темы), 2–3 аргумента, вывод. Связки: firstly, secondly, on the one hand…, however, in my opinion, to sum up. Навык: текст 120–140 слов, чёткая логика и абзацы."
      },
      {
        number: 27,
        title: "Writing: narrative / story",
        topic: "История в прошедших временах",
        aspects: "Структура: начало – развитие – кульминация – финал. Грамматика: Past Simple/Continuous/Perfect, связки: suddenly, a few minutes later, in the end. Навык: история по картинкам/заданному началу, контроль длины и структуры."
      },
      {
        number: 28,
        title: "Speaking: монолог по плану",
        topic: "Тренировка монологов (OGЭ-блок)",
        aspects: "Типовые планы: «My school», «My future profession», «Healthy lifestyle», «The Internet in our life», «Environment». Навык: 10–15 фраз (2–3 минуты речи), использование связок и примеров."
      },
      {
        number: 29,
        title: "Speaking: диалог-расспрос и диалог-обмен мнениями",
        topic: "Диалоги в экзаменационном формате",
        aspects: "Сценарии: расспрос по картинке/ситуации, диалог-мнение (agree/disagree). Шаблоны: Could you tell me…, What do you think about…?, I totally agree / I don't really agree. Навык: устойчивые реплики, скорость реакции."
      },
      {
        number: 30,
        title: "Integrated skills 1",
        topic: "Комплекс: чтение + говорение + письмо",
        aspects: "Модуль: прочитать текст → обсудить устно → написать короткое высказывание по теме. Навык: переход от текста к своей речи/письму (умение опираться на прочитанное)."
      },
      {
        number: 31,
        title: "Big revision & exam practice",
        topic: "Итоговое повторение в формате ОГЭ",
        aspects: "Прогон ключевых типов заданий: чтение, лексико-грамматический блок, письмо, устная часть (монолог + диалоги). Навык: работа по времени, минимизация типичных ошибок."
      },
      {
        number: 32,
        title: "My English portfolio 9",
        topic: "Итоговый проект перед старшей школой",
        aspects: "Портфолио/презентация: «My life, my choices, my plans» – блоки о себе, школе, экзаменах, профессии, обществе, мире. Устная защита + рефлексия: чего достиг по английскому, какие планы дальше."
      }
    ]
  },
  {
    grade: 10,
    title: "Английский язык, 10 класс",
    description: "Продвинутый курс английского языка для десятиклассников с углубленным изучением грамматических конструкций, развитием академических навыков и подготовкой к ЕГЭ по английскому языку.",
    lessons: [
      {
        number: 1,
        title: "Back to English 10",
        topic: "Повтор 8–9 классов, диагностика",
        aspects: "Повтор: система времён (Present/Past/Future Simple/Continuous/Perfect/Perfect Continuous), модальные, Conditionals 0–3, Passive (основные времена), Reported Speech, Relative Clauses. Диагностический тест + монолог «My life now and my plans for the future»."
      },
      {
        number: 2,
        title: "Young adults",
        topic: "Подросток → молодой взрослый",
        aspects: "Лексика: adulthood, responsibility, independence, identity, challenge, opportunity, risk. Структуры: I am expected to…, I'm responsible for…, I face the problem of…. Навык: монолог/мини-эссе о переходе к взрослой жизни."
      },
      {
        number: 3,
        title: "Education & future paths",
        topic: "Образование, траектории после школы",
        aspects: "Лексика: higher education, vocational training, gap year, major, degree, entrance exams. Структуры: I'm planning to apply for…, I'd like to study…, Pros and cons of…. Навык: обсуждение вариантов после школы, аргументация выбора."
      },
      {
        number: 4,
        title: "Grammar system 1",
        topic: "Present & Past: систематизация",
        aspects: "Матрица: Present/Past Simple–Continuous–Perfect–Perfect Continuous. Сравнение по значению и маркерам. Навык: выбор времени по контексту, сложные трансформации, «подготовка к ЕГЭ»-формату."
      },
      {
        number: 5,
        title: "Grammar system 2",
        topic: "Future: все формы будущего",
        aspects: "Will, be going to, Present Continuous с future meaning, Future Perfect / Future Continuous (вводно). Навык: выбор формы по коммуникативной задаче: план, расписание, прогноз, дедлайн, длительное действие в будущем."
      },
      {
        number: 6,
        title: "Advanced modals",
        topic: "Модальные + модальный перфект",
        aspects: "Повтор: must, have to, should, may, might, could, needn't + конструкции: must have done, can't have done, should/ought to have done, could have done. Навык: предположения о прошлом, сожаления, «упущенные возможности»."
      },
      {
        number: 7,
        title: "Conditionals 0–3",
        topic: "Система условных предложений",
        aspects: "Чёткое разведение типов 0, 1, 2, 3 по форме и значению. Навык: трансформация, выбор типа по контексту, типовые экзаменационные задания (преобразование предложения)."
      },
      {
        number: 8,
        title: "Mixed conditionals",
        topic: "Смешанные условные",
        aspects: "Модели: If I had studied harder, I would be…; If I were more confident, I would have…. Навык: понимание логики «прошлое → настоящее / настоящее → прошлое», использование нескольких устойчивых схем в письме/говорении."
      },
      {
        number: 9,
        title: "Passive voice: full pack",
        topic: "Пассив во всех ключевых временах",
        aspects: "Present/Past/Future Simple, Present/Past Perfect, модальные + Passive. Типовые конструкции: is said to…, is believed to…. Навык: трансформация Active/Passive, работа с текстами (наука, новости, экономика)."
      },
      {
        number: 10,
        title: "Reported speech: system",
        topic: "Косвенная речь – полная система",
        aspects: "Повтор backshift по временам, местоимениям, обстоятельствам времени/места. Утверждения, вопросы, просьбы/приказы, советы. Навык: превращение диалогов в связный косвенный пересказ (формат «по тексту»)."
      },
      {
        number: 11,
        title: "Verb patterns & complex object",
        topic: "Герундий/инфинитив и сложное дополнение",
        aspects: "Модели: like/enjoy doing; avoid/keep doing; want/expect/ask sb to do; make/let sb do; suggest doing; decide to do; remember/forget doing/to do; stop doing/to do. Навык: выбор схемы по глаголу, типовое «Use of English»-задание."
      },
      {
        number: 12,
        title: "Complex subject & Causative",
        topic: "Сложное подлежащее, «заставить/сделать»",
        aspects: "Модели: He is said to…, She is believed to…, I had my car repaired. Навык: понимание в тексте, базовое использование в письменной речи (1–2 шаблона)."
      },
      {
        number: 13,
        title: "Relative & participle clauses 2.0",
        topic: "Относительные и причастные конструкции",
        aspects: "Повтор: defining / non-defining clauses (who, which, where, whose) + Participle Clauses: Walking down the street, I…; Built in 1990, the…. Навык: уплотнение текста, преобразование простых предложений в сложные."
      },
      {
        number: 14,
        title: "Linking & academic style",
        topic: "Связки, академический регистр",
        aspects: "Лексика-связки: furthermore, moreover, in addition, however, nevertheless, whereas, therefore, as a result, in contrast. Навык: переработка «разбитого» текста в логичное эссе, подготовка к аргументативному письму."
      },
      {
        number: 15,
        title: "Society & social change",
        topic: "Общество, изменения, тренды",
        aspects: "Лексика: social change, trend, inequality, migration, urbanisation, democracy, civic engagement. Грамматика: Conditionals, модальные must/should/might. Навык: обсуждение социальных трендов, аргументация позиции."
      },
      {
        number: 16,
        title: "Media, propaganda & fake news",
        topic: "СМИ, манипуляция, фейки",
        aspects: "Лексика: propaganda, bias, agenda, fake news, misinformation, fact-checking, reliable source. Грамматика: Passive, Reported speech. Навык: разбор новостей, различение факт/мнение, формулировка критической позиции."
      },
      {
        number: 17,
        title: "Technology & ethics",
        topic: "Технологии, этика, ИИ",
        aspects: "Лексика: artificial intelligence, algorithm, data privacy, surveillance, ethics, automation. Грамматика: Future, Conditionals 2–3, модальные (may/might, should). Навык: дискуссии «плюсы/риски», прогнозы и гипотетические сценарии."
      },
      {
        number: 18,
        title: "Global problems & sustainability",
        topic: "Глобальные вызовы, устойчивое развитие",
        aspects: "Лексика: sustainability, renewable energy, carbon footprint, overconsumption, biodiversity, sustainable lifestyle. Навык: формулировка проблем/решений, мини-проект «Sustainable school / city»."
      },
      {
        number: 19,
        title: "Culture, identity & globalization",
        topic: "Культура, идентичность, глобализация",
        aspects: "Лексика: cultural identity, globalisation, local traditions, stereotypes, cultural exchange, diversity. Навык: сравнение культур, обсуждение влияния глобализации, монолог «My culture in a global world»."
      },
      {
        number: 20,
        title: "Work, careers & skills",
        topic: "Карьера, рынок труда, навыки",
        aspects: "Лексика: soft skills, hard skills, employability, internship, freelance, remote work, labour market. Грамматика: Future (career plans), Conditionals 2 (гипотетическая карьера). Навык: «career profile», аргументация выбора профессии/траектории."
      },
      {
        number: 21,
        title: "Reading: advanced narrative",
        topic: "Чтение художественного текста повышенной сложности",
        aspects: "Текст с разными временами, диалогом, описаниями. Навык: анализ персонажей/мотивации, определение точки зрения рассказчика, пересказ + собственная оценка."
      },
      {
        number: 22,
        title: "Reading: opinion & analysis",
        topic: "Чтение статей, колонок, эссе",
        aspects: "Тексты: колонки, мнения, аналитика (общество, технологии, образование). Навык: выделение тезиса автора, аргументов «за/против», подготовка контраргументов, краткий summary."
      },
      {
        number: 23,
        title: "Writing: informal communication",
        topic: "Неформальные письма и сообщения (B1+→B2)",
        aspects: "Повтор: email/message другу, приглашение, благодарность, извинение. Акцент на естественные фразы, регистр, клише. Навык: 140–160 слов, чёткая структура и «живой» язык."
      },
      {
        number: 24,
        title: "Writing: formal email/letter",
        topic: "Формальное письмо/электронное письмо",
        aspects: "Структура: обращение, цель, детали, просьба/предложение, завершение. Лексика: I am writing to enquire…, I would be grateful if…, I look forward to…. Навык: письмо-запрос, письмо-жалоба, письмо-заявка."
      },
      {
        number: 25,
        title: "Writing: opinion essay (ЕГЭ-формат, базовый)",
        topic: "Эссе-мнение",
        aspects: "Структура: вступление (переформулировка темы), позиция автора, аргументы, контраргумент/альтернативная точка зрения, вывод. Связки: firstly, moreover, however, on the one hand…, in conclusion. Навык: 180–200 слов, логика и абзацная структура."
      },
      {
        number: 26,
        title: "Writing: for-and-against / problem-solution",
        topic: "Эссе «за и против» / решение проблемы",
        aspects: "Модели: for-and-against essay, problem-solution essay. Связки: on the other hand, another advantage is…, the main problem is…, one possible solution is…. Навык: написание 2 типов эссе в учебном формате."
      },
      {
        number: 27,
        title: "Writing: summary & response",
        topic: "Краткий пересказ + комментарий",
        aspects: "Навык: выделение ключевой информации из текста (summary 60–80 слов) и краткий response/мнение по заданному вопросу. Подготовка к формату «прочитай → прокомментируй»."
      },
      {
        number: 28,
        title: "Speaking: extended monologue",
        topic: "Развёрнутый монолог (B1+/B2)",
        aspects: "Тренировка 3–4-минутных монологов по плану: образование, карьера, технологии, медиа, культура, глобальные проблемы. Акцент: структура, связки, примеры, аргументация."
      },
      {
        number: 29,
        title: "Speaking: discussion & debate",
        topic: "Обсуждение и мини-дебаты",
        aspects: "Форматы: парные/групповые дискуссии, «мини-дебаты» за/против идеи. Фразы: I'd like to point out…, I see your point, but…, I partly agree…. Навык: вежливое несогласие, удержание дискуссии на английском."
      },
      {
        number: 30,
        title: "Exam skills 1",
        topic: "Чтение + Use of English (ориентация на ЕГЭ)",
        aspects: "Тренировка: чтение с выбором ответа, установление соответствия, заполнение пропусков; лексико-грамматический блок (словообразование, грамматика, лексика в контексте). Навык: стратегия выполнения, тайм-менеджмент."
      },
      {
        number: 31,
        title: "Exam skills 2",
        topic: "Письмо + говорение (ЕГЭ-ориентир)",
        aspects: "Практика: письма (formal/informal), эссе-мнение, монологи по плану, ответы на вопросы. Навык: доведение навыков до стабильного B1+/подход к B2, отработка типичных шаблонов."
      },
      {
        number: 32,
        title: "My English portfolio 10",
        topic: "Итоговый проект года",
        aspects: "Портфолио/презентация: «Me, my education, my future» – блоки: кто я, чему научился, как вижу образование/карьеру/мир, где и зачем мне английский. Устная защита + рефлексия по итогам 10 класса."
      }
    ]
  },
  {
    grade: 11,
    title: "Английский язык, 11 класс",
    description: "Интенсивный подготовительный курс английского языка для одиннадцатиклассников с фокусом на ЕГЭ по английскому языку, развитие академических навыков и подготовку к высшему образованию.",
    lessons: [
      {
        number: 1,
        title: "Back to English 11",
        topic: "Повтор, диагностика, формат экзамена",
        aspects: "Повтор ключевой грамматики (все времена, модальные, Conditionals, Passive, Reported Speech, Perfect, герундий/инфинитив). Обзор формата итогового экзамена (чтение, Use of English, письмо, говорение). Диагностический мини-тест + монолог «About me, my school and my plans»."
      },
      {
        number: 2,
        title: "Goals, values & priorities",
        topic: "Цели, ценности, жизненные приоритеты",
        aspects: "Лексика: priorities, ambitions, achievements, failure, responsibility, compromise, decision. Структуры: I aim to…, My priority is…, I find it important to…. Навык: монолог/мини-эссе о жизненных целях и ценностях."
      },
      {
        number: 3,
        title: "Education & lifelong learning",
        topic: "Образование и обучение в течение жизни",
        aspects: "Лексика: lifelong learning, university, vocational training, scholarship, tuition fees, self-education, online courses. Структуры: It is essential to…, One advantage of… is…. Навык: обсуждение плюсов/минусов разных образовательных траекторий."
      },
      {
        number: 4,
        title: "Grammar system: tenses & aspect",
        topic: "Времена и виды, систематизация",
        aspects: "Матрица времён: все группы Present/Past/Future Simple–Continuous–Perfect–Perfect Continuous. Маркеры, значения, типичные ошибки. Навык: выбор времени по контексту, трансформация предложений в экзаменационном формате."
      },
      {
        number: 5,
        title: "Grammar system: modals & conditionals",
        topic: "Модальные и условные",
        aspects: "Повтор/углубление: must, have to, should, may, might, could, needn't, ought to + модальный перфект (should have done, must have done, can't have done). Conditionals 0–3 + базовые mixed conditionals. Навык: отработка «тонких» смыслов и типичных паттернов для письма/говорения."
      },
      {
        number: 6,
        title: "Grammar system: Passive, causative, complex object",
        topic: "Пассив, каузатив, сложные конструкции",
        aspects: "Пассив во всех ключевых временах + модальные + обороты is said to…, is believed to…. Causative: have/get sth done. Complex object: want/expect/ask sb to do, make/let sb do. Навык: понимание и использование в текстах и заданиях Use of English."
      },
      {
        number: 7,
        title: "Style & register",
        topic: "Стиль: формальный / нейтральный / неформальный",
        aspects: "Лексика и клише для разных регистров. Сравнение: разговорные фразы vs академические/официальные. Навык: подбор лексики под задачу (эссе, письмо, e-mail, диалог)."
      },
      {
        number: 8,
        title: "Society, democracy & civic engagement",
        topic: "Общество, гражданская позиция",
        aspects: "Лексика: democracy, citizen, participation, volunteering, charity, rights, responsibilities. Грамматика: модальные (must/should), Conditionals. Навык: аргументированное высказывание о роли гражданской активности молодёжи."
      },
      {
        number: 9,
        title: "Media, information & digital footprint",
        topic: "СМИ, информация, цифровой след",
        aspects: "Лексика: digital footprint, privacy, misinformation, fake news, bias, agenda, reliable source. Грамматика: Passive, Reported Speech. Навык: обсуждение медиаграмотности, умение формулировать критическую позицию."
      },
      {
        number: 10,
        title: "Globalisation & culture",
        topic: "Глобализация, культура, идентичность",
        aspects: "Лексика: globalisation, cultural identity, stereotypes, integration, multicultural society. Навык: сравнение «локальное vs глобальное», монолог/эссе о влиянии глобализации на культуру и молодёжь."
      },
      {
        number: 11,
        title: "Science, technology & ethics",
        topic: "Наука, технологии, этика",
        aspects: "Лексика: innovation, artificial intelligence, automation, ethics, privacy, surveillance. Грамматика: Future forms, Conditionals 2–3, модальные (may/might, should). Навык: дискуссии о плюсах/рисках технологий, прогнозы, гипотетические сценарии."
      },
      {
        number: 12,
        title: "Environment & climate policy",
        topic: "Экология и климатическая политика",
        aspects: "Лексика: climate change, emission, renewable energy, sustainability, carbon footprint, policy, regulation. Грамматика: Passive, модальные must/should, Conditionals. Навык: формулировка проблем и путей решения, мини-проект «Green policy for our city/school»."
      },
      {
        number: 13,
        title: "Work, business & entrepreneurship",
        topic: "Работа, бизнес, предпринимательство",
        aspects: "Лексика: entrepreneur, start-up, investment, risk, profit, failure, employability, soft skills. Грамматика: Future (career plans), Conditionals 2–3. Навык: обсуждение карьерных стратегий, монолог «My ideal job / my own business»."
      },
      {
        number: 14,
        title: "Health, lifestyle & mental wellbeing",
        topic: "Здоровье, образ жизни, психическое благополучие",
        aspects: "Лексика: wellbeing, burnout, coping strategies, resilience, habit, addiction. Грамматика: should/shouldn't, модальный перфект (You should have…), конструкция too/enough. Навык: советы по управлению стрессом (экзамены, выбор будущего), связный монолог."
      },
      {
        number: 15,
        title: "Reading: global skills",
        topic: "Чтение: стратегии и типы текстов",
        aspects: "Форматы: статьи, репортажи, колонки, эссе, объявления. Навык: skimming, scanning, поиск деталей и главной идеи, работа с абзацами (matching headings), типовые экзаменационные задания."
      },
      {
        number: 16,
        title: "Use of English: word formation",
        topic: "Лексико-грамматический блок: словообразование",
        aspects: "Типы: noun/verb/adjective/adverb, приставки/суффиксы, отрицательные формы, абстрактные существительные. Навык: преобразование слов по контексту, отработка типовых ошибок."
      },
      {
        number: 17,
        title: "Use of English: grammar & transformations",
        topic: "Грамматика в контексте",
        aspects: "Задания на времена, модальные, Passive, Conditionals, Reported Speech, герундий/инфинитив, complex object/subject. Навык: быстрый выбор нужной формы, работа с «ловушками» в тестах."
      },
      {
        number: 18,
        title: "Writing: informal & semi-formal email",
        topic: "Неформальное и полуформальное общение",
        aspects: "Структура письма/e-mail: greeting, opening, main body, closing. Клишé: Thanks for your message…, I'm writing to…, Best wishes / Kind regards. Навык: письмо другу / организации (запрос информации, приглашение, благодарность) на 140–160 слов."
      },
      {
        number: 19,
        title: "Writing: opinion essay (экзаменационный формат)",
        topic: "Эссе-мнение",
        aspects: "Структура: введение (переформулировка темы), позиция, 2–3 аргумента, контраргумент/альтернативная точка зрения, вывод. Связки: I strongly believe…, on the one hand…, moreover, however, in conclusion. Навык: эссе 180–200 слов, логика и связность."
      },
      {
        number: 20,
        title: "Writing: for-and-against / problem-solution",
        topic: "Эссе «за и против» / решение проблемы",
        aspects: "Модели: for-and-against, problem-solution. Связки: on the other hand, another advantage is…, the main problem is…, one possible solution is…. Навык: написание разных типов аргументативных текстов под экзамен."
      },
      {
        number: 21,
        title: "Writing: summary & response",
        topic: "Сжатое изложение + комментарий",
        aspects: "Навык: выделять ключевую информацию из текста, писать краткое summary (60–80 слов), затем короткий комментарий/мнение по заданному вопросу. Отработка типового формата «прочитай → перескажи/прокомментируй»."
      },
      {
        number: 22,
        title: "Argumentation & counter-arguments",
        topic: "Аргументация и опровержение",
        aspects: "Лексика: firstly, furthermore, in addition, however, nevertheless, on the contrary, to sum up. Навык: строить аргументы, приводить примеры, формулировать контраргументы; подготовка к эссе и устной части."
      },
      {
        number: 23,
        title: "Speaking: monologue by plan",
        topic: "Монолог по плану (экзаменационный)",
        aspects: "Тренировка 3–4-минутных монологов по плану: образование, профессия, технологии, медиа, экология, общество. Акцент: структура (вступление–основная часть–вывод), связки, примеры, чёткая логика."
      },
      {
        number: 24,
        title: "Speaking: comparing & discussing",
        topic: "Сравнение и обсуждение (фотографии/ситуации)",
        aspects: "Навык: описание и сравнение двух картинок/ситуаций; фразы: Both pictures show…, In the first picture…, unlike the second one…. Переход к выражению мнения и личного опыта."
      },
      {
        number: 25,
        title: "Speaking: interaction & debate",
        topic: "Диалог, обсуждение, мини-дебаты",
        aspects: "Сценарии: планирование мероприятия, спор о пользе/вреде, обсуждение проблемы и вариантов решения. Фразы: I see your point, but…, I totally/partly agree…, What if we…. Навык: держать диалог, задавать вопросы, реагировать на партнёра."
      },
      {
        number: 26,
        title: "Integrated exam training 1",
        topic: "Комплекс: чтение + Use of English + письмо",
        aspects: "Мини-моделирование экзамена: блок чтения, лексико-грамматический блок, одно письменное задание (эссе или письмо). Навык: работа по времени, контроль качества при полном цикле."
      },
      {
        number: 27,
        title: "Integrated exam training 2",
        topic: "Комплекс: Use of English + говорение",
        aspects: "Тренировка: задания Use of English + устная часть (монолог по плану и диалог). Навык: переключение между видами деятельности, стабильная структура ответов."
      },
      {
        number: 28,
        title: "Topic pack: «The modern world»",
        topic: "Обобщение тематических блоков",
        aspects: "Интеграция тем: технологии, глобализация, медиа, экология, общество, работа. Навык: быстрый сбор аргументов по любой типовой теме, подготовка к «любой формулировке» в экзаменационном задании."
      },
      {
        number: 29,
        title: "Big revision: grammar",
        topic: "Большое грамматическое повторение",
        aspects: "Целенаправленный контроль: времена, модальные, Conditionals, Passive, Reported Speech, герундий/инфинитив, complex object/subject, словообразование. Формат максимально близок к экзаменационному."
      },
      {
        number: 30,
        title: "Big revision: vocabulary & functions",
        topic: "Лексика и речевые функции",
        aspects: "Повтор ключевых тематических блоков и речевых клише: выражение мнения, согласия/несогласия, совета, предположения, сожаления, сравнения. Навык: автоматизация клише для письменной и устной части."
      },
      {
        number: 31,
        title: "Full exam simulation",
        topic: "Полная пробная работа",
        aspects: "Полноценный прогон: чтение, Use of English, письмо, устная часть (при возможности) в одном цикле. Навык: управление временем, работа со стрессом, разбор типичных ошибок."
      },
      {
        number: 32,
        title: "My English portfolio 11",
        topic: "Итоговый проект и рефлексия",
        aspects: "Портфолио/презентация: «English and my future» – блоки: кто я, чему научился, какие темы/навыки важнее всего, где буду использовать английский (учёба, работа, жизнь). Итоговая защита и рефлексия по результатам школы."
      }
    ]
  },
  {
    grade: 90,
    title: "Подготовка к ОГЭ по английскому языку",
    description: "Интенсивный курс подготовки к ОГЭ по английскому языку для девятиклассников с фокусом на экзаменационные задания, стратегии выполнения и систематизацией материала.",
    lessons: [
      {
        number: 1,
        title: "Старт ОГЭ",
        topic: "Формат экзамена и диагностика",
        aspects: "Структура ОГЭ: разделы «Аудирование», «Чтение», «Грамматика и лексика», «Письмо», «Говорение». Типы заданий, шкала баллов. Диагностический мини-вариант: чтение + грамматика + короткое письмо + монолог. Фиксация сильных/слабых зон."
      },
      {
        number: 2,
        title: "Темы ОГЭ",
        topic: "Тематические блоки экзамена",
        aspects: "Темы: семья, школа, учеба, досуг, здоровье, спорт, путешествия, природа, профессия, технологии, книги/кино, страна изучаемого языка, родной город/страна. Составление «карты тем»: что уже знаю, что нужно добрать."
      },
      {
        number: 3,
        title: "Аудирование 1",
        topic: "Общая стратегия слушания",
        aspects: "Типы заданий по аудированию: выбор правильного ответа, соответствие, установление истинность/ложность. Отработка навыков: выделение ключевых слов, предугадывание содержания по инструкции/вариантам. Короткие тренировочные аудирования."
      },
      {
        number: 4,
        title: "Аудирование 2",
        topic: "Личные истории, диалоги",
        aspects: "Тренировка на материалах уровня ОГЭ: диалоги, объявления, интервью. Навыки: фиксировать главную мысль, не «залипать» на незнакомых словах, работать с опорами (вопросами/вариантами). Мини-анализ типичных ошибок."
      },
      {
        number: 5,
        title: "Чтение 1",
        topic: "Навыки skimming и scanning",
        aspects: "Типы заданий по чтению: выбор заголовка, соответствие, выбор ответа. Стратегии: быстрое чтение для общей идеи (skimming), поиск конкретной информации (scanning). Работа с простыми текстами ОГЭ-формата."
      },
      {
        number: 6,
        title: "Чтение 2",
        topic: "Личные письма, объявления, статьи",
        aspects: "Тренировка на реальных/приближенных текстах: письма подростков, короткие статьи, объявления. Навыки: выделять главную мысль абзаца, подбирать заголовки, искать детали для ответа на вопрос."
      },
      {
        number: 7,
        title: "Грамматика 1",
        topic: "Система времен (Present/Past/Future)",
        aspects: "Повтор форм: Present/Past/Future Simple, Continuous, Perfect (в рамках ОГЭ); значение, маркеры. Типовые задания на выбор формы глагола. Концентрация на типичных ошибках (3-е лицо, время по контексту и т.д.)."
      },
      {
        number: 8,
        title: "Грамматика 2",
        topic: "Модальные глаголы и конструкции",
        aspects: "Can, could, must, have to, should, may, might, needn't. Конструкции типа be going to. Формат заданий ОГЭ: подстановка правильной формы/глагола. Упражнения и мини-тесты."
      },
      {
        number: 9,
        title: "Грамматика 3",
        topic: "Степени сравнения прилагательных и наречий",
        aspects: "Образование сравнительной/превосходной степени, исключения (good, bad, far). Модели: as…as, not as…as. Типовые задания: подставь форму прилагательного. Закрепление на текстовых задачах."
      },
      {
        number: 10,
        title: "Грамматика 4",
        topic: "Пассива, герундий/инфинитив, сложные схемы",
        aspects: "Present/Past Simple Passive (is done, was done) на уровне ОГЭ, базовые паттерны герундия/инфинитива (like doing, want to do), сложное дополнение (want somebody to do). Практика через задания формата Use of English."
      },
      {
        number: 11,
        title: "Лексика 1",
        topic: "Семья, друзья, отношения",
        aspects: "Активный словарь: family, relatives, friendship, personality traits, conflicts, support. Типовые лексические задания: выбор слова по смыслу, словообразование (friend–friendly–friendship). Монолог/мини-письмо на тему семьи."
      },
      {
        number: 12,
        title: "Лексика 2",
        topic: "Школа, учеба, экзамены",
        aspects: "Словарь: school subjects, exams, marks, revision, stress, timetable, extra classes. Работа с текстами ОГЭ на тему школы. Монолог: «My school / My favourite subject / Exams». Лексико-грамматические задания."
      },
      {
        number: 13,
        title: "Лексика 3",
        topic: "Свободное время, хобби, спорт",
        aspects: "Словарь: hobbies, sports, clubs, leisure activities, advantages/benefits. Тренировка на текстах и заданиях: чтение + Use of English. Монолог: «Hobbies and free time of teenagers»."
      },
      {
        number: 14,
        title: "Лексика 4",
        topic: "Путешествия, туризм, страны",
        aspects: "Словарь: travel, journey, trip, sightseeing, accommodation, ticket, destination, abroad. Тексты в формате ОГЭ о путешествиях. Монологи о поездках / городах / странах, которые учащиеся знают."
      },
      {
        number: 15,
        title: "Лексика 5",
        topic: "Природа, окружающая среда",
        aspects: "Словарь: environment, pollution, recycling, climate, nature, protect, resource. Текст + задания по чтению. Монолог: «Environment problems in my region / how to help nature»."
      },
      {
        number: 16,
        title: "Лексика 6",
        topic: "Здоровье, образ жизни",
        aspects: "Словарь: healthy/unhealthy, diet, exercise, habits, stress, relax, harmful. Диалоги и тексты об образе жизни. Монолог: «Healthy lifestyle of a teenager». Подготовка к письму/монологу на эту тему."
      },
      {
        number: 17,
        title: "Лексика 7",
        topic: "Профессии, выбор будущего",
        aspects: "Словарь: job, profession, career, skills, salary, choose, prefer, plan, future career. Тексты ОГЭ о профессиях, монолог: «My future profession / plans after school». Лексико-грамматические задания."
      },
      {
        number: 18,
        title: "Лексика 8",
        topic: "Технологии, интернет, медиа",
        aspects: "Словарь: internet, social networks, device, online, information, media, communication. Тексты и задания по теме. Монолог: «The role of the Internet / modern technologies in our life»."
      },
      {
        number: 19,
        title: "Письмо 1",
        topic: "Формат личного письма (структура)",
        aspects: "Структура письма: адресат, обращение, благодарность за письмо, ответы на 3 вопроса, 3 своих вопроса, финальная фраза. Клишé: Thanks for your letter…, It was nice to hear from you…, Write back soon. Разбор примеров."
      },
      {
        number: 20,
        title: "Письмо 2",
        topic: "Отработка личного письма",
        aspects: "Письмо по реальному демо-заданию: разбор задания, план, написание черновика, само-/взаимопроверка по чек-листу (кол-во слов, структура, орфография, клише). Отработка тайминга."
      },
      {
        number: 21,
        title: "Письмо 3",
        topic: "Типичные ошибки и отработка",
        aspects: "Ошибки: структура (нет вопросов, нет благодарности), грамматика (времена, 3-е лицо, артикли), лексика (русизмы, разговорный сленг). Переписывание «плохих» писем в правильном формате. Мини-контрольная по письму."
      },
      {
        number: 22,
        title: "Говорение 1",
        topic: "Формат устной части ОГЭ, чтение вслух",
        aspects: "Структура устной части, требования по времени. Тренировка чтения текста вслух: ударение, интонация, паузы. Анализ типичных фонетических ошибок."
      },
      {
        number: 23,
        title: "Говорение 2",
        topic: "Условный диалог-расспрос",
        aspects: "Формат задания: вопросы по ситуации/картинке. Паттерны: Could you tell me…, What time…, How often…, Why…. Тренировка: быстро формулировать 5 вопросов по плану. Работа в парах."
      },
      {
        number: 24,
        title: "Говорение 3",
        topic: "Монолог по плану",
        aspects: "Структура монолога: 3–4 пункта плана, вступление/завершение, 10–12 фраз. Темы: «My school», «My favourite book/film», «My city», «My future plans», «Internet in our life». Тренировка с зачётом по таймеру."
      },
      {
        number: 25,
        title: "Говорение 4",
        topic: "Монолог + диалог: комплекс",
        aspects: "Комбинация: чтение → монолог по теме текста → мини-диалог по картинке/ситуации. Отработка «перехода» от текста к собственной речи. Имитация формата устного собеседования."
      },
      {
        number: 26,
        title: "Интеграция 1",
        topic: "Аудирование + чтение + лексика",
        aspects: "Малый «мини-вариант»: 1 блок аудирования, 1 блок чтения, небольшой блок Use of English. Разбор по типичным ошибкам. Фокус на стратегии: не тратить слишком много времени на одно задание."
      },
      {
        number: 27,
        title: "Интеграция 2",
        topic: "Чтение + грамматика/лексика + письмо",
        aspects: "Ещё один «мини-вариант»: чтение + Use of English + личное письмо. Работа по времени, разбора ошибок, доведение алгоритма выполнения до автоматизма."
      },
      {
        number: 28,
        title: "Интеграция 3",
        topic: "Полный письменный вариант (кроме устной части)",
        aspects: "Практически полный вариант ОГЭ: аудирование, чтение, Use of English, письмо. Тайминг максимально приближен к реальному. После — детальный разбор, индивидуальные «точки роста» каждому ученику."
      },
      {
        number: 29,
        title: "Целенаправленный дриблинг 1",
        topic: "Работа по слабым местам (по результатам вариантов)",
        aspects: "Урок под «дыры»: у кого-то грамматика, у кого-то чтение, у кого-то письмо. Гибкая работа: мини-группы по проблемным зонам (грамматика/лексика/письмо/монолог). Таргетированные упражнения."
      },
      {
        number: 30,
        title: "Целенаправленный дриблинг 2",
        topic: "Отработка устной части",
        aspects: "Марафон устной части: чтение вслух нескольких текстов, серия диалогов-расспросов, несколько монологов подряд. Работа над скоростью реакции, «автоматизацией» шаблонов и клише."
      },
      {
        number: 31,
        title: "Финальный прогон",
        topic: "Пробный ОГЭ под таймер",
        aspects: "Полный тренировочный экзамен: все разделы, включая устную часть, в один день/цикл. Моделирование реальной ситуации экзамена. Фиксация результата как «финальной контрольной точки»."
      },
      {
        number: 32,
        title: "Разбор и стратегия",
        topic: "Анализ пробного ОГЭ и финальные рекомендации",
        aspects: "Подробный разбор по разделам: что ещё можно улучшить, «памятка в день экзамена» (стратегия по времени, как реагировать на стресс, что делать, если не понимаешь текст/аудио). Рефлексия: что прокачали за год."
      }
    ]
  },
  {
    grade: 100,
    title: "Подготовка к ЕГЭ по английскому языку",
    description: "Интенсивный курс подготовки к ЕГЭ по английскому языку для одиннадцатиклассников с фокусом на экзаменационные задания, стратегии выполнения и достижение высокого балла.",
    lessons: [
      {
        number: 1,
        title: "Старт ЕГЭ",
        topic: "Формат экзамена и диагностика",
        aspects: "Структура ЕГЭ: аудирование, чтение, Use of English, письмо (эссе), говорение. Типы заданий, шкала баллов. Диагностический мини-вариант: короткий блок чтения, грамматика/лексика, мини-эссе по урезанному формату, устный монолог. Фиксация слабых зон."
      },
      {
        number: 2,
        title: "Карта ЕГЭ",
        topic: "Темы и навыки экзамена",
        aspects: "Тематические блоки: семья, образование, досуг, здоровье, спорт, путешествия, природа, технологии, профессия, медиа, страна/город. Матрица «тема → чтение/эссе/монолог». План-график подготовки на год."
      },
      {
        number: 3,
        title: "Чтение 1",
        topic: "Стратегии: skimming, scanning, detail",
        aspects: "Типы заданий ЕГЭ по чтению: matching (заголовки), multiple choice, true/false/not stated. Отработка стратегий быстрого чтения, работа с ключевыми словами, игнорирование второстепенной лексики."
      },
      {
        number: 4,
        title: "Чтение 2",
        topic: "Matching headings / statements",
        aspects: "Отработка заданий на сопоставление абзацев и заголовков/утверждений. Навык: определять тему абзаца, отличать главную мысль от деталей, избегать «ловушек» по словам-совпадениям."
      },
      {
        number: 5,
        title: "Чтение 3",
        topic: "Multiple choice и T/F/NS",
        aspects: "Работа с текстами формата ЕГЭ, разбор типичных ловушек: перефраз, скрытое отрицание, детали, не сказано. Стратегия: сначала вопросы, потом чтение, затем проверка по тексту."
      },
      {
        number: 6,
        title: "Аудирование 1",
        topic: "Общая стратегия слушания",
        aspects: "Типы заданий: выбор правильного ответа, соответствие, T/F. До- и послеслушательные задания, прогнозирование темы по инструкции/вариантам ответов, фиксация ключевых слов на слух."
      },
      {
        number: 7,
        title: "Аудирование 2",
        topic: "Диалоги и интервью",
        aspects: "Работа с диалогами и интервью уровня ЕГЭ. Навык: вычленять цель высказывания, отношение говорящего, ключевые факты; разбор типичных фонетических проблем (редукция, связки)."
      },
      {
        number: 8,
        title: "Аудирование 3",
        topic: "Монологи и объявления",
        aspects: "Монологи, объявления, сообщения. Навык: вытаскивать структурные маркеры (first, then, however), быстро находить ответы по ключевым словам, тренировка «двойного прослушивания» в экзаменационном режиме."
      },
      {
        number: 9,
        title: "Грамматика 1",
        topic: "Времена: Present / Past / Future",
        aspects: "Повтор форм и значений: Present/Past/Future Simple, Continuous, Perfect, Perfect Continuous. Фокус: разграничение по контексту, типовые ошибки (3-е лицо, согласование времён, выбор между Past Simple / Present Perfect и т.п.)."
      },
      {
        number: 10,
        title: "Грамматика 2",
        topic: "Модальные, условные, сослагательные",
        aspects: "Can/could, must/have to, should/ought to, may/might, needn't + Conditionals 0–3, базовые смешанные условные. Отработка в формате Use of English: трансформация и выбор формы."
      },
      {
        number: 11,
        title: "Грамматика 3",
        topic: "Passive, Reported Speech",
        aspects: "Пассив во всех ключевых временах (в пределах ЕГЭ) + модальные + конструкции is said to…. Косвенная речь: утверждения, вопросы, просьбы/приказы. Тренировка на преобразовании предложений."
      },
      {
        number: 12,
        title: "Грамматика 4",
        topic: "Герундий, инфинитив, verb patterns",
        aspects: "Паттерны: like/enjoy doing; avoid/keep doing; want/expect sb to do; make/let sb do; remember/forget/stop doing vs to do. Типовые задания на выбор формы глагола/трансформацию."
      },
      {
        number: 13,
        title: "Use of English 1",
        topic: "Словообразование (Word Formation)",
        aspects: "Суффиксы/приставки: образуют существительные, прилагательные, наречия, отрицательные формы. Формат задания ЕГЭ: преобразовать данное слово по контексту. Отработка «семейств слов» и типичных ошибок."
      },
      {
        number: 14,
        title: "Use of English 2",
        topic: "Грамматические трансформации",
        aspects: "Типовые модели: времена, модальные, пассив, условные, косвенная речь, герундий/инфинитив, complex object. Формат: переписать предложение, сохранив смысл, используя данное слово. Анализ «ловушек» и шаблонов."
      },
      {
        number: 15,
        title: "Use of English 3",
        topic: "Лексика, коллокации, фразовые глаголы",
        aspects: "Частотная лексика и устойчивые словосочетания для ЕГЭ, базовый набор phrasal verbs. Формат: выбор слова по контексту (multiple choice), open cloze. Работа с логикой текста и лексическими связками."
      },
      {
        number: 16,
        title: "Тематический словарь 1",
        topic: "«Человек, семья, отношения»",
        aspects: "Активизация лексики: family, personality traits, relationships, conflicts, support. Использование в чтении, Use of English, эссе и монологах. Мини-набор фраз под эссе/говорение по этой теме."
      },
      {
        number: 17,
        title: "Тематический словарь 2",
        topic: "«Образование, школа, профессия»",
        aspects: "Лексика: education system, exams, higher education, career, skills, job market. Формирование заготовок для эссе/монолога: плюсы/минусы экзаменов, онлайн-обучения, выбора профессии."
      },
      {
        number: 18,
        title: "Тематический словарь 3",
        topic: "«Здоровье, спорт, образ жизни»",
        aspects: "Лексика: healthy habits, harmful habits, addiction, exercise, stress, mental health. Формулы для аргументации в эссе и устных ответах: On the one hand…, However…, In my opinion…."
      },
      {
        number: 19,
        title: "Тематический словарь 4",
        topic: "«Технологии, интернет, медиа, экология»",
        aspects: "Лексика по блокам: технологии/интернет/медиа, окружающая среда/климат. Подготовка наборов аргументов «за/против» на ключевые экзаменационные темы (Internet, TV, global problems, environment)."
      },
      {
        number: 20,
        title: "Эссе 1",
        topic: "Структура opinion essay",
        aspects: "Формат ЕГЭ: введение (переформулировка темы), позиция, 2–3 аргумента, аргумент «другой точки зрения», опровержение, вывод. Чёткий шаблон структуры + набор стандартных связок и фраз. Разбор примеров с разным уровнем."
      },
      {
        number: 21,
        title: "Эссе 2",
        topic: "Аргументация и связки",
        aspects: "Формирование аргументов и примеров; связки: firstly, moreover, however, on the one hand, nevertheless, as a result, in conclusion. Написание одного эссе «по шагам» с коллективным разбором."
      },
      {
        number: 22,
        title: "Эссе 3",
        topic: "Отработка эссе под таймер",
        aspects: "Полноценное эссе по формату ЕГЭ: планирование → черновик → чистовик (180–200 слов). Отработка тайминга, чек-лист (структура, связки, лексика, грамматика, объём). Типичные ошибки и их исправление."
      },
      {
        number: 23,
        title: "Говорение 1",
        topic: "Формат устной части, чтение вслух",
        aspects: "Разбор структуры говорения (Task 1–4). Тренировка чтения текста вслух: интонация, логические паузы, ударение. Отработка нескольких текстов с записью и самоконтролем."
      },
      {
        number: 24,
        title: "Говорение 2",
        topic: "Описание фотографии (Task 2)",
        aspects: "Шаблон ответа: ввод, основные детали, личное отношение. Набор клише: In the picture I can see…, The photo shows…, I like this photo because…. Тренировка по разным темам, работа над временем/объёмом."
      },
      {
        number: 25,
        title: "Говорение 3",
        topic: "Сравнение двух фотографий (Task 3)",
        aspects: "Структура: краткое описание, сходства, различия, личное мнение/предпочтение. Клишé: Both pictures show…, In the first picture…, unlike the second one…, As for me, I'd prefer…. Отработка по набору типовых тем."
      },
      {
        number: 26,
        title: "Говорение 4",
        topic: "Монолог по плану (Task 4)",
        aspects: "План ответа, логика раскрытия пунктов, связки. Темы: образование, профессия, технологии, спорт, здоровье, экология, город/село, путешествия. Тренировка монологов по таймеру + обратная связь."
      },
      {
        number: 27,
        title: "Интеграция 1",
        topic: "Чтение + Use of English",
        aspects: "«Мини-вариант»: один полный блок чтения + один полный блок Use of English в формате ЕГЭ. Работа под таймер, последующий детальный разбор, фиксация типичных ошибок."
      },
      {
        number: 28,
        title: "Интеграция 2",
        topic: "Аудирование + Use of English",
        aspects: "Блок аудирования экзаменационного типа + лексико-грамматический блок. Отработка стратегий: как восстанавливаться после «проваленного» фрагмента, как распределять время в Use of English."
      },
      {
        number: 29,
        title: "Интеграция 3",
        topic: "Эссе + говорение",
        aspects: "На одном цикле: написание эссе по формату → устный монолог по этой же теме → обсуждение/мини-дебаты. Навык: перенос аргументации между письмом и устной частью."
      },
      {
        number: 30,
        title: "Полумарафон ЕГЭ 1",
        topic: "Письменная часть: тренировочный вариант",
        aspects: "Практически полный письменный вариант: чтение, Use of English, аудирование, эссе (без устной части). Жёсткий тайминг, проверка с разбором, индивидуальные рекомендации."
      },
      {
        number: 31,
        title: "Полумарафон ЕГЭ 2",
        topic: "Устная часть + «точечная работа»",
        aspects: "Марафон устной части: чтение текста, Task 2–4 по нескольким наборам картинок и планов. Параллельно — точечные мини-блоки по самым слабым местам (по результатам полумарафона 1)."
      },
      {
        number: 32,
        title: "Финальный прогон и стратегия",
        topic: "Итоговый «мини-ЕГЭ» и памятка",
        aspects: "Финальный комплекс: укороченный вариант письменной части + устная часть. Подробный разбор, индивидуальные «risk points». Памятка к экзамену: стратегия по времени, работа со стрессом, порядок действий по каждому разделу."
      }
    ]
  },
  {
    grade: 1,
    title: "Русский язык для 1 класса",
    description: "Базовый курс русского языка для первоклассников с акцентом на развитие грамотности, развитие речи и знакомство с основами русского языка.",
    lessons: [
      {
        number: 1,
        title: "Знакомство с уроками русского языка",
        topic: "Русский язык как школьный предмет",
        aspects: "Что будем делать на уроках; устная vs письменная речь; правила работы; тетрадь, аккуратность"
      },
      {
        number: 2,
        title: "Зачем людям речь",
        topic: "Устная и письменная речь",
        aspects: "Ситуации общения; кому и что говорим; диалог/монолог на примерах; вежливые слова"
      },
      {
        number: 3,
        title: "Слово и его значение",
        topic: "Слово как единица речи",
        aspects: "Слово что-то называет; предметы, действия, признаки; подбор слов к картинкам; \"лишнее\" слово"
      },
      {
        number: 4,
        title: "Звук и буква",
        topic: "Звуки речи и буквы",
        aspects: "Звук слышим, букву видим; выделение первого/последнего звука; связь звука и буквы"
      },
      {
        number: 5,
        title: "Гласные звуки",
        topic: "Гласные звуки и буквы",
        aspects: "\"Поются\" гласные; обозначение гласных фишками; гласный в начале/середине слова; ударный/безударный на слух"
      },
      {
        number: 6,
        title: "Согласные звуки",
        topic: "Согласные звуки и буквы",
        aspects: "Как произносятся; согласный рядом с гласным; подбор слов с заданным согласным; отличие от гласных"
      },
      {
        number: 7,
        title: "Твёрдые и мягкие согласные",
        topic: "Твёрдость/мягкость согласных",
        aspects: "Парные по твёрдости/мягкости; влияние соседних гласных (а/я, у/ю и т.д.); схемы, условные обозначения"
      },
      {
        number: 8,
        title: "Слог и ударение",
        topic: "Слог, деление на слоги",
        aspects: "Что такое слог; деление хлопками; 1–2–3 слога; ударный слог; сравнение слов по количеству слогов"
      },
      {
        number: 9,
        title: "Работает алфавит",
        topic: "Алфавит",
        aspects: "Порядок букв; поиск буквы; \"соседи\" по алфавиту; алфавитная лента, игры на закрепление"
      },
      {
        number: 10,
        title: "Буква в начале, середине и конце",
        topic: "Позиция звука/буквы в слове",
        aspects: "Нахождение звука в разных позициях; подбор слов на заданный звук; замена первого/последнего звука"
      },
      {
        number: 11,
        title: "Читаем слоги",
        topic: "Чтение слогов",
        aspects: "Соединение звуков в слоги; открытые слоги (ма, но, лу); первые закрытые (дом, кот); чтение по слогам"
      },
      {
        number: 12,
        title: "Строим слова из слогов",
        topic: "Слоговое чтение слов",
        aspects: "Составление слов из слогов; чтение дву- и трёхсложных слов; сопоставление \"слово–картинка\""
      },
      {
        number: 13,
        title: "Что такое предложение",
        topic: "Предложение",
        aspects: "Предложение – это то, что мы говорим целиком; границы предложения; пауза и интонация; считаем слова"
      },
      {
        number: 14,
        title: "Начало и конец предложения",
        topic: "Заглавная буква и точка",
        aspects: "Предложение начинается с большой буквы; в конце — точка; восстановление границ предложений в тексте"
      },
      {
        number: 15,
        title: "Вопросительные предложения",
        topic: "Вопросительное предложение",
        aspects: "Чем вопрос отличается от сообщения; интонация вопроса; вопросительный знак; составление вопросов по картинке"
      },
      {
        number: 16,
        title: "Текст: начало, середина, конец",
        topic: "Текст и его части",
        aspects: "Чем текст отличается от набора предложений; тема и заголовок; \"перемешанные\" предложения — восстановление порядка"
      },
      {
        number: 17,
        title: "Слова–предметы вокруг нас",
        topic: "Существительные (без термина)",
        aspects: "Слова, называющие предметы и живых существ; вопросы кто? что?; группировка слов–предметов"
      },
      {
        number: 18,
        title: "Слова–действия",
        topic: "Глаголы (без термина)",
        aspects: "Слова, называющие действия; вопросы что делает? что делают?; подбор действий к картинкам; противоположные действия"
      },
      {
        number: 19,
        title: "Признаки предметов",
        topic: "Слова–признаки",
        aspects: "Слова, обозначающие цвет, размер, форму; вопросы какой? какая? какое?; подбор признаков к предметам"
      },
      {
        number: 20,
        title: "Слово и его \"родственники\"",
        topic: "Однокоренные слова (интуитивно)",
        aspects: "\"Семьи\" слов вокруг одного корня (лес — лесник — лесной); общее значение; подбор групп \"родственников\""
      },
      {
        number: 21,
        title: "Пробел между словами",
        topic: "Раздельное написание слов",
        aspects: "Слова в предложении пишутся отдельно; поиск границ слов; расстановка пробелов в \"слитном\" тексте; счёт слов"
      },
      {
        number: 22,
        title: "Большая буква в именах",
        topic: "Имена людей",
        aspects: "Письмо имён с большой буквы; своё имя, имена одноклассников; различие \"мальчик\" и \"Саша\"; отработка написания"
      },
      {
        number: 23,
        title: "Большая буква в названиях",
        topic: "Имена собственные: города, улицы, клички",
        aspects: "Названия городов, улиц, клички животных с большой буквы; подбор картинка ↔ название; запись в тетрадь"
      },
      {
        number: 24,
        title: "Орфографическая зоркость",
        topic: "\"Опасные\" места в слове",
        aspects: "Повтор: слог и ударение; поиск \"опасных\" мест (безударные гласные — на слух); медленное проговаривание перед записью"
      },
      {
        number: 25,
        title: "Три вида предложений",
        topic: "Рассказ, вопрос, побуждение",
        aspects: "Интонация разных предложений; знакомство с точкой, вопросительным и восклицательным знаком (на уровне узнавания)"
      },
      {
        number: 26,
        title: "Превращаем предложения",
        topic: "Предложения по цели высказывания",
        aspects: "Преобразование: сообщение → вопрос → просьба/призыв; выбор нужного знака; устные и письменные тренировки"
      },
      {
        number: 27,
        title: "Предложение по схеме",
        topic: "Схемы предложений",
        aspects: "Обозначение слов кружками/черточками; чтение по схеме; составление предложений по схеме \"кто? что делает?\""
      },
      {
        number: 28,
        title: "Маленький текст по картинке",
        topic: "Составление связного текста",
        aspects: "План из 2–3 пунктов; заголовок; устное, затем письменное составление 2–3 предложений по серии картинок"
      },
      {
        number: 29,
        title: "Пишем слова под диктовку",
        topic: "Слуховой диктант (слова)",
        aspects: "Подготовка к диктанту: проговаривание, деление на слоги; запись знакомых слов; самопроверка по образцу"
      },
      {
        number: 30,
        title: "Пишем предложения под диктовку",
        topic: "Слуховой диктант (предложения)",
        aspects: "Запись простых предложений с отработанными орфограммами; проговаривание по слогам; проверка по схеме предложения"
      },
      {
        number: 31,
        title: "Учимся проверять себя",
        topic: "Самопроверка и работа над ошибками",
        aspects: "Как перечитывать написанное; поиск \"подозрительных\" мест; корректировка; формирование спокойного отношения к ошибкам"
      },
      {
        number: 32,
        title: "Итоговый урок по году",
        topic: "Обобщение знаний 1 класса",
        aspects: "Повтор: звук–буква–слог–слово–предложение–текст; виды предложений; большая буква; мини-квест/игра по ключевым темам"
      }
    ]
  },
  {
    grade: 2,
    title: "Русский язык для 2 класса",
    description: "Продвинутый курс русского языка для второклассников с углубленным изучением грамматики, орфографии и развития связной речи.",
    lessons: [
      {
        number: 1,
        title: "Повторяем азбуку и слог",
        topic: "Повтор 1 класса: буква, звук, слог",
        aspects: "Краткий аудит: звуки и буквы; деление на слоги; ударение; чтение по слогам, короткие слова и предложения"
      },
      {
        number: 2,
        title: "Слово, предложение, текст",
        topic: "Повтор базовых единиц речи",
        aspects: "Различие: слово–предложение–текст; подсчёт слов в предложении; выделение предложений в тексте; что делает текст \"целым\""
      },
      {
        number: 3,
        title: "Виды предложений",
        topic: "Предложения по цели высказывания",
        aspects: "Сообщение, вопрос, побуждение; интонация; знаки в конце; преобразование одного вида предложения в другой"
      },
      {
        number: 4,
        title: "Структура предложения",
        topic: "Главные слова в предложении",
        aspects: "Кто? что делает? — основа предложения (без термина); выделение \"главных\" слов; устное составление предложений по опоре"
      },
      {
        number: 5,
        title: "Слова–предметы",
        topic: "Имя существительное. Значение",
        aspects: "Существительное как название предмета, живого существа, явления; вопросы кто? что?; примеры, группировка по темам"
      },
      {
        number: 6,
        title: "Род имён существительных",
        topic: "Род существительных",
        aspects: "Мужской, женский, средний род; вопросы: он? она? оно?; подбор существительных по родам; частые трудные случаи"
      },
      {
        number: 7,
        title: "Число имён существительных",
        topic: "Единственное и множественное число",
        aspects: "Изменение по числу; смысловая разница стол — столы; образование множественного числа; подбор пар слов"
      },
      {
        number: 8,
        title: "Одушевлённые и неодушевлённые",
        topic: "Одушевлённость существительных",
        aspects: "Кто? / Что?; различие \"кот / стол\"; влияние на смысл; группировка слов по признаку одушевлённости"
      },
      {
        number: 9,
        title: "Имена собственные",
        topic: "Имена людей, клички, географические названия",
        aspects: "Письмо с большой буквы; различие нарицательное/собственное; примеры из жизни детей; работа со словарём имен"
      },
      {
        number: 10,
        title: "Слова–действия",
        topic: "Глагол. Значение",
        aspects: "Глагол как название действия; вопросы что делает? что делал? что будет делать?; связь с существительным в предложении"
      },
      {
        number: 11,
        title: "Время глагола",
        topic: "Прошедшее, настоящее, будущее время",
        aspects: "Смена времён: делаю – делал – буду делать; опора на линии времени; подбор глаголов на разные времена по картинке"
      },
      {
        number: 12,
        title: "Изменение глагола по временам",
        topic: "Согласование глагола с подлежащим",
        aspects: "Связь \"кто/что – что делает\"; изменение формы глагола в зависимости от числа; практические трансформационные упражнения"
      },
      {
        number: 13,
        title: "Слова–признаки",
        topic: "Имя прилагательное. Значение",
        aspects: "Прилагательное как слово–признак; вопросы какой? какая? какое? какие?; подбор признаков к предметам"
      },
      {
        number: 14,
        title: "Согласование прилагательного с существительным",
        topic: "Род и число прилагательных",
        aspects: "Согласование по роду и числу: большой дом, большая книга, большое окно, большие игрушки; тренировка на подстановке"
      },
      {
        number: 15,
        title: "Сравнение предметов",
        topic: "Прилагательные в сравнении",
        aspects: "Более/менее: высокий–выше, низкий–ниже (на интуитивном уровне); устные упражнения на сравнение предметов"
      },
      {
        number: 16,
        title: "Однокоренные слова",
        topic: "\"Семья\" слов",
        aspects: "Что объединяет слова лес, лесной, лесник; выделение общего смысла; первые шаги к пониманию корня (без формальных обозначений)"
      },
      {
        number: 17,
        title: "Корень слова",
        topic: "Корень как общая часть однокоренных слов",
        aspects: "Практическое выделение корня: дом–домик–домовой; подчеркнуть общую часть; зачем нужна \"семья\" слов (обогащение речи)"
      },
      {
        number: 18,
        title: "Приставка",
        topic: "Приставка как часть слова",
        aspects: "Изменение смысла: ехать – подъехать – въехать – переехать; нахождение приставки; подбор слов с одной приставкой"
      },
      {
        number: 19,
        title: "Суффикс",
        topic: "Суффикс как часть слова",
        aspects: "Уменьшительно-ласкательные суффиксы: дом – домик – домище (на уровне значения); выделение суффикса в словах; роль суффикса"
      },
      {
        number: 20,
        title: "Окончание",
        topic: "Изменяемая часть слова",
        aspects: "Сравнение форм: стол, стола, столы; выделение окончания как изменяемой части; связь с изменением формы слова"
      },
      {
        number: 21,
        title: "Безударные гласные в корне",
        topic: "Проверяемые безударные гласные",
        aspects: "Подбор проверочного слова: трава – травы, гора – горы; алгоритм: услышать – подобрать проверочное – записать"
      },
      {
        number: 22,
        title: "Тренинг безударных гласных",
        topic: "Закрепление навыка проверки",
        aspects: "Системная отработка на знакомых словах; работа с орфограммой \"безударная гласная в корне\"; самопроверка, взаимо-проверка"
      },
      {
        number: 23,
        title: "Парные звонкие и глухие согласные",
        topic: "Парные согласные на конце и перед согласным",
        aspects: "Слушаем и проверяем: луг – луга, дуб – дубы; опора на проверочное слово; выделение \"опасного места\" в слове"
      },
      {
        number: 24,
        title: "Мягкий знак – показатель мягкости",
        topic: "Мягкий знак в конце существительных",
        aspects: "Ночь, мышь, рожь; мягкий знак как показатель мягкости; отличия: мел – мель, угол – уголь; практические упражнения"
      },
      {
        number: 25,
        title: "Мягкий знак в середине слова",
        topic: "Мягкий знак внутри слова",
        aspects: "День, конь, пальто; роль мягкого знака в середине; чтение пар слов: брочка / брошка (сравнение смысла и звучания)"
      },
      {
        number: 26,
        title: "Разделительный мягкий знак",
        topic: "Ь между согласным и гласным",
        aspects: "Семья, вьюга, льёт; отличие \"мелькает – мелкает\" по смыслу и написанию; схема: согласный + Ь + я/ю/е/ё"
      },
      {
        number: 27,
        title: "Словарные слова",
        topic: "Непроверяемые орфограммы",
        aspects: "Понятие \"словарное слово\" (пишется так, как запомнили); работа с мини-словником; приёмы запоминания (образ, цвет, ассоциация)"
      },
      {
        number: 28,
        title: "Русский язык и словарь",
        topic: "Работа с орфографическим словарём",
        aspects: "Поиск слов по алфавиту; нахождение нужной формы; фиксация \"эталонного\" написания в тетради/карточках"
      },
      {
        number: 29,
        title: "Составляем схемы предложений",
        topic: "Схемы простых предложений",
        aspects: "Обозначение слов в предложении; схема \"кто? что делает?\"; добавление второстепенных членов (куда? когда? как?) на уровне вопросов"
      },
      {
        number: 30,
        title: "Расширяем предложение",
        topic: "Второстепенные члены предложения",
        aspects: "Уточняющие вопросы: где? когда? как? зачем?; превращение короткого предложения в развёрнутое; сравнение \"сухого\" и \"богатого\" предложения"
      },
      {
        number: 31,
        title: "Однородные члены (первое знакомство)",
        topic: "Перечисление в предложении",
        aspects: "Перечисление однородных предметов/признаков/действий; интонация перечисления; устное выделение \"перечислений\" в предложениях (без запятых на письме)"
      },
      {
        number: 32,
        title: "Текст и его тема",
        topic: "Тема и заголовок текста",
        aspects: "О чём этот текст? выбор заголовка; нахождение лишнего предложения; подбор заголовков к небольшим текстам"
      },
      {
        number: 33,
        title: "План текста",
        topic: "Простой план из 2–3 пунктов",
        aspects: "Деление текста на части; составление краткого плана; запись плана в виде нумерованных пунктов; пересказ по плану"
      },
      {
        number: 34,
        title: "Текст-описание и текст-повествование",
        topic: "Типы текстов (базовый уровень)",
        aspects: "Чем отличается рассказ о событии от описания предмета; выделение признаков описания и повествования на примерах; устные мини-тексты"
      },
      {
        number: 35,
        title: "Пишем небольшой текст по плану",
        topic: "Развитие письменной связной речи",
        aspects: "Написание 4–5 предложений по готовому плану и картинке; соблюдение границ предложений; самопроверка и правка черновика"
      },
      {
        number: 36,
        title: "Итоговый урок по году",
        topic: "Обобщение сведений о части речи, орфографии и тексте",
        aspects: "Систематизация: существительное, прилагательное, глагол; корень, приставка, суффикс, окончание; безударные гласные, парные согласные, мягкий знак; текст, тема, план; рефлексия: что научились, зоны роста"
      }
    ]
  },
  {
    grade: 3,
    title: "Русский язык для 3 класса",
    description: "Углубленный курс русского языка для третьеклассников с детальным изучением частей речи, грамматики, орфографии и синтаксиса.",
    lessons: [
      {
        number: 1,
        title: "Повтор базовых понятий",
        topic: "Слово, предложение, текст",
        aspects: "Актуализация: что такое слово, предложение, текст; границы предложений; заголовок, тема текста"
      },
      {
        number: 2,
        title: "Источники языковой информации",
        topic: "Учебник и словари",
        aspects: "Назначение учебника, словаря; поиск слова по алфавиту; условные обозначения в словаре"
      },
      {
        number: 3,
        title: "Части речи: обзор",
        topic: "Имя существительное, прилагательное, глагол",
        aspects: "Краткое повторение: что называют эти части речи; опора на вопросы; примеры из речи детей"
      },
      {
        number: 4,
        title: "Имя существительное как часть речи",
        topic: "Обобщение признаков существительного",
        aspects: "Что называет, вопросы кто? что?; одушевлённые/неодушевлённые; собственные/нарицательные"
      },
      {
        number: 5,
        title: "Род имён существительных",
        topic: "Мужской, женский, средний род",
        aspects: "Вопросы: он? она? оно?; группировка слов по роду; типичные трудные случаи (тетрадь, мел и др.)"
      },
      {
        number: 6,
        title: "Число имён существительных",
        topic: "Единственное и множественное число",
        aspects: "Образование форм множественного числа; смысловые различия; парная тренировка: дом – дома"
      },
      {
        number: 7,
        title: "Падежи имён существительных",
        topic: "Падежные вопросы, значение падежей",
        aspects: "Введение названий падежей; связь вопроса и предлога; практические упражнения с опорой на схемы"
      },
      {
        number: 8,
        title: "Предлоги и падежные формы",
        topic: "Предлог как служебное слово",
        aspects: "Роль предлога; написание предлогов отдельно; различие предлог/приставка; примеры \"в дом / вдом?\""
      },
      {
        number: 9,
        title: "Изменение существительных по падежам",
        topic: "Склонение (без углубления в типы)",
        aspects: "Изменение формы по вопросам; составление падежных форм; работа с моделями \"в (чём?) в книге\""
      },
      {
        number: 10,
        title: "Закрепление по существительному",
        topic: "Комплексная работа по теме",
        aspects: "Род, число, падеж; предлоги; мини-тексты с анализом; орфографическая тренировка по материалу существительных"
      },
      {
        number: 11,
        title: "Имя прилагательное",
        topic: "Обобщение признаков прилагательного",
        aspects: "Что называет прилагательное; вопросы какой? какая? какое? какие?; связь с существительным"
      },
      {
        number: 12,
        title: "Согласование прилагательного с существительным",
        topic: "Род и число прилагательных",
        aspects: "Большой дом, большая книга, большое окно, большие дома; отработка согласования в устной и письменной речи"
      },
      {
        number: 13,
        title: "Согласование по падежу",
        topic: "Прилагательное в разных падежах",
        aspects: "Изменение формы вместе с существительным: о большой книге, к зелёному дереву; подстановка по вопросам"
      },
      {
        number: 14,
        title: "Степени сравнения прилагательных",
        topic: "Положительная, сравнительная, превосходная степени",
        aspects: "Высокий – выше – самый высокий; образование форм; уместность употребления в тексте"
      },
      {
        number: 15,
        title: "Закрепление по прилагательному",
        topic: "Комплексная работа",
        aspects: "Расширение предложений за счёт прилагательных; подбор качественных/относительных прилагательных; орфография"
      },
      {
        number: 16,
        title: "Глагол как часть речи",
        topic: "Обобщение признаков глагола",
        aspects: "Что называет глагол; вопросы: что делать? что делает? что делал?; связь с подлежащим в предложении"
      },
      {
        number: 17,
        title: "Время глагола",
        topic: "Настоящее, прошедшее, будущее",
        aspects: "Линия времени; изменение формы глагола по времени; подбор глаголов к заданной ситуации"
      },
      {
        number: 18,
        title: "Лицо и число глагола",
        topic: "Изменение глагола по лицам и числам",
        aspects: "Таблица: я, ты, он/она, мы, вы, они; соотнесение с формами глагола; трансформация предложений"
      },
      {
        number: 19,
        title: "Спряжение глаголов",
        topic: "I и II спряжение (базовый уровень)",
        aspects: "Разделение глаголов по спряжениям; типичные окончания; группировка глаголов по образцу"
      },
      {
        number: 20,
        title: "Личные окончания глаголов",
        topic: "Правописание безударных личных окончаний",
        aspects: "Опора на спряжение для выбора окончания; алгоритм проверки; тренировочные упражнения"
      },
      {
        number: 21,
        title: "Мягкий знак в глаголах",
        topic: "Правописание ь в глагольных формах",
        aspects: "Пишем/пишешь/пишет; повелительное наклонение: читай – читайте; различие глаголов с ь и без ь"
      },
      {
        number: 22,
        title: "-тся и -ться",
        topic: "Правописание глаголов с -тся/-ться",
        aspects: "Разграничение по вопросу: что делает? / что сделать?; практический алгоритм; серия типовых упражнений"
      },
      {
        number: 23,
        title: "Местоимение",
        topic: "Личные местоимения",
        aspects: "Значение местоимений; замена существительных; таблица я, ты, он, она, оно, мы, вы, они; стилистическая роль (избежание повторов)"
      },
      {
        number: 24,
        title: "Однокоренные слова и корень",
        topic: "Обобщение понятия корня",
        aspects: "Определение корня через \"общую часть смысла и формы\"; подбор однокоренных слов; выделение корня (практически)"
      },
      {
        number: 25,
        title: "Однородные члены предложения",
        topic: "Перечисление в предложении",
        aspects: "Однородные подлежащие, сказуемые, дополнения; интонация перечисления; постановка запятой при однородных членах"
      },
      {
        number: 26,
        title: "Главные и второстепенные члены",
        topic: "Подлежащее и сказуемое, дополнение, определение, обстоятельство",
        aspects: "Вопросы к членам предложения; схемы; нахождение главных членов и простейших второстепенных"
      },
      {
        number: 27,
        title: "Простое предложение",
        topic: "Распространённые и нераспространённые предложения",
        aspects: "Отличие коротких и развёрнутых предложений; способы распространения; создание \"богатых\" предложений"
      },
      {
        number: 28,
        title: "Обращение",
        topic: "Обращение в предложении, знак препинания",
        aspects: "Кто к кому обращается; интонация; запятая при обращении (простейшие однословные обращения)"
      },
      {
        number: 29,
        title: "Диалог и прямая речь",
        topic: "Первое знакомство с прямой речью",
        aspects: "Отличия диалога и связного текста; оформление реплик в диалоге (тире); начало работы с прямой речью и кавычками"
      },
      {
        number: 30,
        title: "Проверяемые безударные гласные",
        topic: "Обобщение правила",
        aspects: "Алгоритм: услышать – подобрать проверочное – проверить по ударению; работа с орфограммой в разных частях речи"
      },
      {
        number: 31,
        title: "Непроверяемые гласные и согласные",
        topic: "Словарные слова",
        aspects: "Понятие \"словарное слово\"; ведение личного мини-словаря; приёмы запоминания; систематическая тренировка"
      },
      {
        number: 32,
        title: "Непроизносимые согласные",
        topic: "Непроизносимые согласные в корне слова",
        aspects: "Лестница, солнце, праздник; нахождение \"лишнего\" согласного; проверка через однокоренные слова"
      },
      {
        number: 33,
        title: "Жи–ши, ча–ща, чу–щу",
        topic: "Правописание сочетаний",
        aspects: "Закрепление традиционного написания; связи с звучанием; тренинг на материале разных частей речи"
      },
      {
        number: 34,
        title: "Твёрдый и мягкий разделительные знаки",
        topic: "Разделительные ъ и ь",
        aspects: "Схемы: согласный + ъ/ь + е/ё/ю/я; различие значений: съезд – съесть, семья – семя; практическая отработка"
      },
      {
        number: 35,
        title: "Типы текстов",
        topic: "Повествование, описание, рассуждение",
        aspects: "Признаки каждого типа текста; определение типа по содержанию; подбор заголовков, планов"
      },
      {
        number: 36,
        title: "Итоговый урок по году",
        topic: "Обобщение материала 3 класса",
        aspects: "Части речи и их признаки; орфограммы, изученные в году; виды предложений; работа с текстом (тема, основная мысль, план); рефлексия по результатам года"
      }
    ]
  },
  {
    grade: 4,
    title: "Русский язык для 4 класса",
    description: "Завершающий курс начальной школы русского языка для четвероклассников с систематизацией всех изученных тем и подготовкой к переходу в среднее звено.",
    lessons: [
      {
        number: 1,
        title: "Старт года: что уже знаем",
        topic: "Повтор ключевых понятий 1–3 классов",
        aspects: "Слово, предложение, текст; части речи (существительное, прилагательное, глагол, наречие, местоимение); фонетика и морфемика — краткое актуализирующее повторение"
      },
      {
        number: 2,
        title: "Опорные орфограммы начальной школы",
        topic: "Обзор орфограмм 1–3 классов",
        aspects: "Безударные гласные, парные согласные, непроизносимые, жи–ши, ча–ща, чу–щу, словарные слова; фиксация \"зон риска\" в письме"
      },
      {
        number: 3,
        title: "Имя существительное: систематизация",
        topic: "Обобщение сведений о существительном",
        aspects: "Значение (кто? что?), род, число, одушевлённость, собственные/нарицательные; роль в предложении; повтор склонения в общем виде"
      },
      {
        number: 4,
        title: "Падежи имён существительных",
        topic: "Система падежей",
        aspects: "Названия падежей, порядок; падежные вопросы; связь предлога и падежа; таблица \"падеж — вопрос — пример\""
      },
      {
        number: 5,
        title: "Склонение существительных",
        topic: "Изменение существительного по падежам",
        aspects: "Практика изменения форм; закрепление написания окончаний; работа с моделями \"к (чему?), о (чём?), в (чём?)\" и т.п."
      },
      {
        number: 6,
        title: "Правописание окончаний существительных",
        topic: "Окончания существительных в разных падежах",
        aspects: "Выбор окончания на основе вопроса и рода/числа; типичные трудные случаи (ии/и, е/и); алгоритм проверки"
      },
      {
        number: 7,
        title: "Предлог и его роль",
        topic: "Предлоги и падежные формы",
        aspects: "Предлог как служебное слово; написание предлога отдельно; различие предлог/приставка; тренировка: \"в дом / в доме / домик\""
      },
      {
        number: 8,
        title: "Имя прилагательное: систематизация",
        topic: "Обобщение сведений о прилагательном",
        aspects: "Что обозначает, вопросы; связь с существительным; роль в уточнении смысла высказывания"
      },
      {
        number: 9,
        title: "Изменение прилагательных",
        topic: "Согласование прилагательных с существительными",
        aspects: "Род, число, падеж прилагательных; изменение формы в зависимости от формы существительного; таблица \"дом/книга/окно/дома\""
      },
      {
        number: 10,
        title: "Правописание окончаний прилагательных",
        topic: "Окончания прилагательных в разных падежах",
        aspects: "Выбор окончаний -ый/-ий/-ой, -ая/-яя, -ое/-ее, -ые/-ие в различных падежах; тренинг на моделях и текстах"
      },
      {
        number: 11,
        title: "Степени сравнения прилагательных",
        topic: "Положительная, сравнительная, превосходная",
        aspects: "Образование форм (высокий – выше – самый высокий); типичные орфографические сложности; уместность в тексте"
      },
      {
        number: 12,
        title: "Глагол: систематизация",
        topic: "Обобщение сведений о глаголе",
        aspects: "Значение, вопросы, время, лицо, число; связь с подлежащим; глагол как центр сказуемого"
      },
      {
        number: 13,
        title: "Спряжение глаголов",
        topic: "I и II спряжение",
        aspects: "Признаки спряжений; глаголы-исключения; группировка глаголов по спряжению; таблица личных окончаний"
      },
      {
        number: 14,
        title: "Личные окончания глаголов",
        topic: "Правописание безударных личных окончаний",
        aspects: "Опора на спряжение; алгоритм выбора окончания; тренировочные упражнения с подстановкой и трансформацией"
      },
      {
        number: 15,
        title: "Правописание НЕ с глаголами",
        topic: "НЕ с глаголами",
        aspects: "Основное правило: не с глаголами пишется раздельно; выявление глаголов; типичные ошибки и их профилактика"
      },
      {
        number: 16,
        title: "Наречие как часть речи",
        topic: "Обобщение сведений о наречии",
        aspects: "Что обозначает наречие; вопросы где? когда? как?; отличие наречия от прилагательного; роль в уточнении действия"
      },
      {
        number: 17,
        title: "Местоимение: система форм",
        topic: "Личные, притяжательные, указательные местоимения",
        aspects: "Замена существительных в тексте; таблица местоимений; избегание повтора слов; согласование с глаголами"
      },
      {
        number: 18,
        title: "Служебные части речи",
        topic: "Предлог, союз, частица",
        aspects: "Назначение служебных слов; отличие значимых и служебных частей речи; простейшие союзы (и, а, но); частицы (не, бы, же) на примерах"
      },
      {
        number: 19,
        title: "Состав слова: систематизация",
        topic: "Корень, приставка, суффикс, окончание, основа",
        aspects: "Повтор состава слова; выделение морфем; связь морфемного анализа и орфографии; практические задания по разбору"
      },
      {
        number: 20,
        title: "Правописание приставок",
        topic: "Приставки на З/С и другие типичные приставки",
        aspects: "Правило з/с перед глухой/звонкой; разграничение приставки/предлога; распространённые приставки (по-, за-, на-, от-, про-, под-, пере-)"
      },
      {
        number: 21,
        title: "Приставки ПРЕ-/ПРИ- (обзорно)",
        topic: "Значение приставок ПРЕ-/ПРИ-",
        aspects: "Базовые значения (очень / близость, присоединение); работа на смысловых парах; формирование орфографической зоркости"
      },
      {
        number: 22,
        title: "Суффиксы и словообразование",
        topic: "Образование слов с помощью суффиксов",
        aspects: "Уменьшительно-ласкательные, оценочные суффиксы; изменение оттенка значения; практическое словообразование"
      },
      {
        number: 23,
        title: "Непроизносимые согласные",
        topic: "Непроизносимые согласные в корне слова",
        aspects: "Лестница, солнце, праздник и др.; проверка через однокоренные слова; орфографический тренинг по группе слов"
      },
      {
        number: 24,
        title: "Удвоенные согласные",
        topic: "Удвоенные согласные в корне и суффиксах",
        aspects: "Группа слов типа класс, килограмм, стеклянный; наблюдение за значением и написанием; приёмы запоминания"
      },
      {
        number: 25,
        title: "Разделительные Ъ и Ь",
        topic: "Разделительные знаки в корне и после приставок",
        aspects: "Схемы: согласный + ъ/ь + е/ё/ю/я; написание после приставок; сопоставление пар: съезд – съесть, объект, пальто, семья"
      },
      {
        number: 26,
        title: "Простое предложение: систематизация",
        topic: "Главные и второстепенные члены",
        aspects: "Подлежащее и сказуемое; виды второстепенных членов (дополнение, определение, обстоятельство) через вопросы; схемы предложений"
      },
      {
        number: 27,
        title: "Однородные члены предложения",
        topic: "Однородные подлежащие, сказуемые, дополнения",
        aspects: "Перечисление; союзы И, А, НО; запятая между однородными членами; интонация перечисления"
      },
      {
        number: 28,
        title: "Сложное предложение (первое знакомство)",
        topic: "Сложное предложение с союзами И, А, НО",
        aspects: "Отличие от простого; две основы в одном предложении; запятая между частями; схемы сложных предложений"
      },
      {
        number: 29,
        title: "Обращение и вводные слова",
        topic: "Обращение, простейшие вводные слова",
        aspects: "К кому обращаются; интонация; запятая при обращении; вводные слова типа конечно, наверное — на уровне узнавания"
      },
      {
        number: 30,
        title: "Прямая речь и слова автора",
        topic: "Оформление прямой речи в тексте",
        aspects: "Прямая речь + слова автора; знаки препинания (кавычки, тире, запятая); модели: \"— Прямая речь, — слова автора.\" и др."
      },
      {
        number: 31,
        title: "Диалог как форма речи",
        topic: "Диалог и монолог",
        aspects: "Особенности диалога; оформление реплик тире; восстановление и составление диалогов по ситуации; этикетные формулы"
      },
      {
        number: 32,
        title: "Типы текстов: обобщение",
        topic: "Повествование, описание, рассуждение",
        aspects: "Признаки каждого типа; определение типа текста; трансформация текста из одного типа в другой (на простых примерах)"
      },
      {
        number: 33,
        title: "Абзац и композиция текста",
        topic: "Абзац, вступление, основная часть, заключение",
        aspects: "Деление текста на абзацы; логика развития мысли; план текста и соответствие частей плана абзацам"
      },
      {
        number: 34,
        title: "Сжатое и подробное изложение",
        topic: "Приёмы переработки текста",
        aspects: "Умение выделять главное; сокращение второстепенного; подробный пересказ по плану; письменное изложение (базовый тренинг)"
      },
      {
        number: 35,
        title: "Собственное высказывание",
        topic: "Мини-сочинение (описание, повествование, рассуждение)",
        aspects: "Написание текста по опоре (картинка, пословица, вопрос); соблюдение структуры; орфографическая и пунктуационная самопроверка"
      },
      {
        number: 36,
        title: "Итоговый урок начальной школы",
        topic: "Обобщение курса русского языка 1–4 классов",
        aspects: "Систематизация: части речи, состав слова, орфограммы, синтаксис, работа с текстом; рефлексия, подготовка к переходу в среднее звено"
      }
    ]
  },
  {
    grade: 5,
    title: "Русский язык для 5 класса",
    description: "Курс русского языка для пятого класса с углубленным изучением лексики, словообразования, морфологии и синтаксиса.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит знаний",
        topic: "Повтор курса русского языка начальной школы",
        aspects: "Структура языка: звуки, морфемы, слова, словосочетания, предложения, текст; базовые орфограммы; части речи (обзор); фиксация зон риска у класса."
      },
      {
        number: 2,
        title: "Текст как объект изучения",
        topic: "Текст, тема, основная мысль, микротемы",
        aspects: "Отличие текста от набора предложений; тема vs основная мысль; микротема, абзац; средства связи предложений в тексте."
      },
      {
        number: 3,
        title: "Функциональные стили речи",
        topic: "Стили речи (первичное знакомство)",
        aspects: "Разговорный, художественный, научный, публицистический, официально-деловой (обзорно); типичные сферы употребления; примеры текстов."
      },
      {
        number: 4,
        title: "Лексическое значение слова",
        topic: "Лексическое значение, толковые словари",
        aspects: "Прямое лексическое значение; контекст; работа с толковым словарём; многозначность как переход к следующей теме."
      },
      {
        number: 5,
        title: "Многозначность",
        topic: "Однозначные и многозначные слова",
        aspects: "Различие однозначных и многозначных слов; перенос значений; примеры многозначных слов; словарная фиксация значений."
      },
      {
        number: 6,
        title: "Прямое и переносное значение",
        topic: "Прямое и переносное значение слова, метафора",
        aspects: "Отличие прямого и переносного значений по контексту; метафора как пример переносного значения; анализ художественных фрагментов."
      },
      {
        number: 7,
        title: "Синонимы",
        topic: "Синонимы и их роль в речи",
        aspects: "Определение синонимии; смысловые оттенки; ряды синонимов; замена повторяющихся слов; повышение выразительности текста."
      },
      {
        number: 8,
        title: "Антонимы",
        topic: "Антонимы и контраст в тексте",
        aspects: "Определение антонимии; контраст как приём; поиск антонимов в тексте; создание предложений с антонимическими парами."
      },
      {
        number: 9,
        title: "Омонимы и паронимы",
        topic: "Омонимы, паронимы (обзор)",
        aspects: "Типы омонимии (коротко); различие омонимы/многозначное слово; паронимы и типичные ошибки; работа с примерами из речи."
      },
      {
        number: 10,
        title: "Фразеология",
        topic: "Фразеологизмы",
        aspects: "Устойчивые выражения, их значение; отличие от свободных словосочетаний; источник (культура, история); корректное употребление в речи."
      },
      {
        number: 11,
        title: "Орфограмма как объект контроля",
        topic: "Орфограммы, орфографическая зоркость",
        aspects: "Понятие орфограммы; виды орфограмм (обзорно); алгоритм орфографического действия: увидеть — классифицировать — проверить — написать."
      },
      {
        number: 12,
        title: "Безударные гласные в корне",
        topic: "Проверяемые безударные гласные",
        aspects: "Повтор и углубление: подбор проверочного слова; позиция ударения; трудные случаи; организация самопроверки при письме."
      },
      {
        number: 13,
        title: "Проверка согласных в корне",
        topic: "Парные согласные по глухости-звонкости",
        aspects: "Парные согласные в слабой позиции (конец слова, перед согласным); подбор проверочного слова; типовые пары (луг — луга)."
      },
      {
        number: 14,
        title: "Непроизносимые и удвоенные согласные",
        topic: "Непроизносимые и удвоенные согласные",
        aspects: "Группы слов с непроизносимыми согласными; проверка через однокоренные слова; удвоенные согласные в корне и суффиксах; приёмы запоминания."
      },
      {
        number: 15,
        title: "Приставки и их написание",
        topic: "Приставки, з/с на конце, приставки на И/Ы",
        aspects: "Различие приставка/предлог; написание з/с в зависимости от последующего звука; правила И/Ы после приставок; тренинг на типичных приставках."
      },
      {
        number: 16,
        title: "Приставки ПРИ-/ПРЕ-",
        topic: "Правописание приставок ПРИ-/ПРЕ- (обзорно)",
        aspects: "Основные значения ПРИ- (приближение, присоединение, неполнота) и ПРЕ- (очень, пере-); работа с опорными парами; формирование орфографической интуиции."
      },
      {
        number: 17,
        title: "Суффиксы и словообразование",
        topic: "Суффиксальный способ образования слов",
        aspects: "Роль суффикса в изменении значения; повтор основных суффиксов существительных и прилагательных; словообразовательные цепочки."
      },
      {
        number: 18,
        title: "Чередование гласных и согласных",
        topic: "Чередующиеся гласные и согласные в корне",
        aspects: "Обзорно: раст/ращ/рос, лаг/лож, бер/бир и др.; связь с суффиксами и приставками; работа по готовым спискам; акцент на различии \"проверяемая/чередующаяся\"."
      },
      {
        number: 19,
        title: "Имя существительное: системный обзор",
        topic: "Грамматические признаки существительного",
        aspects: "Значение, род, число, одушевлённость, собственные/нарицательные; функции в предложении; актуализация склонения."
      },
      {
        number: 20,
        title: "Склонения существительных",
        topic: "Первое, второе, третье склонения",
        aspects: "Критерии отнесения к склонению; род и окончание в начальной форме; таблица склонений; базовые орфографические выводы."
      },
      {
        number: 21,
        title: "Падежные окончания существительных",
        topic: "Правописание окончаний существительных",
        aspects: "Выбор окончаний с опорой на склонение и падеж; типичные трудные позиции (мн. число род., дат., предл. падежи); тренинг по моделям и текстам."
      },
      {
        number: 22,
        title: "Имя прилагательное: разряды",
        topic: "Качественные, относительные, притяжательные прилагательные",
        aspects: "Значение каждого разряда; вопросы; примеры; границы употребления (где возможны степени сравнения, краткая форма и т.д.)."
      },
      {
        number: 23,
        title: "Прилагательное: степени сравнения",
        topic: "Степени сравнения и их правописание",
        aspects: "Простая и составная степени сравнения; орфографические особенности (удвоения, чередования); корректное употребление в письменной речи."
      },
      {
        number: 24,
        title: "Глагол: вид и время",
        topic: "Вид глагола, времена глагола",
        aspects: "Совершенный/несовершенный вид (первичное закрепление); временные формы; соотнесение с ситуацией; преобразование предложений по виду и времени."
      },
      {
        number: 25,
        title: "Спряжение глаголов",
        topic: "Спряжения и личные окончания",
        aspects: "I и II спряжение; глаголы-исключения; выбор безударных личных окончаний; таблица и алгоритм определения спряжения."
      },
      {
        number: 26,
        title: "НЕ с различными частями речи",
        topic: "Правописание НЕ с существительными, прилагательными, наречиями, глаголами",
        aspects: "Базовые правила слитного/раздельного написания; смысловые оппозиции (не высокий — невысокий); исключения; тренинг на смешанном материале."
      },
      {
        number: 27,
        title: "Наречие и его правописание",
        topic: "Наречие, НЕ и НИ с наречиями",
        aspects: "Отличие наречия от прилагательного; правописание наречий на -о/-е; НЕ/НИ с наречиями; орфографическе разборы по образцу."
      },
      {
        number: 28,
        title: "Местоимение: разряды и правописание",
        topic: "Личные, притяжательные, указательные и др.",
        aspects: "Разряды местоимений; роль в тексте; правописание (раздельное/слитное с предлогами, не с местоимениями — обзорно); избежание тавтологии."
      },
      {
        number: 29,
        title: "Служебные части речи: детализация",
        topic: "Предлоги, союзы, частицы",
        aspects: "Функции служебных слов; различие союз/предлог; типичные союзы сочинительные (и, а, но); частицы как средство оттенков смысла."
      },
      {
        number: 30,
        title: "Словосочетание",
        topic: "Словосочетание, виды связи",
        aspects: "Отличие словосочетания от предложения; главные/зависимые слова; типы связи: согласование, управление, примыкание; схемы."
      },
      {
        number: 31,
        title: "Простое предложение",
        topic: "Главные и второстепенные члены, схемы предложений",
        aspects: "Повтор: подлежащее, сказуемое, дополнение, определение, обстоятельство; восстановление и составление схем; распространённые/нераспространённые предложения."
      },
      {
        number: 32,
        title: "Однородные члены и запятая",
        topic: "Однородные члены предложения, союзы И, А, НО",
        aspects: "Логика перечисления; однородные подлежащие, сказуемые, дополнения, определения; постановка запятой; типовые ошибки."
      },
      {
        number: 33,
        title: "Обращение, вводные слова, прямая речь",
        topic: "Обращение, вводные слова, оформление прямой речи",
        aspects: "Обращение и знаки препинания; вводные слова (конечно, наверное, по-моему и др. — на уровне узнавания); схемы прямой речи и слов автора."
      },
      {
        number: 34,
        title: "Сложное предложение: вход",
        topic: "Сложное предложение с союзами И, А, НО",
        aspects: "Отличие простого и сложного предложения по количеству грамматических основ; запятая между частями; схемы сложных предложений."
      },
      {
        number: 35,
        title: "Практика работы с текстом",
        topic: "Анализ текста с позиции лексики, синтаксиса и стиля",
        aspects: "Комплексный разбор: лексические средства (синонимы, антонимы, фразеологизмы), синтаксис (однородные, обращения, сложные предложения), стиль; краткий письменный анализ."
      },
      {
        number: 36,
        title: "Итоговый урок по году",
        topic: "Обобщение курса русского языка 5 класса",
        aspects: "Лексика (значения, синонимы, антонимы, фразеология), словообразование и орфография, морфология (части речи), синтаксис (словосочетание, предложение, текст); фиксация результатов и зон развития."
      }
    ]
  },
  {
    grade: 6,
    title: "Русский язык для 6 класса",
    description: "Курс русского языка для шестого класса с системным изучением частей речи, синтаксиса и углубленным развитием навыков анализа текста.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит знаний",
        topic: "Повтор курса русского языка 5 класса",
        aspects: "Структура языка: лексика, морфология, синтаксис, текст; актуализация орфограмм; выявление \"зон риска\" у класса по диагностическим заданиям."
      },
      {
        number: 2,
        title: "Текст под микроскопом",
        topic: "Текст, тема, основная мысль, микротемы",
        aspects: "Отличие текста от набора предложений; тема vs основная мысль; микротема и абзац; средства связи предложений внутри абзаца."
      },
      {
        number: 3,
        title: "Где и как мы говорим и пишем",
        topic: "Функциональные стили речи",
        aspects: "Разговорный, художественный, научный, публицистический, официально-деловой (обзор); типичные особенности; подбор стиля под ситуацию."
      },
      {
        number: 4,
        title: "Значение слова и контекст",
        topic: "Лексическое значение, многозначность",
        aspects: "Прямое значение; многозначные слова; роль контекста; отличие многозначного слова от омонимов; работа с толковым словарём."
      },
      {
        number: 5,
        title: "Синонимы, антонимы, фразеологизмы",
        topic: "Лексические средства выразительности",
        aspects: "Ряды синонимов и антонимов; фразеологизмы и их значение; роль лексических средств в выразительности текста; корректность употребления."
      },
      {
        number: 6,
        title: "Местоимение: вход в раздел",
        topic: "Местоимение как часть речи",
        aspects: "Что такое местоимение; чем отличается от существительного; основные разряды (обзорно); функция местоимений в тексте (избежание повторов)."
      },
      {
        number: 7,
        title: "Я, ты, он, она…",
        topic: "Личные и возвратные местоимения",
        aspects: "Личные местоимения, их формы; падежные формы (обзорно); возвратное местоимение себя; согласование с глаголами."
      },
      {
        number: 8,
        title: "Чей? Какой? Который?",
        topic: "Притяжательные, указательные, определительные местоимения",
        aspects: "Значение и вопросы к каждому разряду; различие \"мой/этот/каждый\"; примеры употребления в предложениях и текстах."
      },
      {
        number: 9,
        title: "Кто-то, никто, кое-кто",
        topic: "Вопросительные, относительные, неопределённые, отрицательные местоимения",
        aspects: "Вопросительные и относительные местоимения в сложных предложениях (обзор); образование неопределённых и отрицательных форм; смысловые оттенки."
      },
      {
        number: 10,
        title: "Как пишутся местоимения",
        topic: "Правописание местоимений",
        aspects: "Слитное/раздельное написание (ни у кого, ниоткуда); местоимения с предлогами; НЕ и НИ с местоимениями; типичные орфографические ловушки."
      },
      {
        number: 11,
        title: "Числительное: старт",
        topic: "Имя числительное как часть речи",
        aspects: "Значение числительных; вопросы сколько? который?; отличие числительного от существительного; роль числительных в тексте."
      },
      {
        number: 12,
        title: "Сколько?",
        topic: "Количественные числительные",
        aspects: "Примеры простых и составных количественных числительных; употребление в речи; согласование с существительными."
      },
      {
        number: 13,
        title: "Который по счёту?",
        topic: "Порядковые числительные",
        aspects: "Образование порядковых числительных; их склонение (обзорно); написание порядковых числительных в тексте."
      },
      {
        number: 14,
        title: "Цифрой и словом",
        topic: "Числительные в письменной речи",
        aspects: "Когда пишем цифрами, когда словами; сочетания \"два-три\", \"несколько сотен\"; орфография числительных в документах и учебных текстах."
      },
      {
        number: 15,
        title: "Наречие: как? где? когда?",
        topic: "Наречие как часть речи",
        aspects: "Что обозначает наречие; вопросы где? когда? как? почему? с какой целью?; отличие наречия от прилагательного; роль в уточнении действия."
      },
      {
        number: 16,
        title: "Виды наречий",
        topic: "Разряды наречий по значению",
        aspects: "Наречия образа действия, места, времени, причины, цели; примеры; классификация наречий из текста; влияние наречий на стиль высказывания."
      },
      {
        number: 17,
        title: "Как пишутся наречия",
        topic: "Правописание наречий",
        aspects: "Слитное, раздельное и дефисное написание (вначале, по-русски, по одному); приставки и суффиксы наречий; работа по орфографическим моделям."
      },
      {
        number: 18,
        title: "НЕ и НИ с наречиями",
        topic: "Правописание НЕ и НИ с наречиями",
        aspects: "Слитное и раздельное написание (недалеко, не далеко ли, ниоткуда); смысловые различия; типичные ошибки; алгоритм выбора написания."
      },
      {
        number: 19,
        title: "Предлог – \"служебный помощник\"",
        topic: "Предлог как служебная часть речи",
        aspects: "Связь предлога со словом; отличие предлога от приставки; написание предлога отдельно; устойчивые сочетания с предлогами."
      },
      {
        number: 20,
        title: "Союз связывает",
        topic: "Союзы, их роль в предложении и тексте",
        aspects: "Сочинительные и подчинительные (обзорно); соединение однородных членов и частей сложных предложений; отличие союза от предлога по функции и вопросу."
      },
      {
        number: 21,
        title: "Частицы: оттенки смысла",
        topic: "Частица как служебная часть речи",
        aspects: "Смысловые оттенки (усиление, ограничение, отрицание, вопрос); НЕ, НИ, бы, же, ли и др.; влияние частиц на интонацию и смысл."
      },
      {
        number: 22,
        title: "Междометие и звуки речи",
        topic: "Междометия и звукоподражательные слова",
        aspects: "Междометие как выражение эмоций; отличие от других частей речи; оформление на письме; роль в художественных текстах и диалогах."
      },
      {
        number: 23,
        title: "Как слова \"держатся вместе\"",
        topic: "Словосочетание, виды связи",
        aspects: "Отличие словосочетания от предложения; главное и зависимое слово; согласование, управление, примыкание; схемы словосочетаний."
      },
      {
        number: 24,
        title: "Простое предложение: систематизация",
        topic: "Структура простого предложения",
        aspects: "Грамматическая основа; главные и второстепенные члены; распространённые и нераспространённые предложения; схемы и разбор."
      },
      {
        number: 25,
        title: "Перечисляем грамотно",
        topic: "Однородные члены предложения, союзы, запятая",
        aspects: "Однородные подлежащие, сказуемые, дополнения, определения, обстоятельства; союзы И, А, НО; правила постановки запятой при однородных членах; обобщающие слова (обзорно)."
      },
      {
        number: 26,
        title: "Уточняем и поясняем",
        topic: "Обособленные уточняющие и пояснительные члены",
        aspects: "Смысл уточнения; интонация; знаки препинания; отличия уточняющих и пояснительных членов; разбор примеров из художественных текстов."
      },
      {
        number: 27,
        title: "Обращения и вводные слова",
        topic: "Обращение, вводные слова и предложения",
        aspects: "К кому обращаются; оформление обращений; вводные слова (конечно, по-моему, к счастью и др.) – значение и пунктуация; различие вводных членов и членов предложения."
      },
      {
        number: 28,
        title: "Чужая речь в тексте",
        topic: "Прямая речь, диалог, слова автора",
        aspects: "Модели прямой речи и слов автора; оформление диалога в тексте; знаки препинания при прямой речи; речевой этикет в диалоге."
      },
      {
        number: 29,
        title: "НЕ и НИ: сложные случаи",
        topic: "Правописание НЕ и НИ с разными частями речи",
        aspects: "Обобщение: НЕ с существительными, прилагательными, наречиями, глаголами; НИ в отрицательных конструкциях и устойчивых выражениях; тренинг на смешанном материале."
      },
      {
        number: 30,
        title: "Орфография под контролем",
        topic: "Ключевые орфограммы 5–6 классов",
        aspects: "Безударные гласные, парные/непроизносимые/удвоенные согласные, приставки (з/с, при-/пре- обзорно), суффиксы; алгоритм орфографического действия, работа с орфографическим словарём."
      },
      {
        number: 31,
        title: "Окончания и согласование",
        topic: "Орфограммы в окончаниях слов",
        aspects: "Согласование форм в словосочетании и предложении; \"проверка по вопросу\" и по модели; типичные ошибки в окончаниях существительных, прилагательных, глаголов."
      },
      {
        number: 32,
        title: "На стыке слов и морфем",
        topic: "Слитное и раздельное написание",
        aspects: "Слитно/раздельно: предлоги и приставки, наречия и сочетания слов; анализ \"опасных мест\" на стыке морфем и слов; тренинг по заданиям ЕГЭ-шного типа (упрощённый формат)."
      },
      {
        number: 33,
        title: "Текст: лексика + синтаксис",
        topic: "Комплексный анализ текста",
        aspects: "Лексические средства (синонимы, антонимы, фразеологизмы); синтаксические (однородные, обращения, вводные, прямая речь); их роль в выразительности и логике текста."
      },
      {
        number: 34,
        title: "Изложения разных типов",
        topic: "Виды изложений и работа с планом",
        aspects: "Подробное, выборочное, сжатое изложение (обзор); составление плана; выделение ключевых микротем; письменная переработка исходного текста."
      },
      {
        number: 35,
        title: "Пишем рассуждение",
        topic: "Сочинение-рассуждение (базовый уровень)",
        aspects: "Структура: тезис, аргументы, вывод; работа с опорой (высказывание, пословица, ситуация); использование языковых средств для логичности и выразительности."
      },
      {
        number: 36,
        title: "Итоговый урок по году",
        topic: "Обобщение курса русского языка 6 класса",
        aspects: "Лексика и фразеология, морфология (местоимение, числительное, наречие, служебные части речи), синтаксис простого предложения, орфография и пунктуация; фиксация индивидуальных результатов и целей на 7 класс."
      }
    ]
  },
  {
    grade: 7,
    title: "Русский язык для 7 класса",
    description: "Курс русского языка для седьмого класса с углубленным изучением синтаксиса, пунктуации и комплексного анализа текста.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит по синтаксису",
        topic: "Повтор курса русской речи 5–6 классов",
        aspects: "Предложение, словосочетание, части речи, главные/второстепенные члены; базовые знаки препинания; диагностика типичных ошибок класса."
      },
      {
        number: 2,
        title: "Высказывание, текст, предложение",
        topic: "Единицы общения и языка",
        aspects: "Высказывание и предложение; текст, тема, основная мысль; связь предложений в тексте; роль абзаца."
      },
      {
        number: 3,
        title: "Словосочетание под управлением",
        topic: "Словосочетание, виды связи",
        aspects: "Отличие словосочетания от предложения; главное и зависимое слово; согласование, управление, примыкание; схемы."
      },
      {
        number: 4,
        title: "Простое предложение под контролем",
        topic: "Простое предложение и его структура",
        aspects: "Грамматическая основа; распространённые и нераспространённые предложения; порядок слов; типичные ошибки в построении."
      },
      {
        number: 5,
        title: "Кто главный, кто помогает",
        topic: "Главные и второстепенные члены предложения",
        aspects: "Подлежащее и сказуемое; дополнение, определение, обстоятельство; вопросы к членам предложения; разбор по членам."
      },
      {
        number: 6,
        title: "Перечисляем без хаоса",
        topic: "Однородные члены предложения: базовый уровень",
        aspects: "Однородные подлежащие, сказуемые, дополнения и др.; интонация перечисления; союзы И, А, НО; различие однородных и неоднородных членов."
      },
      {
        number: 7,
        title: "Запятая при однородных членах",
        topic: "Однородные с союзами И, А, НО",
        aspects: "Когда ставится запятая, когда нет; повтор союзы-связки; сложные случаи (повторяющиеся союзы, двойные союзы)."
      },
      {
        number: 8,
        title: "Обобщающие слова и перечисление",
        topic: "Обобщающие слова при однородных членах",
        aspects: "Обобщающее слово до и после ряда; двоеточие и тире после обобщающего слова (обзорно); интонация и смысловые акценты."
      },
      {
        number: 9,
        title: "Осложнённое простое: обзор",
        topic: "Осложнённое простое предложение",
        aspects: "Однородные члены, обращения, вводные слова, уточнения, присоединительные и вставные конструкции — как факторы «усложения»; общая схема."
      },
      {
        number: 10,
        title: "Обращение к адресату",
        topic: "Обращение, знаки препинания",
        aspects: "К кому обращаются; место обращения в предложении; запятая/восклицательный знак; различие обращения и подлежащего."
      },
      {
        number: 11,
        title: "Вводные слова: мнение, эмоция, порядок",
        topic: "Вводные слова и предложения",
        aspects: "Значения вводных (уверенность/неуверенность, источник сообщения, эмоция); выделение запятыми; отличие вводных от членов предложения."
      },
      {
        number: 12,
        title: "Что, где, когда уточняем",
        topic: "Уточняющие члены предложения",
        aspects: "Смысл уточнения; чем отличается от однородных членов; выделение уточняющих запятыми; интонация уточнения."
      },
      {
        number: 13,
        title: "Присоединяем и вставляем",
        topic: "Присоединительные и вставные конструкции",
        aspects: "Присоединительные члены с союзами да и, а, но, причем и др.; вставные конструкции; знаки препинания и интонация."
      },
      {
        number: 14,
        title: "Комбо: все виды осложнения",
        topic: "Повтор по осложнённому простому предложению",
        aspects: "Комплексный разбор; комбинированные случаи (обращение + однородные, вводное + уточнение и т.п.); тренинг схем и пунктуации."
      },
      {
        number: 15,
        title: "Чужая речь: вход в тему",
        topic: "Прямая речь, диалог",
        aspects: "Прямая и косвенная речь (обзорно); отличие диалога от монолога; функции прямой речи в тексте."
      },
      {
        number: 16,
        title: "Прямая речь и слова автора",
        topic: "Основные модели прямой речи",
        aspects: "Схемы: «— ПР, — а.», «А: „ПР.“», «„ПР“, — а.» и др.; знаки препинания и кавычки; роль интонации."
      },
      {
        number: 17,
        title: "Диалог как форма общения",
        topic: "Оформление диалога",
        aspects: "Правила записи диалога (тире, новая строка); реплики и слова автора; речевой этикет, уместность обращений."
      },
      {
        number: 18,
        title: "Цитата в тексте",
        topic: "Цитирование, косвенная речь (обзорно)",
        aspects: "Цитата как средство аргументации; кавычки и ссылка на источник (общее представление); преобразование прямой речи в косвенную."
      },
      {
        number: 19,
        title: "Сложное предложение: старт",
        topic: "Понятие сложного предложения",
        aspects: "Отличие простого и сложного предложения по количеству грамматических основ; интонация; типы связи (сочинительная, подчинительная, бессоюзная — обзорно)."
      },
      {
        number: 20,
        title: "Сложносочинённое: И, А, НО",
        topic: "Сложносочинённое предложение (ССП)",
        aspects: "Части ССП, равноправие; союзы И, А, НО; запятая между частями; смысловые отношения (соединение, противопоставление)."
      },
      {
        number: 21,
        title: "Другие союзы в ССП",
        topic: "ССП с различными сочинительными союзами",
        aspects: "Союзы или, либо, да (в значении и/но), однако и др.; сложные случаи отсутствия запятой; сравнение с однородными членами."
      },
      {
        number: 22,
        title: "Бессоюзное сложное: связь по смыслу",
        topic: "Бессоюзное сложное предложение (БСП)",
        aspects: "Отсутствие союзов; виды смысловых отношений (перечень, причина–следствие, противопоставление и др. — на примерах); знаки препинания (запятая, тире, двоеточие — обзор)."
      },
      {
        number: 23,
        title: "Разные виды связи в одном",
        topic: "Сложные предложения с разными видами связи (обзор)",
        aspects: "Комбинация союзной и бессоюзной связи; примеры из художественных текстов; схемы сложных конструкций."
      },
      {
        number: 24,
        title: "Тренинг по сложным предложениям",
        topic: "Практика пунктуации в сложных конструкциях",
        aspects: "Отработка ССП и БСП по схемам и текстам; сопоставление близких по структуре предложений; анализ авторского выбора знаков."
      },
      {
        number: 25,
        title: "Пунктуация как инструмент смысла",
        topic: "Логика постановки знаков препинания",
        aspects: "Сопоставление вариантов текста с разной пунктуацией; влияние знаков на смысл и интонацию; \"читаем пунктуацию глазами\"."
      },
      {
        number: 26,
        title: "Орфография на фоне синтаксиса",
        topic: "Орфограммы в пределах предложения",
        aspects: "Повтор ключевых орфограмм в частях речи на материале сложных конструкций; комплексная проверка: орфография + пунктуация."
      },
      {
        number: 27,
        title: "Ошибки в построении предложений",
        topic: "Синтаксические ошибки и искажение смысла",
        aspects: "Нарушения связи подлежащего и сказуемого, \"висящие\" члены, смешение конструкций, лишние/пропущенные элементы; способы исправления."
      },
      {
        number: 28,
        title: "Речевые ошибки и штампы",
        topic: "Культура речи: речевые недочёты",
        aspects: "Тавтология, речевые штампы, плеоназмы, бедный словарь; корректировка текста; подбор синонимов, устранение повторов."
      },
      {
        number: 29,
        title: "Текст и композиция",
        topic: "Композиция текста и абзацное членение",
        aspects: "Вступление, основная часть, заключение; связь абзацев; \"скелет\" текста через план и микротемы."
      },
      {
        number: 30,
        title: "Типы речи: повтор на новом уровне",
        topic: "Повествование, описание, рассуждение",
        aspects: "Комбинации типов речи в одном тексте; опознавание доминирующего типа; задачи на преобразование (описание → повествование и т.п.)."
      },
      {
        number: 31,
        title: "Лингвистическое рассуждение",
        topic: "Сочинение-рассуждение на языковую тему",
        aspects: "Структура: тезис, аргументы, вывод; использование терминов и примеров из языка; логика и связки (во-первых, таким образом и т.д.)."
      },
      {
        number: 32,
        title: "Сочинение по тексту",
        topic: "Аналитическое сочинение по исходному тексту",
        aspects: "Умение выделить проблему/тему, позицию автора; собственное мнение; использование цитат и языковых наблюдений."
      },
      {
        number: 33,
        title: "Изложение с элементами сочинения",
        topic: "Комбинированные письменные работы",
        aspects: "Передача содержания текста + собственный фрагмент (описание, рассуждение); удержание стиля исходного текста."
      },
      {
        number: 34,
        title: "Комплексный разбор текста",
        topic: "Лексический, морфологический, синтаксический и пунктуационный анализ",
        aspects: "Работа \"под ключ\": вид предложения, способы связи, осложнение, ключевые орфограммы; оценка выразительности и стилистики."
      },
      {
        number: 35,
        title: "Контрольный тренировочный блок",
        topic: "Итоговые тренировочные задания по синтаксису и пунктуации",
        aspects: "Микс задач: схемы, расстановка знаков, исправление ошибок, преобразование конструкций, краткий анализ текстов."
      },
      {
        number: 36,
        title: "Итог по 7 классу",
        topic: "Обобщение курса синтаксиса и пунктуации",
        aspects: "Систематизация: словосочетание, простое и сложное предложение, осложнённые конструкции, прямая речь, диалог, ключевые орфограммы; фиксация готовности к 8 классу."
      }
    ]
  },
  {
    grade: 8,
    title: "Русский язык для 8 класса",
    description: "Курс русского языка для восьмого класса с углубленным изучением морфологии, орфографии и синтаксиса, подготовкой к старшей школе.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит по орфографии",
        topic: "Повтор ключевых орфограмм 5–7 классов",
        aspects: "Быстрый срез: безударные гласные, парные/непроизносимые/удвоенные согласные, приставки, суффиксы, НЕ/НИ, знаки препинания в простом и сложном предложении; фиксация \"зон риска\" класса."
      },
      {
        number: 2,
        title: "Словообразование и морфемика",
        topic: "Словообразовательный и морфемный анализ",
        aspects: "Различие морфемного и словообразовательного анализа; корень, приставка, суффикс, окончание, основа; производящее и производное слово; схема разбора."
      },
      {
        number: 3,
        title: "Гнездо однокоренных слов",
        topic: "Словообразовательные цепочки и гнёзда",
        aspects: "Цепочка и гнездо; направление word-building; восстановление цепочек; влияние способа образования на значение."
      },
      {
        number: 4,
        title: "Повтор по имени существительному",
        topic: "Имя существительное, его грамматические категории",
        aspects: "Значение, род, число, одушевлённость; склонения, падежи; роль существительного в словосочетании и предложении; акцент на орфограммы в окончаниях."
      },
      {
        number: 5,
        title: "Падежные окончания существительных",
        topic: "Правописание падежных окончаний",
        aspects: "Выбор окончания по вопросу, склонению и типу основы; трудные случаи мн. ч. (род., дат., предл. падежи); работа по моделям и текстам."
      },
      {
        number: 6,
        title: "Суффиксы существительных",
        topic: "Правописание суффиксов имён существительных",
        aspects: "Суффиксы -ек/-ик, -иц-/-ец-, -чик-/-щик-, -оньк-/-еньк- и др.; зависимость суффикса от ударения и твёрдости/мягкости; орфографический тренинг."
      },
      {
        number: 7,
        title: "Чередующиеся гласные в корне",
        topic: "Чередующиеся гласные в корне слова",
        aspects: "Раст/ращ/рос, лаг/лож, кас/кос, бер/бир и др. (в рамках программы); связь с суффиксами -а-, -о-; разграничение проверяемых и чередующихся гласных."
      },
      {
        number: 8,
        title: "Парные и непроизносимые согласные",
        topic: "Согласные в корне слова",
        aspects: "Повтор: парные согласные в слабой позиции; непроизносимые согласные; проверка через однокоренные слова; типовые ряды."
      },
      {
        number: 9,
        title: "Имя прилагательное: систематизация",
        topic: "Разряды и формы прилагательных",
        aspects: "Качественные, относительные, притяжательные; полные и краткие формы; категории рода, числа, падежа; роль прилагательного в тексте."
      },
      {
        number: 10,
        title: "Степени сравнения прилагательных",
        topic: "Правописание степеней сравнения",
        aspects: "Простая и составная степени; образование форм (выше, более высокий, самый высокий); орфографические трудности (удвоения, чередования)."
      },
      {
        number: 11,
        title: "Н и НН в прилагательных",
        topic: "Правописание Н/НН в отымённых прилагательных",
        aspects: "Суффиксы -Н-, -НН- (-ян-, -ан-, -янн-, -енн-, -онн- и др.); различие кратких/полных форм; опора на словообразование при выборе написания."
      },
      {
        number: 12,
        title: "Причастие: вход в раздел",
        topic: "Причастие как особая форма глагола",
        aspects: "Признаки глагола и прилагательного; вопросы (какой? что делающий? что сделанный?); роль в предложении; отличие от прилагательных."
      },
      {
        number: 13,
        title: "Причастный оборот",
        topic: "Причастие и причастный оборот",
        aspects: "Структура причастного оборота; границы оборота; случаи обособления и необособления; интонация и роль оборота в тексте."
      },
      {
        number: 14,
        title: "Суффиксы причастий",
        topic: "Правописание суффиксов причастий",
        aspects: "Действительные и страдательные причастия; суффиксы настоящего и прошедшего времени; связь с спряжением и видом глагола."
      },
      {
        number: 15,
        title: "НЕ с причастиями",
        topic: "Слитное и раздельное написание НЕ с причастиями",
        aspects: "Критерии выбора (наличие зависимых слов, контраст с союзом а, возможность замены синонимом без НЕ); примеры типовых конструкций."
      },
      {
        number: 16,
        title: "Деепричастие",
        topic: "Деепричастие как форма глагола",
        aspects: "Значение, вопросы, связь с глаголом-сказуемым; роль в предложении; отличие от наречия и обстоятельства."
      },
      {
        number: 17,
        title: "Деепричастный оборот",
        topic: "Деепричастный оборот и его обособление",
        aspects: "Структура оборота; обязательное обособление; требование единого деятеля; типичные ошибки (деепричастие при страдательных конструкциях и др.)."
      },
      {
        number: 18,
        title: "Формы глагола в системе языка",
        topic: "Личные и неличные формы глагола",
        aspects: "Личные формы, инфинитив, причастие, деепричастие; их функции; влияние вида и времени; связь с синтаксисом."
      },
      {
        number: 19,
        title: "ТЬСЯ и ТСЯ",
        topic: "Правописание -ТЬСЯ/-ТСЯ в глаголах",
        aspects: "Выбор написания по вопросу (что делать? / что делает?); алгоритм проверки; сопоставление пар: учиться – учится, бояться – боится."
      },
      {
        number: 20,
        title: "Наречие: повтор и углубление",
        topic: "Наречия, их разряды и написание",
        aspects: "Разряды по значению; правописание наречий через дефис и слитно/раздельно (вначале, по-русски, по одному и др.); НЕ и НИ с наречиями."
      },
      {
        number: 21,
        title: "Местоимение: правописание",
        topic: "Правописание местоимений и местоименных наречий",
        aspects: "Слитное/раздельное написание (что-нибудь, кое-как, ни у кого); НЕ/НИ с местоимениями; употребление местоимений в тексте."
      },
      {
        number: 22,
        title: "Имя числительное: орфография",
        topic: "Правописание числительных",
        aspects: "Количественные и порядковые; сложные и составные числительные; написание и склонение наиболее употребимых форм."
      },
      {
        number: 23,
        title: "Служебные части речи и орфография",
        topic: "Предлоги, союзы, частицы",
        aspects: "Разграничение предлога и приставки; слитное/раздельное написание союзов и частиц; типичные ошибки на стыке слов."
      },
      {
        number: 24,
        title: "Сложные слова и дефис",
        topic: "Правописание сложных слов",
        aspects: "Сложные существительные, прилагательные, наречия; дефисное и слитное написание (юго-западный, русско-английский, кто-либо и др.); модели образования."
      },
      {
        number: 25,
        title: "НЕ и НИ: систематизация",
        topic: "НЕ и НИ с разными частями речи",
        aspects: "Итоговое обобщение: НЕ с существительными, прилагательными, наречиями, причастиями, глаголами; НИ в отрицательных конструкциях и устойчивых выражениях; таблица-опора."
      },
      {
        number: 26,
        title: "Орфография + пунктуация в простом",
        topic: "Осложнённое простое предложение и орфограммы",
        aspects: "Совмещение орфографических задач (морфемные орфограммы, окончания) с пунктуацией при однородных, вводных, обращениях, уточнениях."
      },
      {
        number: 27,
        title: "Причастный и деепричастный оборот в тексте",
        topic: "Роль и пунктуация оборотов",
        aspects: "Стилевые функции оборотов; обособление; типичные ошибки построения; сравнение вариантов текста с разной степенью осложнения."
      },
      {
        number: 28,
        title: "Речевые ошибки в словоупотреблении",
        topic: "Нормы лексической сочетаемости",
        aspects: "Неправильное употребление слов, паронимы, тавтология, штампы; исправление речевых ошибок; работа с реальными примерами."
      },
      {
        number: 29,
        title: "Нормы грамматические",
        topic: "Грамматические нормы современного русского языка",
        aspects: "Согласование подлежащего и сказуемого, управление, построение сложных форм; исправление грамматически неверных конструкций."
      },
      {
        number: 30,
        title: "Текст как система средств",
        topic: "Лексические, морфологические и синтаксические средства выразительности",
        aspects: "Синонимы, антонимы, фразеологизмы; выбор грамматических форм; синтаксические конструкции (однородные, обороты) как средство выразительности."
      },
      {
        number: 31,
        title: "Анализ текста",
        topic: "Комплексный языковой разбор текста",
        aspects: "Определение темы и основной мысли; анализ лексики, морфологии, синтаксиса и пунктуации; выявление авторских приёмов."
      },
      {
        number: 32,
        title: "Изложение с языковым заданием",
        topic: "Письменная передача содержания текста",
        aspects: "Работа с планом; сохранение логики и стиля исходного текста; выполнение дополнительного языкового задания (найти/объяснить орфограммы, обороты и др.)."
      },
      {
        number: 33,
        title: "Сочинение-рассуждение по тексту",
        topic: "Аргументация и собственная позиция",
        aspects: "Постановка проблемы, формулировка позиции автора и своей; подбор аргументов; речевые клише для логики и связности."
      },
      {
        number: 34,
        title: "Тренировочный контроль",
        topic: "Комбинированная работа по орфографии и пунктуации",
        aspects: "Задания на орфограммы в разных частях речи + пунктуация в осложнённом простом; исправление ошибок; краткий анализ допущенных нарушений."
      },
      {
        number: 35,
        title: "Итоговая комплексная работа",
        topic: "Итог по морфологии, орфографии и элементам синтаксиса",
        aspects: "Проверка: формообразование, словообразование, ключевые орфограммы, осложнённое простое предложение, обороты; письменный фрагмент текста."
      },
      {
        number: 36,
        title: "Итоговый урок по 8 классу",
        topic: "Обобщение курса русского языка 8 класса",
        aspects: "Систематизация: морфология (прилагательное, причастие, деепричастие, наречие, местоимение, числительное), словообразование, орфография, пунктуация; подготовка к 9 классу."
      }
    ]
  },
  {
    grade: 9,
    title: "Русский язык для 9 класса",
    description: "Курс русского языка для девятого класса с подготовкой к ОГЭ и систематизацией знаний по синтаксису, пунктуации и орфографии.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит по русскому языку",
        topic: "Диагностика знаний за 5–8 классы",
        aspects: "Проверка базовых орфограмм, частей речи, простого/сложного предложения; выявление типичных ошибок; фиксация индивидуальных зон риска."
      },
      {
        number: 2,
        title: "Предложение, высказывание, текст",
        topic: "Единицы синтаксиса и речи",
        aspects: "Отличие предложения от высказывания; текст, тема, основная мысль, микротема; абзац как единица композиции; средства связи предложений."
      },
      {
        number: 3,
        title: "Стили и жанры речи",
        topic: "Функциональные стили и жанровое разнообразие",
        aspects: "Разговорный, художественный, научный, публицистический, официально-деловой стили; типичные жанры (статья, рецензия, выступление, заявление и др.); требования к языку в каждом стиле."
      },
      {
        number: 4,
        title: "Простое и сложное предложение",
        topic: "Сопоставление простого и сложного предложения",
        aspects: "Количество грамматических основ; интонация и знаки препинания; типы связи частей: сочинительная, подчинительная, бессоюзная (обзор)."
      },
      {
        number: 5,
        title: "Сложное предложение с подчинительной связью",
        topic: "Общее понятие о сложноподчинённом предложении (СПП)",
        aspects: "Главная и придаточная части; союзные слова и союзы; схемы СПП; базовые случаи постановки запятой."
      },
      {
        number: 6,
        title: "Варианты расположения придаточных",
        topic: "Структурные модели СПП",
        aspects: "Придаточное до, после и внутри главной части; несколько придаточных; схемы и интонация; влияние порядка частей на смысл."
      },
      {
        number: 7,
        title: "Придаточные определительные",
        topic: "СПП с придаточными определительными",
        aspects: "Связь с определяемым словом; союзные слова который, какой, чей, где и др.; формы связи; знаки препинания; типичные ошибки."
      },
      {
        number: 8,
        title: "Придаточные изъяснительные",
        topic: "СПП с придаточными изъяснительными",
        aspects: "Заменяют дополнение; союзные слова что, чтобы, как, ли и др.; вопросы от главной части; разграничение изъяснительных и определительных."
      },
      {
        number: 9,
        title: "Придаточные обстоятельственные места и времени",
        topic: "СПП с придаточными места/времени",
        aspects: "Вопросы где? куда? откуда? когда? с каких пор? до каких пор?; союзные слова где, когда, пока, едва, как только и др.; схемы, пунктуация."
      },
      {
        number: 10,
        title: "Придаточные причины и цели",
        topic: "СПП с придаточными причины/цели",
        aspects: "Вопросы почему? по какой причине? с какой целью?; союзы потому что, так как, чтобы, для того чтобы; семантические оттенки; знаки препинания."
      },
      {
        number: 11,
        title: "Придаточные условия, уступки, следствия",
        topic: "СПП с обстоятельственными придаточными (продолжение)",
        aspects: "Вопросы при каком условии? несмотря на что? в результате чего?; союзы если, когда, хотя, несмотря на то что, так что и др.; сопоставление значений."
      },
      {
        number: 12,
        title: "Однородное и неоднородное подчинение",
        topic: "Структура сложноподчинённых с несколькими придаточными",
        aspects: "Однородное, неоднородное, последовательное подчинение; схемы сложных СПП; расстановка запятых; анализ типовых экзаменационных конструкций."
      },
      {
        number: 13,
        title: "Бессоюзное сложное предложение",
        topic: "БСП и смысловые отношения между частями",
        aspects: "Отсутствие союзов; перечисление, противопоставление, причина–следствие, пояснение; выбор знака (запятая, тире, двоеточие) по смыслу и интонации."
      },
      {
        number: 14,
        title: "Сложные предложения с разными видами связи",
        topic: "Комбинированные конструкции: ССП, СПП, БСП в одном предложении",
        aspects: "Схемы сложных предложений с несколькими способами связи; порядок частей; логика расстановки знаков; разбор сложных примеров из текстов."
      },
      {
        number: 15,
        title: "Повтор: осложнённое простое предложение",
        topic: "Осложнённое простое предложение и его типы",
        aspects: "Однородные члены, обособленные определения и приложения, уточнения, вводные конструкции, обращения; совмещение с сложным предложением."
      },
      {
        number: 16,
        title: "Причастный оборот: повтор и углубление",
        topic: "Обособленные определения, причастный оборот",
        aspects: "Причастие и его признаки; структура оборота; случаи обязательного/необязательного обособления; типичные ошибки построения и пунктуации."
      },
      {
        number: 17,
        title: "Деепричастный оборот: повтор и ошибки",
        topic: "Деепричастие и деепричастный оборот",
        aspects: "Единство деятеля; недопустимые конструкции (деепричастие при страдательной форме, безличном предложении и др.); исправление нарушений."
      },
      {
        number: 18,
        title: "Прямая речь и диалог: продвинутый уровень",
        topic: "Прямая речь, слова автора, диалог",
        aspects: "Все типовые схемы прямой речи; знаки препинания при словах автора внутри прямой речи; оформление диалога; цитирование и включение чужой речи."
      },
      {
        number: 19,
        title: "Лексические нормы",
        topic: "Точность и уместность словоупотребления",
        aspects: "Лексические ошибки, паронимы, речевые штампы, тавтология, лишние слова; корректировка текста; словари как инструмент контроля."
      },
      {
        number: 20,
        title: "Грамматические нормы",
        topic: "Нормы грамматики и синтаксиса",
        aspects: "Согласование подлежащего и сказуемого, управление, построение сложных и осложнённых конструкций; типовые синтаксические ошибки и их исправление."
      },
      {
        number: 21,
        title: "Орфоэпические и морфологические нормы",
        topic: "Произносительные и формы слов",
        aspects: "Орфоэпические нормы (обзорно для речи); правильные формы слов (род, число, падеж, степени сравнения); фиксация частых ошибок живой речи."
      },
      {
        number: 22,
        title: "Культура письменной речи",
        topic: "Логичность, связность, уместность",
        aspects: "Логические ошибки (подмена тезиса, подмена основания, \"подвешенные\" части); связующие средства (лексические, грамматические, композиционные); уместность стиля и тона."
      },
      {
        number: 23,
        title: "Текст в формате экзамена",
        topic: "Анализ исходного текста (формат ОГЭ)",
        aspects: "Определение темы и проблемы текста; позиция автора; ключевые языковые средства; отработка заданий на понимание и анализ."
      },
      {
        number: 24,
        title: "Изложение с элементами сжатия",
        topic: "Пересказ текста с сохранением смысла",
        aspects: "Приёмы сжатия: исключение, обобщение, упрощение; выделение опорных смыслов; сохранение авторского стиля и логики."
      },
      {
        number: 25,
        title: "Сочинение-рассуждение по тексту",
        topic: "Проблема текста, позиция автора, собственное мнение",
        aspects: "Структура: вступление, комментарий к проблеме, позиция автора, аргументация собственной позиции, вывод; речевые клише; работа с примером высокого уровня."
      },
      {
        number: 26,
        title: "Аргументация и примеры",
        topic: "Логика аргументации в письменной работе",
        aspects: "Виды аргументов (из текста, из личного опыта, из литературы, истории); связь аргумента и тезиса; типичные провалы аргументации и их устранение."
      },
      {
        number: 27,
        title: "Орфография под итог",
        topic: "Систематизация ключевых орфограмм",
        aspects: "Безударные гласные, парные/непроизносимые/удвоенные согласные, приставки (в т.ч. пре-/при-), суффиксы, Н/НН, НЕ/НИ; работа с орфографическим минимумом ОГЭ."
      },
      {
        number: 28,
        title: "Пунктуация под итог (простое)",
        topic: "Повтор пунктуации в простом и осложнённом предложении",
        aspects: "Однородные члены, обособленные обороты, вводные, обращения, уточнения, присоединительные конструкции; интегрованные задания."
      },
      {
        number: 29,
        title: "Пунктуация под итог (сложное)",
        topic: "Повтор пунктуации в сложном предложении",
        aspects: "ССП, СПП, БСП, предложения с разными видами связи; выбор знака на основе смысла и структуры; работа по схемам и текстам."
      },
      {
        number: 30,
        title: "Комплексная тренировочная работа",
        topic: "Смешанные задания по орфографии, пунктуации и тексту",
        aspects: "Формат близкий к экзаменационному: тестовая часть + работа с текстом + мини-письменное высказывание; анализ допущенных ошибок."
      },
      {
        number: 31,
        title: "Редактирование текста",
        topic: "Исправление орфографических, пунктуационных и речевых ошибок",
        aspects: "Алгоритм редактирования; поиск всех видов нарушений; приведение текста к нормативной форме; рефакторинг \"сыраого\" ученического текста."
      },
      {
        number: 32,
        title: "Официально-деловая переписка",
        topic: "Документы: заявление, расписка, объяснительная и др.",
        aspects: "Структура и реквизиты основных документов; языковые формулы; орфография и пунктуация в официально-деловом стиле."
      },
      {
        number: 33,
        title: "Публичное выступление",
        topic: "Подготовка устной речи",
        aspects: "Композиция выступления; языковые средства для воздействия на аудиторию; работа с тезисами и планом; речевой этикет."
      },
      {
        number: 34,
        title: "Итоговая комплексная работа",
        topic: "Итоговая проверка знаний и умений",
        aspects: "Обобщающая работа по всему курсу 9 класса: орфография, пунктуация, синтаксис, культура речи, анализ текста, письменное высказывание."
      },
      {
        number: 35,
        title: "Разбор итоговых результатов",
        topic: "Анализ ошибок, индивидуальные траектории",
        aspects: "Детальный разбор итоговой работы; классификация ошибок; выработка индивидуальных рекомендаций по подготовке к старшей школе/экзаменам."
      },
      {
        number: 36,
        title: "Рефлексивно-заключительный урок",
        topic: "Русский язык и дальнейшее обучение",
        aspects: "Итог по 5–9 классам: что умеем (орфография, пунктуация, текст, речь), где рост; роль русского языка в профессиональной и личной коммуникации; постановка целей на 10–11 классы."
      }
    ]
  },
  {
    grade: 10,
    title: "Русский язык для 10 класса",
    description: "Курс русского языка для десятого класса с углубленным изучением сложного синтаксиса, стилистики и подготовкой к ЕГЭ.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит",
        topic: "Повтор ключевых тем 5–9 классов",
        aspects: "Единицы языка: слово, словосочетание, предложение, текст; простое/сложное, осложнённые конструкции, СПП/ССП/БСП; базовые орфограммы и пунктуация; фиксация \"зон риска\" по классу."
      },
      {
        number: 2,
        title: "Язык как система",
        topic: "Уровни языка и нормы",
        aspects: "Уровни: фонетический, лексический, морфологический, синтаксический, текстовый; понятие языковой нормы; кодификация нормы (словарь, грамматика, орфоэпический и орфографический справочник)."
      },
      {
        number: 3,
        title: "Функциональные стили 2.0",
        topic: "Стили и подстили речи",
        aspects: "Разговорный, художественный, научный, официально-деловой, публицистический; ключевые признаки каждого стиля; типичные жанры; критерий \"уместности\" стиля."
      },
      {
        number: 4,
        title: "Лексика и её ресурсы",
        topic: "Лексическое богатство языка",
        aspects: "Многозначность, омонимы, синонимы, антонимы, паронимы; фразеологизмы; лексические пласты (общеупотребительная, профессиональная, разговорная, книжная, просторечная)."
      },
      {
        number: 5,
        title: "Средства выразительности: лексика",
        topic: "Лексические средства художественной речи",
        aspects: "Эпитет, метафора, сравнение, метонимия, гипербола, литота и др.; оценочная лексика; роль лексики в создании образа и авторской позиции."
      },
      {
        number: 6,
        title: "Средства выразительности: синтаксис",
        topic: "Синтаксические средства выразительности",
        aspects: "Риторические вопросы, обращения, восклицания; анафора, эпифора, параллелизм, инверсия; эллипсис; градация и др.; влияние синтаксиса на стиль и тон текста."
      },
      {
        number: 7,
        title: "Культура речи: точность",
        topic: "Нормы словоупотребления",
        aspects: "Лексические ошибки (смешение паронимов, неверная сочетаемость, лишние слова, штампы); отстройка \"делового\" и \"разговорного\" регистров; работа с примерами и редактирование."
      },
      {
        number: 8,
        title: "Культура речи: логика и связность",
        topic: "Логичность и связность высказывания",
        aspects: "Логические ошибки (подмена тезиса, \"висящие\" части, несогласованность); средства связи: лексические повторы, синонимы, местоимения, союзы, вводные слова; абзац как единица композиции."
      },
      {
        number: 9,
        title: "Комплексный текстовый анализ",
        topic: "Текст как система средств",
        aspects: "Тема, проблема, основная мысль; стилистические и языковые средства (лексика, морфология, синтаксис, пунктуация); работа с небольшим художественным/публицистическим текстом."
      },
      {
        number: 10,
        title: "Сложное предложение: системный вход",
        topic: "Общая характеристика сложного предложения",
        aspects: "Повтор типов связи: сочинительная, подчинительная, бессоюзная; сопоставление простого и сложного; интонация и пунктуация; краткий обзор ССП, СПП, БСП."
      },
      {
        number: 11,
        title: "ССП на новой глубине",
        topic: "Сложносочинённое предложение",
        aspects: "Часть сложного с союзами И, А, НО, ИЛИ, ЛИБО и др.; смысловые отношения (соединение, противопоставление, выбор); запятая и случаи её отсутствия; отличие ССП от простого с однородными членами."
      },
      {
        number: 12,
        title: "СПП: общая модель",
        topic: "Сложноподчинённое предложение",
        aspects: "Главная и придаточная часть; средства связи: союзы и союзные слова; порядок частей; схемы СПП; различие СПП/ССП/БСП по структуре и смыслу."
      },
      {
        number: 13,
        title: "Классификация придаточных",
        topic: "Типы придаточных предложений",
        aspects: "Определительные, изъяснительные, обстоятельственные (места, времени, причины, цели, условия, уступки, следствия, сравнения); вопросы и опорные союзы/союзные слова; работа с примерами."
      },
      {
        number: 14,
        title: "Придаточные определительные",
        topic: "СПП с придаточными определительными",
        aspects: "Определяемое слово, связь с местоимениями и существительными; союзные слова который, какой, где, когда, чей и др.; пунктуация; типичные ошибки (двойное определяемое и т.п.)."
      },
      {
        number: 15,
        title: "Придаточные изъяснительные",
        topic: "СПП с придаточными изъяснительными",
        aspects: "Замена дополнения; вопросы косвенных падежей; союзы что, чтобы, будто, как, ли и др.; разграничение изъяснительных и определительных; схемы."
      },
      {
        number: 16,
        title: "Придаточные места и времени",
        topic: "Обстоятельственные придаточные места/времени",
        aspects: "Вопросы где? куда? откуда? когда? с каких пор? до каких пор?; союзы и союзные слова где, куда, откуда, когда, пока, едва, лишь только и др.; знаки препинания."
      },
      {
        number: 17,
        title: "Придаточные причины и следствия",
        topic: "Обстоятельственные придаточные причины/следствия",
        aspects: "Вопросы почему? по какой причине? в результате чего?; союзы потому что, так как, ибо, благодаря тому что, в связи с тем что, так что и др.; оттенки значения, пунктуация."
      },
      {
        number: 18,
        title: "Придаточные цели, условия, уступки",
        topic: "Обстоятельственные придаточные цели/условия/уступки",
        aspects: "Вопросы с какой целью? при каком условии? несмотря на что?; союзы чтобы, для того чтобы, если, когда, хотя, пусть, несмотря на то что; анализ семантики и пунктуации."
      },
      {
        number: 19,
        title: "Придаточные сравнения и образа действия",
        topic: "Обстоятельственные придаточные сравнения/образа действия",
        aspects: "Сравнительные конструкции: как, словно, будто, как будто; разграничение придаточных и несогласованных определений/оборотных сравнений; знаки препинания."
      },
      {
        number: 20,
        title: "Несколько придаточных: однородное подчинение",
        topic: "СПП с однородным подчинением",
        aspects: "Несколько придаточных с одним и тем же вопросом и союзом/союзным словом; запятая между однородными придаточными; схемы; сопоставление с однородными членами."
      },
      {
        number: 21,
        title: "Несколько придаточных: неоднородное и последовательное",
        topic: "СПП с неоднородным и последовательным подчинением",
        aspects: "Придаточные, относящиеся к разным словам/частям; придаточное внутри придаточного; сложные схемы СПП; расстановка запятых и смысловые акценты."
      },
      {
        number: 22,
        title: "Смешанные типы подчинения",
        topic: "Сложная система придаточных",
        aspects: "Сочетание однородного, неоднородного и последовательного подчинения в одном СПП; работа по схемам ЕГЭ-профиля; разбор сложных примеров."
      },
      {
        number: 23,
        title: "БСП в деталях",
        topic: "Бессоюзное сложное предложение",
        aspects: "Виды смысловых отношений частей БСП (перечисление, противопоставление, причина–следствие, пояснение, следствие, время); выбор запятая/тире/двоеточие; сопоставление с союзной связью."
      },
      {
        number: 24,
        title: "Разные виды связи в одном предложении",
        topic: "Сложные предложения с разными видами связи",
        aspects: "Комбо: ССП + СПП, СПП + БСП, ССП + БСП; схемы многокомпонентных конструкций; стратегия анализа: поиск основ, определение связи, постановка знаков."
      },
      {
        number: 25,
        title: "Сложные синтаксические целые",
        topic: "Синтаксис текста",
        aspects: "Сложное синтаксическое целое (ССЦ); связь предложений внутри абзаца; повтор, параллелизм, местоименные связи, лексические повторы и синонимы; микротемы и их языковое оформление."
      },
      {
        number: 26,
        title: "Синтаксис и выразительность",
        topic: "Сложные конструкции как средство стиля",
        aspects: "Влияние сложных предложений и осложнённых конструкций на стиль текста; ритм, темп, \"дыхание\" текста; сравнение вариантов с простыми и сложными конструкциями."
      },
      {
        number: 27,
        title: "Орфография в контексте сложных конструкций",
        topic: "Ключевые орфограммы в сложном предложении",
        aspects: "Н/НН, НЕ/НИ, приставки, суффиксы, причастия/деепричастия, наречия и местоимения — на материале сложных предложений; комплексный разбор (орфография + пунктуация)."
      },
      {
        number: 28,
        title: "Речевые и синтаксические ошибки",
        topic: "Диагностика и исправление ошибок",
        aspects: "Лексические, грамматические, синтаксические и логические ошибки; искажение смысла при неверной пунктуации; алгоритм редактирования текста."
      },
      {
        number: 29,
        title: "Анализ текста в экзаменационном формате",
        topic: "Текст, проблема, позиция автора",
        aspects: "Тренировка чтения и анализа текста \"под ЕГЭ\": определение темы и проблемы, формулирование позиции автора, выделение ключевых микротем и языковых средств."
      },
      {
        number: 30,
        title: "Комментарий к проблеме текста",
        topic: "Навык написания комментария",
        aspects: "Структура комментария: примеры-иллюстрации, пояснения, смысловые связи; типовые ошибки (пересказ, подмена проблемы, формальность); тренинг на коротких текстах."
      },
      {
        number: 31,
        title: "Сочинение-рассуждение по тексту",
        topic: "Структура и логика сочинения",
        aspects: "Вступление (выход на проблему), комментарий, позиция автора, собственная позиция с аргументами, вывод; речевые клише; работа с примерами высокого уровня."
      },
      {
        number: 32,
        title: "Лингвистическое сочинение",
        topic: "Сочинение на лингвистическую тему",
        aspects: "Комментирование высказываний о языке; постановка тезиса; аргументация на языковом материале (лексика, грамматика, синтаксис, речь); оформление вывода."
      },
      {
        number: 33,
        title: "Публичная речь и риторика",
        topic: "Подготовка устного выступления",
        aspects: "Структура выступления; тезисный план; приёмы удержания внимания аудитории; речевые маркеры начала/переходов/завершения; работа с интонацией."
      },
      {
        number: 34,
        title: "Тренировочная комплексная работа",
        topic: "Интегрированная работа по синтаксису, орфографии и речи",
        aspects: "Блок тестовых заданий + анализ текста + небольшой письменный фрагмент (мини-сочинение/комментарий); анализ ошибок."
      },
      {
        number: 35,
        title: "Итоговая контрольная по году",
        topic: "Итог по синтаксису и культуре речи 10 класса",
        aspects: "Проверка: сложные предложения всех типов, осложнённые конструкции, орфография на их фоне, анализ текста и мини-сочинение; первичный прогон под формат 11 класса."
      },
      {
        number: 36,
        title: "Рефлексивный итог",
        topic: "Обобщение курса русского языка 10 класса",
        aspects: "Сводная карта знаний: сложное предложение, синтаксис текста, культура речи, основы экзаменационного письма; фиксация индивидуальных задач на 11 класс."
      }
    ]
  },
  {
    grade: 11,
    title: "Русский язык для 11 класса",
    description: "Курс русского языка для одиннадцатого класса с интенсивной подготовкой к ЕГЭ, систематизацией знаний и развитием навыков экзаменационного анализа.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит и цели года",
        topic: "Повтор и диагностика по русскому языку",
        aspects: "Краткий срез: орфография, пунктуация, синтаксис сложного предложения, работа с текстом и сочинением; фиксация типичных ошибок; постановка целей подготовки к выпускным экзаменам."
      },
      {
        number: 2,
        title: "Русский язык как система и как экзамен",
        topic: "Языковые уровни и структура выпускного контроля",
        aspects: "Уровни языка (фонетика, лексика, словообразование, морфология, синтаксис, текст); понятие нормы; обзор форм контроля (тест + работа с текстом + сочинение/эссе)."
      },
      {
        number: 3,
        title: "Текст, проблема, позиция автора",
        topic: "Текст как объект анализа",
        aspects: "Тема, проблема, основная мысль; позиция автора; микротемы и абзацное членение; языковые маркеры авторской позиции; первичный разбор экзаменационного текста."
      },
      {
        number: 4,
        title: "Функциональные стили и жанры",
        topic: "Стили, жанры, речевые задачи",
        aspects: "Повтор стилистики: разговорный, художественный, научный, публицистический, официально-деловой; жанры школьной и экзаменационной практики; критерий уместности."
      },
      {
        number: 5,
        title: "Лексика и фразеология в анализе текста",
        topic: "Лексические средства и их функция",
        aspects: "Синонимы, антонимы, паронимы, фразеологизмы, экспрессивная лексика; лексические повторы, синонимические замены; их роль в раскрытии проблемы и позиции автора."
      },
      {
        number: 6,
        title: "Орфографический минимум выпускника",
        topic: "Систематизация ключевых орфограмм",
        aspects: "Безударные гласные, парные/непроизносимые/удвоенные согласные, приставки (з/с, пре-/при-), суффиксы, Н/НН, НЕ/НИ, слитно/раздельно/дефисно; алгоритм орфографического действия."
      },
      {
        number: 7,
        title: "Орфография в сложных случаях",
        topic: "Точечные \"ловушки\" орфографии",
        aspects: "Н/НН в причастиях и прилагательных; суффиксы -ЕК/-ИК, -ЕВ-/-ИВ-, -ОВ-/-ЕВ-, наречия и местоимения с приставками и частицами; тренинг по смешанному материалу."
      },
      {
        number: 8,
        title: "Пунктуационный минимум выпускника",
        topic: "Систематизация пунктуации в простом предложении",
        aspects: "Однородные члены, обособленные определения и приложения, уточнения, присоединительные конструкции, вводные, обращения; связь пунктуации и синтаксиса."
      },
      {
        number: 9,
        title: "Пунктуация в сложном предложении",
        topic: "Пунктуация в ССП, СПП, БСП",
        aspects: "Знаки препинания в сложносочинённых, сложноподчинённых, бессоюзных предложениях; предложения с разными видами связи; работа по схемам и текстам."
      },
      {
        number: 10,
        title: "Сложное предложение и текст",
        topic: "Сложные конструкции как средство организации текста",
        aspects: "Роль сложных конструкций в формировании темпоритма, логики и выразительности текста; сравнение вариантов текста с разным синтаксисом."
      },
      {
        number: 11,
        title: "Повтор: причастие и причастный оборот",
        topic: "Обособленные определения и причастные конструкции",
        aspects: "Причастие как форма глагола; структура причастного оборота; случаи обособления/необособления; типичные речевые и пунктуационные ошибки, их коррекция."
      },
      {
        number: 12,
        title: "Повтор: деепричастие и деепричастный оборот",
        topic: "Обособленные обстоятельства и ошибка \"не тот деятель\"",
        aspects: "Значение деепричастия; деепричастный оборот; требование единства деятеля; недопустимые конструкции; исправление \"типовых\" нарушений."
      },
      {
        number: 13,
        title: "Сложноподчинённое предложение: систематизация",
        topic: "Типы придаточных, виды подчинения",
        aspects: "Определительные, изъяснительные, обстоятельственные придаточные; однородное, неоднородное, последовательное и смешанное подчинение; схемы и выбор знаков препинания."
      },
      {
        number: 14,
        title: "Бессоюзное сложное и варианты смысла",
        topic: "БСП и выбор знака",
        aspects: "Смысловые отношения частей БСП (перечисление, причина–следствие, пояснение, противопоставление, следствие, время); выбор запятая/двоеточие/тире; сопоставление с союзной связью."
      },
      {
        number: 15,
        title: "Предложения с разными видами связи",
        topic: "Комбинированные сложные конструкции",
        aspects: "ССП + СПП, СПП + БСП, ССП + БСП; поиск грамматических основ, установление типов связи; разработка схем; типовые экзаменационные конструкции."
      },
      {
        number: 16,
        title: "Синтаксические и пунктуационные ошибки",
        topic: "Нарушения построения и расстановки знаков",
        aspects: "Ошибки согласования, управления, построения сложных и осложнённых предложений; \"висящие\" обороты; неверная пунктуация, меняющая смысл; редактирование."
      },
      {
        number: 17,
        title: "Речевые ошибки в экзаменационных работах",
        topic: "Лексические, грамматические, логические ошибки",
        aspects: "Неверное словоупотребление, паронимы, штампы, тавтология, логические разрывы; анализ реальных (обезличенных) примеров; выработка алгоритма редактирования."
      },
      {
        number: 18,
        title: "Анализ текста: пошаговый алгоритм",
        topic: "От чтения к аналитическому комментарию",
        aspects: "Последовательность: внимательное чтение → выделение темы и проблемы → определение позиции автора → фиксация ключевых фрагментов текста; работа с маркером/пометами."
      },
      {
        number: 19,
        title: "Формулировка проблемы текста",
        topic: "Видовые проблемы и корректная формулировка",
        aspects: "Проблематика: нравственная, социальная, экологическая, культурная и др.; типичные ошибки формулировки (слишком узко/широко/подмена темы); тренинг на кратких текстах."
      },
      {
        number: 20,
        title: "Позиция автора",
        topic: "Выделение и формулирование позиции автора",
        aspects: "Языковые маркеры авторской позиции; различие \"проблема\" и \"позиция автора\"; краткая, точная формулировка; опора на ключевые предложения текста."
      },
      {
        number: 21,
        title: "Комментарий к проблеме",
        topic: "Структура и содержание комментария",
        aspects: "Роль комментария; примеры-иллюстрации из текста и объяснение того, как они раскрывают проблему; типовые ошибки (пересказ, подмена комментария анализом языковых средств)."
      },
      {
        number: 22,
        title: "Языковой анализ в комментарии",
        topic: "Включение языковых средств в комментарий",
        aspects: "Как корректно использовать наблюдения над лексикой, синтаксисом, тропами и фигурами в комментарии; примеры формулировок; недопустимые \"формальные\" вставки."
      },
      {
        number: 23,
        title: "Собственная позиция и аргументация",
        topic: "Логика аргументации в сочинении",
        aspects: "Отношение к позиции автора; тезис собственной позиции; виды аргументов (из личного опыта, литературы, истории, наблюдений); типичные ошибки аргументации."
      },
      {
        number: 24,
        title: "Композиция сочинения",
        topic: "Структура сочинения-рассуждения по тексту",
        aspects: "Вступление, логичный выход на проблему, комментарий, позиция автора, собственная позиция + аргументы, вывод; клише и опоры; плотность смысла vs \"водность\"."
      },
      {
        number: 25,
        title: "Языковое оформление сочинения",
        topic: "Связность, точность, выразительность",
        aspects: "Средства связи между абзацами и частями сочинения; логические связки (во-первых, таким образом, кроме того и др.); работа над \"языковым уровнем\" готового текста."
      },
      {
        number: 26,
        title: "Мини-сочинения разных типов",
        topic: "Тренировка на малых форматах",
        aspects: "Короткие высказывания: мини-комментарий, мини-рассуждение, эссе на языковую тему; отработка тезисности и аргументации; контроль ошибок."
      },
      {
        number: 27,
        title: "Лингвистическое сочинение",
        topic: "Сочинение на тему о языке",
        aspects: "Анализ высказываний о русском языке; формулировка тезиса; привлечение примеров из лексики, грамматики, текстов; логическая структура и язык изложения."
      },
      {
        number: 28,
        title: "Изложение и пересказ",
        topic: "Сжатие и развёртывание текста",
        aspects: "Приёмы сжатия (исключение, обобщение, упрощение) и развёртывания (уточнение, детализация, добавление примеров); тренинг устных и письменных вариантов."
      },
      {
        number: 29,
        title: "Комплексная работа с текстом",
        topic: "Анализ + мини-сочинение",
        aspects: "Связка: анализ текста (проблема, позиция, языковые средства) + краткое письменное высказывание в формате экзаменационного задания; пошаговый разбор."
      },
      {
        number: 30,
        title: "Полноформатная пробная работа",
        topic: "Пробное экзаменационное задание по русскому языку",
        aspects: "Выполнение работы в \"боевом\" режиме: тестовая часть + анализ текста + сочинение; регламент по времени; первичная самооценка."
      },
      {
        number: 31,
        title: "Разбор пробной работы",
        topic: "Анализ типичных и индивидуальных ошибок",
        aspects: "Классификация допущенных ошибок (орфография, пунктуация, речевые, логические, композиционные); разбор сильных и слабых сторон; корректировка стратегии подготовки."
      },
      {
        number: 32,
        title: "Прицельная отработка слабых зон",
        topic: "Индивидуализированные тренинги",
        aspects: "Модульные задания по слабым темам (Н/НН, сложные предложения, комментарий, аргументация и др.); короткие циклы \"задание → разбор → переформулировка правила\"."
      },
      {
        number: 33,
        title: "Быстрый синтаксический/пунктуационный разбор",
        topic: "Навык \"быстрого анализа\" в условиях дефицита времени",
        aspects: "Стратегия работы с предложениями на экзамене: поиск грамматических основ, определение способа связи, выявление осложнений; построение схем \"в уме\"."
      },
      {
        number: 34,
        title: "Доводка сочинения до экзаменационного уровня",
        topic: "Итоговый тренинг по сочинению",
        aspects: "Работа по критериям оценивания; типичные \"смертельные\" ошибки; редактирование уже написанных сочинений до условного \"зачётного\" уровня."
      },
      {
        number: 35,
        title: "Итоговая комплексная работа",
        topic: "Финальная проверка готовности",
        aspects: "Ещё одна \"полная\" работа в формате экзамена; сопоставление с первой пробной; оценка динамики; фиксация индивидуальных рекомендаций \"на финиш\"."
      },
      {
        number: 36,
        title: "Рефлексивно-итоговый урок",
        topic: "Итог курса русского языка в школе",
        aspects: "Обобщение: язык как система, как инструмент мышления и коммуникации, как экзаменационная дисциплина; осознание собственных сильных сторон и зон роста; рекомендации по самостоятельной доработке."
      }
    ]
  },
  {
    grade: 90,
    title: "Подготовка к ОГЭ по русскому языку",
    description: "Курс подготовки к Основному государственному экзамену по русскому языку для девятиклассников с системным изучением всех заданий и форматов ОГЭ.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит ОГЭ",
        topic: "Формат ОГЭ по русскому языку и диагностика",
        aspects: "Структура работы (задания по тексту + изложение + сочинение); типы заданий; критерии оценивания; пробный мини-тест для выявления слабых зон."
      },
      {
        number: 2,
        title: "Текст ОГЭ: что от нас хотят",
        topic: "Анализ исходного текста (общий подход)",
        aspects: "Быстрое чтение и вдумчивое перечитывание; тема и основная мысль; важные фрагменты (ключевые абзацы, повторы, контрасты); пометки в тексте."
      },
      {
        number: 3,
        title: "Задания 1–3: понимание прочитанного",
        topic: "Смысловое чтение: фактическая информация",
        aspects: "Вопросы на понимание фактов; поиск ответа в тексте; \"ловушки\" (подмена формулировки, почти-синонимы); тренировка по нескольким текстам."
      },
      {
        number: 4,
        title: "Задания 4–5: средства связи",
        topic: "Средства связи предложений в тексте",
        aspects: "Лексические повторы, синонимы, местоимения, союзы, вводные слова; определение, к какому предложению относится данное; тренировка на типовых формулировках."
      },
      {
        number: 5,
        title: "Задание на микротему и абзац",
        topic: "Микротемы, абзацное членение",
        aspects: "Определение микротем; нахождение предложений, не соответствующих теме абзаца; восстановление логичной последовательности."
      },
      {
        number: 6,
        title: "Лексика и контекст",
        topic: "Лексическое значение, синонимы, антонимы",
        aspects: "Понимание значения слова по контексту; выбор синонима/антонима из списка; отличие многозначного слова от омонимов на уровне ОГЭ."
      },
      {
        number: 7,
        title: "Орфография ОГЭ: обзор",
        topic: "Орфографический минимум экзамена",
        aspects: "Безударные гласные, парные/непроизносимые/удвоенные согласные, приставки (в т.ч. з/с, пре-/при-), суффиксы, Н/НН, НЕ/НИ; распределение орфограмм по заданиям."
      },
      {
        number: 8,
        title: "Безударные гласные и парные согласные",
        topic: "Задания на проверяемые орфограммы",
        aspects: "Алгоритм проверки; подбор проверочных слов; различие \"проверяемая/чередующаяся\"; разбор типовых тестовых формулировок."
      },
      {
        number: 9,
        title: "Непроизносимые и удвоенные согласные",
        topic: "Сложные согласные в корне и суффиксах",
        aspects: "Проверка через однокоренные слова; группы слов-ловушек; работа по спискам и в формате теста."
      },
      {
        number: 10,
        title: "Приставки и предлоги",
        topic: "Разграничение приставок и предлогов, з/с, пре-/при-",
        aspects: "Написание приставок; правило з/с; смысловые основы пре-/при-; ловушки на стыке слова и предлога; задания в формате ОГЭ."
      },
      {
        number: 11,
        title: "Суффиксы имён существительных и прилагательных",
        topic: "-ЕК/-ИК, -ЕЦ/-ИЦ, -ЧИК/-ЩИК и др.",
        aspects: "Выбор суффикса по ударению и звуку; влияние основы; типичные слова-ловушки; привязка к конкретным тестовым заданиям."
      },
      {
        number: 12,
        title: "Н и НН: часть 1",
        topic: "Н/НН в прилагательных",
        aspects: "Суффиксы -АН-/-ЯН-/-ИН-, -ЕНН-/-ОНН-; краткие формы; словообразовательный подход; таблица-опора под ОГЭ."
      },
      {
        number: 13,
        title: "Н и НН: часть 2",
        topic: "Н/НН в причастиях и отглагольных прилагательных",
        aspects: "Суффиксы причастий, наличие зависимых слов, приставки, краткие формы; разграничение причастия/прилагательного; разбор типичных экзаменационных примеров."
      },
      {
        number: 14,
        title: "НЕ и НИ в орфографии",
        topic: "НЕ/НИ с разными частями речи",
        aspects: "Основные случаи: НЕ с существительными, прилагательными, наречиями, глаголами, причастиями; НИ в устойчивых конструкциях и отрицаниях; таблица-опора и задания."
      },
      {
        number: 15,
        title: "Наречия, местоимения, союзы, частицы",
        topic: "Орфограммы в служебных и местоименных словах",
        aspects: "Слитное/раздельное/дефисное написание наречий, местоимений, союзов и частиц; типовые ошибки; задания по образцу экзамена."
      },
      {
        number: 16,
        title: "Пунктуация ОГЭ: обзор",
        topic: "Пунктуационный минимум экзамена",
        aspects: "Простое и осложнённое предложение; однородные члены, обращения, вводные, уточнения, причастные и деепричастные обороты; связь пунктуации и синтаксиса."
      },
      {
        number: 17,
        title: "Однородные члены и запятые",
        topic: "Запятая при однородных членах",
        aspects: "Союзы И, А, НО, ИЛИ; случаи без запятой; различие однородных и неоднородных; отработка в формате тестов."
      },
      {
        number: 18,
        title: "Обращения, вводные слова, уточнения",
        topic: "Обособленные элементы в простом предложении",
        aspects: "Распознавание обращений, вводных, уточняющих членов; постановка запятых; смысл и интонация; задания по образцу ОГЭ."
      },
      {
        number: 19,
        title: "Причастный оборот",
        topic: "Причастные конструкции и их обособление",
        aspects: "Выделение причастного оборота; случаи обязательного и факультативного обособления; типичные ошибки и ловушки тестов."
      },
      {
        number: 20,
        title: "Деепричастный оборот",
        topic: "Деепричастные конструкции и ошибки",
        aspects: "Единство деятеля; случаи обязательного обособления; анализ \"неправильных\" предложений; задания."
      },
      {
        number: 21,
        title: "Сложносочинённые предложения",
        topic: "ССП и запятая",
        aspects: "Выделение грамматических основ; союзная связь; отличие ССП от простого с однородными; знаки препинания и типовые формулировки задач."
      },
      {
        number: 22,
        title: "Сложноподчинённые предложения",
        topic: "СПП и придаточные",
        aspects: "Главная/придаточная часть; типы придаточных (обзорно); союзы и союзные слова; запятая; различие СПП/БСП на уровне ОГЭ."
      },
      {
        number: 23,
        title: "Бессоюзное сложное предложение",
        topic: "БСП и выбор знака",
        aspects: "Смысловые отношения между частями (перечисление, причина–следствие, противопоставление, пояснение); выбор запятая/тире/двоеточие; задания с анализом контекста."
      },
      {
        number: 24,
        title: "Сложные предложения с разными видами связи",
        topic: "Комбинированные конструкции",
        aspects: "Общее представление о сочетании ССП, СПП и БСП; стратегия: найти основы → определить тип связи → расставить знаки; тестовые задачи повышенного уровня."
      },
      {
        number: 25,
        title: "Комплексный блок \"орфография + пунктуация\"",
        topic: "Смешанные задания по орфографии и пунктуации",
        aspects: "Умение удерживать несколько орфограмм и правил пунктуации в одном тексте; работа с заданиями на редактирование; тренировка \"прогона глазами по всему тексту\"."
      },
      {
        number: 26,
        title: "Изложение: формат ОГЭ",
        topic: "Требования к изложению",
        aspects: "Объём, критерии оценивания; что значит \"полно, точно, логично\"; отличия от пересказа; структура (вступление, основная часть, заключение)."
      },
      {
        number: 27,
        title: "Изложение: приёмы сжатия",
        topic: "Способы сжатия текста",
        aspects: "Исключение подробностей, обобщение, упрощение синтаксиса; сохранение логики и авторской позиции; тренировка на коротких текстах."
      },
      {
        number: 28,
        title: "Изложение: тренировочная запись",
        topic: "Письменное изложение по учебному тексту",
        aspects: "Прослушивание/чтение текста; выделение опорных смыслов; написание изложения с элементами сжатия; само- и взаимо-проверка по критериям."
      },
      {
        number: 29,
        title: "Сочинение ОГЭ: формат и критерии",
        topic: "Структура сочинения-рассуждения по тексту",
        aspects: "Объём, критерии (содержание, речевое оформление, грамотность); структура: позиция автора + собственная позиция + аргументы; типичные темы."
      },
      {
        number: 30,
        title: "Тема и проблема текста в ОГЭ",
        topic: "Чем тема отличается от проблемы",
        aspects: "Примеры формулировок тем и проблем; типичные ошибки (слишком узко, слишком широко, подмена темы); тренинг на микротекстах."
      },
      {
        number: 31,
        title: "Позиция автора и собственная позиция",
        topic: "Как корректно \"увидеть\" и сформулировать позиции",
        aspects: "Языковые маркеры позиции автора (оценочная лексика, утверждения, обобщения); короткая формула собственной позиции; качество аргументации."
      },
      {
        number: 32,
        title: "Аргументы и примеры",
        topic: "Аргументация в сочинении",
        aspects: "Аргументы из текста, собственного опыта, литературы, истории; связь аргумента с проблемой; логика и \"вес\" примера; разбор удачных/неудачных текстов."
      },
      {
        number: 33,
        title: "Язык сочинения",
        topic: "Связность, клише, речевые ошибки",
        aspects: "Стандартные речевые клише для вступления, переходов, вывода; избегание штампов и тавтологии; типовые речевые ошибки и их правка."
      },
      {
        number: 34,
        title: "Полноформатная тренировка ОГЭ",
        topic: "Полная работа в формате экзамена",
        aspects: "Выполнение варианта полностью: задания по тексту + изложение (если тренируете в формате) + сочинение; работа по времени; фиксация трудностей."
      },
      {
        number: 35,
        title: "Разбор пробной работы",
        topic: "Анализ типичных и индивидуальных ошибок",
        aspects: "Классификация ошибок по блокам: текст, орфография, пунктуация, изложение, сочинение; план точечной доработки для каждого ученика."
      },
      {
        number: 36,
        title: "Финальная стратегия на экзамен",
        topic: "Тактика работы и психологическая готовность",
        aspects: "Порядок выполнения заданий; как распределять время; что делать, если \"застрял\"; чек-лист самопроверки; краткое повторение ключевых правил \"одним взглядом\"."
      }
    ]
  },
  {
    grade: 100,
    title: "Подготовка к ЕГЭ по русскому языку",
    description: "Курс подготовки к Единому государственному экзамену по русскому языку для одиннадцатиклассников с комплексным изучением всех заданий КИМ и развитием навыков экзаменационного анализа.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит ЕГЭ",
        topic: "Формат ЕГЭ по русскому языку и диагностика",
        aspects: "Структура КИМ: тестовая часть + сочинение; профиль vs базовый; шкала и критерии; пробный мини-вариант для фиксации стартовых рисков."
      },
      {
        number: 2,
        title: "Архитектура КИМ",
        topic: "Блоки заданий ЕГЭ и приоритеты подготовки",
        aspects: "Группы заданий: орфография, пунктуация, лексика/речь, синтаксис, анализ текста, сочинение; карта соответствия \"тема → номер задания\"; план-график подготовки."
      },
      {
        number: 3,
        title: "Орфография: карта рисков",
        topic: "Орфографический минимум выпускника",
        aspects: "Безударные гласные, парные/непроизносимые/удвоенные согласные, приставки (з/с, пре-/при-), суффиксы, Н/НН, НЕ/НИ, слитно/раздельно/дефисно; алгоритм орфографического действия."
      },
      {
        number: 4,
        title: "Н и НН: базовая конфигурация",
        topic: "Н/НН в прилагательных и причастиях",
        aspects: "Суффиксы -Н-/-НН-; отымённые прилагательные vs причастия; краткие формы; зависимые слова и приставки; типовые \"ловушки\" заданий ЕГЭ."
      },
      {
        number: 5,
        title: "НЕ и НИ: системная настройка",
        topic: "НЕ/НИ с разными частями речи",
        aspects: "НЕ с существительными, прилагательными, наречиями, причастиями, глаголами; НИ в отрицательных конструкциях; таблица-опора; тренинг на смешанном массиве."
      },
      {
        number: 6,
        title: "Слитно, раздельно, дефис",
        topic: "Слитное/раздельное/дефисное написание",
        aspects: "Сложные существительные, прилагательные, наречия, местоимения, частицы и союзы; разграничение \"слово vs сочетание\"; типовые форматы тестовых формулировок."
      },
      {
        number: 7,
        title: "Суффиксы и приставки под ЕГЭ",
        topic: "Проблемные суффиксы и приставки",
        aspects: "-ЕК/-ИК, -ЕЦ/-ИЦ-, -ЕВ-/-ИВ-, -ОВ-/-ЕВ-, -ЧИК-/-ЩИК-, приставки меж-/сверх-, иноязычные элементы; отработка через типовые цепочки \"форма — правило — задание\"."
      },
      {
        number: 8,
        title: "Лексика: база для тестовой части",
        topic: "Лексика, фразеология, паронимы",
        aspects: "Многозначность, омонимы, синонимы, антонимы, фразеологизмы; паронимы и типовые ошибки; лексические нормы и задания на словоупотребление."
      },
      {
        number: 9,
        title: "Функциональные стили и нормы",
        topic: "Стили, жанры, речевые ситуации",
        aspects: "Разговорный, художественный, научный, публицистический, офиц.-деловой; жанры в КИМ; распознавание стилей и подбор корректных языковых средств."
      },
      {
        number: 10,
        title: "Средства выразительности",
        topic: "Лексические и синтаксические средства",
        aspects: "Эпитет, метафора, сравнение, метонимия, гипербола; анафора, параллелизм, риторический вопрос, инверсия; привязка к заданиям анализа текста."
      },
      {
        number: 11,
        title: "Простое и осложнённое",
        topic: "Простое осложнённое предложение",
        aspects: "Однородные члены, обособленные определения/приложения, уточнения, присоединительные конструкции, вводные, обращения; форматы заданий на распознавание и постановку запятых."
      },
      {
        number: 12,
        title: "ССП под прицелом",
        topic: "Сложносочинённое предложение",
        aspects: "Грамматические основы, союзы И, А, НО, ИЛИ, ЛИБО и др.; различие ССП и простого с однородными; знаки препинания; разбор типичных конструкций из КИМ."
      },
      {
        number: 13,
        title: "СПП: общий контур",
        topic: "Сложноподчинённое предложение",
        aspects: "Главная и придаточные; союзные слова/союзы; базовые модели; сравнение со ССП и БСП; типовые задания на определение вида связи и пунктуацию."
      },
      {
        number: 14,
        title: "Придаточные: матрица типов",
        topic: "Типы придаточных и виды подчинения",
        aspects: "Определительные, изъяснительные, обстоятельственные (места, времени, причины, цели, условия, уступки, следствия, сравнения); однородное, неоднородное, последовательное подчинение; схемы уровня ЕГЭ."
      },
      {
        number: 15,
        title: "БСП и знаки по смыслу",
        topic: "Бессоюзное сложное предложение",
        aspects: "Смысловые отношения: перечисление, пояснение, причина–следствие, противопоставление, следствие, время; выбор запятая/двоеточие/тире; сопоставление с союзной связью."
      },
      {
        number: 16,
        title: "Разные виды связи",
        topic: "Сложные предложения с разными видами связи",
        aspects: "Конфигурации \"ССП + СПП\", \"СПП + БСП\", \"ССП + БСП\"; стратегия разбора: поиск основ → тип связи → осложнение; типовые \"долгоиграющие\" конструкции ЕГЭ."
      },
      {
        number: 17,
        title: "Синтаксис + пунктуация: интеграция",
        topic: "Комплексный анализ сложных конструкций",
        aspects: "Пакетная отработка: выделение грамматических основ, типов связи, осложняющих элементов и знаков препинания; микс из задач нескольких номеров КИМ."
      },
      {
        number: 18,
        title: "Синтаксические/речевые ошибки",
        topic: "Нарушения норм построения предложений",
        aspects: "Ошибки согласования, управления, \"висящие\" обороты, смешение конструкций; речевые штампы, тавтологии, паронимы; формат экзаменационных задач на редактирование."
      },
      {
        number: 19,
        title: "Текст: проблема, тема, идея",
        topic: "Анализ исходного текста ЕГЭ",
        aspects: "Чтение с маркёрами; выделение темы, проблемы, основной мысли, микротем; позиция автора; подготовка базы для сочинения (задание 27)."
      },
      {
        number: 20,
        title: "Проблематика текста",
        topic: "Формулировка проблемы текста",
        aspects: "Типовые \"виды\" проблем (нравственные, социальные, культурные и др.); корректная формулировка; границы между темой и проблемой; разбор удачных/неудачных формулировок."
      },
      {
        number: 21,
        title: "Позиция автора",
        topic: "Выявление и формулирование позиции автора",
        aspects: "Текстовые маркеры (кульминационные абзацы, оценочная лексика, обобщения); компактная формула позиции автора; типовые ошибки (подмена позиции своей мыслью)."
      },
      {
        number: 22,
        title: "Комментарий: логика и структура",
        topic: "Комментарий к проблеме текста",
        aspects: "Две смысловые линии/примера, пояснения, смысловая связь между примерами; отличия комментария от пересказа и анализа средств выразительности; критерии оценивания."
      },
      {
        number: 23,
        title: "Комментарий: языковой блок",
        topic: "Встраивание языкового анализа в комментарий",
        aspects: "Как селективно использовать лексические и синтаксические наблюдения; корректные формулировки (\"Автор использует… чтобы…\"); запрет на \"список тропов ради тропов\"."
      },
      {
        number: 24,
        title: "Собственная позиция и аргументация",
        topic: "Позиция экзаменуемого и примеры",
        aspects: "Формулировка своего отношения к позиции автора; аргументы из жизненного опыта, литературы, истории, общественной практики; связка \"тезис → аргумент → микро-вывод\"."
      },
      {
        number: 25,
        title: "Композиция сочинения",
        topic: "Архитектура сочинения-рассуждения",
        aspects: "Стандартная модель: вступление, выход на проблему, комментарий, позиция автора, собственная позиция и аргументация, вывод; абзацное членение; баланс объёма по блокам."
      },
      {
        number: 26,
        title: "Язык сочинения",
        topic: "Речевое оформление и критерии К10–К12",
        aspects: "Связки между частями текста; клише для логики, а не \"ради галочки\"; борьба с штампами и \"водой\"; типовые речевые и грамматические ошибки выпускников."
      },
      {
        number: 27,
        title: "Мини-форматы",
        topic: "Мини-сочинения и микрокомментарии",
        aspects: "Тренировка отдельных сегментов: только комментарий, только формулировка проблемы/позиции, только блок аргументации; быстрый цикл \"написание → разбор → доработка\"."
      },
      {
        number: 28,
        title: "Полноформатное сочинение",
        topic: "Сочинение в режиме \"как на ЕГЭ\"",
        aspects: "Письмо по тексту с соблюдением регламента по времени и объёму; самостоятельное распределение усилий по блокам; первичный самоанализ по критериям."
      },
      {
        number: 29,
        title: "Разбор сочинений",
        topic: "Анализ типовых и индивидуальных ошибок",
        aspects: "Разбор реальных (обезличенных) работ; привязка ошибок к критериям; выработка чек-листа самопроверки перед сдачей работы."
      },
      {
        number: 30,
        title: "Пробный вариант №1",
        topic: "Полный КИМ в боевом режиме",
        aspects: "Выполнение всего варианта ЕГЭ (тест + сочинение) по времени; фиксация затруднений, оценка по реальной/приближённой шкале."
      },
      {
        number: 31,
        title: "Разбор пробного варианта №1",
        topic: "Диагностика и индивидуальные зоны роста",
        aspects: "Декомпозиция ошибок по блокам: орфография, пунктуация, лексика/речь, анализ текста, сочинение; персональные рекомендации и приоритеты доработки."
      },
      {
        number: 32,
        title: "Прицельные модули по слабым темам",
        topic: "Точечная доработка проблемных зон",
        aspects: "Небольшие \"спринты\" под конкретные провалы (Н/НН, сложное предложение, комментарий, аргументы и т.д.); короткий повтор теории + упражнение в экзаменационном формате."
      },
      {
        number: 33,
        title: "Пробный вариант №2",
        topic: "Ещё один полный прогон КИМ",
        aspects: "Работа в условиях, максимально приближенных к реальному экзамену; отработка тайм-менеджмента и стратегии обхода сложных заданий."
      },
      {
        number: 34,
        title: "Разбор пробного варианта №2",
        topic: "Фиксация финальных корректировок",
        aspects: "Сравнение с первым пробником; анализ динамики; точечные корректировки стратегии и тактики (в каком порядке решать, где не застревать, как проверять)."
      },
      {
        number: 35,
        title: "\"Сухой остаток\"",
        topic: "Быстрый повтор ключевых правил и шаблонов",
        aspects: "Сжатые опорные конспекты: орфография, пунктуация, структура анализа текста и сочинения; чек-листы \"перед экзаменом\" и \"после написания работы\"."
      },
      {
        number: 36,
        title: "Финишный созвон",
        topic: "Психологическая и интеллектуальная готовность",
        aspects: "Разбор частых страхов и ошибок поведения на экзамене; финальные рекомендации по режиму, стратегии, самопроверке; фиксация уверенности и \"точек опоры\" для ученика."
      }
    ]
  },
  {
    grade: 200,
    title: "Подготовка к ВУЗу по русскому языку",
    description: "Курс подготовки к академической и профессиональной коммуникации в вузе с развитием навыков научного письма, устного выступления и деловой переписки.",
    lessons: [
      {
        number: 1,
        title: "Язык, университет, профессиональная коммуникация",
        topic: "Русский язык как инструмент академической и профессиональной деятельности",
        aspects: "Коммуникативные задачи в вузе и профессии; устная/письменная коммуникация; виды текстов, с которыми работает студент; ожидания преподавателей к языку и оформлению."
      },
      {
        number: 2,
        title: "Норма и варианты",
        topic: "Языковая норма и её источники",
        aspects: "Литературный язык, понятие нормы; орфоэпические, лексические, грамматические, орфографические, пунктуационные нормы; словари и справочники как инструмент работы."
      },
      {
        number: 3,
        title: "Функциональные стили в вузе",
        topic: "Стили и регистры речи",
        aspects: "Разговорный, научный, официально-деловой, публицистический, художественный; внутристилевые подтипы; какие стили реально нужны студенту (академический, деловой, публичный)."
      },
      {
        number: 4,
        title: "Научный стиль: ДНК текста",
        topic: "Признаки научного и учебно-научного стиля",
        aspects: "Объективность, логичность, доказательность; терминология, клише, безличные и осложнённые конструкции; чем научный текст отличается от школьного сочинения."
      },
      {
        number: 5,
        title: "Академическое письмо: базовый формат",
        topic: "Академический текст как проект",
        aspects: "Текст как решение исследовательской задачи; структура \"введение – основная часть – выводы\"; логика аргументации; понятие академической добросовестности."
      },
      {
        number: 6,
        title: "Тема, проблема, цель",
        topic: "Постановка темы, проблемы и цели работы",
        aspects: "Тема vs предмет исследования; проблема, актуальность, цель, задачи; типовые формулировки для курсовых, докладов, эссе."
      },
      {
        number: 7,
        title: "Источники и литература",
        topic: "Работа с источниками и списком литературы",
        aspects: "Виды источников (книги, статьи, электронные ресурсы, ГОСТы); принципы отбора и критической оценки; базовые форматы библиографического описания."
      },
      {
        number: 8,
        title: "Цитирование и антиплагиат",
        topic: "Цитаты, пересказы, ссылки",
        aspects: "Прямое и косвенное цитирование; оформление ссылок; самоцитирование; недопустимые практики (копипаст, \"пересказ без ссылки\"); антиплагиат глазами преподавателя."
      },
      {
        number: 9,
        title: "Параграф и абзац",
        topic: "Абзац как единица смысловой структуры",
        aspects: "Логика абзаца: тема, микротема, мини-вывод; абзацное членение в научном тексте; типовые ошибки (слишком длинные, \"телеграммные\" абзацы)."
      },
      {
        number: 10,
        title: "Лексика научного текста",
        topic: "Термины, клише, нейтральная лексика",
        aspects: "Терминология vs общенаучная лексика; штампы и \"наукообразие\"; словарная проверка; выстраивание \"языка дисциплины\" в тексте."
      },
      {
        number: 11,
        title: "Логика и связность",
        topic: "Логические связи внутри текста",
        aspects: "Логические ошибки (подмена тезиса, круг в доказательстве, \"висящие\" фрагменты); речевые связки и маркеры (во-первых, таким образом, следовательно и т.п.); обеспечение целостности."
      },
      {
        number: 12,
        title: "Синтаксис научной речи",
        topic: "Синтаксические модели академического текста",
        aspects: "Распространённые предложения, причастные и деепричастные обороты, сложные конструкции; баланс сложности и читаемости; типовые синтаксические ошибки."
      },
      {
        number: 13,
        title: "Речевые ошибки",
        topic: "Лексические, грамматические, логические нарушения",
        aspects: "Неверное словоупотребление, паронимы, штампы, тавтология; ошибки согласования/управления; логические сбои; алгоритм редактирования текста."
      },
      {
        number: 14,
        title: "Введение к работе",
        topic: "Пишем \"Введение\"",
        aspects: "Структура введения: актуальность, цель, задачи, объект, предмет, краткая характеристика источников; практические шаблоны и анти-примеры."
      },
      {
        number: 15,
        title: "Основная часть",
        topic: "Структурирование аргументации",
        aspects: "Линейная и блочная композиция; подзаголовки; логика \"от общих принципов к частному анализу\"; работа с примерами, таблицами, схемами (на уровне языка)."
      },
      {
        number: 16,
        title: "Выводы и заключение",
        topic: "Формулировка результатов и перспектив",
        aspects: "Отличие \"выводов по главам\" от общего заключения; типичные клише и их осмысленное использование; формулирование перспектив дальнейшего исследования."
      },
      {
        number: 17,
        title: "Аннотация и резюме",
        topic: "Краткая презентация текста",
        aspects: "Аннотация, summary, extended abstract (обзорно); структура краткой выжимки; языковые особенности; анти-пересказ: что важно, а что нет."
      },
      {
        number: 18,
        title: "Презентации и доклады",
        topic: "Устное представление результатов",
        aspects: "Структура устного доклада; работа со слайдами; соотношение устной и письменной версии; языковой минимализм в презентации; речевой этикет на защите."
      },
      {
        number: 19,
        title: "Публичное выступление",
        topic: "Риторика и ораторские навыки",
        aspects: "Цель выступления, аудитория, посыл; структура речи; голос, темп, паузы; базовые речевые тактики (возврат к тезису, мостики, резюме)."
      },
      {
        number: 20,
        title: "Официально-деловые тексты студента",
        topic: "Заявления, объяснительные, служебные письма",
        aspects: "Структура и реквизиты; нейтральный деловой стиль; типовые формулировки; вежливые формы просьбы, отказа, уточнения."
      },
      {
        number: 21,
        title: "Электронная коммуникация",
        topic: "Email, мессенджеры, LMS-системы",
        aspects: "Форматы академной переписки; тема письма, обращение, подписание; \"цифровой этикет\" в переписке с преподавателем и администрацией."
      },
      {
        number: 22,
        title: "Командная работа и протоколирование",
        topic: "Язык групповых проектов",
        aspects: "Протокол собрания, распределение задач, фиксация договорённостей; язык конструктивной критики и обратной связи; письменные договорённости в проекте."
      },
      {
        number: 23,
        title: "Рецензия и отзыв",
        topic: "Анализ чужих текстов",
        aspects: "Структура рецензии; критерии оценки (содержание, структура, новизна, язык); язык корректной критики; формулирование рекомендаций."
      },
      {
        number: 24,
        title: "Эссе и рефлексия",
        topic: "Академическое эссе и рефлексивный текст",
        aspects: "Отличие эссе от доклада и статьи; аргументированное личное мнение; композиция; речевая свобода в рамках академического регистра."
      },
      {
        number: 25,
        title: "Междисциплинарная коммуникация",
        topic: "Язык на стыке дисциплин",
        aspects: "Адаптация текста под \"непрофильную\" аудиторию; пояснение терминов; баланс сложности/понятности; избегание профессионального жаргона при внешней коммуникации."
      },
      {
        number: 26,
        title: "Перевод и пересказ научного текста",
        topic: "Реферат и обзор литературы",
        aspects: "Стратегия работы с несколькими источниками; нейтральный язык, без \"кальки\"; структура обзора (по проблемам, по авторам, по хронологии)."
      },
      {
        number: 27,
        title: "Языковая картина мира специальности",
        topic: "Профессиональная терминология и клише",
        aspects: "Ключевые термины конкретного направления; типовые формулы в научных текстах по специальности; риски \"жаргонности\" и \"наукообразия\"."
      },
      {
        number: 28,
        title: "Редактирование собственного текста",
        topic: "Саморедактирование академического текста",
        aspects: "Многоуровневая проверка: структура → логика → язык → орфография/пунктуация; чек-листы; полезные \"паузы\" и приёмы дистанцирования от текста."
      },
      {
        number: 29,
        title: "Работа с рецензией научрука",
        topic: "Диалог с научным руководителем через текст",
        aspects: "Интерпретация замечаний; приоритизация правок; ведение версий документа; корректные письменные ответы на комментарии."
      },
      {
        number: 30,
        title: "Подготовка курсовой/проектной работы",
        topic: "Интеграция всех элементов",
        aspects: "Планирование работы во времени; разбивка на этапы (подбор источников, план, черновик, правка, оформление); языковые риски на каждом этапе."
      },
      {
        number: 31,
        title: "Пробная \"мини-курсовая\"",
        topic: "Малый письменный проект",
        aspects: "Написание укороченной версии аналитической работы (структура реальной курсовой, но меньший объём); последующий разбор ошибок и сильных сторон."
      },
      {
        number: 32,
        title: "Типичные фатальные ошибки",
        topic: "Кейс-ревю провальных текстов",
        aspects: "Разбор реальных анонимизированных работ: несоблюдение структуры, плагиат, логические провалы, языковой хаос; формирование \"черного списка\" приёмов."
      },
      {
        number: 33,
        title: "Индивидуальные языковые дефициты",
        topic: "Персональные траектории доработки",
        aspects: "Анализ накопленных ошибок студента; персональные задачи (лексика, синтаксис, орфография, логика); план доработки вне занятия."
      },
      {
        number: 34,
        title: "Итоговая комплексная работа",
        topic: "Полноформатный академический текст",
        aspects: "Выполнение итогового письменного задания: мини-исследование/эссе/аналитический обзор с требованием соблюдения всех языковых и структурных норм."
      },
      {
        number: 35,
        title: "Разбор итоговых работ",
        topic: "Обратная связь и доработка",
        aspects: "Детальный анализ итоговых текстов; обсуждение типовых и индивидуальных ошибок; совместная правка фрагментов; фиксация прогресса."
      },
      {
        number: 36,
        title: "Язык как профессиональный актив",
        topic: "Рефлексия и перенос навыков",
        aspects: "Как полученные навыки транслируются в резюме, собеседование, рабочую переписку, доклады, статьи; личный план развития языковой компетентности."
      }
    ]
  },
  {
    grade: 1,
    title: "Китайский язык для 1 класса",
    description: "Вводный курс китайского языка для первоклассников с акцентом на базовую лексику, фонетику и простые диалоги.",
    lessons: [
      {
        number: 1,
        title: "Знакомство с китайским",
        topic: "Вводный урок",
        aspects: "Где говорят по-китайски; особенности языка; иероглифы vs буквы; правила поведения на уроке; базовое приветствие 你好 (nǐ hǎo)."
      },
      {
        number: 2,
        title: "«Привет, учитель!»",
        topic: "Приветствия",
        aspects: "Лексика: 你好, 再见; обращение к учителю и одноклассникам; простые речевые модели приветствия и прощания; отработка интонации."
      },
      {
        number: 3,
        title: "«Как тебя зовут?»",
        topic: "Представление себя",
        aspects: "Модель: 我叫…; введение имён на китайском (транскрипция); диалог «— Как тебя зовут? — Меня зовут…»; тренировка в парах."
      },
      {
        number: 4,
        title: "Звуки и тончики",
        topic: "Фонетика и тоны",
        aspects: "Знакомство с 4 тонами; слуховые упражнения «услышь тон»; подражание учителю; игра на различение тонов."
      },
      {
        number: 5,
        title: "Считаем до пяти",
        topic: "Числа 1–5",
        aspects: "Лексика: 一, 二, 三, 四, 五; счёт предметов в классе; игры на счёт (хлопки, шаги); письменный образ цифр (без иероглифов или в виде картинки)."
      },
      {
        number: 6,
        title: "Считаем до десяти",
        topic: "Числа 6–10",
        aspects: "Лексика: 六–十; жесты hands-числа; счёт учеников, карандашей, книг; речевые модели «Сколько? — …»."
      },
      {
        number: 7,
        title: "«Сколько тебе лет?»",
        topic: "Возраст",
        aspects: "Модель: 我…岁; связь с числами; мини-диалоги про возраст; тренировка «найди одноклассника по возрасту»."
      },
      {
        number: 8,
        title: "Итог по теме «Привет и числа»",
        topic: "Обобщающий",
        aspects: "Повтор приветствий, имён, возраста и чисел; игровое тестирование (карточки, лото); песенка с числами."
      },
      {
        number: 9,
        title: "Цветной мир",
        topic: "Цвета 1",
        aspects: "Лексика: 红, 黄, 蓝, 绿; сопоставление с предметами в классе; игра «Найди цвет»; скажи цвет по образцу."
      },
      {
        number: 10,
        title: "Ещё больше цветов",
        topic: "Цвета 2",
        aspects: "Доп. лексика: 白, 黑, 粉; описываем предмет: «красная ручка» и т.п.; упражнения «угадай цвет» по описанию учителя."
      },
      {
        number: 11,
        title: "Игрушки по-китайски",
        topic: "Игрушки",
        aspects: "Лексика: мяч, кукла, машинка (в транскрипции); сочетание «цвет + игрушка»; модель «У меня есть …» (我有…); мини-диалоги."
      },
      {
        number: 12,
        title: "Моя любимая игрушка",
        topic: "Описание",
        aspects: "Повтор цветов и игрушек; модель «Я люблю …»; рассказ о любимой игрушке с опорой на картинки; групповая презентация."
      },
      {
        number: 13,
        title: "В классе",
        topic: "Предметы в классе",
        aspects: "Лексика: стол, стул, книга, ручка (в транскрипции); команды учителя (в 1–2 простых фразах); игра «Что пропало?» с предметами."
      },
      {
        number: 14,
        title: "Вежливые слова",
        topic: "Этикет",
        aspects: "Лексика: спасибо, пожалуйста, извините (китайские эквиваленты); отработка формул вежливости в простых ситуациях; ролевые мини-сценки."
      },
      {
        number: 15,
        title: "Китайская школа",
        topic: "Страна и школа",
        aspects: "Краткий рассказ об уроках в китайской школе (на русском); сравнение с российской; 2–3 ключевых слова по-китайски; просмотр иллюстраций/фото."
      },
      {
        number: 16,
        title: "Повтор блока «Цвета и класс»",
        topic: "Обобщающий",
        aspects: "Проверка лексики: цвета, игрушки, предметы класса; игры: лото, «слова по кругу»; мини-контроль в устной форме."
      },
      {
        number: 17,
        title: "Моя семья",
        topic: "Члены семьи 1",
        aspects: "Лексика: мама, папа; слово «семья»; модель «Это моя мама/папа»; работа с семейными картинками."
      },
      {
        number: 18,
        title: "Вся семья в сборе",
        topic: "Члены семьи 2",
        aspects: "Лексика: бабушка, дедушка, брат, сестра; схема родственных связей; описываем свою семью по картинке."
      },
      {
        number: 19,
        title: "«Кто это?»",
        topic: "Вопросы о семье",
        aspects: "Модель «Кто это?» + ответ; отработка в парах с карточками; игра «Угадай, кто в семье»."
      },
      {
        number: 20,
        title: "Праздники семьи",
        topic: "Семейные традиции",
        aspects: "Рассказ учителя о семейных праздниках в Китае (Новый год и др. — в очень простом виде); 1–2 слова на китайском; рисование «моя семья на празднике»."
      },
      {
        number: 21,
        title: "Домашние животные",
        topic: "Животные 1",
        aspects: "Лексика: кошка, собака, рыбка; вопросы «Кто это?» по картинкам; звукоподражание; игра «Живой словарь»."
      },
      {
        number: 22,
        title: "Зоопарк",
        topic: "Животные 2",
        aspects: "Лексика: панда, тигр и др. базовые; культурный акцент на панде; описываем любимое животное (цвет, размер)."
      },
      {
        number: 23,
        title: "Что ты любишь?",
        topic: "Предпочтения",
        aspects: "Модель «Я люблю…/не люблю…» с животными и игрушками; упражнения «найди того, кто любит то же самое»."
      },
      {
        number: 24,
        title: "Повтор блока «Семья и животные»",
        topic: "Обобщающий",
        aspects: "Систематизация лексики семьи и животных; игровые формы контроля; устный мини-зачёт."
      },
      {
        number: 25,
        title: "Вкусный китайский",
        topic: "Еда 1",
        aspects: "Лексика: рис, вода, чай (в транскрипции); рассказ учителя о палочках; диалог «Что ты любишь?» про еду (на ограниченном наборе слов)."
      },
      {
        number: 26,
        title: "Фрукты",
        topic: "Еда 2",
        aspects: "Лексика: яблоко, банан, апельсин; соединение с цветами; игра «магазин фруктов» с простыми фразами."
      },
      {
        number: 27,
        title: "В школьной столовой",
        topic: "Еда 3",
        aspects: "Повтор еды; модель «Я хочу…» в игровой сценке «столовая»; формулы вежливости при просьбе."
      },
      {
        number: 28,
        title: "Китайский Новый год",
        topic: "Культура и праздник",
        aspects: "Базовая информация о 春节 (на русском); 2–3 ключевых слова и выражения по-китайски; символика красного цвета и фонариков; творческое задание (аппликация/рисунок)."
      },
      {
        number: 29,
        title: "Погода и сезоны",
        topic: "Погода",
        aspects: "Лексика: жарко/холодно, зима/лето; показ на картинках; жесты и мимика; простые фразы типа «Зимой холодно»."
      },
      {
        number: 30,
        title: "Одежда по сезону",
        topic: "Одежда",
        aspects: "Лексика: куртка, шапка, платье/футболка (частично в русско-китайской опоре); сопоставление «сезон — одежда»; игра «одень человечка»."
      },
      {
        number: 31,
        title: "Первые иероглифы",
        topic: "Графика и письмо",
        aspects: "Понятие «черта»; базовые виды черт (горизонтальная, вертикальная) на уровне рисунка; прописывание 1–2 очень простых иероглифов крупно (под руководством учителя)."
      },
      {
        number: 32,
        title: "Мой мини-словарик",
        topic: "Закрепление лексики",
        aspects: "Составление личного мини-словаря (картинка + китайское слово в транскрипции и/или иероглиф); систематизация тем: «я», «семья», «школа», «игрушки», «животные», «еда»."
      },
      {
        number: 33,
        title: "Повтор всего года",
        topic: "Итоговый",
        aspects: "Повтор ключевой лексики и фраз за год; серия игр и групповых заданий; устные мини-диалоги по темам."
      },
      {
        number: 34,
        title: "Праздник «Мы говорим по-китайски!»",
        topic: "Заключительный",
        aspects: "Небольшая «презентация» умений: стишок/песенка, несколько фраз о себе; позитивное подведение итогов; обсуждение, что дети уже умеют на китайском."
      }
    ]
  },
  {
    grade: 2,
    title: "Китайский язык для 2 класса",
    description: "Курс китайского языка для второклассников с углубленным изучением фонетики, лексики и простых предложений.",
    lessons: [
      {
        number: 1,
        title: "Повторим, что знаем",
        topic: "Актуализация 1 класса",
        aspects: "Приветствия, представление, возраст, семья, базовые цвета и числа; короткие диалоги; быстрая диагностика уровня класса."
      },
      {
        number: 2,
        title: "Китайский язык и пиньинь",
        topic: "Введение в пиньинь",
        aspects: "Повтор тонов; понятие «пиньинь»; простые слоги ma, ba, da; тренировка чтения по пиньинь с опорой на картинки."
      },
      {
        number: 3,
        title: "Звуки m, b, p, f",
        topic: "Фонетика 1",
        aspects: "Отработка и различение звуков m, b, p, f; слоги ma, ba, pa, fa; игры на слуховое различение; связка звук–картинка."
      },
      {
        number: 4,
        title: "Звуки d, t, n, l",
        topic: "Фонетика 2",
        aspects: "Слоги da, ta, na, la; тренировка чтения слогов в пиньинь; ритмические речёвки; работа в парах «я читаю — ты показываешь картинку»."
      },
      {
        number: 5,
        title: "Мой день в школе",
        topic: "Распорядок дня 1",
        aspects: "Лексика: школа, урок, перемена; модели: «Я в школе», «У меня урок…»; простейшие структуры с 我 (я); повтор чисел для обозначения уроков."
      },
      {
        number: 6,
        title: "Мой школьный день по часам",
        topic: "Распорядок дня 2",
        aspects: "Лексика: утро, день, вечер; элементарные слова времени (现在, 早上); схема «утром — в школу, днём — уроки»; устное описание по картинкам."
      },
      {
        number: 7,
        title: "Дни недели",
        topic: "Календарь 1",
        aspects: "Лексика: 星期一–星期五 (без полной отработки всех 7 при необходимости); связь «день недели — урок китайского»; устные мини-диалоги «какой сегодня день?»."
      },
      {
        number: 8,
        title: "Повтор блока «Школа и время»",
        topic: "Обобщающий",
        aspects: "Систематизация: пиньинь-слоги, школа, дни недели; аудио–игры, лото, командные задания; короткие устные ответы по образцу."
      },
      {
        number: 9,
        title: "Моё лицо",
        topic: "Части тела 1",
        aspects: "Лексика: глаза, нос, рот, уши; модель «Это мои…»; игра «портрет по описанию»; сопоставление с картинками."
      },
      {
        number: 10,
        title: "Моё тело",
        topic: "Части тела 2",
        aspects: "Лексика: руки, ноги, голова; команды: «подними руку», «постучи ногой»; активная физическая разминка с китайскими словами."
      },
      {
        number: 11,
        title: "У кого что?",
        topic: "Описание внешности",
        aspects: "Модели: «У него большие глаза» (упрощённо, с опорой на картинки и жесты); сравнение персонажей; игра «Узнай по описанию»."
      },
      {
        number: 12,
        title: "Я умею, я не умею",
        topic: "Умения",
        aspects: "Лексика: рисовать, петь, бегать (в пиньинь); модель «Я умею/не умею…» (我会…); мини-презентация «что я умею»."
      },
      {
        number: 13,
        title: "Мой класс и любимый предмет",
        topic: "Школа и предметы",
        aspects: "Лексика: китайский, математика, рисование; модель «Я люблю урок …»; связка с днями недели: «в понедельник у меня…»."
      },
      {
        number: 14,
        title: "Вежливое поведение",
        topic: "Этикет 2",
        aspects: "Расширение вежливых формул: «извините», «можно…?», «спасибо большое» (谢谢, 对不起, 请); ролевые сценки в классе и в столовой."
      },
      {
        number: 15,
        title: "Повтор блока «Тело и школа»",
        topic: "Обобщающий",
        aspects: "Контроль лексики: части тела, умения, предметы; задания в формате игр; фронтальный опрос в мягком режиме."
      },
      {
        number: 16,
        title: "Мой дом",
        topic: "Дом 1",
        aspects: "Лексика: дом, комната, кухня, спальня (в пиньинь + иероглиф 家); модель «Это мой дом»; описание дома по картинке."
      },
      {
        number: 17,
        title: "В моей комнате",
        topic: "Дом 2",
        aspects: "Лексика: кровать, стол, стул, лампа; модель «В комнате есть…» (房间里有… с опорой на схему); игра «найди предмет в комнате»."
      },
      {
        number: 18,
        title: "У меня есть…",
        topic: "Конструкция «有»",
        aspects: "Повтор конструкции 我有…; расширение: «У меня есть комната, у меня есть игрушки»; использование классификатора 个 для людей и некоторых предметов."
      },
      {
        number: 19,
        title: "Мой район",
        topic: "Окружение",
        aspects: "Лексика: парк, магазин, школа (расширение); модель «Рядом с домом есть…»; рисунок «мой район» с подписями."
      },
      {
        number: 20,
        title: "Мои друзья",
        topic: "Дружба",
        aspects: "Лексика: друг, одноклассник; модели обращения друг к другу; диалоги: «Это мой друг…», «Он/она любит…»."
      },
      {
        number: 21,
        title: "Повтор блока «Дом и друзья»",
        topic: "Обобщающий",
        aspects: "Проверка тем «дом», «комната», «район», «друзья»; устные монологи по опорным картинкам; игровые задания в группах."
      },
      {
        number: 22,
        title: "Любимые игры и занятия",
        topic: "Хобби 1",
        aspects: "Лексика: играть в мяч, смотреть мультики, читать (простые формы); модель «Я люблю…», «Мой друг любит…»; опрос класса с мини-статистикой."
      },
      {
        number: 23,
        title: "Спорт и движение",
        topic: "Хобби 2",
        aspects: "Лексика: футбол, бегать, прыгать; связь с глаголами «уметь» 会; мини-сценки «мы на спортплощадке»."
      },
      {
        number: 24,
        title: "Что ты делаешь после школы?",
        topic: "Свободное время",
        aspects: "Модели: «После школы я…» (последовательность действий, описываем по картинкам); закрепление лексики хобби и дома."
      },
      {
        number: 25,
        title: "Магазин",
        topic: "Покупки 1",
        aspects: "Лексика: магазин, покупать, деньги (простые слова); диалог по образцу «Я хочу купить…»; повтор фруктов/еды из 1 класса."
      },
      {
        number: 26,
        title: "В магазине сладостей",
        topic: "Покупки 2",
        aspects: "Лексика: конфеты, печенье, сок; конструкция «сколько стоит?» в пассивной форме (без точных чисел, упор на фразеологию); ролевая игра «магазин»."
      },
      {
        number: 27,
        title: "Погода и одежда 2.0",
        topic: "Погода/одежда",
        aspects: "Повтор «жарко/холодно», сезоны; расширение одежды: штаны, рубашка, платье; связь «какая погода — что надеваем»."
      },
      {
        number: 28,
        title: "Путешествия и транспорт",
        topic: "Транспорт",
        aspects: "Лексика: машина, автобус, поезд; модель «Я еду в школу на…»; сравнение способов добраться до школы."
      },
      {
        number: 29,
        title: "Немного про Китай",
        topic: "Страна и культура",
        aspects: "Краткий рассказ о крупных городах (Пекин, Шанхай) на русском; 2–3 новых слова по-китайски; иллюстрации, карта; обсуждение, как туда можно доехать."
      },
      {
        number: 30,
        title: "Первые предложения с иероглифами",
        topic: "Письмо 1",
        aspects: "Повтор черт и структуры иероглифа; прописывание 2–3 простых иероглифов (я 我, ты 你, дом 家 и др. по выбору учителя); соединение иероглифа с короткой фразой."
      },
      {
        number: 31,
        title: "Мой мини-текст о себе",
        topic: "Письмо 2",
        aspects: "Составление очень короткого текста о себе: «Меня зовут…, мне … лет, у меня есть…» с элементами пиньинь и выбранными иероглифами; работа по шаблону."
      },
      {
        number: 32,
        title: "Повтор всего года",
        topic: "Итоговый 1",
        aspects: "Итоговая систематизация лексики: тело, дом, школа, хобби, покупки, транспорт; устные мини-диалоги и монологи с опорой; командные игры."
      },
      {
        number: 33,
        title: "Контроль устной речи",
        topic: "Итоговый 2",
        aspects: "Индивидуальные/парные устные ответы по карточкам-заданиям; оценка произношения, понимания вопросов, умения строить простую фразу."
      },
      {
        number: 34,
        title: "Праздник «Мы уже почти по-китайски!»",
        topic: "Заключительный",
        aspects: "Небольшие выступления: рассказ о себе, о семье или о дне; демонстрация умения читать пиньинь и нескольких иероглифов; подведение итогов и мотивация к обучению в 3 классе."
      }
    ]
  },
  {
    grade: 3,
    title: "Китайский язык для 3 класса",
    description: "Курс китайского языка для третьеклассников с систематизацией фонетики, расширением лексики и развитием навыков устной речи.",
    lessons: [
      {
        number: 1,
        title: "Перезагрузка знаний",
        topic: "Повтор 1–2 класса",
        aspects: "Приветствия, представление, возраст, семья, школа, хобби; проверка базового пиньинь; короткие диалоги «о себе»."
      },
      {
        number: 2,
        title: "Пиньинь без паники",
        topic: "Углубление пиньинь",
        aspects: "Систематизация тонов; повтор базовых слогов; чтение коротких цепочек слогов по пиньинь; работа над произношением."
      },
      {
        number: 3,
        title: "Новые звуки и слоги",
        topic: "Фонетика: сочетания",
        aspects: "Звуки j, q, x, zh, ch, sh, r; тренировка слогов (ji, qi, xi, zhi и др.); различение на слух; игры «кто быстрее прочитает»."
      },
      {
        number: 4,
        title: "Я и мой характер",
        topic: "Описание себя",
        aspects: "Лексика: добрый, весёлый, спокойный и др. (в пиньинь); модели «Я …» (我是…), «Я весёлый/добрый»; мини-презентация себя."
      },
      {
        number: 5,
        title: "Мои чувства",
        topic: "Эмоции",
        aspects: "Лексика: рад, грустный, злой, усталый; модель «Я сейчас…»; отработка мимикой и жестами; реакция на вопрос «Как ты?» (你好吗?)."
      },
      {
        number: 6,
        title: "Семья 2.0",
        topic: "Расширенное описание семьи",
        aspects: "Повтор членов семьи; добавление признаков: «моя мама добрая», «мой брат любит футбол»; простые описательные предложения."
      },
      {
        number: 7,
        title: "Вопросы о семье",
        topic: "Вопросительные слова",
        aspects: "Вопросы: кто? (谁), сколько? (几); модели: «У тебя есть братья/сёстры?», «Сколько тебе лет?»; диалоги в парах."
      },
      {
        number: 8,
        title: "Повтор блока «Я и семья»",
        topic: "Обобщающий",
        aspects: "Контроль лексики «характер, чувства, семья»; мини-диалоги; устные мини-монологи «моя семья»."
      },
      {
        number: 9,
        title: "Мой учебный день",
        topic: "Распорядок дня",
        aspects: "Лексика: просыпаться, умываться, завтракать, делать уроки; последовательность действий; рассказ «мой день» по картинкам."
      },
      {
        number: 10,
        title: "Время по-китайски (упрощённо)",
        topic: "Время суток, часы без точных минут",
        aspects: "Уточнение: утро, день, вечер, ночь; модель «я встаю утром», «вечером я…»; введение слова 现在 (сейчас) в устной речи."
      },
      {
        number: 11,
        title: "Школа и предметы",
        topic: "Учебные предметы",
        aspects: "Расширение: русский язык, английский, музыка, физкультура; модели «у меня есть урок…», «я люблю/не люблю…»."
      },
      {
        number: 12,
        title: "Домашка и отдых",
        topic: "После школы",
        aspects: "Лексика: домашнее задание, отдыхать, играть; модель «после школы я сначала…, потом…»; связка с хобби."
      },
      {
        number: 13,
        title: "Повтор блока «День и школа»",
        topic: "Обобщающий",
        aspects: "Систематизация: распорядок дня, время суток, предметы; устные рассказы с опорой на картинки; работа в парах."
      },
      {
        number: 14,
        title: "Мой дом и квартира",
        topic: "Тип жилья",
        aspects: "Лексика: квартира, этаж, комната, гостиная; повтор иероглифа 家; модели «Я живу в…», «У меня дома есть…»."
      },
      {
        number: 15,
        title: "Внутри дома",
        topic: "Описание жилья",
        aspects: "Лексика: диван, шкаф, телевизор и др.; конструкция «в комнате есть…» (房间里有…); устное описание квартиры."
      },
      {
        number: 16,
        title: "Порядок в комнате",
        topic: "Действия дома",
        aspects: "Лексика: убирать, складывать, мыть; связка с обязанностями: «я убираю комнату», «я помогаю маме»; обсуждение по картинкам."
      },
      {
        number: 17,
        title: "Мой район и город",
        topic: "Городская среда",
        aspects: "Лексика: улица, площадь, кинотеатр, библиотека; модели «рядом с домом есть…»; мини-карта района с подписями."
      },
      {
        number: 18,
        title: "Повтор блока «Дом и город»",
        topic: "Обобщающий",
        aspects: "Контроль лексики по дому и городу; устные описания «мой дом», «мой район»; работа в группах."
      },
      {
        number: 19,
        title: "Еда: что люблю",
        topic: "Еда и напитки 2.0",
        aspects: "Расширение: суп, мясо, молоко, хлеб; конструкция «я люблю/не люблю есть…»; обсуждение любимых блюд."
      },
      {
        number: 20,
        title: "В столовой и кафе",
        topic: "Лёгкие диалоги о еде",
        aspects: "Модели: «я хочу…», «пожалуйста», «спасибо»; простейший диалог «в кафе/столовой»; закрепление вежливых формул."
      },
      {
        number: 21,
        title: "Китайская кухня",
        topic: "Страна и культура через еду",
        aspects: "Лексика: пельмени 饺子, лапша 面条, рис 米饭; культурный комментарий (на русском); сопоставление с российской кухней."
      },
      {
        number: 22,
        title: "В магазине",
        topic: "Покупки 3.0",
        aspects: "Повтор лексики «магазин, покупать»; модели «мне нужно…», «сколько стоит?» (形式); ролевая игра «покупки»."
      },
      {
        number: 23,
        title: "Повтор блока «Еда и покупки»",
        topic: "Обобщающий",
        aspects: "Игры: «меню», «магазин», «угости друга»; проверка устойчивых фраз и вежливых выражений."
      },
      {
        number: 24,
        title: "Погода и времена года",
        topic: "Погода 3.0",
        aspects: "Расширение: облачно, идёт дождь/снег, ветер; фразы «сегодня…», «осенью холодно»; работа с картой погоды (картинки)."
      },
      {
        number: 25,
        title: "Путешествия внутри Китая",
        topic: "География и транспорт",
        aspects: "Повтор транспорта (машина, поезд, самолёт); города Китая: 北京, 上海, 广州; фразы: «я хочу поехать в…»."
      },
      {
        number: 26,
        title: "Праздники и традиции",
        topic: "Культура",
        aspects: "Китайский Новый год, Праздник середины осени (на русском); 2–3 слова по-китайски, связанные с праздником; символы и традиции."
      },
      {
        number: 27,
        title: "Моё свободное время",
        topic: "Хобби и кружки",
        aspects: "Лексика: кружок, секция, танцы, музыка; фразы «я хожу в кружок…», «мне нравится…»; мини-опрос класса."
      },
      {
        number: 28,
        title: "Планируем выходные",
        topic: "Будущее действие (упрощённо)",
        aspects: "Модель «на выходных я буду…» (в устной речи, без грамматического усложнения); составление устного плана выходных."
      },
      {
        number: 29,
        title: "Первые связные тексты",
        topic: "Связная речь",
        aspects: "Построение текста из 3–4 предложений: «меня зовут…, я живу…, я хожу в школу…, в свободное время я…»; устно и по плану."
      },
      {
        number: 30,
        title: "Иероглифы: повтор и расширение",
        topic: "Письмо 3.0",
        aspects: "Повтор базовых иероглифов (я, ты, дом, семья); прописывание новых 2–3 иероглифов (ученик 学生, школа 学校 и др. по выбору учителя); понятие «ключ» (очень упрощённо)."
      },
      {
        number: 31,
        title: "Мини-словарь 3 класса",
        topic: "Лексическая систематизация",
        aspects: "Формирование тематического словаря: «я и семья, дом, школа, еда, город»; работа с карточками (иероглиф + пиньинь + картинка)."
      },
      {
        number: 32,
        title: "Итоговая устная проверка",
        topic: "Проверка говорения",
        aspects: "Индивидуальные/парные диалоги по темам года; оценка произношения, понимания и умения отвечать на вопросы."
      },
      {
        number: 33,
        title: "Итоговая лексико-грамматическая проверка",
        topic: "Проверка понимания и письма",
        aspects: "Небольшие задания на чтение пиньинь, узнавание иероглифов, выбор подходящих слов; проверка мини-писем (2–3 иероглифа + пиньинь)."
      },
      {
        number: 34,
        title: "Праздник «Мы говорим по-китайски лучше!»",
        topic: "Заключительный",
        aspects: "Мини-выступления: рассказ о себе, семье, дне, хобби; презентация мини-проектов (плакат «мой город/мой день»); фиксация результатов и мотивация к 4 классу."
      }
    ]
  },
  {
    grade: 4,
    title: "Китайский язык для 4 класса",
    description: "Курс китайского языка для четвероклассников с автоматизацией фонетики, развитием навыков чтения, письма и проектной деятельности.",
    lessons: [
      {
        number: 1,
        title: "Диагностика и перезапуск",
        topic: "Повтор 1–3 класса",
        aspects: "Приветствие, представление, семья, дом, школа, хобби; базовые структуры 我是…, 我有…, 我喜欢…; чтение простого текста по пиньинь; оценка стартового уровня."
      },
      {
        number: 2,
        title: "Пиньинь: доводим до автоматизма",
        topic: "Систематизация пиньинь",
        aspects: "Повтор всех тонов и основных слогов; чтение цепочек слогов; различение близких звуков (q/x, zh/z, ch/c, sh/s); минимальные пары."
      },
      {
        number: 3,
        title: "Настроим произношение",
        topic: "Фонетический тренинг",
        aspects: "Отработка интонирования вопросительных и утвердительных предложений; скороговорки и ритмические речёвки; групповая коррекция произношения."
      },
      {
        number: 4,
        title: "Кто я в школе?",
        topic: "Расширенное самопрезентование",
        aspects: "Лексика: класс, ученик, одноклассник; модели: 我在…上学, 我是四年级学生; мини-презентация «я в школе» (3–4 предложения)."
      },
      {
        number: 5,
        title: "Мой школьный день по часам",
        topic: "Время и распорядок",
        aspects: "Лексика: час, половина, сейчас; упрощённые конструкции времени; описание школьного дня с привязкой ко времени; устный рассказ по схеме."
      },
      {
        number: 6,
        title: "Вопросы к собеседнику",
        topic: "Вопросительные конструкции",
        aspects: "Частицы 吗, 呢; вопросы о возрасте, классе, школе, расписании; диалоги в парах с чередованием ролей."
      },
      {
        number: 7,
        title: "Семья: кто чем занимается",
        topic: "Профессии и занятия",
        aspects: "Лексика: учитель, врач, водитель и др.; структура «кто кем работает» (他是老师); описание семьи с указанием профессий/занятий."
      },
      {
        number: 8,
        title: "Повтор блока «Я, школа, семья»",
        topic: "Обобщающий",
        aspects: "Контроль лексики и структур: самопрезентация, профессии, вопросы; устные мини-монологи и диалоги с взаимной оценкой."
      },
      {
        number: 9,
        title: "Где это находится?",
        topic: "Местонахождение (在)",
        aspects: "Конструкция …在…; лексика: стол, парта, доска, шкаф, библиотека; модели «книга на столе», «школа в городе»; работа со схемами."
      },
      {
        number: 10,
        title: "В моём районе и городе",
        topic: "Городская инфраструктура",
        aspects: "Расширение: больница, супермаркет, остановка, почта; описание «что где находится»; мини-карты и диалоги по ним."
      },
      {
        number: 11,
        title: "Как добраться?",
        topic: "Транспорт и маршруты",
        aspects: "Лексика: ехать, идти, поворачивать; простые маршруты «из дома в школу»; отработка «я еду на автобусе/поезде»; упражнения по картам."
      },
      {
        number: 12,
        title: "Мой путь в школу",
        topic: "Связный рассказ",
        aspects: "Сборка лексики по теме «город и транспорт» в короткий рассказ (4–5 предложений) устно; выделение ключевых слов."
      },
      {
        number: 13,
        title: "Повтор блока «Город и транспорт»",
        topic: "Обобщающий",
        aspects: "Проверка понимания конструкций с 在; работа с картой: «найди, расскажи, спроси путь»; командные задания."
      },
      {
        number: 14,
        title: "Еда дома и вне дома",
        topic: "Еда 4.0",
        aspects: "Расширение: завтрак, обед, ужин, блюда; конструкции «я обычно ем…», «я люблю/не люблю»; сравнение еды дома и в столовой."
      },
      {
        number: 15,
        title: "В кафе и ресторане",
        topic: "Диалоги обслуживания",
        aspects: "Лексика: меню, официант, заказать; диалоги по шаблону: приветствие, заказ, благодарность; формулы вежливости; отработка в парах."
      },
      {
        number: 16,
        title: "Китайские блюда в деталях",
        topic: "Культура через еду",
        aspects: "Повтор: 饺子, 面条, 米饭 + новые позиции; краткий рассказ (на русском) о традиционных блюдах; сопоставление с российской кухней; описание любимого блюда."
      },
      {
        number: 17,
        title: "Покупки по списку",
        topic: "Магазин и покупки",
        aspects: "Лексика: список, килограмм, бутылка (упрощённо); модели «мне нужно купить…», «пожалуйста, дайте…»; диалоги «покупки по списку»."
      },
      {
        number: 18,
        title: "Повтор блока «Еда и покупки»",
        topic: "Обобщающий",
        aspects: "Игровые сценарии «кафе», «магазин», «рынок»; проверка ключевой лексики и устойчивых выражений; устные мини-сцены."
      },
      {
        number: 19,
        title: "Погода в разных городах",
        topic: "Погода и климат",
        aspects: "Расширение: температура, солнечно, пасмурно; описание погоды в разных городах (по картинкам); сравнение «у нас — в Китае»."
      },
      {
        number: 20,
        title: "Планируем поездку",
        topic: "Путешествия и планы",
        aspects: "Лексика: путешествовать, отдыхать, экскурсия; устные планы: «летом я хочу поехать…», «там жарко/холодно»; связка с транспортом и погодой."
      },
      {
        number: 21,
        title: "Праздники круглый год",
        topic: "Календарь и праздники",
        aspects: "Повтор китайских праздников + российские; календарная лексика: месяц, число (упрощённо); фразы «праздник в таком-то месяце»."
      },
      {
        number: 22,
        title: "Повтор блока «Погода, путешествия, праздники»",
        topic: "Обобщающий",
        aspects: "Систематизация лексики; рассказы «идеальная поездка», «мой любимый праздник»; работа в мини-группах."
      },
      {
        number: 23,
        title: "Иероглифы и ключи",
        topic: "Письмо: система",
        aspects: "Понятие «ключ» и базовые примеры (человек, вода, рот и др.); разбор 2–3 знакомых иероглифов по структуре; тренировка написания по порядку черт."
      },
      {
        number: 24,
        title: "Пишем аккуратно",
        topic: "Техника письма",
        aspects: "Закрепление написания 3–4 иероглифов (учитель выбирает по темам года); отработка порядка черт; копирование с образца и письмо по памяти."
      },
      {
        number: 25,
        title: "Читаем и понимаем",
        topic: "Чтение по пиньинь и иероглифам",
        aspects: "Короткий текст (5–6 предложений) с опорой на пиньинь и частью знакомых иероглифов; чтение вслух; выделение ключевых слов; ответы на простые вопросы по тексту."
      },
      {
        number: 26,
        title: "Пишем о себе и семье",
        topic: "Письменное высказывание",
        aspects: "Составление короткого связного текста (5–6 предложений) о себе и семье: имя, возраст, класс, семья, хобби; использование некоторых иероглифов в тексте."
      },
      {
        number: 27,
        title: "Пишем о своём дне",
        topic: "Письменное высказывание 2",
        aspects: "Текст о типичном дне: подъём, школа, уроки, хобби; опорные фразы и план; использование временных маркеров «утром, днём, вечером»."
      },
      {
        number: 28,
        title: "Коммуникация онлайн и офлайн",
        topic: "Современная лексика (упрощённо)",
        aspects: "Лексика: телефон, компьютер, сообщение (в простом объёме); обсуждение «как дети общаются»; моделирование коротких диалогов «созвониться, написать»."
      },
      {
        number: 29,
        title: "Китай сегодня",
        topic: "Страна и города",
        aspects: "Повтор и расширение по крупным городам Китая, достопримечательностям; работа с картой; краткие устные сообщения «я хочу поехать в… потому что…»."
      },
      {
        number: 30,
        title: "Проекты: «Мой город / Моя школа / Моя семья»",
        topic: "Проектная деятельность",
        aspects: "Подготовка мини-проекта (плакат/презентация) на выбранную тему; отбор лексики, подготовка устного текста (5–7 предложений)."
      },
      {
        number: 31,
        title: "Итоговая устная проверка",
        topic: "Говорение",
        aspects: "Индивидуальные ответы и мини-доклады по темам года; оценка: произношение, объём, связность высказывания, реакция на простые вопросы."
      },
      {
        number: 32,
        title: "Итоговая проверка чтения и письма",
        topic: "Чтение и письмо",
        aspects: "Чтение короткого текста, ответы на вопросы; написание 4–6 знакомых иероглифов; короткий письменный текст (3–4 предложения) с опорой."
      },
      {
        number: 33,
        title: "Презентация проектов",
        topic: "Защита проектов",
        aspects: "Публичное представление мини-проектов; умение держать структуру: вступление, основная часть (описание), заключение; ответы на вопросы одноклассников."
      },
      {
        number: 34,
        title: "Праздник «Уверенный старт в среднюю школу»",
        topic: "Заключительный",
        aspects: "Свободные высказывания по выбранным темам; обсуждение прогресса за 4 года; формирование мотивации к продолжению изучения китайского языка."
      }
    ]
  },
  {
    grade: 5,
    title: "Китайский язык для 5 класса",
    description: "Курс китайского языка для пятиклассников с углубленным изучением грамматики, расширением словарного запаса и развитием навыков чтения и письма.",
    lessons: [
      {
        number: 1,
        title: "Стартовая диагностика",
        topic: "Повтор 1–4 классов",
        aspects: "Приветствие, самопрезентация, семья, школа, хобби; базовые структуры 我叫…, 我是…, 我有…, 我喜欢…; чтение короткого текста по пиньинь; определение стартового уровня."
      },
      {
        number: 2,
        title: "Пиньинь next level",
        topic: "Углубление пиньинь",
        aspects: "Систематизация слогов и тонов; отработка спорных сочетаний (j/q/x, zh/ch/sh, r); чтение слоговых цепочек и мини-слов; скоростное чтение по пиньинь."
      },
      {
        number: 3,
        title: "Интонация и беглость",
        topic: "Фонетика и речь",
        aspects: "Практика связной речи: «склеивание» слов, ритм фразы; вопросительные и восклицательные интонации; короткие диалоги на скорость."
      },
      {
        number: 4,
        title: "Я – это больше, чем имя",
        topic: "Расширенное описание себя",
        aspects: "Лексика: возраст, рост (в общем виде), характер, хобби; модели: 我是…, 我长得…, 我喜欢…, 我会…; устный рассказ «знакомство» (5–6 фраз)."
      },
      {
        number: 5,
        title: "Моя семья в деталях",
        topic: "Роли и отношения в семье",
        aspects: "Повтор членов семьи + расширение: двоюродные, младший/старший; лексика «ладим / помогаем / гуляем»; описание семейных отношений в нескольких предложениях."
      },
      {
        number: 6,
        title: "Внешность и стиль",
        topic: "Внешность и одежда",
        aspects: "Лексика: высокий/низкий, худой/полный, красивый, аккуратный; элементы одежды; модели: 他/她长得…, 他/她穿…; устные описания по картинкам."
      },
      {
        number: 7,
        title: "Характер и интересы",
        topic: "Личностные качества",
        aspects: "Лексика: серьёзный, активный, спокойный, общительный; модели: 我是…的人, 我朋友很…; мини-презентации «мой лучший друг»."
      },
      {
        number: 8,
        title: "Повтор блока «Я и семья»",
        topic: "Обобщающий",
        aspects: "Проверка лексики по себе, семье, внешности, характеру; устные монологи и диалоги; мини-тест по пониманию описаний."
      },
      {
        number: 9,
        title: "Мой рабочий день",
        topic: "Распорядок дня",
        aspects: "Лексика: просыпаться, собираться, добираться до школы, делать уроки, отдыхать; структура: 先…, 然后…, 最后…; устный рассказ «мой день»."
      },
      {
        number: 10,
        title: "Время и расписание",
        topic: "Время и школа",
        aspects: "Часы (целые, половины), дни недели; модели: …点, …点半; «во сколько урок», «как выглядит расписание»; заполнение простого расписания по-китайски."
      },
      {
        number: 11,
        title: "После уроков",
        topic: "Внеклассная жизнь",
        aspects: "Лексика: кружок, секция, тренировка; конструкции: 放学以后…, 我常常…, 我有时候…; устные мини-отчёты «мой день после школы»."
      },
      {
        number: 12,
        title: "Планы на выходные",
        topic: "Будущее действие (会 / 想)",
        aspects: "Модели: 周末我想…, 周末我会…; планирование выходных в устной форме; диалоги «что ты собираешься делать?»."
      },
      {
        number: 13,
        title: "Повтор блока «День и школа»",
        topic: "Обобщающий",
        aspects: "Сборка: распорядок, время, расписание, планы; устные и письменные задания; мини-контроль по времени и структурам 先…然后…."
      },
      {
        number: 14,
        title: "Мой город и район",
        topic: "Город и объекты",
        aspects: "Лексика: район, центр, парк, торговый центр, спортплощадка; конструкции: 在…附近, 我家附近有…; устные описания района."
      },
      {
        number: 15,
        title: "Как пройти…?",
        topic: "Направления и маршруты",
        aspects: "Лексика: прямо, налево, направо, повернуть, пересечь; модели: 从…到…, 往左/右走; разбор простых схем маршрута «дом–школа–магазин»."
      },
      {
        number: 16,
        title: "Путешествия и туризм",
        topic: "Поездки и транспорт",
        aspects: "Транспорт: автобус, метро, поезд, самолёт; конструкции: 我坐…去…, 我想去…旅行; обсуждение «куда хотели бы поехать в Китае/России»."
      },
      {
        number: 17,
        title: "Погода и климат",
        topic: "Погода + регионы",
        aspects: "Расширенная лексика: влажно, сухо, тёпло, прохладно; модели: 今天…, 那里…, 夏天很热, 冬天很冷; сравнение климата регионов Китая и России (на уровне простых фраз)."
      },
      {
        number: 18,
        title: "Повтор блока «Город, транспорт, погода»",
        topic: "Обобщающий",
        aspects: "Систематизация конструкций места (在, 从…到…), направлений и погоды; работа с картами и погодными пиктограммами; устные отчёты по схемам."
      },
      {
        number: 19,
        title: "Правильное питание",
        topic: "Еда и здоровье",
        aspects: "Лексика: полезный, вредный, овощи, фрукты, фастфуд; модели: 我常吃…, 我不常吃…, 多吃…, 少吃…; обсуждение привычек питания."
      },
      {
        number: 20,
        title: "В кафе и столовой 2.0",
        topic: "Еда: сервисные диалоги",
        aspects: "Углубление диалогов «официант–гость»: заказывать, уточнять, просить счёт; устойчивые фразы: 请给我…, 还要…, 一共多少钱？; ролевая отработка."
      },
      {
        number: 21,
        title: "Покупки и деньги",
        topic: "Магазин и цены",
        aspects: "Лексика: юань, кусок (块), грамм/килограмм (斤); конструкции: 这个多少钱？太贵了/便宜; диалоги «на рынке/в магазине», счёт простых сумм."
      },
      {
        number: 22,
        title: "Повтор блока «Еда и покупки»",
        topic: "Обобщающий",
        aspects: "Инсценировки «кафе», «рынок», «магазин»; контроль устойчивых выражений и цен; мини-рольовые игры с различными сценариями."
      },
      {
        number: 23,
        title: "Цифровая жизнь",
        topic: "Цифровые технологии",
        aspects: "Лексика: телефон, интернет, играть в игры, смотреть видео, чат; модели: 我用手机…, 我在网上…, 我喜欢在网上看…; обсуждение времени онлайн."
      },
      {
        number: 24,
        title: "Хобби, спорт и музыка",
        topic: "Досуг 2.0",
        aspects: "Расширение хобби: играть на инструменте, рисовать, танцевать, плавать; конструкции: 我参加…, 我每周…; опрос и мини-статистика по классу."
      },
      {
        number: 25,
        title: "Эмоции и советы",
        topic: "Чувства и модальный глагол 应该",
        aspects: "Лексика: переживать, радоваться, нервничать; конструкции: 我觉得…, 你应该…, 不应该…; тренировка «советы другу» в типичных школьных ситуациях."
      },
      {
        number: 26,
        title: "Сравниваем по-китайски",
        topic: "Сравнения (比)",
        aspects: "Введение структуры A比B…; сравнение: «моя школа больше/меньше», «весной теплее, чем зимой»; упражнения на построение сравнений."
      },
      {
        number: 27,
        title: "Читаем мини-рассказы",
        topic: "Чтение с пониманием",
        aspects: "Небольшие адаптированные тексты (8–10 предложений) о дне, семье, путешествии; работа по алгоритму: читаем, выделяем ключевые слова, отвечаем на вопросы."
      },
      {
        number: 28,
        title: "Пишем связный текст",
        topic: "Письменная речь",
        aspects: "Написание связного текста (6–8 предложений) по плану: «Я, моя семья и мой день» / «Мой город и моё хобби»; использование изученных конструкций и 2–3 иероглифических блоков."
      },
      {
        number: 29,
        title: "Проект «Мой город / моя школа / мой день»",
        topic: "Проектная подготовка",
        aspects: "Планирование мини-проекта: подбор лексики, иероглифов, картинок; подготовка устного текста (8–10 фраз) и простых подписей иероглифами/пиньинь."
      },
      {
        number: 30,
        title: "Иероглифы как система",
        topic: "Письмо: ключи и структура",
        aspects: "Повтор ключей (человек, вода, рот, дом и др.); разбор ещё 3–4 иероглифов по частям; отработка порядка черт; написание иероглифов из тем «человек, дом, школа, город»."
      },
      {
        number: 31,
        title: "Итог: устная коммуникация",
        topic: "Итоговая проверка говорения",
        aspects: "Индивидуальные и парные диалоги по темам года (я, семья, день, город, еда, покупки, хобби); оценка точности конструкций, произношения и реакции на вопросы."
      },
      {
        number: 32,
        title: "Итог: чтение и письмо",
        topic: "Итоговая проверка чтения/письма",
        aspects: "Чтение адаптированного текста; задания на понимание (выбор ответа, краткие ответы); написание 6–8 знакомых иероглифов и мини-текста (4–5 предложений) с опорой."
      },
      {
        number: 33,
        title: "Защита проектов",
        topic: "Презентация",
        aspects: "Публичное представление проекта (плакат/мини-презентация); структура: вступление, основная часть, вывод; ответы на простые вопросы одноклассников и учителя."
      },
      {
        number: 34,
        title: "Финишный аккорд",
        topic: "Заключительный",
        aspects: "Рефлексия: что научились делать по-китайски; свободные высказывания на выбранные темы; обсуждение перехода на следующий уровень и ожиданий от продолжения курса."
      }
    ]
  },
  {
    grade: 6,
    title: "Китайский язык для 6 класса",
    description: "Курс китайского языка для шестиклассников с углубленным изучением грамматики, развитием навыков устной и письменной речи, и проектной деятельностью.",
    lessons: [
      {
        number: 1,
        title: "Старт и диагностика",
        topic: "Повтор и актуализация",
        aspects: "Краткая самопрезентация, семья, школа, любимые занятия; проверка пиньинь, базовых конструкций 我叫…, 我是…, 我喜欢…; чтение короткого текста, определение стартового уровня."
      },
      {
        number: 2,
        title: "Обновляем пиньинь",
        topic: "Фонетика и чтение",
        aspects: "Повтор спорных сочетаний (j/q/x, zh/ch/sh, r); чтение слов и мини-фраз по пиньинь; коррекция тонов; упражнения на скоростное чтение."
      },
      {
        number: 3,
        title: "Говорим связно",
        topic: "Интонация и беглость",
        aspects: "Отработка пауз, логического ударения; вопросительные, восклицательные и перечислительные интонации; диалоги в естественном темпе."
      },
      {
        number: 4,
        title: "Я подросток",
        topic: "Самопрезентация 2.0",
        aspects: "Лексика: возраст, класс, увлечения, характер; конструкции: 我今年…岁, 我在…上学, 我是一个…的人; устный рассказ о себе (6–8 фраз)."
      },
      {
        number: 5,
        title: "Мои друзья и отношения",
        topic: "Дружба",
        aspects: "Лексика: дружить, помогать, общаться, спорить, мириться; описания друга: 外向/内向, 热情, 安静; диалоги «как мы общаемся»."
      },
      {
        number: 6,
        title: "Семья и обязанности",
        topic: "Ответственность дома",
        aspects: "Лексика: обязанности, помогать, убираться, готовить; структуры: 我应该…, 我常常帮家里…, 有时候…; обсуждение роли подростка в семье."
      },
      {
        number: 7,
        title: "Конфликты и решения",
        topic: "Эмоции и советы",
        aspects: "Эмоции: 生气, 伤心, 开心; структуры: 我觉得…, 你应该…/不应该…; ролевые сценки «спор с другом/родителями» и поиск решений."
      },
      {
        number: 8,
        title: "Повтор блока «Я, друзья, семья»",
        topic: "Обобщающий",
        aspects: "Контроль лексики по личности, друзьям, семье; устные мини-монологи и диалоги; listening по короткому тексту и ответы на вопросы."
      },
      {
        number: 9,
        title: "Мой школьный день 2.0",
        topic: "Распорядок и нагрузка",
        aspects: "Расширение глаголов: 复习, 预习, 练习, 上网; конструкции с 先…然后…再…; устный рассказ «типичный учебный день» с деталями."
      },
      {
        number: 10,
        title: "Время и расписание",
        topic: "Время и планирование",
        aspects: "Точность времени (часы+минуты в упрощённом объёме); лексика: 上课, 下课, 休息; составление и обсуждение школьного расписания; выражения «часто / редко / иногда» (常常, 很少, 有时候)."
      },
      {
        number: 11,
        title: "Кружки и секции",
        topic: "Внеклассная жизнь",
        aspects: "Лексика: кружок, секция, репетиция, соревнование; конструкции: 我参加…, 每周…次; диалоги «какие у тебя занятия после школы»."
      },
      {
        number: 12,
        title: "Делаем планы",
        topic: "Будущее и намерения",
        aspects: "Структуры с 要, 会, 想: 我周末要…, 我将来想做…; обсуждение краткосрочных и отдалённых планов; устные мини-планы."
      },
      {
        number: 13,
        title: "Повтор блока «Школа и время»",
        topic: "Обобщающий",
        aspects: "Сборка: распорядок, расписание, кружки, планы; комбинированные задания устно и письменно; мини-контроль по времени и конструкциям 先…然后…再…."
      },
      {
        number: 14,
        title: "В моём городе",
        topic: "Городская среда",
        aspects: "Лексика: район, центр, пригород, торговая улица, парк; конструкции: 在…附近, 离…很近/很远; описание района проживания."
      },
      {
        number: 15,
        title: "Как добраться? 2.0",
        topic: "Маршруты и ориентация",
        aspects: "Направления: 前面, 后面, 左边, 右边, 对面; конструкции: 从…到…, 先…然后…; диалоги «как пройти/проехать» с опорой на карту-схему."
      },
      {
        number: 16,
        title: "Путешествия по Китаю и миру",
        topic: "Туризм и транспорт",
        aspects: "Повтор транспорта + лексика «билет, вокзал, аэропорт, гостиница»; структуры: 我去过…, 我没去过… (опыт); обсуждение «где был / куда хочу поехать»."
      },
      {
        number: 17,
        title: "Погода и климат 2.0",
        topic: "Погода и регионы",
        aspects: "Расширенная лексика: 暖和, 凉快, 潮湿, 干燥; сравнения с 比 и 最: 夏天比冬天热, 我家这里冬天最冷; карта климата Китая/России (в общих чертах)."
      },
      {
        number: 18,
        title: "Повтор блока «Город, путешествия, погода»",
        topic: "Обобщающий",
        aspects: "Работа с картами и погодными схемами; устные отчёты о маршрутах и путешествиях; закрепление конструкций 在, 离, 比, 最."
      },
      {
        number: 19,
        title: "Еда и образ жизни",
        topic: "Питание и здоровье",
        aspects: "Лексика: завтрак, перекус, диета, здоровье; структуры: 多吃…, 少吃…, 不要…; обсуждение полезных и вредных привычек питания."
      },
      {
        number: 20,
        title: "Спорт и движение",
        topic: "Спорт и режим",
        aspects: "Виды спорта: 篮球, 足球, 游泳, 跑步, 武术 и др.; конструкции: 我每周运动…次, 运动对身体很好; мини-опрос класса, обсуждение спорта."
      },
      {
        number: 21,
        title: "Цифровая гигиена",
        topic: "Телефон и интернет",
        aspects: "Лексика: социальная сеть, переписка, зависимость; конструкции: 上网, 玩手机, 刷视频; выражения частоты и длительности; советы по ограничению времени онлайн."
      },
      {
        number: 22,
        title: "Повтор блока «Здоровье и цифровая жизнь»",
        topic: "Обобщающий",
        aspects: "Систематизация тем «питание, спорт, телефон»; ролевые игры (советы другу), обсуждение типичных ситуаций; письменные мини-тексты."
      },
      {
        number: 23,
        title: "Говорим о прошлом",
        topic: "Вид-прошедшее (了)",
        aspects: "Введение и тренировка 了 на уровне простых высказываний: 昨天我去了…, 我吃了…, 看了…, 学了…; рассказ «вчерашний день» / «прошлые выходные»."
      },
      {
        number: 24,
        title: "Продолжающееся действие",
        topic: "Прогрессив (在)",
        aspects: "Конструкция: 在 + глагол: 我在看书, 他在上网; ситуации «что сейчас делает…»; упражнения «опиши картинку»."
      },
      {
        number: 25,
        title: "Что умею и могу",
        topic: "Модальные 能 / 可以",
        aspects: "Различия по смыслу на простых примерах: 能 (физ./объективная возможность), 可以 (разрешение); диалоги: «можно ли…», «я не могу, потому что…»."
      },
      {
        number: 26,
        title: "Сравниваем и оцениваем",
        topic: "Сравнение и степень",
        aspects: "Повтор 比, 最 + прилагательные; оценочные выражения: 挺…的, 非常…, 有点…; упражнения «сравни друзей, предметы, виды спорта» в допустимых рамках."
      },
      {
        number: 27,
        title: "Читаем и анализируем",
        topic: "Чтение адаптированных текстов",
        aspects: "Тексты 10–12 предложений по знакомым темам (семья, школа, путешествия, здоровье); выделение ключевых слов, ответы на вопросы, поиск информации в тексте."
      },
      {
        number: 28,
        title: "Пишем связно и логично",
        topic: "Письменная речь",
        aspects: "Написание текста 8–10 предложений по плану (например, «мой обычный день и выходные», «мой город и любимое место»); использование связок 先, 然后, 最后, 因为…所以…."
      },
      {
        number: 29,
        title: "Иероглифы и ключи 2.0",
        topic: "Графика и структура",
        aspects: "Расширение набора ключей (сердце, рука, нога, речь и др.); разбор 4–5 иероглифов по структуре; отработка порядка черт; осознанное запоминание через ключи и смысл."
      },
      {
        number: 30,
        title: "Мини-проект: «Мой стиль жизни»",
        topic: "Проектная подготовка",
        aspects: "Выбор подтемы: «мой день», «моё здоровье», «мои друзья и хобби», «мой город»; подбор лексики, иероглифов, картинок; подготовка текста (10–12 фраз) для устного выступления."
      },
      {
        number: 31,
        title: "Итоговая устная проверка",
        topic: "Говорение",
        aspects: "Индивидуальные диалоги и мини-монологи по темам года; проверка: беглость, точность конструкций (了, 在, 能/可以, 比/最), понимание вопросов."
      },
      {
        number: 32,
        title: "Итоговая проверка чтения и письма",
        topic: "Чтение и письмо",
        aspects: "Чтение адаптированного текста; ответы на вопросы (устно/письменно); письмо 8–10 предложений по опоре; написание 8–10 знакомых иероглифов."
      },
      {
        number: 33,
        title: "Защита мини-проектов",
        topic: "Презентация",
        aspects: "Публичное выступление с опорой на плакат/слайды; структура: вступление, основная часть, вывод; ответы на простые вопросы одноклассников и учителя."
      },
      {
        number: 34,
        title: "Подводим итоги и смотрим вперёд",
        topic: "Заключительный",
        aspects: "Рефлексия по достижениям; свободные высказывания на выбранные темы; обсуждение целей на следующий учебный год и дальнейшее развитие китайского языка."
      }
    ]
  },
  {
    grade: 7,
    title: "Китайский язык для 7 класса",
    description: "Курс китайского языка для семиклассников с комплексным развитием навыков общения, углубленным изучением грамматики и проектной деятельностью.",
    lessons: [
      {
        number: 1,
        title: "Старт и диагностика 7 класса",
        topic: "Повтор и актуализация",
        aspects: "Самопрезентация на 8–10 фраз; семья, школа, хобби, планы; проверка понимания на слух короткого текста; чтение текста по пиньинь и иероглифам; фиксация типичных пробелов."
      },
      {
        number: 2,
        title: "Речь в реальном темпе",
        topic: "Фонетика и беглость",
        aspects: "Коррекция произношения сложных сочетаний (zh/ch/sh/r, ü); чтение мини-диалогов в естественном темпе; работа над паузами и логическим ударением; скоростное чтение по пиньинь."
      },
      {
        number: 3,
        title: "Живой разговор",
        topic: "Разговорные клише",
        aspects: "Лексика и конструкции: 真的啊, 是吗, 对吧, 好像, 其实; моделирование естественных реакций в диалогах; отработка коротких разговоров «по жизни»."
      },
      {
        number: 4,
        title: "Я и мой характер 2.0",
        topic: "Личность и самооценка",
        aspects: "Лексика: уверенный, застенчивый, ответственным, ленивый и др.; конструкции: 我觉得自己…, 别人觉得我…; устный монолог «какой я человек»."
      },
      {
        number: 5,
        title: "Друзья и круг общения",
        topic: "Отношения со сверстниками",
        aspects: "Лексика: общий интерес, доверять, поддерживать, ссориться; структуры: 我和他/她的关系, 我们常常一起…; ролевые ситуации «новый одноклассник», «дружба на расстоянии»."
      },
      {
        number: 6,
        title: "Семья и поколения",
        topic: "Семейные роли",
        aspects: "Лексика: поколение, традиции, уважать, понимать; конструкции: 父母希望我…, 有时候我不同意…; обсуждение разницы взглядов детей и родителей."
      },
      {
        number: 7,
        title: "Конфликты и компромиссы",
        topic: "Эмоции и коммуникация",
        aspects: "Лексика: недопонимание, объяснять, извиняться, предлагать; конструкции: 因为…所以…, 虽然…但是…; разыгрывание типичных конфликтных ситуаций и вариантов решения."
      },
      {
        number: 8,
        title: "Повтор блока «Я, друзья, семья»",
        topic: "Обобщающий",
        aspects: "Контроль лексики по личностям и отношениям; устные диалоги и мини-доклады; задание на listening по диалогу подростков; обсуждение услышанного."
      },
      {
        number: 9,
        title: "Учёба под нагрузкой",
        topic: "Школа и нагрузки",
        aspects: "Лексика: домашка, контрольная, проект, оценка, стресс; конструкции: 学习压力, 对我来说…, 我觉得学习很…; обсуждение учебной нагрузки."
      },
      {
        number: 10,
        title: "Организация времени",
        topic: "Тайм-менеджмент",
        aspects: "Лексика: планировать, откладывать, успевать/не успевать; конструкции: 如果…就…, 先…再…; устные планы «идеальный учебный день»."
      },
      {
        number: 11,
        title: "Каникулы и праздники",
        topic: "Планы и впечатления",
        aspects: "Повтор 了 + введение 过 (опыт): 我去过…, 我没去过…; рассказ о прошедших каникулах и планах на ближайшие; разница «один раз / много раз»."
      },
      {
        number: 12,
        title: "Китайские и российские праздники",
        topic: "Культура праздников",
        aspects: "Повтор известных китайских праздников; новая лексика по традициям; сопоставление с российскими; устные сообщения «мой любимый праздник и почему»."
      },
      {
        number: 13,
        title: "Повтор блока «Учёба, время, праздники»",
        topic: "Обобщающий",
        aspects: "Сборка конструкций 如果…就…, 因为…所以…, 了 / 过; комбинированные упражнения (чтение + говорение); мини-контроль по лексике и грамматике."
      },
      {
        number: 14,
        title: "Город подростка",
        topic: "Городская среда 2.0",
        aspects: "Лексика: район отдыха, торговый центр, скейт-площадка, кино, кофейня; конструкции: 在…附近, 离…不远, 对…来说很方便; описание «моё любимое место в городе»."
      },
      {
        number: 15,
        title: "Как объяснить дорогу",
        topic: "Маршруты и ориентиры",
        aspects: "Повтор направлений + лексика ориентиров: 十字路口, 红绿灯, 地铁站; конструкции: 先往前走…, 到…以后…, 一直…; диалоги по картам-схемам."
      },
      {
        number: 16,
        title: "Путешествия и впечатления",
        topic: "Туризм 2.0",
        aspects: "Лексика: маршрут, экскурсия, достопримечательность, впечатление; конструкции: 给我留下很深的印象, 我觉得最…, 如果有机会我想…; устные рассказы о поездках (реальных или желаемых)."
      },
      {
        number: 17,
        title: "Погода, климат и настроение",
        topic: "Погода и самочувствие",
        aspects: "Лексика: настроение, усталость, свежий воздух, загрязнение; связи: 天气对心情的影响; упражнения «как погода влияет на тебя», использование 比, 最."
      },
      {
        number: 18,
        title: "Повтор блока «Город, путешествия, погода»",
        topic: "Обобщающий",
        aspects: "Работа с картами, погодными сводками, краткими текстами о городах; составление устных и письменных мини-отчётов; закрепление конструкций 在, 离, 比, 最."
      },
      {
        number: 19,
        title: "Еда, которую выбираю",
        topic: "Питание и выбор",
        aspects: "Лексика: калории, вредные привычки, перекусы, режим питания; конструкции: 一般来说…, 对身体好/不好; обсуждение реальных привычек и их плюсов/минусов."
      },
      {
        number: 20,
        title: "Спорт, фитнес, активности",
        topic: "Здоровый образ жизни",
        aspects: "Лексика: тренировка, форма, выносливость, соревнование; конструкции: 坚持, 参加比赛, 运动对健康很重要; мини-доклады «какой спорт мне подходит»."
      },
      {
        number: 21,
        title: "Гаджеты и социальные сети",
        topic: "Цифровая жизнь 2.0",
        aspects: "Лексика: блог, подписчик, лайк, комментарий (адаптировано); конструкции: 在网上发/看/聊…, 沉迷手机/游戏; обсуждение плюсов и минусов соцсетей."
      },
      {
        number: 22,
        title: "Мнения, споры, аргументы",
        topic: "Выражение мнения",
        aspects: "Лексика: согласен/не согласен, аргумент, точка зрения; конструкции: 一方面…，另一方面…, 我同意/不同意你的看法，因为…; дебаты в лёгком формате по школьным темам."
      },
      {
        number: 23,
        title: "Повтор блока «Здоровье, спорт, гаджеты»",
        topic: "Обобщающий",
        aspects: "Игровые и проектные задания; подготовка мини-дискуссий; контроль употребления 因为…所以…, 一般来说…, 一方面…另一方面…."
      },
      {
        number: 24,
        title: "Говорим о прошлом",
        topic: "Временные формы: 了 и 过",
        aspects: "Уточнение различий: законченность действия (了) vs опыт (过); временные слова: 已经, 还没; рассказы «вчера / в прошлом году / когда был младше»."
      },
      {
        number: 25,
        title: "Что происходит сейчас",
        topic: "Прогрессив и продолжительность",
        aspects: "Конструкции: 在 + глагол, 正在…, 还在…; лексика длительности: 一个小时, 半天; описания картинок «что сейчас делают люди», мини-диалоги."
      },
      {
        number: 26,
        title: "Возможность, разрешение, необходимость",
        topic: "Модальные глаголы",
        aspects: "Повтор 能 / 可以 + введение 得 (должен/надо): 你可以…, 你不能…, 你应该…, 你得…; ролевые игры «правила дома/школы/кружка»."
      },
      {
        number: 27,
        title: "Причины и следствия",
        topic: "Логические связи",
        aspects: "Расширение: 因为…所以…, 虽然…但是…, 如果…就…; упражнения на соединение предложений; устные мини-истории с причинно-следственными связями."
      },
      {
        number: 28,
        title: "Читаем и обсуждаем",
        topic: "Чтение адаптированных текстов",
        aspects: "Тексты 12–14 предложений по темам «подросток и школа», «цифровая жизнь», «путешествия»; выделение ключевой лексики, ответы на вопросы, краткие пересказы."
      },
      {
        number: 29,
        title: "Пишем осмысленно",
        topic: "Письменная речь",
        aspects: "Написание текста 10–12 предложений по плану (например, «мой обычный день и как я справляюсь со стрессом», «моё отношение к соцсетям»); использование конструкций 了, 过, 因为…所以…, 虽然…但是…."
      },
      {
        number: 30,
        title: "Иероглифы и стратегия запоминания",
        topic: "Иероглифы 3.0",
        aspects: "Повтор и расширение ключей; разбор 5–6 иероглифов средней сложности (составные иероглифы); техники запоминания (ассоциации, ключ+звук+смысл); письмо иероглифов по памяти."
      },
      {
        number: 31,
        title: "Проект «Подросток в современном мире»",
        topic: "Проектная подготовка",
        aspects: "Выбор подтемы: «я и школа», «я и семья», «я и гаджеты», «я и спорт»; сбор лексики, иероглифов, примеров; подготовка устного текста (12–15 фраз) и короткого письменного резюме."
      },
      {
        number: 32,
        title: "Итоговая устная проверка",
        topic: "Говорение",
        aspects: "Индивидуальные монологи и диалоги по темам года; проверка: беглость, логичность, использование 了/过/在, модальных глаголов и связок; реакция на уточняющие вопросы."
      },
      {
        number: 33,
        title: "Итоговая проверка чтения и письма",
        topic: "Чтение и письмо",
        aspects: "Чтение адаптированного текста, задание на понимание; написание 10–12 знакомых иероглифов; мини-сочинение 10–12 предложений по опоре с обязательным использованием заданных конструкций."
      },
      {
        number: 34,
        title: "Защита проектов и финал года",
        topic: "Заключительный",
        aspects: "Публичная защита проектов; вопросы одноклассников; рефлексия «чему научился за год», формулировка личных целей на следующий уровень китайского языка."
      }
    ]
  },
  {
    grade: 8,
    title: "Китайский язык для 8 класса",
    description: "Курс китайского языка для восьмиклассников с углубленным изучением разговорных клише, грамматических конструкций и развитием критического мышления.",
    lessons: [
      {
        number: 1,
        title: "Перезапуск и диагностика 8 класса",
        topic: "Повтор и стартовый уровень",
        aspects: "Самопрезентация 10–12 фраз; семья, школа, интересы, планы; проверка понимания аутентичного (адаптированного) диалога; чтение небольшого текста с иероглифами; фиксация грамматических «дырок»."
      },
      {
        number: 2,
        title: "Звучать естественно",
        topic: "Разговорные клише и паузы",
        aspects: "Разговорные маркеры: 其实, 好像, 对了, 不过, 然后, 后来; работа над «живыми» репликами; микродиалоги с естественными реакциями, согласиями/несогласиями."
      },
      {
        number: 3,
        title: "Контроль произношения",
        topic: "Фонетика и беглость",
        aspects: "Дочистка произношения zh/ch/sh/r, ü, стыков слов; чтение диалогов в естественном темпе; тренировка ритма фразы; shadowing (повтор за аудио)."
      },
      {
        number: 4,
        title: "Кто я сейчас",
        topic: "Самоописание подростка",
        aspects: "Лексика: интересы, ценности, сильные/слабые стороны; конструкции: 我对…感兴趣, 在我看来…, 对我来说…; устный монолог «какой я сейчас»."
      },
      {
        number: 5,
        title: "Отношения с друзьями",
        topic: "Дружба и доверие",
        aspects: "Лексика: доверять, поддерживать, ревновать, завидовать; конструкции: 跟…吵架/和好, 对…很好/不好; разбор типичных ситуаций в дружбе, ролевые диалоги."
      },
      {
        number: 6,
        title: "Я и родители",
        topic: "Семья и ожидания",
        aspects: "Лексика: ожидания, контроль, свобода, понимание; конструкции: 父母希望我…, 我有自己的想法, 我跟父母常常…; обсуждение конфликтов и компромиссов."
      },
      {
        number: 7,
        title: "Давление и эмоции",
        topic: "Стресс и эмоциональное состояние",
        aspects: "Лексика:压力, 放松, 紧张, 伤心, 兴奋; конструкции: 让…很紧张/开心, 有时候会…; обсуждение способов справляться со стрессом."
      },
      {
        number: 8,
        title: "Повтор блока «Я и мои отношения»",
        topic: "Обобщающий",
        aspects: "Контроль лексики и структур по темам «личность, друзья, семья, стресс»; устные монологи 12–15 фраз; listening по диалогу/мини-истории и обсуждение."
      },
      {
        number: 9,
        title: "Школа: не только уроки",
        topic: "Учёба и внеурочка",
        aspects: "Лексика: обязательные/выборные предметы, проект, экзамен; конструкции: 对…来说最难/最容易, 我选了…, 参加活动; обсуждение, что нравится/не нравится в школе."
      },
      {
        number: 10,
        title: "Учебная нагрузка и выбор",
        topic: "Учебные планы",
        aspects: "Лексика: расписание, нагрузка, подготовка, повторение; конструкции: 一边…一边…, 常常因为…所以…, 忙得不得了; описание типичной недели."
      },
      {
        number: 11,
        title: "Профессии и будущее",
        topic: "Профориентация",
        aspects: "Лексика: профессия, мечта, талант, навык; конструкции: 我将来想当…, 因为…所以…, 如果…就…; обсуждение будущей профессии."
      },
      {
        number: 12,
        title: "Учёба за границей и Китай",
        topic: "Образование и культура",
        aspects: "Лексика: университет, общежитие, стипендия (в упрощённом виде); конструкции: 有机会的话…, 听说在中国上大学…; сравнение школьной/вузовской системы РФ и КНР."
      },
      {
        number: 13,
        title: "Повтор блока «Школа и будущее»",
        topic: "Обобщающий",
        aspects: "Сборка: нагрузки, выбор предметов, профессии, учёба в будущем; комбинированные задания (чтение+говорение); мини-письмо о планах на обучение."
      },
      {
        number: 14,
        title: "Город, в котором я живу",
        topic: "Городская среда",
        aspects: "Лексика: центр, окраина, район, инфраструктура; конструкции: 交通方便/不方便, 环境很好/不好, 有很多/不太多…; описание своего города с плюсами и минусами."
      },
      {
        number: 15,
        title: "Проблемы города",
        topic: "Социальные темы",
        aspects: "Лексика: пробки, загрязнение воздуха/воды, мусор, шум; конструкции: 最大的问题是…, 如果大家…, 环保, 回收; обсуждение проблем и возможных решений."
      },
      {
        number: 16,
        title: "Путешествия и культурный шок",
        topic: "Поездки и впечатления",
        aspects: "Лексика: культурный шок, привычки, традиции; конструкции: 跟…不一样, 让我觉得很奇怪/有意思; рассказы о поездках (реальных/условных) и необычных впечатлениях."
      },
      {
        number: 17,
        title: "Погода, климат и экология",
        topic: "Климат и экология",
        aspects: "Лексика: 气候, 全球变暖, 空气污染, 垃圾分类; конструкции: 越来越…, 应该/必须…, 如果大家都…就…; обсуждение экологии и личного вклада."
      },
      {
        number: 18,
        title: "Повтор блока «Город, путешествия, экология»",
        topic: "Обобщающий",
        aspects: "Работа с картами, короткими статьями/заметками; устные и письменные мини-отчёты; закрепление конструкций 越来越…, 跟…不一样, 最大的问题是…."
      },
      {
        number: 19,
        title: "Медиa и информация",
        topic: "СМИ и новости",
        aspects: "Лексика: 新闻, 记者, 网站, 文章, 信息; конструкции: 在网上看新闻, 我对…的新闻感兴趣; обсуждение, откуда подростки получают информацию."
      },
      {
        number: 20,
        title: "Соцсети и блогинг",
        topic: "Цифровая среда",
        aspects: "Лексика: 社交网络, 博主, 粉丝, 评论, 点赞; конструкции: 在网上发照片/视频, 关注…, 沉迷手机/游戏; обсуждение рисков и плюсов соцсетей."
      },
      {
        number: 21,
        title: "Фильмы, сериалы, музыка",
        topic: "Поп-культура",
        aspects: "Лексика: 电影, 电视剧, 音乐, 歌手, 演员; конструкции: 我最喜欢的…, 因为…所以…, 看起来…, 听起来…; описание любимого фильма/песни."
      },
      {
        number: 22,
        title: "Китайская поп-культура",
        topic: "Культура Китая сегодня",
        aspects: "Лексика: 流行音乐, 偶像, 网红; краткие тексты о популярных тенденциях (адаптированные); сравнение с российской поп-культурой."
      },
      {
        number: 23,
        title: "Повтор блока «Медиа, соцсети, культура»",
        topic: "Обобщающий",
        aspects: "Мини-дискуссии («соцсети — это…»), аргументация «за/против»; контроль конструкций 看起来/听起来, 一方面…另一方面…, 沉迷…."
      },
      {
        number: 24,
        title: "Говорим о прошлом и опыте",
        topic: "了, 过, 以前",
        aspects: "Углубление: различия 了 и 过; временные маркеры: 以前, 现在, 以后; конструкции: 我已经…了, 还没…, 我以前…, 现在…, 将来…."
      },
      {
        number: 25,
        title: "Длительность и опыт",
        topic: "过 + продол. действия",
        aspects: "Конструкции: V+了+duration+了 (我学汉语学了三年了); 还在…, 一直…; рассказы об опыте изучения китайского, занятий спортом, хобби."
      },
      {
        number: 26,
        title: "把 и 被 в простых конструкциях",
        topic: "Конструкции 把 / 被",
        aspects: "Введение на бытовом уровне: 把书放在桌上, 作业被老师批改; акцент на значении, без усложнения; упражнения на преобразование простых предложений."
      },
      {
        number: 27,
        title: "Причина, уступка, условие",
        topic: "Связки и сложные предложения",
        aspects: "Повтор и расширение: 因为…所以…, 虽然…但是…, 如果…就…, 不但…而且…; построение сложных фраз, мини-истории с несколькими связками."
      },
      {
        number: 28,
        title: "Чтение: подросток в мире",
        topic: "Чтение и обсуждение",
        aspects: "Адаптированные тексты 14–16 предложений по темам «школа», «цифровая жизнь», «город/экология»; выделение ключевых идей, обсуждение, краткий пересказ."
      },
      {
        number: 29,
        title: "Письмо: высказывание-мнение",
        topic: "Письменная речь",
        aspects: "Структура текста-мнения: вступление (я считаю, что…), аргументы, вывод; использование связок 一方面…另一方面…, 因为…所以…, 虽然…但是…; письмо 12–15 предложений."
      },
      {
        number: 30,
        title: "Иероглифы: стратегия 8 класса",
        topic: "Иероглифы и запоминание",
        aspects: "Работа с 8–10 иероглифами средней сложности (с составными ключами); анализ структуры, семантические поля; тренировка письма по памяти; техники запоминания (ключ + образ + звук)."
      },
      {
        number: 31,
        title: "Проект «Подросток и современный мир»",
        topic: "Проектная подготовка",
        aspects: "Выбор темы проекта: «я и школа», «я и медиа», «я и город», «я и экология»; сбор лексики и примеров; подготовка устного текста (15–18 фраз) и письменного резюме."
      },
      {
        number: 32,
        title: "Итог: устная коммуникация",
        topic: "Итоговая проверка говорения",
        aspects: "Индивидуальные монологи и диалоги по темам года; оценка: беглость, объём, корректность конструкций 了/过/把/被/связки; реакция на спонтанные вопросы."
      },
      {
        number: 33,
        title: "Итог: чтение и письмо",
        topic: "Итоговая проверка чтения/письма",
        aspects: "Чтение адаптированного текста с заданиями; написание 12–15 знакомых иероглифов (в словах/фразах); письменное высказывание-мнение 12–15 предложений по опоре."
      },
      {
        number: 34,
        title: "Защита проектов и рефлексия",
        topic: "Заключительный",
        aspects: "Публичная защита проектов с вопросами-ответами; обсуждение личного прогресса; формулирование индивидуальных целей по китайскому на 9 класс."
      }
    ]
  },
  {
    grade: 9,
    title: "Китайский язык для 9 класса",
    description: "Курс китайского языка для девятиклассников с подготовкой к ОГЭ, развитием критического мышления и проектной деятельностью.",
    lessons: [
      {
        number: 1,
        title: "Диагностика и старт 9 класса",
        topic: "Повтор и актуализация",
        aspects: "Самопрезентация 12–15 фраз; семья, школа, интересы, планы после 9 класса; проверка понимания адаптированного текста на слух; чтение текста с иероглифами; фиксация ключевых пробелов (лексика/грамматика)."
      },
      {
        number: 2,
        title: "«Подтюним» речь",
        topic: "Разговорные клише и естественность",
        aspects: "Разговорные маркеры: 不过, 其实, 反正, 结果, 原来; типичные реакции-связки: 对啊, 也是, 有道理; отработка живых диалогов в естественном темпе."
      },
      {
        number: 3,
        title: "Фонетика под экзамен",
        topic: "Беглость и произношение",
        aspects: "Shadowing по аудио; чтение диалогов и кратких монологов в нормальном темпе; работа с интонацией сложных предложений; минимальная подготовка к устной части (если предусмотрена)."
      },
      {
        number: 4,
        title: "Кто я и чего хочу",
        topic: "Личность и ценности",
        aspects: "Лексика: ценности, приоритеты, характер, сильные/слабые стороны; конструкции: 对我来说最重要的是…, 我比较…, 我有时候会…; устный монолог «кто я сейчас и чего хочу»."
      },
      {
        number: 5,
        title: "Отношения с друзьями и сообществами",
        topic: "Социальные связи",
        aspects: "Лексика: круг общения, команда, поддержка, буллинг; конструкции: 在…方面帮我很多, 对…有影响, 和…保持联系; обсуждение реальных ситуаций."
      },
      {
        number: 6,
        title: "Я и семья: свобода/контроль",
        topic: "Подросток и родители",
        aspects: "Лексика: свобода, контроль, доверие, поколенческий разрыв; конструкции: 父母总是…, 我希望他们…, 虽然…但是…; ролевые диалоги «обсуждаем важное»."
      },
      {
        number: 7,
        title: "Давление и психологический баланс",
        topic: "Стресс и саморегуляция",
        aspects: "Лексика: 压力, 放松, 情绪, 调整, 解决; конструкции: 让我觉得很…, 我一…就…, 如果太…, 就应该…; обсуждение способов справляться со стрессом перед экзаменами."
      },
      {
        number: 8,
        title: "Повтор блока «Я и мои отношения»",
        topic: "Обобщающий",
        aspects: "Устные монологи 12–15 фраз, парные диалоги по сценариям; задание на слушание (диалог подростков, обсуждение позиций); краткий письменный отзыв/реакция."
      },
      {
        number: 9,
        title: "Школа, экзамены, выбор",
        topic: "Учёба и будущий путь",
        aspects: "Лексика: экзамен, ОГЭ/ГИА (на русском), подготовка, репетитор, профиль; конструкции: 我打算…, 打算以后…, 决定…, 对…有兴趣; обсуждение вариантов после 9 класса."
      },
      {
        number: 10,
        title: "Учебная нагрузка и тайм-менеджмент",
        topic: "Планирование времени",
        aspects: "Лексика: план, расписание подготовки, приоритеты; конструкции: 一方面要…, 另一方面还要…, 忙不过来, 只好…; описание своей системы подготовки."
      },
      {
        number: 11,
        title: "Профессии и компетенции",
        topic: "Профессиональное самоопределение",
        aspects: "Лексика: профессия, навык, компетенция, направление; конструкции: 适合/不适合, 比较适合…, 需要…, 将来可能…; обсуждение, какая сфера подходит ученику."
      },
      {
        number: 12,
        title: "Учёба и работа в Китае",
        topic: "Образование и карьерные траектории",
        aspects: "Лексика: 大学, 专业, 公司, 实习; конструкции: 在中国…, 听说…, 有机会的话我想…; сопоставление карьерных путей в Китае и России (в общем виде)."
      },
      {
        number: 13,
        title: "Повтор блока «Школа, экзамены, профессии»",
        topic: "Обобщающий",
        aspects: "Чтение адаптированного текста о выборе профессии; устное обсуждение; мини-письмо (8–10 предложений) «как я вижу своё будущее после 9 класса»."
      },
      {
        number: 14,
        title: "Мой город и я",
        topic: "Городская среда и качество жизни",
        aspects: "Лексика: инфраструктура, безопасность, развлечения, экология города; конструкции: 对年轻人来说…, 最方便/不方便的是…, 有很多机会/很少机会; характеристика своего города/района."
      },
      {
        number: 15,
        title: "Социальные проблемы города",
        topic: "Социальные темы",
        aspects: "Лексика: пробки, загрязнение, мусор, бездомные животные, доступность для инвалидов; конструкции: 最大的问题是…, 如果政府…, 如果市民…, 就…; формулировка предложений по улучшению."
      },
      {
        number: 16,
        title: "Путешествия, обмены, межкультурный опыт",
        topic: "Путешествия 3.0",
        aspects: "Лексика: обмен, волонтёрство, культурный обмен; конструкции: 有机会参加…, 让我大开眼界, 跟…完全不一样; рассказы/гипотезы о поездках и обменах."
      },
      {
        number: 17,
        title: "Китай в глобальном мире",
        topic: "Страна и современность",
        aspects: "Лексика: 大城市, 发展, 传统和现代, 文化差异; краткие тексты о Китае сегодня; конструкции: 一方面…，另一方面…, 在…方面很有名; обсуждение образа Китая."
      },
      {
        number: 18,
        title: "Повтор блока «Город, путешествия, Китай»",
        topic: "Обобщающий",
        aspects: "Работа с картами и короткими статьями; устные мини-доклады 10–12 фраз; письменный мини-текст о своем городе/желанном городе в Китае."
      },
      {
        number: 19,
        title: "Медиа, новости, критическое мышление",
        topic: "СМИ и информация",
        aspects: "Лексика: 新闻, 文章, 信息, 观点, 影响; конструкции: 在网上看到一篇文章, 有的人觉得…, 也有人觉得…; обсуждение «какие новости интересны подросткам»."
      },
      {
        number: 20,
        title: "Соцсети, контент, кибербезопасность",
        topic: "Цифровая среда 3.0",
        aspects: "Лексика: 账号, 隐私, 安全, 骗局, 网络暴力; конструкции: 在网上发…, 注意…, 避免…, 不应该…; разбор типичных рисков в сети."
      },
      {
        number: 21,
        title: "Искусство, кино, музыка",
        topic: "Культура и самовыражение",
        aspects: "Лексика: художественный фильм, документальный, жанр, смысл; конструкции: 这部电影主要说的是…, 给我的感觉是…, 对…有很大的影响; обсуждение любимых фильмов/музыки."
      },
      {
        number: 22,
        title: "Китайская культура: традиции и современность",
        topic: "Культурология",
        aspects: "Лексика: 传统文化, 春节, 中秋节, 书法, 武术; сопоставление традиций и современного образа жизни; мини-сообщения «какой элемент китайской культуры мне интересен и почему»."
      },
      {
        number: 23,
        title: "Повтор блока «Медиа, соцсети, культура»",
        topic: "Обобщающий",
        aspects: "Мини-дискуссии «медиа полезны/вредны», «соцсети и подростки»; отработка выражения мнения и аргументации; контроль фраз 一方面…另一方面…, 我同意/不同意…."
      },
      {
        number: 24,
        title: "Временные формы: прошлое/опыт/продолжительность",
        topic: "Грамматика: 了 / 过 / 以前",
        aspects: "Систематизация: 了 (результат), 过 (опыт), 以前/现在/将来; конструкции: 已经…了, 还没…, 我学汉语学了…年了, 一直…; тренировочные рассказики «как менялся я/мои интересы»."
      },
      {
        number: 25,
        title: "Результат и степень",
        topic: "Грамматика: результативные конструкции",
        aspects: "Лексика и конструкции: 看完, 做好, 听懂, 找到, 写错; степень: 非常, 比较, 特别, 极了; упражнения на использование результативных глаголов в контексте учёбы и жизни."
      },
      {
        number: 26,
        title: "把 и 被 на уровне 9 класса",
        topic: "Грамматика: 把/被",
        aspects: "Повтор и расширение: 把作业交给老师, 把房间整理好; 被: 作业被忘了, 手机被偷了 (на аккуратных бытовых примерах); обсуждение «что можно изменить/исправить» через 把, «что произошло» через 被."
      },
      {
        number: 27,
        title: "Связи, логика, аргументация",
        topic: "Сложные предложения",
        aspects: "Систематизация: 因为…所以…, 虽然…但是…, 如果…就…, 不但…而且…, 连…都…, 一方面…另一方面…; построение развернутых аргументов и мини-эссе (устно)."
      },
      {
        number: 28,
        title: "Чтение: подросток, общество, будущее",
        topic: "Чтение с пониманием",
        aspects: "Адаптированные тексты 16–18 предложений по темам «подросток и выбор», «цифровая жизнь», «общественные проблемы»; выделение ключевых идей, позиция автора, обсуждение."
      },
      {
        number: 29,
        title: "Письмо: аргументированное высказывание",
        topic: "Письменная речь",
        aspects: "Структура текста-мнения/эссе: тезис → 2–3 аргумента → вывод; использование связок и грамматики 了/过/把/被; написание текста 14–16 предложений по заданной теме."
      },
      {
        number: 30,
        title: "Иероглифы: осознанное владение",
        topic: "Иероглифы и лексика",
        aspects: "Работа с 10–12 ключевыми иероглифами (по темам года); разбор структуры, словообразование (сложные слова); закрепление через составление собственных предложений и мини-диалогов."
      },
      {
        number: 31,
        title: "Проект «Я и мой выбор»",
        topic: "Проектная подготовка",
        aspects: "Тема проекта: «я и будущее», «я и город», «я и медиа», «я и культура»; сбор материалов (лексика, примеры, факты); подготовка устного выступления (15–18 фраз) и письменного резюме (10–12 предложений)."
      },
      {
        number: 32,
        title: "Итог: устная коммуникация",
        topic: "Итоговая проверка говорения",
        aspects: "Индивидуальные монологи и диалоги по темам года; оценка: беглость, логичность, владение конструкциями 了/过/把/被, связками и лексикой; реакция на спонтанные уточняющие вопросы."
      },
      {
        number: 33,
        title: "Итог: чтение и письмо",
        topic: "Итоговая проверка чтения/письма",
        aspects: "Чтение адаптированного текста с заданиями (основная мысль, детали, отношение автора); написание 12–15 знакомых иероглифов в словах/фразах; аргументированное высказывание 14–16 предложений по опоре."
      },
      {
        number: 34,
        title: "Защита проектов и закрытие цикла",
        topic: "Заключительный",
        aspects: "Публичная защита проектов с вопросами/ответами; рефлексия: чему научились за годы изучения китайского в основной школе; фиксация личных целей (продолжение в 10–11 классе, использование языка в жизни/карьере)."
      }
    ]
  },
  {
    grade: 10,
    title: "Китайский язык для 10 класса",
    description: "Курс китайского языка для десятиклассников с углубленным изучением грамматики, развитием навыков аргументации и подготовкой к ЕГЭ.",
    lessons: [
      {
        number: 1,
        title: "Диагностика и цели года",
        topic: "Повтор и постановка целей",
        aspects: "Самопрезентация 15–20 фраз; актуализация грамматики (了, 过, 在, 把, 被, сложные связки); чтение и обсуждение адаптированного текста; формулирование личных языковых целей на год."
      },
      {
        number: 2,
        title: "Речевая «раскачка»",
        topic: "Беглость и звучание",
        aspects: "Shadowing по аудио; работа с паузами, логическим ударением, «сцеплением» слов; ввод/повтор разговорных маркеров (就是, 不然, 结果, 反正); короткие спонтанные диалоги."
      },
      {
        number: 3,
        title: "Управление регистром речи",
        topic: "Формальная vs неформальная речь",
        aspects: "Сравнение нейтрального/разговорного/чуть более формального стилей; формулы вежливости, смягчение/усиление мнения; перефразирование реплик под разные ситуации."
      },
      {
        number: 4,
        title: "Личность и идентичность",
        topic: "Кто я как молодой взрослый",
        aspects: "Лексика: идентичность, выбор, ответственность, ценности; конструкции: 对我来说…, 我特别在乎…, 我宁愿…也不…; монолог «как я себя вижу сейчас»."
      },
      {
        number: 5,
        title: "Друзья, комьюнити, сети",
        topic: "Социальный круг 2.0",
        aspects: "Лексика: сообщество, единомышленники, токсичная атмосфера; конструкции: 在…中, 跟…相处, 被…影响; обсуждение офлайн и онлайн-сообществ."
      },
      {
        number: 6,
        title: "Семья: партнёрство или контроль",
        topic: "Взросление в семье",
        aspects: "Лексика: доверие, границы, уважение, компромисс; конструкции: 一方面…，另一方面…, 虽然…但是…, 说服, 商量; ролевые диалоги «сложный разговор с родителями»."
      },
      {
        number: 7,
        title: "Личное благополучие",
        topic: "Психологическое здоровье",
        aspects: "Лексика: тревога, выгорание, поддержка, психолог; конструкции: 对…感到压力, 学会…, 通过…来放松; обсуждение стратегий заботы о себе."
      },
      {
        number: 8,
        title: "Повтор блока «Личность и отношения»",
        topic: "Обобщающий",
        aspects: "Устные монологи 18–20 фраз; мини-дебаты («строгие родители — плюс/минус»); слушание и анализ диалога/интервью; краткий письменный рефлексивный текст."
      },
      {
        number: 9,
        title: "Образование: школа vs колледж/вуз",
        topic: "Образовательные траектории",
        aspects: "Лексика: профиль, направление, факультет, практика; конструкции: 对…感兴趣, 适合/不适合…, 将来想在…发展; обсуждение плюсов/минусов разных траекторий."
      },
      {
        number: 10,
        title: "Навыки XXI века",
        topic: "Soft/hard skills",
        aspects: "Лексика: навык, критическое мышление, креативность, командная работа, цифр. грамотность; конструкции: …对将来很重要, 通过…来提高…; мини-доклады о важных навыках."
      },
      {
        number: 11,
        title: "Работа, стажировки, подработка",
        topic: "Первый опыт работы",
        aspects: "Лексика: подработка, стажировка, опыт, резюме; конструкции: 打工, 实习, 对简历有帮助, 学到很多; обсуждение реального/планируемого опыта работы."
      },
      {
        number: 12,
        title: "Карьера и жизненный путь",
        topic: "Долгосрочные планы",
        aspects: "Лексика: карьера, стабильность, риск, мечта; конструкции: 不是…而是…, 我希望自己将来能…, 即使…也…; эссе-обсуждение «карьера мечты vs стабильная работа»."
      },
      {
        number: 13,
        title: "Повтор блока «Образование и карьера»",
        topic: "Обобщающий",
        aspects: "Чтение текста о выборе профессии/обучения; выделение аргументов за/против; дискуссия; письменный текст-мнение 14–16 предложений."
      },
      {
        number: 14,
        title: "Город, страна, мир",
        topic: "Социальное пространство",
        aspects: "Лексика: мегаполис, провинция, миграция, урбанизация; конструкции: 跟…相比…, 在…方面很发达/落后; характеристика своего города/региона в контексте страны."
      },
      {
        number: 15,
        title: "Социальные проблемы",
        topic: "Общество и вызовы",
        aspects: "Лексика: неравенство, безработица, дискриминация (в мягком, школьном формате), доступность образования/медицины; конструкции: 面临…问题, 造成…, 导致…; обсуждение актуальных проблем."
      },
      {
        number: 16,
        title: "Технологии и человек",
        topic: "Цифровая трансформация",
        aspects: "Лексика: искусственный интеллект, автоматизация, онлайн-обучение, дистанц. работа; конструкции: 让生活更…, 也带来问题…, 人们越来越…; дискуссия «технологии — благо или риск»."
      },
      {
        number: 17,
        title: "Этика технологий и данных",
        topic: "Конфиденциальность и безопасность",
        aspects: "Лексика: персональные данные, конфиденциальность, слежка, фейк-ньюс; конструкции: 被…收集, 对…有影响, 应该限制/保护…; анализ кейсов, формулирование позиции."
      },
      {
        number: 18,
        title: "Повтор блока «Общество и технологии»",
        topic: "Обобщающий",
        aspects: "Работа с короткими «публицистическими» текстами; извлечение тезисов и аргументов; мини-дебаты; структурирование аргументированного ответа."
      },
      {
        number: 19,
        title: "Культура и идентичность",
        topic: "Культура, субкультура, стиль",
        aspects: "Лексика: культурный код, традиции, субкультура, самовыражение; конструкции: 代表…, 受到…影响, 跟…有关系; обсуждение «что такое \"быть собой\" в культуре»."
      },
      {
        number: 20,
        title: "Китайская культура: глубже",
        topic: "Традиция и современность",
        aspects: "Лексика: 传统文化, 现代社会, 文化传承, 文化冲击; тексты о китайских традициях в современном городе; сравнение с российскими реалиями."
      },
      {
        number: 21,
        title: "Межкультурная коммуникация",
        topic: "Контакт культур",
        aspects: "Лексика: стереотип, предубеждение, уважение, диалог; конструкции: 对…有误会, 了解…, 尊重…, 从…的角度看; моделирование межкультурных ситуаций."
      },
      {
        number: 22,
        title: "Медиа, искусство, контент",
        topic: "Фильмы, книги, онлайн-контент",
        aspects: "Лексика: автор, режиссёр, сюжет, тема, посыл; конструкции: 通过这部作品…, 想告诉我们…, 给我留下很深的印象; анализ фильма/книги/сериала."
      },
      {
        number: 23,
        title: "Повтор блока «Культура и межкультурность»",
        topic: "Обобщающий",
        aspects: "Мини-проекты: «культурный объект, который меня описывает»; устные презентации; обсуждение китайских/российских культурных кодов."
      },
      {
        number: 24,
        title: "Грамматика: времена и аспекты",
        topic: "Систематизация вида/времени",
        aspects: "Комплекс: 了, 过, 正在, 一直, 刚, 刚才, 以前/后来/现在/将来; сопоставление значений; тренировочные рассказы «раньше–теперь–потом»."
      },
      {
        number: 25,
        title: "Грамматика: 把, 被, результативы",
        topic: "Управление действием",
        aspects: "Систематизация 把/被 в реальных контекстах (учёба, быт, город); результативные и направленные глаголы (看完, 做好, 走进, 拿出来); перефразирование нейтральных предложений."
      },
      {
        number: 26,
        title: "Грамматика: сложные связки",
        topic: "Логика и аргументация",
        aspects: "Систематизация и расширение: 不但…而且…, 除了…以外…, 即使…也…, 只要…就…, 之所以…是因为…; построение сложных аргументированных высказываний."
      },
      {
        number: 27,
        title: "Функциональная лексика",
        topic: "Маркеры дискурса",
        aspects: "Лексика-связки: 总的来说, 首先, 另外, 再说, 最后, 其实, 反而, 结果; формирование «скелета» устного и письменного текста; тренировка мини-эссе устно."
      },
      {
        number: 28,
        title: "Чтение: публицистический текст",
        topic: "Анализ текста",
        aspects: "Чтение адаптированной статьи/колонки по социальной/культурной теме; выделение тезиса и аргументов, позиции автора; обсуждение, согласие/несогласие."
      },
      {
        number: 29,
        title: "Письмо: эссе-мнение",
        topic: "Письменная аргументация",
        aspects: "Структура эссе (вступление–аргументы–контраргументы/пример–вывод); использование связок и грамматики из блоков 24–27; написание текста 16–18 предложений."
      },
      {
        number: 30,
        title: "Иероглифы и лексика высокого уровня",
        topic: "Лексические поля",
        aspects: "Группировка лексики по темам года (общество, технологии, культура, образование); 10–12 ключевых иероглифов и словосочетаний; работа с синонимами/близкими по смыслу выражениями."
      },
      {
        number: 31,
        title: "Проект «Я и мир» – подготовка",
        topic: "Проектная деятельность",
        aspects: "Выбор темы проекта: «я и профессия», «я и технологии», «я и культура», «я и город/общество»; сбор материалов (тексты, примеры, статистика); подготовка структурированного устного выступления (18–20 фраз) и письменного резюме."
      },
      {
        number: 32,
        title: "Итоговая устная коммуникация",
        topic: "Контроль говорения",
        aspects: "Индивидуальные монологи и диалоги по темам года; оценка: беглость, глубина высказывания, корректность грамматики (了/过/把/被, сложные связки), умение аргументировать и реагировать на вопросы."
      },
      {
        number: 33,
        title: "Итог по чтению и письму",
        topic: "Контроль чтения/письма",
        aspects: "Чтение адаптированного публицистического текста с заданиями; написание иероглифов в составе лексических блоков; письменное эссе 16–18 предложений по одной из типовых тем (общество/культура/технологии)."
      },
      {
        number: 34,
        title: "Защита проектов и рефлексия",
        topic: "Заключительный",
        aspects: "Публичная защита проектов с Q&A; обсуждение личного прогресса за год; формулирование целей на 11 класс (экзамены, HSK, обучение/карьера с китайским)."
      }
    ]
  },
  {
    grade: 11,
    title: "Китайский язык для 11 класса",
    description: "Курс китайского языка для одиннадцатиклассников с подготовкой к ЕГЭ, углубленным изучением грамматики и развитием навыков аргументации.",
    lessons: [
      {
        number: 1,
        title: "Диагностика и цели выпускного года",
        topic: "Старт и постановка целей",
        aspects: "Развёрнутая самопрезентация (20+ фраз); актуализация ключевой грамматики (аспекты, 把/被, сложные связки); чтение и обсуждение публицистического текста; фиксация индивидуальных целей (экзамен, HSK, поступление, работа)."
      },
      {
        number: 2,
        title: "Речевая «калибровка»",
        topic: "Беглость и регистр",
        aspects: "Отработка естественного темпа; переход между нейтральным и более формальным стилем; клише для устных ответов и дискуссий: 首先, 另外, 总的来说, 换句话说; мини-ответы на «экзаменационные» вопросы."
      },
      {
        number: 3,
        title: "Я как взрослый человек",
        topic: "Личностная идентичность",
        aspects: "Лексика: автономия, ответственность, зрелость, принципы; конструкции: 对我来说…, 我坚持…, 我不能接受…, 我愿意…; устный монолог «кем я себя считаю на пороге взрослой жизни»."
      },
      {
        number: 4,
        title: "Отношения и личные границы",
        topic: "Коммуникация и уважение",
        aspects: "Лексика: личные границы, манипуляция, уважение, доверие; конструкции: 受到…影响, 被…控制, 尊重…, 保护自己; ролевые ситуации «как отстаивать себя корректно»."
      },
      {
        number: 5,
        title: "Семья и выбор жизненного пути",
        topic: "Поколенческий диалог",
        aspects: "Лексика: ожидания, давление, поддержка, компромисс; конструкции: 父母希望我…，但是我更想…, 一方面…，另一方面…; обсуждение конфликтов из-за учебы, профессии, личной жизни."
      },
      {
        number: 6,
        title: "Психологическая устойчивость",
        topic: "Стресс, ресурсы, баланс",
        aspects: "Лексика: выгорание, ресурс, поддержка, привычки; конструкции: 对…感到压力, 通过…来调整, 学会…, 不再…; стратегии поддержания баланса в выпускной год."
      },
      {
        number: 7,
        title: "Ценности и жизненные приоритеты",
        topic: "Личностные выборы",
        aspects: "Лексика: свобода, стабильность, риск, безопасность, смысл; конструкции: 宁愿…也不…, 与其…不如…, 对…来说最重要的是…; устная дискуссия «что для меня главное»."
      },
      {
        number: 8,
        title: "Повтор блока «Личность, отношения, ценности»",
        topic: "Обобщающий",
        aspects: "Устные монологи 20+ фраз; парные дискуссии с аргументами и контраргументами; listening (интервью с молодым человеком) и аналитические вопросы; мини-эссе-рефлексия."
      },
      {
        number: 9,
        title: "Образование после школы",
        topic: "Образовательные траектории",
        aspects: "Лексика: бакалавриат, магистратура, колледж, gap year; конструкции: 考大学, 申请…, 读…专业, 先…再…; обсуждение вариантов (вуз, колледж, работа, обучение за рубежом)."
      },
      {
        number: 10,
        title: "Рынок труда и будущие профессии",
        topic: "Карьера и компетенции",
        aspects: "Лексика: рынок труда, востребованный, автоматизация, гибкие навыки; конструкции: 在…领域工作, 对…有需求, 被…取代; обсуждение профессий будущего и роли китайского языка."
      },
      {
        number: 11,
        title: "Личная стратегия «5–10 лет»",
        topic: "Планирование будущего",
        aspects: "Лексика: стратегия, цель, шаги, риск, резервный план; конструкции: 我的目标是…, 为了这个目标我打算…, 如果…失败，就…; устный план «я через 5–10 лет»."
      },
      {
        number: 12,
        title: "Образование и работа в Китае",
        topic: "Китай как возможность",
        aspects: "Лексика: обмен, стипендия, кампус, стажировка, международная компания; конструкции: 在中国学习/工作, 有机会的话…, 跟在本国学习相比…; сопоставление возможностей РФ/КНР."
      },
      {
        number: 13,
        title: "Повтор блока «Образование и карьера»",
        topic: "Обобщающий",
        aspects: "Чтение «профориентационного» текста; выделение тезисов/аргументов; мини-дебаты «следовать мечте vs ориентироваться на рынок»; письменное эссе-мнение 16–18 фраз."
      },
      {
        number: 14,
        title: "Общество, справедливость, неравенство",
        topic: "Социальные темы",
        aspects: "Лексика: социальная справедливость, шансы, привилегии, уязвимые группы; конструкции: 造成…, 导致…, 对…不公平, 提高/减少…; обсуждение неравенства в образовании/городе."
      },
      {
        number: 15,
        title: "Город, экология, качество жизни",
        topic: "Среда и устойчивое развитие",
        aspects: "Лексика: урбанизация, загрязнение, переработка, устойчивое развитие; конструкции: 为了保护环境…, 如果政府…, 如果市民…, 就…; предложения по улучшению городской среды."
      },
      {
        number: 16,
        title: "Глобальные вызовы",
        topic: "Глобальные проблемы",
        aspects: "Лексика: климатический кризис, глобализация, миграция, пандемии (на уровне школьной тематики); конструкции: 全球性问题, 越来越…, 必须…, 否则…; обсуждение ответственности человека и государства."
      },
      {
        number: 17,
        title: "Китай и мир",
        topic: "Геополитика в школьных рамках",
        aspects: "Лексика: сотрудничество, обмен, экономическое развитие, международные проекты (без политики как таковой — на уровне культуры и экономики); конструкции: 在…方面合作, 对…有影响; обсуждение роли Китая в мире."
      },
      {
        number: 18,
        title: "Повтор блока «Общество, экология, глобальные вопросы»",
        topic: "Обобщающий",
        aspects: "Работа с 1–2 адаптированными статьями; поиск тезиса и аргументов; мини-дебаты в формате «за/против»; фиксация клише для выражения позиции."
      },
      {
        number: 19,
        title: "Медиа и информационная среда",
        topic: "Критическое мышление",
        aspects: "Лексика: медиа, повестка, манипуляция, точка зрения; конструкции: 媒体常常…, 对…有影响, 从…的角度看, 不一定是事实; разбор новостного текста, поиск оценочной лексики."
      },
      {
        number: 20,
        title: "Соцсети, цифровой след, этика",
        topic: "Интернет и этика",
        aspects: "Лексика: цифровой след, анонимность, кибербуллинг, приватность; конструкции: 在网上留下…, 有可能被…, 保护自己的隐私, 不应该…; анализ кейсов и формулирование рекомендаций."
      },
      {
        number: 21,
        title: "Искусство, культура, самоидентификация",
        topic: "Искусство и самовыражение",
        aspects: "Лексика: символ, метафора, посыл, идентичность; конструкции: 通过这部作品…, 表达…, 反映…, 给我留下很深的印象; обсуждение фильма/книги/песни, которая «меня описывает»."
      },
      {
        number: 22,
        title: "Китайская культура сегодня",
        topic: "Современный Китай",
        aspects: "Лексика: традиция и модернизация, городская культура, креативные индустрии; конструкции: 既…又…, 一方面…，另一方面…, 让世界了解中国; анализ текста/видео о современной китайской культуре."
      },
      {
        number: 23,
        title: "Повтор блока «Медиа, этика, культура»",
        topic: "Обобщающий",
        aspects: "Структурированные дискуссии по 2–3 вопросам; тренировка построения ответа на «экзаменационный» вопрос по тексту; письменный отзыв на медиа/культурный объект."
      },
      {
        number: 24,
        title: "Грамматика: систематизация аспектов",
        topic: "Вид/время и нюансы",
        aspects: "Системная таблица: 了 (результат/изменение), 过 (опыт), 正在/在 (процесс), 刚/刚才 (недавность), 一直 (длительность), 以前/现在/将来; тренировочные рассказы с временными ориентирами."
      },
      {
        number: 25,
        title: "Грамматика: 把/被 и результативы",
        topic: "Управление действием и фокус",
        aspects: "Повтор и усложнение 把/被 в контекстах «общество, медиа, технологии»: 把注意力放在…, 被信息淹没; результативы и направленные глаголы (看清, 想通, 走出来); перефразирование нейтральных предложений."
      },
      {
        number: 26,
        title: "Грамматика: сложные связки и логика",
        topic: "Аргументация и связность",
        aspects: "Расширение: 尽管…但是…, 之所以…是因为…, 只要…就…, 即使…也…, 无论…都…; построение сложных аргументированных высказываний, разбор типичных логических ошибок."
      },
      {
        number: 27,
        title: "Дискурс: как строить развернутый ответ",
        topic: "Структура устного и письменного ответа",
        aspects: "Структуры: 首先…，其次…，另外…，最后…; клише для вступления, примера, сравнения, вывода; тренировка развёрнутых ответов на «абстрактные» вопросы (общество, технологии, культура)."
      },
      {
        number: 28,
        title: "Чтение: аналитический текст",
        topic: "Чтение с глубокой переработкой",
        aspects: "Чтение адаптированного публицистического/эссеистического текста (18–20 предложений); определение позиции автора, аргументов, контраргументов; формулирование собственного ответа/реплики."
      },
      {
        number: 29,
        title: "Письмо: экзаменационное эссе",
        topic: "Письменная аргументация",
        aspects: "Чёткий шаблон эссе: постановка проблемы → позиция → 2–3 аргумента с примерами → контраргумент/другое мнение → вывод; активное использование связок и грамматики из уроков 24–27; написание текста 18–20 предложений."
      },
      {
        number: 30,
        title: "Иероглифы и лексические блоки",
        topic: "Закрепление лексики высокого уровня",
        aspects: "Систематизация лексики по крупным темам года (личность, общество, технологии, культура, будущее); 12–15 ключевых иероглифов/словосочетаний; словообразование, синонимы, устойчивые сочетания; составление собственных примеров."
      },
      {
        number: 31,
        title: "Проект «Я и мой мир после школы» – подготовка",
        topic: "Проектная деятельность",
        aspects: "Выбор темы: «я и выбранная профессия», «я и роль китайского», «я и современное общество», «я и культура/медиа»; поиск и отбор материалов; подготовка устного выступления (20+ фраз) и письменного резюме (15–18 предложений)."
      },
      {
        number: 32,
        title: "Итог: устная коммуникация (моделирование экзамена)",
        topic: "Контроль говорения",
        aspects: "Индивидуальные «экзаменационные» ответы: монолог по теме + диалог по ситуации; оценка: беглость, логика, регистр, работа с вопросами; использование дискурсивных маркеров и сложных конструкций."
      },
      {
        number: 33,
        title: "Итог: чтение и письмо (моделирование экзамена)",
        topic: "Контроль чтения/письма",
        aspects: "Чтение экзаменоподобного текста с заданиями (общая мысль, детали, вывод); написание эссе 18–20 предложений по заданной теме; проверка владения иероглифами и лексикой высокого уровня."
      },
      {
        number: 34,
        title: "Защита проектов и финальная рефлексия",
        topic: "Заключительный",
        aspects: "Публичная защита проектов с вопросами/ответами; обсуждение личного пути в китайском: от начальной до старшей школы; формулирование планов по использованию языка после выпуска (учёба, работа, личные проекты)."
      }
    ]
  },
  {
    grade: 200,
    title: "Китайский язык для вуза",
    description: "Курс китайского языка для студентов вузов с развитием академических навыков, деловой коммуникации и подготовкой к профессиональному использованию языка.",
    lessons: [
      {
        number: 1,
        title: "Входная калибровка",
        topic: "Диагностика и цели курса",
        aspects: "Устное интервью на китайском/русском; определение уровня группы; фиксация целей (общий китайский, академический, деловой); обзор формата курса, видов контроля и проектного трека."
      },
      {
        number: 2,
        title: "Переупаковка базовой грамматики",
        topic: "Повтор ключевой базы",
        aspects: "Актуализация: местоимения, базовые времена (了, 过, 在), вопросительные конструкции; короткие диалоги; выявление провалов по фонетике и лексике."
      },
      {
        number: 3,
        title: "Речевая разминка",
        topic: "Беглость и произношение",
        aspects: "Shadowing по аудио; скоростное чтение пиньинь и знакомых иероглифов; отработка ритма и интонации; минимальное выравнивание произношения под вузовский стандарт."
      },
      {
        number: 4,
        title: "Я как студент",
        topic: "Самопрезентация в вуз-контексте",
        aspects: "Лексика: факультет, направление, курс, расписание; конструкции: 我在…大学…, 我学…专业; 10–12 фраз о себе в формате «мини-питча»; отработка в парах."
      },
      {
        number: 5,
        title: "Кампус и инфраструктура",
        topic: "Университетская среда",
        aspects: "Лексика: корпус, аудитория, общежитие, столовая, библиотека; конструкции: 在…楼, 离…近/远; описание кампуса и маршрутов «дорм–аудитория–столовая»."
      },
      {
        number: 6,
        title: "Учебный календарь",
        topic: "Расписание и нагрузка",
        aspects: "Лексика: семестр, зачет, экзамен, модуль; конструкции: 一节课, 学分, 安排时间; обсуждение учебной нагрузки, составление и обсуждение своего timetable."
      },
      {
        number: 7,
        title: "Учебные форматы",
        topic: "Лекции, семинары, практики",
        aspects: "Лексика: лекция, семинар, проект, доклад, кейс; конструкции: 上…课, 做报告, 写论文; сценарии общения «преподаватель–студент» в аудитории."
      },
      {
        number: 8,
        title: "Повтор блока «Студент и кампус»",
        topic: "Обобщающий",
        aspects: "Систематизация лексики «вуз, кампус, расписание»; моделирование типичного академического дня; мини-ролевая игра «первый день в университете»."
      },
      {
        number: 9,
        title: "Академическое общение",
        topic: "Коммуникация на занятиях",
        aspects: "Фразы: задать вопрос, уточнить, возразить; конструкции: 我可以问一个问题吗, 我不太明白…, 我觉得…, 不太同意…; отработка академного дискурса в мини-дискуссиях."
      },
      {
        number: 10,
        title: "Работа с текстом",
        topic: "Академическое чтение (база)",
        aspects: "Стратегии: поиск ключевых слов, сканирование текста, выделение структур (вступление–основная часть–вывод); работа с коротким науч-поп текстом."
      },
      {
        number: 11,
        title: "Конспект и summary",
        topic: "Навыки переработки текста",
        aspects: "Лексика: конспект, тезис, вывод; конструкции: 这篇文章主要说…, 作者认为…, 我觉得最重要的是…; тренировка устного и письменного summary."
      },
      {
        number: 12,
        title: "Мини-доклад",
        topic: "Устная академическая презентация",
        aspects: "Структура доклада: вступление, 2–3 пункта, вывод; ввод клише: 首先…, 其次…, 最后…, 总的来说…; подготовка и защита 2–3-минутных мини-докладов по простым темам."
      },
      {
        number: 13,
        title: "Повтор блока «Академические скиллы»",
        topic: "Обобщающий",
        aspects: "Чтение + обсуждение укороченной статьи; подготовка короткого конспекта; устные вопросы к тексту и мини-дискуссия в малых группах."
      },
      {
        number: 14,
        title: "Город и мобильность",
        topic: "Городская среда для студента",
        aspects: "Лексика: аренда жилья, транспорт, кофейни, коворкинг; конструкции: 对学生来说…, 交通方便/不方便, 在…附近找房子; описание «студенческого» города."
      },
      {
        number: 15,
        title: "Социальные контакты",
        topic: "Нетворкинг и студсообщество",
        aspects: "Лексика: студсообщество, клуб, мероприятие, конференция; конструкции: 参加活动, 认识新朋友, 加入社团; типовые сценарии small talk на мероприятиях."
      },
      {
        number: 16,
        title: "Межкультурный кампус",
        topic: "Иностранные студенты и обмен",
        aspects: "Лексика: обмен, партнёрский вуз, мультикультура; конструкции: 来自不同国家, 文化差异, 互相学习; отработка диалогов «знакомство с иностранным студентом»."
      },
      {
        number: 17,
        title: "Повтор блока «Город, кампус, межкультурка»",
        topic: "Обобщающий",
        aspects: "Карточки-ситуации: «снять жильё», «найти библиотеку», «познакомиться на конференции»; отработка диалогов и мини-монологов; аудирование по теме."
      },
      {
        number: 18,
        title: "Китайская академическая культура",
        topic: "Университеты КНР",
        aspects: "Лексика: 重点大学, 宿舍, 社团, 导师; обзор жизни студента в Китае (в сопоставлении с РФ); чтение адаптированного текста и обсуждение отличий."
      },
      {
        number: 19,
        title: "Про учёбу «по-взрослому»",
        topic: "Образование, мотивация, результаты",
        aspects: "Лексика: мотивация, прокрастинация, самоорганизация; конструкции: 我常常拖延…, 为了…, 必须…, 否则…; обсуждение личных стратегий учёбы."
      },
      {
        number: 20,
        title: "Soft skills студента",
        topic: "Навыки XXI века",
        aspects: "Лексика: командная работа, критическое мышление, презентационные навыки; конструкции: 提高…, 需要…, 对将来很重要; мини-доклады о ключевых навыках."
      },
      {
        number: 21,
        title: "Карьера и китайский",
        topic: "Язык как карьерный актив",
        aspects: "Лексика: отрасль, позиция, стажировка, карьерный трек; конструкции: 在…领域工作, 用汉语跟…合作, 对找工作有帮助; обсуждение, где и как язык может монетизироваться."
      },
      {
        number: 22,
        title: "Повтор блока «Китай, учеба, карьера»",
        topic: "Обобщающий",
        aspects: "Чтение кейс-историй про студентов/молодых специалистов; выделение карьерной траектории; устные мини-кейсы «как бы я поступил»."
      },
      {
        number: 23,
        title: "Медиа и информация",
        topic: "Профессиональное потребление контента",
        aspects: "Лексика: профильные статьи, база данных, источник, статистика; конструкции: 根据…的数据, 这篇报道指出…, 有的人认为…, 也有人觉得…; анализ короткого медиа-текста по специальности."
      },
      {
        number: 24,
        title: "Цифровая среда и этика",
        topic: "Онлайн-поведение студента",
        aspects: "Лексика: цифровой след, плагиат, академическая честность; конструкции: 不能随便复制, 尊重版权, 在网上发表意见; обсуждение кейсов и формулирование правил."
      },
      {
        number: 25,
        title: "Китай в глобальной экономике",
        topic: "Страна в профессиональном контексте",
        aspects: "Лексика: рынок, инвестиции, сотрудничество, проект; конструкции: 在…市场, 跟中国公司合作, 在…方面越来越重要; обзор роли Китая в отрасли, связанной с профилем студентов (high level)."
      },
      {
        number: 26,
        title: "Деловая базовая коммуникация",
        topic: "Первые шаги в business Chinese",
        aspects: "Лексика: компания, отдел, коллега, партнёр; конструкции: 在…公司实习, 这是我的同事…, 很高兴认识您; базовые формулы делового этикета и визиточного обмена."
      },
      {
        number: 27,
        title: "Грамматика: систематизация под вуз",
        topic: "Вид, аспект, связки",
        aspects: "Быстрая ревизия: 了/过/在/着, 把/被, результативы 看完/做好, логические связки 因为…所以…, 虽然…但是…, 不但…而且…, 只要…就…; практика в контексте «учёба/город/карьера»."
      },
      {
        number: 28,
        title: "Письмо: академический абзац",
        topic: "Структура и оформление",
        aspects: "Структура абзаца: тема → пояснение → пример → мини-вывод; клише: 首先…, 另外…, 比如…, 总之…; написание 2–3 абзацев по простому академическому сюжету."
      },
      {
        number: 29,
        title: "Письмо: мини-эссе",
        topic: "Аргументированное высказывание",
        aspects: "Шаблон: проблема → позиция → аргументы → вывод; использование связок и лексики курса; эссе 16–18 предложений на тему «учёба/карьера/культура»."
      },
      {
        number: 30,
        title: "Иероглифы и терминология",
        topic: "Профлексика (базовый уровень)",
        aspects: "Подбор 10–15 ключевых терминов по профилю (или общих академических: 研究, 分析, 结果, 方法, 数据 и др.); отработка написания, чтения, использования в предложениях."
      },
      {
        number: 31,
        title: "Проект «Студент и профессия» – подготовка",
        topic: "Проектная деятельность",
        aspects: "Выбор темы: «мой профиль и Китай», «мой кампус будущего», «моя карьера с китайским»; поиск источников; план устного доклада (10–12 минут речи) и краткой письменной аннотации."
      },
      {
        number: 32,
        title: "Итоговая устная коммуникация",
        topic: "Контроль говорения",
        aspects: "Индивидуальные «квазииспытания»: монолог по теме + мини-дискуссия с преподавателем; оценка беглости, регистров, аргументации и работы с вопросами."
      },
      {
        number: 33,
        title: "Итог: чтение и письмо",
        topic: "Контроль академических навыков",
        aspects: "Чтение адаптированного текста (статья/эссе) с заданиями по содержанию; написание структурированного мини-эссе 18–20 предложений с использованием целевых конструкций и лексики."
      },
      {
        number: 34,
        title: "Защита проектов и закрытие цикла",
        topic: "Заключительный",
        aspects: "Публичная защита проектов (презентация + Q&A); обсуждение личного роста за год; фиксация дальнейшего roadmap: HSK, стажировки, академическая/карьерная траектория с китайским."
      }
    ]
  },
  {
    grade: 1,
    title: "Арабский язык для 1 класса",
    description: "Курс арабского языка для первоклассников с акцентом на изучение алфавита, базовое чтение и письмо, знакомство с арабской культурой.",
    lessons: [
      {
        number: 1,
        title: "Вводный: зачем нам арабский",
        topic: "Знакомство с языком и письменностью",
        aspects: "Где используется арабский; примеры арабской письменности; направление письма справа налево; правила поведения на уроке; мотивационная игра «Найди арабские буквы»"
      },
      {
        number: 2,
        title: "Арабский алфавит целиком",
        topic: "Обзор алфавита",
        aspects: "Кол-во букв; отличие «буква–звук»; знакомство с печатной и рукописной формой; карточки с буквами; игра «найди такую же букву»"
      },
      {
        number: 3,
        title: "Первые буквы ا ب ت ث",
        topic: "Знакомство с буквами ا، ب، ت، ث",
        aspects: "Названия и порядок букв; базовое произношение; изолированное написание; сравнение с русскими звуками; обводка по контуру, прописывание в тетради"
      },
      {
        number: 4,
        title: "Буквы ج ح خ",
        topic: "Новые согласные ج، ح، خ",
        aspects: "Различие «мягкого/твёрдого» звучания; артикуляция; написание; визуальные ассоциации/рисунки; игры на распознавание букв на карточках и доске"
      },
      {
        number: 5,
        title: "Буквы د ذ ر ز",
        topic: "Звонкие и свистящие د، ذ، ر، ز",
        aspects: "Слуховое различение; написание; чтение слогов типа «دا، زا» без формального объяснения кратких гласных; игры «услышь и покажи букву»"
      },
      {
        number: 6,
        title: "Буквы س ش ص ض",
        topic: "Шипящие и «толстые» س، ش، ص، ض",
        aspects: "Различие произношения س/ش, лёгкие и «тяжёлые» ص/س; написание; тренировка чтения открытых слогов; работа в парах с карточками"
      },
      {
        number: 7,
        title: "Буквы ط ظ ع غ",
        topic: "Горловые и твёрдые ط، ظ، ع، غ",
        aspects: "Безопасное произнесение горловых; различение на слух; написание; ассоциативные рисунки; игра «найди горловую букву»"
      },
      {
        number: 8,
        title: "Буквы ف ق ك",
        topic: "Губные и заднеязычные ف، ق، ك",
        aspects: "Сравнение ف/ق/ك; написание; чтение простых слогов; мини-диктант из отдельных букв"
      },
      {
        number: 9,
        title: "Буквы ل م ن",
        topic: "«Л», «М», «Н» в арабском ل، م، ن",
        aspects: "Артикуляция; написание; упражнения на слуховое различение; первые «цепочки» из букв (مثلاً: ل م ن)"
      },
      {
        number: 10,
        title: "Буквы هـ و ي",
        topic: "Завершение алфавита هـ، و، ي",
        aspects: "Статус و، ي как согласные/полугласные (только на уровне слуха); написание; повторение всех изученных букв; игра «собери алфавит»"
      },
      {
        number: 11,
        title: "Повторение алфавита",
        topic: "Обобщение букв",
        aspects: "Чтение и называние всех букв; алфавитная песенка; групповая работа с плакатом алфавита; простые викторины «кто быстрее покажет букву»"
      },
      {
        number: 12,
        title: "Краткие гласные",
        topic: "Фатха, дамма, касра",
        aspects: "Понятие краткого гласного; знаки َ ُ ِ на примерах знакомых букв; чтение простых слогов: بَ، بُ، بِ; слуховые упражнения «что услышал»"
      },
      {
        number: 13,
        title: "Формы букв",
        topic: "Соединение букв в слове",
        aspects: "Понятие начальной, средней, конечной и изолированной формы (на примере ب، ت، ل); тренировка соединения 2–3 букв; написание «цепочек» типа با، بيت"
      },
      {
        number: 14,
        title: "Чтение слогов 1",
        topic: "Слоги с первыми группами букв",
        aspects: "Стабилизация чтения слогов с ا، ب، ت، ث، ج، ح، خ; упражнения на чтение «слева направо глазами, справа налево рукой»; работа в парах «один пишет — другой читает»"
      },
      {
        number: 15,
        title: "Чтение слогов 2",
        topic: "Слоги с буквами د، ذ، ر، ز، س، ش",
        aspects: "Чтение слогов да/ду/ди и др.; сравнение близких звуков; игры «лишний слог»; мини-контроль чтения слогов у каждого ученика"
      },
      {
        number: 16,
        title: "Чтение слогов 3",
        topic: "Слоги с «тяжёлыми» буквами ص، ض، ط، ظ",
        aspects: "Закрепление произношения; чтение слогов; медленное чтение «по буквам»; командные игры «собери слог из букв»"
      },
      {
        number: 17,
        title: "Чтение слогов 4",
        topic: "Слоги с ع، غ، ف، ق، ك، هـ، و، ي",
        aspects: "Отработка сложных для слуха сочетаний; введение простых псевдослов; чтение в хоре и индивидуально; работа с карточками-магнитами на доске"
      },
      {
        number: 18,
        title: "Первые слова",
        topic: "Чтение и письмо простых слов",
        aspects: "Слова типа: باب، بيت، أم، أب، يد؛ разбивка слова на буквы; запись в тетради; подписание картинок простыми словами"
      },
      {
        number: 19,
        title: "Приветствия",
        topic: "Основные приветствия и вежливые формулы",
        aspects: "السلام عليكم، وعليكم السلام، صباح الخير (как набор фраз); правила вежливости; отработка диалога «приветствие–ответ»; ролевая игра «встреча в классе»"
      },
      {
        number: 20,
        title: "Представление себя",
        topic: "Фразы знакомства",
        aspects: "أنا …؛ ما اسمك؟؛ اسمي …؛ связка жестов и фраз; диалог в парах; подписание карточек с именами на арабском (упрощённая транслитерация)"
      },
      {
        number: 21,
        title: "Числа 1–5",
        topic: "Счёт и цифры ١–٥",
        aspects: "Написание цифр; соотнесение количество–цифра–слово; счёт предметов в классе; игра «найди 3 ручки» по-арабски"
      },
      {
        number: 22,
        title: "Числа 6–10",
        topic: "Счёт до десяти",
        aspects: "Цифры ٦–١٠; повторение ١–٥; ритмические считалки; мини-диалоги «сколько у тебя карандашей?» (упрощённые конструкции)"
      },
      {
        number: 23,
        title: "Цвета",
        topic: "Базовые цвета",
        aspects: "Лексика: أبيض، أسود، أحمر، أزرق، أخضر и др.; соотнесение цвет–предмет; игра «покажи предмет такого цвета»; раскраска с подписями цветов"
      },
      {
        number: 24,
        title: "Вещи в классе",
        topic: "Учебные принадлежности",
        aspects: "Слова: كتاب، قلم، كرسي، طاولة، سبورة и др.; сопоставление с реальными объектами в классе; подписи на стикерах; игра-квест «найди предмет по слову»"
      },
      {
        number: 25,
        title: "Моя семья",
        topic: "Члены семьи",
        aspects: "Лексика: أم، أب، أخ، أخت، جد، جدة и др.; простая схема-дерево семьи; подпись членов семьи по картинкам; устные мини-монологи «это моя мама»"
      },
      {
        number: 26,
        title: "Животные",
        topic: "Домашние и дикие животные",
        aspects: "Слова: قط، كلب، حصان، طائر и др.; классификация по группам; игра «угадай животное» по описанию/жестам; подписание картинок"
      },
      {
        number: 27,
        title: "Время дня и распорядок",
        topic: "Части дня, простые действия",
        aspects: "Лексика: صباح، مساء، ليل; базовые глаголы уровня «есть, спать, играть» (как отдельные слова без спряжения); простые связки картинка+слово; мини-комиксы «мой день»"
      },
      {
        number: 28,
        title: "Повторение букв и чтения",
        topic: "Консолидация навыка чтения",
        aspects: "Обобщающее чтение всех букв и слогов; чтение коротких рядов из псевдослов; индивидуальная проверка; работа с «слабым звеном» у каждого ученика"
      },
      {
        number: 29,
        title: "Контроль чтения",
        topic: "Проверка техники чтения",
        aspects: "Проверочная работа: называние букв, чтение слогов, чтение 3–5 простых слов; наблюдение за направлением письма; фиксация индивидуальных проблемных букв"
      },
      {
        number: 30,
        title: "Арабский мир",
        topic: "Страны и культура",
        aspects: "Карта арабских стран; основные элементы культуры (без религиозных акцентов: язык, еда, музыка, костюм); работа с картинками; лексика-минимум названий 2–3 стран/городов"
      },
      {
        number: 31,
        title: "Праздники и песни",
        topic: "Лёгкие песенки и рифмовки",
        aspects: "Простые детские песенки/рифмовки на алфавит, числа, приветствия; тренировка произношения через ритм; подготовка мини-выступления класса"
      },
      {
        number: 32,
        title: "Итоговое повторение алфавита",
        topic: "Алфавит и написание",
        aspects: "Письменное и устное повторение алфавита; игра «цепочка букв»; работа в группах над плакатом «Мой арабский алфавит»; мини-контроль написания отдельных букв"
      },
      {
        number: 33,
        title: "Итоговое повторение лексики",
        topic: "Слова за год",
        aspects: "Тематические станции (цвета, семья, числа, класс, животные); игры-ротации по станциям; устные мини-диалоги с использованием изученной лексики"
      },
      {
        number: 34,
        title: "Игровой зачёт",
        topic: "Подведение итогов года",
        aspects: "Игровой квест с заданиями на чтение, письмо букв и слов, узнавание лексики; индивидуальное поощрение за успехи; обсуждение, что понравилось и чего ждут в следующем году"
      }
    ]
  },
  {
    grade: 2,
    title: "Арабский язык для 2 класса",
    description: "Курс арабского языка для второклассников с повторением алфавита и базовой лексики, развитием навыков чтения и письма, введением грамматических элементов.",
    lessons: [
      {
        number: 1,
        title: "Старт года и повторение",
        topic: "Повторение алфавита и базовой лексики 1 класса",
        aspects: "Алфавит в хоровом и индивидуальном проговаривании; чтение отдельных букв и простых слогов; проверка техники письма; актуализация лексики «приветствие, числа 1–10, семья, цвета»"
      },
      {
        number: 2,
        title: "Буквы и их формы",
        topic: "Повторение форм букв в слове",
        aspects: "Начальная, средняя, конечная формы на примерах знакомых слов; тренировка соединённого письма; работа над аккуратностью и направлением письма; мини-диктант из буквенных «цепочек»"
      },
      {
        number: 3,
        title: "Чтение слогов и слов",
        topic: "Переход к беглому чтению",
        aspects: "Чтение слогов с разными краткими гласными; чтение знакомых слов без по-буквенного проговаривания; упражнения «кто быстрее прочитает слово»; индивидуальная работа с «слабыми» буквами"
      },
      {
        number: 4,
        title: "Знаки чтения",
        topic: "Шадда, сукун (на уровне узнавания)",
        aspects: "Ввод знаков تشديد (ّ) и سكون (ْ) через простые примеры; чтение слов с удвоенной согласной (مُدَرِّس) и согласным без гласной; объяснение «без терминов», через слух и сравнение; практические упражнения"
      },
      {
        number: 5,
        title: "Короткие предложения",
        topic: "Структура простого предложения",
        aspects: "Понятие «слово–предложение»; чтение коротких предложений типа: هذا بيت، هذه بنت؛ разделение на слова; тренировка интонации при чтении"
      },
      {
        number: 6,
        title: "Приветствия 2.0",
        topic: "Расширенный набор приветствий",
        aspects: "Повтор: السلام عليكم, صباح الخير; добавление: مساء الخير، إلى اللقاء؛ диалоги в парах «встреча/прощание»; отработка произношения и вежливых формул"
      },
      {
        number: 7,
        title: "Я и мои друзья",
        topic: "Местоимения и представление",
        aspects: "Местоимения: أنا، أنتَ، أنتِ، هو، هي (на уровне лексики); повтор фраз: ما اسمك؟ اسمي …؛ диалоги «я – ты – он – она»; игра «передай мяч и назови друга»"
      },
      {
        number: 8,
        title: "Моя семья 2.0",
        topic: "Расширение темы «семья»",
        aspects: "Повтор: أم، أب، أخ، أخت؛ добавление: عم، خال، عمة، خالة и др.; простые предложения: هذه أمي، هذا أخي؛ мини-проекты «моя семья» (картинка + подписи)"
      },
      {
        number: 9,
        title: "Мой дом",
        topic: "Комнаты и предметы дома",
        aspects: "Лексика: بيت، غرفة، مطبخ، باب، نافذة، سرير، كرسي и др.; упражнения «что где стоит»; простые предложения: في الغرفة سرير؛ чтение подписей к картинкам"
      },
      {
        number: 10,
        title: "Игрушки",
        topic: "Игрушки и любимые вещи",
        aspects: "Лексика: لعبة، كرة، سيارة، دمية и др.; конструкции типа: هذه لعبتي؛ диалоги «что у тебя есть» на уровне: عندي كرة؛ игра «магазин игрушек»"
      },
      {
        number: 11,
        title: "Школа и класс 2.0",
        topic: "Атрибуты школьной жизни",
        aspects: "Повтор: كتاب، قلم، كرسي، طاولة؛ добавление: حقيبة، دفتر، معلم، طالب؛ предложения: هذا كتابي؛ классификация «что личное, что общее»; игра-квест по классу"
      },
      {
        number: 12,
        title: "Цвета и формы",
        topic: "Цвета + простые формы",
        aspects: "Повтор основных цветов и добавление 1–2 новых; лексика «круг, квадрат» (دائرة، مربع) на уровне слов; задания на сопоставление цвета/формы/предмета; чтение надписей в рабочем листе"
      },
      {
        number: 13,
        title: "Числа 1–10 повторение",
        topic: "Укрепление счёта до 10",
        aspects: "Беглый счёт ١–١٠; задачи-картинки «сколько яблок?»; устные мини-диалоги с числами; письменное прописывание цифр и слов"
      },
      {
        number: 14,
        title: "Числа 11–20",
        topic: "Расширение числового ряда",
        aspects: "Введение чисел ١١–٢٠ (на уровне слуха и чтения, письмо выборочно); упражнения «посчитай дальше»; игры «числовой поезд»; простые примеры: في الصف خمسة عشر طالباً"
      },
      {
        number: 15,
        title: "Дни недели",
        topic: "Названия дней недели",
        aspects: "Лексика: يوم، أسبوع, أسماء الأيام (السبت… الجمعة); упражнения «что за чем идёт»; песенка/рифмовка по дням недели; мини-диалоги «какой сегодня день?»"
      },
      {
        number: 16,
        title: "Времена года и погода",
        topic: "Базовая метео-лексика",
        aspects: "Лексика: صيف، شتاء، ربيع، خريف + حار، بارد، مطر، شمس؛ предложения: الجو حار؛ раскраска погоды и времени года; игра «покажи картинку по фразе»"
      },
      {
        number: 17,
        title: "Одежда",
        topic: "Предметы одежды",
        aspects: "Лексика: قميص، بنطال، فستان، حذاء، قبعة и др.; упражнения «во что одет персонаж»; фразы: هذا قميصي؛ чтение коротких описаний картинок"
      },
      {
        number: 18,
        title: "Еда и напитки",
        topic: "Продукты и предпочтения",
        aspects: "Лексика: خبز، حليب، ماء، تفاح، موز и др.; конструкции: أحب …؛ неформальное знакомство с لا أحب …; игры «люблю / не люблю» с карточками"
      },
      {
        number: 19,
        title: "Части тела",
        topic: "Тело и здоровье (лексика)",
        aspects: "Лексика: رأس، عين، أنف، فم، يد، قدم и др.; песенка/игра «покажи часть тела»; предложения: هذه يدي؛ простые инструкции учителя на арабском «подними руку»"
      },
      {
        number: 20,
        title: "Глаголы действий 1",
        topic: "Простые действия без грамматики",
        aspects: "Лексика-глаголы: يكتب، يقرأ، يلعب، يأكل، يشرب (как словарная форма); связывание с картинками; чтение коротких предложений: هو يلعب؛ она – هي تلعب (узнавание)"
      },
      {
        number: 21,
        title: "Глаголы действий 2",
        topic: "Расширение набора действий",
        aspects: "Лексика: يذهب، يأتي، يجلس، يقف، ينام и др.; понимание по картинкам; чтение мини-историй из 3–4 предложений «день ребёнка»"
      },
      {
        number: 22,
        title: "Простое отрицание",
        topic: "لا в предложениях",
        aspects: "Введение частицы لا через примеры: أنا لا ألعب، هو لا ينام؛ сопоставление «делает / не делает»; игры «скажи наоборот»; минимальное письмо коротких предложений с لا"
      },
      {
        number: 23,
        title: "Конструкция «у меня есть»",
        topic: "عندي / ليس عندي",
        aspects: "Модели: عندي كتاب؛ ليس عندي قلم (на уровне образца); парные диалоги «что у тебя есть в сумке»; упражнения «верно/неверно» по картинкам"
      },
      {
        number: 24,
        title: "Вопросы",
        topic: "Простые вопросительные слова",
        aspects: "Ввод ما؟ من؟ أين؟ через картинки и готовые фразы: ما هذا؟ من هذا؟ أين الكتاب؟; отработка на диалогах «учитель–класс», затем в парах"
      },
      {
        number: 25,
        title: "Чтение текстов 1",
        topic: "Первый связный текст (4–5 предложений)",
        aspects: "Небольшой адаптированный текст на знакомую тему (семья, школа); чтение хором и индивидуально; ответы на простые вопросы по тексту («кто? что?»); нахождение слов в тексте"
      },
      {
        number: 26,
        title: "Чтение текстов 2",
        topic: "Текст о дне ребёнка",
        aspects: "Текст «мой день» с действиями и временем дня; чтение по ролям; упрощённые вопросы: متى…؟ ماذا يفعل…؟ (как устойчивые шаблоны); работа с картинками-иллюстрациями"
      },
      {
        number: 27,
        title: "Письмо слов и предложений",
        topic: "Развитие письменной речи",
        aspects: "Аккуратное письмо знакомых слов и коротких предложений; диктанты с опорой на картинки; работа над соединением букв внутри слова; мини-проект «составь и запиши предложение о себе»"
      },
      {
        number: 28,
        title: "Игры с лексикой",
        topic: "Повтор тем года в игровой форме",
        aspects: "Тематические игры по лексике: дом, школа, семья, еда, одежда, погода; «бинго» со словами, лото, домино; работа в группах по станциям"
      },
      {
        number: 29,
        title: "Контроль чтения 2 класса",
        topic: "Промежуточная проверка",
        aspects: "Индивидуальное чтение слов, предложений и короткого текста; проверка понимания на уровне простых вопросов; фиксация, какие буквы/слова вызывают трудности"
      },
      {
        number: 30,
        title: "Арабский мир 2.0",
        topic: "Культура, города, символы",
        aspects: "Расширение знаний о странах и городах: имена нескольких городов/стран; знакомство с флагами, традиционной одеждой, едой (на уровне картинок и слов); мини-презентации от учителя"
      },
      {
        number: 31,
        title: "Песни, стихи, скороговорки",
        topic: "Рифмы и ритм для закрепления",
        aspects: "Детские песенки/рифмовки по числам, дням недели, действиям; тренировка произношения сложных звуков; групповые выступления, чтение «по цепочке»"
      },
      {
        number: 32,
        title: "Итог: алфавит и чтение",
        topic: "Обобщение навыка чтения",
        aspects: "Повтор алфавита, основных знаков (фатха, касра, дамма, шадда, сукун – на уровне узнавания); чтение слов и предложений с разной структурой; задания на выбор правильного чтения"
      },
      {
        number: 33,
        title: "Итог: лексика и речь",
        topic: "Обобщение словаря и устной речи",
        aspects: "Тематический «марафон»: семья, дом, школа, числа, еда, одежда, погода, части тела; устные мини-монологи «расскажи о себе/семье/дне» с опорой на картинки"
      },
      {
        number: 34,
        title: "Игровой итоговый зачёт",
        topic: "Подведение итогов 2 класса",
        aspects: "Квест-зачёт с заданиями на чтение, письмо, понимание речи и диалоги; оценка прогресса по сравнению с началом года; индивидуальные и групповые поощрения; обсуждение ожиданий от 3 класса"
      }
    ]
  },
  {
    grade: 3,
    title: "Арабский язык для 3 класса",
    description: "Курс арабского языка для третьеклассников с развитием грамматических навыков, расширением словаря и навыков чтения и письма.",
    lessons: [
      {
        number: 1,
        title: "Старт года: диагностика",
        topic: "Повтор материала 1–2 класса",
        aspects: "Проверка чтения слов и коротких текстов; повтор алфавита и основных знаков; актуализация лексики (семья, школа, дом, числа, погода); выявление пробелов у детей"
      },
      {
        number: 2,
        title: "Предложение: кто и что делает",
        topic: "Структура простого предложения",
        aspects: "Модель: مبتدأ + خبر без терминов (например: الولد يكتب؛ البنت تقرأ); разделение предложения на «кто?» и «что делает?»; чтение и составление собственных коротких предложений"
      },
      {
        number: 3,
        title: "Личные местоимения",
        topic: "Местоимения я/ты/он/она/мы/вы/они",
        aspects: "Повтор: أنا، أنتَ، أنتِ، هو، هي; добавление: نحن، أنتم، هم؛ упражнения «кто это?»; подстановка местоимений в готовые предложения; игры «передай мяч и назови местоимение»"
      },
      {
        number: 4,
        title: "Настоящее время 1",
        topic: "Глаголы с أنا / هو / هي",
        aspects: "Модели: أنا أكتب، هو يكتب، هي تكتب (без биньяна и терминов); сопоставление местоимения и формы глагола; чтение простых предложений, подстановка по картинке"
      },
      {
        number: 5,
        title: "Настоящее время 2",
        topic: "Глаголы с نحن / هم",
        aspects: "Модели: نحن نلعب، هم يدرسون; упражнения «преврати я-форму в мы/они»; игра «команда делает действие» по картинкам; чтение мини-диалогов"
      },
      {
        number: 6,
        title: "Согласование по роду",
        topic: "Маскулин/феминин в глаголах",
        aspects: "Сопоставление: هو يكتب / هي تكتب; другие пары: هو يلعب / هي تلعب; упражнения «кто на картинке? какую форму выберем?»; подчеркивание окончания/начала глагола при чтении"
      },
      {
        number: 7,
        title: "Согласование по роду в существительных",
        topic: "Мужские/женские существительные",
        aspects: "Повтор суффикса ـة как маркера женского рода (на уровне наблюдения); примеры: معلم / معلمة؛ طالب / طالبة; сопоставление с картинками; составление предложений «кто это?»"
      },
      {
        number: 8,
        title: "Предлоги места",
        topic: "В, на, под, перед, за",
        aspects: "Лексика: في، على، تحت، أمام، خلف؛ модели предложений: الكتاب على الطاولة؛ игра «расставь предметы и опиши»; работа с картинками «выбери правильное предложение»"
      },
      {
        number: 9,
        title: "Предлоги направления",
        topic: "К, из, с",
        aspects: "Лексика: إلى، من، مع (на уровне базовых значений); примеры: أذهب إلى المدرسة، آتي من البيت، أذهب مع أبي؛ чтение и подстановка предлогов в пропуски"
      },
      {
        number: 10,
        title: "Множественное число 1",
        topic: "Простое множественное (человек, ученик)",
        aspects: "Введение جمع مذكر سالم / مؤنث سالم на уровне шаблонов без терминов: معلم – معلمون، معلمة – معلمات؛ чтение форм; сопоставление «один–много» по картинкам; базовые предложения: في الصف معلمون"
      },
      {
        number: 11,
        title: "Множественное число 2",
        topic: "Нерегулярное множественное (несколько слов)",
        aspects: "Ознакомление с примерами: ولد – أولاد؛ بيت – بيوت и др.; акцент на узнавание, а не правило; упражнения «соедини единственное и множественное»; чтение коротких предложений"
      },
      {
        number: 12,
        title: "Описание человека",
        topic: "Внешность и характер (лексика)",
        aspects: "Лексика: طويل، قصير، كبير، صغير، جميل، ذكي и др.; модели: هو طويل، هي ذكية؛ сопоставление по картинкам; упражнения «опиши друга» (устно с опорой)"
      },
      {
        number: 13,
        title: "Описание предметов",
        topic: "Размер, цвет, качество",
        aspects: "Комбинации: كبير/صغير + цвета (أحمر، أزرق…); модели: بيت كبير، كتاب صغير، كرسي أخضر؛ порядок слов «существительное + прилагательное» через многократные примеры; подчеркивание порядка в предложениях"
      },
      {
        number: 14,
        title: "Расширение словаря: дом",
        topic: "Дом, комнаты, предметы",
        aspects: "Углубление темы «дом»: غرفة نوم، غرفة جلوس، حمام، مطبخ؛ чтение короткого текста «мой дом»; задания «найди в тексте слово», ответ на простые вопросы по тексту"
      },
      {
        number: 15,
        title: "Расширение словаря: школа",
        topic: "Школа, предметы, люди",
        aspects: "Лексика: مدرسة، مدير، صديق، درس، كتاب عربي؛ предложения: أحب درس العربية؛ чтение адаптированного мини-текста о школе; диалог «в школе» по образцу"
      },
      {
        number: 16,
        title: "Порядок слов в предложении",
        topic: "Фиксация базового порядка",
        aspects: "Модели: هذا بيت جميل؛ الطالب يقرأ كتاباً؛ упражнения «собери предложение из карточек»; перестановка слов и поиск «правильного» варианта; минимальное письмо 2–3 предложений"
      },
      {
        number: 17,
        title: "Прошедшее время 1",
        topic: "Я делал / он делал",
        aspects: "Модели: أنا كتبت، هو كتب (без таблиц спряжения, в виде целого шаблона); сопоставление «сейчас/вчера»: الآن أكتب – أمس كتبت؛ работа с линией времени и картинками"
      },
      {
        number: 18,
        title: "Прошедшее время 2",
        topic: "Она делала / мы делали",
        aspects: "Модели: هي كتبت، نحن كتبنا; упражнения «что ты делал вчера?» на уровне шаблонов с подсказкой; чтение коротких предложений в прошедшем времени"
      },
      {
        number: 19,
        title: "Сравнение настоящего и прошедшего",
        topic: "Вчера – сегодня",
        aspects: "Таблица «вчера / сегодня» с действиями: يلعب / لعب، يذهب / ذهب; упражнения-игры «скажи, что он делал вчера и что делает сейчас»; мини-комиксы «мой день вчера и сегодня»"
      },
      {
        number: 20,
        title: "Чтение текстов 3.1",
        topic: "Текст о семье (с грамматикой)",
        aspects: "Адаптированный текст 6–8 предложений: состав семьи, возраст, кто что любит делать; работа по этапам: чтение, объяснение лексики, ответы на вопросы, нахождение грамматических форм (местоимения, глаголы)"
      },
      {
        number: 21,
        title: "Чтение текстов 3.2",
        topic: "Текст о дне в школе",
        aspects: "Текст 6–8 предложений «мой день в школе» (настоящее время); чтение по ролям; задания на понимание: кто герой, что делает, когда; упражнения «замени героя в тексте» (он/она/они)"
      },
      {
        number: 22,
        title: "Чтение текстов 3.3",
        topic: "Текст о выходном дне",
        aspects: "Текст с сочетанием настоящего и прошедшего времени («по воскресеньям мы ходим… вчера мы ходили…»); работа с временными маркерами (اليوم، أمس، غداً – на узнавание); пересказ с опорой на картинки"
      },
      {
        number: 23,
        title: "Письмо: предложения и мини-текст 1",
        topic: "Переход к письменному высказыванию",
        aspects: "Образец мини-текста из 3–4 предложений о себе; коллективное составление текста на доске; запись индивидуального варианта «расскажи о себе» по образцу; работа над аккуратностью письма и связностью"
      },
      {
        number: 24,
        title: "Письмо: мини-текст 2",
        topic: "Текст о семье или друге",
        aspects: "Шаблоны: عندي…، أحب…، هو/هي…؛ план из 3–4 пунктов; составление и запись текста «моя семья» или «мой друг»; взаимная проверка по чек-листу (есть ли начало, 2–3 факта, заключение)"
      },
      {
        number: 25,
        title: "Тематическая лексика: город",
        topic: "Город, места, транспорт",
        aspects: "Лексика: مدينة، شارع، سوق، حديقة، سيارة، حافلة؛ предложения: أذهب إلى الحديقة بالحافلة؛ чтение небольшого текста «в городе»; задания «куда он идёт?»"
      },
      {
        number: 26,
        title: "Тематическая лексика: природа",
        topic: "Природа, времена года, погода",
        aspects: "Расширение темы: جبل، بحر، نهر، شجرة، زهرة; повтор слов по погоде; чтение описаний картинок «на море», «в горах»; упражнения на подбор подходящих слов к картинкам"
      },
      {
        number: 27,
        title: "Вопросительные конструкции 2",
        topic: "Кому? Когда? Сколько?",
        aspects: "Вопросительные слова: متى؟ كم؟ لمن؟ (на простых моделях); примеры: متى تذهب إلى المدرسة؟ كم كتاباً عندك؟ لمن هذا الكتاب؟; диалоги по карточкам «вопрос–ответ»"
      },
      {
        number: 28,
        title: "Игры с грамматикой",
        topic: "Закрепление местоимений, времени и числа",
        aspects: "Игровые задания на согласование глагола с местоимением; сортировка предложений по времени (прошедшее / настоящее); «грамматическое лото» (один – много, он – они и т.п.)"
      },
      {
        number: 29,
        title: "Контроль чтения и понимания",
        topic: "Промежуточная проверка",
        aspects: "Индивидуальное чтение текста 6–8 предложений; ответы на вопросы по тексту (устно/письменно с опорой); оценка беглости, правильности произношения и понимания"
      },
      {
        number: 30,
        title: "Проект: «Мой день»",
        topic: "Устный и письменный проект",
        aspects: "План: утром – днём – вечером; подготовка текста 5–6 предложений в настоящем времени (+1–2 в прошедшем); устное предъявление «мой день» с опорой на рисунок; письменная версия в тетрадь"
      },
      {
        number: 31,
        title: "Проект: «Моя семья / мой друг»",
        topic: "Описание человека и отношений",
        aspects: "Повтор лексики по внешности, характеру и семейным связям; составление текста 5–6 предложений; оформление мини-постера (картинка + подписи); устное представление"
      },
      {
        number: 32,
        title: "Арабский мир 3.0",
        topic: "Страны, города, культура",
        aspects: "Расширение знаний о нескольких арабских странах/городах (на уровне названий и простейших фактов: язык, столица, типичная еда); чтение мини-текста о стране; задание «сопоставь картинку и текст»"
      },
      {
        number: 33,
        title: "Итог: грамматика и лексика",
        topic: "Обобщение за год",
        aspects: "Повтор: местоимения, настоящее/прошедшее время в базовых моделях, простое множественное число, предлоги, базовые структуры предложений; тематический «марафон» по лексике года; устные и письменные задания"
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Комплексная проверка навыков",
        aspects: "Игровой зачёт с заданиями: чтение текста, ответы на вопросы, составление 2 мини-текстов (о себе и о семье/дне), задания на грамматические формы в контексте; фиксация достижений и подготовка к переходу в 4 класс"
      }
    ]
  },
  {
    grade: 4,
    title: "Арабский язык для 4 класса",
    description: "Курс арабского языка для четвероклассников с развитием сложных грамматических конструкций, расширением словаря и навыков письменной речи.",
    lessons: [
      {
        number: 1,
        title: "Старт года: срез знаний",
        topic: "Диагностика по материалу 1–3 классов",
        aspects: "Проверка чтения текста 8–10 предложений; повтор местоимений, глаголов в наст./прош. времени, предлогов места; актуализация лексики (семья, день, школа, город); фиксация пробелов по группе"
      },
      {
        number: 2,
        title: "Повтор базовой грамматики",
        topic: "Предложение, местоимения, времена",
        aspects: "Структура предложения: кто + что делает; быстрое повторение местоимений (أنا، نحن، هو، هي، هم، أنتم); распознавание настоящего и прошедшего времени глаголов; упражнения «исправь ошибку в предложении»"
      },
      {
        number: 3,
        title: "Будущее время 1",
        topic: "Обозначение будущего: سـ، سوف",
        aspects: "Ввод моделей: سأذهب، سوف أكتب؛ сопоставление «вчера–сегодня–завтра»; упражнения на подстановку глагола в будущее время по картинкам; чтение предложений с будущим временем"
      },
      {
        number: 4,
        title: "Будущее время 2",
        topic: "Планирование действий",
        aspects: "Конструкции: غداً سأذهب إلى…، في الأسبوع القادم…؛ мини-тексты «мой завтрашний день»; упражнения «преврати настоящее в будущее»; устные высказывания по плану"
      },
      {
        number: 5,
        title: "Притяжательные конструкции 1",
        topic: "«Мой дом, наша школа»",
        aspects: "Ввод притяжательных местоимений на уровне моделей: بيتي، كتابي، بيتنا، مدرستنا; сопоставление «дом – мой дом»; упражнения «чей это…?»; построение предложений: هذا كتابي"
      },
      {
        number: 6,
        title: "Притяжательные конструкции 2",
        topic: "Расширение: твой, его, её",
        aspects: "Модели: كتابك، كتابه، كتابها؛ лексика «мои/твой друзья, родители»; диалоги «чья это тетрадь?»; чтение небольшого текста с притяжательными формами и поиск этих форм в тексте"
      },
      {
        number: 7,
        title: "Объектные местоимения",
        topic: "«Я вижу его / её» (на уровне шаблонов)",
        aspects: "Ознакомление с مفعول به – местоимениями: أراه، أسمعك (без терминов); упражнения «кого/что он видит?» по картинкам; чтение и понимание предложений с объектными местоимениями"
      },
      {
        number: 8,
        title: "Расширенная система вопросов",
        topic: "Почему? Как?",
        aspects: "Вопросительные слова: لماذا؟ كيف؟; сопоставление с уже известными (ما، من، أين، متى، كم); примеры: لماذا تذهب إلى المدرسة؟ كيف تذهب؟; диалоги «вопрос–ответ» по карточкам"
      },
      {
        number: 9,
        title: "Усиление описания",
        topic: "Сложное описание человека",
        aspects: "Комбинация внешности, характера, действий: هو طويل وذكي ويحب الرياضة؛ расширение прилагательных: نشيط، هادئ، قوي؛ устные и письменные описания одноклассника по плану"
      },
      {
        number: 10,
        title: "Описание места",
        topic: "Дом, школа, район",
        aspects: "Структура мини-описания: где находится, что внутри, что вокруг; модели: في بيتي غرف كثيرة؛ في حينا حديقة جميلة؛ работа с опорными схемами и картами; письмо короткого описания"
      },
      {
        number: 11,
        title: "Наречия места и времени",
        topic: "Там, здесь, всегда, иногда",
        aspects: "Лексика: هنا، هناك، دائماً، أحياناً، اليوم، غداً، أمس; включение наречий в предложения: أذهب إلى المدرسة دائماً؛ упражнения «добавь наречие»; различение значения в контексте"
      },
      {
        number: 12,
        title: "Связка «есть/нет»",
        topic: "Конструкции с есть/нет в настоящем",
        aspects: "Модели: في البيت غرفة كبيرة؛ لا يوجد في الصف…؛ сопоставление «есть/нет» по картинкам; письменные упражнения «опиши, что есть/чего нет» в комнате/школе"
      },
      {
        number: 13,
        title: "Сложное предложение 1",
        topic: "Союз «и» (و)",
        aspects: "Объединение предложений: أحب العربية وأحب الرياضة؛ домино-предложения «соедини части через و»; чтение текста с частым использованием و и разбор структуры"
      },
      {
        number: 14,
        title: "Сложное предложение 2",
        topic: "Союзы «но» (لكن) и «потому что» (لأن)",
        aspects: "Модели: أحب اللعب لكن يجب أن أدرس؛ أذهب إلى المدرسة لأن…; упражнения на контраст и причину; перестройка простых предложений в сложные с لكن и لأن"
      },
      {
        number: 15,
        title: "Чтение 4.1",
        topic: "Текст «Мой школьный день»",
        aspects: "Текст 10–12 предложений, наст./будущее время, связки و، لكن؛ отработка стратегий чтения (поиск ключевых слов, подчеркивание местоимений и глаголов); ответы на вопросы, краткий пересказ"
      },
      {
        number: 16,
        title: "Чтение 4.2",
        topic: "Текст «Выходной с семьёй»",
        aspects: "Текст с прошедшим и будущим временем, притяжательными конструкциями; работа над пониманием: кто, когда, где, что делали; заполнение таблицы «кто – что делал»; мини-пересказ по опорным картинкам"
      },
      {
        number: 17,
        title: "Чтение 4.3",
        topic: "Текст «В городе»",
        aspects: "Текст про город, транспорт, места; работа с топонимами и предлогами направления; задания: найти в тексте предлоги, глаголы, прилагательные; групповая работа по вопросам к тексту"
      },
      {
        number: 18,
        title: "Письмо: структура текста",
        topic: "Вступление, основная часть, заключение",
        aspects: "Объяснение трёхчастной структуры на простом уровне; разбор образца (текст о себе/семье/школе); маркировка частей разными цветами; составление плана для будущих текстов"
      },
      {
        number: 19,
        title: "Письмо: текст о себе",
        topic: "Личный профиль",
        aspects: "Использование структуры: кто я, где живу/учусь, что люблю; включение настоящего, прошедшего и будущего времени (1–2 предложения каждого типа); письменный текст 6–8 предложений"
      },
      {
        number: 20,
        title: "Письмо: текст о семье",
        topic: "Расширенный текст",
        aspects: "План: состав семьи, возраст, занятия, совместное время; активное использование притяжательных форм (أبي، أمي، أخي…); работа над связками (و، لكن) и наречиями; контроль орфографии и соединения букв"
      },
      {
        number: 21,
        title: "Тематический блок «Здоровье»",
        topic: "Тело, самочувствие, режим дня",
        aspects: "Лексика: مريض، متعب، صحّة، طبيب، دواء؛ конструкции: أشعر بتعب؛ أذهب إلى الطبيب؛ мини-диалоги в поликлинике; чтение короткого текста «когда я болел»"
      },
      {
        number: 22,
        title: "Тематический блок «Спорт и хобби»",
        topic: "Занятия в свободное время",
        aspects: "Лексика: رياضة، كرة القدم، سباحة، رسم، قراءة؛ конструкции: أحب أن ألعب كرة القدم؛ لا أحب…; письменно–устные мини-тексты о хобби с использованием будущего времени"
      },
      {
        number: 23,
        title: "Тематический блок «Путешествия»",
        topic: "Поездки и транспорт",
        aspects: "Лексика: رحلة، قطار، طائرة، بحر، جبل؛ конструкции: في العطلة سأذهب إلى…؛ чтение текста о поездке; задания «составь маршрут» и опиши его предложениями"
      },
      {
        number: 24,
        title: "Повтор грамматики",
        topic: "Местоимения, времена, притяжательные формы",
        aspects: "Сводная таблица моделей: я–мы–он–она–они в трёх временах (на уровне готовых шаблонов), притяжательные формы, объектные местоимения; упражнение «исправь/дополни предложения»; грамматический мини-зачёт"
      },
      {
        number: 25,
        title: "Диалогические ситуации 1",
        topic: "В магазине, в кафе",
        aspects: "Типовые реплики: أريد…، كم هذا؟ شكراً؛ моделирование диалогов по ролям; работа с простыми чеками/меню (адаптированными); запись коротких диалогов в тетрадь"
      },
      {
        number: 26,
        title: "Диалогические ситуации 2",
        topic: "В школе, у врача, в гостях",
        aspects: "Наборы готовых реплик для трёх ситуаций; распределение ролей в группе; разыгрывание сценок; обсуждение, какие фразы обязательны (приветствие, благодарность, прощание)"
      },
      {
        number: 27,
        title: "Проект 1: «Мой город / мой район»",
        topic: "Описание места проживания",
        aspects: "Подготовка проекта: план текста + рисунок/схема района; включение лексики города, транспорта, времени (когда и куда ходит ученик); письменный текст 8–10 предложений, устная презентация"
      },
      {
        number: 28,
        title: "Проект 2: «Моя мечта / моё будущее»",
        topic: "Будущие планы",
        aspects: "Акцент на будущем времени: في المستقبل سأصبح…؛ лексика профессий; работа с шаблонами: أحب…، أريد أن…؛ письменный и устный мини-проект о будущей профессии/мечте"
      },
      {
        number: 29,
        title: "Контроль чтения 4 класса",
        topic: "Проверка техники и понимания",
        aspects: "Индивидуальное чтение текста 12–14 предложений; задания на понимание (выбор ответа, краткий письменный ответ); выделение в тексте форм прошедшего/настоящего/будущего времени и притяжательных конструкций"
      },
      {
        number: 30,
        title: "Контроль письма 4 класса",
        topic: "Проверка письменной речи",
        aspects: "Письменная работа: текст 8–10 предложений на одну из тем (о себе, семье, школе, городе); проверка структуры (начало–середина–конец), грамматических моделей и орфографии; обратная связь по каждому ученику"
      },
      {
        number: 31,
        title: "Арабский мир 4.0",
        topic: "Культура, традиции, праздники",
        aspects: "Расширенные сведения о 2–3 арабских странах: столица, язык, некоторые традиции и праздники (на нейтральном культурном уровне); чтение информативного текста; задания «заполни таблицу по тексту»"
      },
      {
        number: 32,
        title: "Интегрированное повторение",
        topic: "Лексика + грамматика в текстах",
        aspects: "Работа с несколькими короткими текстами разных типов (описание, рассказ, сообщение); комплексные упражнения: найди нужную форму, перепиши в другое время, замени героя; групповая работа"
      },
      {
        number: 33,
        title: "Итоговая интеграция навыков",
        topic: "Годовой обзор",
        aspects: "Повтор ключевых грамматических моделей, лексики основных тем (семья, школа, свободное время, город, здоровье, путешествия); комбинированные задания на чтение, письмо, говорение и понимание устной речи"
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Подведение итогов и мотивация",
        aspects: "Игровой формат: станции «чтение», «грамматика», «лексика», «диалог», «письмо»; мини-проекты и сценки; индивидуальные и групповые результаты; фиксация достижений и ожиданий от 5 класса"
      }
    ]
  },
  {
    grade: 5,
    title: "Арабский язык для 5 класса",
    description: "Курс арабского языка для пятиклассников с систематизацией грамматики, развитием навыков чтения и письма, введением новых грамматических тем.",
    lessons: [
      {
        number: 1,
        title: "Старт года: входная диагностика",
        topic: "Проверка уровня после 4 класса",
        aspects: "Чтение текста 15–18 предложений; краткий письменный ответ на вопросы; повтор местоимений, 3 времён (наст./прош./буд.), притяжательных форм; определение сильных и слабых сторон класса."
      },
      {
        number: 2,
        title: "Повтор ключевой грамматики",
        topic: "Базовые модели и структуры",
        aspects: "Сводное повторение: местоимения, согласование глагола, простое и сложное предложение (و، لكن، لأن)، притяжательные конструкции; упражнения «исправь ошибку», «дополни предложение»; устный опрос."
      },
      {
        number: 3,
        title: "Именное предложение 1",
        topic: "Предложение без глагола (связка)",
        aspects: "Введение/систематизация: هذا بيت كبير؛ الجو جميل؛ различие между الجملة الاسمية и الجملة الفعلية (без терминов, на уровне «есть глагол/нет глагола»); трансформация глагольных предложений в именные и наоборот."
      },
      {
        number: 4,
        title: "Именное предложение 2",
        topic: "Отрицание и простые вопросы",
        aspects: "Модели: الجو ليس بارداً؛ أنا لست متعباً; вопросы: هل الجو جميل؟; упражнения на утверждение/отрицание/вопрос; чтение и выделение именных предложений в тексте."
      },
      {
        number: 5,
        title: "Расширенная система прилагательных",
        topic: "Согласование по роду и числу",
        aspects: "Согласование прилагательного с существительным (род, число) на практике: طالب مجتهد / طالبة مجتهدة / طلاب مجتهدون؛ работа с таблицами; упражнения «соедини существительное и прилагательное», трансформация ед.ч. → мн.ч."
      },
      {
        number: 6,
        title: "Наречия частоты и образа действия",
        topic: "Всегда, часто, иногда, хорошо и т.д.",
        aspects: "Лексика: دائماً، غالباً، أحياناً، قليلاً؛ جيداً، بسرعة، ببطء; включение в предложения: أدرس دائماً؛ ألعب أحياناً؛ упражнения «добавь наречие», работа с текстом «найди наречия»."
      },
      {
        number: 7,
        title: "Повтор и углубление прошедшего времени",
        topic: "Спряжение в прошедшем времени (основные лица)",
        aspects: "Систематизация форм: я, мы, он, она, они в прошедшем (كتبت، كتبنا، كتب، كتبت، كتبوا); тренировочные таблицы по шаблону, но без перегруза терминами; упражнения «расскажи, что ты делал вчера», небольшое письмо в прошедшем времени."
      },
      {
        number: 8,
        title: "Повтор и углубление будущего времени",
        topic: "Спряжение в будущем, планы и намерения",
        aspects: "Работа с سـ и سوف в сочетании с разными лицами; конструкции: سأدرس، سندرس، سيذهبون؛ упражнения «преврати прошедшее/настоящее в будущее»; мини-проекты «мой план на выходные»."
      },
      {
        number: 9,
        title: "Виды сложных предложений",
        topic: "Союзы: و، ثم، لكن، لأن، إذا",
        aspects: "Расширение: цепочки событий (و، ثم); причина–следствие (لأن); условие (إذا…); построение простых условных конструкций: إذا كان الجو جميلاً، أذهب إلى الحديقة؛ чтение текстов с такими структурами и их разбор."
      },
      {
        number: 10,
        title: "Чтение 5.1",
        topic: "Текст-описание «Мой дом / район»",
        aspects: "Текст 15–18 предложений с описанием места, именными и глагольными предложениями, примерами притяжательных форм; работа над словарём; задания: план текста, выделение ключевых предложений, пересказ."
      },
      {
        number: 11,
        title: "Чтение 5.2",
        topic: "Текст-рассказ «Один день из моей жизни»",
        aspects: "Текст с временной линией (утро–день–вечер), переключением времён (прошедшее/настоящее/будущее); задания «расставь события по порядку», ответы на вопросы, поиск форм глаголов по временам."
      },
      {
        number: 12,
        title: "Чтение 5.3",
        topic: "Текст-информация «Школа и предметы»",
        aspects: "Информационный текст о школе, предметах, расписании; работа с таблицей «день–урок–предмет»; упражнения на поиск конкретной информации в тексте; обсуждение «мой любимый предмет»."
      },
      {
        number: 13,
        title: "Письмо: план текста и абзацы",
        topic: "Структура и логика изложения",
        aspects: "Принцип деления текста на абзацы (одна тема – один абзац); работа с примером текста: выделение абзацев, заголовков; составление собственного плана к теме «Мой день / моя семья»; черновое написание."
      },
      {
        number: 14,
        title: "Письмо: связки и логические маркеры",
        topic: "Соединение предложений в абзаце",
        aspects: "Лексика-связки: أولاً، ثم، بعد ذلك، أخيراً؛ استخدام و، لكن، لأن, لذلك; упражнение «перепиши набор предложений, сделав из них связный текст»; самостоятельное написание абзаца с использованием связок."
      },
      {
        number: 15,
        title: "Тематический блок «Интернет и технологии»",
        topic: "Базовый IT-лексикон",
        aspects: "Лексика: حاسوب، هاتف، إنترنت، لعبة إلكترونية، موقع؛ обсуждение «как я использую технологии»; чтение короткого текста; написание 5–6 предложений о своём использовании технологий (с фокусом на связках и временах)."
      },
      {
        number: 16,
        title: "Тематический блок «Праздники и традиции»",
        topic: "Культурные праздники и семейные традиции",
        aspects: "Нейтральное описание праздников (семейные сборы, традиции, угощения); лексика: عيد، احتفال، هدية، عائلة؛ чтение текста; задания на понимание; мини-проект «наш семейный праздник» в письменном виде."
      },
      {
        number: 17,
        title: "Тематический блок «Природа и экология»",
        topic: "Природа, защита окружающей среды",
        aspects: "Лексика: بيئة، نظافة، تلوث، شجرة، نهر، حديقة؛ модели: يجب أن نحافظ على…؛ чтение текста о защите природы; задания «что мы можем делать?», письменное высказывание 6–8 предложений."
      },
      {
        number: 18,
        title: "Грамматика: степени сравнения",
        topic: "Сравнение прилагательных",
        aspects: "Ввод на уровне готовых моделей: كبير – أكبر، صغير – أصغر (без глубокого морфологического анализа); конструкции: هذا البيت أكبر من…؛ упражнения «сравни предметы на картинке», небольшие тексты с описанием."
      },
      {
        number: 19,
        title: "Грамматика: повтор множественного числа",
        topic: "Регулярное и нерегулярное множественное",
        aspects: "Систематизация изученных примеров; классификация слов по типу множественного (без сложной терминологии); упражнения «образуй множественное», «найди в тексте формы множественного числа», употребление в предложениях."
      },
      {
        number: 20,
        title: "Диалогические ситуации 5.1",
        topic: "В магазине / на рынке",
        aspects: "Расширенные реплики: تحب شيئاً آخر؟ هل يمكن أن…؟; работа с ценами (числа свыше 20 – обзорно); моделирование диалога покупатель–продавец; письменная фиксация вариантов диалога."
      },
      {
        number: 21,
        title: "Диалогические ситуации 5.2",
        topic: "В поездке / путешествии",
        aspects: "Ситуации «в гостинице», «на вокзале/в аэропорту» (очень базово): عندي حجز، أين…؟ متى…؟; чтение примерных диалогов; разыгрывание собственных сценок по шаблону."
      },
      {
        number: 22,
        title: "Проект: «Моя школа»",
        topic: "Описание школы как мини-проекта",
        aspects: "Подготовка проекта: план (место, здание, предметы, учителя, любимые уроки); сбор лексики; написание связного текста 10–12 предложений; устная презентация с опорой на текст и иллюстрации."
      },
      {
        number: 23,
        title: "Проект: «Мой любимый день в году»",
        topic: "Личное повествование",
        aspects: "Выбор дня (праздник, день рождения, особое событие); временная линия, использование прошедшего времени; включение эмоций (كان يوماً جميلاً جداً); письменный текст 10–12 предложений и устный пересказ."
      },
      {
        number: 24,
        title: "Чтение 5.4: рассказ",
        topic: "Связный рассказ с диалогами",
        aspects: "Текст с прямой речью (диалоги) и описанием; обучение различать реплики, авторские слова; упражнения «кто говорит?», «передай содержание своими словами»; попытка инсценировки фрагмента."
      },
      {
        number: 25,
        title: "Чтение 5.5: информационный текст",
        topic: "Небольшая статья/заметка",
        aspects: "Текст о городе, стране или явлении (например, о важности чтения книг); работа с подзаголовками, абзацами; вычленение основной мысли и аргументов; краткий письменный пересказ (3–4 предложения)."
      },
      {
        number: 26,
        title: "Контроль грамматики 5 класса",
        topic: "Проверка владения моделями",
        aspects: "Контрольные задания: различение именных и глагольных предложений, времена глагола, притяжательные формы, степени сравнения, союзы; часть устная (объяснить/прочитать), часть письменная."
      },
      {
        number: 27,
        title: "Контроль чтения 5 класса",
        topic: "Техника чтения и понимание",
        aspects: "Индивидуальное чтение текста 18–20 предложений; задания на понимание (вопросы, выбор правильного ответа, сопоставление предложений и картинок); оценка беглости чтения и точности произношения."
      },
      {
        number: 28,
        title: "Контроль письма 5 класса",
        topic: "Письменное высказывание",
        aspects: "Письменная работа: текст 10–12 предложений на одну из тем (школа, любимый день, природа, технологии); оценка структуры, связности, грамматики, словаря; формирование рекомендаций каждому ученику."
      },
      {
        number: 29,
        title: "Арабский мир 5.0",
        topic: "География, города, культура",
        aspects: "Обзор 2–3 арабских стран/городов: краткие факты (столица, расположение, язык, некоторые культурные особенности); работа с картой; чтение адаптированного текста и выполнение заданий к нему."
      },
      {
        number: 30,
        title: "Лексический обзор года",
        topic: "Обобщение тематической лексики",
        aspects: "Систематизация тем: семья, школа, город, природа, праздники, технологии, путешествия; игры «лексическое бинго», «домино», кластерные карты понятий; устные и письменные задания на активизацию словаря."
      },
      {
        number: 31,
        title: "Интегрированный урок «Чтение + грамматика»",
        topic: "Применение грамматики в тексте",
        aspects: "Работа с текстом, в котором максимально задействованы изученные грамматические модели; комплексные задания: найди форму, перепиши в другое время, соединяй предложения, замени слова на синонимы/местоимения."
      },
      {
        number: 32,
        title: "Интегрированный урок «Письмо + диалог»",
        topic: "Письменная и устная коммуникация",
        aspects: "Сценарий: подготовка диалогов и кратких текстов в единой ситуации (поездка, праздник, школа); написание диалога + монолога; разыгрывание сценок, взаимооценка по чек-листу."
      },
      {
        number: 33,
        title: "Итоговая интеграция",
        topic: "Обобщение всех видов речевой деятельности",
        aspects: "Комбинированные задания на чтение, письмо, говорение и аудирование (по возможности); мини-проекты в группах; повтор ключевых грамматических опор и лексических тем; подготовка к переходу в 6 класс."
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Закрепление результатов и мотивация",
        aspects: "Игра-зачёт по станциям: «чтение», «грамматика», «лексика», «письмо», «диалог»; выдача символических «сертификатов»/отметок достижений; обсуждение, какие навыки приобрели и что интересно в следующем году."
      }
    ]
  },
  {
    grade: 6,
    title: "Арабский язык для 6 класса",
    description: "Курс арабского языка для шестиклассников с углублением грамматических знаний, развитием навыков чтения и письма, расширением словаря и коммуникативных навыков.",
    lessons: [
      {
        number: 1,
        title: "Старт года: диагностика",
        topic: "Срез по материалу 5 класса",
        aspects: "Чтение текста 20–22 предложения; устные и письменные ответы на вопросы; проверка владения тремя временами, именным/глагольным предложением, притяжательными формами и базовыми диалогами; фиксация пробелов."
      },
      {
        number: 2,
        title: "Повтор ключевых конструкций",
        topic: "Базовая грамматика в тексте",
        aspects: "Быстрый обзор: местоимения, времена, союзы و، ثم، لكن، لأن؛ именные предложения и отрицание; упражнения «найди в тексте», «исправь предложение»; устный разбор типичных ошибок."
      },
      {
        number: 3,
        title: "Глагольное предложение: систематизация",
        topic: "Структура الجملة الفعلية",
        aspects: "Модели: فعل + فاعل + مفعول به (без терминов в объяснении, через «действие – кто – над кем/чем»); перестановка элементов; упражнения «дополни предложение»; чтение и разбор примеров."
      },
      {
        number: 4,
        title: "Именное предложение: систематизация",
        topic: "Подлежащее и сказуемое",
        aspects: "Повтор/углубление: هذا الطالب مجتهд، الجو بارد؛ отрицание: ليس؛ вопросы с هل؛ сравнительный анализ именного и глагольного предложений; упражнения на трансформацию."
      },
      {
        number: 5,
        title: "Объектные местоимения 2.0",
        topic: "Меня, тебя, его, её, нас, их",
        aspects: "Систематизация: —ني، ـك، ـه، ـها، ـنا، ـهم на глаголах и предлогах; модели: يحبني، يسمعك، يعطينا؛ упражнения «с кем/с чем связано действие?»; подстановка местоимений в готовые предложения."
      },
      {
        number: 6,
        title: "Модальные конструкции",
        topic: "«Должен», «может», «нужно»",
        aspects: "Модели: يجب أن…، يمكن أن…، أستطيع أن…; использование с глаголами в настоящем: يجب أن أدرس، يمكن أن نلعب؛ коммуникативные задания «что нужно/можно делать дома, в школе, на улице»."
      },
      {
        number: 7,
        title: "Временные связи 1",
        topic: "До того как / после того как",
        aspects: "Конструкции с قبل أن، بعد أن (на уровне шаблонов): قبل أن أنام، أقرأ؛ بعد أن أدرس، ألعب؛ выстраивание временной последовательности событий; упражнения «расставь в правильном порядке»."
      },
      {
        number: 8,
        title: "Временные связи 2",
        topic: "Когда / если",
        aspects: "Модели: عندما…، إذا…; различие ситуации «факт» vs «условие» на примерах: عندما أستيقظ، أغسل وجهي؛ إذا كان الجو جميلاً، سنذهب…; работа с мини-текстами, где нужно определить тип связи."
      },
      {
        number: 9,
        title: "Степени сравнения 2.0",
        topic: "Сравнительная и превосходная степень",
        aspects: "Повтор готовых шаблонов: أكبر، أصغر، أجمل؛ конструкции: هذا البيت أكبر من ذلك البيت؛ هو أفضل طالب في الصف؛ упражнения на сравнение людей, предметов, мест; короткие описательные тексты."
      },
      {
        number: 10,
        title: "Расширение словаря: школа и обучение",
        topic: "Учёба, предметы, режим дня",
        aspects: "Лексика: واجب، اختبار، نتيجة، علامة، مادة؛ модели: عندي اختبار، أراجع دروسي؛ чтение текста «как я готовлюсь к урокам»; письменный мини-текст о собственном учебном дне."
      },
      {
        number: 11,
        title: "Расширение словаря: профессии",
        topic: "Мир профессий",
        aspects: "Лексика: طبيب، مهندس، معلم، شرطي، سائق، مبرمج и др.; модели: أريد أن أصبح…؛ описание задач профессий; письменное высказывание «кем я хочу быть и почему» с опорой на шаблоны."
      },
      {
        number: 12,
        title: "Чтение 6.1: рассказ",
        topic: "Рассказ о человеке / семье",
        aspects: "Текст 18–20 предложений с временными связями, сравнением, модальными конструкциями; работа по этапам: прогноз по заголовку, чтение, разбор лексики, вопросы, план и краткий пересказ."
      },
      {
        number: 13,
        title: "Чтение 6.2: описание",
        topic: "Описание города / района",
        aspects: "Текст-описание с акцентом на прилагательные и степени сравнения; задания: выделить прилагательные, сгруппировать по «город/природа/люди»; составление собственного абзаца по образцу."
      },
      {
        number: 14,
        title: "Чтение 6.3: информационный текст",
        topic: "Небольшая статья о здоровье / спорте",
        aspects: "Текст о пользе спорта, правильного питания и режима; выделение главной идеи и аргументов; задания «согласен/не согласен» (устно); письменный абзац «что я делаю для здоровья»."
      },
      {
        number: 15,
        title: "Письмо: структурированный текст 1",
        topic: "Повествование в хронологии",
        aspects: "Повтор структуры: вступление – основная часть – заключение; написание связного рассказа «один день из моей жизни» с опорой на временные маркеры (أولاً، ثم، بعد ذلك، أخيراً) и 2–3 союза."
      },
      {
        number: 16,
        title: "Письмо: структурированный текст 2",
        topic: "Описание человека / места",
        aspects: "План описания (кто/что, внешний вид/характер/функции, вывод); работа с примером описания; составление текста об однокласснике или учителе; фокус на согласование, прилагательные, степени сравнения."
      },
      {
        number: 17,
        title: "Письмо: функциональные тексты",
        topic: "Письмо, записка, объявление",
        aspects: "Шаблоны: простое письмо другу (приветствие, основная часть, прощание), короткая записка родителям/другу, объявление в школе; отработка клише и формул вежливости; написание одного из видов текста."
      },
      {
        number: 18,
        title: "Лексика и речевые клише: мнение",
        topic: "Выражение мнения и аргументации",
        aspects: "Лексика: في رأيي، أعتقد أن، لأن، لذلك؛ упражнения: выражение согласия/несогласия в диалогах; краткие устные высказывания «за/против» простых утверждений; письменный абзац с мнением."
      },
      {
        number: 19,
        title: "Диалогические ситуации 6.1",
        topic: "Обсуждение планов, договорённости",
        aspects: "Ситуации: встреча с другом, планирование выходных, подготовка к экзамену; реплики: ماذا سنفعل؟ متى؟ أين؟; моделирование диалогов, запись готового диалога в тетрадь."
      },
      {
        number: 20,
        title: "Диалогические ситуации 6.2",
        topic: "Конфликт и его решение (мягко)",
        aspects: "Нейтральные ситуации: недоразумение, опоздание, забытая вещь; реплики извинения и объяснения: آسف، لم أقصد، لأن…؛ ролевые игры по готовым сценариям, отработка речевого этикета."
      },
      {
        number: 21,
        title: "Тематический блок «Путешествия и туризм»",
        topic: "Туристические поездки",
        aspects: "Лексика: سياحة، فندق، رحلة، شاطئ، جبل؛ чтение текста о поездке; задания «выбери маршрут», «опиши идеальное путешествие»; письменный текст 8–10 предложений о реальной или воображаемой поездке."
      },
      {
        number: 22,
        title: "Тематический блок «Медиа и хобби»",
        topic: "Книги, фильмы, игры",
        aspects: "Лексика: كتاب، مجلة، فيلم، برنامج، لعبة؛ выражение предпочтений: أحب أن أقرأ…، أفضل أن أشاهد…؛ обсуждение любимых книг/фильмов; письменный обзор (мини-рецензия) на книгу/фильм."
      },
      {
        number: 23,
        title: "Тематический блок «Город и общественные места»",
        topic: "Городская инфраструктура",
        aspects: "Лексика: مستشفى، مكتبة، مركز تسوق، مسجد/كنيسة (упоминание как объектов без религиозного углубления), حديقة عامة؛ упражнения «для чего нужно это место»; мини-проект «идеальный город»."
      },
      {
        number: 24,
        title: "Грамматика: обобщение времён",
        topic: "Настоящее, прошедшее, будущее в системе",
        aspects: "Таблица готовых форм по лицам на 2–3 частотных глаголах; упражнения «переведи по времени», «найди в тексте нужное время»; коммуникативные задания «расскажи, что ты делал/делаешь/будешь делать»."
      },
      {
        number: 25,
        title: "Грамматика: относительные предложения (ознаком.)",
        topic: "الذي، التي (на уровне интуиции)",
        aspects: "Введение простых относительных конструкций: هذا الطالب الذي يدرس كثيراً؛ هذه المدينة التي نعيش فيها؛ без глубокого разбора, через примеры; упражнения «соедини два предложения в одно»."
      },
      {
        number: 26,
        title: "Чтение 6.4: текст с относительными предложениями",
        topic: "Текст-описание человека/места",
        aspects: "Текст 18–20 предложений с который-/которая-структурами; задания «раздели сложные предложения на два простых и наоборот»; выделение и понимание роли الذي، التي в тексте."
      },
      {
        number: 27,
        title: "Контроль грамматики 6 класса",
        topic: "Проверка грамматического блока",
        aspects: "Контрольная работа: времена, модальные конструкции, объектные местоимения, степени сравнения, союзы, относительные предложения (на уровне узнавания); часть заданий в текстовом формате."
      },
      {
        number: 28,
        title: "Контроль чтения 6 класса",
        topic: "Техника чтения и понимание текста",
        aspects: "Индивидуальное чтение текста 20–22 предложения; задания на понимание (краткий ответ, выбор, соответствие), поиск грамматических конструкций; оценка беглости и точности чтения."
      },
      {
        number: 29,
        title: "Контроль письма 6 класса",
        topic: "Проверка связного письма",
        aspects: "Письменный текст 12–14 предложений на одну из тем: «мой любимый праздник/день», «город/место, которое я люблю», «моя мечта/будущее»; контроль структуры, связок, грамматики и словаря."
      },
      {
        number: 30,
        title: "Проект 1: «Профессия моей мечты»",
        topic: "Развёрнутое письменное и устное высказывание",
        aspects: "План проекта: кто я, какую профессию выбираю, почему, что буду делать, какие качества нужны; работа со словарём профессий; написание текста 12–14 предложений; устная презентация с опорой на план."
      },
      {
        number: 31,
        title: "Проект 2: «Моё идеальное путешествие»",
        topic: "Интеграция лексики и грамматики",
        aspects: "Использование лексики по путешествиям, времен, модальных конструкций и связок; составление текста (подготовка, путь, место, впечатления); создание постера/слайда с кратким устным выступлением."
      },
      {
        number: 32,
        title: "Арабский мир 6.0",
        topic: "Страны, города, культура, традиции",
        aspects: "Углубление в 2–3 арабские страны: столица, крупные города, язык, некоторые культурные особенности (еда, одежда, традиционные занятия); чтение информативного текста; задания на сопоставление и заполнение таблицы."
      },
      {
        number: 33,
        title: "Итоговая интеграция",
        topic: "Обзор лексики и грамматики года",
        aspects: "Повтор ключевых тем и конструкций в формате комплексных заданий: работа с текстом, преобразование предложений, краткие диалоги, мини-тексты; групповая работа и самооценка прогресса."
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Комплексная проверка и мотивация",
        aspects: "Станции «чтение», «грамматика», «лексика», «диалог», «письмо», «проект»; выполнение заданий в командах; подведение итогов, обсуждение сильных сторон и зон роста; настройка на переход в 7 класс."
      }
    ]
  },
  {
    grade: 7,
    title: "Арабский язык для 7 класса",
    description: "Курс арабского языка для семиклассников с систематизацией грамматических структур, развитием навыков анализа текста и аргументированного высказывания.",
    lessons: [
      {
        number: 1,
        title: "Старт года: диагностический срез",
        topic: "Проверка уровня после 6 класса",
        aspects: "Чтение текста 22–25 предложений; устные и письменные ответы на вопросам; проверка владения временами, модальными конструкциями, относительными предложениями; фиксация типичных ошибок и зон риска по классу."
      },
      {
        number: 2,
        title: "Повтор базовой системы",
        topic: "Систематизация ключевой грамматики",
        aspects: "Быстрый обзор: именное/глагольное предложение, времена, модальные конструкции, степени сравнения, الذي/التي; задания «найди в тексте», «исправь», «перепиши в другой форме»; фронтальный разбор типовых ошибок."
      },
      {
        number: 3,
        title: "Глагольная система 1",
        topic: "Повтор и упорядочивание трёх времен",
        aspects: "Таблица готовых форм на частотных глаголах (كتب، ذهب، أكل и др.); чёткая привязка к маркерам времени (أمس، اليوم، غداً، في المستقبل، عادةً); упражнения «переведи по времени» в пределах знакомых моделей."
      },
      {
        number: 4,
        title: "Глагольная система 2",
        topic: "Привычные действия и единичные события",
        aspects: "Разграничение «обычно/всегда» vs «однажды/вчера» в текстах; использование наречий частоты (دائماً، غالباً، أحياناً) и маркеров прошедшего; тренировочные тексты «типичный день» и «один особенный день»."
      },
      {
        number: 5,
        title: "Причастные формы (ознаком.)",
        topic: "Действующие и страдательные причастия как прилагательные",
        aspects: "Ознакомление с шаблонами مُدرِّس، مكتوب، مفتوح на уровне «слова-описания»; выделение в тексте; использование как прилагательных: باب مفتوح، طالب مجتهد؛ упражнения на распознавание и подстановку."
      },
      {
        number: 6,
        title: "Пассивация (ознаком.)",
        topic: "Простейший пассив в прошедшем/настоящем",
        aspects: "Модели: كُتِبَ الدرس، يُكتَبُ الدرس (без терминов, на уровне «сам написался/его пишут»); сопоставление актив–пассив в коротких текстах; упражнения «переформулируй 2–3 предложения» по образцу."
      },
      {
        number: 7,
        title: "Сложные предложения 1",
        topic: "Временные и причинно-следственные связи",
        aspects: "Расширение использования: عندما، قبل أن، بعد أن، لأن، لذلك؛ работа с лентой времени и схемами; упражнения на соединение двух простых предложений в одно сложное и обратную трансформацию."
      },
      {
        number: 8,
        title: "Сложные предложения 2",
        topic: "Условные конструкции",
        aspects: "Закрепление إذا и ввод لو (на уровне «гипотетическое условие»); сопоставление: إذا درستَ، تنجح / لو درستَ، لنجحتَ (узнавание по образцу); упражнения «что будет, если…», мини-диалоги с условием."
      },
      {
        number: 9,
        title: "Относительные предложения 2.0",
        topic: "Расширенное использование الذي/التي/الذين",
        aspects: "Сбор и систематизация: «человек, который…», «вещь, которая…», «люди, которые…»; соединение цепочек предложений: أحب الطالب الذي يقرأ كثيراً؛ упражнения «раздели/соедини»; работа в текстах."
      },
      {
        number: 10,
        title: "Лексика: чувства и эмоции",
        topic: "Эмоциональные состояния",
        aspects: "Лексика: سعيد، حزين، غاضب، خائف، متحمّس، قلق и др.; модели: أشعر بـ…، أنا سعيد لأن…؛ чтение коротких текстов о переживаниях; письменный абзац «когда я был особенно рад/расстроен»."
      },
      {
        number: 11,
        title: "Лексика: отношения и общение",
        topic: "Друзья, уважение, сотрудничество",
        aspects: "Лексика: صديق، احترام، مساعدة، تعاون، خلاف؛ речевые клише вежливости и поддержки; диалоги о дружбе, конфликтах и их решении; письменное высказывание «что такое настоящий друг»."
      },
      {
        number: 12,
        title: "Чтение 7.1: рассказ о человеке",
        topic: "Характер, выбор, поступок",
        aspects: "Текст 20–22 предложения о подростке/герое, стоящем перед выбором; выделение описаний характера, поступков и мотивов; обсуждение, согласны ли с выбором; краткий письменный пересказ по плану."
      },
      {
        number: 13,
        title: "Чтение 7.2: описательный текст",
        topic: "Описание места / города / школы",
        aspects: "Текст с насыщенной прилагательной лексикой и степенями сравнения; упражнения «найди описательные слова», «скажи, что автор любит/не любит»; собственный абзац-описание знакомого места."
      },
      {
        number: 14,
        title: "Чтение 7.3: информационный текст",
        topic: "Социальная тема (здоровье, экология, технологии)",
        aspects: "Краткий информационный текст (статья/заметка); выделение темы, главной идеи, аргументов; задания «дополни тезис аргументами из текста»; письменная реакция «согласен/не согласен, потому что…»."
      },
      {
        number: 15,
        title: "Аргументированное высказывание 1",
        topic: "Структура «мнение – аргументы – вывод»",
        aspects: "Формулы: في رأيي، أعتقد أن، أولاً، ثانياً، في النهاية؛ разбор образца текста с мнением; составление плана и написание короткого аргументированного абзаца (6–8 предложений) по простой теме."
      },
      {
        number: 16,
        title: "Аргументированное высказывание 2",
        topic: "Сравнение вариантов и выбор",
        aspects: "Модели: من الأفضل أن…، لأن…؛ «за и против» двух вариантов (например, спорт дома/на улице, книги/фильмы); таблица плюсов/минусов; письменный текст с явным выбором и объяснением."
      },
      {
        number: 17,
        title: "Функциональное письмо 1",
        topic: "Личное письмо / e-mail",
        aspects: "Структура письма: обращение, вступление, основная часть, завершение; речевые клише (تحية، مع السلامة، صديقك…); анализ примера письма; написание письма другу на 10–12 предложений."
      },
      {
        number: 18,
        title: "Функциональное письмо 2",
        topic: "Сообщение, объявление, заметка",
        aspects: "Форматы кратких текстов: объявление в школе, заметка на доске, сообщение в чат; требования к ясности и краткости; задания «преобразуй длинный текст в объявление» и наоборот."
      },
      {
        number: 19,
        title: "Диалогические ситуации 7.1",
        topic: "Обсуждение проблем и решений",
        aspects: "Ситуации: «у друга проблемы с учёбой/отношениями/временем»; речевые модели: ما المشكلة؟، ماذا تقترح؟، ربما يمكن أن…؛ ролевые игры, запись и разбор типовых диалогов."
      },
      {
        number: 20,
        title: "Диалогические ситуации 7.2",
        topic: "Интервью и опрос",
        aspects: "Роль «журналист–респондент»: вопросные модели, работа с вопросительными словами; подготовка мини-интервью (5–6 вопросов) о хобби/будущем/школе; устная отработка, затем краткая письменная фиксация."
      },
      {
        number: 21,
        title: "Грамматика: отрицание в системе",
        topic: "ما، لا، لم، لن (на уровне практики)",
        aspects: "Сопоставление по времени и значению: لا أكتب الآن؛ ما كتبت أمس؛ لم أكتب بعد؛ لن أكتب غداً؛ таблица с примерами; упражнения «подбери правильную частицу», работа с текстом на распознавание."
      },
      {
        number: 22,
        title: "Грамматика: обстоятельства и предлоги",
        topic: "Обстоятельства места/времени/образа действия",
        aspects: "Расширение использования обстоятельственных выражений: في الصباح، في المساء، في البيت، خارج المنزل، بسرعة، بجدّ؛ отработка через задания «расширь предложение, добавив обстоятельства»."
      },
      {
        number: 23,
        title: "Письмо: последовательный рассказ",
        topic: "Связный текст с флэшбэком",
        aspects: "Повествовательная структура с элементом «вспоминания»: сначала «сейчас», затем «когда-то»; маркеры: منذ، عندما كنت صغيراً؛ работа с образцом; написание текста 12–14 предложений."
      },
      {
        number: 24,
        title: "Письмо: описание события",
        topic: "Описание праздника/мероприятия",
        aspects: "План: когда/где, кто, что происходило, впечатления; активное использование временных и причинно-следственных связок; письменный текст с фокусом на деталях и эмоциях."
      },
      {
        number: 25,
        title: "Проект 1: «Социальная тема»",
        topic: "Мини-проект на выбранную социальную тему",
        aspects: "Выбор темы (экология, здоровье, дружба, интернет-зависимость и др.); сбор лексики; подготовка текста 12–15 предложений с мнением и предложениями решений; устная презентация в группах."
      },
      {
        number: 26,
        title: "Проект 2: «Культура арабского мира»",
        topic: "Информационно-культурный проект",
        aspects: "Выбор страны/города/культурного аспекта (еда, одежда, музыка, традиции) в нейтральном формате; работа с адаптированными материалами; подготовка краткого доклада и постера/слайда на арабском."
      },
      {
        number: 27,
        title: "Чтение 7.4: текст с аргументацией",
        topic: "Текст с мнением и примерами",
        aspects: "Анализ текста, где автор высказывает мнение и приводит 2–3 аргумента; выделение тезиса, аргументов, выводов; упражнение «дополни/измени аргументы», мини-письмо-ответ автору."
      },
      {
        number: 28,
        title: "Контроль грамматики 7 класса",
        topic: "Проверка грамматического блока",
        aspects: "Контрольная работа: времена, отрицание, сложные предложения (когда/если/потому что), относительные конструкции, объектные местоимения, простые причастия; часть заданий опирается на текст."
      },
      {
        number: 29,
        title: "Контроль чтения 7 класса",
        topic: "Проверка техники и понимания",
        aspects: "Индивидуальное чтение текста 22–25 предложений; задания «найди в тексте…», «ответь кратко», «выбери верный ответ»; оценка беглости, интонации, понимания общей идеи и деталей."
      },
      {
        number: 30,
        title: "Контроль письма 7 класса",
        topic: "Проверка развернутого письма",
        aspects: "Письменная работа: аргументированный текст или повествование (14–16 предложений) на одну из тем: «роль друзей», «использование технологий», «здоровый образ жизни»; оценка структуры, логики, грамматики, словаря."
      },
      {
        number: 31,
        title: "Интегрированный урок «Текст + анализ»",
        topic: "Аналитическое чтение и языковой разбор",
        aspects: "Работа с одним относительно сложным текстом: выделение лексики, грамматических конструкций, структуры; преобразование фрагментов (актив–пассив, простое–сложное); обсуждение содержания и формы."
      },
      {
        number: 32,
        title: "Интегрированный урок «Проект + речь»",
        topic: "Устная презентация и обсуждение",
        aspects: "Презентация одного из проектов (социальная тема или культура); отработка навыков публичного выступления: вступление, основная часть, вывод, ответы на вопросы; краткая письменная рефлексия."
      },
      {
        number: 33,
        title: "Итоговая интеграция",
        topic: "Обзор лексики и грамматики года",
        aspects: "Повтор ключевых грамматических и лексических тем в формате комбинированных заданий: чтение + грамматика, письмо + диалог, работа в парах и группах; самооценка прогресса по чек-листу."
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Комплексный итог и мотивация",
        aspects: "Игровой формат по станциям («чтение», «грамматика», «лексика», «письмо», «диалог», «проект»); работа в командах; подведение личных и групповых результатов; обсуждение ожидаемых компетенций к 8 классу."
      }
    ]
  },
  {
    grade: 8,
    title: "Арабский язык для 8 класса",
    description: "Курс арабского языка для восьмиклассников с комплексным развитием навыков чтения, письма, анализа текстов и аргументированного высказывания.",
    lessons: [
      {
        number: 1,
        title: "Старт года: диагностический срез",
        topic: "Проверка уровня после 7 класса",
        aspects: "Чтение текста 25–30 предложений; устные и письменные ответы на вопросы; проверка владения временами, отрицанием, сложными и относительными предложениями, базовым письмом и диалогами; фиксация типичных ошибок."
      },
      {
        number: 2,
        title: "Повтор ключевой базы",
        topic: "Систематизация грамматики и лексики",
        aspects: "Быстрый обзор: времена, отрицание (لا، ما، لم، لن), сложные предложения (لأن، إذا، عندما), который/которая (الذي، التي، الذين), степени сравнения; задания «найди и исправь ошибку», «переформулируй предложение»."
      },
      {
        number: 3,
        title: "Глагольная система 3.0",
        topic: "Функции совершенного и несовершенного",
        aspects: "Уточнение употребления «совершённого» (прошедшее, завершённое действие) и «несовершённого» (повторяемое, текущее, будущее); опора на маркеры времени; упражнения на выбор формы в контексте."
      },
      {
        number: 4,
        title: "Сложные предложения: противопоставление",
        topic: "Контраст и уступка",
        aspects: "Расширение: لكن، بل، بينما, رغم أن، مع أن (в простых моделях); различие «простое но» и «несмотря на то, что»; тренировка соединения предложений, переформулирование текста с другими союзами."
      },
      {
        number: 5,
        title: "Сложные предложения: причина и цель",
        topic: "Причина, следствие, цель",
        aspects: "Конструкции: لأن، لذلك، من أجل، لكي، حتى (в значении цели); работа со схемами «причина → следствие / цель → действие»; упражнения на преобразование пар предложений в одно сложное."
      },
      {
        number: 6,
        title: "Именный и глагольный стиль",
        topic: "Стилизация высказывания",
        aspects: "Сопоставление текстов с преобладанием именных и глагольных предложений; обсуждение эффекта (описание vs динамика); упражнения «перепиши часть текста в более динамичной/описательной форме»."
      },
      {
        number: 7,
        title: "Пассив: систематизация",
        topic: "Пассивные конструкции в прошедшем/настоящем",
        aspects: "Работа с готовыми моделями: كُتِب الكتاب، يُكتَب الكتاب، فُتِح الباب، يُفتَح الباب; сопоставление актив–пассив в текстах; упражнения «где важнее исполнитель/где действие?»; ограниченная трансформация актив↔пассив."
      },
      {
        number: 8,
        title: "Причастия и отглагольные имена",
        topic: "Расширение словарного запаса",
        aspects: "Систематизация форм на уровне лексики: فاعل/مفعول/اسم المكان/اسم الآلة (كاتب، مكتوب، مكتبة، مكتب، غسالة и др.); распознавание в текстах; использование в описаниях людей, предметов, мест."
      },
      {
        number: 9,
        title: "Лексика: общество и ценности",
        topic: "Семья, уважение, ответственность",
        aspects: "Лексика: مسؤولية، احترام، عدالة، مساعدة، تعاون; чтение текста о социальных ценностях; обсуждение в форме мини-дебатов; письменный абзац «какие ценности важны для меня и общества»."
      },
      {
        number: 10,
        title: "Лексика: медиа и новости",
        topic: "СМИ и информационное пространство",
        aspects: "Лексика: خبر، صحيفة، قناة، موقع، برنامج إخباري؛ формулы краткого сообщения: اليوم…، أعلن…، حدث…؛ упражнения по составлению «новостной полосы» из коротких заметок."
      },
      {
        number: 11,
        title: "Чтение 8.1: рассказ",
        topic: "Повествовательный текст с героем-подростком",
        aspects: "Текст 20–25 предложений с внутренними переживаниями героя, флэшбэком, диалогами; анализ мотивации персонажа; выделение ключевых эпизодов; составление плана и письменного пересказа."
      },
      {
        number: 12,
        title: "Чтение 8.2: описательный текст",
        topic: "Описание природного или городского пространства",
        aspects: "Текст с насыщенной прилагательной и образной лексикой; выделение средств описания (цвет, форма, звук, настроение); задание «нарисуй по тексту» и краткое собственное описание аналогичного места."
      },
      {
        number: 13,
        title: "Чтение 8.3: информационный текст",
        topic: "Социально значимая тема",
        aspects: "Небольшая статья (здоровый образ жизни, интернет-зависимость, экология и т.п.); выделение тезиса, аргументов, примеров; таблица «тезис – аргументы – вывод»; краткая письменная позиция ученика."
      },
      {
        number: 14,
        title: "Реферативное изложение",
        topic: "Краткая передача содержания текста",
        aspects: "Разбор примера краткого изложения; алгоритм: выделить главное, убрать второстепенное, сохранить логику; тренировочное изложение по прочитанному тексту (письменно 8–10 предложений)."
      },
      {
        number: 15,
        title: "Аргументированное высказывание 3.0",
        topic: "Развёрнутое мнение с аргументацией",
        aspects: "Структура: вступление – тезис – 2–3 аргумента – вывод; клише: أولاً، ثانياً، من جهة أخرى، في الختام؛ подготовка текста по теме «роль школы/семьи/друзей»; коллективный разбор 1–2 работ."
      },
      {
        number: 16,
        title: "Проблемно-поисковое высказывание",
        topic: "Проблема – причины – решения",
        aspects: "Модель: توجد مشكلة…، أسبابها…، من الحلول…؛ выбор актуальной для подростков темы; заполнение схемы «проблема–причины–последствия–решения»; письменный текст 12–14 предложений."
      },
      {
        number: 17,
        title: "Функциональное письмо: официальное обращение",
        topic: "Письмо/заявление в официальном стиле",
        aspects: "Структура: обращение, формулировка просьбы/проблемы, обоснование, благодарность; клише: تحية طيبة وبعد، أرجو من سيادتكم…؛ написание заявления (в школу, кружок и т.п.) по заданной ситуации."
      },
      {
        number: 18,
        title: "Функциональное письмо: отзыв/рецензия",
        topic: "Краткий отзыв о книге/фильме/мероприятии",
        aspects: "Структура: информация об объекте, краткое содержание, оценка, аргументы; лексика оценивания: رائع، ممتع، مفيد، ممل…؛ написание рецензии 10–12 предложений по выбранному объекту."
      },
      {
        number: 19,
        title: "Диалогические ситуации 8.1",
        topic: "Дискуссия и вежливое несогласие",
        aspects: "Модели: لا أوافقك تماماً، من وجهة نظري، ربما، ولكن…؛ ролевые дискуссии по простой социальной теме (соцсети, спорт, свободное время); запись и разбор одного образцового диалога."
      },
      {
        number: 20,
        title: "Диалогические ситуации 8.2",
        topic: "Переговоры и компромисс",
        aspects: "Ситуации: распределение обязанностей, планирование группового проекта, выбор места/времени; речевые модели предложения и уступки; отработка навыков «предложить – обсудить – договориться»."
      },
      {
        number: 21,
        title: "Тематический блок: «Подросток и мир»",
        topic: "Личность, выбор, ответственность",
        aspects: "Лексика: هوية، حرّية، مسؤولية، قرار، مستقبل؛ чтение текста о выборе и ответственности; обсуждение в формате «круглый стол»; письменное мини-эссе «важное решение в жизни подростка»."
      },
      {
        number: 22,
        title: "Тематический блок: «Наука и технологии»",
        topic: "Прогресс, плюсы и минусы технологий",
        aspects: "Лексика: تطوّر، اختراع، جهاز، شبكة، ذكاء اصطناعي (как термин); текст о влиянии технологий; таблица «плюсы–минусы»; аргументированное высказывание «как технологии влияют на мою жизнь»."
      },
      {
        number: 23,
        title: "Грамматика: комплексное отрицание",
        topic: "Систематизация ما، لا، لم، لن, ليس",
        aspects: "Таблица по времени и типу предложения; упражнения на выбор правильного отрицания в контексте; трансформация утвердительных предложений в отрицательные и наоборот; работа с текстом."
      },
      {
        number: 24,
        title: "Грамматика: относительные и придаточные",
        topic: "Усложнение структуры предложения",
        aspects: "Расширение использования الذي، التي، الذين; ввод حيث и ما/من с относительной функцией на уровне примеров; соединение 2–3 простых предложений в одно сложное; разбор сложных предложений в текстах."
      },
      {
        number: 25,
        title: "Чтение 8.4: текст с сложной структурой",
        topic: "Текст с относительными, причинно-следственными и условными связями",
        aspects: "Анализ структуры: выделение главной и придаточных частей; маркировка союзов и относительных местоимений; переформулирование сложных предложений в простые; обсуждение содержания."
      },
      {
        number: 26,
        title: "Контроль грамматики 8 класса",
        topic: "Проверка грамматического блока",
        aspects: "Контрольная работа: времена и их употребление, отрицание, сложные предложения (причина, цель, условие, уступка), пассив, причастия и отглагольные имена, относительные конструкции; задания частично на основе текста."
      },
      {
        number: 27,
        title: "Контроль чтения 8 класса",
        topic: "Техника чтения и аналитическое понимание",
        aspects: "Индивидуальное чтение текста 25–30 предложений; задания на общий смысл, детали, логические связи, отношение автора; идентификация грамматических конструкций; оценка беглости и осознанности чтения."
      },
      {
        number: 28,
        title: "Контроль письма 8 класса",
        topic: "Проверка развернутого письменного высказывания",
        aspects: "Письменная работа: проблемно-аргументированное эссе или развёрнутое повествование (14–18 предложений) на заданную тему; оценка структуры, логики, аргументации, грамматики, лексики и связок."
      },
      {
        number: 29,
        title: "Проект 1: «Социальный мини-исследовательский проект»",
        topic: "Опрос и аналитический текст",
        aspects: "Разработка простого опроса (3–5 вопросов) по теме (чтение, спорт, гаджеты); сбор данных в классе; составление краткого отчёта (описание результатов и выводы); устная презентация."
      },
      {
        number: 30,
        title: "Проект 2: «Арабский мир: страна/город/личность»",
        topic: "Информационно-культурный проект",
        aspects: "Выбор страны, города или известной личности; сбор адаптированной информации (география, культура, вклад личности); подготовка текста 14–16 предложений и визуального материала; презентация проекта."
      },
      {
        number: 31,
        title: "Интегрированный урок «Текст + речь»",
        topic: "Интерпретация и обсуждение текста",
        aspects: "Работа с текстом повышенной сложности: анализ содержания, структуры, лексики; подготовка краткого устного выступления по проблеме текста; обсуждение в формате управляемой дискуссии."
      },
      {
        number: 32,
        title: "Интегрированный урок «Проект + письмо»",
        topic: "Оформление проекта в письменной форме",
        aspects: "Преобразование устного проекта (социального или культурного) в структурированный письменный текст; работа над вступлением, логикой аргументов и выводом; взаимная проверка по чек-листу."
      },
      {
        number: 33,
        title: "Итоговая интеграция",
        topic: "Обзор материала года",
        aspects: "Комбинированные задания: работа с текстом + грамматика, письмо + диалог, мини-проект в группе; повтор основных грамматических моделей и тематической лексики; самооценка прогресса и постановка целей на 9 класс."
      },
      {
        number: 34,
        title: "Итоговый игровой зачёт",
        topic: "Комплексный итог и мотивация",
        aspects: "Формат «станций» (чтение, грамматика, лексика, письмо, диалог, проект); командная работа; подведение индивидуальных и групповых результатов; обсуждение, какие компетенции сформированы к завершению основной школы (8 класс)."
      }
    ]
  },
  {
    grade: 9,
    title: "Арабский язык для 9 класса",
    description: "Курс арабского языка для девятиклассников с итоговым развитием навыков основной школы, подготовкой к переходу в старшую ступень образования и комплексным контролем всех видов речевой деятельности.",
    lessons: [
      {
        number: 1,
        title: "Старт года: итоговый срез",
        topic: "Диагностика после 8 класса",
        aspects: "Чтение текста 30+ предложений; устные и письменные ответы разного типа (открытые, выбор); проверка владения временами, сложными конструкциями, пассивом, относительными предложениями, аргументированным письмом; фиксация зон риска по грамматике и видам РД."
      },
      {
        number: 2,
        title: "Повтор ядра грамматики",
        topic: "Систематизация ключевых конструкций",
        aspects: "Обзор: времена, отрицание, сложные союзы, пассив, причастия, отглагольные имена, الذي/التي/الذين; работа с «диагностическим» текстом: поиск конструкций, исправление ошибок, краткое резюме."
      },
      {
        number: 3,
        title: "Временные и видовые оттенки",
        topic: "Точность выражения времени",
        aspects: "Разграничение «привычное/повторяющееся» vs «единичное/уже завершённое» vs «намерение/план»; маркеры: عادةً، كثيراً، أحياناً، الآن، منذ، حتى الآن، قريباً؛ выбор правильной формы глагола в контексте; небольшие тексты с временными сдвигами."
      },
      {
        number: 4,
        title: "Сложные предложения: обзор",
        topic: "Типология сложных конструкций",
        aspects: "Систематизация: причина (لأن، لذلك)، цель (لكي، من أجل)، условие (إذا، لو)، уступка (رغم أن، مع أن), время (عندما، قبل أن، بعد أن); блок-схемы; упражнение «классифицируй союзы в тексте и переформулируй 2–3 предложения»."
      },
      {
        number: 5,
        title: "Пассив и актив: стилистика",
        topic: "Выбор активной/пассивной конструкции",
        aspects: "Повтор форм пассива; обсуждение, когда важен исполнитель/когда действие/результат; преобразование фрагментов текста из активного в пассивный формат и наоборот; анализ эффекта (объективность, официальность)."
      },
      {
        number: 6,
        title: "Номинализация и «умное письмо»",
        topic: "Причастия, отглагольные имена в тексте",
        aspects: "Расширенное использование: فاعل، مفعول، اسم المكان، اسم الزمان، مصدر в функции существительных; уплотнение текста за счёт номинализации («вместо целого предложения – одно словосочетание»); мини-переписывание абзацев."
      },
      {
        number: 7,
        title: "Лексика: общество и государство",
        topic: "Общественные институты и гражданская позиция",
        aspects: "Лексика: مجتمع، دولة، قانون، حق، واجب، مواطن، حرّية، عدالة; текст о правах и обязанностях гражданина (адаптированный); вопросы на понимание, дискуссия, краткое письменное мнение."
      },
      {
        number: 8,
        title: "Лексика: экономика и труд",
        topic: "Работа, деньги, профессии будущего",
        aspects: "Лексика: عمل، وظيفة، راتب، سوق العمل، مهنة، خبرة؛ обсуждение «профессии будущего»; чтение текста-обзора; письменный абзац «какие качества важны на рынке труда»."
      },
      {
        number: 9,
        title: "Чтение 9.1: социальный рассказ",
        topic: "Рассказ о выборе/конфликте/ответственности",
        aspects: "Текст 22–25 предложений, социальная проблематика (семья, школа, сверстники, выбор); анализ характера героя, мотивации, последствий решений; план текста, устный и краткий письменный пересказ с оценкой поступка."
      },
      {
        number: 10,
        title: "Чтение 9.2: аналитический текст",
        topic: "Небольшой аналитический/публицистический текст",
        aspects: "Текст с тезисом, аргументами, примером и выводом; разметка структуры (подчёркивание тезиса, нумерация аргументов); заполнение схемы «тезис–аргументы–пример–вывод»; письменный конспект."
      },
      {
        number: 11,
        title: "Чтение 9.3: информационный текст",
        topic: "Вопросы науки, технологий, общества",
        aspects: "Адаптированная статья (ИИ, экология, соцсети, здоровье и др.); отработка стратегий чтения: прогноз, выбор главной мысли, выделение фактов и оценочных суждений; задания «факт/мнение», «что автор предлагает»."
      },
      {
        number: 12,
        title: "Реферативное изложение 2.0",
        topic: "Развёрнутое сжатие текста",
        aspects: "Отработка алгоритма выделения главного; сравнение «плохого» и «качественного» изложения; написание изложения по информационному тексту (10–12 предложений) с сохранением логики и основных аргументов."
      },
      {
        number: 13,
        title: "Аргументированное эссе 1",
        topic: "Структура и логика аргументации",
        aspects: "Шаблон: вступление (проблема) – тезис – 2–3 аргумента – пример – вывод; клише: من جهة، من جهة أخرى، بالإضافة إلى ذلك، على سبيل المثال؛ коллективный разбор образца эссе."
      },
      {
        number: 14,
        title: "Аргументированное эссе 2",
        topic: "Отработка письменного формата",
        aspects: "Выбор одной темы (например, «роль интернета в жизни подростка»); составление плана (тезис/аргументы/пример/вывод); написание эссе 14–16 предложений; взаимная проверка по чек-листу."
      },
      {
        number: 15,
        title: "Проблемное эссе",
        topic: "Проблема – анализ – позиция – решение",
        aspects: "Модель: توجد مشكلة…، أسبابها…، نتائجها…، في رأيي…، من الحلول…; работа с одной социальной проблемой (зависимость от гаджетов, конфликт поколений и т.п.); письменный текст, фокус на причинно-следственных связях."
      },
      {
        number: 16,
        title: "Функциональное письмо: официальные тексты",
        topic: "Заявление / запрос / жалоба (учебные ситуации)",
        aspects: "Структура официального обращения; клише для начала, изложения сути, аргументации и завершения; разбор примера «письма в администрацию школы»; написание собственного текста в заданной ситуации."
      },
      {
        number: 17,
        title: "Функциональное письмо: мотивационное письмо",
        topic: "Письмо при подаче в кружок/школу/на программу",
        aspects: "Структура: кто я – чем интересуюсь – почему хочу попасть – что могу дать; речевые конструкции самопрезентации и мотивации; написание мотивационного письма по условной ситуации."
      },
      {
        number: 18,
        title: "Диалогические ситуации 9.1",
        topic: "Дискуссия, дебаты, защита позиции",
        aspects: "Роли «за» и «против» по заданной теме; речевые клише: أولاً، ثانياً، أختلف معك، على العكس، في النهاية؛ отработка устной аргументации; запись тезисов и «карты аргументов»."
      },
      {
        number: 19,
        title: "Диалогические ситуации 9.2",
        topic: "Интервью/пресс-конференция",
        aspects: "Расширение формата интервью: цепочки уточняющих вопросов, перефразирование; подготовка и проведение мини-пресс-конференции по проектной теме с распределением ролей."
      },
      {
        number: 20,
        title: "Тематический блок: «Подросток и будущее»",
        topic: "Образование, карьера, жизненный путь",
        aspects: "Лексика: هدف، خطة، مسار، اختيار، فرصة؛ чтение текста о выборе профессии/образования; дискуссия «что важнее: способности или усилия»; письменное высказывание о личных планах и сомнениях."
      },
      {
        number: 21,
        title: "Тематический блок: «Глобальные вызовы»",
        topic: "Экология, войны, бедность, миграция (нейтрально)",
        aspects: "Адаптированный текст о глобальной проблеме без политизации; выделение сущности проблемы, масштабов, возможных решений; мини-групповой проект «что может делать обычный человек»."
      },
      {
        number: 22,
        title: "Грамматика: комплексное повторение",
        topic: "Времена, отрицание, пассив, сложные предложения",
        aspects: "Сводная работа: таблицы + текстовые задания; трансформация предложений (утверждение/отрицание, актив/пассив, простое/сложное); цель – привести знание системы в рабочий, прикладной вид."
      },
      {
        number: 23,
        title: "Грамматика: относительные конструкции 3.0",
        topic: "Усложнённые цепочки с الذي и др.",
        aspects: "Работа со «вложенными» и цепочечными конструкциями: الطالب الذي يدرس في المدرسة التي تقع في…؛ упрощение сложных предложений в набор простых и обратная сборка; фиксация типовых ошибок."
      },
      {
        number: 24,
        title: "Чтение 9.4: текст повышенной сложности",
        topic: "Текст с насыщенной грамматикой и лексикой",
        aspects: "Текст 25–30 предложений с пассивом, относительными конструкциями, сложными союзами; послойный разбор: сначала понимание смысла, затем лексика и грамматика; краткий письменный анализ содержания."
      },
      {
        number: 25,
        title: "Контроль грамматики 9 класса",
        topic: "Итог по грамматике основной школы",
        aspects: "Контрольная работа по всей системе: времена, отрицание, пассив, сложные предложения, относительные конструкции, номинализация, базовые модели эссе; задания частично на основе текста."
      },
      {
        number: 26,
        title: "Контроль чтения 9 класса",
        topic: "Итог по чтению и пониманию текста",
        aspects: "Индивидуальное чтение текста 30+ предложений; задания на общий смысл, подтекст, логику, средства связи; выделение и интерпретация ключевых грамматических конструкций; оценка зрелости чтения."
      },
      {
        number: 27,
        title: "Контроль письма 9 класса",
        topic: "Итог по письменной речи",
        aspects: "Письменная работа в одном из форматов: аргументированное эссе, проблемное эссе, расширенное изложение с элементами комментария (16–18 предложений); оценка структуры, логики, аргументации, грамматики, лексики."
      },
      {
        number: 28,
        title: "Проект 1: «Социальный аналитический проект»",
        topic: "Мини-исследование + аналитический текст",
        aspects: "Выбор темы (чтение/спорт/интернет/профессии и т.п.), подготовка опроса, сбор данных, формулировка выводов; написание аналитического текста (описание результатов и выводы); устная защита."
      },
      {
        number: 29,
        title: "Проект 2: «Арабский мир и глобальный контекст»",
        topic: "Сравнительный культурно-информационный проект",
        aspects: "Выбор одной арабской страны/города и сопоставление с родной страной/городом (нейтральные параметры: язык, климат, образование, культура, быт); подготовка сравнительного текста и презентации."
      },
      {
        number: 30,
        title: "Интегрированный урок «Текст + аргументация»",
        topic: "Углублённый анализ и устный отклик",
        aspects: "Работа с публицистическим/социальным текстом: выявление позиции автора, аргументов, средств убеждения; подготовка устного отклика (согласие/оппонирование) по заранее заданному плану."
      },
      {
        number: 31,
        title: "Интегрированный урок «Текст + письмо»",
        topic: "Комбинированное задание по чтению и письму",
        aspects: "Чтение текста + задание: написать эссе/отзыв/официальное письмо на основе проблематики текста; оценка умения опереться на исходный материал и выстроить собственное высказывание."
      },
      {
        number: 32,
        title: "Интегрированный урок «Проект + речь»",
        topic: "Публичная защита проекта",
        aspects: "Подготовка и защита одного из проектов (социальный/культурный); требования к структуре выступления, аргументации и работе с вопросами; взаимная оценка по критериям (ясность, логика, язык)."
      },
      {
        number: 33,
        title: "Итоговая интеграция",
        topic: "Обобщение всего курса основной школы",
        aspects: "Комплексные задания: работа с текстом, грамматический анализ, устный и письменный отклик; резюмирование основных тем и навыков 5–9 классов; обсуждение ожиданий и требований развития в старшей школе."
      },
      {
        number: 34,
        title: "Итоговый формат «экзаменационный»",
        topic: "Моделирование экзамена по арабскому",
        aspects: "Типовое задание: текст для чтения + задания, письменная часть (эссе/изложение), устная часть (монолог + диалог/ответы на вопросы); рефлексия: что получается уверенно, что требует доработки при выходе на старшую ступень."
      }
    ]
  },
  {
    grade: "university_math",
    title: "Математика в ВУЗе",
    description: "Комплексный курс высшей математики для студентов технических и естественных специальностей, включающий математический анализ, линейную алгебру и аналитическую геометрию.",
    lessons: [
      {
        number: 1,
        title: "Вводное занятие и входная диагностика",
        topic: "Структура курса, базовые требования",
        aspects: "Цели и результаты курса; формат контроля; повтор школьного ЕГЭ-уровня: функции, производная, интеграл, тригонометрия; фиксация дефицитов"
      },
      {
        number: 2,
        title: "Числовые множества и функции",
        topic: "ℝ, отображения, графики",
        aspects: "Расширение понятия числовой прямой; функции одной переменной; способы задания (формула, таблица, график); элементарные функции и их свойства"
      },
      {
        number: 3,
        title: "Предел числовой последовательности",
        topic: "Математический анализ: старт",
        aspects: "Интуитивное и формальное понимание предела; сходящиеся/расходящиеся последовательности; базовые примеры и типовые приёмы оценок"
      },
      {
        number: 4,
        title: "Предел функции",
        topic: "Предел в точке",
        aspects: "Определение предела функции; односторонние пределы; арифметические свойства пределов; неопределённости и первые приёмы их устранения"
      },
      {
        number: 5,
        title: "Непрерывность функции",
        topic: "Точки разрыва и их типы",
        aspects: "Определение непрерывности; типы разрывов (устранимые, первого/второго рода); теоремы о непрерывных функциях (на отрезке, промежуточные значения)"
      },
      {
        number: 6,
        title: "Пределы и элементарные функции",
        topic: "Пределы стандартных функций",
        aspects: "Пределы степенных, показательных, логарифмических, тригонометрических функций; стандартные «табличные» пределы; практический блок"
      },
      {
        number: 7,
        title: "Производная: определение и геометрический смысл",
        topic: "Отношение приращений",
        aspects: "Определение производной; касательная к графику; физический смысл (скорость); первые вычисления производных по определению"
      },
      {
        number: 8,
        title: "Производные элементарных функций",
        topic: "Таблица производных",
        aspects: "Производные степенной, показательной, логарифмической, тригонометрических функций; линейность; базовые примеры и упражнения"
      },
      {
        number: 9,
        title: "Правила дифференцирования",
        topic: "Сложение, произведение, частное, сложная функция",
        aspects: "Правило произведения и частного; формула сложной функции (цепное правило); типовые комбинации; аналитические вычисления"
      },
      {
        number: 10,
        title: "Приложения производной (I): монотонность и экстремумы",
        topic: "Исследование функции",
        aspects: "Связь знака производной и роста/убывания; критические точки; локальные экстремумы; алгоритм исследования функции"
      },
      {
        number: 11,
        title: "Приложения производной (II): выпуклость, точки перегиба",
        topic: "Кривизна графика",
        aspects: "Вторая производная; выпуклость/вогнутость; точки перегиба; качественное построение графиков"
      },
      {
        number: 12,
        title: "Оптимизационные задачи",
        topic: "Наибольшее/наименьшее значение",
        aspects: "Поиск экстремумов на отрезке; прикладные задачи (экономика, техника, геометрия); проверка граничных точек"
      },
      {
        number: 13,
        title: "Дифференциал и приближённые вычисления",
        topic: "Линеаризация",
        aspects: "Понятие дифференциала; линейное приближение функции; формула приращения; оценка погрешности; инженерные приложения"
      },
      {
        number: 14,
        title: "Неопределённый интеграл",
        topic: "Первообразная и свойства",
        aspects: "Определение первообразной; неопределённый интеграл как семейство функций; линейность интеграла; базовая таблица интегралов"
      },
      {
        number: 15,
        title: "Методы интегрирования (I)",
        topic: "Замена переменной",
        aspects: "Интеграл с заменой; типовые подстановки (линейная, тригонометрическая и др.); стандартные шаблоны"
      },
      {
        number: 16,
        title: "Методы интегрирования (II)",
        topic: "Интегрирование по частям",
        aspects: "Формула интегрирования по частям; выбор u и dv; цепочки интегрирования; простейшие рекуррентные схемы"
      },
      {
        number: 17,
        title: "Определённый интеграл",
        topic: "Предел сумм, геометрический смысл",
        aspects: "Определение через интегральные суммы (на уровне идеи); площадь под графиком; свойства определённого интеграла; связь с первообразной (формула Ньютона–Лейбница)"
      },
      {
        number: 18,
        title: "Приложения определённого интеграла",
        topic: "Площади и простейшие объёмы",
        aspects: "Площадь плоских фигур; площадь между графиками; объём тел вращения (на уровне базовых формул); практические задачи"
      },
      {
        number: 19,
        title: "Ряды (обзорно)",
        topic: "Числовые и функциональные ряды",
        aspects: "Понятие ряда; геометрический ряд; критерии сходимости «первого уровня» (без жёсткой теории); пример Тейлора/Маклорена для элементарных функций"
      },
      {
        number: 20,
        title: "Итоговый модуль по анализу",
        topic: "Обобщение matan-блока",
        aspects: "Сводка: предел, непрерывность, производная, интеграл, приложения; типовой контрольный набор задач «как на экзамене по матану 1»"
      },
      {
        number: 21,
        title: "Линейные пространства",
        topic: "Линейная алгебра: старт",
        aspects: "Векторы и операции над ними; линейная комбинация; линейная независимость; базис и размерность; примеры пространств (ℝⁿ, пространство функций)"
      },
      {
        number: 22,
        title: "Матрицы и операции с ними",
        topic: "Матрицы, умножение, транспонирование",
        aspects: "Типы матриц; сложение и умножение; единичная и нулевая матрица; транспонирование; примеры из систем уравнений"
      },
      {
        number: 23,
        title: "Определители",
        topic: "Определитель и его свойства",
        aspects: "Определитель 2×2, 3×3; разложение по строке/столбцу; свойства определителя; геометрическая интерпретация (площадь/объём)"
      },
      {
        number: 24,
        title: "Обратная матрица и ранг",
        topic: "Обратимость и вырожденность",
        aspects: "Условие существования обратной матрицы; вычисление через дополнения/метод Гаусса; ранг матрицы; связь с системами уравнений"
      },
      {
        number: 25,
        title: "Системы линейных уравнений",
        topic: "Метод Гаусса и теоремы Кронекера–Капелли",
        aspects: "Решения СЛАУ; классификация: единственное, множество, нет решений; матричная форма Ax=b; алгоритм Гаусса"
      },
      {
        number: 26,
        title: "Евклидово пространство ℝⁿ",
        topic: "Скалярное произведение, норма, угол",
        aspects: "Скалярное произведение; длина вектора; ортогональность; косинус угла; неравенство Коши–Буняковского; многомерная геометрия"
      },
      {
        number: 27,
        title: "Ортогонализация и ортонормированные базисы",
        topic: "Метод Грама–Шмидта",
        aspects: "Построение ортонормированного базиса; проекция вектора на подпространство; прикладные аспекты (Чебышев, наименьшие квадраты — обзорно)"
      },
      {
        number: 28,
        title: "Собственные значения и собственные векторы",
        topic: "Спектральные характеристики",
        aspects: "Определение; характеристический многочлен; вычисление собственных значений матрицы 2×2/3×3; геометрический смысл"
      },
      {
        number: 29,
        title: "Диагонализация матриц",
        topic: "Приведение к простому виду",
        aspects: "Условие диагонализируемости; матрица перехода; применение к возведению матрицы в степень и системам разностных уравнений"
      },
      {
        number: 30,
        title: "Линейные операторы и квадратичные формы (обзорно)",
        topic: "Операторы в пространстве, квадратичные формы",
        aspects: "Линейный оператор как матрица; ядро и образ; квадратичные формы, приведение к каноническому виду (на уровне идей); примеры из оптимизации"
      },
      {
        number: 31,
        title: "Введение в дифференциальные уравнения (опция)",
        topic: "ОДУ 1-го порядка",
        aspects: "Понятие дифференциального уравнения; уравнения с разделяющимися переменными; линейные уравнения 1-го порядка; простейшие модели (рост/распад)"
      },
      {
        number: 32,
        title: "Систематизация: анализ + линал",
        topic: "Интеграция разделов",
        aspects: "Примеры задач, где одновременно используются интегралы, линейная алгебра и дифференциальные уравнения; построение «карты тем» для сессии"
      },
      {
        number: 33,
        title: "Экзаменационный тренажёр",
        topic: "Комплексная контрольная работа",
        aspects: "Типовой вариант зачётно-экзаменационного уровня: блок анализа + блок линейной алгебры; разбор структуры решений, оценка типичных ошибок"
      },
      {
        number: 34,
        title: "Итоговое занятие",
        topic: "Рефлексия и маршрутизация дальше",
        aspects: "Обсуждение результатов; рекомендации по углублённому изучению (матан-2, функциональный анализ, теория вероятностей, уравнения матфизики); фиксация опорных формул и методик"
      }
    ]
  },
  {
    grade: "ege_math",
    title: "Подготовка к ЕГЭ по математике",
    description: "Комплексный курс подготовки к Единому государственному экзамену по математике профильного уровня с разбором всех типов заданий, стратегиями решения и тренировочными вариантами.",
    lessons: [
      {
        number: 1,
        title: "Старт и диагностика ЕГЭ",
        topic: "Формат экзамена и входной срез",
        aspects: "Структура КИМ (часть 1 и 2, типы задач, балы → первичные/тестовые); разбор демоверсии; экспресс-срез по ключевым темам (алгебра, геометрия, параметры, планиметрия/стереометрия)"
      },
      {
        number: 2,
        title: "Базовая арифметика и проценты",
        topic: "Задачи на проценты, доли, пропорции",
        aspects: "Быстрые приёмы: проценты, рост/убыль, сложные проценты, доли; пропорции; текстовые задачи «про деньги»; формат простых заданий (1–2)"
      },
      {
        number: 3,
        title: "Выражения, оценки и корни",
        topic: "Числовые и буквенные выражения",
        aspects: "Преобразование выражений со степенями, корнями, модулями; рационализация; оценка результата; работа «в уме» и без калькулятора (формат задачи 3)"
      },
      {
        number: 4,
        title: "Уравнения и неравенства базового уровня",
        topic: "Линейные, квадратные, рациональные",
        aspects: "Повтор: линейные/квадратные, приведение к стандартному виду, ОДЗ; простые рациональные уравнения/неравенства; интервалка; связь с типовыми задачами 4–5"
      },
      {
        number: 5,
        title: "Функции и графики (часть 1)",
        topic: "Чтение графиков, свойства функций",
        aspects: "Типы функций: линейная, квадратичная, показательная, логарифмическая, тригонометрическая, модульная, кусочно заданная; по графику: монотонность, знаки, экстремумы, асимптоты; формат задач типа 6"
      },
      {
        number: 6,
        title: "Производная и графический анализ",
        topic: "Производная в ЕГЭ и её применение",
        aspects: "Производная как скорость изменения; связь знака производной с монотонностью и экстремумами; типовые задачи на исследование графика, построение таблиц знаков"
      },
      {
        number: 7,
        title: "Текстовые задачи базового уровня",
        topic: "Задачи на движение, работу, смеси",
        aspects: "Модель через уравнение/систему; табличный метод; задачи «скорость–время–расстояние», «работа–производительность–время», «смеси, растворы»; форматы заданий 7–8"
      },
      {
        number: 8,
        title: "Стандартные формулы и преобразования",
        topic: "Формулы сокращённого умножения, логарифмы, тригонометрия",
        aspects: "Вспоминание и систематизация формул: (a±b)², a²–b², логарифмы (основание, свойства), базовые тригонометрические тождества; быстрые шаблоны для упрощения выражений"
      },
      {
        number: 9,
        title: "Показательные и логарифмические уравнения",
        topic: "Экспоненты и логарифмы",
        aspects: "Приведение к одному основанию, логарифмирование, свойства logₐb; комбинированные задачи; типовой формат заданий уровня 13 (часть 2, алгебра)"
      },
      {
        number: 10,
        title: "Тригонометрические уравнения (часть 1)",
        topic: "Базовые уравнения sin, cos, tg",
        aspects: "Решения на 0≤x≤2π и на ℝ; формулы приведения; переход к тангенсу; простейшие уравнения вида a·sin x = b и sin x = sin α; типовые схемы"
      },
      {
        number: 11,
        title: "Тригонометрические уравнения (часть 2)",
        topic: "Сложные и составные уравнения",
        aspects: "Комбинации sin/cos/tg; понижение степени, формулы двойного угла; уравнения со скобками, параметрами в тригонометрии; задел под задания 13/15 высокого уровня"
      },
      {
        number: 12,
        title: "Алгебраические неравенства (углубление)",
        topic: "Рациональные, иррациональные, логарифмические",
        aspects: "Интервальный метод; использование производной для анализа знака; неравенства с логарифмами и степенями; простейшие неравенства с модулем"
      },
      {
        number: 13,
        title: "Задачи с параметром (часть 1)",
        topic: "Линейные и квадратные модели",
        aspects: "Метод «разбора по дискриминанту»; зависимость числа корней от параметра; графическая интерпретация (парабола и прямая); разбор типовых конструкций задания 18 (старый №17)"
      },
      {
        number: 14,
        title: "Задачи с параметром (часть 2)",
        topic: "Функциональный и геометрический подход",
        aspects: "Параметр в неравенствах и системах; работа с областью значений; опорные графики; разбор 1–2 полноценных задач ЕГЭ с параметром"
      },
      {
        number: 15,
        title: "Прогрессии и последовательности",
        topic: "Арифметическая и геометрическая прогрессия",
        aspects: "Формулы aₙ и Sₙ, bₙ и Sₙ; задачи «накопление», «платежи», «поиск номера элемента»; связь с задачами уровня 11/12 (часть 1) и 17 (часть 2, экономика/финансы)"
      },
      {
        number: 16,
        title: "Итоговый алгебраический практикум (часть 1)",
        topic: "Короткие задачи части 1",
        aspects: "Сборный тренажёр по заданиям 1–12 (быстрый счёт, формулы, графики, простые уравнения, текстовые задачи); работа под тайминг; анализ ошибок"
      },
      {
        number: 17,
        title: "Планиметрия: формулы и база",
        topic: "Треугольники, четырёхугольники, окружность",
        aspects: "Повтор/структурирование: теорема Пифагора, синусы/косинусы, площади, подобие, вписанные/описанные окружности; набор «обязательных» геометрических фактов для ЕГЭ"
      },
      {
        number: 18,
        title: "Планиметрия: стандартная задача (ч.2)",
        topic: "Типовая задача уровня 16 (бывш. 16)",
        aspects: "Структура решения: чертёж, «дано/найти», рассуждения, доказательство, вычисления; типовая конфигурация (треугольник + окружность, медианы, высоты и т.п.)"
      },
      {
        number: 19,
        title: "Планиметрия: нестандартные ходы",
        topic: "Олимпиадные мотивы в задаче ЕГЭ",
        aspects: "Применение подобных треугольников, тригонометрии, окружности; поиск «ключевой идеи»; разбор 1–2 задач повышенного уровня"
      },
      {
        number: 20,
        title: "Стереометрия: база",
        topic: "Призма, пирамида, цилиндр, конус, шар",
        aspects: "Элементы (ребра, высоты, диагонали); формулы объёмов и площадей поверхностей; базовые стереометрические конфигурации из ЕГЭ"
      },
      {
        number: 21,
        title: "Стереометрия: углы и расстояния",
        topic: "Задача уровня 14 (стереометрия)",
        aspects: "Алгоритм: построение сечения, поиск прямых/плоскостей под углом, расстояние от точки до плоскости/прямой; разбор 2–3 типовых задач ЕГЭ"
      },
      {
        number: 22,
        title: "Стереометрия + координаты/векторы",
        topic: "Координатный и векторный методы",
        aspects: "Упаковка стереометрии в координаты: выбор системы, координаты вершин, векторы, скалярное произведение для углов; одна-две задачи «координаты + стерео»"
      },
      {
        number: 23,
        title: "Экономические задачи (типовая №17)",
        topic: "Кредиты, вклады, дифференцированные/аннуитетные платежи",
        aspects: "Модели платежей через прогрессии/формулы сложных процентов; разбор типового банка задач ЕГЭ по кредитам; оформление решения"
      },
      {
        number: 24,
        title: "Статистика, вероятность, комбинаторика",
        topic: "Задачи уровня 13/14 (вероятность, статистика)",
        aspects: "Перестановки/размещения/сочетания; базовая вероятность; диаграммы, выборки, медиана/мода/среднее; типовые форматы задач"
      },
      {
        number: 25,
        title: "Комплексные задачи (алгебра + геометрия)",
        topic: "Текстовые и прикладные кейсы",
        aspects: "Задачи, где совместно используются функции, производная, геометрия/стереометрия, прогрессии, вероятности; тренировка многократного переключения контекста"
      },
      {
        number: 26,
        title: "Полный вариант ЕГЭ №1 (под часы)",
        topic: "Экзаменационное моделирование",
        aspects: "Решение варианта целиком в условиях, близких к реальным: тайминг, порядок работы, стратегия пропусков; первичный разбор результатов"
      },
      {
        number: 27,
        title: "Анализ ошибок варианта №1",
        topic: "Разбор «узких мест»",
        aspects: "Классификация ошибок (техника, матчасть, стратегия); донастройка тактики (что решать первым, что пропускать); персональные задачи на отработку"
      },
      {
        number: 28,
        title: "Полный вариант ЕГЭ №2 (усложнённый)",
        topic: "Вариант с акцентом на часть 2",
        aspects: "Вариант с усиленным блоком №13–18 (уравнения, неравенства, планиметрия, стереометрия, параметр, экономика); работа под тайминг"
      },
      {
        number: 29,
        title: "Анализ ошибок варианта №2",
        topic: "Отработка сложных задач",
        aspects: "Детальный разбор части 2; обсуждение оформления, логики, строгости записи; снова персональная «дозагрузка» по слабым темам"
      },
      {
        number: 30,
        title: "Тематический микс по частям 1–2",
        topic: "Быстрая смена типов задач",
        aspects: "Набор разношерстных задач (1–19) в перемешку; отработка навигации по варианту; тренировка «быстрого чтения» условия и выбора метода"
      },
      {
        number: 31,
        title: "Финальный алгебраический блок",
        topic: "Производная, уравнения, параметр",
        aspects: "Итоговая систематизация по алгебре и анализу: тригонометрия, экспонента/логарифм, производная, интеграл (если идёт в контуре), прогрессии, параметры; мини-вариант только по алгебре"
      },
      {
        number: 32,
        title: "Финальный геометрический блок",
        topic: "Планиметрия и стереометрия",
        aspects: "Итоговое повторение теорем и формул; микс планиметрии, стереометрии и координат; отработка одной планиметрической и одной стереометрической задачи «по-взрослому»"
      },
      {
        number: 33,
        title: "Генеральная репетиция",
        topic: "Полный вариант №3",
        aspects: "Ещё один полный вариант под реальные условия; фиксация динамики по сравнению с вариантом №1; финальная корректировка стратегии (распределение времени, порядок задач)"
      },
      {
        number: 34,
        title: "Предэкзаменационный брифинг",
        topic: "Боевой протокол ЕГЭ",
        aspects: "Итоговый обзор ключевых формул и идей; чек-лист самопроверки; разбор типичных ловушек; рекомендации по распределению времени; ответы на вопросы и психологический настрой"
      }
    ]
  },
  {
    grade: "oge_math",
    title: "Подготовка к ОГЭ по математике",
    description: "Комплексный курс подготовки к Основному государственному экзамену по математике с разбором всех типов заданий, стратегиями решения и тренировочными вариантами.",
    lessons: [
      {
        number: 1,
        title: "Стартовая диагностика ОГЭ",
        topic: "Структура экзамена и входной срез",
        aspects: "Формат ОГЭ (кол-во заданий, типы задач, критерии); быстрая диагностика по ключевым темам; фиксация «зон риска»; постановка целей подготовки"
      },
      {
        number: 2,
        title: "Архитектура КИМ и стратегия",
        topic: "Карта заданий №1–№25",
        aspects: "Обзор блоков: арифметика, алгебра, функции, текстовые задачи, геометрия, статистика; разбор демоверсии; базовая стратегия решения и распределения времени"
      },
      {
        number: 3,
        title: "Базовая арифметика (№1, №2)",
        topic: "Проценты, доли, пропорции",
        aspects: "Вычисления с дробями и десятичными дробями; проценты (от числа, изменение, обратная задача); пропорции; типовые форматы задач №1–2"
      },
      {
        number: 4,
        title: "Числовые выражения (№3)",
        topic: "Порядок действий, степени, корни",
        aspects: "Упрощение числовых выражений со степенями, корнями, модулями; оценка результата; работа без калькулятора; отработка шаблонов задания №3"
      },
      {
        number: 5,
        title: "Формулы и подстановка (№4)",
        topic: "Подстановка в формулы",
        aspects: "Формулы из геометрии, физики, экономики; подстановка чисел, работа с буквенными обозначениями; анализ размерностей; закрепление по формату №4"
      },
      {
        number: 6,
        title: "Преобразование алгебраических выражений (№5)",
        topic: "Многочлены, формулы сокращённого умножения",
        aspects: "Сокращение дробей, вынесение множителя, разложение на множители; обратное применение формул (a±b)², a²–b²; типовые задачи №5"
      },
      {
        number: 7,
        title: "Линейные уравнения и уравнения со скобками (№6)",
        topic: "Уравнения 1-й ступени",
        aspects: "Уравнения с дробями и скобками; ОДЗ; проверка корней; уравнения в прикладном контексте; типовые конструкции задания №6"
      },
      {
        number: 8,
        title: "Квадратные уравнения (№7)",
        topic: "Полные и неполные квадратные уравнения",
        aspects: "Формула дискриминанта; неполные виды; разложение на множители; выбор более удобного метода; отработка под формат №7"
      },
      {
        number: 9,
        title: "Текстовые задачи на уравнения (№8)",
        topic: "Перевод текста в уравнение",
        aspects: "Задачи на движение, работу, концентрации, проценты; выбор неизвестной; построение математической модели; критерии проверки; задания №8"
      },
      {
        number: 10,
        title: "Линейные неравенства и системы (№9)",
        topic: "Неравенства с одной переменной",
        aspects: "Решение линейных неравенств; интервальная запись; простейшие системы неравенств; интерпретация условий; шаблоны №9"
      },
      {
        number: 11,
        title: "Функции и графики (№10)",
        topic: "Чтение и использование графика",
        aspects: "Линейная, квадратичная, кусочная функция; по графику: значения, область определения, промежутки знакопостоянства и монотонности; типовые задачи №10"
      },
      {
        number: 12,
        title: "Последовательности и числовые ряды (№11)",
        topic: "Монотонность, формула n-го члена",
        aspects: "Арифметические/геометрические элементы без формального ввода; работа с таблицами и описанием; анализ роста/убывания; формат №11"
      },
      {
        number: 13,
        title: "Комбинаторика и вероятность (№12)",
        topic: "Элементарные случайные события",
        aspects: "Счёт вариантов (правила сложения и умножения); благоприятные/возможные исходы; базовые вероятностные задачи; отработка задания №12"
      },
      {
        number: 14,
        title: "Статистика и диаграммы (№13)",
        topic: "Среднее, мода, медиана, графики данных",
        aspects: "Чтение таблиц и диаграмм; расчёт среднего, моды, медианы; интерпретация реальных данных; типовые кейсы задания №13"
      },
      {
        number: 15,
        title: "Контрольный блок по заданиям №1–13",
        topic: "Мини-вариант по первой части (алгебра + статистика)",
        aspects: "Смешанная работа по №1–13; анализ ошибок; чек-лист «быстрой проверки»; корректировка индивидуального плана"
      },
      {
        number: 16,
        title: "Геометрия: базовые факты для ОГЭ",
        topic: "«Сводка» формул и теорем",
        aspects: "Треугольники, подобие, Пифагор, окружность, площади и периметры; разбор «формульного мини-справочника»; типовые формулировки в КИМ"
      },
      {
        number: 17,
        title: "Геометрические задачи на вычисление (№14, №15)",
        topic: "Площадь, периметр, угол, длина",
        aspects: "Задачи на применение формул без доказательства; прямоугольный треугольник, многоугольники, круг и сектор; отработка формата №14–15"
      },
      {
        number: 18,
        title: "Координатная геометрия (№16)",
        topic: "Координаты, расстояние, середина",
        aspects: "Расстояние между точками, длина отрезка, середина отрезка; простые многоугольники в координатах; типовые сценарии задания №16"
      },
      {
        number: 19,
        title: "Вероятностно-геометрические и смешанные задачи (№17)",
        topic: "Смешанный геометрический формат",
        aspects: "Фигуры с дробями и долями; задачи на части площади, длины дуг; комбинирование нескольких формул; формат №17"
      },
      {
        number: 20,
        title: "Планиметрическая задача с развернутым ответом (№24)",
        topic: "Стандартная планиметрия уровня ОГЭ",
        aspects: "Структура решения: чертёж, «дано/доказать», ход рассуждений, вычисления; типовые сюжеты (подобие, Пифагор, окружность)"
      },
      {
        number: 21,
        title: "Стереометрические элементы (если входят в реальный КИМ)",
        topic: "Призма, пирамида, цилиндр (базово)",
        aspects: "Объём, площадь поверхности; простые конфигурации в задачах; связь с реальными объектами; отработка «объёмных» форматов"
      },
      {
        number: 22,
        title: "Текстовые задачи повышенного уровня (№18–19)",
        topic: "Задачи на проценты, движение, работу",
        aspects: "Многошаговые задачи с аккуратной формулировкой; табличные методы решения; проверка адекватности ответа; анализ логики задач №18–19"
      },
      {
        number: 23,
        title: "Алгебраическая задача с развернутым ответом (№23)",
        topic: "Уравнения/неравенства/функции",
        aspects: "Шаблоны для задачи №23 (квадратное уравнение, неравенство, простая функция или уравнение с параметром); оформление полного решения"
      },
      {
        number: 24,
        title: "Геометрическая задача на доказательство (№25)",
        topic: "Доказательная планиметрия",
        aspects: "Типовые приёмы доказательства (от противного, через подобие, через углы); структура письменного доказательства; анализ решений №25"
      },
      {
        number: 25,
        title: "Сборка варианта: первая часть",
        topic: "Отработка №1–19 под тайминг",
        aspects: "Решение полной первой части по «боевому» таймингу; стратегия пропуска и возврата; самопроверка по ключевым индикаторам"
      },
      {
        number: 26,
        title: "Сборка варианта: вторая часть",
        topic: "Отработка №20–25",
        aspects: "Решение «хвоста» варианта (развернутые ответы) с фокусом на оформлении; разбор критериев оценивания; типичные «сливы» баллов"
      },
      {
        number: 27,
        title: "Математический тренажёр №1",
        topic: "Полный тренировочный вариант ОГЭ",
        aspects: "Вариант целиком под экзаменационное время; сбор статистики по классу; индивидуальные комментарии по результатам"
      },
      {
        number: 28,
        title: "Разбор ошибок тренажёра №1",
        topic: "Аналитика и донастройка",
        aspects: "Классификация ошибок (техника, невнимательность, незнание, стратегия); построение личных чек-листов; доработка слабых тем"
      },
      {
        number: 29,
        title: "Математический тренажёр №2",
        topic: "Вариант с упором на сложные задачи",
        aspects: "Вариант с усиленным блоком задач №18–25; отработка психологии «сложно, но решаемо»; тренировка управления временем"
      },
      {
        number: 30,
        title: "Разбор ошибок тренажёра №2",
        topic: "Финтюнинг стратегии",
        aspects: "Разбор сложных задач и нетривиальных формулировок; отработка корректного оформления развернутых ответов; обновление чек-листы"
      },
      {
        number: 31,
        title: "Тематический микс «Алгебра + геометрия»",
        topic: "Смешанные кейсы",
        aspects: "Набор задач, где в одном варианте жёстко перемешаны алгебра, геометрия, текстовые задачи, статистика; тренировка переключения контекста"
      },
      {
        number: 32,
        title: "Финальный вариант ОГЭ",
        topic: "Генеральная репетиция",
        aspects: "Экзамен «под ключ»: режим, рассадка, тишина, время; полное моделирование; фиксация итогового уровня каждого ученика"
      },
      {
        number: 33,
        title: "Финальный разбор и персональные рекомендации",
        topic: "Индивидуальная стратегия",
        aspects: "Анализ последнего варианта; точечные рекомендации по каждой группе задач; корректировка тактики (что решать первым, что оставлять на конец)"
      },
      {
        number: 34,
        title: "Предэкзаменационный брифинг",
        topic: "Итоги подготовки и «боевой протокол»",
        aspects: "Повтор ключевых формул и алгоритмов; чек-лист в день экзамена; разбор типичных ловушек ОГЭ; ответы на организационные вопросы, настрой"
      }
    ]
  },
  {
    grade: 11,
    title: "Математика для 11 класса",
    description: "Комплексный курс математики для одиннадцатиклассников с подготовкой к ЕГЭ, изучением дифференциального исчисления, интегралов, сложных уравнений, стереометрии и комплексных экзаменационных задач.",
    lessons: [
      {
        number: 1,
        title: "Входной срез по алгебре и геометрии",
        topic: "Повторение 10 класса",
        aspects: "Проверка: функции и их графики, показательная/логарифмическая/тригонометрическая функции, уравнения и неравенства, стереометрия, объёмы и площади"
      },
      {
        number: 2,
        title: "Предел функции (интуитивно)",
        topic: "Предел и непрерывность",
        aspects: "Эмпирическое представление предела; «стремится к…»; левый/правый предел; непрерывность на отрезке; графическая интерпретация"
      },
      {
        number: 3,
        title: "Производная функции (определение)",
        topic: "Предел отношения приращений",
        aspects: "Определение производной; геометрический смысл (угол наклона касательной); физический смысл (мгновенная скорость); первые примеры"
      },
      {
        number: 4,
        title: "Таблица производных",
        topic: "Производные элементарных функций",
        aspects: "Производные степенной, показательной, логарифмической, тригонометрических функций (базовый набор); отработка на примерах"
      },
      {
        number: 5,
        title: "Правила дифференцирования",
        topic: "Сумма, произведение, частное, сложная функция",
        aspects: "Линейность; правило произведения и частного; производная сложной функции; типовые комбинации"
      },
      {
        number: 6,
        title: "Исследование функции с помощью производной (I)",
        topic: "Возрастание и убывание",
        aspects: "Связь знака производной и монотонности; нахождение критических точек; построение схемы изменения функции"
      },
      {
        number: 7,
        title: "Исследование функции с помощью производной (II)",
        topic: "Экстремумы и графики",
        aspects: "Локальные максимум и минимум; алгоритм поиска экстремумов; построение эскиза графика по производной"
      },
      {
        number: 8,
        title: "Наибольшее и наименьшее значение функции",
        topic: "Задачи на отрезке",
        aspects: "Поиск max/min на отрезке: критические точки и концы; прикладные задачи (оптимизация, экономика, геометрия)"
      },
      {
        number: 9,
        title: "Первообразная и неопределённый интеграл",
        topic: "Обратная операция к дифференцированию",
        aspects: "Определение первообразной; семейство функций; свойства неопределённого интеграла; связь с производной"
      },
      {
        number: 10,
        title: "Таблица интегралов и приёмы интегрирования",
        topic: "Простейшие неопределённые интегралы",
        aspects: "Таблица интегралов элементарных функций; интегрирование с заменой линейного аргумента; отработка на типовых задачах"
      },
      {
        number: 11,
        title: "Определённый интеграл и площадь",
        topic: "Интеграл как площадь под графиком",
        aspects: "Определение через предел сумм (на уровне идеи); геометрический смысл; простейшие задачи на площадь фигур под графиком"
      },
      {
        number: 12,
        title: "Показательные и логарифмические уравнения (углубление)",
        topic: "Сложные экспоненциальные/логарифмические уравнения",
        aspects: "Преобразование оснований; логарифмирование; применение свойств логарифмов; уравнения смешанного вида; задачи прикладного характера"
      },
      {
        number: 13,
        title: "Тригонометрические уравнения и неравенства",
        topic: "Полный цикл решений",
        aspects: "Базовые и приведённые уравнения; использование формул приведения, двойного угла; переход к тангенсу; неравенства с тригонометрией"
      },
      {
        number: 14,
        title: "Уравнения и неравенства с параметром (I)",
        topic: "Линейные и квадратные модели",
        aspects: "Анализ по параметру a (количество корней, положение графиков); рассмотрение случаев; графический подход"
      },
      {
        number: 15,
        title: "Уравнения и неравенства с параметром (II)",
        topic: "Функциональный и числовой подход",
        aspects: "Работа с областью значений функций; интервалами; рисование опорных графиков; разбор типовых ЕГЭ-задач с параметром"
      },
      {
        number: 16,
        title: "Обобщение алгебра-анализа (1-й модуль)",
        topic: "Контрольный практикум",
        aspects: "Систематизация: предел, производная, интеграл, сложные уравнения/неравенства, параметр; решение комплексных задач"
      },
      {
        number: 17,
        title: "Повтор ключевой геометрии и стереометрии",
        topic: "Базовые конструкции в пространстве",
        aspects: "Многогранники и тела вращения; взаимное расположение прямых и плоскостей; объёмы и площади; актуализация для профильных задач"
      },
      {
        number: 18,
        title: "Сечения многогранников",
        topic: "Плоские сечения",
        aspects: "Построение сечений в призме и пирамиде; алгоритм «по вершинам/рёбрам»; задачи на нахождение формы и размеров сечения"
      },
      {
        number: 19,
        title: "Углы и расстояния в пространстве",
        topic: "Пространственные углы",
        aspects: "Угол между прямыми, между прямой и плоскостью, между плоскостями; расстояние от точки до прямой/плоскости (на задачном уровне)"
      },
      {
        number: 20,
        title: "Координатный метод в стереометрии",
        topic: "Координаты в пространстве",
        aspects: "Выбор системы координат; координаты точек и векторов; расстояние между точками; применение координат к пространственным задачам"
      },
      {
        number: 21,
        title: "Векторы и скалярное произведение (углубление)",
        topic: "Векторная модель в геометрии",
        aspects: "Векторы в пространстве; скалярное произведение и корень из суммы квадратов; условие перпендикулярности; углы между векторами"
      },
      {
        number: 22,
        title: "Объёмы сложных тел",
        topic: "Комбинированные объёмы",
        aspects: "Сложение/вычитание объёмов; комбинации призмы, пирамиды, цилиндра, конуса, шара; прикладные задачи (резервуары, детали, строительство)"
      },
      {
        number: 23,
        title: "Площади поверхностей в стереометрии",
        topic: "Полная и боковая поверхность",
        aspects: "Формулы площадей поверхности стандартных тел; развёртки; задачи на расход материала, окраску, упаковку"
      },
      {
        number: 24,
        title: "Тригонометрия в геометрических задачах",
        topic: "Связка sin, cos, tg с геометрией",
        aspects: "Применение теорем синусов и косинусов; разбор задач на расстояния, высоты, наклоны; связь с векторной и координатной моделями"
      },
      {
        number: 25,
        title: "Комбинаторика: базовые конструкции",
        topic: "Перестановки, размещения, сочетания",
        aspects: "Правила сложения и умножения; Pₙ, Aₙᵏ, Cₙᵏ; типовые схемы «сколько способов…»; связка с задачами ЕГЭ"
      },
      {
        number: 26,
        title: "Вероятность и элементы статистики",
        topic: "События и их вероятности",
        aspects: "Классическое определение вероятности; формула Бернулли (на уровне задач); дискретные распределения; интерпретация статистических данных"
      },
      {
        number: 27,
        title: "Комплексные задачи ЕГЭ: алгебра и анализ (I)",
        topic: "Практикум по частям 1–2",
        aspects: "Номера 1–12 профильного уровня: быстрые техники; «маршруты решения»; управление временем; разбор типичных ловушек"
      },
      {
        number: 28,
        title: "Комплексные задачи ЕГЭ: алгебра и анализ (II)",
        topic: "Задачи повышенного уровня",
        aspects: "Номера 13, 15, 17: уравнения/неравенства, задачи с параметром, экономические задачи; отработка стандартных схем"
      },
      {
        number: 29,
        title: "Комплексные задачи ЕГЭ: геометрия",
        topic: "Геометрический блок",
        aspects: "Номера 14, 16, 19: планиметрия, стереометрия, доказательные задачи; структурирование решения, грамотное оформление"
      },
      {
        number: 30,
        title: "Полный вариант ЕГЭ (тренировочный)",
        topic: "Моделирование экзамена",
        aspects: "Решение варианта «под часы»; фиксация проблемных зон; анализ распределения времени; корректировка стратегии"
      },
      {
        number: 31,
        title: "Разбор типичных ошибок и «узких мест»",
        topic: "Ошибки, которые стоят баллов",
        aspects: "Классические ошибки в алгебре, анализе, тригонометрии, геометрии; чек-листы самопроверки; приёмы минимизации потерь баллов"
      },
      {
        number: 32,
        title: "Итоговое повторение: алгебра и анализ",
        topic: "Структурная «перезагрузка»",
        aspects: "Систематизация всех типов функций, уравнений, неравенств, задач с параметрами, производной и интегралом; финальный алгебраический практикум"
      },
      {
        number: 33,
        title: "Итоговое повторение: геометрия и стереометрия",
        topic: "Сквозной геометрический блок",
        aspects: "Повтор: планиметрия + стереометрия, векторы, координаты, тригонометрия; решение набора «смешанных» задач уровня ЕГЭ"
      },
      {
        number: 34,
        title: "Итоговый урок и предэкзаменационный брифинг",
        topic: "Финал курса и подготовка к ЕГЭ",
        aspects: "Обсуждение стратегии на экзамене; личные планы подготовки; краткий обзор ключевых формул и алгоритмов; рефлексия по всему школьному курсу математики"
      }
    ]
  },
  {
    grade: 10,
    title: "Математика для 10 класса",
    description: "Комплексный курс математики для десятиклассников с углубленным изучением функций, показательных и логарифмических уравнений, тригонометрии, векторной алгебры и стереометрии.",
    lessons: [
      {
        number: 1,
        title: "Входной срез по алгебре и геометрии",
        topic: "Повторение 9 класса",
        aspects: "Рациональные и иррациональные числа; квадратные уравнения и неравенства; функции и графики; подобие, окружность, треугольники; типичные экзаменационные форматы"
      },
      {
        number: 2,
        title: "Понятие функции. Способы задания",
        topic: "Функции и их графики",
        aspects: "Множество определения и множество значений; таблица, формула, график, описание словами; чтение и интерпретация графиков реальных процессов"
      },
      {
        number: 3,
        title: "Линейная и квадратичная функции: актуализация",
        topic: "Повтор и углубление",
        aspects: "Вид y = kx + b, y = ax² + bx + c; влияние параметров на график; вершина параболы; графическая интерпретация решений уравнений и неравенств"
      },
      {
        number: 4,
        title: "Степенная функция y = xⁿ",
        topic: "Степенные зависимости",
        aspects: "Функции с натуральным и рациональным показателем; чётная/нечётная степень; монотонность и симметрия; поведение при больших"
      },
      {
        number: 5,
        title: "Преобразования графиков функций",
        topic: "Сдвиги, растяжения, симметрии",
        aspects: "Вертикальный/горизонтальный сдвиг, растяжение и сжатие; отражение относительно осей; построение новых графиков на базе базовых функций"
      },
      {
        number: 6,
        title: "Показательная функция y = aˣ",
        topic: "Экспоненциальный рост и убывание",
        aspects: "Определение при a > 0, a ≠ 1; график при a > 1 и 0 < a < 1; задачи на рост/убыль; сравнение показательных функций"
      },
      {
        number: 7,
        title: "Логарифм и логарифмическая функция",
        topic: "Логарифмические зависимости",
        aspects: "Определение logₐb; основные свойства; логарифмическая функция, её график и область определения; взаимосвязь с показательной функцией"
      },
      {
        number: 8,
        title: "Показательные и логарифмические уравнения",
        topic: "Решение уравнений",
        aspects: "Приведение к общему основанию; логарифмирование; использование свойств логарифмов; типовые текстовые задачи (рост, вклады, половинный распад и т.п.)"
      },
      {
        number: 9,
        title: "Показательные и логарифмические неравенства",
        topic: "Интервальный подход",
        aspects: "Использование монотонности функций; перевод к линейным/квадратичным неравенствам; запись решения в виде интервалов"
      },
      {
        number: 10,
        title: "Числовые последовательности",
        topic: "Последовательности и их задание",
        aspects: "Задание формулой, рекуррентно, описанием; примеры числовых последовательностей из реальных задач; исследование простых последовательностей на рост/убыль"
      },
      {
        number: 11,
        title: "Предел последовательности (интуитивно)",
        topic: "Идея предела",
        aspects: "Эмпирическое понимание предела; примеры сходящихся и расходящихся последовательностей; связь с понятием «стремится к нулю/бесконечности»"
      },
      {
        number: 12,
        title: "Аритметическая прогрессия (углубление)",
        topic: "n-й член и сумма",
        aspects: "Формулы aₙ и Sₙ, вывод и применение; графическая интерпретация; задачи на планирование выплат, накоплений, шаговых процессов"
      },
      {
        number: 13,
        title: "Геометрическая прогрессия (углубление)",
        topic: "Мультипликативные модели",
        aspects: "Формулы bₙ и Sₙ; знак знаменателя; задачи на рост/убыль, процентные схемы, физические и финансовые модели"
      },
      {
        number: 14,
        title: "Тригонометрические функции угла",
        topic: "sin, cos, tg на числовой окружности",
        aspects: "Определение через единичную окружность; периодичность; чётность/нечётность; основные значения для углов 0°, 30°, 45°, 60°, 90°"
      },
      {
        number: 15,
        title: "Графики тригонометрических функций",
        topic: "y = sin x, y = cos x, y = tg x",
        aspects: "Построение базовых графиков; период, амплитуда, сдвиг; чтение графиков; прикладные интерпретации (колебания, волны, циклические процессы)"
      },
      {
        number: 16,
        title: "Тригонометрические тождества и простейшие уравнения",
        topic: "Базовые формулы",
        aspects: "sin²x + cos²x = 1, формулы тангенса, котангенса; приведение аргумента; решение простейших тригонометрических уравнений на отрезке и на ℝ"
      },
      {
        number: 17,
        title: "Повторение блока «Функции и уравнения»",
        topic: "Обобщение анализа",
        aspects: "Систематизация: степенные, показательные, логарифмические, тригонометрические функции; их графики; ключевые типы уравнений и неравенств; смешанные задачи"
      },
      {
        number: 18,
        title: "Введение в векторную геометрию",
        topic: "Векторы на плоскости и в пространстве",
        aspects: "Определение вектора; длина и направление; нулевой и противоположный вектор; равенство векторов; геометрическая интерпретация"
      },
      {
        number: 19,
        title: "Операции над векторами",
        topic: "Сложение, вычитание, умножение на число",
        aspects: "Правило треугольника и параллелограмма; координатная запись вектора; линейные комбинации векторов"
      },
      {
        number: 20,
        title: "Скалярное произведение векторов",
        topic: "Угол между векторами",
        aspects: "Определение скалярного произведения; формулы через координаты и через угол; перпендикулярность векторов; применение в задачах"
      },
      {
        number: 21,
        title: "Прямая в пространстве",
        topic: "Взаимное расположение прямых",
        aspects: "Параллельные, пересекающиеся и скрещивающиеся прямые; задание прямой в пространстве (словесная и чертёжная модель); простейшие задачи"
      },
      {
        number: 22,
        title: "Плоскость и её задание",
        topic: "Параллельность и пересечение",
        aspects: "Способы задания плоскости (тремя точками, прямой и точкой, двумя параллельными или пересекающимися прямыми); взаимное расположение прямой и плоскости"
      },
      {
        number: 23,
        title: "Параллельные и перпендикулярные прямые и плоскости",
        topic: "Систематизация взаимного расположения",
        aspects: "Условия параллельности и перпендикулярности; признак перпендикулярности прямой и плоскости; задачи на установление взаимного положения"
      },
      {
        number: 24,
        title: "Расстояния и углы в пространстве",
        topic: "Расстояние от точки до прямой и плоскости (на уровне задач)",
        aspects: "Понятие расстояния; проекция отрезка на плоскость; угол между прямыми, прямой и плоскостью, плоскостями (качественно и на простых конфигурациях)"
      },
      {
        number: 25,
        title: "Многогранники и тела вращения",
        topic: "Базовые пространственные фигуры",
        aspects: "Призма, пирамида, цилиндр, конус, шар; элементы (основание, боковые грани, высота); развёртки; примеры из реального мира"
      },
      {
        number: 26,
        title: "Объёмы многогранников",
        topic: "Объём призмы и пирамиды",
        aspects: "Формулы объёма прямой призмы и пирамиды; составные конструкции; задачи на объём, массу, плотность"
      },
      {
        number: 27,
        title: "Объёмы тел вращения",
        topic: "Объём цилиндра, конуса, шара",
        aspects: "Формулы объёма; соотношения между объёмами; практические задачи (баки, резервуары, детали)"
      },
      {
        number: 28,
        title: "Площади поверхностей многогранников и тел вращения",
        topic: "Площадь полной и боковой поверхности",
        aspects: "Формулы для призмы, пирамиды, цилиндра, конуса; площадь поверхности шара; задачи на расход материалов, упаковку, окраску"
      },
      {
        number: 29,
        title: "Координатный метод в стереометрии",
        topic: "Координаты в пространстве",
        aspects: "Прямоугольная система координат; координаты точки в пространстве; расстояние между точками; векторный подход к задачам стереометрии"
      },
      {
        number: 30,
        title: "Смешанные задачи по стереометрии",
        topic: "Геометрический практикум",
        aspects: "Комплексные задачи с использованием векторов, углов, расстояний, объёмов и площадей; построение чертежей и планирование решения"
      },
      {
        number: 31,
        title: "Смешанные задачи алгебра + геометрия",
        topic: "Связка моделей",
        aspects: "Задачи, где одновременно используются функции, уравнения, прогрессии, стереометрические конструкции; работа с реальными контекстами (физика, экономика, техника)"
      },
      {
        number: 32,
        title: "Повторение и реструктуризация курса (часть 1)",
        topic: "Анализ: функции, уравнения, последовательности",
        aspects: "Систематизация курса 10 класса по алгебре и началам анализа; типовые схемы решения; построение собственной «карты тем»"
      },
      {
        number: 33,
        title: "Повторение и реструктуризация курса (часть 2)",
        topic: "Геометрия и стереометрия",
        aspects: "Систематизация: вектора, скалярное произведение, прямая и плоскость, многогранники, объёмы и площади, координаты в пространстве; разобранный практикум"
      },
      {
        number: 34,
        title: "Итоговый урок-обзор",
        topic: "Подготовка к 11 классу",
        aspects: "Обсуждение «узких мест» класса; формирование списка опорных формул и методов; рекомендации по подготовке к профильному/базовому ЕГЭ; рефлексия по году"
      }
    ]
  },
  {
    grade: 9,
    title: "Математика для 9 класса",
    description: "Комплексный курс математики для девятиклассников с подготовкой к ОГЭ, изучением прогрессий, вероятности, статистики, тригонометрии в произвольном треугольнике, векторов и координатной геометрии.",
    lessons: [
      {
        number: 1,
        title: "Входная диагностика",
        topic: "Повторение курса 8 класса",
        aspects: "Контроль по квадратным уравнениям и функциям; действия с корнями; системы и неравенства; ключевые темы геометрии (подобие, Пифагор, окружность)"
      },
      {
        number: 2,
        title: "Числовые множества и действительные числа",
        topic: "N, Z, Q, R",
        aspects: "Иерархия числовых множеств; запись интервалов; числовая прямая; операции над действительными числами; оценка и округление"
      },
      {
        number: 3,
        title: "Степени и корни",
        topic: "Степени с рациональными показателями",
        aspects: "Повтор свойств степеней; a^m·a^n, (a^m)^n, a^0, a^-n; взаимосвязь степеней и корней; преобразование выражений с корнями"
      },
      {
        number: 4,
        title: "Рациональные выражения",
        topic: "Преобразования выражений",
        aspects: "Сокращение дробей с многочленами; выделение общего множителя; перенос формул в «рабочий» вид; ОДЗ для рациональных выражений (базово)"
      },
      {
        number: 5,
        title: "Функции: повтор и классификация",
        topic: "Линейная, квадратичная, обратная пропорциональность",
        aspects: "Виды функций и их графики; область определения и значений; рост/убывание; интерпретация графиков в задачах"
      },
      {
        number: 6,
        title: "Квадратные уравнения: обобщение",
        topic: "ax²+bx+c=0, a≠0",
        aspects: "Повтор формулы корней; дискриминант и количество корней; стандартные преобразования; разложение на множители через корни"
      },
      {
        number: 7,
        title: "Квадратные неравенства",
        topic: "ax²+bx+c>0, <0",
        aspects: "Связь с квадратным уравнением; анализ знака квадратичной функции; решение через параболу и «интервальный» метод; запись ответа интервалами"
      },
      {
        number: 8,
        title: "Системы уравнений",
        topic: "Линейные и смешанные системы",
        aspects: "Системы линейных уравнений; система «линейное + квадратное»; способы подстановки и сложения; графическое решение"
      },
      {
        number: 9,
        title: "Уравнения и неравенства с модулями",
        topic: "|x|",
        aspects: "Решение уравнений вида |ax+b|=c; неравенств |ax+b|>c и <c; геометрическая интерпретация; системы с модулями"
      },
      {
        number: 10,
        title: "Арифметическая прогрессия",
        topic: "Последовательности",
        aspects: "Определение прогрессии; формулы n-го члена и суммы n первых членов; построение по условию; задачи на «накопление» и «платежи»"
      },
      {
        number: 11,
        title: "Геометрическая прогрессия",
        topic: "Мультипликативный рост",
        aspects: "Определение; формулы n-го члена и суммы; задачи на рост/убыль в несколько раз; прикладные кейсы (проценты, вклады, рассрочки)"
      },
      {
        number: 12,
        title: "Задачи на прогрессии",
        topic: "Комплексные кейсы",
        aspects: "Моделирование ситуаций прогрессиями; совмещение арифметической и геометрической прогрессий; задачи повышенной сложности (олимпиадные элементы)"
      },
      {
        number: 13,
        title: "Элементы комбинаторики",
        topic: "Правила сложения и умножения",
        aspects: "Перебор вариантов; размещения без повторений (на уровне «сколько способов…»); простейшие задачи на выбор и перестановки"
      },
      {
        number: 14,
        title: "Вероятность",
        topic: "Элементарные события",
        aspects: "Классическое определение вероятности; благоприятные/возможные исходы; операции над событиями; задачи на игральные кости, монеты, лотереи"
      },
      {
        number: 15,
        title: "Статистика и данные",
        topic: "Описание выборки",
        aspects: "Ряд распределения; среднее, мода, медиана; диаграммы (столбчатые, круговые); чтение и построение; интерпретация реальных данных"
      },
      {
        number: 16,
        title: "Обобщение алгебры (часть 1)",
        topic: "Контрольный алгебраический блок",
        aspects: "Систематизация: действительные числа, степени и корни, рациональные выражения, квадратные уравнения/неравенства, прогрессии, вероятность и статистика"
      },
      {
        number: 17,
        title: "Старт по геометрии 9 класса",
        topic: "Повтор ключевых теорем",
        aspects: "Повтор: подобие треугольников, теорема Пифагора, окружность и вписанные углы; актуализация базовых приёмов доказательства"
      },
      {
        number: 18,
        title: "Треугольники: углубление",
        topic: "Дополнительные свойства",
        aspects: "Высоты, медианы, биссектрисы и их свойства; точки пересечения (ортцентр, медиана к гипотенузе и др. на базовом уровне); прикладные задачи"
      },
      {
        number: 19,
        title: "Окружность: хорды и дуги",
        topic: "Свойства хорд",
        aspects: "Свойства равных хорд и дуг; расстояние от центра до хорды; задачи на вычисление отрезков и углов в конфигурациях с окружностью"
      },
      {
        number: 20,
        title: "Вписанные углы и четырёхугольники",
        topic: "Окружность и многоугольники",
        aspects: "Вписанные и центральные углы; вписанные четырёхугольники, их свойства; задачи на углы и дуги"
      },
      {
        number: 21,
        title: "Касательная к окружности",
        topic: "Касательные и секущие",
        aspects: "Свойство касательной (перпендикуляр к радиусу); две касательные из одной точки; теорема о произведении отрезков секущих; задачи на длины"
      },
      {
        number: 22,
        title: "Длина окружности и площадь круга",
        topic: "Круг, сектор, сегмент",
        aspects: "Формулы длины окружности и площади круга; задачи с секторами и сегментами (на базовом уровне); прикладные кейсы (территории, колёса, детали)"
      },
      {
        number: 23,
        title: "Геометрические преобразования",
        topic: "Осевая и центральная симметрия, поворот, перенос",
        aspects: "Определения преобразований; свойства сохранения расстояний и углов; использование преобразований в доказательствах"
      },
      {
        number: 24,
        title: "Векторы на плоскости",
        topic: "Вектор как направленный отрезок",
        aspects: "Длина и направление; равенство и противоположность векторов; сложение и вычитание, умножение на число; параллельность векторов"
      },
      {
        number: 25,
        title: "Координаты и векторы",
        topic: "Координатный метод",
        aspects: "Координаты вектора; вычисление длины отрезка по координатам; середина отрезка; связь векторных и координатных методов"
      },
      {
        number: 26,
        title: "Уравнение прямой",
        topic: "Линейные уравнения в геометрии",
        aspects: "Уравнение прямой на плоскости (y = kx + b); угловой коэффициент и наклон; взаимное расположение прямых; расстояние между точками и прямыми (на базовом уровне)"
      },
      {
        number: 27,
        title: "Площадь и координаты",
        topic: "Геометрия на координатной плоскости",
        aspects: "Нахождение площади треугольника по координатам; проверка параллельности/перпендикулярности сторон; задачи на многоугольники в координатах"
      },
      {
        number: 28,
        title: "Тригонометрия в произвольном треугольнике",
        topic: "Теорема синусов и косинусов",
        aspects: "Формулировка и применение теорем синусов и косинусов; переход от прямоугольного треугольника к общему; задачи на стороны и углы"
      },
      {
        number: 29,
        title: "Прикладные задачи с тригонометрией",
        topic: "Практический блок",
        aspects: "Высоты объектов, расстояния, наклоны; задачи с использованием теоремы синусов/косинусов и координатного метода; проверка правдоподобности результата"
      },
      {
        number: 30,
        title: "Комплексные задачи по геометрии (формат ОГЭ)",
        topic: "Обобщающий геометрический практикум",
        aspects: "Смешанные задачи на окружность, подобие, координаты, тригонометрию; развитие стратегии решения задач 24-й/25-й линии ОГЭ"
      },
      {
        number: 31,
        title: "Комплексные задачи по алгебре (формат ОГЭ)",
        topic: "Обобщающий алгебраический практикум",
        aspects: "Уравнения и неравенства, функции и графики, прогрессии, проценты; тренировочные варианты; отработка типичных формулировок"
      },
      {
        number: 32,
        title: "Итоговое повторение: алгебра",
        topic: "Полная реструктуризация курса алгебры",
        aspects: "Сквозное повторение: действительные числа, выражения, уравнения/неравенства, функции, прогрессии, вероятность, статистика; типовые «ловушки» ОГЭ"
      },
      {
        number: 33,
        title: "Итоговое повторение: геометрия",
        topic: "Полная реструктуризация курса геометрии",
        aspects: "Сквозное повторение: треугольники, подобие, окружность, четырёхугольники, преобразования, координаты, векторы, тригонометрия; типовые задачи ОГЭ"
      },
      {
        number: 34,
        title: "Итоговый урок и экзаменационный разбор",
        topic: "Пробный ОГЭ и анализ",
        aspects: "Разбор пробного варианта; разбор типичных ошибок; рекомендации по стратегии работы на экзамене; фиксация готовности к итоговой аттестации"
      }
    ]
  },
  {
    grade: 8,
    title: "Математика для 8 класса",
    description: "Комплексный курс математики для восьмиклассников с изучением квадратных корней, квадратных уравнений, квадратичных функций, геометрии (подобие, теорема Пифагора, окружность) и комплексных задач.",
    lessons: [
      {
        number: 1,
        title: "Входная диагностика",
        topic: "Повторение курса 7 класса",
        aspects: "Контроль по действиям с многочленами, линейным уравнениям и функциям, пропорциональности; базовая геометрия (треугольники, параллельные прямые, четырёхугольники)"
      },
      {
        number: 2,
        title: "Квадрат числа и квадратный корень",
        topic: "Квадрат и арифметический корень",
        aspects: "Понятие квадрата числа; определение квадратного корня; запись √a; примеры извлечения корня из квадратов; геометрическая интерпретация"
      },
      {
        number: 3,
        title: "Свойства квадратных корней",
        topic: "Преобразование выражений с корнями",
        aspects: "Свойства √(ab), √(a²); переход от корня к степени 1/2 (на уровне понятия); вынесение множителя из-под корня; внесение под корень"
      },
      {
        number: 4,
        title: "Иррациональные числа",
        topic: "Множество действительных чисел",
        aspects: "Примеры иррациональных чисел; десятичные бесконечные не периодические дроби; числовая прямая; включение N, Z, Q, R"
      },
      {
        number: 5,
        title: "Квадратные уравнения (ввод)",
        topic: "Общее квадратное уравнение",
        aspects: "ax²+bx+c=0, a≠0; примеры; корни уравнения; формула дискриминанта; классификация по знаку D"
      },
      {
        number: 6,
        title: "Решение квадратных уравнений по формуле",
        topic: "Полные квадратные уравнения",
        aspects: "Алгоритм: нахождение D, вычисление корней; случаи D>0, D=0, D<0; проверка корней подстановкой; типовые ошибки"
      },
      {
        number: 7,
        title: "Неполные квадратные уравнения",
        topic: "ax²+bx=0, ax²+c=0",
        aspects: "Вынесение x за скобку; переход к линейному уравнению; решение уравнений вида x²=c; связь с квадратными корнями"
      },
      {
        number: 8,
        title: "Текстовые задачи на квадратные уравнения",
        topic: "Сведение задачи к уравнению",
        aspects: "Задачи на движение, работу, геометрию, проценты; выбор неизвестной; составление квадратного уравнения; анализ допустимости решений"
      },
      {
        number: 9,
        title: "Квадратичная функция (I)",
        topic: "y = ax² + bx + c",
        aspects: "Понятие квадратичной функции; график — парабола; направление ветвей (знак a); построение простейших парабол"
      },
      {
        number: 10,
        title: "Квадратичная функция (II)",
        topic: "Свойства параболы",
        aspects: "Вершина параболы; ось симметрии; нахождение вершины (на базовом уровне) и корней по графику; использование графика для решения уравнений и неравенств"
      },
      {
        number: 11,
        title: "Системы линейных уравнений (повтор/углубление)",
        topic: "ax+by=c, dx+ey=f",
        aspects: "Способы решения: подстановка, сложение, графический метод; интерпретация решения как точки пересечения прямых; типичные текстовые задачи"
      },
      {
        number: 12,
        title: "Линейные уравнения с параметром (базовый уровень)",
        topic: "Особые случаи систем",
        aspects: "Зависимость числа решений от параметра (k, b); случаи «нет решений» и «бесконечно много решений»; связь с параллельными и совпадающими прямыми"
      },
      {
        number: 13,
        title: "Линейные неравенства и их системы",
        topic: "ax + b > c и системы",
        aspects: "Решение линейных неравенств с одной переменной; запись ответа интервалами; системы неравенств; графическое представление на числовой прямой"
      },
      {
        number: 14,
        title: "Линейные неравенства с двумя переменными",
        topic: "Полуплоскости и области решений",
        aspects: "Неравенство вида ax+by>c; граница — прямая; полуплоскости; системы неравенств и область допустимых решений"
      },
      {
        number: 15,
        title: "Повторение алгебраического блока (1-я часть)",
        topic: "Обобщение и контроль",
        aspects: "Систематизация: квадратные корни, квадратные уравнения, квадратичная функция, линейные системы и неравенства; контрольный практикум"
      },
      {
        number: 16,
        title: "Геометрия 8 класса: старт",
        topic: "Повтор ключевых понятий",
        aspects: "Повтор: треугольники, параллельные прямые, четырёхугольники, площади; актуализация теорем и признаков, необходимых для подобия"
      },
      {
        number: 17,
        title: "Масштаб и подобие фигур",
        topic: "Подобные фигуры",
        aspects: "Понятие подобия; коэффициент подобия; масштаб на планах и картах; отношение периметров и площадей у подобных фигур (на уровне идей)"
      },
      {
        number: 18,
        title: "Подобные треугольники",
        topic: "Признаки подобия треугольников",
        aspects: "Три признака подобия; задачи на доказательство подобия; нахождение неизвестных сторон по коэффициенту подобия"
      },
      {
        number: 19,
        title: "Прямоугольный треугольник",
        topic: "Опорные свойства",
        aspects: "Классификация треугольников; выделение прямоугольных; элементы прямоугольного треугольника; связь с подобием"
      },
      {
        number: 20,
        title: "Теорема Пифагора",
        topic: "Квадрат гипотенузы",
        aspects: "Формулировка и доказательство (в рамках программы); применение для вычисления сторон; задачи прикладного характера"
      },
      {
        number: 21,
        title: "Обратная теорема Пифагора",
        topic: "Распознавание прямоугольного треугольника",
        aspects: "Проверка прямоугольности по соотношению сторон; задачи на построение и проверку треугольников"
      },
      {
        number: 22,
        title: "Высота к гипотенузе и проекции катетов",
        topic: "Отношения элементов прямоугольного треугольника",
        aspects: "Теоремы о высоте и проекциях; формулы для катетов и высоты; задачи на вычисление отрезков и сторон"
      },
      {
        number: 23,
        title: "Тригонометрические отношения в прямоугольном треугольнике",
        topic: "sin, cos, tg острого угла (ввод)",
        aspects: "Определения синуса, косинуса, тангенса острого угла; таблица значений для «стандартных» углов (30°, 45°, 60°); работа с отношениями"
      },
      {
        number: 24,
        title: "Решение прямоугольных треугольников",
        topic: "Применение тригонометрии",
        aspects: "Решение задач на нахождение сторон и углов; практические задачи (высота здания, расстояние, наклон); оценка правдоподобности ответа"
      },
      {
        number: 25,
        title: "Многоугольники и правильные многоугольники",
        topic: "Правильные n-угольники",
        aspects: "Понятие правильного многоугольника; центр, радиус описанной окружности; связь с окружностью; задачи на периметр и площадь (на базовом уровне)"
      },
      {
        number: 26,
        title: "Окружность и многоугольники",
        topic: "Вписанные и описанные многоугольники",
        aspects: "Окружность, вписанная в многоугольник, и описанная вокруг него; радиус, диаметр; простейшие задачи на связь сторон и радиуса"
      },
      {
        number: 27,
        title: "Вписанные и центральные углы",
        topic: "Теорема о вписанном угле",
        aspects: "Центральный и вписанный углы; дуги; теорема о вписанном угле и её следствия; вычисление углов по дугам и наоборот"
      },
      {
        number: 28,
        title: "Окружность и прямые",
        topic: "Касательная и секущая",
        aspects: "Определение касательной; свойство касательной (перпендикуляр к радиусу); задачи с касательными и секущими (уровень 8 класса)"
      },
      {
        number: 29,
        title: "Координатная геометрия (углубление)",
        topic: "Длина отрезка и середина отрезка",
        aspects: "Формулы расстояния между точками и координат середины; применение для проверки равенства отрезков и параллельности сторон"
      },
      {
        number: 30,
        title: "Геометрические места точек",
        topic: "Окружность как ГМТ",
        aspects: "Понятие геометрического места точек; окружность как множество точек, равноудалённых от центра; простейшие ГМТ (медиана, биссектриса на плоскости)"
      },
      {
        number: 31,
        title: "Комплексные задачи (алгебра + геометрия)",
        topic: "Связка моделей",
        aspects: "Задачи, сочетающие квадратные уравнения, функции, подобие и теорему Пифагора; работа с реальными контекстами (план, карта, технология)"
      },
      {
        number: 32,
        title: "Повторение курса 8 класса (алгебра)",
        topic: "Итоговое обобщение по алгебре",
        aspects: "Систематизация: квадратные корни, квадратные уравнения, квадратичная функция, системы и неравенства; контрольный блок"
      },
      {
        number: 33,
        title: "Повторение курса 8 класса (геометрия)",
        topic: "Итоговое обобщение по геометрии",
        aspects: "Подобие, прямоугольный треугольник, теорема Пифагора и её следствия, окружность, вписанные углы, координатная геометрия; практикум"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический «финал 8 класса»",
        aspects: "Командные турниры, блиц-задачи, мини-проекты («задача с параметром», «геометрический кейс»); фиксация готовности к 9 классу"
      }
    ]
  },
  {
    grade: 7,
    title: "Математика для 7 класса",
    description: "Комплексный курс математики для семиклассников с изучением алгебры (многочлены, уравнения, функции), геометрии (треугольники, четырехугольники, окружность) и комплексных задач.",
    lessons: [
      {
        number: 1,
        title: "Входная диагностика",
        topic: "Повторение курса 6 класса",
        aspects: "Срез по действиям с рациональными и десятичными дробями; процентовка; простые уравнения; базовая геометрия (углы, треугольники, площади)"
      },
      {
        number: 2,
        title: "Множества и числовые множества",
        topic: "N, Z, Q",
        aspects: "Понятие множества; запись числа; натуральные, целые, рациональные числа; принадлежность элементу множества; числовая прямая"
      },
      {
        number: 3,
        title: "Степени с целым показателем",
        topic: "Степень натурального и целого числа",
        aspects: "Повторение степени; свойства aⁿ·aᵐ, (aⁿ)ᵐ; знак степени при нечётном/чётном показателе; оценка и упрощение выражений"
      },
      {
        number: 4,
        title: "Одночлены",
        topic: "Одночлен, степень одночлена",
        aspects: "Структура одночлена (числовой коэффициент, буквенная часть, степень); стандартный вид; значение одночлена при подстановке"
      },
      {
        number: 5,
        title: "Операции над одночленами",
        topic: "Умножение, деление одночленов",
        aspects: "Умножение и деление одночленов; свойства степеней; сокращение дробей с одночленами; упрощение выражений"
      },
      {
        number: 6,
        title: "Многочлены",
        topic: "Многочлен, степень многочлена",
        aspects: "Сумма одночленов; подобные члены; стандартный вид многочлена; значение многочлена при подстановке"
      },
      {
        number: 7,
        title: "Сложение и вычитание многочленов",
        topic: "Приведение подобных членов",
        aspects: "Сумма и разность многочленов; приведение подобных; группировка; типовые алгебраические выражения"
      },
      {
        number: 8,
        title: "Умножение одночлена на многочлен",
        topic: "Распределительный закон",
        aspects: "Формула a(b+c+…); вынесение общего множителя за скобки; простейшие преобразования выражений"
      },
      {
        number: 9,
        title: "Умножение многочлена на многочлен",
        topic: "Формулы вида (a+b)(c+d)",
        aspects: "Перемножение «по членам»; квадрат суммы и разности; разность квадратов; типовые шаблоны (формулы сокращённого умножения)"
      },
      {
        number: 10,
        title: "Разложение многочлена на множители (I)",
        topic: "Вынесение общего множителя",
        aspects: "Вынесение одночлена; группировка; проверка разложения обратным действием (раскрытием скобок)"
      },
      {
        number: 11,
        title: "Разложение многочлена на множители (II)",
        topic: "Формулы сокращённого умножения",
        aspects: "Обратное применение (a±b)² и a²–b²; подбор представления под «формулу»; упрощение выражений и дробей"
      },
      {
        number: 12,
        title: "Линейные уравнения с одной переменной",
        topic: "ax + b = c",
        aspects: "Пошаговое решение; перенос слагаемых; деление на коэффициент; проверка; задачи на составление уравнений"
      },
      {
        number: 13,
        title: "Линейные уравнения с дробями и скобками",
        topic: "Усложнённые уравнения",
        aspects: "Умножение на общий знаменатель; раскрытие скобок; приведение подобных; контроль ОДЗ (в простом виде)"
      },
      {
        number: 14,
        title: "Текстовые задачи на линейные уравнения",
        topic: "Перевод текста в модель",
        aspects: "Задачи на движение, работу, смесь, процент; составление уравнения; проверка адекватности ответа"
      },
      {
        number: 15,
        title: "Линейные функции",
        topic: "y = kx + b",
        aspects: "График линейной функции; коэффициенты k и b (наклон и сдвиг); построение по двум точкам; связь графика и формулы"
      },
      {
        number: 16,
        title: "Прямая пропорциональность",
        topic: "y = kx",
        aspects: "Свойства прямой пропорциональности; график через начало координат; практические задачи (цена–количество, скорость–время)"
      },
      {
        number: 17,
        title: "Обратная пропорциональность (ввод)",
        topic: "y = k/x",
        aspects: "Характер графика (ветви гиперболы); обратная зависимость; простейшие задачи (скорость–время при фиксированном пути и др.)"
      },
      {
        number: 18,
        title: "Итог по алгебре (1-я часть)",
        topic: "Обобщение тем 1 полугодия",
        aspects: "Одночлены, многочлены, формулы сокращённого умножения, линейные уравнения, линейные функции и пропорциональность; контрольный практикум"
      },
      {
        number: 19,
        title: "Базовые геометрические понятия",
        topic: "Точка, прямая, отрезок, луч, угол",
        aspects: "Обозначения; измерение отрезков; измерение и построение углов; виды углов; повтор аксиом и свойств из 6 класса"
      },
      {
        number: 20,
        title: "Треугольник и его элементы",
        topic: "Стороны, углы, высоты, медианы, биссектрисы",
        aspects: "Определения элементов треугольника; построения; задачи на нахождение отрезков и углов в треугольнике"
      },
      {
        number: 21,
        title: "Равенство треугольников",
        topic: "Признаки равенства",
        aspects: "Три стороны (SSS), сторона и два прилежащих угла (SАА), две стороны и угол между ними (SAS); решение задач на доказательство равенства треугольников"
      },
      {
        number: 22,
        title: "Равнобедренный и равносторонний треугольник",
        topic: "Свойства и признаки",
        aspects: "Свойства углов при основании; медиана, биссектриса и высота из вершины в равнобедренном треугольнике; задачи на вычисления и доказательства"
      },
      {
        number: 23,
        title: "Параллельные прямые",
        topic: "Углы при пересечении секущей",
        aspects: "Вертикальные и смежные углы; соответственные, односторонние, накрестлежащие углы; признаки параллельности прямых; задачи на доказательство параллельности"
      },
      {
        number: 24,
        title: "Сумма углов треугольника",
        topic: "Теорема о сумме углов",
        aspects: "Сумма углов треугольника 180°; внешний угол треугольника; задачи на вычисление углов, в том числе в системах треугольников"
      },
      {
        number: 25,
        title: "Четырёхугольники",
        topic: "Параллелограмм и его свойства",
        aspects: "Свойства параллелограмма (параллельность сторон, равенство сторон и углов, диагонали); признаки параллелограмма; задачи на доказательство и вычисление"
      },
      {
        number: 26,
        title: "Прямоугольник, ромб, квадрат",
        topic: "Частные случаи параллелограмма",
        aspects: "Свойства прямоугольника, ромба, квадрата; взаимосвязь этих фигур; задачи «узнай фигуру по свойствам»"
      },
      {
        number: 27,
        title: "Площади многоугольников",
        topic: "Повтор и расширение",
        aspects: "Площадь прямоугольника, треугольника, параллелограмма; разбиение фигур; практические задачи на план местности, комнаты и т.д."
      },
      {
        number: 28,
        title: "Окружность и круг",
        topic: "Элементы и свойства",
        aspects: "Центр, радиус, диаметр, хорда, дуга; взаимное расположение окружностей и прямых (пересекаются, касаются, не пересекаются); задачи на построение и вычисления"
      },
      {
        number: 29,
        title: "Координатная плоскость и геометрия",
        topic: "Геометрия на координатах",
        aspects: "Расположение точек на координатной плоскости; нахождение длины отрезков, параллельных осям; периметр простых фигур по координатам вершин"
      },
      {
        number: 30,
        title: "Комбинированные задачи по геометрии",
        topic: "Смешанные геометрические конструкции",
        aspects: "Комплексные задачи с треугольниками, параллельными прямыми и четырёхугольниками; связка «чертёж → рассуждения → вычисления»"
      },
      {
        number: 31,
        title: "Смешанные алгебраико-геометрические задачи",
        topic: "Модель + график + чертёж",
        aspects: "Задачи, где требуется использовать и уравнения, и графики, и геометрические свойства; работа с реальными контекстами (скорость, план, координаты)"
      },
      {
        number: 32,
        title: "Повторение курса 7 класса (алгебра)",
        topic: "Итоговое обобщение по алгебре",
        aspects: "Систематизация: многочлены и их преобразования, линейные уравнения и функции, прямая/обратная пропорциональность; контрольный блок"
      },
      {
        number: 33,
        title: "Повторение курса 7 класса (геометрия)",
        topic: "Итоговое обобщение по геометрии",
        aspects: "Треугольники и их равенство, параллельные прямые, четырёхугольники, площади, окружность, координаты; комплексный практикум"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический «финиш 7 класса»",
        aspects: "Командные турниры по задачам, блиц-вопросы, защита мини-проектов («своя задача с решением»); обсуждение готовности к алгебре и геометрии 8 класса"
      }
    ]
  },
  {
    grade: 6,
    title: "Математика для 6 класса",
    description: "Комплексный курс математики для шестиклассников с изучением рациональных чисел, алгебры, геометрии, пропорций, процентов и комплексных задач.",
    lessons: [
      {
        number: 1,
        title: "Входная диагностика",
        topic: "Повторение курса 5 класса",
        aspects: "Срез по действиям с натуральными и десятичными дробями; обыкновенные дроби; проценты; периметр и площадь; типовые текстовые задачи"
      },
      {
        number: 2,
        title: "Рациональные числа: ввод",
        topic: "Положительные и отрицательные числа",
        aspects: "Температура, высота над/ниже уровня моря, прибыль/убыток; запись со знаком «+» и «–»; часть/целое на числовой прямой"
      },
      {
        number: 3,
        title: "Координатная прямая",
        topic: "Моделирование рациональных чисел",
        aspects: "Числовая прямой; координата точки; сравнение чисел по расположению; модуль числа (расстояние до нуля)"
      },
      {
        number: 4,
        title: "Сложение и вычитание чисел с разными знаками",
        topic: "Арифметика рациональных чисел (I)",
        aspects: "Правила сложения чисел с одинаковыми и разными знаками; геометрическая интерпретация на прямой; примеры из задач"
      },
      {
        number: 5,
        title: "Умножение и деление рациональных чисел",
        topic: "Арифметика рациональных чисел (II)",
        aspects: "Правила знаков при умножении и делении; произведение и частное с нулём; задачи на изменение величин («в несколько раз»)"
      },
      {
        number: 6,
        title: "Возведение в степень с целым показателем",
        topic: "Степени и знаки",
        aspects: "Степень с целым показателем; знак степени при нечётном/чётном показателе; типовые вычисления со степенями"
      },
      {
        number: 7,
        title: "Рациональные числа: обобщение",
        topic: "Контрольный микс по рациональным числам",
        aspects: "Смешанные примеры на все действия; участие модуля; простейшие выражения со степенями; проверка оценкой результата"
      },
      {
        number: 8,
        title: "Дроби и рациональные числа",
        topic: "Связь дробей и целых",
        aspects: "Повторение: основные свойства дробей; запись дроби с минусом; преобразование дробей в рациональные числа и обратно"
      },
      {
        number: 9,
        title: "Сравнение рациональных чисел",
        topic: "Порядок на числовой прямой",
        aspects: "Сравнение по модулю и знаку; упорядочивание набора чисел; промежуточные значения; задачи с ограничениями вида «x > –3»"
      },
      {
        number: 10,
        title: "Алгебраические выражения",
        topic: "Буквенная запись",
        aspects: "Переменная, числовой коэффициент; буквенное выражение; подстановка значения переменной; область допустимых значений (на уровне здравого смысла)"
      },
      {
        number: 11,
        title: "Формулы и вычисления по формулам",
        topic: "Формулы из реальных задач",
        aspects: "Подстановка в формулы (путь, стоимость, площадь и т.п.); преобразование формул вида a·b, a/b; контроль размерности"
      },
      {
        number: 12,
        title: "Упрощение выражений",
        topic: "Приведение подобных членов",
        aspects: "Суммы и разности одночленных; приведение подобных членов; группировка; работа с коэффициентами и знаками"
      },
      {
        number: 13,
        title: "Уравнения с одной переменной (I)",
        topic: "Линейные уравнения простейшего вида",
        aspects: "Решение уравнений вида ax+b=c; понятие решения; проверка подстановкой; равносильные преобразования"
      },
      {
        number: 14,
        title: "Уравнения с одной переменной (II)",
        topic: "Уравнения с обеими частями «живыми»",
        aspects: "Перенос слагаемых из одной части в другую; раскрытие скобок; сокращение коэффициентов; задачи на составление уравнений"
      },
      {
        number: 15,
        title: "Неравенства",
        topic: "Числовые неравенства",
        aspects: "Знаки «>», «<», «≥», «≤»; решения простых неравенств вида ax+b>c; изображение решений на числовой прямой; связь с задачами"
      },
      {
        number: 16,
        title: "Отношения и пропорции",
        topic: "Отношение, пропорция, масштаб",
        aspects: "Определение отношения; запись дробью и через «:»; основное свойство пропорции; задачи на масштаб, скоростные и ценовые зависимости"
      },
      {
        number: 17,
        title: "Проценты (углубление)",
        topic: "Операции с процентами",
        aspects: "Нахождение процента от числа; числа по проценту; процентные изменения (увеличение/уменьшение на p%); практические задачи (скидки, налоги)"
      },
      {
        number: 18,
        title: "Повторение блока «Алгебра 6 класса (1-я часть)»",
        topic: "Обобщение алгебраического материала",
        aspects: "Систематизация: рациональные числа, выражения, уравнения, неравенства, пропорции, проценты; контрольная/практикум"
      },
      {
        number: 19,
        title: "Геометрия: базовые понятия",
        topic: "Точка, прямая, луч, отрезок, угол",
        aspects: "Геометрические объекты и их обозначения; измерение отрезков; виды углов; построения с линейкой и транспортиром"
      },
      {
        number: 20,
        title: "Треугольники и их классификация",
        topic: "Виды треугольников",
        aspects: "Классификация по сторонам и углам; элементы треугольника: вершины, стороны, высоты, медианы; построения по условиям (в пределах программы)"
      },
      {
        number: 21,
        title: "Свойства треугольников",
        topic: "Равнобедренный и равносторонний треугольник",
        aspects: "Свойства сторон и углов; признаки равнобедренного треугольника; задачи на вычисление углов и сторон"
      },
      {
        number: 22,
        title: "Параллельные прямые",
        topic: "Аксиома параллельных прямых",
        aspects: "Определение параллельных прямых; углы при пересечении прямых секущей; соответственные, односторонние, накрестлежащие углы (без жёстких доказательств)"
      },
      {
        number: 23,
        title: "Четырёхугольники",
        topic: "Параллелограмм, прямоугольник, ромб, квадрат",
        aspects: "Свойства сторон и углов; диагонали; взаимосвязь фигур (квадрат как частный случай прямоугольника и ромба); схемы и классификация"
      },
      {
        number: 24,
        title: "Площадь многоугольников",
        topic: "Площадь прямоугольника, квадрата, параллелограмма, треугольника",
        aspects: "Вывод и применение формул; разбиение фигуры на части; практические задачи на площади участков и помещений"
      },
      {
        number: 25,
        title: "Окружность и круг",
        topic: "Элементы окружности",
        aspects: "Центр, радиус, диаметр, хорда; длина окружности (на уровне формулы без вывода); связь длины и радиуса; задачи на практический расчёт"
      },
      {
        number: 26,
        title: "Геометрические преобразования (наглядно)",
        topic: "Симметрия и поворот",
        aspects: "Осевая симметрия; симметричные точки и фигуры; поворот на 90°, 180° на координатной сетке; простейшие задачи"
      },
      {
        number: 27,
        title: "Координатная плоскость",
        topic: "Декартова система координат",
        aspects: "Оси Ox и Oy, начало координат; координаты точки (x; y); нахождение точки по координатам; расстояние по горизонтали и вертикали"
      },
      {
        number: 28,
        title: "Практические задачи с координатами и геометрией",
        topic: "Геометрия на координатной сетке",
        aspects: "Перемещение точек; прямоугольники и треугольники на координатной плоскости; нахождение периметра и площади по координатам"
      },
      {
        number: 29,
        title: "Комплексные текстовые задачи (I)",
        topic: "Многошаговые задачи",
        aspects: "Задачи, объединяющие алгебру и геометрию (проценты, пропорции, скорость, площадь); составление модели (схема, таблица, выражение)"
      },
      {
        number: 30,
        title: "Комплексные текстовые задачи (II)",
        topic: "Анализ и оптимизация решений",
        aspects: "Разбор разных способов решения одной задачи; выбор более рационального способа; проверка и оценка результата"
      },
      {
        number: 31,
        title: "Повторение курса 6 класса (алгебра)",
        topic: "Итоговое обобщение по алгебре",
        aspects: "Структурированное повторение: рациональные числа, алгебраические выражения, уравнения/неравенства, пропорции, проценты; контрольный блок"
      },
      {
        number: 32,
        title: "Повторение курса 6 класса (геометрия)",
        topic: "Итоговое обобщение по геометрии",
        aspects: "Базовые фигуры, треугольники, параллельные прямые, четырёхугольники, площадь фигур, окружность, координатная плоскость; практикум"
      },
      {
        number: 33,
        title: "Итоговый комплексный зачёт",
        topic: "Смешанная работа",
        aspects: "Смешанные задания по всему курсу (алгебра + геометрия); анализ типичных ошибок; корректировка"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический хакатон 6 класса",
        aspects: "Командные кейсы, блиц-задачи, работа с реальными контекстами (деньги, карты, планы помещений); фиксация результатов и обсуждение перехода в 7 класс"
      }
    ]
  },
  {
    grade: 5,
    title: "Математика для 5 класса",
    description: "Комплексный курс математики для пятиклассников с изучением натуральных чисел до миллиардов, дробей, десятичных дробей, геометрии и решения комплексных задач.",
    lessons: [
      {
        number: 1,
        title: "Входная диагностика",
        topic: "Повторение математики начальной школы",
        aspects: "Быстрый срез: действия с натуральными числами, таблица умножения, простые дроби, периметр/площадь; правила работы; фиксация «зон роста» класса"
      },
      {
        number: 2,
        title: "Натуральные числа и числовой луч",
        topic: "Натуральный ряд, числа до миллиардов",
        aspects: "Запись и чтение многозначных чисел; классы и разряды; числовой луч; сравнение и упорядочивание чисел"
      },
      {
        number: 3,
        title: "Округление и оценка результата",
        topic: "Округление натуральных чисел",
        aspects: "Округление до десятков, сотен, тысяч; оценка результата до вычислений; проверка адекватности ответа по порядку величины"
      },
      {
        number: 4,
        title: "Сложение и вычитание многозначных чисел",
        topic: "Письменные приёмы",
        aspects: "Сложение/вычитание в столбик с несколькими переходами через разряд; контроль записи; проверка обратным действием"
      },
      {
        number: 5,
        title: "Умножение и деление многозначных чисел",
        topic: "Устные и письменные приёмы",
        aspects: "Умножение и деление на 10, 100, 1000; письменное умножение на однозначное и двузначное; деление столбиком (без сложных частных)"
      },
      {
        number: 6,
        title: "Числовые выражения",
        topic: "Порядок выполнения действий",
        aspects: "Скобки, приоритет умножения/деления; составление выражений по тексту; группировка действий; минимальная проверка результата"
      },
      {
        number: 7,
        title: "Степени натуральных чисел",
        topic: "Понятие степени",
        aspects: "Краткая запись повторяющегося умножения; чтение записи aⁿ; простейшие свойства (a¹, a², a³, 10ⁿ); применимость для оценок"
      },
      {
        number: 8,
        title: "Делимость чисел",
        topic: "Делимость на 2, 3, 5, 9, 10",
        aspects: "Признаки делимости; проверка чисел; поиск «удобных» делителей; применение при проверке ответов и упрощении вычислений"
      },
      {
        number: 9,
        title: "Делители и кратные",
        topic: "Структура натурального числа",
        aspects: "Понятие делителя и кратного; нахождение всех делителей числа в пределах программы; задачи на «кратно/некратно»"
      },
      {
        number: 10,
        title: "Простые и составные числа",
        topic: "Разложение на множители",
        aspects: "Отличия простых и составных чисел; разложение числа на простые множители; практические кейсы (упрощение дробей, НОК/НОД)"
      },
      {
        number: 11,
        title: "Наименьшее общее кратное и наибольший общий делитель",
        topic: "НОК и НОД",
        aspects: "Методы нахождения НОК и НОД через разложение на простые множители; задачи на «повторяющиеся события», «совместные циклы»"
      },
      {
        number: 12,
        title: "Вход в тему дробей",
        topic: "Обыкновенные дроби как часть целого",
        aspects: "Числитель и знаменатель; дробь как часть фигуры и множества; модель на отрезках и кругах; чтение и запись простых дробей"
      },
      {
        number: 13,
        title: "Сравнение дробей (базовый уровень)",
        topic: "Сравнение дробей с одинаковыми знаменателями/числителями",
        aspects: "Сравнение по числителю при одинаковом знаменателе, по знаменателю при одинаковом числителе; визуальные модели"
      },
      {
        number: 14,
        title: "Равные дроби и сокращение",
        topic: "Эквивалентные дроби",
        aspects: "Увеличение/уменьшение числителя и знаменателя на один и тот же множитель; сокращение дробей; связь с делимостью"
      },
      {
        number: 15,
        title: "Сложение и вычитание дробей с одинаковыми знаменателями",
        topic: "Действия с дробями (I уровень)",
        aspects: "Правило сложения/вычитания дробей; привязка к наглядности (отрезки, круги); практические задачи «часть пути/работы»"
      },
      {
        number: 16,
        title: "Приведение дробей к общему знаменателю",
        topic: "Подготовка к операциям",
        aspects: "Поиск общего знаменателя (через НОК); приведение дробей; упрощение результата; типичные ошибки"
      },
      {
        number: 17,
        title: "Сложение и вычитание дробей с разными знаменателями",
        topic: "Действия с дробями (II уровень)",
        aspects: "Алгоритм: НОК → приведение → действие; сокращение результата; текстовые задачи с дробями"
      },
      {
        number: 18,
        title: "Неправильные дроби и смешанные числа",
        topic: "Связь форм записи",
        aspects: "Переход от неправильной дроби к смешанному числу и обратно; сравнение смешанных чисел; задачи «целое и часть»"
      },
      {
        number: 19,
        title: "Десятичные дроби",
        topic: "Десятичная запись числа",
        aspects: "Связь десятичных и обыкновенных дробей вида 1/10, 1/100; чтение и запись десятичных дробей; положение запятой"
      },
      {
        number: 20,
        title: "Сравнение и округление десятичных дробей",
        topic: "Работа с десятичной записью",
        aspects: "Сравнение по разрядам после запятой; округление до десятых, сотых; оценка результата в прикладных задачах"
      },
      {
        number: 21,
        title: "Сложение и вычитание десятичных дробей",
        topic: "Действия с десятичными дробями (I)",
        aspects: "Выравнивание по запятой; сложение и вычитание в столбик; связь с округлением и оценкой; задачи на длину, массу, цену"
      },
      {
        number: 22,
        title: "Умножение десятичных дробей",
        topic: "Действия с десятичными дробями (II)",
        aspects: "Умножение на 10, 100, 1000; умножение десятичной дроби на натуральное число; подсчёт знаков после запятой"
      },
      {
        number: 23,
        title: "Деление десятичных дробей",
        topic: "Действия с десятичными дробями (III)",
        aspects: "Деление на 10, 100, 1000; деление десятичной дроби на натуральное число; перенос запятой; задачи на скорость, цену, норму"
      },
      {
        number: 24,
        title: "Отношения и пропорции (базовый вход)",
        topic: "Отношения, доли, масштаб",
        aspects: "Отношение как «во сколько раз» и «какая часть»; запись отношения a : b; простейшие пропорциональные задачи; масштаб карты/плана"
      },
      {
        number: 25,
        title: "Проценты (ознакомительно)",
        topic: "Процент как сотая часть",
        aspects: "1% как 1/100; представление процентов через дроби и десятичные дроби; простейшие задачи «скидка/надбавка» (без сложных формул)"
      },
      {
        number: 26,
        title: "Геометрические базовые объекты",
        topic: "Точка, прямая, луч, отрезок, угол",
        aspects: "Обозначения; измерение отрезков; измерение и построение углов транспортиром; виды углов (острый, прямой, тупой)"
      },
      {
        number: 27,
        title: "Треугольники и их виды",
        topic: "Классификация треугольников",
        aspects: "Треугольники по сторонам и углам; сумма углов треугольника (наглядно); построение треугольников по заданным элементам (в рамках программы)"
      },
      {
        number: 28,
        title: "Четырёхугольники и параллелограмм",
        topic: "Прямоугольник, квадрат, ромб, параллелограмм",
        aspects: "Свойства сторон и углов; параллельные стороны; диагонали (наглядно); классификация фигур по признакам"
      },
      {
        number: 29,
        title: "Периметр и площадь фигур",
        topic: "Периметр и площадь прямоугольника/квадрата",
        aspects: "Формулы P и S; единицы площади; задачи на нахождение сторон по площади и периметру; практические кейсы (комната, участок)"
      },
      {
        number: 30,
        title: "Площадь сложных фигур",
        topic: "Составные многоугольники",
        aspects: "Разбиение сложной фигуры на прямоугольники; нахождение общей площади; практические задачи на план помещения/участка"
      },
      {
        number: 31,
        title: "Объём (ознакомительно)",
        topic: "Куб и прямоугольный параллелепипед",
        aspects: "Понятие объёма; единицы объёма (куб. см, куб. дм, куб. м – наглядно); счёт единичных кубиков; простейшие задачи"
      },
      {
        number: 32,
        title: "Комплексные текстовые задачи",
        topic: "Задачи в 2–3 действия",
        aspects: "Микс задач на дроби, десятичные дроби, скорость/время/расстояние, цену/количество/стоимость; построение плана решения; проверка по условию"
      },
      {
        number: 33,
        title: "Итоговое повторение ключевых блоков",
        topic: "Обобщение курса 5 класса",
        aspects: "Структурированное повторение: натуральные числа и действия, делимость, дроби и десятичные дроби, геометрия; контрольный практикум"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический «финал сезона»",
        aspects: "Командные соревнования по устному счёту, задачам, геометрическим заданиям; мини-проекты «придумай свою задачу»; подведение итогов года"
      }
    ]
  },
  {
    grade: 4,
    title: "Математика для 4 класса",
    description: "Комплексный курс математики для четвероклассников с изучением многозначных чисел до миллиона, дробей, геометрии, решения сложных задач и развития логического мышления.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит знаний",
        topic: "Повторение курса 3 класса",
        aspects: "Устный счёт; таблица умножения; действия с числами до 10 000; периметр и площадь; типовые текстовые задачи"
      },
      {
        number: 2,
        title: "Числа до 1 000 000",
        topic: "Многозначные числа",
        aspects: "Запись и чтение чисел до миллиона; разрядный состав (класс единиц, тысяч); запись в виде суммы разрядных слагаемых"
      },
      {
        number: 3,
        title: "Позиционная система и округление",
        topic: "Разряды, классы, округление",
        aspects: "Таблицы разрядов; сравнение многозначных чисел; округление до десятков, сотен, тысяч; оценка результата"
      },
      {
        number: 4,
        title: "Сложение многозначных чисел",
        topic: "Письменный приём сложения",
        aspects: "Сложение в столбик, в том числе с несколькими переходами через разряд; контроль записи; проверка действием вычитания"
      },
      {
        number: 5,
        title: "Вычитание многозначных чисел",
        topic: "Письменный приём вычитания",
        aspects: "Вычитание в столбик; «занимание» из старших разрядов; проверка действием сложения; типовые ошибки"
      },
      {
        number: 6,
        title: "Контрольный блок по сложению/вычитанию",
        topic: "Обобщение вычислительных приёмов",
        aspects: "Смешанные примеры; оценка результата до вычислений; поиск «лишнего» или неверного примера; самопроверка"
      },
      {
        number: 7,
        title: "Умножение многозначного числа на однозначное",
        topic: "Письменный алгоритм умножения",
        aspects: "Умножение по разрядам; перенос десятков; проверка по приблизительной оценке; связь с устным умножением"
      },
      {
        number: 8,
        title: "Деление многозначного числа на однозначное",
        topic: "Письменный алгоритм деления",
        aspects: "Деление по разрядам; деление с остатком; проверка деления умножением; смысл частного и остатка в задачах"
      },
      {
        number: 9,
        title: "Умножение на двузначное число (I)",
        topic: "Многозначное × двузначное",
        aspects: "Схема умножения «по частям»; запись в столбик; интерпретация результата; связь с распределительным свойством"
      },
      {
        number: 10,
        title: "Умножение на двузначное число (II)",
        topic: "Отработка алгоритма",
        aspects: "Закрепление письменного приёма; типичные ошибки; проверка результата приблизительной оценкой"
      },
      {
        number: 11,
        title: "Деление на двузначное число (наглядно)",
        topic: "Деление на сложный делитель",
        aspects: "Подбор частного; деление с остатком; связь с умножением и округлением; практические задачи"
      },
      {
        number: 12,
        title: "Порядок выполнения действий",
        topic: "Выражения с несколькими действиями",
        aspects: "Скобки; порядок: сначала умножение/деление, потом сложение/вычитание; составление выражений по тексту"
      },
      {
        number: 13,
        title: "Выражения и уравнения",
        topic: "Составление и решение",
        aspects: "Нахождение неизвестного компонента (слагаемого, множителя, делимого); простейшие уравнения; проверка решения"
      },
      {
        number: 14,
        title: "Составные задачи в 2–3 действия",
        topic: "Стратегия решения задач",
        aspects: "Анализ текста; выделение главных данных; построение плана решения; запись компактного выражения и решения столбиком"
      },
      {
        number: 15,
        title: "Задачи на движение",
        topic: "Скорость, время, расстояние",
        aspects: "Формула S = v·t (в простейшем виде); нахождение одного из трёх величин; задачи на встречное и противоположное движение (наглядно)"
      },
      {
        number: 16,
        title: "Задачи на работу и производительность",
        topic: "«Сколько сделают за…»",
        aspects: "Связь «объём работы – производительность – время» на бытовых примерах; таблицы; выбор действия"
      },
      {
        number: 17,
        title: "Задачи на цену, количество, стоимость",
        topic: "Прямая пропорциональность",
        aspects: "Формулы «цена × количество = стоимость»; нахождение любой из трёх величин; задачи с несколькими покупками"
      },
      {
        number: 18,
        title: "Делители и кратные",
        topic: "Делиться и быть кратным",
        aspects: "Понятия делителя и кратного; поиск делителей числа; признаки делимости на 2, 5, 10 (наглядно – 3, 9 по возможности программы)"
      },
      {
        number: 19,
        title: "Простые и составные числа",
        topic: "Разложение на множители",
        aspects: "Отличия простых и составных чисел; разложение на простые множители (в пределах программы); применение в задачах"
      },
      {
        number: 20,
        title: "Обыкновенные дроби (I)",
        topic: "Понятие дроби",
        aspects: "Числитель и знаменатель; дробь как часть целого/множества; запись и чтение дробей; сравнение наглядных дробей"
      },
      {
        number: 21,
        title: "Обыкновенные дроби (II)",
        topic: "Сравнение и сокращение дробей",
        aspects: "Равные дроби; сокращение дробей; сравнение дробей с одинаковыми знаменателями; моделирование на чертежах"
      },
      {
        number: 22,
        title: "Сложение и вычитание дробей с одинаковыми знаменателями",
        topic: "Действия с дробями",
        aspects: "Правило сложения/вычитания дробей; примеры на числовом отрезке; практические задачи (часть пути, часть работы)"
      },
      {
        number: 23,
        title: "Десятичные дроби (ввод)",
        topic: "Связь дробей с десятичной записью",
        aspects: "Знакомство с десятичной запятой; десятые, сотые; соответствие обыкновенных и десятичных дробей в простых случаях"
      },
      {
        number: 24,
        title: "Действия с десятичными дробями (I)",
        topic: "Сложение и вычитание",
        aspects: "Запись чисел с запятой в столбик; выравнивание по запятой; устные и письменные примеры; практические задачи"
      },
      {
        number: 25,
        title: "Величины и единицы измерения",
        topic: "Длина, площадь, масса, объём, время",
        aspects: "Повторение и систематизация единиц (мм, см, м, км; см², дм²; г, кг, т; л; мин, ч, сут); перевод единиц; задачи на величины"
      },
      {
        number: 26,
        title: "Площадь прямоугольника и квадрата",
        topic: "Формулы площади",
        aspects: "Вывод и применение формулы S = a·b, S = a²; практические задачи (пол комнаты, участка и т.п.); составные фигуры из прямоугольников"
      },
      {
        number: 27,
        title: "Площадь сложных фигур",
        topic: "Разбиение и составление",
        aspects: "Нахождение площади составной фигуры путём разбиения/дополнения до прямоугольника; задачи на сравнение площадей"
      },
      {
        number: 28,
        title: "Углы и их измерение",
        topic: "Транспортир и виды углов",
        aspects: "Измерение углов транспортиром; острый, прямой, тупой угол; построение углов заданной величины (в пределах программы)"
      },
      {
        number: 29,
        title: "Координатная плоскость (наглядно)",
        topic: "Координаты точки",
        aspects: "Ось, начало координат; запись координат (x, y) на простейшем уровне; нахождение точек по координатам на сетке"
      },
      {
        number: 30,
        title: "Симметрия и геометрические преобразования",
        topic: "Осевая симметрия",
        aspects: "Понятие оси симметрии; симметричные фигуры; дорисовка симметричной части; практические задания в тетради"
      },
      {
        number: 31,
        title: "Логические и олимпиадные задачи",
        topic: "Развитие логического мышления",
        aspects: "Задачи на рассуждение, перебор вариантов, необычные условия; таблицы истинности в бытовой форме; игры на смекалку"
      },
      {
        number: 32,
        title: "Повторение ключевых тем (I)",
        topic: "Числа и вычисления",
        aspects: "Систематизация: многозначные числа, действия с ними, делители/кратные, дроби и десятичные дроби; проверочная работа"
      },
      {
        number: 33,
        title: "Повторение ключевых тем (II)",
        topic: "Задачи и геометрия",
        aspects: "Систематизация: задачи на движение/работу/цену, величины, площадь, углы, координаты; комплексный практикум"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический марафон",
        aspects: "Командные конкурсы по устному счёту, задачам, геометрии; мини-проекты (составить свою задачу); подведение итогов начальной школы"
      }
    ]
  },
  {
    grade: 3,
    title: "Математика для 3 класса",
    description: "Комплексный курс математики для третьеклассников с изучением натуральных чисел до 10 000, арифметических действий, геометрии, дробей и решения сложных задач.",
    lessons: [
      {
        number: 1,
        title: "Стартовый аудит знаний",
        topic: "Повторение курса 2 класса",
        aspects: "Проверка устного счёта; таблица умножения; сложение и вычитание в пределах 100, 1000; простые и составные задачи"
      },
      {
        number: 2,
        title: "Числовой ряд до 10 000",
        topic: "Натуральные числа до 10 000",
        aspects: "Счёт тысячами, сотнями, десятками; запись и чтение чисел; числовой луч; «соседи» числа, предыдущее/следующее"
      },
      {
        number: 3,
        title: "Разрядный состав числа",
        topic: "Тысячи, сотни, десятки, единицы",
        aspects: "Разложение числа по разрядам; разрядные таблицы; связь устной и письменной формы записи числа"
      },
      {
        number: 4,
        title: "Сравнение чисел до 10 000",
        topic: "Больше, меньше, равно",
        aspects: "Сравнение по старшему разряду; упорядочивание набора чисел; поиск наибольшего/наименьшего числа"
      },
      {
        number: 5,
        title: "Сложение чисел до 10 000 без перехода через разряд",
        topic: "Письменный приём сложения",
        aspects: "Сложение столбиком; сложение по разрядам; контроль точности записи и переноса разрядов"
      },
      {
        number: 6,
        title: "Вычитание чисел до 10 000 без перехода через разряд",
        topic: "Письменный приём вычитания",
        aspects: "Вычитание столбиком; вычитание по разрядам; проверка вычитания сложением"
      },
      {
        number: 7,
        title: "Сложение и вычитание с переходом через разряд",
        topic: "Усложнение вычислений",
        aspects: "«Заём» из старшего разряда; типичные ошибки; проверка результатов обратным действием"
      },
      {
        number: 8,
        title: "Контрольный микс по действиям",
        topic: "Обобщение по арифметике",
        aspects: "Смешанные примеры на сложение и вычитание; выбор оптимального способа; устный и письменный счёт"
      },
      {
        number: 9,
        title: "Повторение таблицы умножения",
        topic: "Закрепление базовых фактов",
        aspects: "Диагностика знание таблицы; приёмы запоминания; восстановление пропущенных множителей и произведений"
      },
      {
        number: 10,
        title: "Свойства умножения",
        topic: "Коммутативность и распределительность",
        aspects: "Переместительное свойство (a×b=b×a); распределительное: a×(b+c); сокращение вычислений за счёт свойств"
      },
      {
        number: 11,
        title: "Умножение на 10, 100, 1000",
        topic: "Масштабирование чисел",
        aspects: "Сдвиг цифр при умножении на 10, 100, 1000; практические задачи; связь с десятичной системой"
      },
      {
        number: 12,
        title: "Деление на 10, 100, 1000",
        topic: "Обратные операции",
        aspects: "Деление круглых чисел; связь с умножением; задачи на «во сколько раз больше/меньше»"
      },
      {
        number: 13,
        title: "Умножение двузначного числа на однозначное",
        topic: "Письменный алгоритм умножения",
        aspects: "Запись столбиком; умножение по разрядам; перенос десятков; проверка через обратное действие или оценку"
      },
      {
        number: 14,
        title: "Деление на однозначное число (без остатка)",
        topic: "Письменный алгоритм деления",
        aspects: "Деление столбиком; пошаговое деление по разрядам; проверка деления умножением"
      },
      {
        number: 15,
        title: "Деление с остатком",
        topic: "Частное и остаток",
        aspects: "Понятие остатка; проверка правильности деления с остатком; интерпретация остатка в текстовой задаче"
      },
      {
        number: 16,
        title: "Задачи на умножение и деление",
        topic: "Текстовые задачи",
        aspects: "Модели «по несколько», «сколько раз больше/меньше»; выбор операции; запись решения и ответа"
      },
      {
        number: 17,
        title: "Геометрические фигуры и их элементы",
        topic: "Отрезок, луч, прямая, угол",
        aspects: "Обозначения; вершина, стороны угла; измерение длин отрезков; классификация линий"
      },
      {
        number: 18,
        title: "Виды углов и треугольников",
        topic: "Геометрическая классификация",
        aspects: "Острый, прямой, тупой угол (наглядно); треугольники по сторонам (равносторонний, равнобедренный, разносторонний)"
      },
      {
        number: 19,
        title: "Прямоугольник и квадрат",
        topic: "Свойства и элементы",
        aspects: "Противоположные стороны, углы; прямые углы; диагонали; построение прямоугольника/квадрата в тетради по клеткам"
      },
      {
        number: 20,
        title: "Периметр многоугольника",
        topic: "Периметр фигуры",
        aspects: "Периметр как сумма всех сторон; вычисление периметра прямоугольника и квадрата; практические задачи"
      },
      {
        number: 21,
        title: "Площадь прямоугольника (ввод наглядно)",
        topic: "Понятие площади",
        aspects: "Сравнение фигур по площади; измерение в условных единицах (клетках); формула площади прямоугольника S=a×b (на интуитивном уровне)"
      },
      {
        number: 22,
        title: "Единицы длины и площади",
        topic: "Система мер",
        aspects: "Повторение: мм, см, дм, м, км; введение: кв. см, кв. дм (наглядно); переводы простых величин; практические измерения"
      },
      {
        number: 23,
        title: "Единицы массы, времени и объёма",
        topic: "Кг, г, т; минута, час, сутки; литр",
        aspects: "Соотношения единиц; задачи на единицы измерения; работа с часами (продолжительность события)"
      },
      {
        number: 24,
        title: "Доли и простейшие дроби",
        topic: "Понятие доли",
        aspects: "Половина, треть, четверть; деление фигуры и множества на равные части; запись вида 1/2, 1/3, 1/4 (без формальной теории дробей)"
      },
      {
        number: 25,
        title: "Дроби как часть целого",
        topic: "Работа с простыми дробями",
        aspects: "Сравнение на уровне модели («1/2 больше, чем 1/4»); нахождение доли множества и целого по доле (наглядные задачи)"
      },
      {
        number: 26,
        title: "Составные задачи в 2–3 действия",
        topic: "Стратегия решения",
        aspects: "Анализ текста; построение плана решения; составление выражения с 2–3 действиями; проверка решения по условию"
      },
      {
        number: 27,
        title: "Задачи на движение (ввод)",
        topic: "Скорость, время, расстояние (интуитивно)",
        aspects: "Наглядные задачи: «идут с разной скоростью», «кто быстрее/дальше»; без формальных формул, на уровне здравого смысла"
      },
      {
        number: 28,
        title: "Задачи на работу с таблицами и схемами",
        topic: "Представление данных",
        aspects: "Чтение таблиц и диаграмм; перевод текстовой задачи в таблицу/схему; извлечение числовой информации"
      },
      {
        number: 29,
        title: "Задачи на масштаб и план",
        topic: "Масштабные модели",
        aspects: "Понятие масштаба на простых примерах (карта, план класса); определение расстояний по плану (в условных единицах)"
      },
      {
        number: 30,
        title: "Логические и нестандартные задачи",
        topic: "Развитие логики",
        aspects: "Задачи на классификацию, «лишний» объект, числовые и графические закономерности; задания на смекалку"
      },
      {
        number: 31,
        title: "Повторение ключевых тем (часть 1)",
        topic: "Числа и вычисления",
        aspects: "Систематизация: числа до 10 000, сложение/вычитание, умножение на однозначное, деление; контрольный устный и письменный блок"
      },
      {
        number: 32,
        title: "Повторение ключевых тем (часть 2)",
        topic: "Задачи и величины",
        aspects: "Систематизация: текстовые задачи, единицы измерения, дроби, периметр/площадь; работа по карточкам и в парах"
      },
      {
        number: 33,
        title: "Итоговый практикум",
        topic: "Комплексная работа",
        aspects: "Смешанные задания на все виды вычислений и задач; самостоятельная работа с последующей разборкой; коррекция типичных ошибок"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический чемпионат",
        aspects: "Командные конкурсы по устному счёту, геометрии, задачам; подведение итогов года; рефлексия и фиксация результатов"
      }
    ]
  },
  {
    grade: 2,
    title: "Математика для 2 класса",
    description: "Комплексный курс математики для второклассников с изучением чисел до 1000, арифметических действий, геометрии, измерений и решения текстовых задач.",
    lessons: [
      {
        number: 1,
        title: "Старт в новом году",
        topic: "Повторение математики 1 класса",
        aspects: "Повторение чисел 0–20; устный счёт; сложение и вычитание; простые задачи; работа по образцу"
      },
      {
        number: 2,
        title: "Числа до 100",
        topic: "Счёт, запись и чтение чисел 21–100",
        aspects: "Десятки и единицы; числовой ряд; запись двузначных чисел; сравнение (>, <, =)"
      },
      {
        number: 3,
        title: "Разрядный состав числа",
        topic: "Десяток и единицы",
        aspects: "Представление числа с помощью десятков и единиц (например, 47 – это 4 десятка и 7 единиц); схемы, таблицы"
      },
      {
        number: 4,
        title: "Сложение двузначных чисел без перехода через десяток",
        topic: "Письменные приёмы",
        aspects: "Примеры вида 23+14; разложение по разрядам; выполнение по шагам; связь с устным счётом"
      },
      {
        number: 5,
        title: "Вычитание двузначных чисел без перехода через десяток",
        topic: "Письменные приёмы",
        aspects: "Примеры вида 67–25; вычитание десятков и единиц; контроль результата обратным действием"
      },
      {
        number: 6,
        title: "Сложение с переходом через десяток",
        topic: "Устные и письменные приёмы",
        aspects: "Примеры вида 28+17; разложение (28+2+15); запись столбиком; проверка ответов"
      },
      {
        number: 7,
        title: "Вычитание с переходом через десяток",
        topic: "Устные и письменные приёмы",
        aspects: "Примеры вида 52–18; «занимаем десяток»; пояснение на наглядном материале (палочки, кубики, схемы)"
      },
      {
        number: 8,
        title: "Повторение действий в пределах 100",
        topic: "Обобщающий урок",
        aspects: "Смешанные примеры; выбор удобного способа вычислений; проверка примеров обратными действиями"
      },
      {
        number: 9,
        title: "Множество и его части",
        topic: "Часть и целое",
        aspects: "Понятие «часть» и «целое»; связь с действием сложения и вычитания; разбиение предметных множеств"
      },
      {
        number: 10,
        title: "Введение умножения",
        topic: "Умножение как сложение одинаковых слагаемых",
        aspects: "Повторяющиеся сложения (2+2+2); запись через знак «×»; чтение и понимание «3 раза по 2»"
      },
      {
        number: 11,
        title: "Введение деления",
        topic: "Деление как разбиение и группировка",
        aspects: "Деление на равные части; запись через знак «:»; связь с умножением; модели «разложить поровну»"
      },
      {
        number: 12,
        title: "Таблица умножения 2 и 3",
        topic: "Закрепление умножения",
        aspects: "Знакомство с таблицей умножения 2 и 3; устные упражнения; связь с повторяющимся сложением"
      },
      {
        number: 13,
        title: "Таблица умножения 4 и 5",
        topic: "Расширение таблицы",
        aspects: "Отработка примеров на 4 и 5; осознание закономерностей (5, 10, 15, …); мини-задачи"
      },
      {
        number: 14,
        title: "Таблица умножения 6 и 7",
        topic: "Продолжение",
        aspects: "Запоминание, тренировка, игровые упражнения; связь с уже известными примерами"
      },
      {
        number: 15,
        title: "Таблица умножения 8 и 9",
        topic: "Завершение таблицы",
        aspects: "Закрепление сложных случаев; приёмы запоминания (симметрия, соседние примеры)"
      },
      {
        number: 16,
        title: "Обратная связь: деление и умножение",
        topic: "Таблицы деления",
        aspects: "Переход от умножения к делению; построение таблиц деления; проверка деления умножением"
      },
      {
        number: 17,
        title: "Текстовые задачи на умножение",
        topic: "Задачи «по несколько»",
        aspects: "Разбор условий задач: «в каждом», «по…», «в каждой коробке»; составление выражений; запись решения"
      },
      {
        number: 18,
        title: "Текстовые задачи на деление",
        topic: "Задачи на разбиение и на нахождение количества групп",
        aspects: "Различие задач на «раздать поровну» и «сколько групп получится»; выбор действия; оформление решения"
      },
      {
        number: 19,
        title: "Числа до 1000",
        topic: "Сотни, десятки, единицы",
        aspects: "Введение сотни; счёт десятками и сотнями; чтение и запись чисел до 1000; представление числа разрядной схемой"
      },
      {
        number: 20,
        title: "Сравнение чисел до 1000",
        topic: "Разрядный принцип",
        aspects: "Сравнение по сотням, десяткам, единицам; упорядочивание чисел; нахождение «соседей» числа на числовой прямой"
      },
      {
        number: 21,
        title: "Сложение чисел до 1000 (без перехода через разряд)",
        topic: "Письменный приём",
        aspects: "Сложение трёхразрядных чисел столбиком; сложение по разрядам; контроль точности записи"
      },
      {
        number: 22,
        title: "Вычитание чисел до 1000 (без перехода через разряд)",
        topic: "Письменный приём",
        aspects: "Вычитание по разрядам; объяснение каждого шага; проверка вычитания сложением"
      },
      {
        number: 23,
        title: "Сложение и вычитание с переходом через разряд",
        topic: "Усложнение вычислений",
        aspects: "«Заём» из старшего разряда; наглядные схемы; типичные ошибки и их профилактика"
      },
      {
        number: 24,
        title: "Геометрические фигуры и линии",
        topic: "Обобщение и расширение",
        aspects: "Повторение: отрезок, прямая, ломаная; новый материал: луч; классификация линий; измерение отрезков линейкой"
      },
      {
        number: 25,
        title: "Многоугольники и периметр",
        topic: "Периметр фигуры",
        aspects: "Понятие многоугольника; прямоугольник, квадрат, треугольник; периметр как сумма длин сторон; вычисление периметра по рисунку"
      },
      {
        number: 26,
        title: "Единицы длины",
        topic: "Сантиметр, дециметр, метр",
        aspects: "Перевод единиц (см – дм – м) на простых примерах; измерения в классе; запись результатов"
      },
      {
        number: 27,
        title: "Время",
        topic: "Единицы времени",
        aspects: "Повторение: части суток, дни недели; знакомство/закрепление: час, минута; чтение времени по часам (целые часы, половина часа)"
      },
      {
        number: 28,
        title: "Масса и вместимость",
        topic: "Единицы массы и объёма",
        aspects: "Килограмм и грамм (наглядно); литр; сравнение по массе и объёму; практические задания (весы, ёмкости)"
      },
      {
        number: 29,
        title: "Деньги",
        topic: "Рубли и копейки",
        aspects: "Связь рубля и копейки; запись цен; сложение и вычитание денежных сумм; задачи «покупки и сдача»"
      },
      {
        number: 30,
        title: "Смешанные задачи в 2–3 действия",
        topic: "Стратегия решения задач",
        aspects: "Разбор сложных задач с несколькими действиями; план решения; проверка по условию; запись выражений с несколькими действиями"
      },
      {
        number: 31,
        title: "Логические задачи и закономерности",
        topic: "Развитие логического мышления",
        aspects: "Нахождение закономерностей в числовых рядах; заполнение таблиц; логические рисунки; задачи на смекалку"
      },
      {
        number: 32,
        title: "Повторение курса 2 класса (часть 1)",
        topic: "Обобщение знаний",
        aspects: "Проверка по темам: числа до 1000, сложение/вычитание, умножение/деление, геометрия; работа по карточкам"
      },
      {
        number: 33,
        title: "Повторение курса 2 класса (часть 2)",
        topic: "Практикум",
        aspects: "Решение задач (в 1–3 действия) на все изученные виды; самостоятельная работа с последующей разборкой"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический турнир",
        aspects: "Командные конкурсы по таблице умножения, устному счёту, задачам; подведение итогов года; рефлексия учащихся"
      }
    ]
  },
  {
    grade: 1,
    title: "Математика для 1 класса",
    description: "Базовый курс математики для первоклассников с акцентом на развитие логического мышления, знакомство с числами, геометрическими фигурами и основами арифметики.",
    lessons: [
      {
        number: 1,
        title: "Знакомство с математикой",
        topic: "Что такое математика",
        aspects: "Математика в жизни; что такое число, фигура, задача; правила работы на уроке; рабочая тетрадь и учебник"
      },
      {
        number: 2,
        title: "Счёт предметов вокруг нас",
        topic: "Счёт предметов",
        aspects: "Счёт до 5 на реальных предметах; один – много; поровну – не поровну; соотнесение количества и цифры"
      },
      {
        number: 3,
        title: "Числа 1–3",
        topic: "Введение чисел 1, 2, 3",
        aspects: "Написание цифр 1, 2, 3; сравнение групп предметов; больше – меньше – столько же"
      },
      {
        number: 4,
        title: "Числа 4–5",
        topic: "Введение чисел 4, 5",
        aspects: "Написание цифр 4, 5; состав количественных групп; упорядочивание чисел 1–5"
      },
      {
        number: 5,
        title: "Сравнение чисел 1–5",
        topic: "Больше, меньше, равно",
        aspects: "Знаки >, <, =; сравнение предметов и чисел; запись простейших равенств"
      },
      {
        number: 6,
        title: "Сложение в пределах 5",
        topic: "Понятие сложения",
        aspects: "Сложение как объединение групп; запись действия знаком «+»; чтение примеров"
      },
      {
        number: 7,
        title: "Вычитание в пределах 5",
        topic: "Понятие вычитания",
        aspects: "Вычитание как убирание части; запись действия знаком «–»; связь со сложением"
      },
      {
        number: 8,
        title: "Число 0",
        topic: "Пустое множество и ноль",
        aspects: "Что означает «ни одного»; запись числа 0; примеры с нулём в жизни; 1–0, 0+1"
      },
      {
        number: 9,
        title: "Числа 6–7",
        topic: "Расширение числового ряда",
        aspects: "Счёт до 7; написание цифр 6, 7; сравнение чисел 1–7; место числа на числовом ряду"
      },
      {
        number: 10,
        title: "Числа 8–10",
        topic: "Числовой ряд до 10",
        aspects: "Счёт до 10; написание цифр 8, 9, 10 (запись «10»); закрепление порядка чисел 1–10"
      },
      {
        number: 11,
        title: "Состав числа 5–10",
        topic: "Разложение на слагаемые",
        aspects: "Разные способы получить число (5=2+3 и др.); парные примеры; визуальное представление (полоски, кружки)"
      },
      {
        number: 12,
        title: "Сложение в пределах 10",
        topic: "Табличное сложение",
        aspects: "Отработка примеров на сложение до 10; устный счёт; связь с составом числа"
      },
      {
        number: 13,
        title: "Вычитание в пределах 10",
        topic: "Табличное вычитание",
        aspects: "Отработка примеров на вычитание до 10; обратные примеры; проверка вычитания сложением"
      },
      {
        number: 14,
        title: "Текстовые задачи на сложение",
        topic: "Простые задачи",
        aspects: "Структура задачи: условие, вопрос, решение, ответ; выбор действия; запись решения"
      },
      {
        number: 15,
        title: "Текстовые задачи на вычитание",
        topic: "Простые задачи",
        aspects: "Отличие задач на вычитание от задач на сложение; ключевые слова («осталось», «стало меньше»); оформление решения"
      },
      {
        number: 16,
        title: "Повторение чисел 0–10, действия, задачи",
        topic: "Обобщающий урок",
        aspects: "Повторение счёта, сравнения, сложения и вычитания до 10; мини-контроль; математическая игра"
      },
      {
        number: 17,
        title: "Геометрические фигуры",
        topic: "Круг, квадрат, треугольник, прямоугольник",
        aspects: "Узнавание фигур вокруг; свойства (количество сторон, углов); сравнение и групировка по форме"
      },
      {
        number: 18,
        title: "Линия и отрезок",
        topic: "Прямая, кривая, отрезок",
        aspects: "Что такое линия; прямая и кривая; отрезок как часть линии; нахождение отрезков на рисунке"
      },
      {
        number: 19,
        title: "Ориентировка в пространстве",
        topic: "Направления и расположение",
        aspects: "Понятия «слева – справа», «выше – ниже», «перед – за»; расположение предметов в тетради и на доске"
      },
      {
        number: 20,
        title: "Числа 11–20",
        topic: "Переход через десяток",
        aspects: "Счёт от 1 до 20; чтение и запись двузначных чисел 11–20; понимание, что 11 = 10 и 1 и т.п."
      },
      {
        number: 21,
        title: "Десяток и единицы (11–20)",
        topic: "Разрядный состав числа",
        aspects: "Понятия «десяток», «единица»; представление чисел через десяток и единицы; сравнение чисел 11–20"
      },
      {
        number: 22,
        title: "Сложение в пределах 20 без перехода через десяток",
        topic: "Двузначные числа",
        aspects: "Примеры вида 12+3, 15+2; опора на разложение: 12 это 10 и 2; устный счёт"
      },
      {
        number: 23,
        title: "Вычитание в пределах 20 без перехода через десяток",
        topic: "Двузначные числа",
        aspects: "Примеры вида 18–3, 16–2; использование числового ряда; связь со сложением"
      },
      {
        number: 24,
        title: "Сложение и вычитание с переходом через десяток",
        topic: "Приёмы вычислений",
        aspects: "Примеры вида 9+4, 13–5; разложение числа на удобные части (9+1+3); опора на состав числа 10"
      },
      {
        number: 25,
        title: "Сравнение чисел 1–20",
        topic: "Больше, меньше, равно",
        aspects: "Упорядочивание числового ряда 1–20; использование знаков >, <, =; выбор большего/меньшего числа в задачах"
      },
      {
        number: 26,
        title: "Задачи в 2 действия (простые)",
        topic: "Последовательность действий",
        aspects: "Разбор задач с двумя последовательными действиями; запись выражения; проверка по тексту задачи"
      },
      {
        number: 27,
        title: "Длина предметов",
        topic: "Измерение длины",
        aspects: "Понятия «длиннее – короче»; измерение условными мерками; знакомство с линейкой и сантиметром (без формальной отработки единиц)"
      },
      {
        number: 28,
        title: "Время",
        topic: "Части суток и часы",
        aspects: "Части суток (утро, день, вечер, ночь); дни недели; знакомство с часами, понятие «час»"
      },
      {
        number: 29,
        title: "Масса и объём (наглядно)",
        topic: "Легче, тяжелее, больше, меньше",
        aspects: "Сравнение предметов по массе на ощупь и с помощью весов; сравнение по объёму (стаканы, ёмкости) без ввода единиц"
      },
      {
        number: 30,
        title: "Деньги",
        topic: "Монеты и рубли",
        aspects: "Понятие денег; знакомство с монетами и купюрами (рубль); составление сумм из монет; простейшие «покупки»"
      },
      {
        number: 31,
        title: "Закономерности и логические ряды",
        topic: "Логика и последовательности",
        aspects: "Поиск закономерностей в числовых и предметных рядах; продолжение последовательностей; группировка по признаку"
      },
      {
        number: 32,
        title: "Повторение: числа 0–20, действия, задачи",
        topic: "Обобщающий урок",
        aspects: "Систематизация знаний по счёту, сравнению, сложению/вычитанию, текстовым задачам; работа по карточкам"
      },
      {
        number: 33,
        title: "Итоговый практикум",
        topic: "Решаем вместе",
        aspects: "Комбинация примеров, задач, геометрического материала; работа в парах/группах; формирование уверенности в своих силах"
      },
      {
        number: 34,
        title: "Итоговый урок-игра",
        topic: "Математический праздник",
        aspects: "Игровые задания по всему курсу; командные конкурсы; подведение итогов года, рефлексия детей"
      }
    ]
  },
  {
    grade: 5,
    title: "Физика для 5 класса",
    description: "Вводный курс физики для пятиклассников с акцентом на формирование представлений о физических явлениях, методах наблюдения и измерения, основах строения вещества и простейших механических явлениях.",
    lessons: [
      {
        number: 1,
        title: "Что такое физика и зачем она нужна",
        topic: "Вводный модуль: физика как наука",
        aspects: "Определение физики; место физики среди наук; роль физики в технике и быту; примеры физических объектов и процессов"
      },
      {
        number: 2,
        title: "Физика вокруг нас и в профессиях",
        topic: "Вводный модуль: физика как наука",
        aspects: "Примеры применения физики в медицине, транспорте, IT; профессии, связанные с физикой; значимость наблюдательности и аккуратности"
      },
      {
        number: 3,
        title: "Физические тела и вещества",
        topic: "Физические явления и объекты",
        aspects: "Понятия «тело», «вещество», «частица»; примеры тел и веществ; однородные и неоднородные тела"
      },
      {
        number: 4,
        title: "Физические явления: какие они бывают",
        topic: "Физические явления и объекты",
        aspects: "Классификация явлений: механические, тепловые, звуковые, световые, электрические; примеры из жизни; отличие явления от тела"
      },
      {
        number: 5,
        title: "Наблюдение и опыт как методы познания",
        topic: "Физические явления и объекты",
        aspects: "Наблюдение и эксперимент; постановка простого опыта; фиксирование результатов; роль эксперимента в физике"
      },
      {
        number: 6,
        title: "Измерение длины. Измерительные приборы",
        topic: "Наблюдения и измерения",
        aspects: "Понятие измерения; линейка, рулетка; цена деления; правила отсчёта; погрешность измерения длины (качественно)"
      },
      {
        number: 7,
        title: "Измерение времени. Часы и секундомер",
        topic: "Наблюдения и измерения",
        aspects: "Физическая величина «время»; часы, секундомер; единицы времени; пример измерения длительности явления"
      },
      {
        number: 8,
        title: "Площадь фигур и измерение площади",
        topic: "Наблюдения и измерения",
        aspects: "Площадь как физическая величина; единицы площади; практические примеры измерения площади объектов"
      },
      {
        number: 9,
        title: "Объём твёрдых тел",
        topic: "Наблюдения и измерения",
        aspects: "Понятие объёма; единицы объёма; вычисление объёма простых тел (куб, прямоугольный параллелепипед); практикум по измерению"
      },
      {
        number: 10,
        title: "Объём жидкостей и газов. Мензурка",
        topic: "Наблюдения и измерения",
        aspects: "Объём жидкостей и газов; мензурка; правила отсчёта по шкале; практические измерения объёма воды, сока и т.п."
      },
      {
        number: 11,
        title: "Техника безопасности на уроках физики",
        topic: "Наблюдения и измерения",
        aspects: "Базовые правила безопасности в кабинете физики; маркировка приборов; порядок работы с горячими, хрупкими и электрическими устройствами"
      },
      {
        number: 12,
        title: "Вещество и его агрегатные состояния",
        topic: "Вещество и его строение",
        aspects: "Агрегатные состояния: твёрдое, жидкое, газообразное; примеры переходов из одного состояния в другое; влияние температуры"
      },
      {
        number: 13,
        title: "Молекулы — строительные «кирпичики» вещества",
        topic: "Вещество и его строение",
        aspects: "Качественное представление о молекулах; размеры молекул (на уровне сравнения); идея, что молекулы постоянно движутся"
      },
      {
        number: 14,
        title: "Диффузия в газах, жидкостях и твёрдых телах",
        topic: "Вещество и его строение",
        aspects: "Наблюдение диффузии (опыты с водой, запахами и т.п.); объяснение на уровне молекулярного движения; зависимость от температуры"
      },
      {
        number: 15,
        title: "Притяжение и отталкивание частиц",
        topic: "Вещество и его строение",
        aspects: "Качественное представление о силах притяжения и отталкивания между частицами; связь с агрегатным состоянием; простые модели"
      },
      {
        number: 16,
        title: "Тепловое движение и температура",
        topic: "Вещество и его строение",
        aspects: "Тепловое движение частиц; понятие температуры; термометр, шкалы температуры; примеры нагревания и охлаждения тел"
      },
      {
        number: 17,
        title: "Масса тела и способы её измерения",
        topic: "Масса и плотность",
        aspects: "Понятие массы; отличие массы от объёма и веса (качественно); единицы массы; весы и правила взвешивания"
      },
      {
        number: 18,
        title: "Плотность вещества: качественное понимание",
        topic: "Масса и плотность",
        aspects: "Что такое плотность; сравнение плотностей разных веществ (вода, масло, металл); связь «масса — объём — плотность» (качественно)"
      },
      {
        number: 19,
        title: "Измерение плотности твёрдых тел",
        topic: "Масса и плотность",
        aspects: "Измерение массы и объёма; вычисление плотности в простых случаях; использование таблиц плотностей (без упора на сложные расчёты)"
      },
      {
        number: 20,
        title: "Измерение плотности жидкостей",
        topic: "Масса и плотность",
        aspects: "Практикум: измерение массы и объёма жидкости; расчёт плотности; сравнение с табличными значениями; анализ погрешностей (качественно)"
      },
      {
        number: 21,
        title: "Механическое движение. Путь и траектория",
        topic: "Механическое движение",
        aspects: "Понятие механического движения; примеры движущихся тел; путь и траектория; примеры различных траекторий (прямая, кривая)"
      },
      {
        number: 22,
        title: "Равномерное и неравномерное движение",
        topic: "Механическое движение",
        aspects: "Отличие равномерного и неравномерного движения; примеры из жизни (автомобиль, пешеход, лифт); качественное сравнение"
      },
      {
        number: 23,
        title: "Скорость движения: смысл и единицы",
        topic: "Механическое движение",
        aspects: "Понятие скорости; единицы скорости (м/с, км/ч); простые примеры: кто движется быстрее; перевод км/ч в м/с (по готовым примерам)"
      },
      {
        number: 24,
        title: "Скорость и пройденный путь. Простые задачи",
        topic: "Механическое движение",
        aspects: "Связь скорости, пути и времени (без формального заучивания формул); решение элементарных задач на уровне «кто дальше/быстрее»"
      },
      {
        number: 25,
        title: "Графическое представление движения",
        topic: "Механическое движение",
        aspects: "Простейшие графики зависимости пути от времени (качественно); чтение готовых графиков; сравнение движений по графикам"
      },
      {
        number: 26,
        title: "Взаимодействие тел. Понятие силы",
        topic: "Сила и виды сил",
        aspects: "Взаимодействие как причина изменения движения; качественное введение понятия силы; примеры взаимодействий (толкание, притяжение)"
      },
      {
        number: 27,
        title: "Сила тяжести и вес тела",
        topic: "Сила и виды сил",
        aspects: "Земное притяжение; понятия «сила тяжести» и «вес тела» (на качественном уровне); примеры: падение предметов, весы"
      },
      {
        number: 28,
        title: "Сила упругости и деформация",
        topic: "Сила и виды сил",
        aspects: "Упругие и неупругие деформации; пружина как модель; зависимость силы упругости от растяжения (качественно); примеры из быта"
      },
      {
        number: 29,
        title: "Сила трения: полезное и вредное",
        topic: "Сила и виды сил",
        aspects: "Виды трения (скольжения, качения, покоя — качественно); роль трения в жизни; способы увеличения и уменьшения трения"
      },
      {
        number: 30,
        title: "Измерение силы. Динамометр",
        topic: "Сила и виды сил",
        aspects: "Прибор для измерения силы — динамометр; единица силы (ньютон) — на уровне факта; практические измерения силы растяжения пружины"
      },
      {
        number: 31,
        title: "Давление твёрдых тел на поверхность",
        topic: "Давление",
        aspects: "Качественное понятие давления; примеры: лыжи, гусеницы танка, каблуки; влияние силы и площади опоры на давление"
      },
      {
        number: 32,
        title: "Давление жидкостей",
        topic: "Давление",
        aspects: "Свойства жидкостей; зависимость давления от глубины (качественно); примеры: плотина, шланг с водой; демонстрационные опыты"
      },
      {
        number: 33,
        title: "Давление газов и атмосферное давление",
        topic: "Давление",
        aspects: "Свойства газов; воздушная оболочка Земли; атмосферное давление (качественно); примеры из быта (шприц, воздушные шары, погода)"
      },
      {
        number: 34,
        title: "Итоговый урок: повторение и мини-проекты",
        topic: "Обобщение курса",
        aspects: "Повтор ключевых понятий года; мини-проекты и сообщения учащихся; простое тестирование; подведение итогов и рефлексия"
      }
    ]
  },
  {
    grade: 6,
    title: "Физика для 6 класса",
    description: "Курс физики для шестиклассников с углублением в механику, изучение работы, энергии, простых механизмов и тепловых явлений. Развитие навыков решения задач и понимания физических законов.",
    lessons: [
      {
        number: 1,
        title: "Повтор: физические величины и измерения",
        topic: "Вводный модуль",
        aspects: "Актуализация понятий: длина, время, масса, объём; приборы и единицы измерения; цена деления; культура ведения измерений"
      },
      {
        number: 2,
        title: "Повтор: механическое движение и скорость",
        topic: "Вводный модуль",
        aspects: "Механическое движение; путь, траектория; скорость движения; сравнение скоростей; обсуждение реальных примеров (транспорт, спорт)"
      },
      {
        number: 3,
        title: "Равномерное движение. Формула скорости",
        topic: "Механическое движение",
        aspects: "Равномерное движение; формула v = s / t (на базовом уровне); единицы пути, времени, скорости; простые задачи на вычисление скорости"
      },
      {
        number: 4,
        title: "Путь и время при равномерном движении",
        topic: "Механическое движение",
        aspects: "Перестановка формулы (s = v·t, t = s / v); текстовые задачи; осознанное выделение данных и искомой величины"
      },
      {
        number: 5,
        title: "Средняя скорость движения",
        topic: "Механическое движение",
        aspects: "Понятие средней скорости; примеры с разными участками пути; простые задачи «туда–обратно»; отличие мгновенной и средней скорости (качественно)"
      },
      {
        number: 6,
        title: "Графики движения: путь–время",
        topic: "Механическое движение",
        aspects: "Графическое представление движения; чтение готовых графиков s(t); определение по графику: кто быстрее, когда тело покоится, когда движется"
      },
      {
        number: 7,
        title: "Графики движения: скорость–время (качественно)",
        topic: "Механическое движение",
        aspects: "Качественное знакомство с v(t); интерпретация горизонтального участка, нулевой скорости; сравнение нескольких графиков"
      },
      {
        number: 8,
        title: "Повтор: взаимодействие тел и сила",
        topic: "Силы в природе",
        aspects: "Взаимодействие как причина изменения скорости и формы; сила как характеристика взаимодействия; направления и точка приложения силы"
      },
      {
        number: 9,
        title: "Законы Ньютона (качественно)",
        topic: "Силы в природе",
        aspects: "Инерция и первый закон Ньютона — на уровне повседневных примеров; реактивное движение; качественное обсуждение второго и третьего законов"
      },
      {
        number: 10,
        title: "Сила тяжести и свободное падение (качественно)",
        topic: "Силы в природе",
        aspects: "Сила тяжести; направление действия; примеры свободного падения; зависимость силы тяжести от массы (качественно)"
      },
      {
        number: 11,
        title: "Сила упругости. Закон Гука (качественно)",
        topic: "Силы в природе",
        aspects: "Деформации тел; пружина как модель; сила упругости; пропорциональность силы и удлинения (без формальной формулы или на простейшем уровне)"
      },
      {
        number: 12,
        title: "Сила трения. Трение в технике и быту",
        topic: "Силы в природе",
        aspects: "Трение скольжения и качения; полезное и вредное трение; способы уменьшения/увеличения трения; примеры конструктивных решений"
      },
      {
        number: 13,
        title: "Сложение сил в одном направлении",
        topic: "Силы в природе",
        aspects: "Случай коллинеарных сил; усиление и ослабление результирующей силы; простые задачи на сложение/вычитание сил по направлению"
      },
      {
        number: 14,
        title: "Давление твёрдых тел. Расчёт давления",
        topic: "Давление",
        aspects: "Понятие давления; формула p = F / S (качественно и через простые ЛУЧЕВЫЕ задачи); связь силы и площади опоры; единица давления (паскаль)"
      },
      {
        number: 15,
        title: "Давление в жидкостях. Закон Паскаля (качественно)",
        topic: "Давление",
        aspects: "Передача давления в жидкости; примеры (гидравлический пресс, тормозная система автомобиля); практические примеры и демонстрации"
      },
      {
        number: 16,
        title: "Атмосферное давление. Опыт Торричелли (качественно)",
        topic: "Давление",
        aspects: "Воздушная оболочка Земли; атмосферное давление; качественный разбор опыта Торричелли; влияние давления на погоду и человека"
      },
      {
        number: 17,
        title: "Контрольный блок по механике и давлению",
        topic: "Итог по разделу",
        aspects: "Итоговая работа/зачёт по темам движения, сил, давления; разбор типичных ошибок; закрепление ключевых формул и понятий"
      },
      {
        number: 18,
        title: "Физическая работа: определение и смысл",
        topic: "Работа и мощность",
        aspects: "Понятие работы силы; зависимость работы от силы и пройденного пути (качественно, введение формулы A = F·s); примеры работы в быту и технике"
      },
      {
        number: 19,
        title: "Единицы работы. Примеры расчётов",
        topic: "Работа и мощность",
        aspects: "Джоуль как единица работы; рамочные задачи на вычисление работы; анализ ситуаций, когда работа не совершается (перпендикулярно направленная сила и т.п. — качественно)"
      },
      {
        number: 20,
        title: "Мощность: скорость выполнения работы",
        topic: "Работа и мощность",
        aspects: "Понятие мощности; формула N = A / t (качественно и через простые числа); единица мощности — ватт; сравнение мощности разных устройств"
      },
      {
        number: 21,
        title: "КПД: эффективность использования энергии",
        topic: "Работа и мощность",
        aspects: "Понятие полезной и полной работы; качественное введение КПД; запись КПД в процентах; примеры из быта (лампы, техника, транспорт)"
      },
      {
        number: 22,
        title: "Энергия. Виды энергии",
        topic: "Энергия",
        aspects: "Понятие энергии как меры способности совершать работу; потенциальная и кинетическая энергия (качественно); примеры перехода энергии из одного вида в другой"
      },
      {
        number: 23,
        title: "Потенциальная энергия и её изменения",
        topic: "Энергия",
        aspects: "Потенциальная энергия положения (на высоте, пружина); от чего зависит (качественно: масса, высота, деформация); примеры «чем выше — тем больше запас энергии»"
      },
      {
        number: 24,
        title: "Кинетическая энергия движущихся тел",
        topic: "Энергия",
        aspects: "Качественное понимание зависимости кинетической энергии от массы и скорости; сравнение примеров: легковая/грузовая машина, мяч/пуля"
      },
      {
        number: 25,
        title: "Закон сохранения энергии (качественно)",
        topic: "Энергия",
        aspects: "Идея сохранения энергии; примеры цепочек превращений (электростанция → розетка → лампа → свет и тепло); обсуждение реальных устройств"
      },
      {
        number: 26,
        title: "Простые механизмы. Выигрыш в силе и пути",
        topic: "Простые механизмы",
        aspects: "Понятие простого механизма; принцип выигрыша в силе и проигрыша в пути; общий качественный анализ КПД механизмов"
      },
      {
        number: 27,
        title: "Рычаг: примеры и расчёты (простые)",
        topic: "Простые механизмы",
        aspects: "Рычаг как пример простого механизма; плечо силы; равновесие рычага (качественно и на числовых примерах); применение в инструментах"
      },
      {
        number: 28,
        title: "Наклонная плоскость и клин",
        topic: "Простые механизмы",
        aspects: "Наклонная плоскость; пример с подъёмом груза по наклонной; клин и его применение (нож, топор); выгода по силе/пути"
      },
      {
        number: 29,
        title: "Блоки и полиспаст",
        topic: "Простые механизмы",
        aspects: "Неподвижный и подвижный блок; схема полиспаста (качественно); как блоки позволяют изменять направление и величину силы"
      },
      {
        number: 30,
        title: "Обзор простых механизмов. Мини-проект",
        topic: "Простые механизмы",
        aspects: "Сборка/анализ макета, картинки или модели механизма; презентация простых механизмов в технике (кран, лифт, автомобильный домкрат)"
      },
      {
        number: 31,
        title: "Тепловые явления. Внутренняя энергия",
        topic: "Тепловые явления",
        aspects: "Внутренняя энергия тела (движение и взаимодействие частиц); способы изменения внутренней энергии (нагревание, работа); примеры"
      },
      {
        number: 32,
        title: "Виды теплопередачи: теплопроводность",
        topic: "Тепловые явления",
        aspects: "Теплопроводность; хорошие и плохие проводники тепла; роль теплопроводности в строительстве, одежде, технике"
      },
      {
        number: 33,
        title: "Конвекция и тепловое излучение",
        topic: "Тепловые явления",
        aspects: "Конвекция в жидкостях и газах (нагрев воздуха, течения); тепловое излучение (Солнце, костёр, радиатор); бытовые примеры"
      },
      {
        number: 34,
        title: "Итоговый урок: повторение, проекты, рефлексия",
        topic: "Обобщение курса",
        aspects: "Повтор ключевых тем года: движение, силы, работа, энергия, тепловые явления; мини-проекты и сообщения; подведение итогов и обсуждение «зачем нам эта физика»"
      }
    ]
  },
  {
    grade: 7,
    title: "Физика для 7 класса",
    description: "Курс физики для семиклассников с изучением электричества, магнетизма, света, строения атома и молекулы. Развитие навыков экспериментальной работы и решения физических задач.",
    lessons: [
      {
        number: 1,
        title: "Введение в электричество. Электрические заряды",
        topic: "Электричество",
        aspects: "Понятие электрического заряда; положительные и отрицательные заряды; взаимодействие зарядов; закон Кулона"
      },
      {
        number: 2,
        title: "Электрическое поле. Проводники и диэлектрики",
        topic: "Электричество",
        aspects: "Электрическое поле; проводники, полупроводники, диэлектрики; электрическая ёмкость"
      },
      {
        number: 3,
        title: "Электрический ток. Сила тока и напряжение",
        topic: "Электричество",
        aspects: "Понятие электрического тока; сила тока, напряжение, сопротивление; закон Ома для участка цепи"
      },
      {
        number: 4,
        title: "Работа и мощность электрического тока",
        topic: "Электричество",
        aspects: "Работа электрического тока; мощность; закон Джоуля-Ленца; расчёт потребления электроэнергии"
      },
      {
        number: 5,
        title: "Электрические цепи. Параллельное и последовательное соединение",
        topic: "Электричество",
        aspects: "Последовательное и параллельное соединение проводников; расчёт сопротивления, силы тока, напряжения"
      },
      {
        number: 6,
        title: "Магнитное поле. Магнитные линии",
        topic: "Магнетизм",
        aspects: "Магнитное поле; магнитные линии; действие магнитного поля на проводник с током"
      },
      {
        number: 7,
        title: "Электромагнитная индукция. Электромагниты",
        topic: "Магнетизм",
        aspects: "Явление электромагнитной индукции; генератор; трансформатор; электромагниты"
      },
      {
        number: 8,
        title: "Световые волны. Отражение и преломление света",
        topic: "Оптика",
        aspects: "Свет как электромагнитная волна; законы отражения и преломления света; плоское зеркало"
      },
      {
        number: 9,
        title: "Линзы. Оптические приборы",
        topic: "Оптика",
        aspects: "Собирающие и рассеивающие линзы; оптическая сила линзы; оптические приборы (очки, лупа, микроскоп)"
      },
      {
        number: 10,
        title: "Строение атома. Атомное ядро",
        topic: "Строение вещества",
        aspects: "Строение атома; протоны, нейтроны, электроны; радиоактивность; ядерные реакции"
      },
      {
        number: 11,
        title: "Химические элементы и периодическая система",
        topic: "Строение вещества",
        aspects: "Понятие химического элемента; периодическая система Менделеева; группы и периоды"
      },
      {
        number: 12,
        title: "Молекулы и химические соединения",
        topic: "Строение вещества",
        aspects: "Молекулы; химические формулы; валентность; растворы и их свойства"
      },
      {
        number: 13,
        title: "Итоговое повторение: электричество и магнетизм",
        topic: "Повторение",
        aspects: "Ключевые понятия электричества и магнетизма; решение задач; подготовка к контрольной работе"
      },
      {
        number: 14,
        title: "Итоговое повторение: оптика и строение вещества",
        topic: "Повторение",
        aspects: "Ключевые понятия оптики и строения вещества; решение задач; итоговый проект"
      }
    ]
  },
  {
    grade: 8,
    title: "Физика для 8 класса",
    description: "Курс физики для восьмиклассников с изучением механических и электромагнитных колебаний, волн, элементов квантовой физики. Развитие навыков математического моделирования физических явлений.",
    lessons: [
      {
        number: 1,
        title: "Механические колебания. Маятник",
        topic: "Колебания и волны",
        aspects: "Понятие колебаний; маятник; амплитуда, период, частота; свободные и вынужденные колебания"
      },
      {
        number: 2,
        title: "Электромагнитные колебания. Генератор",
        topic: "Колебания и волны",
        aspects: "Электромагнитные колебания; колебательный контур; генератор электромагнитных колебаний"
      },
      {
        number: 3,
        title: "Электромагнитные волны. Радиосвязь",
        topic: "Колебания и волны",
        aspects: "Электромагнитные волны; скорость распространения; радиосвязь; телевидение"
      },
      {
        number: 4,
        title: "Механические волны. Звук",
        topic: "Колебания и волны",
        aspects: "Поперечные и продольные волны; скорость звука; отражение и преломление волн; эхо"
      },
      {
        number: 5,
        title: "Звуковые колебания. Высота и тембр звука",
        topic: "Колебания и волны",
        aspects: "Частота и амплитуда звуковых колебаний; высота, громкость и тембр звука; ультразвук"
      },
      {
        number: 6,
        title: "Свет как электромагнитная волна",
        topic: "Оптика",
        aspects: "Свет как электромагнитная волна; спектр электромагнитных волн; дисперсия света"
      },
      {
        number: 7,
        title: "Интерференция и дифракция света",
        topic: "Оптика",
        aspects: "Интерференция света; дифракция; опыты Юнга; голография"
      },
      {
        number: 8,
        title: "Фотоэффект. Квантовая природа света",
        topic: "Квантовая физика",
        aspects: "Фотоэффект; фотон; уравнение Эйнштейна; квантовая природа света"
      },
      {
        number: 9,
        title: "Строение атомного ядра. Радиоактивность",
        topic: "Физика атомного ядра",
        aspects: "Строение атомного ядра; изотопы; альфа-, бета-, гамма-излучения; закон радиоактивного распада"
      },
      {
        number: 10,
        title: "Ядерные реакции. Энергия связи",
        topic: "Физика атомного ядра",
        aspects: "Деление и синтез ядер; цепная реакция; ядерная энергетика; энергия связи"
      },
      {
        number: 11,
        title: "Элементарные частицы",
        topic: "Физика элементарных частиц",
        aspects: "Лептоны, адроны, кварки; фундаментальные взаимодействия; Стандартная модель"
      },
      {
        number: 12,
        title: "Итоговое повторение: колебания и волны",
        topic: "Повторение",
        aspects: "Ключевые понятия колебаний и волн; решение задач; лабораторные работы"
      },
      {
        number: 13,
        title: "Итоговое повторение: современная физика",
        topic: "Повторение",
        aspects: "Ключевые понятия квантовой физики и физики атомного ядра; итоговый тест"
      }
    ]
  },
  {
    grade: 9,
    title: "Физика для 9 класса",
    description: "Курс физики для девятиклассников с углубленным изучением механики, термодинамики, электродинамики и основ квантовой физики. Подготовка к ЕГЭ и развитию системного мышления.",
    lessons: [
      {
        number: 1,
        title: "Кинематика материальной точки",
        topic: "Механика",
        aspects: "Прямолинейное равномерное и равноускоренное движение; уравнения движения; графики зависимости"
      },
      {
        number: 2,
        title: "Законы Ньютона. Динамика",
        topic: "Механика",
        aspects: "Первый, второй и третий законы Ньютона; силы в механике; решение задач динамики"
      },
      {
        number: 3,
        title: "Импульс. Закон сохранения импульса",
        topic: "Механика",
        aspects: "Импульс тела; закон сохранения импульса; упругие и неупругие столкновения"
      },
      {
        number: 4,
        title: "Механическая энергия. Закон сохранения энергии",
        topic: "Механика",
        aspects: "Кинетическая и потенциальная энергия; закон сохранения механической энергии; мощность"
      },
      {
        number: 5,
        title: "Молекулярно-кинетическая теория",
        topic: "Термодинамика",
        aspects: "Молекулярное строение вещества; броуновское движение; диффузия; температуры"
      },
      {
        number: 6,
        title: "Внутренняя энергия. Теплообмен",
        topic: "Термодинамика",
        aspects: "Внутренняя энергия; теплопередача; работа газа; первое начало термодинамики"
      },
      {
        number: 7,
        title: "Электростатика. Закон Кулона",
        topic: "Электродинамика",
        aspects: "Электрическое поле; потенциал; ёмкость; диэлектрики; закон Кулона"
      },
      {
        number: 8,
        title: "Электрический ток. Закон Ома",
        topic: "Электродинамика",
        aspects: "Сила тока; напряжение; сопротивление; закон Ома; последовательное и параллельное соединение"
      },
      {
        number: 9,
        title: "Магнитное поле. Закон Ампера",
        topic: "Электродинамика",
        aspects: "Магнитное поле; сила Ампера; магнитная индукция; соленоид; электромотор"
      },
      {
        number: 10,
        title: "Электромагнитная индукция",
        topic: "Электродинамика",
        aspects: "Закон Фарадея; ЭДС индукции; самоиндукция; трансформатор; генератор"
      },
      {
        number: 11,
        title: "Колебания и волны",
        topic: "Колебания и волны",
        aspects: "Гармонические колебания; резонанс; волновое уравнение; интерференция; дифракция"
      },
      {
        number: 12,
        title: "Фотоэффект и квантовая физика",
        topic: "Квантовая физика",
        aspects: "Фотоэффект; фотон; корпускулярно-волновой дуализм; уравнение де Бройля"
      },
      {
        number: 13,
        title: "Атом и атомное ядро",
        topic: "Физика микромира",
        aspects: "Модель атома Резерфорда-Бора; радиоактивность; ядерные реакции; элементарные частицы"
      },
      {
        number: 14,
        title: "Подготовка к экзамену. Итоговое повторение",
        topic: "Повторение",
        aspects: "Комплексное повторение всех тем курса; решение задач ЕГЭ; анализ ошибок"
      }
    ]
  },
  {
    grade: 10,
    title: "Физика для 10 класса",
    description: "Углубленный курс физики для десятиклассников с изучением всех разделов физики на повышенном уровне. Интенсивная подготовка к ЕГЭ с решением сложных задач.",
    lessons: [
      {
        number: 1,
        title: "Механика: кинематика и динамика",
        topic: "Механика",
        aspects: "Криволинейное движение; неинерциальные системы отсчёта; законы Ньютона в различных системах"
      },
      {
        number: 2,
        title: "Законы сохранения в механике",
        topic: "Механика",
        aspects: "Закон сохранения импульса; закон сохранения энергии; центральные столкновения"
      },
      {
        number: 3,
        title: "Механические колебания и волны",
        topic: "Колебания и волны",
        aspects: "Дифференциальное уравнение гармонических колебаний; затухающие колебания; стоячие волны"
      },
      {
        number: 4,
        title: "Термодинамика и молекулярная физика",
        topic: "Термодинамика",
        aspects: "Первое и второе начала термодинамики; энтропия; цикл Карно; реальные газы"
      },
      {
        number: 5,
        title: "Электростатика и постоянный ток",
        topic: "Электродинамика",
        aspects: "Электрическое поле в вакууме и диэлектриках; закон Гаусса; цепи постоянного тока"
      },
      {
        number: 6,
        title: "Магнитное поле и электромагнитная индукция",
        topic: "Электродинамика",
        aspects: "Магнитное поле токов; закон Био-Савара-Лапласа; вихревое электрическое поле"
      },
      {
        number: 7,
        title: "Электромагнитные колебания и волны",
        topic: "Электродинамика",
        aspects: "Колебательный контур; резонанс; электромагнитные волны; уравнения Максвелла"
      },
      {
        number: 8,
        title: "Волновая оптика",
        topic: "Оптика",
        aspects: "Интерференция; дифракция; поляризация; голография; волновые свойства света"
      },
      {
        number: 9,
        title: "Квантовая физика и атомная физика",
        topic: "Квантовая физика",
        aspects: "Корпускулярно-волновой дуализм; неопределённости принцип; атом Бора; лазеры"
      },
      {
        number: 10,
        title: "Физика атомного ядра и элементарных частиц",
        topic: "Физика микромира",
        aspects: "Модели атомного ядра; ядерные реакции; ускорители; фундаментальные взаимодействия"
      },
      {
        number: 11,
        title: "Специальная теория относительности",
        topic: "Релятивистская физика",
        aspects: "Постулаты Эйнштейна; преобразования Лоренца; релятивистская динамика; энергия и импульс"
      },
      {
        number: 12,
        title: "Физика твёрдого тела",
        topic: "Физика конденсированного состояния",
        aspects: "Кристаллическая структура; зонная теория; полупроводники; сверхпроводимость"
      },
      {
        number: 13,
        title: "Подготовка к ЕГЭ: решение задач",
        topic: "Подготовка к экзамену",
        aspects: "Анализ заданий ЕГЭ; стратегия решения; типичные ошибки; интенсивная практика"
      },
      {
        number: 14,
        title: "Итоговое повторение и анализ",
        topic: "Итоговое повторение",
        aspects: "Комплексное повторение всех тем; демоверсия ЕГЭ; анализ результатов; рекомендации"
      }
    ]
  },
  {
    grade: 11,
    title: "Физика для 11 класса",
    description: "Заключительный курс физики для одиннадцатиклассников с углубленным изучением всех разделов и интенсивной подготовкой к ЕГЭ. Развитие навыков самостоятельного мышления и исследовательской работы.",
    lessons: [
      {
        number: 1,
        title: "Механика: углубленное изучение",
        topic: "Механика",
        aspects: "Теория относительности Галилея; принцип эквивалентности; теория удара; гироскопы"
      },
      {
        number: 2,
        title: "Специальная теория относительности",
        topic: "Релятивистская физика",
        aspects: "Преобразования Лоренца; релятивистские эффекты; четырехмерный мир Минковского"
      },
      {
        number: 3,
        title: "Термодинамика и статистическая физика",
        topic: "Термодинамика",
        aspects: "Статистическая физика; распределение Максвелла-Больцмана; флуктуации; фазовые переходы"
      },
      {
        number: 4,
        title: "Электродинамика: уравнения Максвелла",
        topic: "Электродинамика",
        aspects: "Полная система уравнений Максвелла; электромагнитное поле; электромагнитные волны в средах"
      },
      {
        number: 5,
        title: "Оптика: геометрическая и волновая",
        topic: "Оптика",
        aspects: "Матричный метод в геометрической оптике; волновые свойства света; квантовая оптика"
      },
      {
        number: 6,
        title: "Квантовая механика",
        topic: "Квантовая физика",
        aspects: "Уравнение Шрёдингера; операторы; принцип суперпозиции; туннельный эффект"
      },
      {
        number: 7,
        title: "Квантовая электродинамика",
        topic: "Квантовая физика",
        aspects: "Квантование электромагнитного поля; фотоны; взаимодействие света и вещества"
      },
      {
        number: 8,
        title: "Физика твердого тела",
        topic: "Физика конденсированного состояния",
        aspects: "Кристаллическая решётка; фононы; магнетизм; сверхтекучесть и сверхпроводимость"
      },
      {
        number: 9,
        title: "Физика плазмы и газового разряда",
        topic: "Плазма и газовый разряд",
        aspects: "Плазма; газовый разряд; плазменные технологии; термоядерный синтез"
      },
      {
        number: 10,
        title: "Физика элементарных частиц",
        topic: "Физика высоких энергий",
        aspects: "Стандартная модель; кварковая модель; Большой адронный коллайдер; бозон Хиггса"
      },
      {
        number: 11,
        title: "Космология и астрофизика",
        topic: "Астрофизика",
        aspects: "Большой взрыв; расширение Вселенной; реликтовое излучение; темная материя и энергия"
      },
      {
        number: 12,
        title: "Современные проблемы физики",
        topic: "Фронтиры физики",
        aspects: "Теория струн; многомерная Вселенная; квантовая гравитация; единая теория поля"
      },
      {
        number: 13,
        title: "Интенсивная подготовка к ЕГЭ",
        topic: "Подготовка к ЕГЭ",
        aspects: "Комплексное решение задач ЕГЭ; анализ всех типов заданий; стратегия экзамена"
      },
      {
        number: 14,
        title: "Финальное повторение и перспективы",
        topic: "Заключительное повторение",
        aspects: "Обзор достижений современной физики; выбор специализации; карьера в физике"
      }
    ]
  },
  {
    grade: 5,
    title: "История для 5 класса",
    description: "Вводный курс истории для пятиклассников с изучением первобытного общества, Древнего Востока, Древней Греции и Древнего Рима. Формирование базовых исторических понятий, навыков работы с источниками, картами и хронологией.",
    lessons: [
      {
        number: 1,
        title: "Зачем изучать историю",
        topic: "Введение",
        aspects: "Понятие истории; чем история отличается от прошлого; задачи историка; польза истории для современного человека"
      },
      {
        number: 2,
        title: "Исторические источники",
        topic: "Введение",
        aspects: "Виды источников (вещевые, письменные, устные, изобразительные); надёжность источников; примеры источников для древней истории"
      },
      {
        number: 3,
        title: "Историческое время и линия времени",
        topic: "Введение",
        aspects: "Понятие «век», «тысячелетие»; до н. э. и н. э.; как читать даты; шкала времени, упорядочивание событий"
      },
      {
        number: 4,
        title: "Историческая карта и работа с ней",
        topic: "Введение",
        aspects: "Условные знаки; стороны горизонта; поиск объектов на исторической карте; связь карты и текста параграфа"
      },
      {
        number: 5,
        title: "Появление человека на Земле",
        topic: "Первобытное общество",
        aspects: "Основные версии происхождения человека; отличия человека от животных; древнейшие стоянки людей"
      },
      {
        number: 6,
        title: "Жизнь первобытных охотников и собирателей",
        topic: "Первобытное общество",
        aspects: "Палеолит; орудия труда; охота и собирательство; роль общины; первобытное искусство (наскальные рисунки)"
      },
      {
        number: 7,
        title: "Неолитическая революция: переход к земледелию",
        topic: "Первобытное общество",
        aspects: "Причины перехода к производящему хозяйству; земледелие и скотоводство; оседлый образ жизни; последствия для общества"
      },
      {
        number: 8,
        title: "Первые ремёсла и обмен",
        topic: "Первобытное общество",
        aspects: "Гончарное дело, ткачество, обработка металла; обмен и зачатки торговли; специализация труда"
      },
      {
        number: 9,
        title: "Родовая община и её устройство",
        topic: "Первобытное общество",
        aspects: "Род и племя; старейшины и вожди; обычаи и традиции; зарождение религиозных представлений"
      },
      {
        number: 10,
        title: "Обобщающий урок по первобытному обществу",
        topic: "Первобытное общество",
        aspects: "Повторение ключевых понятий; хронологическая линия первобытности; работа с картой и источниками; мини-тест/проект"
      },
      {
        number: 11,
        title: "Природа и народы Древнего Востока",
        topic: "Древний Восток",
        aspects: "Понятие «Древний Восток»; роль крупных рек (Нил, Тигр, Евфрат, Инд, Хуанхэ); природные условия и их влияние на хозяйство"
      },
      {
        number: 12,
        title: "Города-государства Междуречья. Шумер",
        topic: "Древний Восток",
        aspects: "Понятие города-государства; устройство шумерских городов; зиккураты; клинопись как система письма"
      },
      {
        number: 13,
        title: "Вавилон и законы Хаммурапи",
        topic: "Древний Восток",
        aspects: "Вавилон как центр государства; образ царя; сборник законов Хаммурапи; понятие «закон» и «наказание»"
      },
      {
        number: 14,
        title: "Древний Египет: страна вдоль Нила",
        topic: "Древний Восток",
        aspects: "Нил как «дар Египта»; наводнения, ирригация; объединение Верхнего и Нижнего Египта; символика фараона"
      },
      {
        number: 15,
        title: "Фараон и управление страной",
        topic: "Древний Восток",
        aspects: "Власть фараона; жрецы, чиновники, писцы; налоги; царский двор и армия"
      },
      {
        number: 16,
        title: "Жизнь земледельцев и ремесленников в Египте",
        topic: "Древний Восток",
        aspects: "Повседневный быт крестьян; сельскохозяйственный труд; ремесленные мастерские; первые деньги и обмен"
      },
      {
        number: 17,
        title: "Религия, пирамиды и загробный мир",
        topic: "Древний Восток",
        aspects: "Многобожие; представления о душе; пирамиды и их назначение; погребальные обряды, книга мёртвых (общие представления)"
      },
      {
        number: 18,
        title: "Древняя Индия",
        topic: "Древний Восток",
        aspects: "Реки Инд и Ганг; города Хараппы и Мохенджо-Даро (на базовом уровне); касты; основные занятия населения"
      },
      {
        number: 19,
        title: "Древний Китай",
        topic: "Древний Восток",
        aspects: "Реки Хуанхэ и Янцзы; «жёлтое» и «чёрное» земледелие; Великая Китайская стена (как символ); роль императора"
      },
      {
        number: 20,
        title: "Обобщающий урок по Древнему Востоку",
        topic: "Древний Восток",
        aspects: "Сравнение Египта, Междуречья, Индии и Китая; общее и различия; работа с таблицей и картой; базовая хронология региона"
      },
      {
        number: 21,
        title: "Природа и народы Древней Греции",
        topic: "Древняя Греция",
        aspects: "Полуострова и острова Греции; горный рельеф и море; влияние природы на занятия греков; колонии"
      },
      {
        number: 22,
        title: "Город-полис и граждане",
        topic: "Древняя Греция",
        aspects: "Понятие полиса; граждане и неграждане; народное собрание; агоры и акрополь"
      },
      {
        number: 23,
        title: "Афины: путь к демократии",
        topic: "Древняя Греция",
        aspects: "Устройство Афин; реформы (на уровне 5 класса — упрощённо); народное собрание и суд; роль гражданина"
      },
      {
        number: 24,
        title: "Спарта: воспитание воина",
        topic: "Древняя Греция",
        aspects: "Устройство Спарты; спартанское воспитание; различия Афин и Спарты; понятие воинской дисциплины"
      },
      {
        number: 25,
        title: "Греко-персидские войны",
        topic: "Древняя Греция",
        aspects: "Причины конфликтов; Марафон и Саламин (на уровне сюжетного рассказа); значение побед греков"
      },
      {
        number: 26,
        title: "Афины времён Перикла",
        topic: "Древняя Греция",
        aspects: "«Золотой век» Афин; строительство храмов; развитие искусства и философии (в общем виде); роль Перикла"
      },
      {
        number: 27,
        title: "Культура Древней Греции: мифы, театр, спорт",
        topic: "Древняя Греция",
        aspects: "Мифология (олимпийские боги, герои); театр и маски; Олимпийские игры; наследие греческой культуры"
      },
      {
        number: 28,
        title: "Александр Македонский и его походы",
        topic: "Древняя Греция",
        aspects: "Фигура Александра; завоевательные походы (карта); смешение культур; значение его империи"
      },
      {
        number: 29,
        title: "Легенды о возникновении Рима",
        topic: "Древний Рим",
        aspects: "Ромул и Рем; Троянская легенда (Эней); география Апеннинского полуострова; латинские племена"
      },
      {
        number: 30,
        title: "Римская республика: устройство",
        topic: "Древний Рим",
        aspects: "Сенат, народные собрания, магистраты; патриции и плебеи; граждане и их обязанности"
      },
      {
        number: 31,
        title: "Повседневная жизнь римлян",
        topic: "Древний Рим",
        aspects: "Римский дом и быт; одежда, питание; школы и воспитание детей; развлечения (цирк, гладиаторские бои — аккуратно, без натурализма)"
      },
      {
        number: 32,
        title: "Римская империя и император Август",
        topic: "Древний Рим",
        aspects: "Переход от республики к империи (в обобщённом виде); фигура Августа; укрепление власти; расширение государства"
      },
      {
        number: 33,
        title: "Культура и достижения Древнего Рима",
        topic: "Древний Рим",
        aspects: "Дороги, акведуки, амфитеатры; римское право на простом уровне; латинский язык и его влияние"
      },
      {
        number: 34,
        title: "Падение Западной Римской империи и итоги курса",
        topic: "Древний Рим / Итог",
        aspects: "Внутренние проблемы и нашествия варваров (очень упрощённо); падение 476 г.; повторение курса: что такое история, древние цивилизации и их наследие"
      }
    ]
  },
  {
    grade: 5,
    title: "География для 5 класса",
    description: "Вводный курс географии для пятиклассников с изучением Земли как планеты, методов географических исследований, изображения Земли на картах и глобусе, оболочек Земли, материков и океанов, природы России. Формирование базовых географических понятий и навыков работы с картами.",
    lessons: [
      {
        number: 1,
        title: "Введение в географию",
        topic: "Введение",
        aspects: "Понятие «география»; что и зачем изучает география; объекты и явления природы; роль географии в жизни человека"
      },
      {
        number: 2,
        title: "Методы географических исследований",
        topic: "Введение",
        aspects: "Наблюдение, описание, измерение, картографирование, фото- и аэрофотосъёмка, ГИС; примеры из реальной жизни"
      },
      {
        number: 3,
        title: "География в жизни общества и профессии географов",
        topic: "Введение",
        aspects: "Где применяется география (транспорт, экология, городское планирование, туризм); современные географические профессии"
      },
      {
        number: 4,
        title: "Работа с атласом и контурной картой",
        topic: "Введение",
        aspects: "Структура атласа; легенда; правила штриховки и подписи объектов; базовые требования к оформлению контурных карт"
      },
      {
        number: 5,
        title: "Земля в Солнечной системе",
        topic: "Земля как планета",
        aspects: "Солнце и планеты; место Земли в Солнечной системе; уникальность Земли (вода, атмосфера, жизнь)"
      },
      {
        number: 6,
        title: "Форма и размеры Земли. Параллели и меридианы",
        topic: "Земля как планета",
        aspects: "Геоид и шар; экватор; параллели и меридианы; полюса; отличие карты от глобуса по искажению форм и расстояний"
      },
      {
        number: 7,
        title: "Движения Земли и смена времён года",
        topic: "Земля как планета",
        aspects: "Суточное и годовое движение; смена дня и ночи; наклон оси; смена времён года; освещённость Земли Солнцем"
      },
      {
        number: 8,
        title: "Градусная сеть Земли",
        topic: "Земля как планета",
        aspects: "Градусы широты и долготы; определение координат по глобусу и карте; практические задания по поиску точек"
      },
      {
        number: 9,
        title: "Пояса освещённости и часовые пояса",
        topic: "Земля как планета",
        aspects: "Пояса освещённости; полярный день и ночь; понятие часового пояса; примеры различий местного времени"
      },
      {
        number: 10,
        title: "Глобус – модель Земли",
        topic: "Изображение Земли",
        aspects: "Глобус как уменьшенная модель; достоинства и ограничения глобуса; поиск объектов на глобусе (материки, океаны)"
      },
      {
        number: 11,
        title: "План местности и масштаб",
        topic: "Изображение Земли",
        aspects: "Понятие «план местности»; условие «вид сверху»; масштаб (численный, именованный, линейный); уменьшение и увеличение расстояний"
      },
      {
        number: 12,
        title: "Условные знаки плана местности",
        topic: "Изображение Земли",
        aspects: "Виды условных знаков; правило чтения плана; обозначение дорог, рек, строений, лесов; создание простого плана класса/школы"
      },
      {
        number: 13,
        title: "Топографическая карта",
        topic: "Изображение Земли",
        aspects: "Отличия карты от плана; топографические карты крупного масштаба; работа с фрагментом топографической карты"
      },
      {
        number: 14,
        title: "Географические карты и их виды",
        topic: "Изображение Земли",
        aspects: "Физические, политические, тематические карты; понятия «масштаб карты», «легенда»; примеры использования разных карт"
      },
      {
        number: 15,
        title: "Практикум: чтение географической карты",
        topic: "Изображение Земли",
        aspects: "Определение направлений, расстояний, высот; поиск объектов на карте; комплексный разбор фрагмента карты мира/страны"
      },
      {
        number: 16,
        title: "Внутреннее строение Земли и литосфера",
        topic: "Оболочки Земли",
        aspects: "Ядро, мантия, земная кора; литосфера и литосферные плиты (на уровне представлений); землетрясения и вулканы (кратко)"
      },
      {
        number: 17,
        title: "Формы земной поверхности: равнины и горы",
        topic: "Оболочки Земли",
        aspects: "Понятие рельефа; равнины, горы, холмы, овраги; абсолютная и относительная высота; чтение рельефа по карте (цвета, изогипсы)"
      },
      {
        number: 18,
        title: "Гидросфера: Мировой океан",
        topic: "Оболочки Земли",
        aspects: "Понятие гидросферы; Мировой океан и его части; океаны Земли; значение океана для климата и жизни на планете"
      },
      {
        number: 19,
        title: "Гидросфера: воды суши",
        topic: "Оболочки Земли",
        aspects: "Реки, озёра, болота, ледники, подземные воды; части реки; круговорот воды в природе; примеры крупных рек мира и России"
      },
      {
        number: 20,
        title: "Атмосфера: строение и значение",
        topic: "Оболочки Земли",
        aspects: "Состав воздуха; слои атмосферы (на уровне представлений); значение атмосферы для жизни; загрязнение воздуха и его последствия"
      },
      {
        number: 21,
        title: "Погода и климат",
        topic: "Оболочки Земли",
        aspects: "Элементы погоды (температура, осадки, ветер, облачность); наблюдения за погодой; отличие погоды от климата; климатические пояса (общее представление)"
      },
      {
        number: 22,
        title: "Биосфера и взаимодействие природы и человека",
        topic: "Оболочки Земли",
        aspects: "Понятие биосферы; границы распространения жизни; влияние человека на природу; примеры рационального и нерационального природопользования"
      },
      {
        number: 23,
        title: "Материки и океаны Земли: обзор",
        topic: "Материки и океаны",
        aspects: "Расположение материков и океанов на карте и глобусе; соотношение площади суши и океана; краткая характеристика материков"
      },
      {
        number: 24,
        title: "Евразия: положение и природное разнообразие",
        topic: "Материки и океаны",
        aspects: "Географическое положение Евразии; крайние точки; особенности береговой линии; примеры крупных форм рельефа и рек; климатическое разнообразие"
      },
      {
        number: 25,
        title: "Африка: самый жаркий материк",
        topic: "Материки и океаны",
        aspects: "Положение Африки; экватор, тропики; пустыни и саванны; крупные реки и озёра; особенности климата и животного мира"
      },
      {
        number: 26,
        title: "Северная Америка: природа и рельеф",
        topic: "Материки и океаны",
        aspects: "Географическое положение; основные формы рельефа (Кордильеры, равнины); крупные реки и озёра; природные зоны в общих чертах"
      },
      {
        number: 27,
        title: "Южная Америка: влажные леса и Анды",
        topic: "Материки и океаны",
        aspects: "Положение материка; Амазонка и Амазония; горы Анды; особенности климата и природы тропических лесов"
      },
      {
        number: 28,
        title: "Австралия и Океания",
        topic: "Материки и океаны",
        aspects: "Положение Австралии; особенности климата и природы (саванны, пустыни); уникальность животного мира; острова Океании (обзор)"
      },
      {
        number: 29,
        title: "Антарктида – материк холода",
        topic: "Материки и океаны",
        aspects: "Географическое положение; ледниковый покров; полярный климат; научные станции; значение Антарктиды для науки и климата Земли"
      },
      {
        number: 30,
        title: "Географическое положение России",
        topic: "Природа России",
        aspects: "Площадь и протяжённость России; положение относительно океанов и материков; соседи; крайние точки и границы"
      },
      {
        number: 31,
        title: "Рельеф и полезные ископаемые России",
        topic: "Природа России",
        aspects: "Основные формы рельефа (равнины, Урал, Кавказ, Сибирь); понятие «полезные ископаемые»; основные районы добычи (на уровне примеров)"
      },
      {
        number: 32,
        title: "Внутренние воды России: реки и озёра",
        topic: "Природа России",
        aspects: "Крупные реки (Волга, Обь, Енисей, Лена, Амур и др.); озёра (Байкал, Ладожское, Онежское и др.); значение водных ресурсов"
      },
      {
        number: 33,
        title: "Природные зоны России",
        topic: "Природа России",
        aspects: "Понятие «природная зона»; тундра, лесотундра, тайга, смешанные и широколиственные леса, степи, полупустыни и пустыни, высокогорья; особенности климата, растительности и животных"
      },
      {
        number: 34,
        title: "Охрана природы и особо охраняемые территории России. Итог по курсу",
        topic: "Природа России",
        aspects: "Национальные парки и заповедники; примеры ООПТ; экологические проблемы; повторение ключевых понятий курса и подведение итогов года"
      }
    ]
  },
  {
    grade: 6,
    title: "География для 6 класса",
    description: "Курс географии для шестиклассников с изучением географической оболочки, природных комплексов, природных зон мира, Мирового океана, материков и их природы, влияния человека на природные комплексы и охраны природы.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс географии 6 класса",
        topic: "Введение",
        aspects: "Структура курса; место 6 класса в изучении географии; повтор ключевых понятий 5 класса (план, карта, масштаб, оболочки Земли)"
      },
      {
        number: 2,
        title: "Географическая оболочка и природные комплексы",
        topic: "Общая физическая география",
        aspects: "Понятие географической оболочки; взаимосвязь литосферы, гидросферы, атмосферы и биосферы; пример природного комплекса (лес, озеро, река и др.)"
      },
      {
        number: 3,
        title: "Закономерности распределения природных комплексов",
        topic: "Общая физическая география",
        aspects: "Широтная зональность; высотная поясность; влияние климата и рельефа; связь «климат – воды – почвы – растительность – животные»"
      },
      {
        number: 4,
        title: "Природные зоны мира: обзор",
        topic: "Природные зоны мира",
        aspects: "Понятие природной зоны; карта природных зон мира; основные типы зон (тундра, леса, степи, пустыни, саванны, влажные леса)"
      },
      {
        number: 5,
        title: "Арктические пустыни и тундра",
        topic: "Природные зоны мира",
        aspects: "Географическое положение; климат; мерзлота; типичные растения и животные; хозяйственная деятельность и её проблемы"
      },
      {
        number: 6,
        title: "Лесные природные зоны",
        topic: "Природные зоны мира",
        aspects: "Тайга, смешанные и широколиственные леса; климат; состав лесов; значение леса; вырубка лесов и охрана"
      },
      {
        number: 7,
        title: "Степи и саванны",
        topic: "Природные зоны мира",
        aspects: "Географическое положение степей и саванн; особенности климата; растительность и животные; земледелие и животноводство; деградация земель"
      },
      {
        number: 8,
        title: "Пустыни и полупустыни",
        topic: "Природные зоны мира",
        aspects: "Причины формирования пустынь; особенности климата; приспособления растений и животных; оазисы; опустынивание"
      },
      {
        number: 9,
        title: "Влажные экваториальные леса",
        topic: "Природные зоны мира",
        aspects: "Расположение; экваториальный климат; многоярусность леса; биоразнообразие; вырубка тропических лесов и последствия"
      },
      {
        number: 10,
        title: "Мировой океан как часть географической оболочки",
        topic: "Мировой океан",
        aspects: "Понятие Мирового океана; океаны Земли; рельеф дна; свойства морской воды; роль океана в климате и жизни человека"
      },
      {
        number: 11,
        title: "Воды Мирового океана и их движение",
        topic: "Мировой океан",
        aspects: "Морские течения, приливы и отливы, волны; влияние течений на климат и судоходство; примеры крупных течений"
      },
      {
        number: 12,
        title: "Проблемы Мирового океана и его охрана",
        topic: "Мировой океан",
        aspects: "Загрязнение океана; перелов рыбы; нефтяные разливы; международные меры по охране; морские заповедники"
      },
      {
        number: 13,
        title: "Материки и океаны: повторение и детализация",
        topic: "Материки мира",
        aspects: "Уточнение положения материков и океанов; крайние точки; размеры и конфигурация материков; связь с природными зонами"
      },
      {
        number: 14,
        title: "Евразия: географическое положение и рельеф",
        topic: "Евразия",
        aspects: "Особенности положения (самый большой материк); крайние точки; основные формы рельефа (горы, равнины, плоскогорья); районы активной тектоники"
      },
      {
        number: 15,
        title: "Евразия: климат и внутренние воды",
        topic: "Евразия",
        aspects: "Климатическое разнообразие; факторы климата (широта, рельеф, океаны); крупные реки и озёра; режим рек; значение водных ресурсов"
      },
      {
        number: 16,
        title: "Евразия: природные зоны и охрана природы",
        topic: "Евразия",
        aspects: "Основные природные зоны материка; примеры уникальных территорий; особо охраняемые природные территории; антропогенная нагрузка"
      },
      {
        number: 17,
        title: "Африка: географическое положение и рельеф",
        topic: "Африка",
        aspects: "Положение относительно экватора и тропиков; береговая линия; плато и горы; Сахара и другие крупные природные объекты"
      },
      {
        number: 18,
        title: "Африка: климат, внутренние воды и природные зоны",
        topic: "Африка",
        aspects: "Главные климатические пояса; Нил и другие крупные реки; озёра Восточно-Африканского рифта; саванны, пустыни, влажные леса; проблемы опустынивания"
      },
      {
        number: 19,
        title: "Африка: природа и человек",
        topic: "Африка",
        aspects: "Традиционные виды хозяйства; влияние климата на образ жизни людей; экологические проблемы (вырубка, деградация земель, вододефицит)"
      },
      {
        number: 20,
        title: "Северная Америка: положение и рельеф",
        topic: "Америки",
        aspects: "Географическое положение материка; особенности береговой линии; главные формы рельефа (Кордильеры, Аппалачи, Центральные равнины)"
      },
      {
        number: 21,
        title: "Северная Америка: климат, воды и природные зоны",
        topic: "Америки",
        aspects: "Климатическое разнообразие; крупные реки и озёра (Миссисипи, Великие озёра и др.); леса, прерии, пустыни; природные контрасты с севера на юг"
      },
      {
        number: 22,
        title: "Южная Америка: положение, рельеф и воды",
        topic: "Америки",
        aspects: "Положение относительно экватора и тропика; Анды; Амазонка и её бассейн; водопады и озёра; особенности рельефа восточной части материка"
      },
      {
        number: 23,
        title: "Южная Америка: климат, природные зоны и экосистемы",
        topic: "Америки",
        aspects: "Влажные экваториальные леса Амазонии; саванны (льянос, кампос); пустыни (Атакама); влияние океанских течений; экологические проблемы региона"
      },
      {
        number: 24,
        title: "Австралия и Океания: особенности природы",
        topic: "Австралия и Океания",
        aspects: "Положение Австралии; преобладание равнин; сухой климат и пустыни; уникальный животный мир; островные государства Океании (обзор)"
      },
      {
        number: 25,
        title: "Антарктида: материк холода и науки",
        topic: "Антарктида",
        aspects: "Географическое положение; ледниковый покров; полярный климат; научные станции; правовой режим Антарктиды; значение для изучения климата"
      },
      {
        number: 26,
        title: "Сравнительная характеристика материков",
        topic: "Итог по материкам",
        aspects: "Сравнение материков по площади, рельефу, климату, природным зонам; выявление общих черт и отличий; роль материков в жизни человечества"
      },
      {
        number: 27,
        title: "Природные комплексы суши: горные и равнинные области",
        topic: "Природные комплексы",
        aspects: "Отличия горных и равнинных ландшафтов; примеры горных систем и равнин мира; влияние высоты на природу и хозяйство"
      },
      {
        number: 28,
        title: "Природные комплексы побережий и островов",
        topic: "Природные комплексы",
        aspects: "Особенности побережий морей и океанов; морские побережные ландшафты; островные природные комплексы; туризм и его влияние на природу"
      },
      {
        number: 29,
        title: "Влияние человека на природные комплексы",
        topic: "Природные комплексы",
        aspects: "Основные виды воздействия (вырубка лесов, загрязнение вод и воздуха, добыча полезных ископаемых); примеры крупных экологических проблем мира"
      },
      {
        number: 30,
        title: "Охрана природы и устойчивое развитие",
        topic: "Охрана природы",
        aspects: "Концепция устойчивого развития; международные соглашения по охране природы; заповедники, национальные парки и резерваторы мира"
      },
      {
        number: 31,
        title: "Природа России в системе природных зон мира",
        topic: "Природа России и мира",
        aspects: "Сопоставление природных зон мира и России; какие зоны представлены в России; роль России в сохранении северных экосистем"
      },
      {
        number: 32,
        title: "Природные комплексы своего региона (края, области)",
        topic: "Региональный компонент",
        aspects: "Географическое положение региона; основные формы рельефа; климат; природные зоны и ландшафты региона; примеры местных природных объектов"
      },
      {
        number: 33,
        title: "Экологические проблемы своего региона и пути их решения",
        topic: "Региональный компонент",
        aspects: "Источники загрязнения; состояние воды, воздуха, почв; локальные примеры; меры по охране природы; участие школьников в экопроектах"
      },
      {
        number: 34,
        title: "Итоговый обобщающий урок по курсу 6 класса",
        topic: "Итог по курсу",
        aspects: "Рефлексия по ключевым темам года; систематизация понятий «географическая оболочка», «природная зона», «природный комплекс»; мини-тест/игровая форма контроля"
      }
    ]
  },
  {
    grade: 7,
    title: "География для 7 класса",
    description: "Курс географии для семиклассников с изучением политической карты мира, населения Земли, мирового хозяйства, регионов и стран мира (Европа, Азия, Африка, Америки, Австралия и Океания), глобальных проблем человечества и места России в современном мире.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс географии 7 класса. Повтор базовых понятий",
        topic: "Введение в курс",
        aspects: "Структура курса; цели и задачи 7 класса; повтор: географическая карта, масштаб, географические координаты, типы карт; требования к работе с атласом и контурной картой"
      },
      {
        number: 2,
        title: "Политическая карта мира: основные понятия",
        topic: "Политическая карта мира",
        aspects: "Государство, столица, граница, территория, форма правления, форма государственного устройства; понятие «политическая карта мира»; роль карт в анализе международной обстановки"
      },
      {
        number: 3,
        title: "Формирование политической карты мира",
        topic: "Политическая карта мира",
        aspects: "Исторические этапы формирования политической карты; колониализм и деколонизация; изменение границ государств; примеры современных региональных конфликтов (на уровне фактов без оценки)"
      },
      {
        number: 4,
        title: "Население Земли: численность, размещение, демографические показатели",
        topic: "Население мира",
        aspects: "Динамика численности населения мира; плотность населения; демографический переход; естественный прирост; крупнейшие по населению страны; понятие «демографическая политика»"
      },
      {
        number: 5,
        title: "Народы, языки и религии мира",
        topic: "Население мира",
        aspects: "Понятия «народ», «нация», «этнос»; языковые семьи; крупнейшие мировые религии; культурное разнообразие; толерантность и межкультурные взаимодействия"
      },
      {
        number: 6,
        title: "Урбанизация. Город и село в современном мире",
        topic: "Население мира",
        aspects: "Понятие урбанизации; уровни урбанизации по странам; мегаполисы и агломерации; проблемы крупных городов; особенности сельских территорий"
      },
      {
        number: 7,
        title: "Мировое хозяйство: структура и отрасли",
        topic: "Мировое хозяйство",
        aspects: "Понятия «мировое хозяйство», «отрасль», «территориальная структура хозяйства»; первичный, вторичный, третичный сектор; индустриальные и постиндустриальные страны"
      },
      {
        number: 8,
        title: "Международная торговля, глобализация и экономические союзы",
        topic: "Мировое хозяйство",
        aspects: "Внешняя торговля, экспорт, импорт; специализация стран; понятие «глобализация»; интеграционные объединения (ЕС, АСЕАН и др. – на уровне обзора); плюсы и риски глобализации"
      },
      {
        number: 9,
        title: "Зарубежная Европа: географическое положение и природные условия",
        topic: "Зарубежная Европа",
        aspects: "Положение Европы на карте мира; особенности береговой линии; рельеф, климат, природные ресурсы; влияние природных условий на хозяйство и расселение"
      },
      {
        number: 10,
        title: "Население и хозяйство Европы",
        topic: "Зарубежная Европа",
        aspects: "Плотность и размещение населения; высокоурбанизированный характер; основные отрасли хозяйства (машиностроение, химия, услуги, транспорт); территориальные различия в уровне развития стран"
      },
      {
        number: 11,
        title: "Европейский Союз: интеграция и роль в мировом хозяйстве",
        topic: "Зарубежная Европа",
        aspects: "Цели и принципы ЕС; единый рынок; общие черты экономики стран ЕС; влияние ЕС на мировую торговлю и политику; примеры интеграционных эффектов"
      },
      {
        number: 12,
        title: "Германия как высокоразвитая страна Европы",
        topic: "Зарубежная Европа",
        aspects: "Географическое положение Германии; природные ресурсы и транспортное положение; структура хозяйства (промышленность, услуги, сельское хозяйство); роль в ЕС и мире"
      },
      {
        number: 13,
        title: "Великобритания/Франция (на выбор учителя) как пример развитой страны",
        topic: "Зарубежная Европа",
        aspects: "Положение страны; историческая роль; современная отрасловая структура экономики; финансовые и культурные центры; участие в международной торговле и организациях"
      },
      {
        number: 14,
        title: "Азия: географическое положение и природное разнообразие",
        topic: "Азия",
        aspects: "Крупнейший материк мира; крайние точки; природные зоны и рельеф (горы, плато, равнины); климатическое разнообразие; ресурсная база материка"
      },
      {
        number: 15,
        title: "Население Азии: крупнейшие государства и демографические особенности",
        topic: "Азия",
        aspects: "Численность и высокая плотность населения; крупнейшие страны (Китай, Индия, Индонезия и др.); этническое и религиозное разнообразие; урбанизация и её специфика"
      },
      {
        number: 16,
        title: "Восточная Азия: Китай и Япония",
        topic: "Азия",
        aspects: "Положение региона; природные условия; население и уровень урбанизации; Китай как крупная индустриально-аграрная держава; Япония как высокоразвитая страна; ведущие отрасли хозяйства"
      },
      {
        number: 17,
        title: "Юго-Восточная Азия: разнообразие стран и экономик",
        topic: "Азия",
        aspects: "Многонациональный и многоконфессиональный регион; особенности природы (муссонный климат, муссонные леса, морское положение); аграрные и индустриально-аграрные страны; роль региона в мировой торговле"
      },
      {
        number: 18,
        title: "Южная Азия: Индия и соседние страны",
        topic: "Азия",
        aspects: "Географическое положение Индии; природные условия (Гималаи, Индо-Гангская равнина, Декан); население и проблемы перенаселения; структура хозяйства; особенности соседних стран (Пакистан, Бангладеш и др. – обзорно)"
      },
      {
        number: 19,
        title: "Западная Азия (Ближний Восток): нефть и геополитика",
        topic: "Азия",
        aspects: "Положение региона на стыке трёх частей света; пустыни и полупустыни; крупнейшие нефтегазовые ресурсы; значение региона для мирового энергоснабжения; особенности населения и хозяйства"
      },
      {
        number: 20,
        title: "Африка: положение, природные условия и ресурсы",
        topic: "Африка",
        aspects: "Материк тропических широт; рельеф (плато, инсельберги, рифтовые разломы); климатические пояса и природные зоны; минеральные и водные ресурсы"
      },
      {
        number: 21,
        title: "Население Африки: этническое и социально-экономическое разнообразие",
        topic: "Африка",
        aspects: "Неравномерное размещение населения; этническая и языковая мозаика; религии; уровни урбанизации; социально-экономические контрасты между странами и регионами"
      },
      {
        number: 22,
        title: "Северная Африка: природные и хозяйственные особенности",
        topic: "Африка",
        aspects: "Положение на стыке Африки и Евразии; пустыня Сахара и побережье Средиземного моря; традиционные и современные виды хозяйства; Египет и страны Магриба как примеры"
      },
      {
        number: 23,
        title: "Тропическая Африка и ЮАР",
        topic: "Африка",
        aspects: "Влажные леса и саванны; природные ресурсы (полезные ископаемые, лес); аграрная специализация многих стран; ЮАР как наиболее развитая экономика региона; основные проблемы развития"
      },
      {
        number: 24,
        title: "Северная Америка: природа, население и хозяйство",
        topic: "Америки",
        aspects: "Положение континента; природные зоны (арктические пустыни, тайга, степи, пустыни, субтропики); освоение территории; общая характеристика хозяйства региона"
      },
      {
        number: 25,
        title: "США: ведущая держава Северной Америки",
        topic: "Америки",
        aspects: "Географическое положение США; ресурсная база; высокоразвитое хозяйство (промышленность, АПК, сфера услуг и высоких технологий); транспортная система; роль в мировой экономике"
      },
      {
        number: 26,
        title: "Канада и Мексика: особенности развития",
        topic: "Америки",
        aspects: "Положение и природные условия; природные ресурсы; особенности размещения населения; структура хозяйства; роль в региональной интеграции (например, экономические связи с США)"
      },
      {
        number: 27,
        title: "Южная Америка: природные контрасты и население",
        topic: "Америки",
        aspects: "Роль Анд и Амазонии в формировании природы; природные зоны; этнический состав и культура; уровень урбанизации (мегаполисы побережья)"
      },
      {
        number: 28,
        title: "Бразилия и другие ведущие страны Южной Америки",
        topic: "Америки",
        aspects: "Положение Бразилии; природные ресурсы и проблемы вырубки лесов; промышленность, сельское хозяйство, услуги; краткая характеристика Аргентины, Чили и др. (обзорно)"
      },
      {
        number: 29,
        title: "Австралия: «страна-материк»",
        topic: "Австралия и Океания",
        aspects: "Изолированное положение; сухой климат и преобладание пустынь и полупустынь; уникальный животный и растительный мир; структура хозяйства Австралии и её роль в мировой экономике"
      },
      {
        number: 30,
        title: "Океания: островные государства и их проблемы",
        topic: "Австралия и Океания",
        aspects: "Географическое положение островных групп (Меланезия, Микронезия, Полинезия – обзорно); природные условия; особенности населения и хозяйства; уязвимость к природным и климатическим рискам"
      },
      {
        number: 31,
        title: "Сравнительная характеристика стран «Нового Света»",
        topic: "Австралия и Океания",
        aspects: "Сопоставление стран Америки, Австралии и Океании по уровню развития, структуре хозяйства, природным условиям, населению; выявление общих черт и различий"
      },
      {
        number: 32,
        title: "Россия в современном мире",
        topic: "Россия в мире",
        aspects: "Положение России на политической карте мира; сравнительные показатели площади, численности населения, ресурсной обеспеченности; место России в мировом хозяйстве (на обзорном уровне)"
      },
      {
        number: 33,
        title: "Глобальные проблемы человечества и международное сотрудничество",
        topic: "Глобальные проблемы мира",
        aspects: "Экологические, демографические, продовольственные, сырьевые и энергетические проблемы; изменение климата; роль разных стран и международных организаций в их решении"
      },
      {
        number: 34,
        title: "Итоговый обобщающий урок по курсу географии 7 класса",
        topic: "Итог по курсу",
        aspects: "Обобщение знаний о населении и хозяйстве мира, регионах и странах; систематизация ключевых понятий курса; рефлексия, итоговая работа/тест, подведение итогов года"
      }
    ]
  },
  {
    grade: 8,
    title: "География для 8 класса",
    description: "Курс географии России для восьмиклассников с изучением территории и положения России, рельефа и недр, климата, внутренних вод, почв, растительного и животного мира, природных зон, влияния хозяйственной деятельности на природу, охраны природы и населения России.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс географии России. Повтор базовых понятий",
        topic: "Введение",
        aspects: "Место курса 8 класса в школьной географии; что изучаем: природа и население России; повтор: карта, масштаб, координаты, типы карт, природные оболочки"
      },
      {
        number: 2,
        title: "Географическое положение России",
        topic: "Территория и положение России",
        aspects: "Материки и океаны вокруг России; крайние точки, протяжённость с запада на восток и с севера на юг; часовые пояса; особенности ЭГП (преимущества и сложности)"
      },
      {
        number: 3,
        title: "Территория и границы России",
        topic: "Территория и положение России",
        aspects: "Площадь и конфигурация территории; сухопутные и морские границы; субъекты РФ (обзорно); внутренние воды как часть территории; изменение границ исторически (очень кратко)"
      },
      {
        number: 4,
        title: "Административно-территориальное устройство РФ",
        topic: "Территория и положение России",
        aspects: "Понятия «субъект РФ», «федерация», «район»; виды субъектов; федеральные округа (обзорно); карта административного деления и работа с ней"
      },
      {
        number: 5,
        title: "История формирования территории России (обзор)",
        topic: "Территория и положение России",
        aspects: "Основные этапы территориального роста государства (обзорным блоком); освоение Сибири и Дальнего Востока; влияние истории на современную структуру территории"
      },
      {
        number: 6,
        title: "Геологическое строение и рельеф России",
        topic: "Рельеф и недра",
        aspects: "Платформы и складчатые области (на уровне представлений); крупные формы рельефа (равнины, горы, плоскогорья); связь рельефа с геологическим строением"
      },
      {
        number: 7,
        title: "Крупные формы рельефа: равнины России",
        topic: "Рельеф и недра",
        aspects: "Восточно-Европейская, Западно-Сибирская, Среднесибирское плоскогорье; особенности рельефа, высоты; влияние равнин на природу, хозяйство, транспорт"
      },
      {
        number: 8,
        title: "Крупные формы рельефа: горные районы России",
        topic: "Рельеф и недра",
        aspects: "Кавказ, Урал, Алтай, Саяны, горы Восточной Сибири и Дальнего Востока; высотная поясность; природные и хозяйственные особенности горных районов"
      },
      {
        number: 9,
        title: "Полезные ископаемые России",
        topic: "Рельеф и недра",
        aspects: "Классификация полезных ископаемых (топливные, рудные, нерудные); крупнейшие бассейны нефти, газа, угля, руд; карта размещения ресурсов; значение недр для экономики"
      },
      {
        number: 10,
        title: "Общая характеристика климата России",
        topic: "Климат",
        aspects: "Факторы формирования климата (широта, циркуляция воздуха, рельеф, удалённость от океанов); основные климатообразующие процессы; климатическая карта России"
      },
      {
        number: 11,
        title: "Климатические пояса и типы климата России",
        topic: "Климат",
        aspects: "Арктический, субарктический, умеренный, субтропический климат; морской и континентальный типы; примеры климатических областей; влияние климата на жизнь и хозяйство"
      },
      {
        number: 12,
        title: "Погода и климат. Климатические ресурсы",
        topic: "Климат",
        aspects: "Элементы погоды; наблюдения за погодой (метеонаблюдения школьников); климатические ресурсы (солнечная радиация, тепло, осадки, ветер); климат и отрасли хозяйства"
      },
      {
        number: 13,
        title: "Внутренние воды России: общая характеристика",
        topic: "Внутренние воды",
        aspects: "Понятие «гидросеть»; основные речные системы; озёра, болота, подземные воды, ледники; роль внутренних вод в природе и хозяйстве"
      },
      {
        number: 14,
        title: "Реки России и их бассейны",
        topic: "Внутренние воды",
        aspects: "Крупнейшие реки (Волга, Обь, Енисей, Лена, Амур и др.); бассейны стока (Арктический, Тихий, Атлантический, внутренний); режим рек; использование речных ресурсов"
      },
      {
        number: 15,
        title: "Озёра, водохранилища и болота России",
        topic: "Внутренние воды",
        aspects: "Крупные озёра (Байкал, Ладожское, Онежское и др.); искусственные водохранилища; болота и их роль; проблемы регулирования стока и влияния ГЭС"
      },
      {
        number: 16,
        title: "Моря, прилегающие к территории России",
        topic: "Внутренние воды",
        aspects: "Моря Северного Ледовитого, Тихого и Атлантического океанов; особенности природных условий акваторий; значение морей для транспорта, рыболовства, добычи ресурсов"
      },
      {
        number: 17,
        title: "Почвы России и их многообразие",
        topic: "Природные компоненты",
        aspects: "Факторы почвообразования; типы почв (тундровые, подзолистые, чернозёмы, каштановые и др. — обзор); карта почв России; значение почв как природного ресурса"
      },
      {
        number: 18,
        title: "Растительный мир России",
        topic: "Природные компоненты",
        aspects: "Основные типы растительности по природным зонам; лесные ресурсы и лесной фонд; эндемики и редкие виды; влияние хозяйства на растительность"
      },
      {
        number: 19,
        title: "Животный мир России",
        topic: "Природные компоненты",
        aspects: "Основные типы фауны по природным зонам; промысловые виды; редкие и исчезающие виды; охрана животных; значение биологического разнообразия"
      },
      {
        number: 20,
        title: "Природные комплексы и физико-географическое районирование",
        topic: "Природные комплексы",
        aspects: "Понятие природного комплекса; природный комплекс как система; физико-географические страны и области; карта физико-географического районирования России"
      },
      {
        number: 21,
        title: "Природные зоны России: арктические пустыни и тундра",
        topic: "Природные зоны",
        aspects: "Географическое положение; климат; мерзлота; растительность и животные; хозяйственное использование и экологические проблемы Севера"
      },
      {
        number: 22,
        title: "Природные зоны России: лесотундра и тайга",
        topic: "Природные зоны",
        aspects: "Положение зоны; климатические особенности; типы лесов; значение лесных ресурсов; проблемы вырубки и пожаров; охрана лесов"
      },
      {
        number: 23,
        title: "Природные зоны России: смешанные и широколиственные леса",
        topic: "Природные зоны",
        aspects: "Географическое положение в европейской части и на Дальнем Востоке; плодородие почв; освоенность территории; хозяйственная деятельность и её последствия"
      },
      {
        number: 24,
        title: "Природные зоны России: степи, лесостепи, полупустыни и пустыни",
        topic: "Природные зоны",
        aspects: "Положение степной и полупустынной зон; природные условия; аграрное использование территорий; проблемы эрозии почв, опустынивания, орошения"
      },
      {
        number: 25,
        title: "Природные зоны России: горные области",
        topic: "Природные зоны",
        aspects: "Особенности горных природных комплексов (Кавказ, Алтай, Саяны и др.); высотная поясность; природные ресурсы и рекреационный потенциал гор"
      },
      {
        number: 26,
        title: "Влияние хозяйственной деятельности на природу России",
        topic: "Природа и хозяйство",
        aspects: "Основные виды воздействия: вырубка лесов, загрязнение воздуха и воды, добыча полезных ископаемых, строительство ГЭС и др.; крупнейшие экологические проблемы регионов (обзорно)"
      },
      {
        number: 27,
        title: "Охрана природы. Особо охраняемые природные территории России",
        topic: "Охрана природы",
        aspects: "Понятие ООПТ; заповедники, национальные парки, заказники; примеры крупнейших ООПТ России; международные природоохранные инициативы с участием РФ"
      },
      {
        number: 28,
        title: "Население России: численность и размещение",
        topic: "Население России",
        aspects: "Динамика численности населения; плотность населения; неравномерность размещения (европейская и азиатская части); понятие «опорный каркас расселения» (обзорно)"
      },
      {
        number: 29,
        title: "Национальный и религиозный состав населения",
        topic: "Население России",
        aspects: "Понятие «многонациональное государство»; основные народы России; языковое и религиозное разнообразие; значение межнационального согласия"
      },
      {
        number: 30,
        title: "Городское и сельское население. Урбанизация в России",
        topic: "Население России",
        aspects: "Понятие урбанизации; динамика доли городского и сельского населения; типы населённых пунктов; крупнейшие города России и их функции"
      },
      {
        number: 31,
        title: "Миграции населения и трудовые ресурсы",
        topic: "Население России",
        aspects: "Внутренние и внешние миграции; причины миграций; миграционные потоки внутри страны; трудовые ресурсы, трудоспособное население; региональные особенности"
      },
      {
        number: 32,
        title: "Население и природа региона (края, области)",
        topic: "Региональный компонент",
        aspects: "Географическое положение региона; численность и размещение населения; национальный состав; связь населения с природными условиями региона"
      },
      {
        number: 33,
        title: "Природа родного края: комплексная характеристика",
        topic: "Региональный компонент",
        aspects: "Основные природные компоненты региона (рельеф, климат, воды, почвы, растительность и животные); природные комплексы и ООПТ региона; местные экологические проблемы"
      },
      {
        number: 34,
        title: "Итоговый обобщающий урок по курсу географии России (природа и население)",
        topic: "Итог по курсу",
        aspects: "Систематизация знаний о природе и населении России; повтор ключевых понятий и картографического материала; итоговое тестирование/практикум по карте; рефлексия по курсу"
      }
    ]
  },
  {
    grade: 9,
    title: "География для 9 класса",
    description: "Курс социально-экономической географии России для девятиклассников с изучением экономико-географического положения, природно-ресурсного потенциала, хозяйственного комплекса (ТЭК, металлургия, машиностроение, АПК, транспорт), экономических районов России, экологических проблем и места России в мировой экономике.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс «Россия: население и хозяйство»",
        topic: "Введение. Соц-экон география",
        aspects: "Цели и задачи курса 9 класса; место курса в школьной географии; повтор ключевых понятий 8 класса (территория, природные ресурсы, население); структура курса: хозяйство, районы, Россия в мире"
      },
      {
        number: 2,
        title: "Экономико-географическое положение России",
        topic: "Общая характеристика России",
        aspects: "Понятие ЭГП; положение России относительно океанов, материков и мировых центров; транспортно-географическое положение; преимущества и ограничения ЭГП для развития хозяйства"
      },
      {
        number: 3,
        title: "Природно-ресурсный потенциал России",
        topic: "Ресурсная база хозяйства",
        aspects: "Виды природных ресурсов (минеральные, водные, земельные, лесные, биологические, рекреационные); оценка обеспеченности ресурсами; ресурсные базы и их значение для отраслей хозяйства"
      },
      {
        number: 4,
        title: "Население и трудовые ресурсы России",
        topic: "Население и хозяйство",
        aspects: "Численность и размещение населения; трудоспособное население и трудовые ресурсы; демографическая ситуация (старение, миграции); влияние демографии на хозяйство"
      },
      {
        number: 5,
        title: "Факторы размещения производства и территориальная структура хозяйства",
        topic: "Территориальная организация хозяйства",
        aspects: "Природные, демографические, экономические, транспортные и экологические факторы размещения; понятия «территориальная структура хозяйства», «узлы» и «центры»; производственные связи"
      },
      {
        number: 6,
        title: "Хозяйственный комплекс России: структура и межотраслевые комплексы",
        topic: "Хозяйственный комплекс РФ",
        aspects: "Понятие «хозяйственный комплекс»; отраслевая и территориальная структуры хозяйства; межотраслевые комплексы (ТЭК, металлургический, машиностроительный, АПК и др.); роль НТП"
      },
      {
        number: 7,
        title: "Топливно-энергетический комплекс России: общая характеристика",
        topic: "Отрасли хозяйства. ТЭК",
        aspects: "Структура ТЭК (добыча топлива + электроэнергетика); значение ТЭК для экономики; размещение ТЭК по территории; проблемы и перспективы развития"
      },
      {
        number: 8,
        title: "Нефтегазовая промышленность России",
        topic: "Отрасли хозяйства. ТЭК",
        aspects: "Основные районы добычи нефти и газа; транспорт нефти и газа (трубопроводы, морские пути); переработка нефти; значение для внутреннего рынка и экспорта"
      },
      {
        number: 9,
        title: "Угольная промышленность и электроэнергетика",
        topic: "Отрасли хозяйства. ТЭК",
        aspects: "Крупные угольные бассейны; роль угля в энергетике; виды электростанций (ГЭС, ТЭС, АЭС); крупнейшие энергетические узлы; вопросы энергоэффективности и экологии"
      },
      {
        number: 10,
        title: "Металлургический комплекс: чёрная металлургия",
        topic: "Отрасли хозяйства. Промышленность",
        aspects: "Сырьевая база (железные руды, коксующийся уголь); этапы металлургического производства; основные районы чёрной металлургии; значение продукции для других отраслей"
      },
      {
        number: 11,
        title: "Металлургический комплекс: цветная металлургия",
        topic: "Отрасли хозяйства. Промышленность",
        aspects: "Руды цветных металлов (алюминий, медь, никель и др.); особенности размещения цветной металлургии; энергоёмкость отрасли; экологические аспекты"
      },
      {
        number: 12,
        title: "Машиностроительный комплекс России",
        topic: "Отрасли хозяйства. Промышленность",
        aspects: "Роль машиностроения в народном хозяйстве; основные подотрасли (транспортное, энергетическое, сельскохозяйственное и др.); ведущие машиностроительные районы и центры; факторы размещения"
      },
      {
        number: 13,
        title: "Химическая и нефтехимическая промышленность",
        topic: "Отрасли хозяйства. Промышленность",
        aspects: "Сырьевая база (нефть, газ, калийные и фосфоритные соли); основные направления (минеральные удобрения, полимеры, лакокраска и др.); районы специализации; влияние на окружающую среду"
      },
      {
        number: 14,
        title: "Лесной комплекс: заготовка, деревообработка, целлюлозно-бумажная промышленность",
        topic: "Отрасли хозяйства. Лесной комплекс",
        aspects: "Лесной фонд России; основные лесозаготовительные районы; стадии переработки древесины; экспорт древесины и лесоматериалов; проблемы рационального лесопользования"
      },
      {
        number: 15,
        title: "Аграрно-промышленный комплекс: общая характеристика",
        topic: "АПК России",
        aspects: "Состав АПК (сельское хозяйство, переработка, инфраструктура); факторы развития АПК; специализация регионов по видам продукции; роль АПК в обеспечении продовольственной безопасности"
      },
      {
        number: 16,
        title: "Растениеводство России",
        topic: "АПК России",
        aspects: "Основные отрасли растениеводства (зерновые, технические, кормовые, овощи, фрукты); сельскохозяйственные зоны России; факторы урожайности; современная агротехника"
      },
      {
        number: 17,
        title: "Животноводство и пищевая промышленность России",
        topic: "АПК России",
        aspects: "Основные виды животноводства (скотоводство, свиноводство, птицеводство и др.); размещение отраслей; база кормопроизводства; пищевая промышленность как переработчик сельхозсырья"
      },
      {
        number: 18,
        title: "Транспортная система и связь России",
        topic: "Инфраструктура хозяйства",
        aspects: "Виды транспорта (железнодорожный, автомобильный, трубопроводный, воздушный, водный); крупнейшие транспортные узлы; транспортные коридоры; роль связи и цифровой инфраструктуры в развитии хозяйства"
      },
      {
        number: 19,
        title: "Россия в мировой экономике",
        topic: "Россия в мире",
        aspects: "Место России в международном разделении труда; экспорт и импорт; сырьевая и несырьевая структура экспорта; участие в международных экономических организациях (на обзорном уровне)"
      },
      {
        number: 20,
        title: "Территориальная организация хозяйства и экономическое районирование",
        topic: "Территориальное развитие",
        aspects: "Понятия «территориальная структура хозяйства», «экономический район»; принципы экономического районирования; федеральные округа и экономические районы (обзорно); карта районирования России"
      },
      {
        number: 21,
        title: "Городская система и агломерации России",
        topic: "Население и расселение",
        aspects: "Понятия «городская агломерация», «мегаполис»; крупнейшие агломерации России (Москва, Санкт-Петербург и др.); влияние агломераций на хозяйство и инфраструктуру; проблемы крупных городов"
      },
      {
        number: 22,
        title: "Социальная сфера и качество жизни населения",
        topic: "Социальная география",
        aspects: "Основные элементы социальной инфраструктуры (образование, здравоохранение, культура, спорт); региональные различия в уровне и качестве жизни; социально-экономическое неравенство регионов"
      },
      {
        number: 23,
        title: "Европейский Север и Северо-Запад России",
        topic: "Экономические районы России",
        aspects: "Географическое положение; природные ресурсы (лес, рыба, полезные ископаемые); специализация хозяйства (лесной, рыбный, сырьевой); крупнейшие города и порты; транспортное значение регионов"
      },
      {
        number: 24,
        title: "Центральная Россия: промышленный и финансовый центр страны",
        topic: "Экономические районы России",
        aspects: "Положение Центральной России; роль Москвы и Московской агломерации; многоотраслевое промышленное производство; развитие сферы услуг и финансов; транспортный узел страны"
      },
      {
        number: 25,
        title: "Поволжье и прилегающие районы",
        topic: "Экономические районы России",
        aspects: "Положение вдоль Волги; топливно-энергетическая и химическая база; машиностроение и АПК; значение Волги как транспортной и ресурсной оси; крупные промышленные центры"
      },
      {
        number: 26,
        title: "Урал – старейший индустриальный район России",
        topic: "Экономические районы России",
        aspects: "Богатая минерально-сырьевая база; крупная металлургия и машиностроение; топливно-энергетическая обеспеченность; экологические проблемы индустриального развития"
      },
      {
        number: 27,
        title: "Западная Сибирь – главное нефтегазодобывающее направление",
        topic: "Экономические районы России",
        aspects: "Климат и природные условия; крупнейшие нефтегазоносные районы; особенности размещения населения; транспортные проблемы; перспективы развития региона"
      },
      {
        number: 28,
        title: "Восточная Сибирь – сырьевая база и энергетический потенциал",
        topic: "Экономические районы России",
        aspects: "Природные ресурсы (уголь, гидроэнергия, лес); малозаселённость и трудности освоения; крупные промышленные узлы; значение Байкала и прилегающих территорий"
      },
      {
        number: 29,
        title: "Дальний Восток России: морские связи и ресурсы океана",
        topic: "Экономические районы России",
        aspects: "Пограничное и приморское положение; ресурсы Мирового океана, леса, полезные ископаемые; рыбная промышленность и порты; транспортные коридоры на Восток; проблемы и возможности развития"
      },
      {
        number: 30,
        title: "Европейский Юг и Северный Кавказ",
        topic: "Экономические районы России",
        aspects: "Природные условия (морское побережье, горы, равнины); рекреационные ресурсы; многоотраслевой АПК; промышленность и транспорт; особенности этнокультурного состава и его влияние на развитие региона"
      },
      {
        number: 31,
        title: "Особые территории России: Крайний Север, Арктическая зона, Калининградская область",
        topic: "Экономические районы России",
        aspects: "Понятие «особые территории»; суровые природные условия Крайнего Севера и Арктики; ресурсный потенциал; транспортная и военно-стратегическая роль; Калининград как эксклав; специфика хозяйственного освоения"
      },
      {
        number: 32,
        title: "Экологические проблемы хозяйства России и региональные различия",
        topic: "Природа и хозяйство",
        aspects: "Основные типы экологических проблем (загрязнение воздуха и воды, деградация почв, вырубка лесов, отходы производства); регионы с высокой экологической нагрузкой; направления экологической политики и природоохранные меры"
      },
      {
        number: 33,
        title: "Экономико-географическая характеристика своего региона (проект)",
        topic: "Региональный компонент",
        aspects: "Структура характеристики региона: положение, ресурсы, население, хозяйство, транспорт, экологические проблемы; подготовка и защита мини-проектов учащихся по своему краю/области"
      },
      {
        number: 34,
        title: "Итоговый обобщающий урок по курсу географии 9 класса",
        topic: "Итог по курсу",
        aspects: "Систематизация знаний о хозяйстве и населении России, экономических районах, месте России в мире; работа с комплексными картами; итоговое тестирование/зачёт, рефлексия по курсу"
      }
    ]
  },
  {
    grade: 10,
    title: "География для 10 класса",
    description: "Курс социально-экономической географии мира для десятиклассников с изучением населения мира, мирового хозяйства, отраслей мирового хозяйства (промышленность, сельское хозяйство, сфера услуг), регионов и стран мира, глобальных проблем человечества и концепции устойчивого развития.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс «Социально-экономическая география мира»",
        topic: "Введение в курс",
        aspects: "Цели и задачи курса 10 класса; место предмета в системе географии; повтор ключевых понятий (страна, регион, население, хозяйство); требования к работе с картами и статистикой"
      },
      {
        number: 2,
        title: "Объект, предмет и методы социально-экономической географии",
        topic: "Введение в курс",
        aspects: "Что изучает социально-экономическая география; взаимосвязь с экономикой, социологией, политологией; основные методы (картографический, статистический, сравнительно-географический, системный)"
      },
      {
        number: 3,
        title: "Источники географической информации. Статистика и карты",
        topic: "Введение в курс",
        aspects: "Виды статистических показателей (абсолютные, относительные, средние); картодиаграммы, картограммы; работа с атласом, учебной статистикой, онлайн-ресурсами (обзорно)"
      },
      {
        number: 4,
        title: "Население мира: численность и воспроизводство",
        topic: "География населения мира",
        aspects: "Динамика численности населения мира; демографический переход; естественный прирост; высоко- и низкодоходные страны по темпам роста населения"
      },
      {
        number: 5,
        title: "Размещение и плотность населения мира",
        topic: "География населения мира",
        aspects: "Неравномерность размещения; районы концентрации и малонаселённые территории; факторы размещения (природные, исторические, экономические, политические)"
      },
      {
        number: 6,
        title: "Возрастно-половой состав и демографическая структура населения",
        topic: "География населения мира",
        aspects: "Пирамиды возрастно-полового состава; типы демографических структур (прогрессивный, стационарный, регрессивный); демографическое старение; социально-экономические последствия"
      },
      {
        number: 7,
        title: "Народонаселение, этносы и языковые семьи мира",
        topic: "География населения мира",
        aspects: "Понятия «народ», «нация», «этнос»; крупнейшие языковые семьи и группы; основные этнорегионы мира; языковое разнообразие и его связь с историей и политикой"
      },
      {
        number: 8,
        title: "Религии и культурный ландшафт мира",
        topic: "География населения мира",
        aspects: "Мировые и национальные религии; территориальное распространение основных религий; религия и культурный ландшафт; конфессиональная мозаика регионов"
      },
      {
        number: 9,
        title: "Миграции населения и урбанизация",
        topic: "География населения мира",
        aspects: "Виды миграций (внутренние, внешние; временные, постоянные); причины миграций; понятие урбанизации; мегаполисы и городские агломерации; социальные и экологические эффекты"
      },
      {
        number: 10,
        title: "Уровень и качество жизни населения. Индекс человеческого развития",
        topic: "География населения мира",
        aspects: "Показатели уровня жизни (доход, занятость, жильё, образование, здравоохранение); ИЧР; территориальные различия в уровне и качестве жизни; «золотой миллиард» и беднейшие страны"
      },
      {
        number: 11,
        title: "Формирование мирового хозяйства",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Понятие «мировое хозяйство»; этапы формирования (колониальная система, индустриализация, НТР, глобализация); международное разделение труда"
      },
      {
        number: 12,
        title: "Структура мирового хозяйства. Типы стран по уровню развития",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Первичный, вторичный, третичный секторы; индустриальные, постиндустриальные экономики; развитые страны, развивающиеся, наименее развитые, страны с переходной экономикой"
      },
      {
        number: 13,
        title: "Научно-техническая революция и постиндустриальное общество",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Сущность НТР; механизация, автоматизация, цифровизация; смена технологических укладов; рост роли сферы услуг и знаний; инновации и кластеры"
      },
      {
        number: 14,
        title: "Международное разделение труда и специализация стран",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Формы специализации (сырьё, промышленность, услуги); кооперирование и кооперация; примеры специализации стран и регионов; преимущества и риски зависимости от специализации"
      },
      {
        number: 15,
        title: "Международная торговля. Транснациональные корпорации",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Экспорт, импорт, торговый баланс; товарная и географическая структура мировой торговли; ТНК: роль, размещение штаб-квартир и производств; влияние ТНК на пространство"
      },
      {
        number: 16,
        title: "Мировые финансы и глобальные рынки капитала",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Мировые финансовые центры; банки и фондовые биржи; валютные курсы и резервы; долговые проблемы; офшорные зоны (обзорно)"
      },
      {
        number: 17,
        title: "Транспорт и связь в мировом хозяйстве",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Виды транспорта и их роль; мировые транспортные коридоры и узлы; глобальные логистические цепочки; связь и телекоммуникации как инфраструктурная основа экономики"
      },
      {
        number: 18,
        title: "Региональная экономическая интеграция и глобализация",
        topic: "Мировое хозяйство: общие вопросы",
        aspects: "Интеграционные объединения (ЕС, НАФТА/USMCA, АСЕАН и др. — обзорно); экономические и политические цели интеграции; проявления глобализации; плюсы/минусы для разных стран"
      },
      {
        number: 19,
        title: "География промышленности мира: общая характеристика",
        topic: "Отрасли мирового хозяйства",
        aspects: "Тенденции размещения промышленности; старые и новые индустриальные районы; факторы промышленного размещения; деиндустриализация и реиндустриализация"
      },
      {
        number: 20,
        title: "Топливно-энергетический комплекс мира",
        topic: "Отрасли мирового хозяйства",
        aspects: "Нефть, газ, уголь, гидро- и атомная энергетика; крупнейшие производители и потребители; международные топливные потоки; энергопереход и возобновляемая энергетика (на уровне основных идей)"
      },
      {
        number: 21,
        title: "Металлургия и машиностроение в мировом хозяйстве",
        topic: "Отрасли мирового хозяйства",
        aspects: "Районы чёрной и цветной металлургии; крупные машиностроительные центры; высокотехнологичные производства; сдвиг сложного машиностроения в Азию"
      },
      {
        number: 22,
        title: "Химическая промышленность, лесной и строительный комплексы мира",
        topic: "Отрасли мирового хозяйства",
        aspects: "Размещение химической промышленности; производство удобрений, полимеров; лесной фонд мира, основные лесозаготовительные районы; производство стройматериалов; экологические аспекты"
      },
      {
        number: 23,
        title: "Сельское хозяйство мира и продовольственная проблема",
        topic: "Отрасли мирового хозяйства",
        aspects: "Основные сельскохозяйственные районы и пояса; специализация по культурам и видам животноводства; агробизнес; голод и недоедание; пути решения продовольственной проблемы"
      },
      {
        number: 24,
        title: "Сфера услуг, туризм и информационная экономика",
        topic: "Отрасли мирового хозяйства",
        aspects: "Структура сферы услуг; деловые услуги, образование, медицина, культура; туризм: основные туристские регионы; информационные технологии и цифровая экономика как драйвер роста"
      },
      {
        number: 25,
        title: "Зарубежная Европа в мировом хозяйстве",
        topic: "Регионы и страны мира",
        aspects: "Роль Европы в мировой экономике; структура хозяйства (преобладание сферы услуг и высокотехнологичных отраслей); основные экономические районы; экспортно-импортные связи; место ЕС"
      },
      {
        number: 26,
        title: "Северная Америка в мировой экономике",
        topic: "Регионы и страны мира",
        aspects: "США и Канада как высокоразвитый регион; ресурсная база; размещение промышленности и сельского хозяйства; крупнейшие агломерации; участие в мировых финансовых и технологических потоках"
      },
      {
        number: 27,
        title: "Латинская Америка: контрасты развития",
        topic: "Регионы и страны мира",
        aspects: "Природные ресурсы и экспортно-сырьевая специализация; уровень урбанизации и мегаполисы; социально-экономические контрасты; примеры относительно развитых и отстающих стран региона"
      },
      {
        number: 28,
        title: "Азия в мировом хозяйстве: «центр роста» мировой экономики",
        topic: "Регионы и страны мира",
        aspects: "Восточная и Юго-Восточная Азия как «мировая фабрика»; НИС (новые индустриальные страны); роль Китая, Японии, «азиатских тигров»; Юго-Западная и Южная Азия: нефть, население, контрасты развития"
      },
      {
        number: 29,
        title: "Африка в мировом хозяйстве: ресурсы и проблемы развития",
        topic: "Регионы и страны мира",
        aspects: "Богатство природных ресурсов при низком уровне развития; сырьевая специализация; влияние колониального прошлого; демографические вызовы; отдельные примеры успешных стран и регионов"
      },
      {
        number: 30,
        title: "Австралия и Океания в мировом хозяйстве",
        topic: "Регионы и страны мира",
        aspects: "Австралия как развитая страна с ресурсной специализацией; роль Новой Зеландии; мелкие островные государства и их проблемы (ресурсная, экономическая, климатическая уязвимость)"
      },
      {
        number: 31,
        title: "Россия в системе мирового хозяйства (обобщающий взгляд)",
        topic: "Регионы и страны мира",
        aspects: "Статус России в мировой экономике; структура экспорта и импорта; участие в международном разделении труда и интеграционных объединениях; сильные и слабые стороны конкурентоспособности"
      },
      {
        number: 32,
        title: "Глобальные экологические проблемы и география природных рисков",
        topic: "Глобальные проблемы и устойчивое развитие",
        aspects: "Загрязнение атмосферы и гидросферы; изменение климата; опустынивание; вырубка лесов; техногенные катастрофы; география природных и техногенных опасностей"
      },
      {
        number: 33,
        title: "Социально-экономические глобальные проблемы человечества",
        topic: "Глобальные проблемы и устойчивое развитие",
        aspects: "Демографические дисбалансы; урбанизация и «городские проблемы»; бедность и неравенство; миграционные кризисы; продовольственная и энергетическая безопасность"
      },
      {
        number: 34,
        title: "Концепция устойчивого развития. Итоговый урок по курсу",
        topic: "Глобальные проблемы и устойчивое развитие. Итог",
        aspects: "Принципы устойчивого развития; международные инициативы (обзорно); роль разных стран и регионов; систематизация ключевых понятий курса; итоговый контроль/практикум по картам и статистике"
      }
    ]
  },
  {
    grade: 7,
    title: "История для 7 класса",
    description: "Курс истории для семиклассников, охватывающий эпоху Нового времени (XVI–XVIII вв.): Великие географические открытия, Реформацию, абсолютизм, революции, Просвещение и образование США. Изучение изменений в экономике, политике и культуре Европы.",
    lessons: [
      {
        number: 1,
        title: "Переход от Средних веков к Новому времени",
        topic: "Введение в курс",
        aspects: "Хронологические рамки Нового времени (XVI–XVIII вв.); изменение картины мира; переход от феодализма к раннему капитализму; основные регионы и центры"
      },
      {
        number: 2,
        title: "Европа на рубеже XV–XVI вв.",
        topic: "Введение в курс",
        aspects: "Рост городов и торговли; зарождение мирового рынка; мануфактуры; изменение роли буржуазии и дворянства"
      },
      {
        number: 3,
        title: "Начало Великих географических открытий",
        topic: "Великие географические открытия",
        aspects: "Причины морских путешествий; технические новшества в мореплавании; португальские экспедиции; роль Генриха Мореплавателя"
      },
      {
        number: 4,
        title: "Открытие Америки и новые морские пути",
        topic: "Великие географические открытия",
        aspects: "Путешествия Христофора Колумба; открытие пути в Индию Васко да Гамой; первые кругосветные путешествия (Магеллан) — обзорно"
      },
      {
        number: 5,
        title: "Формирование колониальных империй",
        topic: "Великие географические открытия",
        aspects: "Испанские и португальские колонии; роль золота и серебра; система управления колониями; первые миссионеры"
      },
      {
        number: 6,
        title: "Цивилизации доколумбовой Америки и их завоевание",
        topic: "Новый Свет",
        aspects: "Краткая характеристика ацтеков, майя, инков; организация власти и хозяйства; завоевания конкистадоров; последствия для местного населения"
      },
      {
        number: 7,
        title: "Гуманизм и Возрождение в Европе",
        topic: "Культура переходной эпохи",
        aspects: "Понятие «гуманизм»; новые взгляды на человека и мир; деятели итальянского Возрождения (на уровне имён и примеров)"
      },
      {
        number: 8,
        title: "Реформация в Германии: Мартин Лютер",
        topic: "Реформация",
        aspects: "Причины недовольства католической церковью; выступление Мартина Лютера; основные положения его учения; реакция церкви и князей"
      },
      {
        number: 9,
        title: "Распространение Реформации в Европе",
        topic: "Реформация",
        aspects: "Кальвин и кальвинизм; Реформация в Швейцарии и Франции; особенности Англии и возникновение англиканской церкви"
      },
      {
        number: 10,
        title: "Контрреформация и обновление католической церкви",
        topic: "Реформация",
        aspects: "Тридентский собор (в общих чертах); орден иезуитов; усиление контроля церкви; религиозная борьба в Европе"
      },
      {
        number: 11,
        title: "Нидерландская буржуазная революция",
        topic: "Революции Нового времени",
        aspects: "Причины восстания против Испании; ход борьбы; образование Республики Соединённых провинций; значение революции"
      },
      {
        number: 12,
        title: "Голландская республика и её роль в Европе",
        topic: "Революции Нового времени",
        aspects: "Устройство Голландской республики; развитие торговли и флота; финансовые центры; Голландия как «мастерская» и «банк» Европы"
      },
      {
        number: 13,
        title: "Испания в XVI веке: взлёт и кризис",
        topic: "Европейские монархии",
        aspects: "Могущество испанской короны; «Непобедимая армада»; причины постепенного упадка; влияние на европейскую политику"
      },
      {
        number: 14,
        title: "Франция XVI века: религиозные войны",
        topic: "Европейские монархии",
        aspects: "Противостояние католиков и гугенотов; Варфоломеевская ночь (без натурализма); укрепление власти короля"
      },
      {
        number: 15,
        title: "Тридцатилетняя война и Вестфальский мир",
        topic: "Европейские конфликты",
        aspects: "Причины войны; основные участники (обзорно); разорение Германии; значение Вестфальского мира для Европы"
      },
      {
        number: 16,
        title: "Становление абсолютизма во Франции",
        topic: "Абсолютизм",
        aspects: "Понятие «абсолютная монархия»; роль кардиналов Ришельё и Мазарини; усиление королевской власти; ограничение влияния знати"
      },
      {
        number: 17,
        title: "«Король-солнце» Людовик XIV и Версаль",
        topic: "Абсолютизм",
        aspects: "Личность Людовика XIV; двор и этикет; Версаль как центр власти и культуры; внешняя политика Франции"
      },
      {
        number: 18,
        title: "Англия в XVI–XVII вв.: от Тюдоров к Стюартам",
        topic: "Англия",
        aspects: "Королева Елизавета I и укрепление государства; начало английской колониальной экспансии; династия Стюартов и рост противоречий"
      },
      {
        number: 19,
        title: "Английская революция: причины и начало",
        topic: "Английская революция",
        aspects: "Конфликт короля и парламента; противостояние королевских сторонников и парламентариев; первые этапы гражданской войны"
      },
      {
        number: 20,
        title: "Английская республика и Оливер Кромвель",
        topic: "Английская революция",
        aspects: "Казнь короля Карла I; провозглашение республики; роль Кромвеля; военная диктатура и её итоги"
      },
      {
        number: 21,
        title: "«Славная революция» и конституционная монархия",
        topic: "Английская революция",
        aspects: "Смена династии; приглашение Вильгельма Оранского; Билль о правах (на базовом уровне); формирование парламентской системы"
      },
      {
        number: 22,
        title: "Священная Римская империя и становление Пруссии",
        topic: "Центральная Европа",
        aspects: "Особенности раздробленности германских земель; усиление Бранденбург-Пруссии; военная организация Пруссии"
      },
      {
        number: 23,
        title: "Австрия, Османская империя и Речь Посполитая",
        topic: "Центральная и Восточная Европа",
        aspects: "Многонациональная монархия Габсбургов; продвижение Османской империи в Европу; устройство Речи Посполитой"
      },
      {
        number: 24,
        title: "Россия и Европа в эпоху Петра I (обзорно)",
        topic: "Европа и Россия",
        aspects: "Россия в системе европейской политики; контакты с европейскими державами; реформы Петра I в контексте европейских преобразований (очень кратко)"
      },
      {
        number: 25,
        title: "Научная революция XVII века",
        topic: "Наука и техника",
        aspects: "Изменение взглядов на природу; Коперник, Галилей, Кеплер, Ньютон (на уровне ключевых идей); роль опытов и наблюдений"
      },
      {
        number: 26,
        title: "Искусство барокко и классицизма",
        topic: "Культура Нового времени",
        aspects: "Особенности стиля барокко; черты классицизма; образцы архитектуры и живописи; изменения в музыке и театре"
      },
      {
        number: 27,
        title: "Эпоха Просвещения и её идеи",
        topic: "Просвещение",
        aspects: "Понятие «Просвещение»; критика абсолютизма и сословных привилегий; основные мыслители (Вольтер, Руссо, Монтескьё — на уровне имён и идей)"
      },
      {
        number: 28,
        title: "Просвещённый абсолютизм в Европе",
        topic: "Просвещение",
        aspects: "Понятие «просвещённый абсолютизм»; реформы Фридриха II, Марии-Терезии и Иосифа II; Екатерина II как пример взаимодействия идей Просвещения и самодержавия"
      },
      {
        number: 29,
        title: "Североамериканские колонии Англии",
        topic: "Новый Свет в XVII–XVIII вв.",
        aspects: "Возникновение английских колоний в Северной Америке; особенности хозяйства и управления; отношения с метрополией"
      },
      {
        number: 30,
        title: "Война за независимость и образование США",
        topic: "Новый Свет в XVII–XVIII вв.",
        aspects: "Причины конфликта между колониями и Англией; основные этапы борьбы (очень обобщённо); провозглашение независимости; значение появления нового государства"
      },
      {
        number: 31,
        title: "Европа в конце XVIII века: кризис старого порядка",
        topic: "Переход к Новому времени (следующий период)",
        aspects: "Обострение социальных противоречий; роль буржуазии; экономические и политические предпосылки будущих революций (без детальной Французской революции)"
      },
      {
        number: 32,
        title: "Повседневная жизнь людей в эпоху Нового времени",
        topic: "Быт и общество",
        aspects: "Жизнь крестьян, горожан, дворян; изменения в одежде, питании, образовании; роль семьи и религии в повседневности"
      },
      {
        number: 33,
        title: "Итоги эпохи XVI–XVIII вв.",
        topic: "Итоговый блок",
        aspects: "Основные изменения в экономике, политике, культуре; формирование мирового рынка; усиление государств и роль колоний"
      },
      {
        number: 34,
        title: "Обобщающий повторительно-практический урок",
        topic: "Итоговый блок",
        aspects: "Хронологическая линия Нового времени; ключевые понятия и персоналии; работа с картой и источниками; итоговый контроль/проект по курсу"
      }
    ]
  },
  {
    grade: 8,
    title: "История для 8 класса",
    description: "Курс истории для восьмиклассников, охватывающий период XIX – начала XX века: Великая французская революция, наполеоновская эпоха, индустриальная революция, национальные движения, объединение Италии и Германии, империализм и предпосылки Первой мировой войны.",
    lessons: [
      {
        number: 1,
        title: "Мир на рубеже XVIII–XIX веков",
        topic: "Введение в курс",
        aspects: "Хронологические рамки; ключевые тенденции: революции, индустриализация, рост городов; основных игроки мировой политики"
      },
      {
        number: 2,
        title: "Франция накануне революции",
        topic: "Великая французская революция",
        aspects: "Абсолютизм; три сословия; финансовый кризис; противоречия в обществе; созыв Генеральных штатов"
      },
      {
        number: 3,
        title: "Начало Великой французской революции",
        topic: "Великая французская революция",
        aspects: "Преобразование Генеральных штатов в Учредительное собрание; клятва в зале для игры в мяч; взятие Бастилии; первые реформы"
      },
      {
        number: 4,
        title: "Радикальный этап революции: якобинцы у власти",
        topic: "Великая французская революция",
        aspects: "Свержение монархии; казнь короля; якобинская диктатура; Террор; массовая мобилизация и война"
      },
      {
        number: 5,
        title: "Итоги Великой французской революции",
        topic: "Великая французская революция",
        aspects: "Отмена сословий и феодальных повинностей; Декларация прав человека и гражданина; формирование новых политических идей; влияние на Европу"
      },
      {
        number: 6,
        title: "Восхождение Наполеона Бонапарта",
        topic: "Наполеоновская эпоха",
        aspects: "Приход Наполеона к власти; консулат и империя; внутренние реформы (кодекс, администрация, школа); личность Наполеона"
      },
      {
        number: 7,
        title: "Наполеоновские войны",
        topic: "Наполеоновская эпоха",
        aspects: "Основные кампании и сражения (обзорно по карте); система вассальных государств; причины поражения Наполеона; ссылка и конец карьеры"
      },
      {
        number: 8,
        title: "Венский конгресс и «европейский концерт»",
        topic: "Послевоенное устройство Европы",
        aspects: "Цели Венского конгресса; реставрация монархий; принципы легитимизма и баланса сил; Священный союз; система международных отношений"
      },
      {
        number: 9,
        title: "Промышленный переворот в Великобритании",
        topic: "Индустриальная революция",
        aspects: "Переход от мануфактуры к фабрике; паровая машина; новые отрасли (текстиль, металлургия, транспорт); изменение деревни и города"
      },
      {
        number: 10,
        title: "Индустриализация в других странах Европы",
        topic: "Индустриальная революция",
        aspects: "Распространение промышленного переворота во Франции, Германии, Бельгии и др.; особенности и темпы; технологический обмен"
      },
      {
        number: 11,
        title: "Новые социальные классы: буржуазия и рабочие",
        topic: "Общество XIX века",
        aspects: "Формирование буржуазии и пролетариата; условия труда на фабриках; рабочий день, детский труд; первые формы протеста"
      },
      {
        number: 12,
        title: "Социалистические идеи и рабочее движение",
        topic: "Общество XIX века",
        aspects: "Утопический социализм; Маркс и Энгельс (на базовом уровне); профсоюзы; забастовки; первые законы о труде"
      },
      {
        number: 13,
        title: "Повседневная жизнь в индустриальную эпоху",
        topic: "Общество XIX века",
        aspects: "Городская среда; жильё, транспорт, санитария; изменения в одежде, питании; досуг и массовая культура первых городских жителей"
      },
      {
        number: 14,
        title: "Европа после Венского конгресса: революции 1820–1830-х годов",
        topic: "Революции и национальные движения",
        aspects: "Основные центры выступлений (Испания, Италия, Греция, Франция, Бельгия); национально-освободительные и либеральные требования; роль масс"
      },
      {
        number: 15,
        title: "«Весна народов»: революции 1848–1849 годов",
        topic: "Революции и национальные движения",
        aspects: "Причины общеевропейского кризиса; ключевые события во Франции, Австрийской империи, Германии, Италии; итоги и уроки революций"
      },
      {
        number: 16,
        title: "Объединение Италии",
        topic: "Национальные государства",
        aspects: "Политическая раздробленность Италии; роль Пьемонта, Кавура, Гарибальди; этапы объединения; формирование королевства Италия"
      },
      {
        number: 17,
        title: "Объединение Германии",
        topic: "Национальные государства",
        aspects: "Раздробленность немецких земель; роль Пруссии и Бисмарка; войны с Данией, Австрией, Францией (обзорно); создание Германской империи"
      },
      {
        number: 18,
        title: "Османская империя и «восточный вопрос»",
        topic: "Национальные движения",
        aspects: "Ослабление Османской империи; интересы великих держав; национальные движения на Балканах; Крымская война (очень кратко, как часть «восточного вопроса»)"
      },
      {
        number: 19,
        title: "Национальные движения в Австрийской империи и на Балканах",
        topic: "Национальные движения",
        aspects: "Состав Австрийской (Австро-Венгерской) империи; чехи, венгры, южные славяне; рост национального самосознания; конфликты и компромиссы"
      },
      {
        number: 20,
        title: "США в первой половине XIX века",
        topic: "США в XIX веке",
        aspects: "Расширение территории (покупки, войны, присоединения); освоение Запада; противоречия между Севером и Югом; вопрос рабства"
      },
      {
        number: 21,
        title: "Гражданская война в США и отмена рабства",
        topic: "США в XIX веке",
        aspects: "Причины конфликта; основные этапы войны (обобщённо); роль Линкольна; отмена рабства; последствия для страны"
      },
      {
        number: 22,
        title: "Латинская Америка после обретения независимости",
        topic: "Латинская Америка",
        aspects: "Разрушение колониальной системы Испании и Португалии; лидеры национально-освободительной борьбы (Сан-Мартин, Боливар — обзорно); проблемы молодых государств"
      },
      {
        number: 23,
        title: "Япония в XIX веке: реформы Мэйдзи",
        topic: "Азия в XIX веке",
        aspects: "Открытие Японии для внешнего мира; падение сёгуната; реформы Мэйдзи (армия, школа, промышленность); превращение в современную державу"
      },
      {
        number: 24,
        title: "Китай в XIX веке: столкновение с Западом",
        topic: "Азия в XIX веке",
        aspects: "Опийные войны; неравноправные договоры; восстания (тайпинов и др. — очень кратко); попытки реформ и сопротивление традиций"
      },
      {
        number: 25,
        title: "Империализм и «гонка за колониями»",
        topic: "Эпоха империализма",
        aspects: "Понятие «империализм»; экономические и политические мотивы захвата территорий; роль монополий и финансового капитала; конкуренция держав"
      },
      {
        number: 26,
        title: "Британская империя и её колонии",
        topic: "Эпоха империализма",
        aspects: "Масштабы Британской империи; управление колониями; Индия как «жемчужина короны»; влияние колониализма на метрополию и местное население"
      },
      {
        number: 27,
        title: "Африка и Азия в системе колониальных владений",
        topic: "Эпоха империализма",
        aspects: "Раздел Африки между европейскими державами (карта); положение местных народов; колониальное управление; первые формы сопротивления"
      },
      {
        number: 28,
        title: "Научно-технический прогресс конца XIX – начала XX века",
        topic: "Рубеж XIX–XX веков",
        aspects: "Новые отрасли промышленности (электротехника, химия, транспорт); изобретения (телефон, радио, автомобиль и др.); влияние НТП на жизнь людей"
      },
      {
        number: 29,
        title: "Культура и массовое общество рубежа веков",
        topic: "Рубеж XIX–XX веков",
        aspects: "Развитие литературы, искусства, музыки (на уровне направлений и имён); появление массовой прессы, кино; изменение системы образования"
      },
      {
        number: 30,
        title: "Международные союзы и блоки",
        topic: "Мир политических союзов",
        aspects: "Формирование Тройственного союза и Антанты; цели и интересы участников; милитаризация политики; рост напряжённости"
      },
      {
        number: 31,
        title: "Конфликты начала XX века",
        topic: "На пути к мировой войне",
        aspects: "Русско-японская война и её последствия в мировой политике; первые Балканские войны; усиление противоречий между великими державами"
      },
      {
        number: 32,
        title: "Мир накануне Первой мировой войны",
        topic: "На пути к мировой войне",
        aspects: "Глобальная карта колоний; экономическое и военно-политическое соперничество; очаги напряжённости; ощущение «неизбежности» большого конфликта"
      },
      {
        number: 33,
        title: "Итоги XIX – начала XX века",
        topic: "Итоговый блок",
        aspects: "Изменение мирового баланса сил; переход к индустриальному обществу; рост роли науки и техники; трансформация политических систем и обществ"
      },
      {
        number: 34,
        title: "Обобщающий повторительно-практический урок",
        topic: "Итоговый блок",
        aspects: "Хронологическая линия периода; ключевые понятия и персоналии; работа с картой и историческими источниками; итоговый контроль/проект по курсу"
      }
    ]
  },
  {
    grade: 9,
    title: "История для 9 класса",
    description: "Курс истории для девятиклассников, охватывающий период XX – начала XXI века: Первая и Вторая мировые войны, холодная война, распад колониальной системы, научно-техническая революция, глобализация и современные вызовы человечества.",
    lessons: [
      {
        number: 1,
        title: "Мир на рубеже XIX–XX веков",
        topic: "Введение в курс",
        aspects: "Политическая карта мира; колониальные империи; военные блоки (Антанта, Тройственный союз); экономические и социальные противоречия"
      },
      {
        number: 2,
        title: "Причины и повод Первой мировой войны",
        topic: "Первая мировая война",
        aspects: "Долгосрочные причины (колонии, рынки, вооружения); национализм; балканский кризис; сараевское убийство как повод"
      },
      {
        number: 3,
        title: "Ход Первой мировой войны 1914–1916 гг.",
        topic: "Первая мировая война",
        aspects: "План Шлиффена; основные фронты и кампании; позиционный характер войны; новые виды вооружений"
      },
      {
        number: 4,
        title: "Завершение Первой мировой войны",
        topic: "Первая мировая война",
        aspects: "Вступление США; выход России из войны; революции и поражение Центральных держав; Компьенское перемирие"
      },
      {
        number: 5,
        title: "Версальско-Вашингтонская система",
        topic: "Послевоенное устройство мира",
        aspects: "Версальский договор; Лига Наций; перекройка границ; репарации и ограничения для Германии; Вашингтонская конференция"
      },
      {
        number: 6,
        title: "Революции в России 1917 года как часть мирового процесса",
        topic: "Революции и кризисы",
        aspects: "Февральская и Октябрьская революции в общем контексте; влияние на ход войны; международная реакция"
      },
      {
        number: 7,
        title: "Гражданская война в России и иностранная интервенция",
        topic: "Революции и кризисы",
        aspects: "Основные силы и фронты; вмешательство иностранных государств; последствия для России и мира"
      },
      {
        number: 8,
        title: "Мир в 1920-е годы: попытки стабилизации",
        topic: "Межвоенный период",
        aspects: "План Дауэса; конференции по вопросам безопасности; относительная стабилизация; культурный подъем «ревущих двадцатых»"
      },
      {
        number: 9,
        title: "СССР в 1920–1930-е годы (обзорно)",
        topic: "Межвоенный период",
        aspects: "Индустриализация и коллективизация (на уровне общих представлений); политический режим; внешнеполитическая роль СССР"
      },
      {
        number: 10,
        title: "Возникновение фашистских и нацистских режимов",
        topic: "Тоталитарные режимы",
        aspects: "Италия Муссолини; приход Гитлера к власти; идеология фашизма и нацизма; методы контроля над обществом"
      },
      {
        number: 11,
        title: "Демократии Запада в межвоенный период",
        topic: "Западные демократии",
        aspects: "Великобритания и Франция после войны; политическая система; социальные реформы; роль США как новой мировой державы"
      },
      {
        number: 12,
        title: "Мировой экономический кризис 1929–1933 гг.",
        topic: "Глобальный кризис",
        aspects: "Причины биржевого краха; распространение кризиса по миру; безработица и социальные проблемы; «Новый курс» Рузвельта"
      },
      {
        number: 13,
        title: "Международные отношения 1930-х годов",
        topic: "Дорога ко Второй мировой",
        aspects: "Политика умиротворения агрессоров; расширение влияния Германии, Италии, Японии; провалы Лиги Наций; «оси» и союзы"
      },
      {
        number: 14,
        title: "Начало Второй мировой войны",
        topic: "Вторая мировая война",
        aspects: "Пакт 1939 г.; нападение на Польшу; раздел Европы; «странная война»; агрессия против Дании, Норвегии, Франции"
      },
      {
        number: 15,
        title: "Расширение войны. Нападение на СССР. Перелом в войне",
        topic: "Вторая мировая война",
        aspects: "Операция «Барбаросса»; Тихоокеанский театр (Пёрл-Харбор, вступление США); Сталинград, Курская битва (обзорно как перелом)"
      },
      {
        number: 16,
        title: "Завершение Второй мировой войны",
        topic: "Вторая мировая война",
        aspects: "Освобождение Европы; капитуляция Германии; война на Тихом океане; атомные бомбардировки (без натурализма); капитуляция Японии"
      },
      {
        number: 17,
        title: "Итоги Второй мировой войны",
        topic: "Послевоенное устройство мира",
        aspects: "Потери и разрушения; изменения границ; создание ООН; военные преступления и трибуналы; начальные противоречия союзников"
      },
      {
        number: 18,
        title: "Начало холодной войны",
        topic: "Холодная война",
        aspects: "Понятие «холодная война»; планы и доктрины (Трумэна и др. на общем уровне); раздел Европы; образование военных блоков (НАТО, ОВД)"
      },
      {
        number: 19,
        title: "Мир в условиях биполярности",
        topic: "Холодная война",
        aspects: "Противостояние двух систем; гонка вооружений; Берлинские кризисы; война в Корее как пример «локальной войны»"
      },
      {
        number: 20,
        title: "«Оттепель» и разрядка международной напряжённости",
        topic: "Холодная война",
        aspects: "Попытки смягчения конфликта; Карибский кризис и опасность ядерной войны; договоры об ограничении вооружений; политика разрядки"
      },
      {
        number: 21,
        title: "Деколонизация и создание новых государств",
        topic: "Послевоенный мир",
        aspects: "Крах колониальной системы; независимость стран Азии и Африки; типичные проблемы новых государств; движение неприсоединения"
      },
      {
        number: 22,
        title: "Научно-техническая революция и космическая эра",
        topic: "Вторая половина XX века",
        aspects: "Массовое производство, автоматизация, электроника; освоение космоса (спутник, первый человек, лунная программа); влияние НТР на жизнь людей"
      },
      {
        number: 23,
        title: "Общество и культура второй половины XX века",
        topic: "Вторая половина XX века",
        aspects: "Рост уровня жизни в развитых странах; «государство всеобщего благосостояния»; права человека; молодёжные движения, массовая культура"
      },
      {
        number: 24,
        title: "Кризис социалистической системы и распад СССР",
        topic: "Перестройка и конец биполярного мира",
        aspects: "Общие причины кризиса социалистического блока; реформы в СССР (обобщённо); распад СССР; изменение политической карты мира"
      },
      {
        number: 25,
        title: "Завершение холодной войны и новая система международных отношений",
        topic: "Мир после холодной войны",
        aspects: "Снижение уровня противостояния; сокращение вооружений; изменение роли ООН и международных организаций; однополярные и многополярные тенденции"
      },
      {
        number: 26,
        title: "Европейская интеграция: от ЕЭС к Европейскому союзу",
        topic: "Европа после войны",
        aspects: "Этапы европейской интеграции; цели объединения; институты ЕС; влияние на экономику и политику региона"
      },
      {
        number: 27,
        title: "Глобализация мировой экономики",
        topic: "Конец XX – начало XXI века",
        aspects: "Понятие «глобализация»; транснациональные корпорации; мировая торговля и финансовые рынки; плюсы и риски взаимозависимости"
      },
      {
        number: 28,
        title: "Конфликты конца XX – начала XXI века",
        topic: "Региональные конфликты",
        aspects: "Локальные войны и кризисы (Балканы, Ближний Восток и др. — обзорно); международный терроризм; роль миротворческих операций"
      },
      {
        number: 29,
        title: "Россия и мир в конце XX – начале XXI века (обзорно)",
        topic: "Россия в мировом контексте",
        aspects: "Место России в международной системе; участие в международных организациях; внешнеполитические приоритеты (на уровне общих представлений)"
      },
      {
        number: 30,
        title: "Международные организации и глобальное управление",
        topic: "Глобальный мир",
        aspects: "Роль ООН, ОБСЕ, НАТО, ЕС и др.; задачи и инструменты; международное право и права человека; проблемы эффективности"
      },
      {
        number: 31,
        title: "Глобальные вызовы XXI века",
        topic: "Современный мир",
        aspects: "Экологические проблемы; демографические изменения; миграция; информационное общество и кибербезопасность; неравенство и бедность"
      },
      {
        number: 32,
        title: "Повседневная жизнь и культура рубежа XX–XXI веков",
        topic: "Современный мир",
        aspects: "Изменения в быте, образовании, досуге; развитие СМИ и интернета; формирование массовой и цифровой культуры"
      },
      {
        number: 33,
        title: "Итоги истории XX – начала XXI века",
        topic: "Итоговый блок",
        aspects: "Ключевые изменения в политике, экономике, обществе и культуре; основные достижения и трагедии века; уроки для современности"
      },
      {
        number: 34,
        title: "Обобщающий повторительно-практический урок",
        topic: "Итоговый блок",
        aspects: "Хронологическая линия; ключевые события и понятия; работа с картой и источниками; итоговый контроль / мини-проект по курсу"
      }
    ]
  },
  {
    grade: 10,
    title: "История для 10 класса",
    description: "Курс истории России для десятиклассников, охватывающий период от восточных славян до конца XVII века: образование Древнерусского государства, период раздробленности, монгольское завоевание, формирование централизованного государства, Смутное время и эпоху первых Романовых.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс истории России",
        topic: "Введение",
        aspects: "Структура курса (древность – XVII век); виды исторических источников по истории России; историческое время и карта; принципы периодизации"
      },
      {
        number: 2,
        title: "Восточные славяне: расселение и занятия",
        topic: "Восточные славяне",
        aspects: "Территория расселения; природные условия; основные занятия (земледелие, охота, бортничество, ремёсла); торговля и пути (в том числе «из варяг в греки»)"
      },
      {
        number: 3,
        title: "Общественный строй и вера восточных славян",
        topic: "Восточные славяне",
        aspects: "Родовая община; вече; старейшины и военная знать; языческие верования, пантеон богов; обряды и праздники"
      },
      {
        number: 4,
        title: "Образование Древнерусского государства",
        topic: "Ранний этап истории Руси",
        aspects: "Варианты происхождения государства (норманнская/антинорманнская концепции — на базовом уровне); Рюрик, Олег; значение пути «из варяг в греки»; объединение Новгорода и Киева"
      },
      {
        number: 5,
        title: "Княжение Олега и Игоря. Княгиня Ольга",
        topic: "Киевская Русь",
        aspects: "Походы Олега на Константинополь; договоры с Византией; внутреннее управление; деятельность Ольги, её реформы и крещение"
      },
      {
        number: 6,
        title: "Князь Святослав и его походы",
        topic: "Киевская Русь",
        aspects: "Военная деятельность Святослава; походы на Хазарию, Болгарию; значение расширения влияния Руси; политические итоги"
      },
      {
        number: 7,
        title: "Крещение Руси при Владимире Святом",
        topic: "Киевская Русь",
        aspects: "Причины принятия христианства; выбор веры по летописи; крещение Владимира и жителей Руси; последствия христианизации (политика, культура, право)"
      },
      {
        number: 8,
        title: "Ярослав Мудрый и расцвет Киевской Руси",
        topic: "Киевская Русь",
        aspects: "Внутренняя политика; «Русская Правда» как первый свод законов; развитие культуры, образования, книжности; строительство храмов (Софийский собор)"
      },
      {
        number: 9,
        title: "Политическое устройство и социальная структура Киевской Руси",
        topic: "Киевская Русь",
        aspects: "Князь, дружина, бояре; вече; свободное и зависимое население; особенности управления крупным государством"
      },
      {
        number: 10,
        title: "Причины политической раздробленности Руси",
        topic: "Период раздробленности",
        aspects: "Наследование уделов; усиление местных князей; роль бояр; экономические предпосылки раздробленности; плюсы и минусы раздробленности"
      },
      {
        number: 11,
        title: "Крупнейшие княжества раздробленной Руси",
        topic: "Период раздробленности",
        aspects: "Владимиро-Суздальское, Галицко-Волынское, Новгородская земля; особенности хозяйства и управления; ключевые князья"
      },
      {
        number: 12,
        title: "Монгольское завоевание Руси",
        topic: "Нашествие и зависимость",
        aspects: "Походы Батыя; падение Рязанского, Владимирского, Киевского княжеств; причины военных поражений Руси; последствия нашествия"
      },
      {
        number: 13,
        title: "Ордынское владычество и его влияние",
        topic: "Нашествие и зависимость",
        aspects: "Система дани и баскаков; ярлыки на княжение; влияние Орды на политическое устройство, военное дело и быт; формы сопротивления"
      },
      {
        number: 14,
        title: "Подъём Северо-Восточной Руси. Москва и Тверь",
        topic: "Формирование центров",
        aspects: "Борьба за лидерство между Москвой и Тверью; роль князей московского дома; значение переезда митрополита в Москву"
      },
      {
        number: 15,
        title: "Дмитрий Донской и Куликовская битва",
        topic: "Формирование центров",
        aspects: "Политика Дмитрия Донского; подготовка к борьбе с Ордой; Куликовская битва и её значение; условный характер «освобождения»"
      },
      {
        number: 16,
        title: "Завершение ордынского владычества",
        topic: "Формирование центров",
        aspects: "Политика Ивана III и Василия III; «стояние на Угре»; факторы падения Орды; укрепление великокняжеской власти"
      },
      {
        number: 17,
        title: "Образование единого Русского государства",
        topic: "Централизованное государство",
        aspects: "Присоединение русских земель к Москве; ликвидация уделов; титул «Государь всея Руси»; государственный аппарат и служилое сословие"
      },
      {
        number: 18,
        title: "Внутренняя политика Ивана III",
        topic: "Централизованное государство",
        aspects: "Судебник 1497 г.; начало оформления крепостной зависимости; развитие дворянского землевладения; символика Московского государства (герб, печати)"
      },
      {
        number: 19,
        title: "Внешняя политика Ивана III и Василия III",
        topic: "Централизованное государство",
        aspects: "Борьба с Литвой; присоединение Новгорода, Твери, Пскова, Смоленска; отношения с Крымским ханством и Ордой; укрепление международного статуса"
      },
      {
        number: 20,
        title: "Россия в начале правления Ивана Грозного",
        topic: "Россия XVI века",
        aspects: "Реформы Избранной рады; первый Земский собор; Стоглавый собор и церковные реформы; военная реформа (стрельцы)"
      },
      {
        number: 21,
        title: "Опричнина и её последствия",
        topic: "Россия XVI века",
        aspects: "Причины введения опричнины; методы управления и репрессии; изменения в структуре землевладения; социальные и экономические итоги"
      },
      {
        number: 22,
        title: "Ливонская война",
        topic: "Россия XVI века",
        aspects: "Цели России в Прибалтике; основные этапы войны; участие соседних государств; причины неудачи и последствия"
      },
      {
        number: 23,
        title: "Россия после Ивана Грозного. «Семибоярщина»",
        topic: "Переходный период",
        aspects: "Краткое правление Фёдора Ивановича; фигура Бориса Годунова; социальный кризис; предпосылки Смуты"
      },
      {
        number: 24,
        title: "Смутное время: причины и начало",
        topic: "Смутное время",
        aspects: "Династический кризис; Лжедмитрии; вмешательство соседних держав; социальные выступления; ослабление государства"
      },
      {
        number: 25,
        title: "Освобождение страны и итоги Смуты",
        topic: "Смутное время",
        aspects: "Народное ополчение Минина и Пожарского; Zemский собор 1613 г. и избрание Михаила Романова; политические и экономические последствия Смуты"
      },
      {
        number: 26,
        title: "Россия при первых Романовых: Михаил Фёдорович",
        topic: "Россия XVII века",
        aspects: "Восстановление хозяйства; формирование новой системы управления; укрепление династии; внешняя политика (в общих чертах)"
      },
      {
        number: 27,
        title: "Россия при Алексее Михайловиче",
        topic: "Россия XVII века",
        aspects: "Соборное Уложение 1649 г.; оформление крепостного права; развитие приказной системы; важнейшие бунты (Соляной, Медный — без натурализма)"
      },
      {
        number: 28,
        title: "Церковный раскол и его последствия",
        topic: "Россия XVII века",
        aspects: "Реформы патриарха Никона; старообрядчество; причины раскола; влияние на общество и культуру"
      },
      {
        number: 29,
        title: "Народные движения XVII века",
        topic: "Россия XVII века",
        aspects: "Крестьянские и городские выступления; движение Степана Разина; причины, ход, результаты; реакция власти"
      },
      {
        number: 30,
        title: "Хозяйство, быт и социальная структура России XVII века",
        topic: "Россия XVII века",
        aspects: "Сословное деление; город и деревня; традиционный быт различных сословий; начало торгово-промышленного развития, мануфактуры"
      },
      {
        number: 31,
        title: "Культура Древней Руси и России XVI–XVII веков",
        topic: "Культура России",
        aspects: "Развитие письменности и летописания; церковное зодчество и иконопись; образование и школа; зарождение светской культуры и театра"
      },
      {
        number: 32,
        title: "Россия на международной арене в XVII веке",
        topic: "Внешняя политика",
        aspects: "Отношения с Речью Посполитой, Швецией, Турцией и Крымом; воссоединение Левобережной Украины с Россией (на базовом уровне); выход к Балтике и Чёрному морю (попытки)"
      },
      {
        number: 33,
        title: "Россия на пороге реформ Петра I: итоги допетровской эпохи",
        topic: "Итоговый блок",
        aspects: "Сильные и слабые стороны государства к концу XVII в.; уровень развития экономики и армии; внутренняя структура общества; предпосылки грядущих преобразований"
      },
      {
        number: 34,
        title: "Обобщающий повторительно-практический урок",
        topic: "Итоговый блок",
        aspects: "Хронологическая линия от восточных славян до конца XVII века; ключевые события, личности и понятия; работа с картой и источниками; итоговый контроль/проект по курсу"
      }
    ]
  },
  {
    grade: 11,
    title: "История для 11 класса",
    description: "Курс истории России для одиннадцатиклассников, охватывающий период XVIII–XXI веков: эпоха Петра I, дворцовые перевороты, реформы XIX века, революции 1917 года, СССР, Великая Отечественная война, перестройка, распад СССР и современная Россия.",
    lessons: [
      {
        number: 1,
        title: "Введение в курс истории России XVIII–XXI вв.",
        topic: "Введение",
        aspects: "Периодизация: от Петра I до современности; типы источников; ключевые проблемы курса (модернизация, реформы/революции, война и мир, государство и общество)"
      },
      {
        number: 2,
        title: "Россия при Петре I: внешнеполитический рывок",
        topic: "Россия в начале XVIII века",
        aspects: "Северная война; создание регулярной армии и флота; Полтавская битва; выход к Балтийскому морю; «имперский» статус России"
      },
      {
        number: 3,
        title: "Реформы Петра I и их последствия",
        topic: "Россия в начале XVIII века",
        aspects: "Государственный аппарат (коллегии, Сенат); губернская реформа; табель о рангах; церковная реформа; изменения в быте и культуре; противоречия и цена реформ"
      },
      {
        number: 4,
        title: "Дворцовые перевороты первой половины XVIII века",
        topic: "Россия XVIII века",
        aspects: "Причины нестабильности престолонаследия; роль гвардии и знати; ключевые правители (Екатерина I, Анна Иоанновна, Елизавета Петровна); общее для эпохи переворотов"
      },
      {
        number: 5,
        title: "Россия в эпоху Екатерины II: внешняя политика",
        topic: "Россия XVIII века",
        aspects: "Русско-турецкие войны; присоединение Крыма; разделы Речи Посполитой; усиление международного авторитета России"
      },
      {
        number: 6,
        title: "Внутренняя политика Екатерины II и общество",
        topic: "Россия XVIII века",
        aspects: "Уложенная комиссия (на общем уровне); Жалованные грамоты дворянству и городам; усиление крепостничества; просвещённый абсолютизм по-русски"
      },
      {
        number: 7,
        title: "Крестьянская война под предводительством Е. Пугачёва",
        topic: "Россия XVIII века",
        aspects: "Причины и состав участников движения; основные события и районы; позиция властей; последствия для крестьян и политики государства"
      },
      {
        number: 8,
        title: "Россия при Павле I и переход к XIX веку",
        topic: "Россия на рубеже XVIII–XIX вв.",
        aspects: "Попытка изменить курс: армия, дворянство, порядок наследования; внешняя политика; причины недовольства и переворота 1801 г."
      },
      {
        number: 9,
        title: "Реформы Александра I и война 1812 года",
        topic: "Россия начала XIX века",
        aspects: "Начальные преобразования (министерства, Негласный комитет); Отечественная война 1812 г.: причины, ход, Бородино, партизаны, изгнание Наполеона; значение победы"
      },
      {
        number: 10,
        title: "Россия в первой половине XIX века при Николае I",
        topic: "Россия первой половины XIX века",
        aspects: "Политика «самодержавия, православия, народности»; бюрократический аппарат и цензура; экономическое развитие; положение сословий"
      },
      {
        number: 11,
        title: "Движение декабристов",
        topic: "Россия первой половины XIX века",
        aspects: "Происхождение движения; Южное и Северное общества; выступление 14 декабря 1825 г.; причины поражения; значение для общественной мысли"
      },
      {
        number: 12,
        title: "Крымская война и её уроки",
        topic: "Россия середины XIX века",
        aspects: "Причины конфликта; основные театры военных действий; оборона Севастополя; международные итоги и внутренние выводы для России"
      },
      {
        number: 13,
        title: "Великие реформы Александра II",
        topic: "Россия второй половины XIX века",
        aspects: "Отмена крепостного права; земская, судебная, военная, городская реформы; их цели, содержание, последствия; противоречия модернизации"
      },
      {
        number: 14,
        title: "Россия при Александре III: контрреформы",
        topic: "Россия второй половины XIX века",
        aspects: "Ограничение реформ Александра II; усиление полиции и цензуры; русификация; развитие промышленности и железных дорог"
      },
      {
        number: 15,
        title: "Россия при Николае II: общество и экономика",
        topic: "Россия на рубеже XIX–XX вв.",
        aspects: "Промышленный рост и социальные конфликты; рабочий класс и буржуазия; аграрный вопрос; особенности политической системы самодержавия"
      },
      {
        number: 16,
        title: "Революция 1905–1907 гг. и её итоги",
        topic: "Россия начала XX века",
        aspects: "Причины (социальные, национальные, политические, Русско-японская война); ключевые события (9 января, Советы); Манифест 17 октября; Государственная дума; значение"
      },
      {
        number: 17,
        title: "Россия в Первой мировой войне",
        topic: "Россия в мировой войне",
        aspects: "Причины участия; основные фронты и операции с участием России; экономический и социальный кризис; падение авторитета власти"
      },
      {
        number: 18,
        title: "Февральская революция 1917 г.",
        topic: "Революции 1917 года",
        aspects: "Причины; падение монархии; Временное правительство; Советы; «двухвластие» и его проблемы; настроения в обществе и армии"
      },
      {
        number: 19,
        title: "Октябрьская революция и установление советской власти",
        topic: "Революции 1917 года",
        aspects: "Подготовка и ход вооружённого восстания; первые декреты; переход власти к большевикам; реакция общества и оппозиции"
      },
      {
        number: 20,
        title: "Гражданская война и «военный коммунизм»",
        topic: "Россия в условиях Гражданской войны",
        aspects: "Основные силы: «красные», «белые», национальные движения, иностранная интервенция; этапы войны; политика военного коммунизма; причины победы большевиков"
      },
      {
        number: 21,
        title: "Переход к НЭПу и создание СССР",
        topic: "СССР в 1920-е годы",
        aspects: "Причины отказа от «военного коммунизма»; основные мероприятия НЭПа; плюсы и ограничения; образование СССР; национальная политика (в общих чертах)"
      },
      {
        number: 22,
        title: "Индустриализация и коллективизация",
        topic: "СССР в 1930-е годы",
        aspects: "Пятилетки и форсированное развитие промышленности; коллективизация сельского хозяйства; раскулачивание; социальная цена модернизации"
      },
      {
        number: 23,
        title: "Политический режим 1930-х годов и репрессии",
        topic: "СССР в 1930-е годы",
        aspects: "Укрепление личной власти Сталина; партия и государственный аппарат; показательные процессы; массовые репрессии; последствия для общества"
      },
      {
        number: 24,
        title: "СССР в годы Великой Отечественной войны",
        topic: "ВОВ и Вторая мировая",
        aspects: "Причины и начало войны для СССР; ключевые этапы (Московская битва, Сталинград, Курск, освобождение Европы, Берлин — обзорно); трудовой подвиг тыла; цена Победы"
      },
      {
        number: 25,
        title: "Послевоенное восстановление и начало холодной войны",
        topic: "СССР в 1940–1950-е годы",
        aspects: "Экономическое восстановление; усиление контроля и идеологическое давление; формирование социалистического лагеря; противостояние с Западом"
      },
      {
        number: 26,
        title: "СССР во время «оттепели»",
        topic: "СССР в 1950–1960-е годы",
        aspects: "Изменения после смерти Сталина; XX съезд и разоблачение культа личности; частичная либерализация; развитие науки и культуры; противоречия периода"
      },
      {
        number: 27,
        title: "«Застой»: СССР в 1960–1980-е годы",
        topic: "СССР в 1960–1980-е годы",
        aspects: "Стабильность и её цена; партийно-государственная система; экономические проблемы; повседневность; внешняя политика (гонка вооружений, конфликты)"
      },
      {
        number: 28,
        title: "Перестройка и распад СССР",
        topic: "СССР в 1980-е годы",
        aspects: "Причины начала реформ; ключевые направления (гласность, ускорение, демократизация); нарастающий кризис; распад СССР и образование СНГ"
      },
      {
        number: 29,
        title: "Россия в 1990-е годы: политические и экономические трансформации",
        topic: "Российская Федерация",
        aspects: "Формирование новой политической системы; приватизация и рыночные реформы; социальные последствия; конфликтные точки (кризисы, вооружённые конфликты — обзорно)"
      },
      {
        number: 30,
        title: "Россия в начале XXI века",
        topic: "Российская Федерация",
        aspects: "Изменения в системе власти; экономическая динамика; социальная политика; роль России в международных отношениях (на уровне общих характеристик)"
      },
      {
        number: 31,
        title: "Общество и повседневная жизнь в России XVIII–XX вв.",
        topic: "Общество и быт",
        aspects: "Эволюция сословной/классовой структуры; положение дворян, крестьян, рабочих, интеллигенции; город и деревня; изменения в быте и менталитете"
      },
      {
        number: 32,
        title: "Культура России XVIII–XIX веков",
        topic: "Культура России",
        aspects: "Развитие литературы, искусства, науки; ключевые имена и явления (классическая литература, живопись, музыка, университеты); вклад России в мировую культуру"
      },
      {
        number: 33,
        title: "Культура России XX – начала XXI века",
        topic: "Культура России",
        aspects: "Советская и постсоветская культура; авангард, соцреализм, «оттепель» в искусстве; кино, массовая культура; сохранение традиций и новые формы"
      },
      {
        number: 34,
        title: "Итоговый обобщающий урок по истории России XVIII–XXI вв.",
        topic: "Итоговый блок",
        aspects: "Хронологическая линия; ключевые поворотные точки; долгосрочные тенденции (модернизация, реформы и революции, войны, смена строя); работа с картой и источниками; итоговый контроль / проект"
      }
    ]
  },
  {
    grade: "oge_history",
    title: "Подготовка к ОГЭ по истории",
    description: "Комплексный курс подготовки к Основному государственному экзамену по истории с разбором всех типов заданий, работой с картами и источниками, тренировочными вариантами.",
    lessons: [
      {
        number: 1,
        title: "Структура и требования ОГЭ по истории",
        topic: "Введение в курс ОГЭ",
        aspects: "Модель КИМ; виды заданий; шкала оценивания; ключевые компетенции (хронология, карта, источники, культура, причинно-следственные связи)"
      },
      {
        number: 2,
        title: "Историческая карта, хронологическая линия, источники",
        topic: "Базовые умения для ОГЭ",
        aspects: "Работа с линией времени; форматы карт в ОГЭ; типы исторических источников; типичные ошибки по заданию на карту и источники"
      },
      {
        number: 3,
        title: "Восточные славяне и образование Древнерусского государства",
        topic: "Древняя Русь",
        aspects: "Расселение славян; путь «из варяг в греки»; версии происхождения государства; Рюрик, Олег, договоры с Византией; ключевые даты и персоналии"
      },
      {
        number: 4,
        title: "Расцвет Киевской Руси и принятие христианства",
        topic: "Древняя Русь",
        aspects: "Владимир Святой и крещение Руси; Ярослав Мудрый, «Русская Правда», Софийские соборы; социальный строй; задания на термины и личности"
      },
      {
        number: 5,
        title: "Политическая раздробленность и культура Руси XII–XIII вв.",
        topic: "Период раздробленности",
        aspects: "Причины раздробленности; крупнейшие княжества; особенности Новгорода; культура (летописи, зодчество); работа с картой по раздробленности"
      },
      {
        number: 6,
        title: "Нашествие монголов и ордынская зависимость",
        topic: "Период раздробленности",
        aspects: "Походы Батыя; падение русских княжеств; система дани и ярлыков; влияние Орды; задания на причинно-следственные связи и хронологию"
      },
      {
        number: 7,
        title: "Возвышение Москвы и ликвидация ордынской зависимости",
        topic: "Формирование единого государства",
        aspects: "Роль Москвы и Твери; Дмитрий Донской и Куликовская битва; Иван III, «стояние на Угре», присоединение земель; практика по датам и персоналиям"
      },
      {
        number: 8,
        title: "Россия в XVI веке: Иван Грозный, опричнина, Ливонская война",
        topic: "Россия XVI века",
        aspects: "Реформы Избранной рады; опричнина и её последствия; цели и итоги Ливонской войны; задания на документы и оценку последствий"
      },
      {
        number: 9,
        title: "Смутное время и приход к власти Романовых",
        topic: "Начало династии Романовых",
        aspects: "Причины Смуты; Лжедмитрии; интервенция; ополчения; Земский собор 1613 г.; практикум по заданиям на события и участников"
      },
      {
        number: 10,
        title: "Россия в XVII веке: первые Романовы, бунты и раскол",
        topic: "Россия XVII века",
        aspects: "Правление Михаила и Алексея; Соборное Уложение 1649 г.; церковный раскол; городские и крестьянские выступления; задания на «лишнее», соответствия"
      },
      {
        number: 11,
        title: "Пётр I: внешняя политика и Северная война",
        topic: "Россия начала XVIII века",
        aspects: "Причины Северной войны; ключевые сражения (Нарва, Полтава, Гангут); выход к Балтике; итоги войны; отработка картографического задания"
      },
      {
        number: 12,
        title: "Пётр I: внутренние реформы и их цена",
        topic: "Россия начала XVIII века",
        aspects: "Административные, военные, церковные реформы; табель о рангах; изменение быта; итоги петровской модернизации; причинно-следственные связки"
      },
      {
        number: 13,
        title: "Дворцовые перевороты. Внешняя политика XVIII века",
        topic: "Россия XVIII века",
        aspects: "Нестабильность престолонаследия; роль гвардии; ключевые войны и присоединения территорий; задания на хронологию и работу с таблицами"
      },
      {
        number: 14,
        title: "Екатерина II: внутренняя политика и крестьянская война Пугачёва",
        topic: "Россия XVIII века",
        aspects: "Просвещённый абсолютизм; Жалованные грамоты; усиление крепостничества; движение Пугачёва; практика по источникам и оценке реформ"
      },
      {
        number: 15,
        title: "Россия в начале XIX века: Александр I и Отечественная война 1812 г.",
        topic: "Россия начала XIX века",
        aspects: "Реформы Александра I (обзорно); причины и ход войны 1812 г.; Бородино, партизанское движение; задания на схемы сражений и карту"
      },
      {
        number: 16,
        title: "Николай I, движение декабристов и социально-политическая система",
        topic: "Россия первой половины XIX века",
        aspects: "Самодержавие, цензура, «официальная народность»; декабристы: цели, программы, восстание; итоги; типовые задания на термины и личности"
      },
      {
        number: 17,
        title: "Великие реформы Александра II и их противоречия",
        topic: "Россия второй половины XIX века",
        aspects: "Отмена крепостного права; земская, судебная, военная, городская реформы; последствия; задания на установление соответствий «реформа — последствия»"
      },
      {
        number: 18,
        title: "Конец XIX – начало XX века: индустриализация, Александр III и Николай II",
        topic: "Россия на рубеже веков",
        aspects: "Промышленный рост; политика Александра III; проблемы самодержавия при Николае II; рабочий и национальный вопросы; практикум по заданиям части 1"
      },
      {
        number: 19,
        title: "Первая российская революция 1905–1907 гг. и думская монархия",
        topic: "Россия начала XX века",
        aspects: "Причины, ключевые события; Манифест 17 октября; создание Государственной думы; итоги; задания на причинно-следственные связи и документы"
      },
      {
        number: 20,
        title: "Россия в Первой мировой войне. Февраль 1917 года",
        topic: "Россия в мировой войне",
        aspects: "Участие России в войне; кризис власти и экономики; Февральская революция, Временное правительство, Советы; задания на хронологию и карту"
      },
      {
        number: 21,
        title: "Октябрьская революция, Гражданская война и НЭП",
        topic: "Революции и Гражданская война",
        aspects: "Приход большевиков к власти; этапы Гражданской войны; интервенция; причины и сущность НЭПа; практикум по источникам и схемам"
      },
      {
        number: 22,
        title: "СССР в 1930-е годы: индустриализация, коллективизация, репрессии",
        topic: "СССР межвоенного периода",
        aspects: "Пятилетки; коллективизация и её последствия; массовые репрессии; формирование тоталитарного режима; задания на оценку политики и её результатов"
      },
      {
        number: 23,
        title: "СССР в годы Великой Отечественной войны",
        topic: "Великая Отечественная война",
        aspects: "Этапы войны (оборонительный, перелом, наступательный); ключевые сражения; вклад тыла; человеческие потери; практикум по карте и заданиям на события"
      },
      {
        number: 24,
        title: "Послевоенный СССР: холодная война, «оттепель», «застой»",
        topic: "СССР во второй половине XX века",
        aspects: "Восстановление экономики; формирование социалистического блока; политика Хрущёва, Брежнева (обзорно); повседневность; задания на периодизацию"
      },
      {
        number: 25,
        title: "Перестройка и распад СССР. Формирование РФ",
        topic: "СССР и РФ на рубеже эпох",
        aspects: "Причины перестройки; ключевые решения; распад СССР; создание Российской Федерации; практикум по заданиям на причинно-следственные связи и документы"
      },
      {
        number: 26,
        title: "Россия в 1990–2000-е гг.",
        topic: "Современная Россия",
        aspects: "Политическая система; экономические реформы и их последствия; социальные изменения; внешняя политика — на уровне общих представлений; типовые задания по новейшей истории"
      },
      {
        number: 27,
        title: "Практикум: задания части 1 (тест, термины, соответствия)",
        topic: "Экзаменационные умения",
        aspects: "Отработка заданий на термины и понятия; установление соответствия «личность — деятельность», «событие — дата»; типовые форматы и стратегии выполнения"
      },
      {
        number: 28,
        title: "Практикум: работа с исторической картой",
        topic: "Экзаменационные умения",
        aspects: "Алгоритм решения картографических заданий; определение времени, событий, направлений ударов; «подводные камни»; комплексная тренировка по карте"
      },
      {
        number: 29,
        title: "Практикум: работа с историческим источником",
        topic: "Экзаменационные умения",
        aspects: "Анализ текста источника; определение автора, времени, события; извлечение информации; задания на аргументацию по источнику"
      },
      {
        number: 30,
        title: "Практикум: культура России в ОГЭ",
        topic: "Экзаменационные умения",
        aspects: "Типы заданий по культуре; памятники архитектуры, живопись, литература, музыка, театр; привязка к эпохам; приёмы запоминания и систематизации"
      },
      {
        number: 31,
        title: "Практикум: хронология, причинно-следственные связи, итоги эпох",
        topic: "Экзаменационные умения",
        aspects: "Линейка ключевых дат; «цепочки» событий; причины и последствия; работа с заданиями на установление последовательности"
      },
      {
        number: 32,
        title: "Практикум: развёрнутый ответ / мини-сочинение",
        topic: "Экзаменационные умения",
        aspects: "Структура развёрнутого ответа; типичные темы; критерии оценивания; отработка планов ответа и аргументации на историческом материале"
      },
      {
        number: 33,
        title: "Пробный вариант ОГЭ по истории",
        topic: "Итоговая диагностика",
        aspects: "Выполнение полного варианта КИМ в условиях, максимально приближенных к экзамену; фиксация проблемных зон по результатам"
      },
      {
        number: 34,
        title: "Разбор пробника и финальная подготовка",
        topic: "Итоговая диагностика",
        aspects: "Анализ типичных ошибок; индивидуальные рекомендации; чек-лист подготовки к экзамену; стратегии поведения на ОГЭ, распределение времени"
      }
    ]
  },
  {
    grade: "ege_history",
    title: "Подготовка к ЕГЭ по истории",
    description: "Интенсивный курс подготовки к Единому государственному экзамену по истории с системным изучением всех периодов, разбором заданий части 1 и 2, историческим сочинением и тренировочными вариантами.",
    lessons: [
      {
        number: 1,
        title: "Модель ЕГЭ и стратегия подготовки",
        topic: "Введение в курс ЕГЭ",
        aspects: "Структура КИМ (часть 1 и 2); критерии оценивания; типовые ошибки; принципы работы с демоверсией и спецификацией; индивидуальный план подготовки"
      },
      {
        number: 2,
        title: "Базовые навыки: хронология, карта, источники",
        topic: "Базовые умения",
        aspects: "Алгоритм работы с линией времени; типы заданий по карте; анализ исторического источника; требования к аргументации и причинно-следственным связям"
      },
      {
        number: 3,
        title: "Древняя Русь и Киевское государство",
        topic: "Древнерусский период",
        aspects: "Восточные славяне; образование Древнерусского государства; Олег, Игорь, Ольга, Святослав; крещение Руси; Ярослав Мудрый; ключевые даты, личности, карта, источники"
      },
      {
        number: 4,
        title: "Раздробленность Руси и монгольское нашествие",
        topic: "Период раздробленности",
        aspects: "Причины и итоги раздробленности; крупнейшие княжества; Новгородская республика; нашествие Батыя; система ордынской зависимости; задания на карту и причинность"
      },
      {
        number: 5,
        title: "Возвышение Москвы и формирование единого государства",
        topic: "Конец XIII–XV вв.",
        aspects: "Москва и Тверь; Дмитрий Донской, Куликовская битва; политика Ивана III и Василия III; «стояние на Угре»; ликвидация уделов; формирование централизованного государства"
      },
      {
        number: 6,
        title: "Россия XVI века: Иван Грозный и Смутное время",
        topic: "XVI – начало XVII вв.",
        aspects: "Реформы Избранной рады; опричнина; Ливонская война; кризис династии; Смутное время (Лжедмитрии, интервенция, ополчения); военный и социальный контекст; типовые задания блока"
      },
      {
        number: 7,
        title: "Россия XVII века: первые Романовы и переход к империи",
        topic: "XVII век",
        aspects: "Восстановление страны после Смуты; Соборное Уложение 1649 г.; бунты и раскол; внешняя политика (Украина, войны со Швецией и Польшей); предпосылки реформ Петра"
      },
      {
        number: 8,
        title: "Пётр I: реформы и внешняя политика",
        topic: "Раннее XVIII столетие",
        aspects: "Северная война и выход к Балтике; преобразование армии, флота, управления, церкви; социальные последствия модернизации; оценка реформ; задания на источники и эссе по эпохе"
      },
      {
        number: 9,
        title: "Россия в XVIII веке: дворцовые перевороты и Екатерина II",
        topic: "XVIII век",
        aspects: "Эпоха переворотов (общие черты); внешняя политика; реформы и практика просвещённого абсолютизма; крестьянская война Пугачёва; кризис крепостничества"
      },
      {
        number: 10,
        title: "Россия в первой половине XIX века: Александр I и Николай I",
        topic: "Начало XIX века",
        aspects: "Реформы Александра I; Отечественная война 1812 г.; движение декабристов; система Николая I; идеология «официальной народности»; промышленный и социальный контекст"
      },
      {
        number: 11,
        title: "Великие реформы и контрреформы",
        topic: "Вторая половина XIX века",
        aspects: "Отмена крепостного права; земская, судебная, военная, городская, школьная реформы; курс Александра III; индустриализация; национальный и рабочий вопрос"
      },
      {
        number: 12,
        title: "Россия на рубеже XIX–XX веков",
        topic: "Рубеж веков",
        aspects: "Экономический рост и противоречия модернизации; политические партии и движения; Русско-японская война; социальная структура; задания на причинно-следственные связи"
      },
      {
        number: 13,
        title: "Революция 1905–1907 гг. и думская монархия",
        topic: "Начало XX века",
        aspects: "Причины, ход и итоги революции; Манифест 17 октября; реформы Столыпина; эволюция Государственной думы; документы и интерпретации"
      },
      {
        number: 14,
        title: "Россия в Первой мировой войне. Февральская и Октябрьская революции",
        topic: "Первая мировая и 1917 г.",
        aspects: "Участие России в войне; кризис самодержавия; падение монархии; Временное правительство; Октябрьский переворот; специфика двух революций и оценка их характера"
      },
      {
        number: 15,
        title: "Гражданская война, «военный коммунизм», НЭП, образование СССР",
        topic: "1918–1920-е годы",
        aspects: "Основные силы и этапы Гражданской войны; политика «военного коммунизма»; причины и сущность НЭПа; национальная политика и создание СССР; задания на карту и источники"
      },
      {
        number: 16,
        title: "Индустриализация, коллективизация, политический режим 1930-х",
        topic: "СССР межвоенного периода",
        aspects: "Экономическая модернизация; колхозы и раскулачивание; репрессии; Конституция 1936 г.; внешняя политика 1930-х; оценка сталинской модернизации"
      },
      {
        number: 17,
        title: "СССР в годы Великой Отечественной войны",
        topic: "1941–1945 гг.",
        aspects: "Причины и этапы войны; ключевые сражения; вклад тыла; цена Победы; международный статус СССР; типовые задания по ВОВ (карта, источники, причинность)"
      },
      {
        number: 18,
        title: "СССР в послевоенный период: от «жёстких лет» до «оттепели»",
        topic: "1945–1960-е гг.",
        aspects: "Восстановление; начало холодной войны; формирование соцлагеря; смерть Сталина; реформы Хрущёва; внутренняя и внешняя политика; общество и культура"
      },
      {
        number: 19,
        title: "«Застой», перестройка и распад СССР",
        topic: "1960–1991 гг.",
        aspects: "Особенности «застоя»; экономические и политические проблемы; реформы Горбачёва; рост кризиса; распад СССР; оценка периода"
      },
      {
        number: 20,
        title: "РФ в 1990–2000-е гг. и в начале XXI века (обзорно)",
        topic: "Современный период",
        aspects: "Политическая система; экономические реформы; внешняя политика; социально-культурные тенденции; структура заданий по новейшей истории"
      },
      {
        number: 21,
        title: "Ключевые линии развития России: власть, экономика, общество",
        topic: "Систематизация",
        aspects: "Эволюция формы правления; смена типов хозяйства (от натурального к индустриальному и постиндустриальному); социальная структура; повторение длительных тенденций"
      },
      {
        number: 22,
        title: "История культуры России: XVIII–начало XX века",
        topic: "Культура",
        aspects: "Основные эпохи и стили; ключевые деятели литературы, искусства, науки; привязка к правителям и периодам; типовые задания по культуре"
      },
      {
        number: 23,
        title: "История культуры СССР и современной России",
        topic: "Культура",
        aspects: "Современные культурные процессы; советский авангард, соцреализм, «оттепель», позднесоветская культура; культура постсоветского периода; экзаменационные задания по культуре"
      },
      {
        number: 24,
        title: "Структура КИМ: разбор части 1 (тест, карта, источники)",
        topic: "Экзаменационные умения",
        aspects: "Стратегия решения заданий 1–…: работа с текстом, карта, термины, хронология, культурные объекты; типичные ловушки; тренировка на мини-варианте"
      },
      {
        number: 25,
        title: "Структура КИМ: разбор части 2 (задания с развёрнутым ответом)",
        topic: "Экзаменационные умения",
        aspects: "Задания на работу с источником, историческими аргументами, планом; критерии оценивания; требования к полноте ответа; примеры высокобалльных решений"
      },
      {
        number: 26,
        title: "Историческое сочинение (эссе): формальные требования и критерии",
        topic: "Историческое сочинение",
        aspects: "Структура сочинения (проблема, факты, причинно-следственные связи, роль личности, оценка и выводы); критерии К1–К…; типичные ошибки и «минимальный обязательный набор» элементов"
      },
      {
        number: 27,
        title: "Практикум по сочинению: «политическое развитие России»",
        topic: "Историческое сочинение",
        aspects: "Отработка эссе на одной сквозной линии (политическая история: власть, государственное устройство, реформы/революции); тренировка подбора фактов и связей, формулировки выводов"
      },
      {
        number: 28,
        title: "Практикум по сочинению: «экономика, социальная сфера, быт»",
        topic: "Историческое сочинение",
        aspects: "Эссе по экономическим и социальным темам; подбор примеров по периодам; демонстрация причинно-следственных связей и длительных тенденций; работа по критериям"
      },
      {
        number: 29,
        title: "Практикум по сочинению: «культура и духовная жизнь»",
        topic: "Историческое сочинение",
        aspects: "Эссе по культурно-идеологической линии; типовые сюжеты; использование культурных примеров для аргументации; отработка структуры и логики"
      },
      {
        number: 30,
        title: "Комплексный разбор варианта ЕГЭ №1",
        topic: "Интегрированная тренировка",
        aspects: "Полное выполнение варианта: тайм-менеджмент, порядок решений, тактика по сложным заданиям; фиксация типичных ошибок; индивидуальные зоны риска"
      },
      {
        number: 31,
        title: "Комплексный разбор варианта ЕГЭ №2",
        topic: "Интегрированная тренировка",
        aspects: "Вариант с акцентом на слабые места группы (культура, карта, сочинение и т.д.); разбор с привязкой к критериям; выработка шаблонов решения"
      },
      {
        number: 32,
        title: "Тематическое повторение: древность – конец XVIII века",
        topic: "Итоговая систематизация",
        aspects: "Повторение блоком: ключевые события, личности, даты, реформы до конца XVIII века; линейка хронологии; быстрые блиц-тесты"
      },
      {
        number: 33,
        title: "Тематическое повторение: XIX – начало XXI века",
        topic: "Итоговая систематизация",
        aspects: "Повторение блоком: ключевые события, войны, реформы, революции, культура; хронология и карта; закрытие «белых пятен»"
      },
      {
        number: 34,
        title: "Итоговый пробник и разбор",
        topic: "Итоговый блок",
        aspects: "Полноценный вариант ЕГЭ в режиме «как на экзамене» + подробный разбор; персональные рекомендации по последней неделе/месяцу подготовки; чек-лист перед экзаменом"
      }
    ]
  },
  {
    grade: 200,
    title: "История России для ВУЗа",
    description: "Университетский курс истории России с углубленным изучением методологии, историографии, ключевых периодов и процессов от древности до современности. Академический подход к анализу исторических источников и интерпретации событий.",
    lessons: [
      {
        number: 1,
        title: "Что такое историческое знание",
        topic: "Введение в курс",
        aspects: "История как наука; источники и историография; факт vs интерпретация; уровни анализа (событийный, процессуальный, структурный); требования к курсу и формам контроля"
      },
      {
        number: 2,
        title: "Историческое время, пространство и источники по истории России",
        topic: "Методология",
        aspects: "Периодизация истории России; историческое пространство (границы, регионы, центр–периферия); типы источников по российской истории; критика источника"
      },
      {
        number: 3,
        title: "Восточные славяне и предпосылки российской государственности",
        topic: "Древнейший период",
        aspects: "Среда и расселение восточных славян; социальная организация (община, племя); торговые пути; предпосылки образования государственности"
      },
      {
        number: 4,
        title: "Древнерусское государство: становление и специфика",
        topic: "Киевская Русь",
        aspects: "Теории происхождения Руси; роль династии Рюриковичей; политическая система; место Руси в европейском контексте; оценка моделей (норманнская/антинорманнская)"
      },
      {
        number: 5,
        title: "Христианизация Руси и формирование единого культурного пространства",
        topic: "Киевская Русь",
        aspects: "Политические и культурные причины крещения; трансформация обычаев и права; роль церкви; долгосрочные эффекты христианизации для российской цивилизации"
      },
      {
        number: 6,
        title: "Политическая раздробленность и «региональные модели» Руси",
        topic: "Раздробленность",
        aspects: "Экономика и политика раздробленности; Владимиро-Суздальская, Галицко-Волынская, Новгородская модели; плюсы/минусы децентрализации; долгосрочные последствия"
      },
      {
        number: 7,
        title: "Монгольское завоевание и ордынская система",
        topic: "Нашествие и зависимость",
        aspects: "Военные кампании и механика завоевания; институты ордынской зависимости; влияние Орды на политические практики, армию, налоговую систему; современные дискуссии (татаро-монгольское иго)"
      },
      {
        number: 8,
        title: "Московская централизация: от удельной земли к ядру государства",
        topic: "Формирование центра",
        aspects: "Причины возвышения Москвы; институциональные и ресурсные преимущества; роль церкви и символического капитала; борьба с Тверью; «собирание земель»"
      },
      {
        number: 9,
        title: "Формирование единого Русского государства",
        topic: "Позднее средневековье",
        aspects: "Политика Ивана III и Василия III; ликвидация уделов; Судебник; служилое сословие; интеграция регионов; влияние на структуру общества"
      },
      {
        number: 10,
        title: "Раннее самодержавие: Иван Грозный, опричнина и государственное насилие",
        topic: "XVI век",
        aspects: "Логика реформ Избранной рады; природа опричнины; трансформация элит; Ливонская война и внешнеполитические просчёты; интерпретации фигуры Ивана IV в историографии"
      },
      {
        number: 11,
        title: "Смутное время как системный кризис",
        topic: "Начало XVII века",
        aspects: "Многофакторность кризиса (династический, социальный, конфессиональный, внешнеполитический); механизмы распада власти; роль «низов» и «верхов»; уроки Смуты для российской политической традиции"
      },
      {
        number: 12,
        title: "Романовы и реконструкция государства в XVII веке",
        topic: "Раннее новое время",
        aspects: "Восстановление управляемости; Соборное Уложение 1649 г.; формализация крепостничества; церковный раскол; бунты и их политический смысл"
      },
      {
        number: 13,
        title: "Петровские реформы и «европеизация» России",
        topic: "Переход к империи",
        aspects: "Северная война; институциональные реформы (армия, бюрократия, церковь); социальная инженерия; ценностные изменения; цена и пределы модернизации «сверху»"
      },
      {
        number: 14,
        title: "Имперская модель XVIII века: от дворцовых переворотов до Екатерины II",
        topic: "Российская империя",
        aspects: "Механика элитной политики; просвещённый абсолютизм по-русски; крестьянство и элита; внешняя экспансия; восстание Пугачёва как тест устойчивости системы"
      },
      {
        number: 15,
        title: "Россия в первой половине XIX века: между традицией и модернизацией",
        topic: "Начало XIX века",
        aspects: "Реформы Александра I; война 1812 г. и национальная мобилизация; идеология Николая I; декабристы и альтернативные пути развития; баланс модернизации и контроля"
      },
      {
        number: 16,
        title: "Великие реформы и индустриализация: модернизационный рывок",
        topic: "Вторая половина XIX века",
        aspects: "Отмена крепостного права; институциональные реформы; промышленный рост; изменение социальной структуры (буржуазия, рабочий класс, интеллигенция); ограничения реформ"
      },
      {
        number: 17,
        title: "Политическая система поздней империи и национальный вопрос",
        topic: "Рубеж XIX–XX вв.",
        aspects: "Самодержавие и попытки конституционализации; партии и движения; национальные окраины и политика центра; сравнительный анализ с другими империями (Австро-Венгрия, Османская)"
      },
      {
        number: 18,
        title: "Русская революция 1905–1907 гг. и думская монархия",
        topic: "Рубеж веков",
        aspects: "Причины и формы протеста; институциональные итоги (Дума, манифест); реформы Столыпина; устойчивость/хрупкость обновлённой системы; историографические оценки"
      },
      {
        number: 19,
        title: "Первая мировая война и крах империи",
        topic: "Начало XX века",
        aspects: "Влияние войны на экономику, армию, общество; революции 1917 года в контексте мировой войны; Февраль и Октябрь как конкурирующие модели будущего"
      },
      {
        number: 20,
        title: "Гражданская война и эксперимент большевистского проекта",
        topic: "1917–1920-е",
        aspects: "Логика большевистской власти; «военный коммунизм»; структура противостояния; формирование новых институтов; НЭП как тактический откат и стратегический компромисс"
      },
      {
        number: 21,
        title: "Индустриализация, коллективизация и сталинская трансформация",
        topic: "1930-е годы",
        aspects: "Пятилетки; коллективизация и её человеческая цена; политические репрессии; формирование сталинской модели; дебаты о «цене модернизации»"
      },
      {
        number: 22,
        title: "СССР во Второй мировой / Великой Отечественной войне",
        topic: "1941–1945",
        aspects: "Предвоенная внешняя политика; структура военных усилий; мобилизация ресурсов; вклад СССР в победу; последствия войны для государства и общества"
      },
      {
        number: 23,
        title: "Послевоенный СССР: от позднего сталинизма к «оттепели»",
        topic: "1945–1960-е",
        aspects: "Восстановление; холодная война; трансформация режима после смерти Сталина; реформы Хрущёва; изменения в обществе и культуре"
      },
      {
        number: 24,
        title: "«Застой» как стабильность и стагнация",
        topic: "1960–1980-е",
        aspects: "Политическая система позднего СССР; ресурсная модель экономики; повседневность и социальные практики; диссидентское движение; долгосрочные дисфункции системы"
      },
      {
        number: 25,
        title: "Перестройка и распад СССР",
        topic: "1980–1991",
        aspects: "Причины начала реформ; попытка политической и экономической модернизации; рост системного кризиса; сценарии распада и альтернативы; международный контекст"
      },
      {
        number: 26,
        title: "Российская Федерация 1990-х: трансформационный шок",
        topic: "Переходный период",
        aspects: "Конституционный дизайн; приватизация и формирование нового бизнеса; социальные последствия реформ; региональные конфликты; изменение внешнеполитического статуса"
      },
      {
        number: 27,
        title: "Россия в 2000–2010-е годы: консолидация и новые вызовы",
        topic: "Современный период",
        aspects: "Модель «вертикали власти»; экономическая динамика (сырьевой рост, кризисы); трансформация институтов; внешнеполитический курс; общественные настроения"
      },
      {
        number: 28,
        title: "Общество и повседневная жизнь в истории России",
        topic: "Социальная история",
        aspects: "Долгие изменения в демографии, семье, труде, образовании; город и деревня; гендерный аспект; массовая культура; методология «истории повседневности»"
      },
      {
        number: 29,
        title: "Культура и идентичность: от имперского проекта к советскому и постсоветскому",
        topic: "Культурная история",
        aspects: "Ключевые культурные коды империи, СССР и современной России; канон и контркультура; роль литературы, кино, искусства в формировании идентичности"
      },
      {
        number: 30,
        title: "Россия и мир: внешняя политика и международные роли",
        topic: "Международный контекст",
        aspects: "Эволюция внешнеполитических стратегий (империя – СССР – РФ); участие в международных институтах; война и дипломатия; смена образа России в мире"
      },
      {
        number: 31,
        title: "Историография российской истории: подходы и споры",
        topic: "Историография",
        aspects: "Советская, постсоветская и зарубежная историографические традиции; ревизионизм, постревизионизм; политизация исторического знания; «историческая политика»"
      },
      {
        number: 32,
        title: "История России в экзаменах и научных текстах: практикум",
        topic: "Академические навыки",
        aspects: "Анализ фрагментов монографий и статей; работа с цифрами, графиками, картами; подготовка к зачёту/экзамену; требования к ссылкам и списку литературы"
      },
      {
        number: 33,
        title: "Кейс-стади: разбор одного «длинного» процесса",
        topic: "Аналитический модуль",
        aspects: "Один выбранный процесс (напр. «формирование российского самодержавия», «аграрный вопрос», «национальная политика») на длинном интервале; причинно-следственные связи; смена институциональных форм"
      },
      {
        number: 34,
        title: "Итоговое занятие: синтез и подготовка к зачёту/экзамену",
        topic: "Итог",
        aspects: "Повторение ключевых периодов и трендов; типовые вопросы к экзамену; структурирование ответа; рекомендации по подготовке и дальнейшему чтению"
      }
    ]
  },
  {
    grade: 5,
    title: "Обществознание для 5 класса",
    description: "Вводный курс обществознания для пятиклассников с акцентом на понимание человека в обществе, социальных норм, семьи, школы, культуры и основ экономики. Формирование базовых социальных компетенций.",
    lessons: [
      {
        number: 1,
        title: "Вводный урок: зачем изучать обществознание",
        topic: "Обществознание как школьный предмет",
        aspects: "Что изучает обществознание; чем отличается от истории и географии; зачем знать об обществе; правила работы на уроке, формы контроля"
      },
      {
        number: 2,
        title: "Человек среди людей",
        topic: "Человек как общественное существо",
        aspects: "Биологическое и социальное в человеке; потребность в общении; примеры того, как общество влияет на человека и как человек влияет на общество"
      },
      {
        number: 3,
        title: "Индивидуальность каждого",
        topic: "Личность и индивидуальность",
        aspects: "Черты личности; темперамент и характер простым языком; уважение к особенностям других людей; самооценка и её влияние на поведение"
      },
      {
        number: 4,
        title: "Зачем человеку что-то нужно",
        topic: "Потребности и интересы",
        aspects: "Виды потребностей (естественные, социальные, духовные); интересы и увлечения; разумное удовлетворение потребностей; вредные и полезные потребности"
      },
      {
        number: 5,
        title: "Как человек действует",
        topic: "Деятельность человека",
        aspects: "Понятие деятельности; цель, средства, результат; игра, учёба, труд; почему учёба — это работа на будущее"
      },
      {
        number: 6,
        title: "Умеем ли мы общаться",
        topic: "Общение и его виды",
        aspects: "Виды общения (устное, письменное, невербальное); правила культурного общения; умение слушать; почему важно уметь договариваться"
      },
      {
        number: 7,
        title: "Я и моя компания",
        topic: "Группа и коллектив",
        aspects: "Малая группа, класс, школьный коллектив; лидер и команда; обязанности участника коллектива; что такое «командная работа»"
      },
      {
        number: 8,
        title: "Семья – первая школа жизни",
        topic: "Семья как малая социальная группа",
        aspects: "Признаки семьи; семейные роли (родители, дети); обязанности в семье; уважение к старшим; традиции семьи"
      },
      {
        number: 9,
        title: "Домашние обязанности без скандалов",
        topic: "Семейный уклад и бытовой труд",
        aspects: "Распределение домашних обязанностей; почему важно помогать дома; конфликт из-за дел по дому и как его предотвратить; уважительное общение в семье"
      },
      {
        number: 10,
        title: "Школа – наш второй дом",
        topic: "Школа как социальный институт",
        aspects: "Зачем нужна школа; участники образовательного процесса (ученики, учителя, родители, администрация); школьные правила и дисциплина"
      },
      {
        number: 11,
        title: "Права и обязанности школьника",
        topic: "Нормы в школьной жизни",
        aspects: "Понятие права и обязанности на уровне школьника; примерные права ученика; его обязанности; что такое школьный устав и почему важно его соблюдать"
      },
      {
        number: 12,
        title: "Когда «можно», «нельзя» и «нужно»",
        topic: "Социальные нормы",
        aspects: "Виды норм (правила, традиции, обычаи, моральные нормы); примеры норм в семье, школе, на улице; последствия соблюдения и нарушения норм"
      },
      {
        number: 13,
        title: "Вежливость в школе и на улице",
        topic: "Культура поведения",
        aspects: "Этикет в классе, столовой, транспорте; речь и вежливые формы обращения; уважение к чужому труду и личному пространству"
      },
      {
        number: 14,
        title: "Что такое добро и зло",
        topic: "Нравственные ценности",
        aspects: "Добро, зло, совесть, справедливость; моральный выбор в простых жизненных ситуациях; сочувствие и помощь другим людям"
      },
      {
        number: 15,
        title: "Я и мой класс: конфликт или диалог",
        topic: "Конфликты и их решение",
        aspects: "Причины конфликтов между одноклассниками; поведение в конфликтной ситуации; шаги по мирному урегулированию; роль учителя и родителей"
      },
      {
        number: 16,
        title: "Мы – граждане своей страны",
        topic: "Россия как государство",
        aspects: "Что такое государство в самом общем виде; страна и её граждане; символы России (флаг, герб, гимн); уважение к государственной символике"
      },
      {
        number: 17,
        title: "Зачем нужны правила и законы",
        topic: "Право и порядок в обществе",
        aspects: "Жизнь по правилам; примеры простых правовых норм (ПДД, школьные правила, правила поведения в общественных местах); личная безопасность"
      },
      {
        number: 18,
        title: "Мой режим дня",
        topic: "Здоровый образ жизни",
        aspects: "Режим дня школьника; баланс учёбы, отдыха и сна; влияние режима на здоровье и успеваемость; вредные привычки и их последствия"
      },
      {
        number: 19,
        title: "Человек и природа",
        topic: "Общество и природная среда",
        aspects: "Взаимосвязь человека и природы; бережное отношение к ресурсам; примеры экологических проблем и простых действий по их предотвращению"
      },
      {
        number: 20,
        title: "Экологический патруль",
        topic: "Ответственность за окружающий мир",
        aspects: "Личный вклад в сохранение природы (раздельный сбор, экономия воды и электроэнергии); школьные и семейные экологические инициативы"
      },
      {
        number: 21,
        title: "Мир культуры вокруг нас",
        topic: "Культура и её формы",
        aspects: "Понятие культуры; предметы быта, произведения искусства, традиции как элементы культуры; культурное наследие и его сохранение"
      },
      {
        number: 22,
        title: "Праздники и традиции народов России",
        topic: "Культурное разнообразие",
        aspects: "Государственные и народные праздники; обряды и традиции; уважение к обычаям других народов; межнациональное общение"
      },
      {
        number: 23,
        title: "Что такое экономика",
        topic: "Простые основы экономики",
        aspects: "Потребности и ограниченные ресурсы; товары и услуги; пример «домашней экономики»; роль труда в создании благ"
      },
      {
        number: 24,
        title: "Деньги и покупки",
        topic: "Деньги в нашей жизни",
        aspects: "Зачем нужны деньги; карманные расходы; разумное потребление; реклама и её влияние на выбор; опасность долгов и необдуманных трат"
      },
      {
        number: 25,
        title: "Семейный бюджет простыми словами",
        topic: "Доходы и расходы семьи",
        aspects: "Откуда берутся деньги в семье; основные статьи расходов; планирование покупок; экономное и ответственное отношение к семейным средствам"
      },
      {
        number: 26,
        title: "Мир профессий",
        topic: "Труд и профессия",
        aspects: "Разнообразие профессий; чем отличаются профессия, должность, специальность; пример выбора будущей профессии; роль труда взрослых для общества"
      },
      {
        number: 27,
        title: "Я – житель своего города (села)",
        topic: "Малая родина",
        aspects: "Понятие «малая родина»; важные места и объекты в родном городе/селе; вклад жителей в благоустройство территории; участие школьников"
      },
      {
        number: 28,
        title: "Как управляют нашим городом",
        topic: "Местное самоуправление (на доступном уровне)",
        aspects: "Кто отвечает за дороги, школы, парки; органы местной власти; обращение граждан (письмо, обращение, просьба); школьные проекты по улучшению среды"
      },
      {
        number: 29,
        title: "Интернет – это серьёзно",
        topic: "Безопасность в интернете",
        aspects: "Правила поведения в сети; личные данные и их защита; уважительное общение онлайн; риски (фейки, кибербуллинг) и куда обращаться за помощью"
      },
      {
        number: 30,
        title: "Телевидение, соцсети и мы",
        topic: "Средства массовой информации",
        aspects: "Что такое СМИ; чем отличаются новости и развлекательные передачи; критическое отношение к информации; влияние медиа на взгляды людей"
      },
      {
        number: 31,
        title: "Мы все разные – мы вместе",
        topic: "Толерантность и уважение к другим",
        aspects: "Уважение к людям другой национальности, религии, культуры; недопустимость оскорблений и дискриминации; примеры доброжелательного поведения"
      },
      {
        number: 32,
        title: "Человек, его потребности и деятельность – повторение",
        topic: "Итог по блоку «Человек»",
        aspects: "Обобщение тем о человеке, его потребностях, деятельности, общении; мини-тест или игра-викторина; разбор типичных жизненных ситуаций"
      },
      {
        number: 33,
        title: "Общество, нормы и культура – повторение",
        topic: "Итог по блоку «Общество»",
        aspects: "Обобщение тем о социальных нормах, семье, школе, культуре, экономике; работа с заданиями на классификацию и примеры из жизни"
      },
      {
        number: 34,
        title: "Итоговый урок: чему мы научились",
        topic: "Итоговый обобщающий урок",
        aspects: "Подведение итогов года; обсуждение, чему научился каждый; мини-проекты или презентации; рефлексия: какие знания пригодятся в жизни"
      }
    ]
  },
  {
    grade: 6,
    title: "Обществознание для 6 класса",
    description: "Курс обществознания для шестиклассников с углублением в социальные отношения, статусы и роли, конфликты, экономику, право и информационную безопасность. Развитие социальных компетенций и гражданской грамотности.",
    lessons: [
      {
        number: 1,
        title: "Вводный урок: что мы будем изучать",
        topic: "Обществознание в 6 классе",
        aspects: "Повтор ключевых понятий 5 класса; место человека в обществе; структура курса 6 класса; виды учебной деятельности, формы контроля"
      },
      {
        number: 2,
        title: "Человек в системе общественных отношений",
        topic: "Человек и общество",
        aspects: "Человек как часть общества; примеры общественных отношений (семья, школа, друзья, интернет); взаимное влияние человека и общества"
      },
      {
        number: 3,
        title: "Социальный статус и роль школьника",
        topic: "Социальный статус и социальная роль",
        aspects: "Понятие статуса и роли на простых примерах; статусы «ученик», «сын/дочь», «друг»; ожидания общества и личное поведение"
      },
      {
        number: 4,
        title: "Как формируется наш характер",
        topic: "Личность и социализация",
        aspects: "Понятие социализации; кто влияет на человека (семья, школа, СМИ, друзья); роль воспитания; развитие характера и привычек"
      },
      {
        number: 5,
        title: "Я и мои друзья",
        topic: "Межличностные отношения",
        aspects: "Дружба, приятельство, товарищество; качества хорошего друга; доверие и взаимопомощь; токсичное общение и его признаки"
      },
      {
        number: 6,
        title: "Конфликт: риск или шанс договориться",
        topic: "Конфликты и способы их решения",
        aspects: "Причины конфликтов; виды конфликтов (межличностный, внутриличностный); стратегии поведения (уклонение, сотрудничество, компромисс); роль медиатора"
      },
      {
        number: 7,
        title: "Малая группа и коллектив",
        topic: "Социальные группы",
        aspects: "Признаки группы; формальные и неформальные группы; класс как коллектив; лидер и его функции; ответственность каждого члена группы"
      },
      {
        number: 8,
        title: "Семья как основа жизни человека",
        topic: "Семья в жизни человека",
        aspects: "Функции семьи (воспитательная, хозяйственно-бытовая, эмоциональная и др. — на простом языке); типы семей; уважение к родителям и старшим"
      },
      {
        number: 9,
        title: "Права и обязанности в семье",
        topic: "Нормы в семейных отношениях",
        aspects: "Права ребёнка в семье (на заботу, образование, отдых); обязанности детей; уважительное общение; недопустимость насилия и жестокого обращения"
      },
      {
        number: 10,
        title: "Школа как социальный институт",
        topic: "Школа и образование",
        aspects: "Понятие социального института на примере школы; задачи школы; участники образовательного процесса; ответственность ученика за результаты обучения"
      },
      {
        number: 11,
        title: "Правила игры: школьный устав",
        topic: "Нормативные документы в школе",
        aspects: "Школьный устав, правила внутреннего распорядка; дисциплина и порядок; права и обязанности учащихся; ответственность за нарушение правил"
      },
      {
        number: 12,
        title: "Общество как система",
        topic: "Структура общества",
        aspects: "Общество как совокупность людей и связей; основные сферы общественной жизни (экономическая, социальная, политическая, духовная) на простых примерах"
      },
      {
        number: 13,
        title: "Социальные нормы и порядок в обществе",
        topic: "Социальные нормы",
        aspects: "Понятие нормы; виды норм (моральные, правовые, религиозные, корпоративные); примеры из жизни; последствия массового нарушения норм"
      },
      {
        number: 14,
        title: "Мораль и совесть",
        topic: "Нравственные нормы",
        aspects: "Понятия «мораль», «совесть», «честь», «достоинство»; моральный выбор; примеры из литературы, кино и жизни; почему важно «держать слово»"
      },
      {
        number: 15,
        title: "Традиции и обычаи народов России",
        topic: "Традиции и культура",
        aspects: "Роль традиций и обычаев; семейные и народные традиции; уважение к обычаям других народов; риски стереотипов и предвзятого отношения"
      },
      {
        number: 16,
        title: "Гражданин и государство (базовый уровень)",
        topic: "Государство и гражданство",
        aspects: "Понятие государства в упрощённом виде; гражданин и его базовые обязанности; государственные символы; уважение к закону и власти"
      },
      {
        number: 17,
        title: "Зачем обществу нужны законы",
        topic: "Право как регулятор",
        aspects: "Понятие «право» простым языком; отличие правовой нормы от других норм; примеры простейших законов, с которыми сталкивается подросток"
      },
      {
        number: 18,
        title: "Ответственность за свои поступки",
        topic: "Правонарушение и ответственность (на доступном уровне)",
        aspects: "Понятие правонарушения на бытовых примерах (порча имущества, мелкое хулиганство); дисциплинарная, школьная, семейная ответственность; личный выбор"
      },
      {
        number: 19,
        title: "Экономика вокруг нас",
        topic: "Экономика и её участники",
        aspects: "Экономика как хозяйство; участники: домохозяйства, фирмы, государство (на уровне 6 класса); товар, услуга, ресурс; зачем люди работают"
      },
      {
        number: 20,
        title: "Труд и заработная плата",
        topic: "Трудовая деятельность",
        aspects: "Труд как источник дохода и самореализации; квалифицированный и неквалифицированный труд; заработная плата, премия; отношение к работе"
      },
      {
        number: 21,
        title: "Деньги, банк, сбережения",
        topic: "Деньги и финансовая грамотность",
        aspects: "Функции денег (расчёт, сбережение, обмен) простым языком; наличные и безналичные деньги; зачем нужны сбережения; карманные расходы, «финансовые ловушки» для подростков"
      },
      {
        number: 22,
        title: "Семейный бюджет и планирование",
        topic: "Бюджет семьи",
        aspects: "Доходы и расходы семьи; обязательные и необязательные траты; финансовое планирование; «хочу» и «надо»; совместное обсуждение крупных покупок"
      },
      {
        number: 23,
        title: "Реклама и потребитель",
        topic: "Рынок и потребительское поведение",
        aspects: "Роль рекламы; манипуляции в рекламе; права потребителя (на качественный товар, информацию, безопасность — в базовом формате); как вести себя при покупке"
      },
      {
        number: 24,
        title: "Мир профессий будущего",
        topic: "Профессии и карьерные траектории",
        aspects: "Разнообразие профессий; новые профессии (IT, дизайн, сервис и др.); требования к образованию и навыкам; самооценка своих интересов и склонностей"
      },
      {
        number: 25,
        title: "Человек и СМИ",
        topic: "Средства массовой информации",
        aspects: "Виды СМИ (телевидение, радио, интернет, пресса); функции СМИ (информационная, развлекательная, образовательная); влияние информации на взгляды людей"
      },
      {
        number: 26,
        title: "Безопасность в сети Интернет",
        topic: "Информационная безопасность",
        aspects: "Личные данные и их защита; сетевой этикет; кибербуллинг и его профилактика; фейковые новости; какие ресурсы считать надёжными"
      },
      {
        number: 27,
        title: "Человек и природа: новая ответственность",
        topic: "Экология и общество",
        aspects: "Экологические проблемы современности на уровне ребёнка; загрязнение воздуха, воды, почвы; личная экологическая дисциплина; участие в акциях (субботник, сбор вторсырья)"
      },
      {
        number: 28,
        title: "Глобальный мир и мы",
        topic: "Глобализация (на доступном уровне)",
        aspects: "Объяснение идеи «мир стал ближе»: путешествия, интернет, международная торговля; плюсы и риски (культурная унификация, экологические проблемы)"
      },
      {
        number: 29,
        title: "Россия – многонациональная страна",
        topic: "Национальный состав и единство",
        aspects: "Народ и нация; многонациональность России; уважение к культуре разных народов; недопустимость национальной вражды; примеры сотрудничества"
      },
      {
        number: 30,
        title: "Волонтёрство и социальные проекты",
        topic: "Социальная активность",
        aspects: "Понятие добровольчества (волонтёрства); примеры школьных и местных социальных проектов; почему участие в них важно для общества и для самого подростка"
      },
      {
        number: 31,
        title: "Социальная справедливость и равенство возможностей",
        topic: "Социальное неравенство (в упрощённом виде)",
        aspects: "Неравенство по доходам, условиям жизни, образованию — на понятных примерах; идея равенства возможностей; роль государства и общества в поддержке слабых"
      },
      {
        number: 32,
        title: "Итог по блокам «Человек» и «Общество»",
        topic: "Обобщающее повторение",
        aspects: "Систематизация понятий: личность, статус, роль, социализация, нормы, мораль, право; работа с задачами и ситуациями; мини-тест"
      },
      {
        number: 33,
        title: "Итог по блокам «Экономика», «Государство», «Информация»",
        topic: "Обобщающее повторение",
        aspects: "Повтор: экономика, труд, деньги, бюджет, государство, закон, СМИ, интернет-безопасность; решение комбинированных заданий, кейсы из жизни"
      },
      {
        number: 34,
        title: "Рефлексия и подведение итогов года",
        topic: "Итоговый обобщающий урок",
        aspects: "Анализ, чему научился класс; какие темы показались самыми полезными; микро-проекты или мини-презентации; формирование ожиданий на 7 класс"
      }
    ]
  },
  {
    grade: 7,
    title: "Обществознание для 7 класса",
    description: "Курс обществознания для семиклассников с углублением в личность и самосознание, право, государство, экономику и информационное общество. Формирование правовой и экономической грамотности, гражданской позиции.",
    lessons: [
      {
        number: 1,
        title: "Вводный брифинг: цели курса 7 класса",
        topic: "Обществознание в 7 классе",
        aspects: "Повтор ключевых понятий 5–6 классов; логика курса 7 класса; блоки «Человек», «Общество», «Право», «Экономика»; форматы контроля и требований к результатам"
      },
      {
        number: 2,
        title: "Кто я? Самоопределение подростка",
        topic: "Личность и самосознание",
        aspects: "Личность, индивидуальность, характер; самооценка и её влияние на поведение; особенности подросткового возраста; базовые жизненные цели и планы"
      },
      {
        number: 3,
        title: "Социализация: как общество «настраивает» человека",
        topic: "Социализация и её агенты",
        aspects: "Понятие социализации; основные агенты (семья, школа, сверстники, СМИ, интернет); позитивное и негативное влияние; роль самовоспитания"
      },
      {
        number: 4,
        title: "Ценности, убеждения, мировоззрение",
        topic: "Ценностные ориентиры личности",
        aspects: "Понятия «ценность», «идеал», «мировоззрение»; личные и общественные ценности; конфликт ценностей; ответственность за свой выбор"
      },
      {
        number: 5,
        title: "Добро, зло и моральный выбор",
        topic: "Нравственные нормы",
        aspects: "Добро и зло; моральные нормы; совесть и чувство вины; ситуации морального выбора; примеры из жизни и литературы"
      },
      {
        number: 6,
        title: "Свобода и ответственность",
        topic: "Свобода личности",
        aspects: "Свобода как возможность выбора и как ответственность; границы свободы; «хочу», «могу», «надо»; последствия безответственного поведения"
      },
      {
        number: 7,
        title: "Коммуникация без сбоев",
        topic: "Общение и его барьеры",
        aspects: "Виды общения; барьеры в общении (недопонимание, стереотипы, эмоции); правила конструктивного диалога; активное слушание"
      },
      {
        number: 8,
        title: "Манипуляции и давление",
        topic: "Манипуляции в общении",
        aspects: "Различие между убеждением и манипуляцией; типичные приёмы давления (шантаж, игра на чувствах, «все так делают»); личные границы"
      },
      {
        number: 9,
        title: "Конфликты в подростковой среде",
        topic: "Конфликт и его стадии",
        aspects: "Причины конфликтов; стадии конфликта; стратегии поведения (соперничество, компромисс, сотрудничество); роль посредника; конфликт в классе и семье"
      },
      {
        number: 10,
        title: "Буллинг и кибербуллинг",
        topic: "Девиантное поведение (на базовом уровне)",
        aspects: "Буллинг, кибербуллинг, травля; роли в ситуации (агрессор, жертва, наблюдатель); алгоритм действий при травле; ресурсы помощи"
      },
      {
        number: 11,
        title: "Социальные группы и структура общества",
        topic: "Социальная структура",
        aspects: "Понятие социальной группы; большие и малые группы; общество как система статусов и ролей; примеры социальной структуры на уровне школы и города"
      },
      {
        number: 12,
        title: "Социальное неравенство и мобильность",
        topic: "Социальная стратификация",
        aspects: "Неравенство по доходам, образованию, престижу; понятие «социальный лифт»; образование как ресурс продвижения; риски закрепления неравенства"
      },
      {
        number: 13,
        title: "Семья как социальный институт",
        topic: "Семья и брак",
        aspects: "Семья как институт; функции семьи; брак на простом уровне (добровольность, взаимная ответственность); ценность семейных отношений"
      },
      {
        number: 14,
        title: "Семейное право для подростков",
        topic: "Права ребёнка в семье",
        aspects: "Основные права ребёнка в семье (на заботу, образование, защиту); обязанности подростка; недопустимость насилия; куда обращаться при нарушении прав"
      },
      {
        number: 15,
        title: "Подросток и закон",
        topic: "Правовой статус несовершеннолетнего",
        aspects: "Понятие «несовершеннолетний»; базовые права подростка (образование, медицинская помощь, участие в жизни школы и др.); ограниченная дееспособность"
      },
      {
        number: 16,
        title: "Правонарушения среди подростков",
        topic: "Правонарушение и ответственность",
        aspects: "Примеры правонарушений, характерных для подростков (мелкое хулиганство, порча имущества, кража); различие «проступок» – «преступление» (на базовом уровне); профилактика"
      },
      {
        number: 17,
        title: "Юридическая ответственность",
        topic: "Виды юридической ответственности (базовый уровень)",
        aspects: "Понятия «ответственность», «наказание»; ознакомление с видами ответственности (уголовная, административная, дисциплинарная, гражданско-правовая) — на примерах, понятных 7-класснику"
      },
      {
        number: 18,
        title: "Государство и его признаки",
        topic: "Государство как политическая организация",
        aspects: "Понятие государства; территория, население, власть, суверенитет как признаки; функции государства (на защите интересов общества)"
      },
      {
        number: 19,
        title: "Формы правления и устройства",
        topic: "Модели организации власти",
        aspects: "Монархия и республика, унитарное и федеративное государство — на схемах; примеры стран; место России (федеративная республика)"
      },
      {
        number: 20,
        title: "Российская Федерация: базовый контур",
        topic: "Российское государство",
        aspects: "Характеристики РФ (демократическое, правовое, федеративное, светское); государственные символы; роль Конституции (очень кратко)"
      },
      {
        number: 21,
        title: "Органы власти в России",
        topic: "Система государственной власти",
        aspects: "Основные звенья: Президент, Федеральное Собрание, Правительство, суды — на обобщённом уровне; разделение властей; зачем нужен такой «контур управления»"
      },
      {
        number: 22,
        title: "Местное самоуправление",
        topic: "Управление на уровне города/посёлка",
        aspects: "Понятие местного самоуправления; органы на местном уровне; вопросы местного значения (дороги, благоустройство, школы, парки); участие граждан и школьных инициатив"
      },
      {
        number: 23,
        title: "Гражданское общество и СМИ",
        topic: "Гражданская активность",
        aspects: "Понятие гражданского общества (кружки, объединения, НКО); роль СМИ и социальных сетей в общественной жизни; пример школьного/городского проекта"
      },
      {
        number: 24,
        title: "Экономика: от потребностей к производству",
        topic: "Основы экономики",
        aspects: "Потребности и ограниченность ресурсов; что, как и для кого производить; факторы производства (земля, труд, капитал, предпринимательские способности — на упрощённых примерах)"
      },
      {
        number: 25,
        title: "Рынок, цена, конкуренция",
        topic: "Рыночные отношения",
        aspects: "Понятие рынка; продавцы и покупатели; спрос и предложение простым языком; цена как результат их взаимодействия; конкуренция и её значение"
      },
      {
        number: 26,
        title: "Бизнес и предприниматель",
        topic: "Предпринимательская деятельность",
        aspects: "Кто такой предприниматель; риск и ответственность; малый бизнес в городе/селе; примеры школьного мини-проекта как модели бизнеса"
      },
      {
        number: 27,
        title: "Личные финансы и банки",
        topic: "Финансовая грамотность",
        aspects: "Доходы подростка; сбережения, накопления, «подушка безопасности»; роль банков (счёт, вклад, карта) — без деталей; базовые правила финансовой безопасности"
      },
      {
        number: 28,
        title: "Права потребителя",
        topic: "Защита прав потребителей",
        aspects: "Кто такой потребитель; права потребителя (на качество, безопасность, информацию); чек и гарантия; простейший алгоритм действий при покупке некачественного товара"
      },
      {
        number: 29,
        title: "Информационное общество",
        topic: "Общество и информация",
        aspects: "Рост объёма информации; ИКТ; плюсы и минусы информационного общества; влияние на труд, образование, досуг"
      },
      {
        number: 30,
        title: "Цифровой след и безопасность",
        topic: "Безопасность в цифровой среде",
        aspects: "Цифровой след, персональные данные; риски (мошенничество, кибератаки, фейковые новости); базовые правила цифровой гигиены"
      },
      {
        number: 31,
        title: "Глобальные проблемы человечества",
        topic: "Глобальные вызовы",
        aspects: "Экологические, демографические, социальные, экономические глобальные проблемы — на примерах; взаимосвязь стран; личный вклад человека и локальных сообществ"
      },
      {
        number: 32,
        title: "Россия в современном мире",
        topic: "Международное сотрудничество",
        aspects: "Россия как участник международных отношений; примеры сотрудничества (спорт, культура, наука, экопроекты); значение мирного диалога между странами"
      },
      {
        number: 33,
        title: "Итоговая ревизия: человек, общество, право",
        topic: "Обобщающее повторение",
        aspects: "Систематизация понятий курса: личность, социализация, нормы, государство, право, экономика, информационное общество; работа с комплексными задачами и жизненными ситуациями"
      },
      {
        number: 34,
        title: "Рефлексия и планирование: шаг в 8 класс",
        topic: "Итоговый урок",
        aspects: "Подведение итогов года; самооценка освоенных тем; обсуждение, какие знания пригодятся в реальной жизни; ожидания и запросы на курс 8 класса"
      }
    ]
  },
  {
    grade: 8,
    title: "Обществознание для 8 класса",
    description: "Курс обществознания для восьмиклассников с углублением в личность и мировоззрение, социальную структуру, государство и право, экономику. Формирование системного понимания общества, правовой и экономической культуры.",
    lessons: [
      {
        number: 1,
        title: "Вводный урок: контур курса 8 класса",
        topic: "Обществознание в 8 классе",
        aspects: "Место курса в системе предметов; опора на материал 5–7 классов; блоки курса (человек, общество, государство и право, экономика); виды учебной деятельности и контроль"
      },
      {
        number: 2,
        title: "Личность в современном обществе",
        topic: "Личность и индивидуальность",
        aspects: "Структура личности (интересы, способности, характер); влияние общества на формирование личности; саморегуляция и самоуважение; роль целей и планов"
      },
      {
        number: 3,
        title: "Самоопределение подростка",
        topic: "Личностное и профессиональное самоопределение",
        aspects: "Выбор жизненных ориентиров; учебная и внеучебная занятость как ресурс самоопределения; первые представления о профессиональных планах"
      },
      {
        number: 4,
        title: "Мировоззрение и ценности",
        topic: "Мировоззрение человека",
        aspects: "Понятие мировоззрения; элементы мировоззрения (знания, убеждения, ценности, идеалы); влияние семьи, школы, культуры и СМИ; устойчивость и изменчивость убеждений"
      },
      {
        number: 5,
        title: "Духовная культура общества",
        topic: "Духовная сфера общественной жизни",
        aspects: "Понятие духовной культуры; наука, образование, религия, искусство как элементы духовной жизни; роль культуры в развитии личности и общества"
      },
      {
        number: 6,
        title: "Религия и светский характер государства",
        topic: "Религия в обществе",
        aspects: "Роль религии в истории и культуре; религиозные традиции народов России; принцип светского государства; уважительное отношение к верующим и неверующим"
      },
      {
        number: 7,
        title: "Общество как сложная система",
        topic: "Структура и динамика общества",
        aspects: "Общество как система; подсистемы (сферы жизни); устойчивость и изменения в обществе; социальные реформы и преобразования на примерах"
      },
      {
        number: 8,
        title: "Социальная структура и страты",
        topic: "Социальная стратификация",
        aspects: "Понятия «социальная группа», «страта», «социальное положение»; критерии различий (доход, образование, престиж); примеры социального неравенства"
      },
      {
        number: 9,
        title: "Социальная мобильность и «лифты»",
        topic: "Социальная мобильность",
        aspects: "Восходящая и нисходящая мобильность; образование, профессия, бизнес как социальные «лифты»; роль личной активности"
      },
      {
        number: 10,
        title: "Семья в меняющемся мире",
        topic: "Семья как социальный институт",
        aspects: "Функции семьи; изменения в семейной жизни в современном обществе; распределение ролей и обязанностей; значимость семейной поддержки"
      },
      {
        number: 11,
        title: "Население и демографические процессы",
        topic: "Демография",
        aspects: "Численность населения, рождаемость, смертность, миграция; демографические проблемы; влияние демографии на развитие страны"
      },
      {
        number: 12,
        title: "Государство в жизни общества",
        topic: "Понятие и признаки государства",
        aspects: "Государство как особая организация власти; признаки государства (территория, население, суверенитет, аппарат управления и принуждения); функции государства"
      },
      {
        number: 13,
        title: "Политическая система общества",
        topic: "Политическая система",
        aspects: "Основные элементы: государство, партии, общественные организации, СМИ; функции политической системы; участие граждан в политической жизни"
      },
      {
        number: 14,
        title: "Демократия и её основные признаки",
        topic: "Демократический режим",
        aspects: "Народовластие, выборность органов власти, разделение властей, права и свободы граждан, политический плюрализм; достоинства и проблемы демократии"
      },
      {
        number: 15,
        title: "Конституция Российской Федерации",
        topic: "Конституционный строй",
        aspects: "Роль Конституции; основные положения (Россия — демократическое, правовое, федеративное государство); верховенство Конституции; структура основного закона (очень кратко)"
      },
      {
        number: 16,
        title: "Права и свободы человека и гражданина",
        topic: "Права человека",
        aspects: "Личные (гражданские), политические, социально-экономические права на примерах; обязанности гражданина; взаимосвязь прав и обязанностей"
      },
      {
        number: 17,
        title: "Правовое государство и гражданское общество",
        topic: "Правовое государство",
        aspects: "Признаки правового государства (верховенство закона, разделение властей, защита прав и свобод); гражданское общество и его роль; формы гражданской активности"
      },
      {
        number: 18,
        title: "Органы государственной власти РФ",
        topic: "Система органов власти",
        aspects: "Президент, Федеральное Собрание, Правительство, судебная система; в общих чертах — функции и взаимодействие; значение принципа разделения властей"
      },
      {
        number: 19,
        title: "Выборы и политическое участие",
        topic: "Избирательная система",
        aspects: "Основы выборов (всеобщее, равное, прямое избирательное право, тайное голосование); роли избирателя и кандидата; значение выборов для демократии"
      },
      {
        number: 20,
        title: "Экономика как хозяйство страны",
        topic: "Экономика и её уровни",
        aspects: "Экономика семьи, предприятия, государства; основные вопросы экономики («что, как и для кого производить»); взаимосвязь участников хозяйственной жизни"
      },
      {
        number: 21,
        title: "Производство, ресурсы и результат",
        topic: "Производство и факторы",
        aspects: "Факторы производства (земля, труд, капитал, предпринимательство, информация); производительность труда; издержки и прибыль на базовом уровне"
      },
      {
        number: 22,
        title: "Рынок и конкуренция",
        topic: "Рыночная экономика",
        aspects: "Понятие рынка; спрос и предложение (качественно); цена на рынке; конкуренция и её роль для качества товаров и услуг; плюсы и минусы рынка"
      },
      {
        number: 23,
        title: "Роль государства в экономике",
        topic: "Государственное регулирование",
        aspects: "Причины вмешательства государства в экономику; налоги, дотации, госпрограммы; защита конкуренции и потребителей; социальная политика"
      },
      {
        number: 24,
        title: "Деньги, банки и инфляция",
        topic: "Денежно-кредитная сфера",
        aspects: "Функции денег; банк как финансовый посредник; вклад, кредит (базово); понятие инфляции; влияние инфляции на жизнь граждан"
      },
      {
        number: 25,
        title: "Личные финансы и финансовая безопасность",
        topic: "Финансовая грамотность",
        aspects: "Планирование личного и семейного бюджета; доходы и расходы; сбережения и инвестиции на самом общем уровне; финансовые риски и мошенничество"
      },
      {
        number: 26,
        title: "Предпринимательство и бизнес-проект",
        topic: "Предпринимательская деятельность",
        aspects: "Признаки предпринимательства (самостоятельность, риск, ответственность, цель — прибыль); формы предпринимательства; пример школьного/учебного бизнес-проекта"
      },
      {
        number: 27,
        title: "Право как регулятор общественных отношений",
        topic: "Понятие и отрасли права",
        aspects: "Понятие права; правовые нормы и их признаки; основные отрасли права (конституционное, гражданское, административное, уголовное, семейное, трудовое) на уровне общей характеристики"
      },
      {
        number: 28,
        title: "Гражданское право: собственность и сделки",
        topic: "Гражданско-правовые отношения",
        aspects: "Понятие гражданских отношений; частная, государственная, муниципальная собственность; основные виды сделок (купля-продажа, дарение) на жизненных примерах"
      },
      {
        number: 29,
        title: "Трудовое право для подростков",
        topic: "Труд и трудовой договор",
        aspects: "Общие представления о трудовом договоре; права и обязанности работника и работодателя; особенности труда несовершеннолетних; охрана труда"
      },
      {
        number: 30,
        title: "Правонарушения и юридическая ответственность",
        topic: "Юридическая ответственность",
        aspects: "Понятие правонарушения; состав правонарушения (на простом уровне); виды юридической ответственности; примеры правонарушений, актуальных для подростков"
      },
      {
        number: 31,
        title: "Суд и правоохранительные органы",
        topic: "Защита прав граждан",
        aspects: "Роль суда; полиция, прокуратура, адвокатура как органы защиты прав и законных интересов; обращение гражданина за защитой прав (жалоба, заявление)"
      },
      {
        number: 32,
        title: "Человек, общество, государство, экономика — повторение",
        topic: "Обобщающий урок",
        aspects: "Систематизация понятий курса (личность, ценности, общество, социальная структура, государство, демократия, права человека, экономика, рынок, право); работа с типовыми и ситуационными заданиями"
      },
      {
        number: 33,
        title: "Право и экономика в повседневной жизни",
        topic: "Итоговое повторение",
        aspects: "Решение комплексных задач с правовыми и экономическими элементами; разбор жизненных ситуаций; обсуждение моделей ответственного гражданского и экономического поведения"
      },
      {
        number: 34,
        title: "Итоговая рефлексия и выход в 9 класс",
        topic: "Итоговый обобщающий урок",
        aspects: "Анализ достигнутых результатов; какие темы показались наиболее значимыми; обсуждение ожиданий от курса 9 класса; фиксация ключевых компетенций (умение анализировать ситуацию, аргументировать позицию, опираться на нормы)"
      }
    ]
  },
  {
    grade: 9,
    title: "Обществознание для 9 класса",
    description: "Курс обществознания для девятиклассников с систематизацией знаний по человеку и обществу, экономике, политике и праву. Подготовка к итоговой аттестации, формирование гражданской и правовой культуры, экономической грамотности.",
    lessons: [
      {
        number: 1,
        title: "Вводный урок: перезагрузка курса",
        topic: "Обществознание в 9 классе",
        aspects: "Роль предмета в итоговой аттестации и в жизни; связь с 5–8 классами; ключевые блоки (человек, общество, экономика, политика, право); форматы контроля и требования"
      },
      {
        number: 2,
        title: "Человек в системе общественных отношений",
        topic: "Человек и общество",
        aspects: "Человек как биосоциальное существо; потребности и интересы; социальные качества личности; взаимосвязь личности и общества"
      },
      {
        number: 3,
        title: "Личность, статус и роль",
        topic: "Личность и социальная структура",
        aspects: "Социальный статус, социальная роль, ролевой конфликт; примеры статусов подростка; влияние статуса на поведение и ожидания общества"
      },
      {
        number: 4,
        title: "Социализация и её механизмы",
        topic: "Социализация личности",
        aspects: "Стадии социализации; агенты социализации (семья, школа, СМИ, интернет, трудовой коллектив); ресоциализация; влияние среды на формирование ценностей"
      },
      {
        number: 5,
        title: "Мировоззрение и духовная культура",
        topic: "Духовная сфера общества",
        aspects: "Содержание мировоззрения; формы общественного сознания (мораль, религия, искусство, наука, право); духовные ценности и их роль в жизни человека"
      },
      {
        number: 6,
        title: "Общество как динамичная система",
        topic: "Общество и его структура",
        aspects: "Общество как система; социальные институты (семья, государство, образование, религия, экономика); стабильность и изменения; реформы и революции (на базовом уровне)"
      },
      {
        number: 7,
        title: "Социальная стратификация и мобильность",
        topic: "Социальная структура общества",
        aspects: "Критерии социальной стратификации (доход, власть, образование, престиж); открытые и закрытые общества; виды социальной мобильности; социальные лифты"
      },
      {
        number: 8,
        title: "Семья и демография",
        topic: "Семья и демографические процессы",
        aspects: "Функции семьи; изменения семейных моделей; демографическая ситуация (рождаемость, смертность, миграция, старение населения) на уровне базовых показателей; влияние демографии на развитие страны"
      },
      {
        number: 9,
        title: "Экономика: ключевые понятия",
        topic: "Основы экономики",
        aspects: "Экономика как система хозяйствования; уровни экономики (микро-, макро-); экономические ресурсы; альтернативная стоимость; рациональное экономическое поведение"
      },
      {
        number: 10,
        title: "Производство, бизнес и рынок",
        topic: "Производство и предпринимательство",
        aspects: "Факторы производства и факторные доходы; формы предпринимательства; цель и риск бизнеса; понятие издержек и прибыли; социальная ответственность бизнеса"
      },
      {
        number: 11,
        title: "Рынок, спрос, предложение, цена",
        topic: "Рыночные механизмы",
        aspects: "Структура рынка; факторы спроса и предложения; рыночное равновесие качественно; виды конкуренции (совершенная и несовершенная); монополия и её последствия"
      },
      {
        number: 12,
        title: "Роль государства в экономике",
        topic: "Государственная экономическая политика",
        aspects: "Причины вмешательства государства (провалы рынка, социальная защита, инфраструктура); методы (налоги, бюджет, субсидии, регулирование); понятия ВВП, экономический рост на базовом уровне"
      },
      {
        number: 13,
        title: "Личный и семейный бюджет",
        topic: "Личные финансы",
        aspects: "Виды доходов и расходов граждан; структура семейного бюджета; сбережения и инвестиции на общем уровне; финансовое планирование; инфляция и её влияние на бюджет"
      },
      {
        number: 14,
        title: "Банки, кредиты, финансовые риски",
        topic: "Финансовая система",
        aspects: "Функции коммерческого банка; вклад, кредит, банковская карта; проценты по вкладу и кредиту; финансовые риски (мошенничество, переплаты, долговая нагрузка)"
      },
      {
        number: 15,
        title: "Рынок труда и профессии",
        topic: "Трудовые отношения",
        aspects: "Рынок труда; заработная плата и факторы, на неё влияющие; безработица (виды на базовом уровне); профессиональное самоопределение; значение квалификации и компетенций"
      },
      {
        number: 16,
        title: "Политика и власть",
        topic: "Политическая сфера общества",
        aspects: "Понятия «политика», «власть», «политическая система»; ресурсы власти; функции политики; субъекты политической жизни (государство, партии, граждане)"
      },
      {
        number: 17,
        title: "Государство: сущность и функции",
        topic: "Государство в политической системе",
        aspects: "Признаки государства; внутренние и внешние функции; формы правления, устройства и политические режимы (демократия, авторитаризм, тоталитаризм) — на уровне схем и признаков"
      },
      {
        number: 18,
        title: "Политическая система РФ",
        topic: "Политический строй России",
        aspects: "Конституционные характеристики РФ; структура органов государственной власти; политические партии и общественные объединения; роль СМИ"
      },
      {
        number: 19,
        title: "Демократия и гражданское участие",
        topic: "Демократический процесс",
        aspects: "Признаки демократии; формы участия граждан в политике (выборы, референдум, обращения, митинги — на базовом уровне); политическая культура и правовая активность гражданина"
      },
      {
        number: 20,
        title: "Избирательная система и выборы",
        topic: "Избирательное право",
        aspects: "Принципы демократического избирательного права; избирательный процесс (основные стадии); органы, избираемые гражданами; значение участия в выборах"
      },
      {
        number: 21,
        title: "Право и его роль в обществе",
        topic: "Право как система норм",
        aspects: "Понятие права; признаки правовой нормы; источники права; система права (отрасли); отличие права от морали и иных социальных норм"
      },
      {
        number: 22,
        title: "Конституционное право и права человека",
        topic: "Конституционный строй и права граждан",
        aspects: "Основы конституционного строя РФ; личные, политические, социально-экономические права и свободы; обязанности граждан; механизмы защиты прав (обращение в органы власти, суд)"
      },
      {
        number: 23,
        title: "Гражданское право: собственность, договоры",
        topic: "Гражданско-правовые отношения",
        aspects: "Объекты и субъекты гражданского права; формы собственности; виды гражданско-правовых договоров (купля-продажа, аренда, дарение) на практических примерах; защита прав собственника"
      },
      {
        number: 24,
        title: "Семейное и трудовое право",
        topic: "Основы семейного и трудового законодательства",
        aspects: "Права и обязанности супругов, родителей и детей; заключение и расторжение брака (общий контур); трудовой договор, рабочее время и отдых; особенности труда несовершеннолетних; охрана труда"
      },
      {
        number: 25,
        title: "Административная и уголовная ответственность",
        topic: "Правонарушения и наказания",
        aspects: "Понятие правонарушения и его состав; различия между административным и уголовным правонарушением; типичные примеры; цели юридической ответственности; особенности ответственности несовершеннолетних"
      },
      {
        number: 26,
        title: "Суд и правоохранительная система",
        topic: "Защита прав и свобод",
        aspects: "Виды судов в РФ в общем виде; участники судебного процесса (судья, прокурор, адвокат, истец, ответчик, подсудимый); органы внутренних дел, прокуратура, адвокатура; алгоритм обращения за защитой прав"
      },
      {
        number: 27,
        title: "Россия в системе международных отношений",
        topic: "Международное сотрудничество",
        aspects: "Международные организации (на уровне примеров: ООН и др.); участие России в международных структурах; принципы международного права; значение сотрудничества государств"
      },
      {
        number: 28,
        title: "Глобальные проблемы и устойчивое развитие",
        topic: "Глобальные вызовы человечества",
        aspects: "Экологические, демографические, экономические и политические глобальные проблемы; взаимозависимость стран; концепция устойчивого развития; личный и национальный вклад в их решение"
      },
      {
        number: 29,
        title: "Информационное общество и цифровая среда",
        topic: "Информационные процессы в обществе",
        aspects: "Признаки информационного общества; роль информации и ИКТ; плюсы и минусы цифровизации; трансформация труда, образования, досуга"
      },
      {
        number: 30,
        title: "Право и безопасность в интернете",
        topic: "Цифровая безопасность и право",
        aspects: "Правовое регулирование в сети (персональные данные, авторское право на базовом уровне); киберпреступность; защита от мошенничества; ответственное поведение в цифровой среде"
      },
      {
        number: 31,
        title: "Комплексный разбор типовых задач",
        topic: "Подготовка к итоговой аттестации (1)",
        aspects: "Решение типовых заданий по блокам «Человек и общество», «Экономика»; разбор аргументации, умения работать с текстом, примерами, схемами"
      },
      {
        number: 32,
        title: "Право и политика в задачах",
        topic: "Подготовка к итоговой аттестации (2)",
        aspects: "Решение задач по блокам «Политика» и «Право»; анализ правовых ситуаций; формулировка правовой позиции; работа с выдержками из нормативных актов"
      },
      {
        number: 33,
        title: "Итоговое обобщение курса",
        topic: "Итоговое повторение",
        aspects: "Систематизация ключевых понятий всего курса; работа с комплексными заданиями на синтез разных блоков; тренировка аргументированного высказывания по общественной проблеме"
      },
      {
        number: 34,
        title: "Финальный урок: выводы и перспективы",
        topic: "Итоговый обобщающий урок",
        aspects: "Рефлексия по курсу; обсуждение, какие знания и навыки будут использоваться в дальнейшей учёбе и жизни; фиксация индивидуальных образовательных результатов"
      }
    ]
  },
  {
    grade: 10,
    title: "Обществознание для 10 класса",
    description: "Курс обществознания для десятиклассников с углублением в теоретические основы обществознания, системный анализ общества, экономики, политики и права. Подготовка к ЕГЭ, формирование научного мышления и гражданской культуры.",
    lessons: [
      {
        number: 1,
        title: "Вводный урок: периметр курса и требования",
        topic: "Обществознание в 10 классе",
        aspects: "Цели курса в старшей школе; связь с ОГЭ/ЕГЭ; структура содержания (человек, общество, экономика, политика, право); форматы контроля, требования к конспекту и работе с источниками"
      },
      {
        number: 2,
        title: "Обществознание как комплекс наук",
        topic: "Обществознание и общественные науки",
        aspects: "Место обществознания в системе наук; социология, политология, экономика, юриспруденция, философия; методы общественных наук; роль теории и эмпирики"
      },
      {
        number: 3,
        title: "Человек как личность и индивид",
        topic: "Человек в системе общественных связей",
        aspects: "Биологическое и социальное в человеке; структура личности (направленность, способности, характер); социализация; индивидуальность"
      },
      {
        number: 4,
        title: "Потребности, интересы, ценности",
        topic: "Мотивационная сфера личности",
        aspects: "Классификация потребностей; интересы и склонности; ценности и ценностные конфликты; иерархия ценностей подростка; влияние ценностей на поведение"
      },
      {
        number: 5,
        title: "Деятельность и общение",
        topic: "Деятельность как способ существования человека",
        aspects: "Структура деятельности (мотив, цель, средства, результат); виды деятельности (труд, игра, учёба, творчество); общение и его функции; барьеры общения"
      },
      {
        number: 6,
        title: "Познание и истина",
        topic: "Познавательная деятельность человека",
        aspects: "Уровни познания (чувственное, рациональное); формы мышления (понятие, суждение, умозаключение); проблема истины; критерии истины; заблуждения и ложь"
      },
      {
        number: 7,
        title: "Общество как система",
        topic: "Общество и его подсистемы",
        aspects: "Признаки общества; общество как динамическая система; сферы общественной жизни (экономическая, социальная, политическая, духовная); взаимосвязь сфер"
      },
      {
        number: 8,
        title: "Типы обществ",
        topic: "Исторические типы общества",
        aspects: "Традиционное, индустриальное, постиндустриальное общество; ключевые характеристики каждого типа; трансформация труда, быта, культуры"
      },
      {
        number: 9,
        title: "Культура и субкультуры",
        topic: "Культура в жизни общества",
        aspects: "Понятие культуры; материальная и духовная культура; массовая, элитарная, народная культура; субкультуры и контркультуры; риски культурной маргинализации"
      },
      {
        number: 10,
        title: "Наука и образование",
        topic: "Научное знание и система образования",
        aspects: "Особенности научного знания; функции науки; система образования, непрерывное образование; роль науки и образования в развитии личности и общества"
      },
      {
        number: 11,
        title: "Мораль и нравственное сознание",
        topic: "Нравственные нормы и регуляция поведения",
        aspects: "Понятия «мораль», «нравственность», «совесть», «честь», «достоинство»; моральный выбор и ответственность; моральные дилеммы"
      },
      {
        number: 12,
        title: "Свобода и ответственность",
        topic: "Свобода личности в обществе",
        aspects: "Свобода как осознанный выбор; ответственность как оборотная сторона свободы; необходимость, случайность, выбор; правовые и моральные рамки свободы"
      },
      {
        number: 13,
        title: "Социальные нормы и социальный контроль",
        topic: "Механизмы упорядочения общественной жизни",
        aspects: "Виды социальных норм (моральные, правовые, религиозные, корпоративные, традиции, обычаи); социальные санкции; формальный и неформальный социальный контроль"
      },
      {
        number: 14,
        title: "Социальная стратификация",
        topic: "Социальная структура общества",
        aspects: "Стратификация и её критерии (доход, власть, образование, престиж); классы и страты; открытое и закрытое общество; социальная справедливость"
      },
      {
        number: 15,
        title: "Социальная мобильность и лифты",
        topic: "Социальная динамика",
        aspects: "Восходящая и нисходящая мобильность; индивидуальная и групповая мобильность; социальные лифты (образование, карьера, бизнес, армия и др.); факторы мобильности"
      },
      {
        number: 16,
        title: "Этнические общности и нация",
        topic: "Межнациональные отношения",
        aspects: "Род, племя, народность, нация; многонациональный характер России; формы межнациональных отношений; национальная политика государства; толерантность"
      },
      {
        number: 17,
        title: "Глобализация и глобальные проблемы",
        topic: "Современный мир и его вызовы",
        aspects: "Сущность глобализации; плюсы и минусы взаимозависимости стран; экологические, демографические, экономические, политические глобальные проблемы; концепция устойчивого развития"
      },
      {
        number: 18,
        title: "Вход в экономику: базовая рамка",
        topic: "Экономика как система хозяйствования",
        aspects: "Экономика на микро- и макроуровне; экономические ресурсы и ограниченность; основные вопросы экономики («что, как и для кого производить»); рациональное поведение"
      },
      {
        number: 19,
        title: "Экономические системы",
        topic: "Модели организации хозяйства",
        aspects: "Традиционная, командно-административная, рыночная, смешанная системы; плюсы и минусы каждой; позиционирование современной экономики России"
      },
      {
        number: 20,
        title: "Рынок и конкуренция",
        topic: "Рыночный механизм",
        aspects: "Понятие рынка; виды рынков; конкуренция и её функции; монополия, олигополия, монополистическая конкуренция (на базовом уровне); защита конкуренции"
      },
      {
        number: 21,
        title: "Спрос и предложение",
        topic: "Ценообразование в рыночной экономике",
        aspects: "Понятия спроса и предложения; факторы спроса и предложения; рыночное равновесие качественно; изменение цены при сдвиге спроса/предложения (на графиках)"
      },
      {
        number: 22,
        title: "Предприятие и издержки",
        topic: "Фирма в рыночной экономике",
        aspects: "Цели предприятия; виды издержек (постоянные, переменные); выручка, прибыль; точки безубыточности простым языком; стратегия фирмы в условиях конкуренции"
      },
      {
        number: 23,
        title: "Деньги, банки, финансовый рынок",
        topic: "Финансовая инфраструктура",
        aspects: "Функции денег; коммерческие банки и Центральный банк (на базовом уровне); вклады, кредиты, банковские карты; финансовый рынок; базовые риски"
      },
      {
        number: 24,
        title: "Инфляция и безработица",
        topic: "Макроэкономические дисбалансы",
        aspects: "Понятие инфляции, её виды и последствия; безработица, её виды и социальные последствия; антикризисная политика государства на высоком уровне"
      },
      {
        number: 25,
        title: "Личные финансы и финансовая безопасность",
        topic: "Финансовая грамотность гражданина",
        aspects: "Личный и семейный бюджет; сбережения и инвестиции на общем уровне; кредитная нагрузка; финансовые пирамиды и мошенничество; базовые правила финансовой безопасности"
      },
      {
        number: 26,
        title: "Социальная политика и уровень жизни",
        topic: "Социальная функция государства",
        aspects: "Уровень и качество жизни; прожиточный минимум, минимальная заработная плата, социальные стандарты; формы социальной поддержки; социальное государство"
      },
      {
        number: 27,
        title: "Политика и власть",
        topic: "Политическая сфера общества",
        aspects: "Понятия «политика», «политическая власть», «политическая система»; ресурсы власти; функции политики; субъекты политического процесса"
      },
      {
        number: 28,
        title: "Государство и политические режимы",
        topic: "Форма государства",
        aspects: "Признаки государства; формы правления, государственного устройства, политические режимы; признаки демократического, авторитарного, тоталитарного режима"
      },
      {
        number: 29,
        title: "Демократия и гражданское общество",
        topic: "Демократический политический порядок",
        aspects: "Признаки демократии; правовое и социальное государство; гражданское общество и его элементы (СМИ, НКО, инициативные группы); участие граждан"
      },
      {
        number: 30,
        title: "Политическое участие и выборы",
        topic: "Избирательная система и политическая культура",
        aspects: "Формы политического участия (голосование, обращения, участие в партиях и движениях); избирательные права граждан; типы избирательных систем (на базовом уровне); политическая культура личности"
      },
      {
        number: 31,
        title: "Право как регулятор общественных отношений",
        topic: "Основы правопонимания",
        aspects: "Понятие права; признаки правовой нормы; система и отрасли права; закон и подзаконный акт; отличие права от других социальных норм"
      },
      {
        number: 32,
        title: "Права и свободы человека и гражданина",
        topic: "Правовой статус личности",
        aspects: "Личные, политические, социально-экономические права; конституционные обязанности; механизмы защиты прав (обращение в органы власти, суд, Уполномоченному и др.)"
      },
      {
        number: 33,
        title: "Комплексное повторение курса 10 класса",
        topic: "Обобщение и тренировка задач",
        aspects: "Систематизация основных понятий по блокам «Человек и общество», «Социальные отношения», «Экономика», «Политика», «Право»; отработка типовых и ситуационных заданий"
      },
      {
        number: 34,
        title: "Итоговый урок: фиксация результатов и мост в 11 класс",
        topic: "Итоговый обобщающий урок",
        aspects: "Рефлексия по освоенным темам; выделение ключевых компетенций (анализ текста, аргументация, применение понятий к ситуации); ожидания к курсу 11 класса и к подготовке к ЕГЭ"
      }
    ]
  },
  {
    grade: 11,
    title: "Обществознание для 11 класса",
    description: "Курс обществознания для одиннадцатиклассников с углублением в актуальные проблемы современного общества, экономики, политики и права. Интенсивная подготовка к ЕГЭ, формирование гражданской позиции и правовой культуры выпускника.",
    lessons: [
      {
        number: 1,
        title: "Вводный брифинг: финальный год",
        topic: "Обществознание в 11 классе",
        aspects: "Логика курса в старшей школе; связь с ЕГЭ/итоговым контролем; структура содержания (человек, общество, социальные отношения, экономика, политика, право); формат КИМов, ключевые требования к выпускнику"
      },
      {
        number: 2,
        title: "Человек в условиях современного общества",
        topic: "Человек как субъект общественных отношений",
        aspects: "Актуальные изменения в социальной среде; адаптация личности к динамике общества; риски и возможности для молодёжи; жизненные планы и стратегии"
      },
      {
        number: 3,
        title: "Свобода, ответственность и выбор жизненного пути",
        topic: "Личность и свобода",
        aspects: "Свобода как осознанный выбор; ответственность за последствия решений; жизненное самоопределение (личное, профессиональное, гражданское); типичные «ловушки» выбора для старшеклассника"
      },
      {
        number: 4,
        title: "Общество, его развитие и глобальные вызовы",
        topic: "Общество как динамическая система",
        aspects: "Векторы развития современного общества; модернизация, реформы, революции (обобщение); глобализация; влияние глобальных процессов на жизнь гражданина"
      },
      {
        number: 5,
        title: "Культура в эпоху цифровизации",
        topic: "Культура и массовое общество",
        aspects: "Трансформация культуры в информационном обществе; массовая, элитарная, народная культура; цифровая культура и «культура отмены»; риски клипового мышления"
      },
      {
        number: 6,
        title: "Наука, образование, инновации",
        topic: "Научно-технический прогресс",
        aspects: "Роль науки и технологий; инновационная экономика; непрерывное образование; кадровый капитал и конкурентоспособность страны; этические риски НТП"
      },
      {
        number: 7,
        title: "Социальная стратификация и неравенство",
        topic: "Социальная структура",
        aspects: "Углублённый разбор критериев стратификации; бедность, богатство, «средний класс»; социальная поляризация; инструменты сглаживания неравенства"
      },
      {
        number: 8,
        title: "Социальная мобильность и карьерные траектории",
        topic: "Социальные лифты",
        aspects: "Формальные и неформальные социальные лифты; образовательная и карьерная траектория выпускника; миграция как канал мобильности; риски социальной маргинализации"
      },
      {
        number: 9,
        title: "Национальные и этнокультурные процессы",
        topic: "Межнациональные отношения",
        aspects: "Этнос, нация, национальное самосознание; этнокультурное многообразие России; конфликты на этнической почве и их предотвращение; государственная национальная политика"
      },
      {
        number: 10,
        title: "Глобализация и устойчивое развитие",
        topic: "Глобальные проблемы человечества",
        aspects: "Экологические, демографические, экономические и политические глобальные проблемы; концепция устойчивого развития; роль международных организаций и национальных стратегий"
      },
      {
        number: 11,
        title: "Экономика: системная ревизия ключевых понятий",
        topic: "Экономика как система",
        aspects: "Повтор и углубление: ресурсы, альтернативная стоимость, экономические системы; рациональное поведение субъектов; экономический цикл, кризисы (базово)"
      },
      {
        number: 12,
        title: "Макроэкономика: ВВП, рост, инфляция",
        topic: "Макроэкономические показатели",
        aspects: "ВВП и его структура; экономический рост, его факторы; инфляция (виды, последствия); безработица (виды, социальные эффекты); антикризисная политика государства"
      },
      {
        number: 13,
        title: "Государственный бюджет и налоги",
        topic: "Фискальная политика",
        aspects: "Доходы и расходы бюджета; дефицит и профицит; виды налогов; налоговая нагрузка; принципы налогообложения; социальные и экономические эффекты госрасходов"
      },
      {
        number: 14,
        title: "Банки, финансовые рынки и риски",
        topic: "Финансовая система",
        aspects: "Функции ЦБ и коммерческих банков; кредит, депозит, ценные бумаги на базовом уровне; курсовые риски, финансовые пузыри; защита прав вкладчиков и заёмщиков"
      },
      {
        number: 15,
        title: "Личные финансы и инвестиционное поведение",
        topic: "Финансовая грамотность",
        aspects: "Модели личного и семейного бюджета; финансовое планирование; долгосрочные и краткосрочные цели; базовая логика сбережений и инвестиций; финансовое мошенничество и способы защиты"
      },
      {
        number: 16,
        title: "Рынок труда и человеческий капитал",
        topic: "Трудовые отношения",
        aspects: "Факторы, влияющие на зарплату; конкурентоспособность работника; безработица и её виды; человеческий капитал и его монетизация; цифровые профессии и гибкий занятый"
      },
      {
        number: 17,
        title: "Политическая система и её акторы",
        topic: "Политическая сфера",
        aspects: "Декомпозиция политической системы: государство, партии, движения, СМИ, группы интересов; функции политической системы; политическое лидерство и элиты"
      },
      {
        number: 18,
        title: "Государство, формы правления и политические режимы",
        topic: "Форма государства",
        aspects: "Повтор и детализация форм правления, государственного устройства, политических режимов; признаки демократического, авторитарного, тоталитарного режима; гибридные модели"
      },
      {
        number: 19,
        title: "Демократия, гражданское общество, правовое государство",
        topic: "Демократический порядок",
        aspects: "Признаки демократии; правовое и социальное государство; гражданское общество и его институты; механизмы общественного контроля; угрозы демократии"
      },
      {
        number: 20,
        title: "Политическое участие и выборы",
        topic: "Избирательные системы и политическая культура",
        aspects: "Модели избирательных систем (мажоритарная, пропорциональная, смешанная); партии и электоральный процесс; политическая апатия, радикализм; осознанное голосование"
      },
      {
        number: 21,
        title: "Право и правовая система",
        topic: "Основы правопорядка",
        aspects: "Правовая норма, источник права, система права и законодательства; частное и публичное право; правосознание и правовая культура; правовой нигилизм"
      },
      {
        number: 22,
        title: "Конституционный строй и права человека",
        topic: "Конституционное право",
        aspects: "Основы конституционного строя РФ; система прав, свобод и обязанностей; механизмы их реализации и защиты (суд, прокуратура, омбудсмен, международные механизмы)"
      },
      {
        number: 23,
        title: "Гражданское право: собственность, обязательства, ответственность",
        topic: "Гражданско-правовые отношения",
        aspects: "Виды собственности; правоспособность и дееспособность; основные виды договоров (купля-продажа, аренда, займ и др.); гражданско-правовая ответственность"
      },
      {
        number: 24,
        title: "Трудовое и социальное право",
        topic: "Труд и социальная защита",
        aspects: "Трудовой договор, условия труда, рабочее время и отдых; гарантии работнику; особенности труда несовершеннолетних; система социального обеспечения и страхования"
      },
      {
        number: 25,
        title: "Семейное и уголовное право",
        topic: "Семья и ответственность",
        aspects: "Заключение и расторжение брака (правовой контур); права и обязанности родителей и детей; основания уголовной ответственности; состав преступления; виды наказаний; особенности ответственности несовершеннолетних"
      },
      {
        number: 26,
        title: "Правоохранительные органы и судебная система",
        topic: "Защита прав и законных интересов",
        aspects: "Суды общей юрисдикции и арбитражные суды в общем виде; функции полиции, прокуратуры, адвокатуры; алгоритм обращения в суд; досудебные способы урегулирования споров"
      },
      {
        number: 27,
        title: "Информационное общество и цифровое право",
        topic: "Право в цифровой среде",
        aspects: "Персональные данные и их защита; интеллектуальная собственность в сети (авторское право на базовом уровне); киберпреступность; цифровой след и цифровая этика"
      },
      {
        number: 28,
        title: "Россия в системе международных отношений",
        topic: "Международное право и сотрудничество",
        aspects: "Принципы международного права; международные организации; участие России в международных структурах; суверенитет и интеграция; права человека в международном контексте"
      },
      {
        number: 29,
        title: "Структура КИМ ЕГЭ и базовые стратегии",
        topic: "Подготовка к ЕГЭ: формат и требования",
        aspects: "Структура экзаменационной работы; типы заданий (1–24); критерии оценивания; базовые стратегии работы с тестовыми заданиями и текстом-источником"
      },
      {
        number: 30,
        title: "Практикум: решение заданий части 1",
        topic: "Тренинг по заданиям 1–24",
        aspects: "Отработка тестовых заданий по всем блокам; работа с типовыми ошибками; алгоритмы анализа текстов, таблиц, схем, графиков; фиксация «быстрых правил» по темам"
      },
      {
        number: 31,
        title: "Эссе (задание 25): структура и критерии",
        topic: "Подготовка к эссе",
        aspects: "Разбор формата задания 25; критерии оценивания; типовая структура эссе; выбор обществоведческой проблемы и теоретической базы; подбор аргументов"
      },
      {
        number: 32,
        title: "Практикум по эссе: от плана к тексту",
        topic: "Тренинг эссе",
        aspects: "Отработка полного цикла: выбор высказывания → формулировка проблемы → раскрытие понятий → теоретическая часть → 2–3 аргумента (примеры) → вывод; разбор типичных ошибок"
      },
      {
        number: 33,
        title: "Комплексный зачётный разбор",
        topic: "Интегрированное повторение",
        aspects: "Решение комбинированных вариантов (часть 1 + часть 2); работа в формате «мини-ЕГЭ»; самооценка результатов; корректировка индивидуальных стратегий подготовки"
      },
      {
        number: 34,
        title: "Финальный урок: фиксация готовности к выпуску",
        topic: "Итоговый обобщающий урок",
        aspects: "Рефлексия по курсу; обсуждение ключевых компетенций (анализ, аргументация, правовая и экономическая грамотность, гражданская позиция); персональные «точки роста» на финишной прямой подготовки к экзамену"
      }
    ]
  },
  {
    grade: 90,
    title: "Подготовка к ОГЭ по обществознанию",
    description: "Интенсивный курс подготовки к Основному государственному экзамену по обществознанию для девятиклассников с системным изучением всех блоков, типов заданий и стратегий выполнения ОГЭ.",
    lessons: [
      {
        number: 1,
        title: "Старт курса: что такое ОГЭ по обществознанию",
        topic: "Структура и формат ОГЭ",
        aspects: "Количество заданий и блоков; шкала оценивания; что проверяется; разбор демоверсии; роли кодификатора и спецификации; правила заполнения бланков"
      },
      {
        number: 2,
        title: "Диагностическая работа №1",
        topic: "Стартовая диагностика",
        aspects: "Проведение пробного варианта ОГЭ в сокращённом формате; фиксация типичных ошибок; первичный разбор результатов (без глубокого анализа)"
      },
      {
        number: 3,
        title: "Человек и общество: базовая рамка",
        topic: "Блок «Человек и общество»",
        aspects: "Повтор ключевых понятий: человек, индивид, личность, социализация; потребности, интересы, ценности; типовые задания ОГЭ на эти темы"
      },
      {
        number: 4,
        title: "Деятельность, общение, познание",
        topic: "Блок «Человек и общество»",
        aspects: "Структура деятельности; виды деятельности; формы общения; чувственное и рациональное познание; истина и её критерии; отработка заданий «на понятия» и «на признаки»"
      },
      {
        number: 5,
        title: "Духовная культура и мировоззрение",
        topic: "Духовная сфера общества",
        aspects: "Мировоззрение, формы общественного сознания; религия, наука, мораль, искусство; задания на классификацию и установление соответствия"
      },
      {
        number: 6,
        title: "Социальные нормы и социальный контроль",
        topic: "Социальное регулирование",
        aspects: "Виды социальных норм; санкции; формальный и неформальный контроль; практикум по заданиям на различение норм (мораль/право/обычай/традиция)"
      },
      {
        number: 7,
        title: "Социальная стратификация и мобильность",
        topic: "Социальные отношения",
        aspects: "Стратификация, социальные группы, страты, социальные лифты; типовые задания по социальной структуре; работа с графиками/схемами"
      },
      {
        number: 8,
        title: "Семья, брак, демография",
        topic: "Семья и демографические процессы",
        aspects: "Функции семьи; права и обязанности членов семьи; демографические тенденции; задания на работу с примерами и жизненными ситуациями"
      },
      {
        number: 9,
        title: "Экономика: ключевые понятия",
        topic: "Блок «Экономика»",
        aspects: "Потребности, ресурсы, альтернативная стоимость; экономические системы; участники экономики; отработка простых задач по экономическому блоку"
      },
      {
        number: 10,
        title: "Производство, предпринимательство, фирма",
        topic: "Экономическая деятельность",
        aspects: "Факторы производства и доходы; предприниматель и бизнес-риск; прибыль и издержки в базовом виде; практикум по заданиям на факторы и формы собственности"
      },
      {
        number: 11,
        title: "Рынок, спрос, предложение, деньги",
        topic: "Рыночная экономика",
        aspects: "Спрос, предложение, цена; конкуренция; функции денег; задания на установление соответствия и анализ простых таблиц/диаграмм"
      },
      {
        number: 12,
        title: "Личные финансы и семейный бюджет",
        topic: "Финансовая грамотность",
        aspects: "Доходы, расходы, бюджет, сбережения, кредиты (базово); финансовые риски; разбор задач по личным финансам из ОГЭ-формата"
      },
      {
        number: 13,
        title: "Диагностическая работа №2 по блокам «Человек» и «Экономика»",
        topic: "Промежуточный контроль",
        aspects: "Вариант, акцентированный на первых двух блоках; анализ допущенных ошибок; формирование индивидуальных зон доработки"
      },
      {
        number: 14,
        title: "Политика, власть, государство",
        topic: "Блок «Политика»",
        aspects: "Понятия «политика», «политическая власть», «государство»; признаки государства; формы правления и устройства; задания на признаки и классификацию"
      },
      {
        number: 15,
        title: "Политическая система и режимы",
        topic: "Политическая система общества",
        aspects: "Политическая система, её элементы; политические режимы (демократия, авторитаризм, тоталитаризм — признаки); отработка заданий на сравнение и признаки"
      },
      {
        number: 16,
        title: "Демократия, выборы, участие граждан",
        topic: "Демократический процесс",
        aspects: "Признаки демократии; формы политического участия; избирательная система в общих чертах; задания на установление соответствия и анализ текстов по политике"
      },
      {
        number: 17,
        title: "Блок «Право»: вход в тему",
        topic: "Право как социальная норма",
        aspects: "Понятие права; признаки правовой нормы; источники права; отличие права от других норм; типовые задания по базовым юридическим понятиям"
      },
      {
        number: 18,
        title: "Конституционное право и права человека",
        topic: "Конституционный строй и права граждан",
        aspects: "Основы конституционного строя; система прав и свобод; обязанности; практические задания по правам человека и их защите"
      },
      {
        number: 19,
        title: "Гражданское и семейное право",
        topic: "Частное право в заданиях ОГЭ",
        aspects: "Собственность, сделки, ответственность; брак, права и обязанности членов семьи; разбор правовых ситуаций формата ОГЭ"
      },
      {
        number: 20,
        title: "Трудовое и административное право",
        topic: "Правонарушения и ответственность",
        aspects: "Трудовые отношения, трудовой договор; виды правонарушений; административная и уголовная ответственность на базовом уровне; задания на правовые ситуации"
      },
      {
        number: 21,
        title: "Диагностическая работа №3 (все блоки)",
        topic: "Промежуточный вариант ОГЭ",
        aspects: "Полный по структуре тренинговый вариант; работа в режиме «почти реального экзамена»; подробный разбор типичных ошибок, работа с бланками"
      },
      {
        number: 22,
        title: "Отработка заданий типа «термины и операции с понятиями»",
        topic: "Типология заданий ОГЭ (1)",
        aspects: "Технология работы с заданиями на выбор верных суждений, определение понятий, признаки и функции; приёмы запоминания терминов, тренажёр по заданиям"
      },
      {
        number: 23,
        title: "Отработка заданий на соответствие и классификацию",
        topic: "Типология заданий ОГЭ (2)",
        aspects: "Задания на соответствие (элемент — элемент, элемент — характеристика), группировку и классификацию; прокачка навыка «читать вопрос до конца» и отсечение лишнего"
      },
      {
        number: 24,
        title: "Отработка заданий на анализ текста",
        topic: "Работа с источником (текст)",
        aspects: "Технология чтения текста: выделение темы, проблемы, позиций автора; поиск информации в тексте; задания на выбор утверждений по тексту; типичные ловушки"
      },
      {
        number: 25,
        title: "Задания на работу с таблицами, схемами, графиками",
        topic: "Графические и табличные задания",
        aspects: "Анализ простых таблиц, диаграмм, схем; чтение экономических и социальных показателей; перевод текста в схему и обратно; решения практических задач"
      },
      {
        number: 26,
        title: "Задания с развёрнутым ответом (правовые и социальные ситуации)",
        topic: "Развёрнутый ответ (краткий)",
        aspects: "Структура развёрнутого ответа; как оформлять аргументацию; подбор терминов и примеров; тренировка на 2–3 типовых форматах заданий"
      },
      {
        number: 27,
        title: "Задание с развёрнутым ответом повышенного уровня",
        topic: "Развёрнутый ответ (углублённый)",
        aspects: "Алгоритм: понять ситуацию → выделить проблему → применить теорию → привести примеры; типичные ошибки; отработка 1–2 вариантов в классе с поэтапным разбором"
      },
      {
        number: 28,
        title: "Обобщение по блоку «Человек и общество»",
        topic: "Тематическое повторение",
        aspects: "Систематизация понятий блока; мини-тренинг по заданиям только этого блока; разбор типичных ошибок; работа по индивидуальным «болям» учащихся"
      },
      {
        number: 29,
        title: "Обобщение по блокам «Экономика» и «Социальные отношения»",
        topic: "Тематическое повторение",
        aspects: "Повтор ключевых линий; тренинг по заданиям, вызывающим наибольшие сложности (финансы, рынок труда, стратификация, семья); мини-вариант по двум блокам"
      },
      {
        number: 30,
        title: "Обобщение по блокам «Политика» и «Право»",
        topic: "Тематическое повторение",
        aspects: "Сборка понятий: государство, политический режим, демократия, права человека, отрасли права, ответственность; интенсив по задачам по этим блокам"
      },
      {
        number: 31,
        title: "Тренировочный вариант ОГЭ №1",
        topic: "Полноформатный пробник",
        aspects: "Полный вариант по актуальному образцу; работа в режиме экзамена (ограничение по времени, бланки); последующий фронтальный разбор структуры ошибок"
      },
      {
        number: 32,
        title: "Тренировочный вариант ОГЭ №2 (вариант «на время»)",
        topic: "Скоростной пробник",
        aspects: "Ещё один полный вариант; акцент на тайм-менеджменте и стратегиях: с чего начинать, где не зависать; селективный разбор трудных задач"
      },
      {
        number: 33,
        title: "Адресная доработка: работа по индивидуальным дефицитам",
        topic: "Индивидуальная коррекция",
        aspects: "Разделение класса по типам проблем (термины, право, экономика, текст и т.п.); работа по группам с целевыми тренажёрами; формирование личного чек-листа подготовки"
      },
      {
        number: 34,
        title: "Финишный разбор и психологическая подготовка",
        topic: "Итоговый урок перед ОГЭ",
        aspects: "Повтор ключевых стратегий; памятка по дню экзамена; работа с волнением; ответы на точечные вопросы по содержанию и формату; финальная мотивационная установка"
      }
    ]
  },
  {
    grade: 100,
    title: "Подготовка к ЕГЭ по обществознанию",
    description: "Интенсивный курс подготовки к Единому государственному экзамену по обществознанию для одиннадцатиклассников с системным изучением всех блоков, типов заданий, стратегий выполнения и написания эссе.",
    lessons: [
      {
        number: 1,
        title: "Старт программы: ЕГЭ как проект на год",
        topic: "Формат и структура ЕГЭ",
        aspects: "Структура КИМ (часть 1 и часть 2); типы заданий; критерии оценивания, особенно развернутых ответов; стратегия подготовки на год; диагностика ожиданий и целей"
      },
      {
        number: 2,
        title: "Диагностический вариант №1",
        topic: "Стартовая диагностика",
        aspects: "Решение укороченного варианта ЕГЭ (или прошлогоднего реального); фиксация сильных/слабых блоков по кодификатору; первичный разбор типичных ошибок"
      },
      {
        number: 3,
        title: "«Человек и общество»: ревизия базовых понятий",
        topic: "Блок «Человек и общество»",
        aspects: "Человек как биосоциальное существо; индивид, личность, индивидуальность; потребности, интересы, способности, деятельность, социализация; задания егэшного формата по блоку"
      },
      {
        number: 4,
        title: "Познание, истина, мышление",
        topic: "Познавательная деятельность",
        aspects: "Уровни познания; формы мышления; истина и её критерии; относительная/абсолютная истина; наука и ненаучное знание; типовые тесты и разбор сложных формулировок"
      },
      {
        number: 5,
        title: "Духовная культура, мировоззрение, религия",
        topic: "Духовная сфера общества",
        aspects: "Мировоззрение, формы общественного сознания; религия, мораль, искусство, наука; массовая/элитарная/народная культура; отработка заданий на классификацию и соответствие"
      },
      {
        number: 6,
        title: "Социальные нормы и социальный контроль",
        topic: "Регуляция общественной жизни",
        aspects: "Нормы (право, мораль, религия, традиции, корпоративные); социальные санкции; формальный/неформальный контроль; задания на разграничение норм, работу с примерами"
      },
      {
        number: 7,
        title: "Социальная стратификация, мобильность, социальные лифты",
        topic: "Социальная структура",
        aspects: "Страты, классы, критерии стратификации; мобильность (виды), каналы мобильности; социальная справедливость; задачи на графики/таблицы и текст по блоку «Социальные отношения»"
      },
      {
        number: 8,
        title: "Этнос, нация, межнациональные отношения",
        topic: "Межнациональные отношения",
        aspects: "Этнические общности; нация и национальная политика; межэтнические конфликты и их профилактика; задания на признаки и примеры; закрепление терминологии"
      },
      {
        number: 9,
        title: "Семья, демография, социальная политика",
        topic: "Семья и демография",
        aspects: "Семья как институт; демографические показатели (рождаемость, смертность, естественный прирост, миграция, старение населения); социальная политика государства; задачи по текстам и схемам"
      },
      {
        number: 10,
        title: "Экономика: базовая рамка и системы",
        topic: "Блок «Экономика»",
        aspects: "Экономика как система; ограниченность ресурсов; альтернативная стоимость; типы экономических систем (традиционная, командная, рыночная, смешанная); задания по типологии и признакам"
      },
      {
        number: 11,
        title: "Рынок, спрос, предложение, конкуренция",
        topic: "Рыночный механизм",
        aspects: "Спрос и предложение, факторы; рыночное равновесие (качественно на графиках); конкуренция, виды конкуренции; задания на графики, таблицы, типовые формулировки по рынку"
      },
      {
        number: 12,
        title: "Фирма, издержки, прибыль",
        topic: "Производство и предпринимательство",
        aspects: "Факторы производства и доходы; постоянные/переменные издержки; выручка, прибыль; предпринимательство, риск, ответственность; практикум по задачам на факторы, формы собственности, прибыль"
      },
      {
        number: 13,
        title: "Макроэкономика: ВВП, рост, инфляция, безработица",
        topic: "Макроэкономические показатели",
        aspects: "ВВП и его структура; экономический рост, его факторы; инфляция (виды, последствия); безработица (виды, социальные последствия); задания на тексты и графики с макропоказателями"
      },
      {
        number: 14,
        title: "Финансовая система, банки, государственный бюджет",
        topic: "Финансы и фискальная политика",
        aspects: "Центральный и коммерческие банки; кредит, депозит, проценты; государственный бюджет, налоги, дефицит/профицит; задачи на налоги, бюджет, финансовые риски граждан"
      },
      {
        number: 15,
        title: "Личные финансы и финансовая безопасность",
        topic: "Финансовая грамотность",
        aspects: "Доходы, расходы, сбережения, инвестиции (очень базово); риск и доходность; финансовые пирамиды и мошенничество; тренинг на правдоподобные ЕГЭ-задачи по личным финансам"
      },
      {
        number: 16,
        title: "Политика, власть, политическая система",
        topic: "Блок «Политика»",
        aspects: "Политическая власть и её ресурсы; функции политики; структура политической системы; политические партии, движения, СМИ; задания на классификацию и признаки режимов"
      },
      {
        number: 17,
        title: "Государство, формы правления и устройства, режимы",
        topic: "Форма государства",
        aspects: "Признаки государства; формы правления (монархия/республика), государственного устройства (унитарное/федерация), режимы (демократия, авторитаризм, тоталитаризм); разбор типичных задач"
      },
      {
        number: 18,
        title: "Демократия, гражданское общество, правовое государство",
        topic: "Демократический политико-правовой порядок",
        aspects: "Признаки демократии; институты гражданского общества; признаки правового и социального государства; задания по политико-правовому блоку с текстами и схемами"
      },
      {
        number: 19,
        title: "Политическое участие, выборы, избирательные системы",
        topic: "Политический процесс",
        aspects: "Формы политического участия; избирательное право и системы (мажоритарная, пропорциональная, смешанная — на уровне ЕГЭ); практикум по задачам с избирательной тематикой"
      },
      {
        number: 20,
        title: "Право: система, отрасли, источники",
        topic: "Блок «Право»",
        aspects: "Правовая норма, система права, отрасли (конституционное, административное, гражданское, семейное, трудовое, уголовное и др.); источники права; задания на соотнесение отраслей и ситуаций"
      },
      {
        number: 21,
        title: "Конституционное право и права человека",
        topic: "Конституционный строй РФ",
        aspects: "Основные положения Конституции; права, свободы и обязанности; механизмы защиты прав (суд, прокуратура, омбудсмен и др.); разбор правовых казусов егэшного формата"
      },
      {
        number: 22,
        title: "Гражданское, семейное, трудовое право",
        topic: "Частное право в заданиях ЕГЭ",
        aspects: "Собственность, обязательства, договоры; брак, права и обязанности супругов/детей; трудовой договор, трудовые споры; практикум по разбору типичных правовых задач (краткий развёрнутый ответ)"
      },
      {
        number: 23,
        title: "Административная и уголовная ответственность, суд и правоохранительные органы",
        topic: "Публичное право и защита",
        aspects: "Правонарушение, состав, виды ответственности; общие положения об административной и уголовной ответственности; структура судов и правоохранительных органов; задания на ситуации и определение вида ответственности"
      },
      {
        number: 24,
        title: "Диагностический вариант №2 (по всему кодификатору)",
        topic: "Промежуточный экзаменационный срез",
        aspects: "Полноформатный вариант ЕГЭ; работа с бланками; последующий подробный разбор: статистика ошибок по блокам, анализ проблем по типам заданий (текст, таблица, график, правовая задача, эссе)"
      },
      {
        number: 25,
        title: "Технология работы с тестовой частью (задания 1–24)",
        topic: "Форматная отработка части 1",
        aspects: "Алгоритмы для заданий на термины, признаки, соответствие, классификацию, текст, графики и таблицы; типичные ловушки формулировок; мини-тренажёр по всем типам заданий"
      },
      {
        number: 26,
        title: "Задание с мини-планом",
        topic: "Развёрнутый ответ: план",
        aspects: "Требования к плану; типичные форматы формулировки темы; структура развернутого плана (3+ пункта, подкреплённые подпунктами); разбор 3–4 тем с совместной выработкой эталонных планов"
      },
      {
        number: 27,
        title: "Задание по анализу социально-правовой ситуации",
        topic: "Развёрнутый ответ: правовая/социальная задача",
        aspects: "Алгоритм: определить отрасль права/сферу, выделить факты, применить нормы, сформулировать вывод; задачи с множеством условий; тренировка 2–3 задач с разбором по критериям"
      },
      {
        number: 28,
        title: "Эссе по обществознанию: критерии и структура",
        topic: "Задание 25 (эссе)",
        aspects: "Формулировка обществоведческой проблемы; раскрытие смысла высказывания; теоретическая база (понятия, положения, выводы); требования к примерам; обзор критериев оценивания"
      },
      {
        number: 29,
        title: "Практикум по эссе: написание с нуля",
        topic: "Эссе: от тезиса к аргументации",
        aspects: "Отработка полного цикла: выбор высказывания → определение проблемы → теоретический блок → 2–3 содержательных примера (социальная практика, личный опыт, история, литература) → вывод; разбор 1–2 работ с выставлением баллов по критериям"
      },
      {
        number: 30,
        title: "Комплексный вариант №3 (полноформатный)",
        topic: "Тренинг в режимe «как на ЕГЭ»",
        aspects: "Выполнение полного варианта за отведённое время; жёсткий тайминг; самостоятельный первичный самопроверочный анализ по ключу; выбор индивидуальных зон доработки"
      },
      {
        number: 31,
        title: "Адресная коррекция: экономика и право",
        topic: "Целенаправленная отработка сложных блоков",
        aspects: "Группы по дефицитам: экономика (рынок, макро, финансы) и право (отрасли, задачи, конституция); точечные мини-тренажёры, дополнительные задачи, быстрые конспекты-матрицы"
      },
      {
        number: 32,
        title: "Адресная коррекция: политика, общество, эссе",
        topic: "Целенаправленная отработка сложных блоков",
        aspects: "Группы по дефицитам: политика, социальный блок, задание 25; работа с проблемными темами, доукладка теории; отработка 1 короткого эссе «под ключ» в классе"
      },
      {
        number: 33,
        title: "Финишный вариант №4 + разбор",
        topic: "Финальная обкатка перед экзаменом",
        aspects: "Ещё один полный вариант; сокращённый, но прицельный разбор: только «дорогие» задания (план, задачи, эссе) и места, где чаще всего теряются баллы; финальная настройка стратегии"
      },
      {
        number: 34,
        title: "Итоговый урок: фиксация готовности и чек-лист ЕГЭ",
        topic: "Завершение курса",
        aspects: "Итоговая рефлексия по всем блокам; персональный чек-лист на последние недели подготовки (что повторять, как тренироваться, как распределять время); краткий разбор «тактики дня экзамена»"
      }
    ]
  }
];

/**
 * Получить план курса по классу
 */
export function getCoursePlan(grade: number): CoursePlan | null {
  return COURSE_PLANS.find(plan => plan.grade === grade) || null;
}

/**
 * Получить урок по номеру из плана курса
 */
export function getLessonFromPlan(grade: number, lessonNumber: number): LessonPlan | null {
  const plan = getCoursePlan(grade);
  if (!plan) return null;

  return plan.lessons.find(lesson => lesson.number === lessonNumber) || null;
}

/**
 * Получить все доступные классы
 */
export function getAvailableGrades(): number[] {
  return [...new Set(COURSE_PLANS.map(plan => plan.grade))].sort((a, b) => a - b);
}

/**
 * Интерфейс для рекомендации курса
 */
export interface CourseRecommendation {
  plan: CoursePlan;
  recommendedLessonNumber: number;
  recommendedLesson: LessonPlan;
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
  lessonModules: LessonModule[];
  reasoning: string;
}

/**
 * Определить язык на основе последнего изученного предмета
 */
function detectLanguageFromTopic(lastTopic: string): string | null {
  const topicLower = lastTopic.toLowerCase().trim();

  // Английский язык
  if (topicLower.includes('английск') || topicLower.includes('english') ||
      topicLower.includes('toefl') || topicLower.includes('ielts') ||
      topicLower.includes('british') || topicLower.includes('american')) {
    return 'english';
  }

  // Русский язык
  if (topicLower.includes('русск') || topicLower.includes('russian') ||
      topicLower.includes('егэ') || topicLower.includes('огэ') ||
      topicLower.includes('русский язык')) {
    return 'russian';
  }

  // Китайский язык
  if (topicLower.includes('китайск') || topicLower.includes('chinese') ||
      topicLower.includes('мандарин') || topicLower.includes('китай')) {
    return 'chinese';
  }

  // Арабский язык
  if (topicLower.includes('арабск') || topicLower.includes('arabic') ||
      topicLower.includes('арабский')) {
    return 'arabic';
  }

  return null; // Язык не определен
}

/**
 * Получить план курса по классу и языку
 */
export function getCoursePlanByGradeAndLanguage(grade: number, language?: string | null): CoursePlan | null {
  // Если язык не указан, берем первый курс с этим grade
  if (!language) {
    return COURSE_PLANS.find(plan => plan.grade === grade) || null;
  }

  // Ищем курс по grade и языку
  const languageLower = language.toLowerCase();
  return COURSE_PLANS.find(plan =>
    plan.grade === grade &&
    plan.title.toLowerCase().includes(languageLower)
  ) || null;
}

/**
 * Определить подходящий план курса на основе результатов теста
 */
export function getCourseRecommendation(result: AssessmentResult): CourseRecommendation | null {
  // Извлекаем численный класс из строки
  const gradeNumber = extractGradeNumber(result.classGrade);
  const gradeLower = result.classGrade.toLowerCase().trim();

  // Определяем план курса на основе класса и уровня
  let targetGrade: number;

  // Логика определения плана курса на основе класса и уровня
  if (gradeNumber === 9) {
    targetGrade = 90; // ОГЭ для 9 класса
  } else if (gradeNumber === 11) {
    targetGrade = 100; // ЕГЭ для 11 класса
  } else if (gradeLower.includes('вуз') || gradeLower.includes('университет') || gradeLower.includes('универ') ||
             gradeLower.includes('студент') || gradeLower.includes('бакалавр') || gradeLower.includes('магистр') ||
             gradeLower.includes('college') || gradeLower.includes('university')) {
    // Для вуза: английский -> ЕГЭ (grade 100), другие языки -> grade 200
    const detectedLanguage = detectLanguageFromTopic(result.lastTopic || '');
    if (detectedLanguage === 'english') {
      targetGrade = 100; // ЕГЭ для английского в вузе
    } else {
      targetGrade = 200; // Курсы для вуза для других языков
    }
  } else if (gradeNumber >= 1 && gradeNumber <= 11) {
    targetGrade = gradeNumber; // Обычный план для классов 1-11
  } else {
    targetGrade = 1; // По умолчанию первый класс
  }

  // Определяем язык на основе последнего изученного предмета
  const detectedLanguage = detectLanguageFromTopic(result.lastTopic || '');

  // Получаем план курса с учетом языка
  let plan = getCoursePlanByGradeAndLanguage(targetGrade, detectedLanguage);
  if (!plan) {
    // Fallback: если курс с нужным языком не найден, берем любой курс для этого grade
    plan = getCoursePlan(targetGrade);
    if (!plan) {
      return null;
    }
    // Используем fallback план, но логируем проблему
    console.warn(`Course recommendation: No course found for grade ${targetGrade} and language ${detectedLanguage}, using fallback: ${plan.title}`);
  }

  // Заполняем план модулями, если они не заполнены
  const populatedPlan = populateCoursePlanModules(plan);

  // Определяем уровень ученика
  const studentLevel = determineStudentLevel(result);

  // Определяем рекомендуемый урок на основе профиля
  const recommendedLessonNumber = getRecommendedLessonNumber(result, populatedPlan);
  const recommendedLesson = populatedPlan.lessons.find(lesson => lesson.number === recommendedLessonNumber);

  if (!recommendedLesson) {
    return null;
  }

  // Генерируем модули урока на основе уровня ученика и сложности урока
  const lessonModules = generateLessonModules(recommendedLesson, studentLevel);

  // Формируем объяснение
  const reasoning = generateRecommendationReasoning(result, populatedPlan, recommendedLessonNumber);

  return {
    plan: populatedPlan,
    recommendedLessonNumber,
    recommendedLesson,
    studentLevel,
    lessonModules,
    reasoning
  };
}

/**
 * Извлечь численный класс из строки
 */
function extractGradeNumber(gradeString: string): number {
  const gradeLower = gradeString.toLowerCase().trim();

  // Ищем числа в строке
  const match = gradeString.match(/\d+/);
  if (match) {
    return parseInt(match[0]);
  }

  // Текстовые варианты классов
  if (gradeLower.includes('первый') || gradeLower.includes('first')) return 1;
  if (gradeLower.includes('второй') || gradeLower.includes('second')) return 2;
  if (gradeLower.includes('третий') || gradeLower.includes('third')) return 3;
  if (gradeLower.includes('четвертый') || gradeLower.includes('fourth')) return 4;
  if (gradeLower.includes('пятый') || gradeLower.includes('fifth')) return 5;
  if (gradeLower.includes('шестой') || gradeLower.includes('sixth')) return 6;
  if (gradeLower.includes('седьмой') || gradeLower.includes('seventh')) return 7;
  if (gradeLower.includes('восьмой') || gradeLower.includes('eighth')) return 8;
  if (gradeLower.includes('девятый') || gradeLower.includes('ninth')) return 9;
  if (gradeLower.includes('десятый') || gradeLower.includes('tenth')) return 10;
  if (gradeLower.includes('одиннадцатый') || gradeLower.includes('eleventh')) return 11;

  // Высшие уровни образования
  if (gradeLower.includes('вуз') || gradeLower.includes('университет') || gradeLower.includes('универ') ||
      gradeLower.includes('студент') || gradeLower.includes('бакалавр') || gradeLower.includes('магистр') ||
      gradeLower.includes('college') || gradeLower.includes('university')) {
    return 200; // Код для вуза
  }

  return 1; // По умолчанию первый класс
}

/**
 * Определить рекомендуемый номер урока на основе профиля
 */
function getRecommendedLessonNumber(result: AssessmentResult, plan: CoursePlan): number {
  // Для экзаменационных курсов (ОГЭ, ЕГЭ) всегда начинаем с диагностики
  if (plan.grade === 90 || plan.grade === 100) {
    return 1;
  }

  const weakTopics = result.profile.filter(item => item.p < 0.7);
  const learnedTopics = result.profile.filter(item => item.p >= 0.7);

  // Если почти все темы выучены, начинаем с продвинутых уроков
  if (learnedTopics.length / result.profile.length > 0.8) {
    return Math.min(16, plan.lessons.length); // Середина курса
  }

  // Если много слабых тем, начинаем с основ
  if (weakTopics.length / result.profile.length > 0.5) {
    return 1; // С начала
  }

  // Для обычных курсов определяем по прогрессу
  const progressRatio = learnedTopics.length / result.profile.length;
  const recommendedLesson = Math.max(1, Math.round(progressRatio * plan.lessons.length * 0.7));

  return Math.min(recommendedLesson, plan.lessons.length);
}

/**
 * Определить уровень сложности на основе профиля ученика
 */
export function determineStudentLevel(result: AssessmentResult): 'beginner' | 'intermediate' | 'advanced' {
  const learnedTopics = result.profile.filter(item => item.p >= 0.7);
  const totalTopics = result.profile.length;

  if (learnedTopics.length / totalTopics > 0.8) {
    return 'advanced';
  } else if (learnedTopics.length / totalTopics > 0.5) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

/**
 * Заполнить модули для всех уроков в плане курса
 */
export function populateCoursePlanModules(plan: CoursePlan): CoursePlan {
  const updatedLessons = plan.lessons.map(lesson => ({
    ...lesson,
    modules: lesson.modules && lesson.modules.length > 0 ? lesson.modules : generateDefaultLessonModules(lesson),
    difficulty: lesson.difficulty || determineLessonDifficulty(plan.grade, lesson.number, lesson.topic)
  }));

  return {
    ...plan,
    lessons: updatedLessons
  };
}

/**
 * Сгенерировать модули по умолчанию для урока
 */
function generateDefaultLessonModules(lesson: LessonPlan): LessonModule[] {
  // Разбиваем основные аспекты на отдельные компоненты для лучшей структуры
  const aspectsParts = lesson.aspects.split(';').map(part => part.trim()).filter(p => p.length > 0);
  
  return [
    {
      number: 1,
      title: `${lesson.number}. ${lesson.title} - Введение`,
      type: 'conspectus',
      content: `Введение в тему "${lesson.topic}"\n\nОсновные аспекты:\n${lesson.aspects}`,
      estimatedTime: 15
    },
    {
      number: 2,
      title: `${lesson.number}. ${lesson.title} - Теория`,
      type: 'theory',
      content: `Теоретический материал по теме: "${lesson.topic}"\n\nКлючевые концепции:\n${aspectsParts.slice(0, Math.ceil(aspectsParts.length / 2)).join('\n')}`,
      estimatedTime: 20
    },
    {
      number: 3,
      title: `${lesson.number}. ${lesson.title} - Практика`,
      type: 'practice',
      content: `Практические упражнения и примеры по теме: "${lesson.topic}"\n\nПрименение знаний:\n${aspectsParts.slice(Math.ceil(aspectsParts.length / 2)).join('\n')}`,
      estimatedTime: 25
    },
    {
      number: 4,
      title: `${lesson.number}. ${lesson.title} - Тест`,
      type: 'test',
      content: `Контрольное тестирование по теме: "${lesson.topic}"\n\nПроверка понимания основных аспектов: ${lesson.aspects.substring(0, 100)}...`,
      estimatedTime: 15
    }
  ];
}

/**
 * Определить сложность урока на основе класса и номера
 */
function determineLessonDifficulty(grade: number, lessonNumber: number, topic: string): 'beginner' | 'intermediate' | 'advanced' {
  // Экзаменационные курсы
  if (grade === 90 || grade === 100) {
    return 'advanced';
  }

  // Начальные классы (1-4)
  if (grade <= 4) {
    return 'beginner';
  }

  // Средние классы (5-8)
  if (grade <= 8) {
    if (lessonNumber <= 16) {
      return 'beginner';
    } else if (lessonNumber <= 24) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }

  // Старшие классы (9-11) - более сложные темы
  if (grade >= 9) {
    if (lessonNumber <= 8) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }

  // По умолчанию
  return 'intermediate';
}

/**
 * Сгенерировать модули для урока на основе уровня ученика и сложности урока
 */
export function generateLessonModules(lesson: LessonPlan, studentLevel: 'beginner' | 'intermediate' | 'advanced'): LessonModule[] {
  // Если у урока уже есть модули, используем их как базу
  let modules = lesson.modules && lesson.modules.length > 0 ? [...lesson.modules] : [];

  // Если модули не заполнены, генерируем базовые
  if (modules.length === 0) {
    modules = generateDefaultLessonModules(lesson);
  }

  // Добавляем дополнительные модули на основе уровня ученика относительно сложности урока
  const lessonDifficulty = lesson.difficulty;
  const levelDifference = getLevelDifference(studentLevel, lessonDifficulty);

  // Если ученик слабее уровня урока, добавляем дополнительные подготовительные модули
  if (levelDifference < 0) {
    modules.unshift({
      number: 0,
      title: `${lesson.title} - Подготовка`,
      type: 'theory',
      content: `Подготовительный материал для изучения темы: ${lesson.topic}`,
      estimatedTime: 10
    });
  }

  // Если ученик на уровне урока или выше, добавляем продвинутые модули
  if (levelDifference >= 0) {
    if (studentLevel === 'intermediate' || studentLevel === 'advanced') {
      modules.push({
        number: modules.length + 1,
        title: `${lesson.title} - Углубленная практика`,
        type: 'practice',
        content: `Дополнительные упражнения повышенной сложности: ${lesson.aspects}`,
        estimatedTime: 20
      });
    }

    if (studentLevel === 'advanced') {
      modules.push({
        number: modules.length + 1,
        title: `${lesson.title} - Продвинутый тест`,
        type: 'test',
        content: `Продвинутое тестирование с комплексными заданиями: ${lesson.topic}`,
        estimatedTime: 25
      });
    }
  }

  // Перенумеровываем модули
  return modules.map((module, index) => ({
    ...module,
    number: index + 1
  }));
}

/**
 * Определить разницу между уровнем ученика и сложностью урока
 */
function getLevelDifference(studentLevel: 'beginner' | 'intermediate' | 'advanced', lessonDifficulty: 'beginner' | 'intermediate' | 'advanced'): number {
  const levels = { beginner: 1, intermediate: 2, advanced: 3 };
  return levels[studentLevel] - levels[lessonDifficulty];
}

/**
 * Сгенерировать объяснение рекомендации
 */
function generateRecommendationReasoning(result: AssessmentResult, plan: CoursePlan, lessonNumber: number): string {
  const weakCount = result.profile.filter(item => item.p < 0.7).length;
  const totalCount = result.profile.length;
  const learnedCount = totalCount - weakCount;
  const studentLevel = determineStudentLevel(result);

  let reasoning = `На основе результатов тестирования рекомендуем начать с курса "${plan.title}". `;

  if (plan.grade === 90) {
    reasoning += `Ваш уровень соответствует 9 классу, поэтому мы подобрали специализированную подготовку к ОГЭ. `;
  } else if (plan.grade === 100) {
    reasoning += `Ваш уровень соответствует 11 классу, поэтому мы подобрали интенсивную подготовку к ЕГЭ. `;
  } else {
    reasoning += `Ваш уровень соответствует ${result.classGrade}, поэтому мы подобрали соответствующий план курса. `;
  }

  reasoning += `Из ${totalCount} проверенных тем вы хорошо знаете ${learnedCount}. `;
  reasoning += `Ваш уровень сложности: ${studentLevel === 'beginner' ? 'начальный' : studentLevel === 'intermediate' ? 'средний' : 'продвинутый'}. `;
  reasoning += `Рекомендуем начать с урока ${lessonNumber}: "${plan.lessons[lessonNumber - 1]?.title}".`;

  return reasoning;
}

/**
 * Вопросы для ознакомительного тестирования по курсам и классам
 */
export const COURSE_TEST_QUESTIONS: CourseTestQuestions = {
  // Русский язык (courseId: 0)
  0: {
    // 1-2 класс
    1: [
      {
        question: "Что такое слово?",
        options: ["Звук", "Буква", "Единица речи"],
        correctAnswer: "Единица речи"
      },
      {
        question: "Какая буква первая в алфавите?",
        options: ["Б", "А", "В"],
        correctAnswer: "А"
      },
      {
        question: "Что обозначают гласные буквы?",
        options: ["Звуки", "Предложения", "Слова"],
        correctAnswer: "Звуки"
      },
      {
        question: "Что изучает фонетика?",
        options: ["Звуки речи", "Слова", "Предложения"],
        correctAnswer: "Звуки речи"
      },
      {
        question: "Какие звуки 'поются' при произнесении?",
        options: ["Согласные", "Гласные", "Твёрдые"],
        correctAnswer: "Гласные"
      },
      {
        question: "Что такое слог?",
        options: ["Отдельный звук", "Часть слова, произносимая одним толчком воздуха", "Целое слово"],
        correctAnswer: "Часть слова, произносимая одним толчком воздуха"
      },
      {
        question: "Как называется ударный слог?",
        options: ["Тихий", "Громкий", "Выделенный голосом"],
        correctAnswer: "Выделенный голосом"
      },
      {
        question: "Что такое твёрдые и мягкие согласные?",
        options: ["Громкие и тихие звуки", "Парные звуки по способу образования", "Длинные и короткие звуки"],
        correctAnswer: "Парные звуки по способу образования"
      }
    ],
    // 3-4 класс
    3: [
      {
        question: "Что такое морфология?",
        options: ["Изучение слов и их форм", "Изучение предложений", "Изучение звуков"],
        correctAnswer: "Изучение слов и их форм"
      },
      {
        question: "Какая часть речи отвечает на вопросы 'кто?' или 'что?'",
        options: ["Глагол", "Существительное", "Прилагательное"],
        correctAnswer: "Существительное"
      },
      {
        question: "Что такое текст?",
        options: ["Отдельное слово", "Связное высказывание", "Звук"],
        correctAnswer: "Связное высказывание"
      },
      {
        question: "Какие существительные называют конкретные предметы?",
        options: ["Одушевлённые", "Неодушевлённые", "Собственные"],
        correctAnswer: "Неодушевлённые"
      },
      {
        question: "Как определить род существительного?",
        options: ["По окончанию", "По цвету", "По размеру"],
        correctAnswer: "По окончанию"
      },
      {
        question: "Что показывает множественное число существительных?",
        options: ["Количество предметов", "Размер предметов", "Цвет предметов"],
        correctAnswer: "Количество предметов"
      },
      {
        question: "Что такое падеж?",
        options: ["Изменение слова по вопросам", "Изменение слова по цвету", "Изменение слова по размеру"],
        correctAnswer: "Изменение слова по вопросам"
      },
      {
        question: "Как пишутся предлоги?",
        options: ["Слитно", "Через дефис", "Отдельно"],
        correctAnswer: "Отдельно"
      }
    ],
    // 5-6 класс
    5: [
      {
        question: "Что изучает синтаксис?",
        options: ["Изменение слов", "Построение предложений", "Произношение"],
        correctAnswer: "Построение предложений"
      },
      {
        question: "Какой частью речи является слово 'бежал'?",
        options: ["Существительное", "Прилагательное", "Глагол"],
        correctAnswer: "Глагол"
      },
      {
        question: "Что такое синонимы?",
        options: ["Слова с противоположным значением", "Слова с одинаковым значением", "Иностранные слова"],
        correctAnswer: "Слова с одинаковым значением"
      },
      {
        question: "Что такое антонимы?",
        options: ["Слова с одинаковым значением", "Слова с противоположным значением", "Иностранные слова"],
        correctAnswer: "Слова с противоположным значением"
      },
      {
        question: "Что такое многозначные слова?",
        options: ["Слова с одним значением", "Слова с несколькими значениями", "Слова без значений"],
        correctAnswer: "Слова с несколькими значениями"
      },
      {
        question: "Что такое метафора?",
        options: ["Прямое значение слова", "Переносное значение слова", "Буквальное значение"],
        correctAnswer: "Переносное значение слова"
      },
      {
        question: "Что такое толковый словарь?",
        options: ["Словарь иностранных слов", "Словарь, объясняющий значения слов", "Словарь синонимов"],
        correctAnswer: "Словарь, объясняющий значения слов"
      },
      {
        question: "Что такое микротема текста?",
        options: ["Главная тема", "Часть основной мысли", "Заголовок текста"],
        correctAnswer: "Часть основной мысли"
      }
    ],
    // 7-8 класс
    7: [
      {
        question: "Что такое словосочетание?",
        options: ["Отдельное слово", "Два слова, связанных по смыслу", "Целое предложение"],
        correctAnswer: "Два слова, связанных по смыслу"
      },
      {
        question: "Что такое грамматическая основа предложения?",
        options: ["Подлежащее и сказуемое", "Все слова предложения", "Только подлежащее"],
        correctAnswer: "Подлежащее и сказуемое"
      },
      {
        question: "Какие члены предложения называются второстепенными?",
        options: ["Подлежащее и сказуемое", "Дополнение, определение, обстоятельство", "Только дополнение"],
        correctAnswer: "Дополнение, определение, обстоятельство"
      },
      {
        question: "Что такое однородные члены предложения?",
        options: ["Разные по смыслу слова", "Одинаковые по функции слова", "Слова разного рода"],
        correctAnswer: "Одинаковые по функции слова"
      },
      {
        question: "Когда ставится запятая при однородных членах?",
        options: ["Всегда", "Только с союзом И", "При отсутствии союза"],
        correctAnswer: "При отсутствии союза"
      },
      {
        question: "Что такое обобщающее слово?",
        options: ["Общее понятие для ряда однородных членов", "Первое слово в предложении", "Последнее слово"],
        correctAnswer: "Общее понятие для ряда однородных членов"
      },
      {
        question: "Какие виды связи существуют в словосочетании?",
        options: ["Только согласование", "Согласование, управление, примыкание", "Только примыкание"],
        correctAnswer: "Согласование, управление, примыкание"
      },
      {
        question: "Что такое фразеологизм?",
        options: ["Отдельное слово", "Устойчивое сочетание слов", "Предложение"],
        correctAnswer: "Устойчивое сочетание слов"
      }
    ],
    // 9-11 класс
    9: [
      {
        question: "Что такое сложноподчинённое предложение?",
        options: ["Предложение с одной основой", "Предложение с главной и придаточной частями", "Простое предложение"],
        correctAnswer: "Предложение с главной и придаточной частями"
      },
      {
        question: "Какие стили речи существуют?",
        options: ["Только разговорный", "Разговорный, художественный, научный, официально-деловой", "Только письменный"],
        correctAnswer: "Разговорный, художественный, научный, официально-деловой"
      },
      {
        question: "Что такое придаточное определительное?",
        options: ["Отвечает на вопрос какой?", "Отвечает на вопрос что?", "Отвечает на вопрос почему?"],
        correctAnswer: "Отвечает на вопрос какой?"
      },
      {
        question: "Что такое придаточное изъяснительное?",
        options: ["Отвечает на вопрос какой?", "Отвечает на вопрос что делать?, что?, как?", "Отвечает на вопрос почему?"],
        correctAnswer: "Отвечает на вопрос что делать?, что?, как?"
      },
      {
        question: "Какое предложение называется сложным?",
        options: ["С одной грамматической основой", "С двумя и более грамматическими основами", "Без основы"],
        correctAnswer: "С двумя и более грамматическими основами"
      },
      {
        question: "Что такое стилистика?",
        options: ["Изучение звуков", "Изучение стилей речи", "Изучение предложений"],
        correctAnswer: "Изучение стилей речи"
      },
      {
        question: "Какие виды связи существуют в сложном предложении?",
        options: ["Только сочинительная", "Сочинительная, подчинительная, бессоюзная", "Только бессоюзная"],
        correctAnswer: "Сочинительная, подчинительная, бессоюзная"
      },
      {
        question: "Что такое микротема?",
        options: ["Главная тема текста", "Часть основной мысли", "Заголовок абзаца"],
        correctAnswer: "Часть основной мысли"
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: "Что такое текст?",
        options: ["Отдельное слово", "Связное высказывание", "Знак препинания"],
        correctAnswer: "Связное высказывание"
      },
      {
        question: "Какие виды связи существуют в сложном предложении?",
        options: ["Только сочинительная", "Сочинительная, подчинительная, бессоюзная", "Только подчинительная"],
        correctAnswer: "Сочинительная, подчинительная, бессоюзная"
      },
      {
        question: "Что такое стилистика?",
        options: ["Изучение звуков", "Изучение стилей речи", "Изучение предложений"],
        correctAnswer: "Изучение стилей речи"
      },
      {
        question: "Что такое метафора?",
        options: ["Прямое значение слова", "Переносное значение слова", "Буквальное значение"],
        correctAnswer: "Переносное значение слова"
      },
      {
        question: "Какие стили речи существуют?",
        options: ["Только разговорный", "Разговорный, художественный, научный, официально-деловой", "Только письменный"],
        correctAnswer: "Разговорный, художественный, научный, официально-деловой"
      },
      {
        question: "Что такое сложноподчинённое предложение?",
        options: ["Предложение с одной основой", "Предложение с главной и придаточной частями", "Простое предложение"],
        correctAnswer: "Предложение с главной и придаточной частями"
      },
      {
        question: "Что такое фразеологизм?",
        options: ["Отдельное слово", "Устойчивое сочетание слов", "Предложение"],
        correctAnswer: "Устойчивое сочетание слов"
      },
      {
        question: "Что такое микротема текста?",
        options: ["Главная тема текста", "Часть основной мысли", "Заголовок абзаца"],
        correctAnswer: "Часть основной мысли"
      }
    ]
  },

  // Английский язык (courseId: 1)
  1: {
    // 1-2 класс
    1: [
      {
        question: 'Что значит "Hello"?',
        options: ['Привет', 'Пока', 'Спасибо'],
        correctAnswer: 'Привет'
      },
      {
        question: 'Что значит "Good morning"?',
        options: ['Добрый вечер', 'Доброе утро', 'Спокойной ночи'],
        correctAnswer: 'Доброе утро'
      },
      {
        question: 'Как сказать "Меня зовут..." по-английски?',
        options: ['I am', 'My name is', 'I have'],
        correctAnswer: 'My name is'
      },
      {
        question: 'Что значит "Thank you"?',
        options: ['Пожалуйста', 'Спасибо', 'Привет'],
        correctAnswer: 'Спасибо'
      },
      {
        question: 'Как переводится "red"?',
        options: ['синий', 'красный', 'зелёный'],
        correctAnswer: 'красный'
      },
      {
        question: 'Что значит "one"?',
        options: ['два', 'три', 'один'],
        correctAnswer: 'один'
      },
      {
        question: 'Как сказать "Это книга" по-английски?',
        options: ['This is a pen', 'This is a book', 'This is a bag'],
        correctAnswer: 'This is a book'
      },
      {
        question: 'Что значит "How many"?',
        options: ['Какой?', 'Сколько?', 'Где?'],
        correctAnswer: 'Сколько?'
      }
    ],
    // 3-4 класс
    3: [
      {
        question: 'Выберите правильный ответ: She ___ a book.',
        options: ['read', 'reads', 'reading'],
        correctAnswer: 'reads'
      },
      {
        question: 'Как образуется множественное число существительного "cat"?',
        options: ['cats', 'cates', 'caties'],
        correctAnswer: 'cats'
      },
      {
        question: 'Что значит "my"?',
        options: ['твой', 'мой', 'его'],
        correctAnswer: 'мой'
      },
      {
        question: 'Как сказать "Это мой брат" по-английски?',
        options: ['This is my brother', 'This is your brother', 'This is his brother'],
        correctAnswer: 'This is my brother'
      },
      {
        question: 'Выберите правильный ответ: We ___ apples.',
        options: ['like', 'likes', 'liking'],
        correctAnswer: 'like'
      },
      {
        question: 'Как переводится "family"?',
        options: ['друзья', 'семья', 'школа'],
        correctAnswer: 'семья'
      },
      {
        question: 'Что значит "sister"?',
        options: ['брат', 'сестра', 'мама'],
        correctAnswer: 'сестра'
      },
      {
        question: 'Как сказать "Я люблю яблоки" по-английски?',
        options: ['I like apples', 'I likes apples', 'I liking apples'],
        correctAnswer: 'I like apples'
      }
    ],
    // 5-6 класс
    5: [
      {
        question: 'Заполните пропуск: Yesterday I ___ to school.',
        options: ['go', 'went', 'will go'],
        correctAnswer: 'went'
      },
      {
        question: 'Что значит "will" в будущем времени?',
        options: ['Прошлое', 'Настоящее', 'Будущее'],
        correctAnswer: 'Будущее'
      },
      {
        question: 'Как образуется сравнительная степень прилагательного "big"?',
        options: ['biggest', 'bigger', 'more big'],
        correctAnswer: 'bigger'
      },
      {
        question: 'Что значит "can"?',
        options: ['Должен', 'Могу', 'Хочу'],
        correctAnswer: 'Могу'
      },
      {
        question: 'Выберите слово, обозначающее "вчера":',
        options: ['today', 'yesterday', 'tomorrow'],
        correctAnswer: 'yesterday'
      },
      {
        question: 'Заполните пропуск: I ___ swim very well.',
        options: ['can', 'must', 'should'],
        correctAnswer: 'can'
      },
      {
        question: 'Как сказать "Я пойду в кино завтра" по-английски?',
        options: ['I went to cinema yesterday', 'I go to cinema tomorrow', 'I will go to cinema tomorrow'],
        correctAnswer: 'I will go to cinema tomorrow'
      },
      {
        question: 'Что значит "must"?',
        options: ['Могу', 'Должен', 'Хочу'],
        correctAnswer: 'Должен'
      }
    ],
    // 7-8 класс
    7: [
      {
        question: 'Заполните пропуск: I ___ reading a book now.',
        options: ['am read', 'am reading', 'read'],
        correctAnswer: 'am reading'
      },
      {
        question: 'Что такое Present Continuous?',
        options: ['Прошедшее время', 'Настоящее время длительное', 'Будущее время'],
        correctAnswer: 'Настоящее время длительное'
      },
      {
        question: 'Выберите правильный предлог: I live ___ Moscow.',
        options: ['at', 'in', 'on'],
        correctAnswer: 'in'
      },
      {
        question: 'Что значит "while"?',
        options: ['Потому что', 'Пока', 'Если'],
        correctAnswer: 'Пока'
      },
      {
        question: 'Заполните пропуск: The cake ___ baked by my mother.',
        options: ['was', 'were', 'are'],
        correctAnswer: 'was'
      },
      {
        question: 'Что такое Passive Voice?',
        options: ['Действительный залог', 'Страдательный залог', 'Возвратный залог'],
        correctAnswer: 'Страдательный залог'
      },
      {
        question: 'Выберите правильное относительное местоимение: This is the book ___ I bought yesterday.',
        options: ['who', 'which', 'where'],
        correctAnswer: 'which'
      },
      {
        question: 'Заполните пропуск: If I ___ rich, I would buy a big house.',
        options: ['am', 'was', 'were'],
        correctAnswer: 'were'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Заполните пропуск: By the time we arrived, the film ___ .',
        options: ['started', 'had started', 'has started'],
        correctAnswer: 'had started'
      },
      {
        question: 'Что такое Past Perfect?',
        options: ['Давнопрошедшее время', 'Прошедшее время', 'Будущее время'],
        correctAnswer: 'Давнопрошедшее время'
      },
      {
        question: 'Что такое условное предложение I типа?',
        options: ['Реальное условие', 'Нереальное условие', 'Предположение'],
        correctAnswer: 'Реальное условие'
      },
      {
        question: 'Что такое герундий?',
        options: ['Отглагольное существительное', 'Отглагольное прилагательное', 'Форма глагола'],
        correctAnswer: 'Отглагольное существительное'
      },
      {
        question: 'Заполните пропуск: I enjoy ___ books.',
        options: ['read', 'reading', 'to read'],
        correctAnswer: 'reading'
      },
      {
        question: 'Что такое инфинитив?',
        options: ['Неопределённая форма глагола', 'Определённая форма глагола', 'Причастие'],
        correctAnswer: 'Неопределённая форма глагола'
      },
      {
        question: 'Выберите правильное условное предложение: If I ___ you, I would study harder.',
        options: ['am', 'was', 'were'],
        correctAnswer: 'were'
      },
      {
        question: 'Что значит "should have done"?',
        options: ['Надо было сделать', 'Надо сделать', 'Сделаю'],
        correctAnswer: 'Надо было сделать'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'Заполните пропуск в тексте: "The scientist ___ his research for years before publishing the results."',
        options: ['conducted', 'had conducted', 'has conducted'],
        correctAnswer: 'had conducted'
      },
      {
        question: 'Что такое Present Perfect Continuous?',
        options: ['Действие, начавшееся в прошлом и продолжающееся сейчас', 'Действие, завершившееся в прошлом', 'Действие, которое будет в будущем'],
        correctAnswer: 'Действие, начавшееся в прошлом и продолжающееся сейчас'
      },
      {
        question: 'Выберите правильное условное предложение III типа: "If I ___ you, I would have studied harder."',
        options: ['am', 'were', 'had been'],
        correctAnswer: 'had been'
      },
      {
        question: 'Что такое пассивный залог?',
        options: ['Когда подлежащее совершает действие', 'Когда подлежащее является объектом действия', 'Когда действие происходит само'],
        correctAnswer: 'Когда подлежащее является объектом действия'
      },
      {
        question: 'Заполните пропуск: "She is used to ___ up early."',
        options: ['get', 'getting', 'got'],
        correctAnswer: 'getting'
      },
      {
        question: 'Что такое Reported Speech?',
        options: ['Прямая речь', 'Косвенная речь', 'Диалог'],
        correctAnswer: 'Косвенная речь'
      },
      {
        question: 'Выберите правильный вариант: "The book ___ written by my favorite author."',
        options: ['was', 'were', 'are'],
        correctAnswer: 'was'
      },
      {
        question: 'Что значит "would rather"?',
        options: ['Предпочитать', 'Желать', 'Нуждать'],
        correctAnswer: 'Предпочитать'
      }
    ]
  },

  // Арабский язык (courseId: 2)
  2: {
    // 1-4 класс
    1: [
      {
        question: 'Как называется арабский алфавит?',
        options: ['Хиджаз', 'Алифба', 'Алям'],
        correctAnswer: 'Алифба'
      },
      {
        question: 'Сколько букв в арабском алфавите?',
        options: ['24', '28', '32'],
        correctAnswer: '28'
      },
      {
        question: 'Как называется арабская вязь?',
        options: ['Рика', 'Насх', 'Куфи'],
        correctAnswer: 'Насх'
      },
      {
        question: 'Как называется первая буква арабского алфавита?',
        options: ['Ба', 'Алиф', 'Та'],
        correctAnswer: 'Алиф'
      },
      {
        question: 'В каком направлении пишется арабский текст?',
        options: ['Слева направо', 'Справа налево', 'Сверху вниз'],
        correctAnswer: 'Справа налево'
      },
      {
        question: 'Что означает буква "Ба"?',
        options: ['А', 'Б', 'В'],
        correctAnswer: 'Б'
      },
      {
        question: 'Как называются диакритические знаки в арабском?',
        options: ['Харакат', 'Хурф', 'Хадис'],
        correctAnswer: 'Харакат'
      },
      {
        question: 'Сколько гласных звуков в арабском языке?',
        options: ['2', '3', '6'],
        correctAnswer: '3'
      }
    ],
    // 5-8 класс
    5: [
      {
        question: 'В каком направлении пишется арабский текст?',
        options: ['Слева направо', 'Справа налево', 'Сверху вниз'],
        correctAnswer: 'Справа налево'
      },
      {
        question: 'Что означает буква "Алиф"?',
        options: ['Б', 'А', 'В'],
        correctAnswer: 'А'
      },
      {
        question: 'Как называется краткий гласный звук в арабском?',
        options: ['Харф', 'Харакат', 'Хадис'],
        correctAnswer: 'Харакат'
      },
      {
        question: 'Что такое "танвин" в арабском языке?',
        options: ['Гласный звук', 'Двойной огласовка', 'Согласный звук'],
        correctAnswer: 'Двойной огласовка'
      },
      {
        question: 'Как называется арабская грамматика?',
        options: ['Балага', 'Нахв', 'Сарф'],
        correctAnswer: 'Сарф'
      },
      {
        question: 'Что такое "идафа" в арабском?',
        options: ['Предложение', 'Связь слов', 'Глагол'],
        correctAnswer: 'Связь слов'
      },
      {
        question: 'Как называются арабские частицы?',
        options: ['Хурф', 'Калимат', 'Джумла'],
        correctAnswer: 'Хурф'
      },
      {
        question: 'Что такое "мада" в арабском языке?',
        options: ['Настоящее время', 'Прошедшее время', 'Будущее время'],
        correctAnswer: 'Прошедшее время'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Что такое "идафа" в арабском языке?',
        options: ['Предложение', 'Связь слов', 'Глагол'],
        correctAnswer: 'Связь слов'
      },
      {
        question: 'Как называется арабская грамматика?',
        options: ['Балага', 'Нахв', 'Сарф'],
        correctAnswer: 'Сарф'
      },
      {
        question: 'Что изучает "балага"?',
        options: ['Стилистика', 'Фонетика', 'Морфология'],
        correctAnswer: 'Стилистика'
      },
      {
        question: 'Что такое "муаннас" в арабском?',
        options: ['Мужской род', 'Женский род', 'Средний род'],
        correctAnswer: 'Женский род'
      },
      {
        question: 'Как называется арабская риторика?',
        options: ['Сарф', 'Нахв', 'Балага'],
        correctAnswer: 'Балага'
      },
      {
        question: 'Что такое "джумла" в арабском?',
        options: ['Слово', 'Предложение', 'Часть речи'],
        correctAnswer: 'Предложение'
      },
      {
        question: 'Как называется арабский словарь?',
        options: ['Муфрад', 'Муфрадат', 'Камус'],
        correctAnswer: 'Камус'
      },
      {
        question: 'Что такое "шадда" в арабском письме?',
        options: ['Удвоение согласного', 'Гласный знак', 'Диакритический знак'],
        correctAnswer: 'Удвоение согласного'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'Что такое "идафа" в арабском языке?',
        options: ['Предложение', 'Связь слов', 'Глагол'],
        correctAnswer: 'Связь слов'
      },
      {
        question: 'Как называется арабская грамматика?',
        options: ['Балага', 'Нахв', 'Сарф'],
        correctAnswer: 'Сарф'
      },
      {
        question: 'Что изучает "балага"?',
        options: ['Стилистика', 'Фонетика', 'Морфология'],
        correctAnswer: 'Стилистика'
      },
      {
        question: 'Что такое "муаннас" в арабском?',
        options: ['Мужской род', 'Женский род', 'Средний род'],
        correctAnswer: 'Женский род'
      },
      {
        question: 'Как называется арабская риторика?',
        options: ['Сарф', 'Нахв', 'Балага'],
        correctAnswer: 'Балага'
      },
      {
        question: 'Что такое "джумла" в арабском?',
        options: ['Слово', 'Предложение', 'Часть речи'],
        correctAnswer: 'Предложение'
      },
      {
        question: 'Что такое "харакат" в арабском письме?',
        options: ['Гласные буквы', 'Диакритические знаки', 'Согласные буквы'],
        correctAnswer: 'Диакритические знаки'
      },
      {
        question: 'Какое направление письма используется в арабском?',
        options: ['Слева направо', 'Справа налево', 'Сверху вниз'],
        correctAnswer: 'Справа налево'
      }
    ]
  },

  // Математика (courseId: 4)
  4: {
    // 1-4 класс
    1: [
      {
        question: 'Что такое сумма?',
        options: ['Разность', 'Результат сложения', 'Результат умножения'],
        correctAnswer: 'Результат сложения'
      },
      {
        question: 'Сколько будет 2 + 3?',
        options: ['4', '5', '6'],
        correctAnswer: '5'
      },
      {
        question: 'Что больше: 7 или 5?',
        options: ['5', '7', 'Одинаково'],
        correctAnswer: '7'
      },
      {
        question: 'Сколько будет 10 - 4?',
        options: ['5', '6', '7'],
        correctAnswer: '6'
      },
      {
        question: 'Что такое произведение?',
        options: ['Результат сложения', 'Результат вычитания', 'Результат умножения'],
        correctAnswer: 'Результат умножения'
      },
      {
        question: 'Сколько будет 3 × 2?',
        options: ['5', '6', '7'],
        correctAnswer: '6'
      },
      {
        question: 'Что такое круг?',
        options: ['Фигура с углами', 'Замкнутая кривая', 'Прямая линия'],
        correctAnswer: 'Замкнутая кривая'
      },
      {
        question: 'Сколько сторон у квадрата?',
        options: ['3', '4', '5'],
        correctAnswer: '4'
      }
    ],
    // 5-8 класс
    5: [
      {
        question: 'Что такое дробь?',
        options: ['Целое число', 'Часть целого', 'Результат деления'],
        correctAnswer: 'Часть целого'
      },
      {
        question: 'Как найти площадь прямоугольника?',
        options: ['a × b', 'a + b', 'a - b'],
        correctAnswer: 'a × b'
      },
      {
        question: 'Что такое проценты?',
        options: ['Доли от 10', 'Доли от 100', 'Доли от 1000'],
        correctAnswer: 'Доли от 100'
      },
      {
        question: 'Что такое уравнение?',
        options: ['Выражение с переменной', 'Равенство с переменной', 'Неравенство'],
        correctAnswer: 'Равенство с переменной'
      },
      {
        question: 'Как найти периметр квадрата?',
        options: ['a × a', 'a + a + a + a', 'a × 2'],
        correctAnswer: 'a + a + a + a'
      },
      {
        question: 'Что такое среднее арифметическое?',
        options: ['Наибольшее число', 'Сумма делённая на количество', 'Наименьшее число'],
        correctAnswer: 'Сумма делённая на количество'
      },
      {
        question: 'Как сократить дробь 6/9?',
        options: ['2/3', '1/3', '3/6'],
        correctAnswer: '2/3'
      },
      {
        question: 'Что такое параллелограмм?',
        options: ['Фигура с четырьмя равными сторонами', 'Четырёхугольник с параллельными сторонами', 'Треугольник'],
        correctAnswer: 'Четырёхугольник с параллельными сторонами'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Что такое производная?',
        options: ['Результат умножения', 'Скорость изменения функции', 'Результат деления'],
        correctAnswer: 'Скорость изменения функции'
      },
      {
        question: 'Какое уравнение описывает прямую?',
        options: ['x² + y² = r²', 'y = kx + b', '(x-a)² + (y-b)² = r²'],
        correctAnswer: 'y = kx + b'
      },
      {
        question: 'Что такое интеграл?',
        options: ['Результат вычитания', 'Площадь под кривой', 'Результат сложения'],
        correctAnswer: 'Площадь под кривой'
      },
      {
        question: 'Что такое теорема Пифагора?',
        options: ['a² + b² = c²', 'a + b = c', 'a × b = c²'],
        correctAnswer: 'a² + b² = c²'
      },
      {
        question: 'Что такое логарифм?',
        options: ['Результат умножения', 'Показатель степени', 'Результат деления'],
        correctAnswer: 'Показатель степени'
      },
      {
        question: 'Какое уравнение описывает окружность?',
        options: ['y = kx + b', 'x² + y² = r²', 'ax + by + c = 0'],
        correctAnswer: 'x² + y² = r²'
      },
      {
        question: 'Что такое тригонометрия?',
        options: ['Изучение треугольников', 'Изучение углов и их функций', 'Изучение прямых'],
        correctAnswer: 'Изучение углов и их функций'
      },
      {
        question: 'Что такое предел функции?',
        options: ['Значение функции в точке', 'Значение, к которому стремится функция', 'Производная функции'],
        correctAnswer: 'Значение, к которому стремится функция'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'Что такое производная?',
        options: ['Результат умножения', 'Скорость изменения функции', 'Результат деления'],
        correctAnswer: 'Скорость изменения функции'
      },
      {
        question: 'Какое уравнение описывает прямую?',
        options: ['x² + y² = r²', 'y = kx + b', '(x-a)² + (y-b)² = r²'],
        correctAnswer: 'y = kx + b'
      },
      {
        question: 'Что такое интеграл?',
        options: ['Результат вычитания', 'Площадь под кривой', 'Результат сложения'],
        correctAnswer: 'Площадь под кривой'
      },
      {
        question: 'Что такое теорема Пифагора?',
        options: ['a² + b² = c²', 'a + b = c', 'a × b = c²'],
        correctAnswer: 'a² + b² = c²'
      },
      {
        question: 'Что такое логарифм?',
        options: ['Результат умножения', 'Показатель степени', 'Результат деления'],
        correctAnswer: 'Показатель степени'
      },
      {
        question: 'Какое уравнение описывает окружность?',
        options: ['y = kx + b', 'x² + y² = r²', 'ax + by + c = 0'],
        correctAnswer: 'x² + y² = r²'
      },
      {
        question: 'Что такое дифференциал?',
        options: ['Малое приращение аргумента', 'Производная функции', 'Интеграл функции'],
        correctAnswer: 'Малое приращение аргумента'
      },
      {
        question: 'Что такое вектор?',
        options: ['Величина без направления', 'Величина с направлением', 'Только число'],
        correctAnswer: 'Величина с направлением'
      }
    ]
  },

  // Физика (courseId: 5)
  5: {
    // 7-8 класс
    7: [
      {
        question: 'Что такое сила?',
        options: ['Скорость движения', 'Действие на тело', 'Масса тела'],
        correctAnswer: 'Действие на тело'
      },
      {
        question: 'Какая формула описывает второй закон Ньютона?',
        options: ['E = mc²', 'F = ma', 'P = mv'],
        correctAnswer: 'F = ma'
      },
      {
        question: 'Что такое энергия?',
        options: ['Скорость света', 'Способность совершать работу', 'Масса покоя'],
        correctAnswer: 'Способность совершать работу'
      },
      {
        question: 'Что такое масса?',
        options: ['Скорость движения', 'Количество вещества', 'Действие на тело'],
        correctAnswer: 'Количество вещества'
      },
      {
        question: 'Что такое давление?',
        options: ['Сила на единицу площади', 'Объём вещества', 'Температура тела'],
        correctAnswer: 'Сила на единицу площади'
      },
      {
        question: 'Как рассчитывается плотность?',
        options: ['m/V', 'm × V', 'V/m'],
        correctAnswer: 'm/V'
      },
      {
        question: 'Что такое теплопроводность?',
        options: ['Способность проводить электричество', 'Способность проводить тепло', 'Способность отражать свет'],
        correctAnswer: 'Способность проводить тепло'
      },
      {
        question: 'Что такое звук?',
        options: ['Электромагнитная волна', 'Механическая волна', 'Световая волна'],
        correctAnswer: 'Механическая волна'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Как называется волна, требующая среды?',
        options: ['Электромагнитная', 'Механическая', 'Гравитационная'],
        correctAnswer: 'Механическая'
      },
      {
        question: 'Что такое электрический ток?',
        options: ['Движение электронов', 'Движение протонов', 'Движение нейтронов'],
        correctAnswer: 'Движение электронов'
      },
      {
        question: 'Какова скорость света?',
        options: ['300 000 км/с', '300 км/с', '300 000 м/с'],
        correctAnswer: '300 000 км/с'
      },
      {
        question: 'Что такое атом?',
        options: ['Крупица вещества', 'Мельчайшая частица химического элемента', 'Молекула вещества'],
        correctAnswer: 'Мельчайшая частица химического элемента'
      },
      {
        question: 'Что такое магнитное поле?',
        options: ['Поле электрических зарядов', 'Поле магнитных сил', 'Поле гравитационных сил'],
        correctAnswer: 'Поле магнитных сил'
      },
      {
        question: 'Что такое ядерная реакция?',
        options: ['Химическая реакция', 'Реакция с участием атомных ядер', 'Реакция горения'],
        correctAnswer: 'Реакция с участием атомных ядер'
      },
      {
        question: 'Что такое квантовая механика?',
        options: ['Изучение больших объектов', 'Изучение микромира', 'Изучение космоса'],
        correctAnswer: 'Изучение микромира'
      },
      {
        question: 'Что такое относительность?',
        options: ['Теория Ньютона', 'Теория Эйнштейна', 'Теория Галилея'],
        correctAnswer: 'Теория Эйнштейна'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'Как называется волна, требующая среды?',
        options: ['Электромагнитная', 'Механическая', 'Гравитационная'],
        correctAnswer: 'Механическая'
      },
      {
        question: 'Что такое электрический ток?',
        options: ['Движение электронов', 'Движение протонов', 'Движение нейтронов'],
        correctAnswer: 'Движение электронов'
      },
      {
        question: 'Какова скорость света?',
        options: ['300 000 км/с', '300 км/с', '300 000 м/с'],
        correctAnswer: '300 000 км/с'
      },
      {
        question: 'Что такое атом?',
        options: ['Крупица вещества', 'Мельчайшая частица химического элемента', 'Молекула вещества'],
        correctAnswer: 'Мельчайшая частица химического элемента'
      },
      {
        question: 'Что такое магнитное поле?',
        options: ['Поле электрических зарядов', 'Поле магнитных сил', 'Поле гравитационных сил'],
        correctAnswer: 'Поле магнитных сил'
      },
      {
        question: 'Что такое ядерная реакция?',
        options: ['Химическая реакция', 'Реакция с участием атомных ядер', 'Реакция горения'],
        correctAnswer: 'Реакция с участием атомных ядер'
      },
      {
        question: 'Что такое квантовая механика?',
        options: ['Изучение больших объектов', 'Изучение микромира', 'Изучение звезд'],
        correctAnswer: 'Изучение микромира'
      },
      {
        question: 'Что такое термодинамика?',
        options: ['Изучение электричества', 'Изучение тепловых явлений', 'Изучение света'],
        correctAnswer: 'Изучение тепловых явлений'
      }
    ]
  },

  // География (courseId: 6)
  6: {
    // 5-8 класс
    5: [
      {
        question: 'Что изучает физическая география?',
        options: ['Население Земли', 'Природные явления', 'Политическое устройство'],
        correctAnswer: 'Природные явления'
      },
      {
        question: 'Как называется самая высокая точка Земли?',
        options: ['Эльбрус', 'Эверест', 'Килиманджаро'],
        correctAnswer: 'Эверест'
      },
      {
        question: 'Что такое климат?',
        options: ['Кратковременная погода', 'Долговременная погода', 'Температура воздуха'],
        correctAnswer: 'Долговременная погода'
      },
      {
        question: 'Что такое материк?',
        options: ['Большой остров', 'Большая часть суши', 'Горная система'],
        correctAnswer: 'Большая часть суши'
      },
      {
        question: 'Сколько океанов на Земле?',
        options: ['3', '4', '5'],
        correctAnswer: '4'
      },
      {
        question: 'Что такое экватор?',
        options: ['Параллель на карте', 'Линия, делящая Землю на полушария', 'Меридиан'],
        correctAnswer: 'Линия, делящая Землю на полушария'
      },
      {
        question: 'Что такое рельеф?',
        options: ['Форма поверхности Земли', 'Цвет почвы', 'Количество осадков'],
        correctAnswer: 'Форма поверхности Земли'
      },
      {
        question: 'Что такое почва?',
        options: ['Камень', 'Поверхностный слой Земли', 'Вода'],
        correctAnswer: 'Поверхностный слой Земли'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Какой океан самый большой?',
        options: ['Атлантический', 'Индийский', 'Тихий'],
        correctAnswer: 'Тихий'
      },
      {
        question: 'Что такое глобализация?',
        options: ['Изоляция стран', 'Сближение стран мира', 'Разделение континентов'],
        correctAnswer: 'Сближение стран мира'
      },
      {
        question: 'Какой материк самый большой?',
        options: ['Африка', 'Азия', 'Америка'],
        correctAnswer: 'Азия'
      },
      {
        question: 'Что такое урбанизация?',
        options: ['Рост сельского населения', 'Рост городского населения', 'Снижение населения'],
        correctAnswer: 'Рост городского населения'
      },
      {
        question: 'Что такое миграция?',
        options: ['Движение населения', 'Рост населения', 'Снижение населения'],
        correctAnswer: 'Движение населения'
      },
      {
        question: 'Что такое экология?',
        options: ['Изучение экономики', 'Изучение окружающей среды', 'Изучение экосистем'],
        correctAnswer: 'Изучение окружающей среды'
      },
      {
        question: 'Что такое демография?',
        options: ['Изучение демонов', 'Изучение населения', 'Изучение демографии'],
        correctAnswer: 'Изучение населения'
      },
      {
        question: 'Что такое геополитика?',
        options: ['Изучение политики Земли', 'Влияние географии на политику', 'Изучение геологии'],
        correctAnswer: 'Влияние географии на политику'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'Какой океан самый большой?',
        options: ['Атлантический', 'Индийский', 'Тихий'],
        correctAnswer: 'Тихий'
      },
      {
        question: 'Что такое глобализация?',
        options: ['Изоляция стран', 'Сближение стран мира', 'Разделение континентов'],
        correctAnswer: 'Сближение стран мира'
      },
      {
        question: 'Какой материк самый большой?',
        options: ['Африка', 'Азия', 'Америка'],
        correctAnswer: 'Азия'
      },
      {
        question: 'Что такое урбанизация?',
        options: ['Рост сельского населения', 'Рост городского населения', 'Снижение населения'],
        correctAnswer: 'Рост городского населения'
      },
      {
        question: 'Что такое миграция?',
        options: ['Движение населения', 'Рост населения', 'Снижение населения'],
        correctAnswer: 'Движение населения'
      },
      {
        question: 'Что такое экология?',
        options: ['Изучение экономики', 'Изучение окружающей среды', 'Изучение экосистем'],
        correctAnswer: 'Изучение окружающей среды'
      },
      {
        question: 'Что такое демография?',
        options: ['Изучение климата', 'Изучение населения', 'Изучение рельефа'],
        correctAnswer: 'Изучение населения'
      },
      {
        question: 'Что такое география?',
        options: ['Наука о Земле и её обитателях', 'Наука о прошлом', 'Наука о звёздах'],
        correctAnswer: 'Наука о Земле и её обитателях'
      }
    ]
  },

  // История (courseId: 7)
  7: {
    // 5-8 класс
    5: [
      {
        question: 'В каком году произошла Октябрьская революция?',
        options: ['1914', '1917', '1922'],
        correctAnswer: '1917'
      },
      {
        question: 'Кто был первым президентом США?',
        options: ['Авраам Линкольн', 'Джордж Вашингтон', 'Томас Джефферсон'],
        correctAnswer: 'Джордж Вашингтон'
      },
      {
        question: 'Что такое феодализм?',
        options: ['Форма правления', 'Система землевладения', 'Тип экономики'],
        correctAnswer: 'Система землевладения'
      },
      {
        question: 'Когда началась Великая Отечественная война?',
        options: ['1939', '1941', '1945'],
        correctAnswer: '1941'
      },
      {
        question: 'Что такое Ренессанс?',
        options: ['Средние века', 'Эпоха Возрождения', 'Новое время'],
        correctAnswer: 'Эпоха Возрождения'
      },
      {
        question: 'Кто открыл Америку?',
        options: ['Колумб', 'Магеллан', 'Васко да Гама'],
        correctAnswer: 'Колумб'
      },
      {
        question: 'Что такое Древний Рим?',
        options: ['Государство', 'Империя', 'Город'],
        correctAnswer: 'Империя'
      },
      {
        question: 'Когда произошла Французская революция?',
        options: ['1789', '1799', '1804'],
        correctAnswer: '1789'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'В каком веке произошла Французская революция?',
        options: ['XVII', 'XVIII', 'XIX'],
        correctAnswer: 'XVIII'
      },
      {
        question: 'Что такое индустриализация?',
        options: ['Переход к сельскому хозяйству', 'Переход к промышленности', 'Переход к торговле'],
        correctAnswer: 'Переход к промышленности'
      },
      {
        question: 'Как называется период после Второй мировой войны?',
        options: ['Холодная война', 'Новейшая история', 'Средние века'],
        correctAnswer: 'Холодная война'
      },
      {
        question: 'Что такое колониализм?',
        options: ['Завоевание территорий', 'Международная торговля', 'Политический союз'],
        correctAnswer: 'Завоевание территорий'
      },
      {
        question: 'Когда произошла Первая мировая война?',
        options: ['1914-1918', '1939-1945', '1812-1814'],
        correctAnswer: '1914-1918'
      },
      {
        question: 'Что такое тоталитаризм?',
        options: ['Демократия', 'Авторитарная власть', 'Монархия'],
        correctAnswer: 'Авторитарная власть'
      },
      {
        question: 'Что такое гражданская война?',
        options: ['Война между странами', 'Война внутри страны', 'Международный конфликт'],
        correctAnswer: 'Война внутри страны'
      },
      {
        question: 'Что такое империализм?',
        options: ['Изоляция страны', 'Расширение влияния', 'Мирное сосуществование'],
        correctAnswer: 'Расширение влияния'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'В каком веке произошла Французская революция?',
        options: ['XVII', 'XVIII', 'XIX'],
        correctAnswer: 'XVIII'
      },
      {
        question: 'Что такое индустриализация?',
        options: ['Переход к сельскому хозяйству', 'Переход к промышленности', 'Переход к торговле'],
        correctAnswer: 'Переход к промышленности'
      },
      {
        question: 'Как называется период после Второй мировой войны?',
        options: ['Холодная война', 'Новейшая история', 'Средние века'],
        correctAnswer: 'Холодная война'
      },
      {
        question: 'Что такое колониализм?',
        options: ['Завоевание территорий', 'Международная торговля', 'Политический союз'],
        correctAnswer: 'Завоевание территорий'
      },
      {
        question: 'Когда произошла Первая мировая война?',
        options: ['1914-1918', '1939-1945', '1812-1814'],
        correctAnswer: '1914-1918'
      },
      {
        question: 'Что такое тоталитаризм?',
        options: ['Демократия', 'Авторитарная власть', 'Монархия'],
        correctAnswer: 'Авторитарная власть'
      },
      {
        question: 'Что такое Ренессанс?',
        options: ['Эпоха Возрождения', 'Эпоха Просвещения', 'Эпоха Реформации'],
        correctAnswer: 'Эпоха Возрождения'
      },
      {
        question: 'Что такое феодализм?',
        options: ['Система рабовладения', 'Система вассалитета', 'Капиталистическая система'],
        correctAnswer: 'Система вассалитета'
      }
    ]
  },

  // Обществознание (courseId: 8)
  8: {
    // 5-8 класс
    5: [
      {
        question: 'Что такое демократия?',
        options: ['Власть одного человека', 'Власть народа', 'Власть армии'],
        correctAnswer: 'Власть народа'
      },
      {
        question: 'Какая ветвь власти отвечает за исполнение законов?',
        options: ['Законодательная', 'Судебная', 'Исполнительная'],
        correctAnswer: 'Исполнительная'
      },
      {
        question: 'Что такое конституция?',
        options: ['Президентский указ', 'Основной закон страны', 'Парламентский акт'],
        correctAnswer: 'Основной закон страны'
      },
      {
        question: 'Что такое права человека?',
        options: ['Обязанности гражданина', 'Свободы и гарантии личности', 'Законы государства'],
        correctAnswer: 'Свободы и гарантии личности'
      },
      {
        question: 'Что такое общество?',
        options: ['Группа людей', 'Совокупность людей, объединённых общими интересами', 'Государство'],
        correctAnswer: 'Совокупность людей, объединённых общими интересами'
      },
      {
        question: 'Что такое мораль?',
        options: ['Законы государства', 'Нормы поведения', 'Экономические отношения'],
        correctAnswer: 'Нормы поведения'
      },
      {
        question: 'Что такое культура?',
        options: ['Природная среда', 'Совокупность достижений человечества', 'Политическая система'],
        correctAnswer: 'Совокупность достижений человечества'
      },
      {
        question: 'Что такое семья?',
        options: ['Группа родственников', 'Основная ячейка общества', 'Школьный класс'],
        correctAnswer: 'Основная ячейка общества'
      }
    ],
    // 9-11 класс
    9: [
      {
        question: 'Какой орган принимает законы в России?',
        options: ['Совет Федерации', 'Президент', 'Государственная Дума'],
        correctAnswer: 'Государственная Дума'
      },
      {
        question: 'Что такое гражданское общество?',
        options: ['Государство', 'Совокупность негосударственных объединений', 'Политическая партия'],
        correctAnswer: 'Совокупность негосударственных объединений'
      },
      {
        question: 'Что такое права человека?',
        options: ['Обязанности гражданина', 'Основные свободы личности', 'Законы государства'],
        correctAnswer: 'Основные свободы личности'
      },
      {
        question: 'Что такое политическая система?',
        options: ['Экономическая структура', 'Совокупность государственных органов', 'Культурные традиции'],
        correctAnswer: 'Совокупность государственных органов'
      },
      {
        question: 'Что такое федерация?',
        options: ['Унитарное государство', 'Союз государств', 'Монархия'],
        correctAnswer: 'Союз государств'
      },
      {
        question: 'Что такое экономика?',
        options: ['Политическая система', 'Хозяйственная деятельность общества', 'Культурная сфера'],
        correctAnswer: 'Хозяйственная деятельность общества'
      },
      {
        question: 'Что такое рынок?',
        options: ['Государственное планирование', 'Сфера обмена товарами', 'Природные ресурсы'],
        correctAnswer: 'Сфера обмена товарами'
      },
      {
        question: 'Что такое глобализация?',
        options: ['Изоляция стран', 'Мировые интеграционные процессы', 'Региональные конфликты'],
        correctAnswer: 'Мировые интеграционные процессы'
      }
    ],
    // ЕГЭ уровень (grade: 100)
    100: [
      {
        question: 'В каком органе принимаются законы в России?',
        options: ['Совет Федерации', 'Президент', 'Государственная Дума'],
        correctAnswer: 'Государственная Дума'
      },
      {
        question: 'Что такое гражданское общество?',
        options: ['Государство', 'Совокупность негосударственных объединений', 'Политическая партия'],
        correctAnswer: 'Совокупность негосударственных объединений'
      },
      {
        question: 'Какие права относятся к политическим?',
        options: ['Право на жизнь', 'Право на образование', 'Право на участие в выборах'],
        correctAnswer: 'Право на участие в выборах'
      },
      {
        question: 'Что такое демократия?',
        options: ['Власть одного человека', 'Власть большинства', 'Власть меньшинства'],
        correctAnswer: 'Власть большинства'
      },
      {
        question: 'Что такое конституция?',
        options: ['Основной закон государства', 'Международный договор', 'Судебное решение'],
        correctAnswer: 'Основной закон государства'
      },
      {
        question: 'Какая форма правления в России?',
        options: ['Монархия', 'Республика', 'Теократия'],
        correctAnswer: 'Республика'
      },
      {
        question: 'Что такое федерация?',
        options: ['Унитарное государство', 'Союз государств', 'Международная организация'],
        correctAnswer: 'Союз государств'
      },
      {
        question: 'Что такое социальное государство?',
        options: ['Государство с рыночной экономикой', 'Государство заботящееся о гражданах', 'Военное государство'],
        correctAnswer: 'Государство заботящееся о гражданах'
      }
    ]
  }
};
