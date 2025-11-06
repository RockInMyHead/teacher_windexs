# 🌐 Конфигурация Доменов (Без Портов)

## 📌 Суть

Фронтенд теперь обращается по домену БЕЗ портов, используя Nginx для маршрутизации:

```
https://teacher.windexs.ru/              → Frontend (порт 1031)
https://teacher.windexs.ru/api/*         → API Proxy (порт 1038)
```

## 🔧 Что было изменено

### 1. **vite.config.ts**
```typescript
proxy: {
  '/api': {
    target: process.env.NODE_ENV === 'production' 
      ? 'https://teacher.windexs.ru'
      : `http://localhost:${process.env.PROXY_PORT || 1038}`,
    changeOrigin: true,
  }
}
```

✅ На production - обращается через домен  
✅ На development - обращается на localhost:1038

### 2. **nginx-teacher.conf** (уже готов)
```nginx
location /api/ {
    proxy_pass http://localhost:1038/;
}

location / {
    proxy_pass http://localhost:1031;
}
```

✅ `/api/` → Proxy Server (1038)  
✅ Всё остальное → Frontend Server (1031)

### 3. **Все API вызовы в коде**
```typescript
// Было:
const url = 'https://api.openai.com/v1/chat/completions';

// Стало:
const url = `${window.location.origin}/api/chat/completions`;

// На production это разворачивается в:
// https://teacher.windexs.ru/api/chat/completions

// На development через vite proxy:
// http://localhost:1037/api/chat/completions
```

### 4. **Новая утилита apiClient.ts**
```typescript
import { 
  chatCompletions, 
  imagesGenerations, 
  audioSpeech 
} from '@/lib/apiClient';

// Использование:
const response = await chatCompletions({
  model: 'gpt-3.5-turbo',
  messages: [...]
});
```

## 🚀 Как развернуть

### На сервере

1. **Копируем конфиги:**
```bash
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo ln -sf /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/
```

2. **Проверяем Nginx:**
```bash
sudo nginx -t
```

3. **Перезагружаем:**
```bash
sudo systemctl restart nginx
```

4. **Запускаем сервисы:**
```bash
sudo systemctl restart teacher-proxy teacher-frontend
```

### Локально (development)

1. **Запускаем dev серверы:**
```bash
./start-servers.sh
```

2. **Открываем:**
```
http://localhost:1037/
```

3. **API вызовы автоматически идут на:**
```
http://localhost:1038/api/...
```

## ✅ Проверка

### 1. Health check
```bash
curl https://teacher.windexs.ru/api/health
```

Ответ:
```json
{"status":"OK","timestamp":"..."}
```

### 2. Test chat completions
```bash
curl -X POST https://teacher.windexs.ru/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### 3. Проверить логи
```bash
sudo journalctl -u teacher-proxy -f
sudo journalctl -u teacher-frontend -f
sudo journalctl -u nginx -f
```

## 📊 Архитектура

```
Browser 
  ↓
HTTPS (порт 443)
  ↓
Nginx (teacher.windexs.ru)
  ├─ /api/*  ──→ Proxy Server (1038)
  │            ↓
  │          OpenAI API
  │
  └─ /       ──→ Frontend (1031)
                ↓
              React App
```

## 🎯 Результат

Пользователь видит:
```
https://teacher.windexs.ru/
```

Все порты скрыты, работает как одно приложение!

API вызовы:
```
https://teacher.windexs.ru/api/chat/completions
https://teacher.windexs.ru/api/images/generations
https://teacher.windexs.ru/api/audio/speech
https://teacher.windexs.ru/api/models
https://teacher.windexs.ru/api/health
```

## 📝 Важные моменты

1. **SSL сертификат обязателен**
   ```bash
   sudo certbot --nginx -d teacher.windexs.ru
   ```

2. **Frontend порт не меняется в браузере**
   - Пользователь видит: `https://teacher.windexs.ru`
   - Не видит: `:1031` или `:1038`

3. **API ключ безопасен**
   - Хранится на сервере в `.env`
   - Не отправляется в браузер
   - Используется только прокси-сервером

4. **CORS автоматически решен**
   - Frontend на той же домене
   - Нет необходимости в CORS хэдерах

## 🔄 Процесс запроса

### Локально (development)
```
1. Browser: GET http://localhost:1037/
2. Vite serves React app
3. React: POST http://localhost:1037/api/chat/completions
4. Vite proxy: (перенаправляет на) http://localhost:1038/api/chat/completions
5. Proxy Server: Отправляет в OpenAI API
```

### На продакшене
```
1. Browser: GET https://teacher.windexs.ru/
2. Nginx: (перенаправляет на) http://localhost:1031
3. Frontend Server: Serves React app
4. React: POST https://teacher.windexs.ru/api/chat/completions
5. Nginx: (перенаправляет на) http://localhost:1038/api/chat/completions
6. Proxy Server: Отправляет в OpenAI API
```

## 💡 Преимущества

✅ Чистый URL без портов  
✅ Все маршруты идут через Nginx  
✅ API ключ защищен на сервере  
✅ Можно использовать CDN для static файлов  
✅ Легко масштабируется  
✅ Стандартная production архитектура  

## 🆘 Troubleshooting

### API не работает
```bash
# Проверить прокси лог
sudo journalctl -u teacher-proxy -n 50

# Проверить если слушает на 1038
netstat -tlnp | grep 1038

# Проверить если frontend может обратиться
curl http://localhost:1038/health
```

### Frontend не загружается
```bash
# Проверить frontend лог
sudo journalctl -u teacher-frontend -n 50

# Проверить если слушает на 1031
netstat -tlnp | grep 1031

# Проверить если nginx может обратиться
curl http://localhost:1031
```

### Nginx ошибки
```bash
# Проверить конфиг
sudo nginx -t

# Лог
sudo tail -f /var/log/nginx/error.log
```

