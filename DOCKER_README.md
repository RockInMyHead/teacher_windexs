# Развертывание с Docker

## Быстрый старт

### 1. Подготовка переменных окружения

```bash
# Создайте файл .env
cp DOCKER_ENV_EXAMPLE.txt .env

# Отредактируйте .env и установите ваш OpenAI API ключ
nano .env
```

### 2. Запуск с Docker Compose

```bash
# Сборка и запуск
docker-compose up --build

# Или в фоне
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f teacher-app
```

### 3. Проверка работы

```bash
# Проверка здоровья
curl http://localhost:1031/health

# Проверка API
curl http://localhost:1031/api/courses

# Открыть в браузере
open http://localhost:1031
```

## Структура контейнера

```
teacher-app (порт 1031)
├── /app/dist/          # Собранный frontend
├── /app/data/          # База данных SQLite
├── /app/server/        # Backend код
└── /app/single-port-server.cjs  # Главный сервер
```

## Переменные окружения

| Переменная | Значение | Обязательно |
|------------|----------|-------------|
| `OPENAI_API_KEY` | Ваш ключ OpenAI API | ✅ |
| `PORT` | Порт сервера (1031) | ❌ |
| `NODE_ENV` | Окружение (production) | ❌ |
| `DATABASE_PATH` | Путь к БД | ❌ |

## Команды управления

```bash
# Остановить
docker-compose down

# Пересобрать
docker-compose up --build --force-recreate

# Очистить всё
docker-compose down -v --rmi all

# Просмотр логов
docker-compose logs teacher-app

# Войти в контейнер
docker-compose exec teacher-app sh
```

## Устранение проблем

### Ошибка сборки frontend

```bash
# Проверьте локально
npm run build

# Очистите node_modules
rm -rf node_modules
npm install
```

### Проблемы с API ключами

```bash
# Проверьте переменные
docker-compose exec teacher-app env | grep OPENAI

# Перезапустите с новыми переменными
docker-compose down
docker-compose up --build
```

### Проблемы с базой данных

```bash
# Проверьте доступ к файлу БД
docker-compose exec teacher-app ls -la /app/data/

# Сбросьте базу данных
docker-compose down -v
docker-compose up --build
```

## Производственное развертывание

### С внешней БД

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  teacher-app:
    environment:
      - DATABASE_PATH=/app/data/prod.db
    volumes:
      - ./prod-data:/app/data
```

### С nginx прокси

```nginx
# nginx.conf
server {
    listen 80;
    server_name teacher.yourdomain.com;

    location / {
        proxy_pass http://localhost:1031;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Мониторинг

### Health check

```bash
# Проверка здоровья каждые 30 секунд
curl http://localhost:1031/health
```

### Просмотр логов

```bash
# Все логи
docker-compose logs teacher-app

# Только последние 100 строк
docker-compose logs --tail=100 teacher-app

# Следить за логами в реальном времени
docker-compose logs -f teacher-app
```

## Резервное копирование

```bash
# Скопировать базу данных
docker cp teacher-app:/app/data/teacher_platform.db ./backup.db

# Восстановить из бэкапа
docker cp ./backup.db teacher-app:/app/data/teacher_platform.db
```
