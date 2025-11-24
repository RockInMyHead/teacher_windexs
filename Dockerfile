# Используем Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости системы
RUN apk add --no-cache sqlite

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev dependencies для сборки)
RUN npm ci

# Копируем весь проект
COPY . .

# Собираем frontend
RUN npm run build

# Создаем директорию для базы данных
RUN mkdir -p /app/data

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=1031
ENV DATABASE_PATH=/app/data/teacher_platform.db

# Открываем порт
EXPOSE 1031

# Проверяем, что сборка прошла успешно
RUN ls -la dist/

# Запускаем single-port сервер
CMD ["npm", "run", "start:single-port"]
