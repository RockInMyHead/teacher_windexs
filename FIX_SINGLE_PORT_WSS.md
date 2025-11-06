# 🔧 Исправление WebSocket ошибок (Single-Port Mode)

## ❌ Проблема
```
WebSocket connection to 'wss://teacher.windexs.ru/?token=...' failed
WebSocket connection to 'wss://localhost:1037/?token=...' failed
Failed to load resource: 500 (Internal Server Error) /api/models
```

## ✅ Что исправлено

### 1. **Vite HMR конфигурация**
- WebSocket теперь использует порт **1031** вместо 443
- Протокол: `wss://teacher.windexs.ru:1031`

### 2. **Nginx конфигурация**
- `/health` → `http://localhost:1031/health`
- `/api/` → `http://localhost:1031/api/`
- `/` → `http://localhost:1031` (с WebSocket support)

### 3. **Single-Port архитектура**
```
Browser (teacher.windexs.ru:443)
    ↓ HTTPS
Nginx (:443)
    ↓ HTTP/WSS
Single-Port Server (:1031)
    ├── Proxy (API) (:1031)
    └── Frontend (Vite) (:1032 internal)
```

---

## 🚀 Инструкция для сервера

### Шаг 1: Обновить код
```bash
cd /root/windexs-ai-learn
git pull origin main
```

### Шаг 2: Обновить Nginx
```bash
# Скопировать новый конфиг
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher

# Проверить синтаксис
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

### Шаг 3: Остановить старые сервисы
```bash
sudo systemctl stop teacher-proxy
sudo systemctl stop teacher-frontend
```

### Шаг 4: Запустить Single-Port режим
```bash
# Убедиться что .env файл на месте
cat .env | grep OPENAI_API_KEY

# Запустить
npm run start:single-port
```

**Или использовать systemd сервис (рекомендуется):**

Создать `/etc/systemd/system/teacher-single-port.service`:
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

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl enable teacher-single-port
sudo systemctl start teacher-single-port
sudo systemctl status teacher-single-port
```

### Шаг 5: Проверить
```bash
# Проверить порт 1031
curl http://localhost:1031/health

# Проверить через домен
curl https://teacher.windexs.ru/health

# Проверить API
curl https://teacher.windexs.ru/api/models

# Логи
sudo journalctl -u teacher-single-port -f
```

---

## 🔍 Проверка WebSocket

Открыть браузер → `https://teacher.windexs.ru` → DevTools → Console

**Должно быть:**
```
✅ [vite] connected.
✅ Speech Recognition initialized successfully
```

**НЕ должно быть:**
```
❌ WebSocket connection failed
❌ Failed to connect to websocket
```

---

## 📊 Порты (Single-Port режим)

| Порт | Сервис | Доступ |
|------|--------|--------|
| 80 | Nginx HTTP | Внешний (redirect to 443) |
| 443 | Nginx HTTPS | Внешний |
| **1031** | **Single-Port Server** | **Внутренний** |
| 1032 | Vite Frontend | Внутренний (только для 1031) |

---

## 🐛 Troubleshooting

### WebSocket все еще не работает
```bash
# Проверить что Nginx слушает 443
sudo netstat -tlnp | grep :443

# Проверить что Single-Port работает на 1031
sudo netstat -tlnp | grep :1031

# Перезапустить все
sudo systemctl restart nginx
sudo systemctl restart teacher-single-port
```

### 500 ошибка на /api/models
```bash
# Проверить что OPENAI_API_KEY установлен
cat .env | grep OPENAI_API_KEY

# Проверить логи proxy
sudo journalctl -u teacher-single-port -f | grep "Proxy server"

# Тест напрямую
curl http://localhost:1031/api/models
```

---

## ✅ Результат

После применения всех изменений:

1. ✅ WebSocket HMR работает через `wss://teacher.windexs.ru:1031`
2. ✅ API работает через `/api/*` на порту 1031
3. ✅ Frontend работает на порту 1031
4. ✅ Все на одном порту (1031) как и требовалось

**🎉 Проект полностью работает на одном порту!**

