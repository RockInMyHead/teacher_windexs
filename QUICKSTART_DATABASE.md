# ⚡ Quick Start Guide - Database Migration

## 🎯 Цель
Перенести все данные из localStorage в профессиональную PostgreSQL базу данных.

---

## 📋 Предварительные требования

- ✅ PostgreSQL 15+ установлен
- ✅ Node.js 18+ установлен
- ✅ Проект teacher_windexs

---

## 🚀 Установка за 5 минут

### Шаг 1: Установите PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows (Docker):**
```bash
docker run --name teacher-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

---

### Шаг 2: Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# В psql консоли:
CREATE DATABASE teacher_platform;
\q

# Примените схему и начальные данные
cd /Users/artembutko/Desktop/teacher_windexs
psql -U postgres -d teacher_platform -f database/schema.sql
psql -U postgres -d teacher_platform -f database/init.sql
```

**Должны увидеть**: CREATE TABLE, CREATE INDEX, INSERT сообщения

---

### Шаг 3: Настройте .env файл

```bash
# Скопируйте пример
cp ENV_EXAMPLE.txt .env

# Отредактируйте .env (используйте nano, vim или любой редактор)
nano .env
```

**Минимальные настройки:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_platform
DB_USER=postgres
DB_PASSWORD=postgres
API_PORT=3001
VITE_API_URL=http://localhost:3001/api
```

Сохраните файл (Ctrl+O, Enter, Ctrl+X в nano)

---

### Шаг 4: Установите зависимости сервера

```bash
cd server
npm install
```

**Установятся пакеты:**
- express (веб-сервер)
- pg (PostgreSQL клиент)
- cors (кросс-доменные запросы)
- bcrypt (хэширование паролей)
- dotenv (переменные окружения)

---

### Шаг 5: Запустите сервер

```bash
# Development mode (с автоперезагрузкой)
npm run dev

# ИЛИ Production mode
npm start
```

**Должны увидеть:**
```
✅ Database connected successfully at: 2025-11-24 ...
🚀 Server running on port 3001
🔗 API available at http://localhost:3001
💚 Health check: http://localhost:3001/health
```

---

### Шаг 6: Проверьте работу API

**В новом терминале:**
```bash
# Проверка здоровья сервера
curl http://localhost:3001/health

# Должны получить:
# {"status":"OK","timestamp":"2025-11-24T..."}

# Проверка курсов
curl http://localhost:3001/api/courses

# Должны получить список курсов
```

---

### Шаг 7: Запустите фронтенд

**В новом терминале:**
```bash
cd /Users/artembutko/Desktop/teacher_windexs
npm run start:single-port
```

---

### Шаг 8: Миграция данных (автоматически!)

1. Откройте приложение в браузере: http://localhost:1031
2. Войдите в систему (или зарегистрируйтесь)
3. **Миграция запустится автоматически!**

В консоли браузера увидите:
```
🔄 Starting migration from localStorage to database...
📚 Migrating X exam courses...
✅ Migrated X exam courses
📖 Migrating X learning plans...
✅ Migrated X learning plans
💬 Migrating X chat messages...
✅ Migrated X messages to session xxx
✅ Migration completed
🧹 Clearing migrated localStorage data...
✅ Migration cleanup complete
```

---

## ✅ Готово!

Теперь у вас:
- ✅ Работающая PostgreSQL база данных
- ✅ API сервер на порту 3001
- ✅ Фронтенд на порту 1031
- ✅ Все данные мигрированы из localStorage
- ✅ Профессиональная архитектура

---

## 🔍 Проверка успешной миграции

### В браузере (DevTools Console):
```javascript
// Проверьте, что миграция завершена
localStorage.getItem('migrationCompleted')
// Должно быть: "true"

// Старые данные должны быть удалены
localStorage.getItem('examCourses')
// Должно быть: null
```

### В базе данных:
```bash
psql -U postgres -d teacher_platform

# В psql:
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM exam_courses;
SELECT COUNT(*) FROM chat_sessions;
SELECT COUNT(*) FROM chat_messages;
```

---

## 🛠️ Полезные команды

### Перезапустить сервер
```bash
cd /Users/artembutko/Desktop/teacher_windexs/server
npm run dev
```

### Пересоздать БД
```bash
npm run db:reset
```

### Просмотр логов сервера
```bash
# Логи выводятся в консоль где запущен сервер
# Каждый запрос будет показан
```

### Подключение к БД
```bash
psql -U postgres -d teacher_platform

# Полезные команды:
\dt              # Список таблиц
\d users         # Структура таблицы users
\q               # Выход
```

---

## 🐛 Troubleshooting

### Ошибка: "psql: command not found"
```bash
# macOS - добавьте в PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Ошибка: "Connection refused"
```bash
# Проверьте, запущен ли PostgreSQL
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Если не запущен:
brew services start postgresql@15  # macOS
sudo systemctl start postgresql  # Linux
```

### Ошибка: "database ... does not exist"
```bash
# Создайте БД заново
psql -U postgres -c "CREATE DATABASE teacher_platform;"
```

### Ошибка: "Port 3001 already in use"
```bash
# Найдите процесс
lsof -i :3001

# Завершите его
kill -9 <PID>
```

### Миграция не запускается
```javascript
// В консоли браузера
localStorage.removeItem('migrationCompleted');
location.reload();
// Миграция запустится снова
```

---

## 📚 Дополнительная документация

Подробная документация в файлах:

1. **DATABASE_SETUP.md** - Полное руководство по установке
2. **DATABASE_ARCHITECTURE.md** - Архитектура базы данных
3. **DATABASE_MIGRATION_SUMMARY.md** - Что было создано
4. **database/README.md** - Команды для работы с БД

---

## 🎉 Поздравляем!

Вы успешно мигрировали на профессиональную архитектуру!

### Что изменилось:
- ❌ localStorage (5-10 MB, локально, небезопасно)
- ✅ PostgreSQL (неограниченно, на сервере, безопасно)

### Теперь доступно:
- 📊 Аналитика и отчеты
- 🔄 Синхронизация между устройствами
- 👥 Многопользовательский режим
- 🔒 Безопасное хранение данных
- 📈 Масштабирование до миллионов пользователей

---

**Время выполнения**: ~5-10 минут

**Сложность**: ⭐⭐☆☆☆ (Легко)

**Made with ❤️ by Top 1% Developer**

