# 🔍 ДИАГНОСТИКА ПРОБЛЕМ

## ❗ ТЕКУЩИЕ ОШИБКИ:
- 500 ошибка на `/health`
- WebSocket SSL ошибки
- TypeError: _jsxDEV
- Сайт не отправляет фронтенд

Это означает что **сервер не запущен правильно** или запущен **старый режим**.

---

## 🔧 ДИАГНОСТИЧЕСКИЕ КОМАНДЫ

### ШАГ 1: ПРОВЕРИТЬ ЧТО ЗАПУЩЕНО НА СЕРВЕРЕ

```bash
# Подключиться к серверу
ssh root@teacher.windexs.ru

# Проверить запущенные процессы (должен быть только single-port)
ps aux | grep -E "(node|npm)" | grep -v grep

# Проверить порты (должен быть только 1031)
sudo netstat -tlnp | grep :1031

# Проверить systemd сервис
sudo systemctl status teacher-single-port
```

### ШАГ 2: ПРОВЕРИТЬ ЛОГИ

```bash
# Логи single-port (если запущен)
sudo journalctl -u teacher-single-port -f --no-pager -n 50

# Или логи из файла (если настроено)
tail -f /var/log/teacher-single-port.log
tail -f /var/log/teacher-single-port.error.log

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
```

### ШАГ 3: ПРОВЕРИТЬ КОД НА СЕРВЕРЕ

```bash
cd /root/windexs-ai-learn

# Проверить что код обновлен
git log --oneline -3

# Проверить файлы
ls -la single-port-server.*
ls -la proxy-server.cjs

# Проверить что health endpoint есть
grep -n "app.get.*health" proxy-server.cjs

# Проверить что HMR отключен
grep -n "hmr.*production" vite.config.ts
```

---

## 🛠️ ПЕРЕЗАПУСК СЕРВЕРА

### ВАРИАНТ A: ЧИСТЫЙ ПЕРЕЗАПУСК

```bash
# Остановить ВСЕ процессы
sudo systemctl stop teacher-single-port teacher-proxy teacher-frontend
sudo pkill -9 node
sudo pkill -9 npm

# Проверить что ничего не слушает порты
sudo netstat -tlnp | grep -E ":(1031|1037|1038|1039)"

# Обновить код
cd /root/windexs-ai-learn
git pull origin main

# Запустить single-port
npm run start:single-port &
disown

# Проверить что запустилось
sleep 5
ps aux | grep single-port
sudo netstat -tlnp | grep :1031

# Тест
curl http://localhost:1031/health
curl http://localhost:1031/
```

### ВАРИАНТ B: Через systemd (РЕКОМЕНДУЕТСЯ)

```bash
# Создать/обновить сервис файл
sudo tee /etc/systemd/system/teacher-single-port.service > /dev/null <<EOF
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
EOF

# Перезагрузить systemd
sudo systemctl daemon-reload

# Запустить
sudo systemctl enable teacher-single-port
sudo systemctl start teacher-single-port

# Проверить статус
sudo systemctl status teacher-single-port -l
```

---

## 🔍 ТЕСТИРОВАНИЕ

### ТЕСТ 1: Локально на сервере

```bash
# Health check
curl http://localhost:1031/health

# Frontend
curl http://localhost:1031/ | head -20

# API
curl http://localhost:1031/api/models | head -10
```

### ТЕСТ 2: Через Nginx (публично)

```bash
# Health
curl https://teacher.windexs.ru/health

# Frontend
curl https://teacher.windexs.ru/ | head -20

# API
curl https://teacher.windexs.ru/api/models | head -10
```

### ТЕСТ 3: В браузере

1. Открыть `https://teacher.windexs.ru`
2. Проверить DevTools → Console
3. Проверить Network → `/health`

---

## 🚨 ЕСЛИ ПРОБЛЕМЫ ПРОДОЛЖАЮТСЯ

### ПРОБЛЕМА: "single-port-server.cjs: command not found"

```bash
# Проверить что Node.js установлен
node --version
npm --version

# Проверить package.json
cat package.json | grep "start:single-port"

# Запустить напрямую
node single-port-server.cjs
```

### ПРОБЛЕМА: "Port 1031 already in use"

```bash
# Найти что занимает порт
sudo lsof -i :1031
sudo netstat -tlnp | grep :1031

# Убить процесс
sudo kill -9 <PID>
```

### ПРОБЛЕМА: "Cannot find module 'dotenv'"

```bash
# Установить зависимости
npm install
```

### ПРОБЛЕМА: "OPENAI_API_KEY not set"

```bash
# Проверить .env файл
cat .env | grep OPENAI_API_KEY
```

---

## 📊 ОЖИДАЕМЫЕ ЛОГИ

После правильного запуска должно быть:

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
🌐 Доступно на: http://localhost:1031
💚 Health check: http://localhost:1031/health
📡 API endpoints: http://localhost:1031/api/*
```

---

## ✅ РЕЗУЛЬТАТ

После выполнения этих команд:
- ✅ Сервер должен запуститься
- ✅ `/health` должен работать
- ✅ Фронтенд должен загружаться
- ✅ API должен работать
- ✅ WebSocket ошибки исчезнут

**🎯 Запустите диагностику и пришлите результаты!**

