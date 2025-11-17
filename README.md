# 🎯 Teacher App v1.0 - Single-Port Production

**Онлайн школа с персонализированным AI обучением английского языка**

[![Single-Port](https://img.shields.io/badge/Architecture-Single--Port-blue)](https://github.com/RockInMyHead/teacher_windexs)
[![Production Ready](https://img.shields.io/badge/Status-Production--Ready-green)](https://github.com/RockInMyHead/teacher_windexs)

## 🚀 Быстрый старт

### Локальный запуск
```bash
git clone https://github.com/RockInMyHead/teacher_windexs.git
cd teacher_windexs
npm install
npm run start:single-port
```

**Приложение будет доступно на:** `https://teacher.windexs.ru`

### ✨ Новое: Встроенная SQLite База Данных
Проект теперь включает **профессиональную SQLite базу данных** с 8 таблицами и REST API:

📚 **[Документация базы данных →](./README_DATABASE.md)**

**Быстрые ссылки:**
- [5-минутный старт](./QUICK_DB_START.md)
- [Полная документация API](./DATABASE_GUIDE.md)
- [Архитектура и дизайн](./DATABASE_IMPLEMENTATION_REPORT.md)
- [Навигация по документации](./DATABASE_INDEX.md)

### Production развертывание
```bash
# На сервере
git clone https://github.com/RockInMyHead/teacher_windexs.git
cd teacher_windexs
npm install

# Настроить .env файл
cp env.example .env
# Отредактируйте .env с вашими ключами

# Запуск
npm run start:single-port
```

## 🏗️ Архитектура

**Single-Port режим** - все на одном порту 1031:

```
Browser (HTTPS :443)
    ↓
Nginx (SSL)
    ↓ HTTP
Single-Port Server (:1031)
    ├── Frontend (Vite :1032 internal)
    ├── API Proxy (:1031)
    │   ├── /health ✅
    │   ├── /api/* ✅
    │   └── OpenAI API ✅
    └── WebSocket Support ✅
```

## 🎓 Функции

### 🤖 ИИ Возможности
- **ChatGPT интеграция** - умные разговоры
- **Text-to-Speech** - озвучивание текста
- **Голосовое общение** - разговоры с AI
- **AI-оценка** - автоматическая проверка заданий

### 📚 Обучение
- **Персонализированные курсы** - адаптация под уровень
- **CEFR тестирование** - точная оценка уровня
- **Интерактивные уроки** - современные методики
- **Прогресс отслеживание** - статистика обучения

### 🎯 Для учеников
- Адаптивное обучение
- Геймификация
- Достижения и награды
- Персональный кабинет

## 🛠️ Технологии

### Frontend
- **React 18** + **TypeScript**
- **Vite** - быстрый билдер
- **ShadCN/UI** - современные компоненты
- **TailwindCSS** - стилизация
- **React Router** - навигация

### Backend
- **Node.js** + **Express**
- **OpenAI API** - ИИ возможности
- **WebSocket** - реальное время

### DevOps
- **Single-Port deployment**
- **Nginx** - reverse proxy
- **SSL/HTTPS** - безопасность
- **Systemd** - управление сервисами

## 📋 Скрипты

```bash
# Разработка
npm run dev                    # Vite dev server

# Сборка
npm run build                  # Production build
npm run build:dev             # Development build

# Запуск
npm run start:single-port     # Production single-port server
npm run proxy                 # Test proxy server

# Тестирование
npm run test                  # Unit tests
npm run test:e2e             # E2E tests
npm run test:coverage        # Coverage report
```

## 🔧 Конфигурация

### Переменные окружения (.env)
```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Server
NODE_ENV=production
PORT=1031

# Optional: External proxy
PROXY_URL=http://username:password@proxy.host:port
```

### Nginx конфигурация
Скопируйте `nginx-teacher.conf` на сервер:
```bash
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher
sudo ln -s /etc/nginx/sites-available/teacher /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 🚀 Деплой

### Автоматический (рекомендуется)
```bash
# Используйте systemd сервис
sudo cp deploy-production.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/deploy-production.sh
sudo /usr/local/bin/deploy-production.sh
```

### Ручной
```bash
# 1. Обновить код
git pull origin main

# 2. Установить зависимости
npm install

# 3. Собрать проект
npm run build

# 4. Запустить сервер
npm run start:single-port &
```

## 🔍 Диагностика

### Проверить здоровье
```bash
curl https://your-domain.com/health
# {"status":"ok","timestamp":"2025-..."}
```

### Проверить API
```bash
curl https://your-domain.com/api/models
# OpenAI models list
```

### Логи сервера
```bash
# Systemd logs
sudo journalctl -u teacher-single-port -f

# Direct logs
tail -f /var/log/teacher-single-port.log
```

## 📚 Документация

- **[Полное руководство по деплою](DEPLOYMENT_SUMMARY.md)**
- **[Диагностика проблем](DIAGNOSIS_COMMANDS.md)**
- **[Архитектура](FINAL_VERSION.md)**
- **[Старое README](README-legacy.md)** (архив)

## 🤝 Поддержка

Если возникли проблемы:
1. Проверьте **[диагностику](DIAGNOSIS_COMMANDS.md)**
2. Посмотрите логи сервера
3. Создайте issue в репозитории

## 📄 Лицензия

Private project - все права защищены.

---

**🎯 Production Ready • Single-Port Architecture • AI-Powered Learning**

**GitHub:** https://github.com/RockInMyHead/teacher_windexs