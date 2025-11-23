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

# Проверка наличия SSL сертификатов
if [ -f "/etc/letsencrypt/live/teacher.windexs.ru/fullchain.pem" ]; then
    log "✅ SSL сертификаты найдены, используем HTTPS конфигурацию"
    sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
else
    warning "⚠️ SSL сертификаты не найдены, используем HTTP конфигурацию для тестирования"
    sudo cp nginx-teacher-no-ssl.conf /etc/nginx/sites-available/teacher.windexs.ru
fi

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

# Создание/обновление сервиса teacher-proxy
log "📝 Настройка сервиса teacher-proxy..."

# Найти путь к node
NODE_PATH=$(which node 2>/dev/null || find /usr -name node 2>/dev/null | head -1 || find /home -name node 2>/dev/null | head -1 || find /opt -name node 2>/dev/null | head -1 || echo "/usr/bin/node")
log "🔍 Путь к Node.js: $NODE_PATH"

sudo tee /etc/systemd/system/teacher-proxy.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Proxy Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=/usr/bin:/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=PROXY_PORT=1038
ExecStart=$NODE_PATH $(pwd)/proxy-server.cjs
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=teacher-proxy

[Install]
WantedBy=multi-user.target
EOF

log "📝 Настройка сервиса teacher-frontend..."

# Найти путь к npm
NPM_PATH=$(which npm 2>/dev/null || find /usr -name npm 2>/dev/null | head -1 || find /home -name npm 2>/dev/null | head -1 || echo "npm")
log "🔍 Путь к npm: $NPM_PATH"

sudo tee /etc/systemd/system/teacher-frontend.service > /dev/null <<EOF
[Unit]
Description=Windexs Teacher Frontend
After=network.target teacher-proxy.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=/usr/bin:/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=PORT=1031
Environment=PROXY_PORT=1038
ExecStart=$NPM_PATH run start:production
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение автозапуска
sudo systemctl enable teacher-proxy
sudo systemctl enable teacher-frontend

# Остановить существующие сервисы перед запуском
log "🛑 Остановка существующих сервисов..."
sudo systemctl stop teacher-proxy teacher-frontend 2>/dev/null || true

# Убедимся, что порты свободны
log "🔍 Проверка занятых портов..."

cleanup_port() {
    local port=$1
    local retries=5
    
    while [ $retries -gt 0 ]; do
        if lsof -ti:$port >/dev/null 2>&1; then
            warning "⚠️ Порт $port занят, процесс $(lsof -ti:$port), убиваем..."
            sudo kill -9 $(lsof -ti:$port) 2>/dev/null || true
        elif fuser $port/tcp >/dev/null 2>&1; then
             warning "⚠️ Порт $port занят (fuser), убиваем..."
             sudo fuser -k -n tcp $port 2>/dev/null || true
        else
            log "✅ Порт $port свободен"
            return 0
        fi
        
        sleep 2
        ((retries--))
    done
    
    if lsof -ti:$port >/dev/null 2>&1; then
        error "❌ Не удалось освободить порт $port!"
        return 1
    fi
    
    return 0
}

cleanup_port 1038 || exit 1
cleanup_port 1031 || exit 1

# Запуск сервисов
log "🚀 Запуск teacher-proxy..."
sudo systemctl start teacher-proxy
sleep 3

log "🚀 Запуск teacher-frontend..."
sudo systemctl start teacher-frontend

# Ожидание запуска (увеличено время)
log "⏳ Ожидание полного запуска сервисов..."
sleep 10

# Проверка статуса с повторными попытками
log "📊 Проверка статуса сервисов..."

# Функция для проверки сервиса с повторными попытками
check_service() {
    local service_name=$1
    local max_attempts=5
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if sudo systemctl is-active --quiet $service_name; then
            log "✅ $service_name запущен"
            return 0
        fi

        log "⏳ Ожидание $service_name (попытка $attempt/$max_attempts)..."
        sleep 3
        ((attempt++))
    done

    error "❌ $service_name не запустился после $max_attempts попыток!"
    sudo journalctl -u $service_name -n 20
    return 1
}

# Проверка сервисов
check_service teacher-proxy || exit 1
check_service teacher-frontend || exit 1

if sudo systemctl is-active --quiet nginx; then
    log "✅ Nginx запущен"
else
    error "❌ Nginx не запустился!"
    exit 1
fi

# Проверка доступности
log "🔍 Проверка доступности сервисов..."

# Функция для проверки HTTP доступности
check_http() {
    local url=$1
    local service_name=$2
    local max_attempts=5
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -f --max-time 10 $url > /dev/null; then
            log "✅ $service_name отвечает ($url)"
            return 0
        fi

        log "⏳ Ожидание $service_name (попытка $attempt/$max_attempts)..."
        sleep 2
        ((attempt++))
    done

    warning "⚠️  $service_name не отвечает после $max_attempts попыток ($url)"
    return 1
}

# Проверка health endpoint прокси-сервера
check_http "http://localhost:1038/health" "Прокси-сервер"

# Проверка frontend
check_http "http://localhost:1031/health" "Frontend"

# Проверка Nginx
if [ -f "/etc/letsencrypt/live/teacher.windexs.ru/fullchain.pem" ]; then
    # SSL есть - проверяем HTTPS
    if curl -s -f -I --max-time 10 https://teacher.windexs.ru/health | grep -q "200 OK"; then
        log "✅ Сайт доступен по HTTPS"
    else
        warning "⚠️  Сайт не доступен по HTTPS"
    fi
else
    # SSL нет - проверяем HTTP
    if curl -s -f -I --max-time 10 http://teacher.windexs.ru/health | grep -q "200 OK"; then
        log "✅ Сайт доступен по HTTP"
    else
        warning "⚠️  Сайт не доступен по HTTP"
    fi
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
# Проверка и настройка SSL
if [ ! -f "/etc/letsencrypt/live/teacher.windexs.ru/fullchain.pem" ]; then
    echo ""
    warning "🔐 SSL сертификаты не настроены!"
    info "Для настройки HTTPS выполните:"
    echo "  sudo certbot --nginx -d teacher.windexs.ru"
    echo ""
    info "Пока сертификатов нет, сайт работает по HTTP: http://teacher.windexs.ru"
    echo "После настройки SSL сайт будет доступен по HTTPS: https://teacher.windexs.ru"
else
    log "✅ SSL сертификаты настроены"
fi
