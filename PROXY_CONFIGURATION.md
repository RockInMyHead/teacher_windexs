# 🔌 Конфигурация Прокси-сервера

## 📋 Архитектура

```
Frontend (https://teacher.windexs.ru/)
    ↓
Nginx (443)
    ├─→ /api/* → Proxy Server (1038)
    └─→ /* → Frontend Server (1031)
         ↓
    Proxy Server (1038)
         ↓
    OpenAI API через внешний прокси
```

## 🌐 Endpoints после настройки

### Development (localhost)
```
Frontend: http://localhost:1037/
API Proxy: http://localhost:1038/api/
```

### Production (домен)
```
Frontend: https://teacher.windexs.ru/
API Proxy: https://teacher.windexs.ru/api/
```

## 🔧 Как это работает

### 1. **Frontend обращается по домену**
```typescript
// Вместо прямых вызовов к OpenAI API:
// const url = 'https://api.openai.com/v1/chat/completions'

// Используется текущий домен:
const url = `${window.location.origin}/api/chat/completions`
// На production: https://teacher.windexs.ru/api/chat/completions
// На development: http://localhost:1037/api/chat/completions
```

### 2. **Vite proxy в development**
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:1038',  // Dev
    changeOrigin: true,
  }
}
```

### 3. **Nginx routing в production**
```nginx
location /api/ {
    proxy_pass http://localhost:1038/;  # Proxy Server
}

location / {
    proxy_pass http://localhost:1031;   # Frontend Server
}
```

## 📡 API Endpoints Proxy Server

### Chat Completions
```
POST https://teacher.windexs.ru/api/chat/completions
```

### Image Generations
```
POST https://teacher.windexs.ru/api/images/generations
```

### Text-to-Speech
```
POST https://teacher.windexs.ru/api/audio/speech
```

### List Models
```
GET https://teacher.windexs.ru/api/models
```

### Health Check
```
GET https://teacher.windexs.ru/api/health
```

## 🚀 Развертывание

### 1. Сборка
```bash
npm run build
```

### 2. Копирование конфигов
```bash
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo ln -sf /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/
```

### 3. Проверка Nginx
```bash
sudo nginx -t
```

### 4. Перезапуск
```bash
sudo systemctl restart nginx
sudo systemctl restart teacher-proxy teacher-frontend
```

## ✅ Проверка

### Health Check
```bash
curl https://teacher.windexs.ru/api/health
```

### Test API Call
```bash
curl -X POST https://teacher.windexs.ru/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### Check Proxy Logs
```bash
sudo journalctl -u teacher-proxy -f
```

## 🔐 Security

- ✅ HTTPS обязателен для production
- ✅ API ключ хранится в .env на сервере
- ✅ API ключ НЕ видно в браузере
- ✅ Все запросы проходят через прокси
- ✅ CORS обрабатывается прокси-сервером

## 📝 Важные переменные

```bash
# Frontend порт
VITE_DEV_PORT=1031          # Production
VITE_DEV_PORT=1037          # Development

# Proxy порт
PROXY_PORT=1038             # Всегда 1038

# OpenAI API ключ (на сервере!)
OPENAI_API_KEY=sk-...
```

## 🎯 Результат

После настройки:

1. **Frontend** обращается по URL без портов
   - Development: `http://localhost:1037/`
   - Production: `https://teacher.windexs.ru/`

2. **API Proxy** доступен по пути `/api/`
   - Development: `http://localhost:1037/api/...`
   - Production: `https://teacher.windexs.ru/api/...`

3. **Все запросы** проходят через один прокси-сервер
   - Централизованное управление
   - Единая точка входа
   - Безопасное использование API ключей

