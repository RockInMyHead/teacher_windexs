#!/bin/bash

# Загружаем переменные окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Устанавливаем порт для прокси
export PROXY_PORT=${PROXY_PORT:-1038}

# Добавляем OPENAI_API_KEY если она отсутствует
if [ -z "$OPENAI_API_KEY" ]; then
    export OPENAI_API_KEY="$VITE_OPENAI_API_KEY"
fi

echo "🤖 Запуск прокси-сервера на порту $PROXY_PORT..."
echo "OPENAI_API_KEY установлена: ${OPENAI_API_KEY:+YES}"

# Запускаем прокси-сервер
OPENAI_API_KEY="$OPENAI_API_KEY" PROXY_PORT="$PROXY_PORT" node proxy-server.cjs