#!/bin/bash

# Загружаем переменные окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Устанавливаем порт для dev сервера
export VITE_DEV_PORT=${VITE_DEV_PORT:-1037}

echo "📱 Запуск Vite dev сервера на порту $VITE_DEV_PORT..."

# Запускаем dev сервер
VITE_DEV_PORT="$VITE_DEV_PORT" npm run dev
