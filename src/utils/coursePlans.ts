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
    grade: 1,
    title: "Русский язык для 1 класса",
    description: "Базовый курс русского языка для первоклассников с акцентом на развитие грамотности, изучение букв и простых текстов.",
    lessons: [
      {
        number: 1,
        title: "Здравствуй, Русский!",
        topic: "Знакомство с предметом",
        aspects: "Лексика: здравствуйте, спасибо, пожалуйста, русский, учитель, ученик. Фразы: Здравствуйте! / Спасибо! / Пожалуйста!; Меня зовут __. Алфавит: знакомство с буквами А, О, У. Навыки: приветствие, представление себя. Игра на запоминание имен.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 2,
        title: "Приветствия и вежливость",
        topic: "Вежливые слова и фразы",
        aspects: "Лексика: добрый день, до свидания, извините, пожалуйста. Фразы: Добрый день! / До свидания!; Спасибо большое!; Извините, пожалуйста. Навыки: этикет общения, вежливые просьбы.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 3,
        title: "Моя семья",
        topic: "Семья и родственники",
        aspects: "Лексика: мама, папа, брат, сестра, бабушка, дедушка. Фразы: Это моя мама; У меня есть брат. Навыки: описание семьи, вопросы о семье.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 4,
        title: "Цвета вокруг нас",
        topic: "Цвета и их названия",
        aspects: "Лексика: красный, синий, зелёный, жёлтый, белый, чёрный. Фразы: Какой цвет?; Это красный мяч. Навыки: называние цветов, описание предметов по цвету.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 5,
        title: "В школе",
        topic: "Школьная жизнь",
        aspects: "Лексика: школа, класс, урок, учитель, учебник, тетрадь. Фразы: Я иду в школу; У меня урок математики. Навыки: рассказ о школьном дне.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 6,
        title: "Животные",
        topic: "Домашние и дикие животные",
        aspects: "Лексика: кошка, собака, корова, лошадь, птица, рыба. Фразы: У меня есть кошка; Это большая собака. Навыки: описание животных, вопросы о животных.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 7,
        title: "Еда и напитки",
        topic: "Питание",
        aspects: "Лексика: хлеб, молоко, яблоко, мясо, вода, сок. Фразы: Я люблю яблоки; Дай мне воды, пожалуйста. Навыки: заказ еды, описание предпочтений в еде.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 8,
        title: "Игрушки",
        topic: "Игры и развлечения",
        aspects: "Лексика: мяч, кукла, машина, кубики, мячик. Фразы: У меня есть мяч; Давай поиграем в кубики. Навыки: описание игрушек, приглашение к игре.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 9,
        title: "Времена года",
        topic: "Сезоны и погода",
        aspects: "Лексика: зима, весна, лето, осень, снег, дождь. Фразы: Сейчас зима; Идёт снег. Навыки: описание погоды, вопросы о сезонах.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 10,
        title: "Транспорт",
        topic: "Средства передвижения",
        aspects: "Лексика: машина, автобус, поезд, самолёт, велосипед. Фразы: Я еду на автобусе; Самолёт летит высоко. Навыки: описание транспорта, вопросы о передвижении.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 11,
        title: "Мои друзья",
        topic: "Друзья и знакомые",
        aspects: "Лексика: друг, подруга, мальчик, девочка, вместе. Фразы: Это мой друг; Мы играем вместе. Навыки: описание друзей, вопросы о знакомых.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 12,
        title: "Здоровье и тело",
        topic: "Части тела и здоровье",
        aspects: "Лексика: голова, рука, нога, глаз, ухо, нос. Фразы: У меня болит голова; Мои руки чистые. Навыки: описание тела, вопросы о самочувствии.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 13,
        title: "Технологии",
        topic: "Современные устройства",
        aspects: "Лексика: компьютер, телефон, телевизор, интернет. Фразы: Я играю на компьютере; Звоню по телефону. Навыки: описание устройств, вопросы о технологиях.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 14,
        title: "Сравнения и описания",
        topic: "Сравнение предметов",
        aspects: "Лексика: большой-маленький, высокий-низкий, быстрый-медленный. Фразы: Этот дом большой; Машина едет быстро. Навыки: сравнение предметов, описание характеристик.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 15,
        title: "Прошедшие события",
        topic: "Прошлое время",
        aspects: "Лексика: вчера, был, была, ходил, читал, играл. Фразы: Вчера я ходил в школу; Я читал книгу. Навыки: рассказ о прошедших событиях.",
        modules: [],
        difficulty: 'beginner'
      },
      {
        number: 16,
        title: "Все темы помню плохо",
        topic: "Повторение материала",
        aspects: "Лексика: повторение всех изученных тем. Фразы: Давай повторим; Я помню немного. Навыки: закрепление изученного материала.",
        modules: [],
        difficulty: 'beginner'
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
