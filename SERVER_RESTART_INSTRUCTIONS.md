# 🔄 Инструкция по перезапуску сервера (Single-Port режим)

## ❌ Проблема
Сейчас на сервере запущен **старый режим** с портами 1037/1038, а должен быть **single-port режим** на порту 1031.

**Логи говорят:**
```
[0] 🚀 Proxy server running on http://localhost:1038
[1]   ➜  Local:   http://localhost:1037/
```

**Должно быть:**
```
🚀 Запуск Single Port Server (порт 1031)
🌐 Доступно на: https://teacher.windexs.ru/
```

---

## ✅ Решение (Выполнить на сервере)

### Шаг 1: Остановить старые процессы
```bash
# Остановить systemd сервисы (если запущены)
sudo systemctl stop teacher-proxy
sudo systemctl stop teacher-frontend

# ИЛИ убить процессы вручную
pkill -f "npm run dev:full"
pkill -f "proxy-server.cjs"
pkill -f "vite"

# Проверить что ничего не слушает порты
sudo netstat -tlnp | grep -E ":(1031|1037|1038|1039)"
```

### Шаг 2: Обновить код (если не обновили)
```bash
cd /root/windexs-ai-learn  # Или ваша директория
git pull origin main
```

### Шаг 3: Проверить .env файл
```bash
cat .env | grep OPENAI_API_KEY
# Должен быть: OPENAI_API_KEY=your_openai_api_key_here
```

### Шаг 4: Обновить Nginx (если не обновили)
```bash
# Скопировать новый конфиг
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher

# Проверить синтаксис
sudo nginx -t

# Перезагрузить
sudo systemctl reload nginx
```

### Шаг 5: Запустить Single-Port режим

**Вариант A: Вручную (для тестирования)**
```bash
npm run start:single-port
```

**Вариант B: Через systemd (для production)**

1. Создать сервис файл:
```bash
sudo nano /etc/systemd/system/teacher-single-port.service
```

2. Вставить:
```ini
[Unit]
Description=Teacher Single-Port Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/windexs-ai-learn
ExecStart=/usr/bin/npm run start:single-port
Restart=always
RestartSec=10
StandardOutput=append:/var/log/teacher-single-port.log
StandardError=append:/var/log/teacher-single-port.error.log
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

3. Запустить:
```bash
sudo systemctl daemon-reload
sudo systemctl enable teacher-single-port
sudo systemctl start teacher-single-port

# Проверить статус
sudo systemctl status teacher-single-port

# Логи в реальном времени
sudo journalctl -u teacher-single-port -f
```

### Шаг 6: Проверить

```bash
# Проверить порт 1031
curl http://localhost:1031/health

# Проверить через домен
curl https://teacher.windexs.ru/health

# Проверить API
curl https://teacher.windexs.ru/api/models
```

**В логах должно быть:**
```
🚀 Запуск Single Port Server (порт 1031)
📊 Конфигурация:
  - Main port: 1031
  - Frontend: 1032 (internal)
  - API Proxy: 1031
  - Environment: production
  - OpenAI API Key: ✅ Установлен

✅ Frontend сервер запущен
✅ API Proxy сервер запущен

🎉 Single Port Server готов!
🌐 Доступно на: https://teacher.windexs.ru/
```

---

## 🐛 Troubleshooting

### 1. Ошибка "Address already in use" (порт занят)
```bash
# Найти что занимает порт 1031
sudo lsof -i :1031

# Убить процесс
sudo kill -9 <PID>
```

### 2. 403 ошибка от OpenAI API
```bash
# Проверить что API ключ валидный
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $(cat .env | grep OPENAI_API_KEY | cut -d'=' -f2)"

# Если 403 - ключ невалидный, нужно обновить в .env
```

### 3. WebSocket ошибки
```bash
# Убедиться что Nginx обновлен
sudo nginx -t
sudo cat /etc/nginx/sites-available/teacher | grep -A5 "location /"

# Должно быть:
#   proxy_pass http://localhost:1031;
#   proxy_set_header Upgrade $http_upgrade;
#   proxy_set_header Connection "upgrade";
```

### 4. Старые процессы не умирают
```bash
# Убить все Node процессы (осторожно!)
sudo pkill -9 node

# Или найти конкретные
ps aux | grep -E "(vite|proxy-server)"
sudo kill -9 <PID>
```

---

## 📊 Правильная архитектура

### Single-Port режим (1031)
```
┌─────────────────┐
│    Browser      │
└────────┬────────┘
         │ HTTPS (443)
         ▼
┌─────────────────┐
│     Nginx       │ :443 (SSL)
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│ Single-Port     │ :1031 (external)
│   Server        │
├─────────────────┤
│ • Proxy (API)   │ :1031
│ • Frontend      │ :1032 (internal)
└─────────────────┘
```

### Старый режим (НЕПРАВИЛЬНО)
```
┌─────────────────┐
│    Browser      │
└────────┬────────┘
         │ HTTPS (443)
         ▼
┌─────────────────┐
│     Nginx       │ :443
└────┬───────┬────┘
     │       │
     │       └──────> Frontend :1037
     └─────────────> Proxy    :1038
```

---

## ✅ Результат

После правильного запуска:
- ✅ Весь проект на порту 1031
- ✅ WebSocket работает через `wss://teacher.windexs.ru:1031`
- ✅ API работает через `/api/*`
- ✅ Нет 403 ошибок (если ключ валидный)

**🎉 Готово!**

