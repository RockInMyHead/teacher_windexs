#!/bin/bash

echo "🚀 Развертывание Windexs-Учитель на сервере (порты 1037-1039)"

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Создайте .env файл на основе env.example:"
    echo "   cp env.example .env"
    echo "   nano .env  # Добавьте ваш OpenAI API ключ"
    exit 1
fi

# Проверка наличия зависимостей
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка установки зависимостей!"
        exit 1
    fi
fi

# Остановка предыдущих серверов
echo "🛑 Остановка предыдущих серверов..."
./stop-servers.sh 2>/dev/null || true

# Небольшая пауза
sleep 2

# Запуск серверов
echo "🏃 Запуск серверов..."
./start-servers.sh

echo ""
echo "✅ Развертывание завершено!"
echo "🌐 Приложение доступно: http://localhost:1037"
echo "🤖 AI функции работают через: http://localhost:1038"
echo ""
echo "📊 Проверить статус: ./check-servers.sh"
echo "🛑 Остановить серверы: ./stop-servers.sh"
