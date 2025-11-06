# 🔧 Исправление WebSocket и Health Check ошибок

## 🚨 Проблемы, которые мы исправляем:

1. **WebSocket ошибка:** `failed to connect to websocket` (Vite HMR)
2. **404 ошибка:** `/api/health` endpoint не найден
3. **SSL ошибка:** WebSocket не может подключиться через HTTPS

## ✅ Что было исправлено:

### 1. vite.config.ts - Правильная HMR конфигурация

**Production:**
```typescript
hmr: {
  host: 'teacher.windexs.ru',
  port: 443,
  protocol: 'wss',  // Secure WebSocket
}
```

**Development:**
```typescript
hmr: true,  // Default HMR
```

### 2. nginx-teacher.conf - WebSocket поддержка

```nginx
# Health check location
location /health {
    proxy_pass http://localhost:1038/health;
}

# WebSocket headers
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header X-Forwarded-Host $server_name;
proxy_set_header X-Forwarded-Port $server_port;

# WebSocket timeouts
proxy_send_timeout 3600s;
proxy_read_timeout 3600s;
proxy_buffering off;
```

## 📋 Инструкции по применению:

### На сервере:

#### 1. Обновить код
```bash
cd /path/to/teacher
git pull origin main
```

#### 2. Проверить Nginx конфиг
```bash
sudo nginx -t
```

#### 3. Перезагрузить Nginx
```bash
sudo systemctl reload nginx
```

#### 4. Перезапустить сервисы
```bash
sudo systemctl restart teacher-proxy teacher-frontend
```

#### 5. Проверить логи
```bash
sudo journalctl -u teacher-frontend -f
```

### Проверка работы:

```bash
# 1. Health check
curl https://teacher.windexs.ru/health

# 2. API endpoint
curl https://teacher.windexs.ru/api/health

# 3. Открыть браузер
# https://teacher.windexs.ru/
```

## 🔍 Диагностика при проблемах:

### WebSocket все еще не работает?

```bash
# Проверить что Nginx слушает WebSocket
sudo netstat -tlnp | grep nginx

# Проверить конфиг
sudo nginx -T | grep -A 5 "upgrade"

# Проверить SSL
curl -v https://teacher.windexs.ru/health
```

### Health endpoint не работает?

```bash
# Проверить что прокси запущен
curl http://localhost:1038/health

# Проверить логи прокси
sudo journalctl -u teacher-proxy -n 20
```

### Vite HMR все еще не подключается?

```bash
# Проверить что используется NODE_ENV=production
ps aux | grep vite

# Если не production, перезапустить с правильными переменными
sudo systemctl stop teacher-frontend
sleep 2
sudo systemctl start teacher-frontend

# Проверить логи
sudo journalctl -u teacher-frontend -f
```

## 🎯 Ожидаемые результаты:

После применения изменений вы должны увидеть:

✅ **Нет WebSocket ошибок в консоли браузера**
✅ **Нет 404 на `/api/health`**
✅ **Приложение нормально загружается**
✅ **Vite HMR подключается через `wss://teacher.windexs.ru`**

## 🚀 Быстрое применение (одна команда):

```bash
cd /path/to/teacher && \
git pull origin main && \
sudo nginx -t && \
sudo systemctl reload nginx && \
sudo systemctl restart teacher-proxy teacher-frontend && \
echo "✅ Изменения применены!"
```

## 📊 Что изменилось:

| Файл | Что изменилось |
|------|----------------|
| `vite.config.ts` | Правильная HMR конфигурация для production |
| `nginx-teacher.conf` | WebSocket поддержка + Health endpoint |

## 💡 Дополнительно:

Если вы используете **development** режим локально:
```bash
./start-servers.sh
```
HMR будет работать через default механизм Vite (порт 1037).

Если вы используете **production** режим:
```bash
./quick-deploy.sh
```
HMR будет работать через `wss://teacher.windexs.ru:443`.

## 🆘 Если ничего не помогло:

1. Очистить кэш браузера (Ctrl+Shift+Delete)
2. Перезагрузить страницу
3. Проверить консоль браузера (F12)
4. Проверить логи сервера: `sudo journalctl -u teacher-frontend -f`

---

**После применения этих изменений все ошибки должны исчезнуть!** 🎉

