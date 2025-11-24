# 🗄️ Database Setup Guide

Полное руководство по настройке и миграции на PostgreSQL базу данных.

## 📋 Содержание

1. [Установка PostgreSQL](#установка-postgresql)
2. [Создание базы данных](#создание-базы-данных)
3. [Настройка окружения](#настройка-окружения)
4. [Запуск сервера](#запуск-сервера)
5. [Миграция данных](#миграция-данных)
6. [Архитектура БД](#архитектура-бд)

---

## 🔧 Установка PostgreSQL

### macOS
```bash
# Через Homebrew
brew install postgresql@15
brew services start postgresql@15

# Или через Postgres.app
# Скачайте с https://postgresapp.com/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
```bash
# Скачайте установщик с https://www.postgresql.org/download/windows/
# Или используйте через Docker (рекомендуется)
docker run --name teacher-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

---

## 🏗️ Создание базы данных

### 1. Подключитесь к PostgreSQL
```bash
# macOS/Linux
sudo -u postgres psql

# Windows (от имени пользователя postgres)
psql -U postgres
```

### 2. Создайте базу данных
```sql
CREATE DATABASE teacher_platform;
\c teacher_platform
```

### 3. Примените схему
```bash
# Из корня проекта
psql -U postgres -d teacher_platform -f database/schema.sql
```

### 4. Загрузите начальные данные
```bash
psql -U postgres -d teacher_platform -f database/init.sql
```

### Или используйте npm скрипты (после установки зависимостей):
```bash
cd server
npm install
npm run db:setup    # Создать таблицы и загрузить данные
npm run db:reset    # Полный сброс и пересоздание БД
```

---

## ⚙️ Настройка окружения

### 1. Скопируйте файл переменных окружения
```bash
cp ENV_EXAMPLE.txt .env
```

### 2. Отредактируйте .env файл
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_platform
DB_USER=postgres
DB_PASSWORD=your_password_here

# API Configuration
API_PORT=3001
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
```

### 3. Добавьте в vite.config.ts (если еще не добавлено)
```typescript
export default defineConfig({
  // ... existing config
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001/api')
  }
})
```

---

## 🚀 Запуск сервера

### 1. Установите зависимости сервера
```bash
cd server
npm install
```

### 2. Запустите сервер
```bash
# Production mode
npm start

# Development mode (с автоперезагрузкой)
npm run dev
```

Сервер будет доступен на `http://localhost:3001`

### 3. Проверьте работоспособность
```bash
curl http://localhost:3001/health
# Ответ: {"status":"OK","timestamp":"..."}
```

---

## 🔄 Миграция данных

### Автоматическая миграция

Миграция запускается автоматически при первом входе пользователя:

```typescript
import { autoMigrate } from './utils/migration';

// В AuthContext или при входе пользователя
const userId = user.id;
await autoMigrate(userId);
```

### Ручная миграция

Если нужно мигрировать данные вручную:

```typescript
import { migrateLocalStorageToDatabase, clearMigratedData } from './utils/migration';

const userId = 'user-id-here';
const result = await migrateLocalStorageToDatabase(userId);

if (result.success) {
  clearMigratedData();
  console.log('Migration successful:', result.migratedItems);
} else {
  console.error('Migration errors:', result.errors);
}
```

### Что мигрируется:

1. **Экзаменационные курсы** (`examCourses`)
2. **Планы обучения** (`userLearningPlans`)
3. **Сообщения чата** (`chatMessages`)
4. **Прогресс уроков** (автоматически при использовании)

---

## 🏛️ Архитектура БД

### Основные таблицы

#### 👤 Users & Authentication
- `users` - Пользователи системы
- `user_preferences` - Настройки пользователей

#### 📚 Courses & Curriculum
- `courses` - Каталог курсов
- `lessons` - Уроки курсов
- `user_courses` - Подписки пользователей на курсы
- `user_lessons` - Прогресс по урокам

#### 📖 Learning Plans
- `learning_plans` - AI-сгенерированные планы обучения

#### 💬 Chat & Messaging
- `chat_sessions` - Сессии чата
- `chat_messages` - Сообщения в чатах

#### 🎯 Exam Preparation
- `exam_courses` - Курсы подготовки к экзаменам (ЕГЭ/ОГЭ)

#### 🏆 Gamification
- `achievements` - Доступные достижения
- `user_achievements` - Разблокированные достижения

#### 📝 Homework
- `homework_submissions` - Сданные домашние задания

#### 📊 Analytics
- `user_activity_log` - Лог активности пользователей

### Связи между таблицами

```
users
 ├─ user_preferences (1:1)
 ├─ user_courses (1:N)
 │   └─ user_lessons (1:N)
 ├─ learning_plans (1:N)
 ├─ chat_sessions (1:N)
 │   └─ chat_messages (1:N)
 ├─ exam_courses (1:N)
 ├─ user_achievements (1:N)
 └─ user_activity_log (1:N)

courses
 ├─ lessons (1:N)
 ├─ user_courses (1:N)
 └─ learning_plans (1:N)
```

### Индексы и оптимизация

- **Primary Keys**: UUID для всех таблиц
- **Foreign Keys**: С CASCADE DELETE где необходимо
- **Indexes**: На всех часто запрашиваемых полях
- **JSONB Indexes**: GIN индексы для JSONB полей
- **Composite Indexes**: Для сложных запросов

### Triggers

- `update_updated_at_column()` - Автоматическое обновление поля `updated_at`

---

## 🧪 Тестирование API

### Примеры запросов

#### Регистрация пользователя
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "username": "student",
    "password": "password123",
    "fullName": "Student Name"
  }'
```

#### Получить курсы
```bash
curl http://localhost:3001/api/courses
```

#### Создать чат сессию
```bash
curl -X POST http://localhost:3001/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "courseId": "course-uuid-here",
    "sessionType": "interactive"
  }'
```

---

## 🔍 Полезные SQL команды

### Просмотр данных
```sql
-- Все пользователи
SELECT * FROM users;

-- Курсы с количеством уроков
SELECT c.*, COUNT(l.id) as lesson_count 
FROM courses c 
LEFT JOIN lessons l ON c.id = l.course_id 
GROUP BY c.id;

-- Активные чат-сессии
SELECT s.*, u.username, c.title 
FROM chat_sessions s
JOIN users u ON s.user_id = u.id
LEFT JOIN courses c ON s.course_id = c.id
WHERE s.ended_at IS NULL;
```

### Очистка данных
```sql
-- Удалить все чат-сессии пользователя
DELETE FROM chat_sessions WHERE user_id = 'user-uuid-here';

-- Очистить прогресс пользователя
DELETE FROM user_lessons WHERE user_id = 'user-uuid-here';
DELETE FROM user_courses WHERE user_id = 'user-uuid-here';
```

---

## 🛟 Troubleshooting

### Ошибка подключения к БД
```bash
# Проверьте статус PostgreSQL
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Проверьте, что БД существует
psql -U postgres -l

# Проверьте права доступа
psql -U postgres -c "SELECT current_user, current_database();"
```

### Ошибка "relation does not exist"
```bash
# Пересоздайте схему
npm run db:reset
```

### Проблемы с миграцией
```javascript
// Очистите флаг миграции
localStorage.removeItem('migrationCompleted');

// Запустите миграцию снова
await autoMigrate(userId);
```

---

## 📚 Дополнительные ресурсы

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg module](https://node-postgres.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 🎉 Готово!

После выполнения всех шагов у вас будет:

✅ Настроенная PostgreSQL база данных
✅ Работающий API сервер
✅ Автоматическая миграция из localStorage
✅ Профессиональная архитектура с правильными связями

Теперь приложение готово к масштабированию! 🚀

