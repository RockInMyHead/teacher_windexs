#!/bin/bash

# 🚨 Диагностика проблем с развертыванием Windexs-Teacher

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

log "🔍 Начинаем диагностику развертывания..."

# Проверка переменных окружения
log "📋 Проверка переменных окружения..."
if [ -f .env ]; then
    info "✅ Файл .env найден"

    # Проверка OpenAI API ключа
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        info "✅ OpenAI API ключ найден"
    else
        error "❌ OpenAI API ключ не найден в .env"
    fi

    # Проверка портов
    PROXY_PORT=$(grep "PROXY_PORT" .env | cut -d'=' -f2)
    if [ "$PROXY_PORT" = "1038" ]; then
        info "✅ PROXY_PORT настроен правильно: $PROXY_PORT"
    else
        error "❌ PROXY_PORT должен быть 1038, сейчас: $PROXY_PORT"
    fi

    VITE_DEV_PORT=$(grep "VITE_DEV_PORT" .env | cut -d'=' -f2)
    if [ "$VITE_DEV_PORT" = "1031" ]; then
        info "✅ VITE_DEV_PORT настроен правильно: $VITE_DEV_PORT"
    else
        warning "⚠️  VITE_DEV_PORT: $VITE_DEV_PORT (рекомендуется 1031)"
    fi
else
    error "❌ Файл .env не найден!"
fi

echo ""

# Проверка запущенных процессов
log "🔧 Проверка запущенных процессов..."
if pgrep -f "node.*vite" > /dev/null; then
    info "✅ Vite dev server запущен"
else
    error "❌ Vite dev server не запущен"
fi

if pgrep -f "node.*proxy-server" > /dev/null; then
    info "✅ Proxy server запущен"
else
    error "❌ Proxy server не запущен"
fi

echo ""

# Проверка открытых портов
log "🌐 Проверка открытых портов..."
if lsof -i :1031 > /dev/null 2>&1; then
    info "✅ Порт 1031 (frontend) открыт"
else
    error "❌ Порт 1031 (frontend) закрыт"
fi

if lsof -i :1038 > /dev/null 2>&1; then
    info "✅ Порт 1038 (proxy) открыт"
else
    error "❌ Порт 1038 (proxy) закрыт"
fi

echo ""

# Проверка systemd сервисов
log "⚙️  Проверка systemd сервисов..."
if systemctl is-active --quiet teacher-frontend 2>/dev/null; then
    info "✅ Сервис teacher-frontend активен"
else
    warning "⚠️  Сервис teacher-frontend не активен"
fi

if systemctl is-active --quiet teacher-proxy 2>/dev/null; then
    info "✅ Сервис teacher-proxy активен"
else
    warning "⚠️  Сервис teacher-proxy не активен"
fi

echo ""

# Проверка Nginx
log "🌐 Проверка Nginx..."
if systemctl is-active --quiet nginx 2>/dev/null; then
    info "✅ Nginx активен"
else
    error "❌ Nginx не активен"
fi

# Проверка конфигурации Nginx
if nginx -t 2>/dev/null; then
    info "✅ Конфигурация Nginx корректна"
else
    error "❌ Ошибка в конфигурации Nginx"
fi

echo ""

# Проверка доступности сервисов
log "🔗 Проверка доступности сервисов..."

# Frontend
if curl -s -f --max-time 5 http://localhost:1031 > /dev/null; then
    info "✅ Frontend доступен локально (порт 1031)"
else
    error "❌ Frontend недоступен локально (порт 1031)"
fi

# Proxy server health
if curl -s -f --max-time 5 http://localhost:1038/health > /dev/null; then
    info "✅ Proxy server health check успешен"
else
    error "❌ Proxy server health check не прошел"
fi

# Nginx proxy
if curl -s -f --max-time 5 -I https://teacher.windexs.ru > /dev/null; then
    info "✅ Сайт доступен через Nginx (HTTPS)"
else
    error "❌ Сайт недоступен через Nginx (HTTPS)"
fi

# API через Nginx
if curl -s -f --max-time 10 https://teacher.windexs.ru/api/health > /dev/null; then
    info "✅ API доступен через Nginx"
else
    warning "⚠️  API недоступен через Nginx (возможно нормально, если endpoint не реализован)"
fi

echo ""

# Тестирование OpenAI API
log "🤖 Тестирование OpenAI API..."
if curl -s -f --max-time 30 -X POST \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"Hello","model":"gpt-3.5-turbo","max_tokens":10}]}' \
    http://localhost:1038/api/chat/completions > /dev/null; then
    info "✅ OpenAI API тест успешен"
else
    error "❌ OpenAI API тест не прошел (проверьте API ключ и интернет)"
fi

echo ""

log "📋 РЕЗУЛЬТАТЫ ДИАГНОСТИКИ:"
echo ""
echo "Если есть ошибки:"
echo "1. 🔑 Проверьте OpenAI API ключ в .env"
echo "2. 🚀 Перезапустите сервисы: sudo systemctl restart teacher-proxy teacher-frontend"
echo "3. 🌐 Проверьте Nginx: sudo nginx -t && sudo systemctl reload nginx"
echo "4. 📊 Посмотрите логи: journalctl -u teacher-proxy -f"
echo ""
echo "Для быстрого перезапуска всех сервисов:"
echo "sudo systemctl restart teacher-proxy teacher-frontend nginx"
