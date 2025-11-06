#!/bin/bash

# 🚀 Скрипт для развертывания Windexs-Учитель в production
# Используется на сервере teacher.windexs.ru

set -e  # Остановить скрипт при первой ошибке

echo "🚀 Начинаем развертывание Windexs-Учитель в production..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Проверка прав root
if [[ $EUID -eq 0 ]]; then
   error "Этот скрипт нельзя запускать от root пользователя"
   exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    error "Файл .env не найден!"
    info "Создайте .env файл на основе env.example:"
    echo "  cp env.example .env"
    echo "  nano .env  # Добавьте ваш OpenAI API ключ"
    exit 1
fi

# Загрузка переменных окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Проверка OpenAI API ключа
if [ -z "$OPENAI_API_KEY" ]; then
    error "OPENAI_API_KEY не установлен в .env файле!"
    exit 1
fi

log "✅ Переменные окружения загружены"

# Остановка существующих сервисов
log "🛑 Остановка существующих сервисов..."
sudo systemctl stop teacher-frontend teacher-proxy 2>/dev/null || true

# Установка зависимостей
if [ ! -d "node_modules" ]; then
    log "📦 Установка зависимостей Node.js..."
    npm install
else
    info "📦 Зависимости уже установлены, пропускаем..."
fi

# Сборка приложения
log "🔨 Сборка production версии..."
NODE_ENV=production npm run build

# Копирование Nginx конфигурации
log "🌐 Настройка Nginx..."
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo ln -sf /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/

# Удаление дефолтного сайта если существует
sudo rm -f /etc/nginx/sites-enabled/default

# Тестирование Nginx конфигурации
log "🧪 Проверка Nginx конфигурации..."
if sudo nginx -t; then
    log "✅ Nginx конфигурация корректна"
else
    error "❌ Ошибка в Nginx конфигурации!"
    exit 1
fi

# Перезапуск Nginx
log "🔄 Перезапуск Nginx..."
sudo systemctl restart nginx

# Запуск сервисов
log "🚀 Запуск сервисов..."

# Создание сервисов если не существуют
if [ ! -f /etc/systemd/system/teacher-proxy.service ]; then
    log "📝 Создание сервиса teacher-proxy..."

    sudo tee /etc/systemd/system/teacher-proxy.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Proxy Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=/usr/bin:/bin
Environment=NODE_ENV=production
Environment=PROXY_PORT=1038
ExecStart=/usr/bin/node proxy-server.cjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
fi

if [ ! -f /etc/systemd/system/teacher-frontend.service ]; then
    log "📝 Создание сервиса teacher-frontend..."

    sudo tee /etc/systemd/system/teacher-frontend.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Frontend
After=network.target teacher-proxy.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=/usr/bin:/bin
Environment=NODE_ENV=production
Environment=VITE_DEV_PORT=1031
Environment=PROXY_PORT=1038
ExecStart=/usr/bin/npm run start:production
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
fi

# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение автозапуска
sudo systemctl enable teacher-proxy
sudo systemctl enable teacher-frontend

# Запуск сервисов
sudo systemctl start teacher-proxy
sudo systemctl start teacher-frontend

# Ожидание запуска
sleep 5

# Проверка статуса
log "📊 Проверка статуса сервисов..."

if sudo systemctl is-active --quiet teacher-proxy; then
    log "✅ Прокси-сервер запущен"
else
    error "❌ Прокси-сервер не запустился!"
    sudo journalctl -u teacher-proxy -n 20
    exit 1
fi

if sudo systemctl is-active --quiet teacher-frontend; then
    log "✅ Frontend запущен"
else
    error "❌ Frontend не запустился!"
    sudo journalctl -u teacher-frontend -n 20
    exit 1
fi

if sudo systemctl is-active --quiet nginx; then
    log "✅ Nginx запущен"
else
    error "❌ Nginx не запустился!"
    exit 1
fi

# Проверка доступности
log "🔍 Проверка доступности сервисов..."

# Проверка health endpoint прокси-сервера
if curl -s -f http://localhost:1038/health > /dev/null; then
    log "✅ Прокси-сервер отвечает на health check"
else
    warning "⚠️  Прокси-сервер не отвечает на health check"
fi

# Проверка frontend
if curl -s -f http://localhost:1031 > /dev/null; then
    log "✅ Frontend отвечает"
else
    warning "⚠️  Frontend не отвечает"
fi

# Проверка Nginx
if curl -s -f -I https://teacher.windexs.ru | grep -q "200 OK"; then
    log "✅ Сайт доступен по HTTPS"
else
    warning "⚠️  Сайт не доступен по HTTPS"
fi

echo ""
log "🎉 Развертывание завершено успешно!"
echo ""
info "🌐 Сайт доступен: https://teacher.windexs.ru"
info "🔧 Прокси-сервер (OpenAI): http://localhost:1038"
info "💻 Frontend: http://localhost:1031"
echo ""
info "📊 Управление сервисами:"
echo "  sudo systemctl status teacher-proxy"
echo "  sudo systemctl status teacher-frontend"
echo "  sudo systemctl restart teacher-proxy teacher-frontend"
echo "  journalctl -u teacher-proxy -f"
echo "  journalctl -u teacher-frontend -f"
echo ""
warning "📝 Не забудьте настроить SSL сертификаты:"
echo "  sudo certbot --nginx -d teacher.windexs.ru"
