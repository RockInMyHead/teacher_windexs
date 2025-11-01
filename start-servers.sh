#!/bin/bash

echo "🚀 Запуск Windexs-Учитель на портах 1037-1039..."

# Загружаем переменные окружения из .env файла
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Устанавливаем переменные окружения для портов
export VITE_DEV_PORT=1037
export PROXY_PORT=1038
export PORT=1039

# Добавляем OPENAI_API_KEY если она отсутствует
if [ -z "$OPENAI_API_KEY" ]; then
    export OPENAI_API_KEY="$VITE_OPENAI_API_KEY"
fi

echo "📱 Frontend (Vite): порт $VITE_DEV_PORT"
echo "🤖 Proxy (OpenAI): порт $PROXY_PORT"
echo "🌐 Production: порт $PORT"
echo "OPENAI_API_KEY установлена: ${OPENAI_API_KEY:+YES}"

# Запускаем прокси-сервер
echo "🤖 Запуск прокси-сервера..."
./start-proxy.sh &

# Ждем 3 секунды, чтобы прокси-сервер успел запуститься
sleep 3

# Запускаем dev сервер
echo "📱 Запуск Vite dev сервера..."
./start-dev.sh &

echo ""
echo "✅ Все серверы запущены!"
echo "🌐 Приложение доступно: http://localhost:$VITE_DEV_PORT"
echo "🤖 AI функции работают через: http://localhost:$PROXY_PORT"
echo ""
echo "📊 Для проверки статуса: ./check-servers.sh"
echo "🛑 Для остановки: ./stop-servers.sh"
