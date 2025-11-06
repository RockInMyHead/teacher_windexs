# 🚀 Руководство по развертыванию Windexs-Teacher

## 📋 Краткое описание

Приложение использует **единую точку входа** через Nginx:
- **Frontend**: `https://teacher.windexs.ru/` → внутренний порт `1031`
- **API**: `https://teacher.windexs.ru/api/*` → внутренний порт `1039`

Frontend автоматически определяет URL используя `window.location.origin`, поэтому работает как локально, так и в production.

---

## 🔧 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                 NGINX (порты 80/443 + HTTPS)                 │
│  teacher.windexs.ru                                         │
├────────────────┬──────────────────────────────────────────────┤
│                │                                              │
│ /api/* ────────┼──→ http://localhost:1038                    │
│                │    (Proxy Server - OpenAI API)              │
│                │                                              │
│ /* ────────────┼──→ http://localhost:1031                    │
│                │    (Frontend - Vite dev server)             │
│                │                                              │
└────────────────┴──────────────────────────────────────────────┘
```

---

## 📝 Процесс развертывания

### 1️⃣ Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Nginx
sudo apt install nginx -y

# Установка certbot для SSL
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2️⃣ SSL сертификаты

```bash
# Получение сертификата от Let's Encrypt
sudo certbot --nginx -d teacher.windexs.ru

# Проверка статуса
sudo certbot certificates
```

### 3️⃣ Клонирование проекта

```bash
# Клонирование
git clone https://github.com/RockInMyHead/windexs-ai-learn.git
cd windexs-ai-learn

# Настройка окружения
cp env.example .env

# Редактирование .env (важно заполнить OpenAI API ключ!)
nano .env
```

**Содержимое .env:**
```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Ports
VITE_DEV_PORT=1031      # Frontend port
PROXY_PORT=1039         # Proxy server port
PORT=1039               # Production port
```

### 4️⃣ Установка зависимостей

```bash
# Установка всех зависимостей Node.js
npm install

# Сборка production версии (опционально)
npm run build
```

### 5️⃣ Настройка Nginx

```bash
# Копирование конфигурации
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru

# Активация сайта
sudo ln -sf /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/

# Удаление дефолтного сайта (если нужно)
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

### 6️⃣ Запуск приложения

#### Вариант A: Использование скрипта (рекомендуется)

```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

#### Вариант B: Ручной запуск

```bash
# Терминал 1: Запуск Proxy Server
npm run proxy

# Терминал 2: Запуск Frontend
npm run dev
```

#### Вариант C: Systemd сервисы (для автозапуска)

**Сервис прокси:**
```bash
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
Environment=PROXY_PORT=1039
ExecStart=/usr/bin/node proxy-server.cjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

**Сервис фронтенда:**
```bash
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
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

**Активация:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable teacher-proxy teacher-frontend
sudo systemctl start teacher-proxy teacher-frontend
```

---

## ✅ Проверка работоспособности

```bash
# Проверка статуса сервисов
sudo systemctl status teacher-proxy
sudo systemctl status teacher-frontend
sudo systemctl status nginx

# Проверка открытых портов
netstat -tlnp | grep -E '(1031|1039|443|80)'

# Проверка сайта
curl -I https://teacher.windexs.ru
curl -I https://teacher.windexs.ru/api/health

# Просмотр логов
journalctl -u teacher-proxy -f
journalctl -u teacher-frontend -f
sudo tail -f /var/log/nginx/access.log
```

---

## 🔄 Обновление приложения

```bash
# Остановка сервисов
sudo systemctl stop teacher-frontend teacher-proxy

# Обновление кода
git pull origin main

# Установка зависимостей (если нужны)
npm install

# Запуск сервисов
sudo systemctl start teacher-proxy teacher-frontend

# Проверка логов
journalctl -u teacher-frontend -n 50
```

---

## 🐛 Отладка

### Frontend не отвечает

```bash
# Проверить процесс
ps aux | grep npm

# Проверить логи
journalctl -u teacher-frontend -n 100

# Проверить порт
netstat -tlnp | grep 1031
```

### API не работает

```bash
# Проверить процесс прокси
ps aux | grep node

# Проверить логи прокси
journalctl -u teacher-proxy -n 100

# Проверить OpenAI API ключ в .env
cat .env | grep OPENAI
```

### Nginx ошибки

```bash
# Проверить конфигурацию
sudo nginx -t

# Просмотр ошибок
sudo tail -f /var/log/nginx/error.log

# Перезагрузить конфигурацию
sudo systemctl reload nginx
```

---

## 📊 Мониторинг

### Health check endpoints

```bash
# Frontend
curl https://teacher.windexs.ru/health

# API (через nginx proxy)
curl https://teacher.windexs.ru/api/health

# Прямой доступ к сервисам
curl http://localhost:1031/health  # Frontend
curl http://localhost:1038/health  # Proxy Server
```

### Логи

- **Nginx**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **Frontend**: `journalctl -u teacher-frontend -f`
- **Proxy**: `journalctl -u teacher-proxy -f`

---

## 🔒 Безопасность

1. **SSL сертификаты**: Используются Let's Encrypt (автоматическое обновление)
2. **Firewall**: Открыть только порты 80, 443
3. **API ключ**: Хранить в `.env` (никогда не коммитить!)
4. **Логи**: Регулярно проверять для выявления аномалий

---

## 🎯 Переменные окружения

| Переменная | Значение | Описание |
|-----------|---------|---------|
| `VITE_OPENAI_API_KEY` | `sk-...` | OpenAI API ключ для фронтенда |
| `OPENAI_API_KEY` | `sk-...` | OpenAI API ключ для прокси |
| `VITE_DEV_PORT` | `1031` | Порт фронтенда |
| `PROXY_PORT` | `1039` | Порт прокси-сервера |
| `PORT` | `1039` | Порт production build |

---

## 📞 Поддержка

При возникновении проблем:

1. Проверить логи приложения
2. Убедиться, что все порты открыты
3. Проверить SSL сертификаты
4. Убедиться, что `.env` файл содержит корректный API ключ
5. Перезагрузить сервисы

```bash
sudo systemctl restart teacher-proxy teacher-frontend nginx
```

