#!/bin/bash

# 🚀 Быстрое развертывание Windexs Teacher с доменом (без портов)

set -e

echo "🚀 Быстрое развертывание Windexs Teacher"
echo "=========================================="

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[✓]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Проверка .env
if [ ! -f .env ]; then
    error "Файл .env не найден! Создайте его из env.example"
fi

# Проверка OPENAI_API_KEY
if ! grep -q "OPENAI_API_KEY" .env; then
    error "OPENAI_API_KEY не найден в .env файле"
fi

log ".env файл проверен"

# Остановка старых сервисов
info "Остановка старых сервисов..."
sudo systemctl stop teacher-proxy teacher-frontend 2>/dev/null || true
sleep 2

# Установка зависимостей
if [ ! -d "node_modules" ]; then
    info "Установка зависимостей..."
    npm install --legacy-peer-deps
    log "Зависимости установлены"
else
    log "Зависимости уже установлены"
fi

# Сборка production версии
info "Сборка production версии..."
NODE_ENV=production npm run build
log "Build завершен"

# Копирование Nginx конфигурации
info "Настройка Nginx..."
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo ln -sf /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
log "Nginx конфигурация скопирована"

# Проверка Nginx конфигурации
info "Проверка Nginx конфигурации..."
if sudo nginx -t > /dev/null 2>&1; then
    log "Nginx конфигурация корректна"
else
    error "Ошибка в Nginx конфигурации!"
fi

# Перезапуск Nginx
info "Перезагрузка Nginx..."
sudo systemctl restart nginx
log "Nginx перезагружен"

# Создание systemd сервисов если не существуют
if [ ! -f /etc/systemd/system/teacher-proxy.service ]; then
    info "Создание systemd сервиса для прокси..."
    
    sudo tee /etc/systemd/system/teacher-proxy.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Proxy Server
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
Environment="PATH=/usr/bin:/bin"
Environment="NODE_ENV=production"
Environment="PROXY_PORT=1038"
ExecStart=/usr/bin/node proxy-server.cjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
    
    log "Сервис teacher-proxy создан"
fi

if [ ! -f /etc/systemd/system/teacher-frontend.service ]; then
    info "Создание systemd сервиса для фронтенда..."
    
    sudo tee /etc/systemd/system/teacher-frontend.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Frontend
After=network.target teacher-proxy.service

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
Environment="PATH=/usr/bin:/bin"
Environment="NODE_ENV=production"
Environment="VITE_DEV_PORT=1031"
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
    
    log "Сервис teacher-frontend создан"
fi

# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение автозапуска
sudo systemctl enable teacher-proxy teacher-frontend

# Запуск сервисов
info "Запуск сервисов..."
sudo systemctl start teacher-proxy
sleep 3
sudo systemctl start teacher-frontend
sleep 3

log "Сервисы запущены"

# Проверка статусов
info "Проверка статусов..."

if sudo systemctl is-active --quiet teacher-proxy; then
    log "Прокси-сервер работает"
else
    error "Прокси-сервер не запустился!"
fi

if sudo systemctl is-active --quiet teacher-frontend; then
    log "Фронтенд работает"
else
    error "Фронтенд не запустился!"
fi

if sudo systemctl is-active --quiet nginx; then
    log "Nginx работает"
else
    error "Nginx не запустился!"
fi

# Проверка доступности
info "Проверка доступности сервисов..."

if curl -s -f http://localhost:1038/health > /dev/null 2>&1; then
    log "Прокси-сервер отвечает на health check"
else
    warning "⚠️ Прокси-сервер не отвечает на health check"
fi

if curl -s -f http://localhost:1031 > /dev/null 2>&1; then
    log "Фронтенд отвечает"
else
    warning "⚠️ Фронтенд не отвечает"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Развертывание завершено успешно!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}📍 Адреса:${NC}"
echo "   🌐 Сайт: https://teacher.windexs.ru"
echo "   🤖 API:  https://teacher.windexs.ru/api/"
echo ""
echo -e "${BLUE}📊 Управление:${NC}"
echo "   sudo systemctl status teacher-proxy teacher-frontend"
echo "   sudo systemctl restart teacher-proxy teacher-frontend"
echo "   sudo journalctl -u teacher-proxy -f"
echo "   sudo journalctl -u teacher-frontend -f"
echo ""
echo -e "${BLUE}🧪 Проверка:${NC}"
echo "   curl https://teacher.windexs.ru/api/health"
echo "   curl https://teacher.windexs.ru/"
echo ""
echo -e "${BLUE}📖 Документация:${NC}"
echo "   DOMAIN_CONFIG.md - Конфигурация доменов"
echo "   PROXY_CONFIGURATION.md - Настройка прокси"
echo "   DEPLOYMENT_CHECKLIST.md - Чек-лист"
echo ""

