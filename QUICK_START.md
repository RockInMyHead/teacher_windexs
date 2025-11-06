# 🚀 Быстрый старт

## 🎯 Три минуты к готовому приложению

### 1. Локально (Development)

```bash
# Перейти в папку проекта
cd windexs-ai-learn

# Запустить все серверы
./start-servers.sh
```

**Откройте в браузере:**
```
http://localhost:1037/
```

✅ Готово! API вызовы идут на `http://localhost:1037/api/`

---

### 2. На сервере (Production)

```bash
# Перейти в папку проекта
cd windexs-ai-learn

# Быстрое развертывание (один скрипт!)
./quick-deploy.sh
```

**Откройте в браузере:**
```
https://teacher.windexs.ru/
```

✅ Готово! API вызовы идут на `https://teacher.windexs.ru/api/`

---

## 📋 Что происходит

### start-servers.sh (Development)
```bash
$ ./start-servers.sh

📱 Frontend (Vite): порт 1037
🤖 Proxy (OpenAI): порт 1038
✅ Все серверы запущены!
🌐 Приложение доступно: http://localhost:1037
```

### quick-deploy.sh (Production)
```bash
$ ./quick-deploy.sh

✓ .env файл проверен
✓ Зависимости установлены
✓ Build завершен
✓ Nginx конфигурация скопирована
✓ Сервисы созданы и запущены
🎉 Развертывание завершено успешно!

🌐 Сайт: https://teacher.windexs.ru
🤖 API:  https://teacher.windexs.ru/api/
```

---

## 🔧 Первая настройка

### 1. Создать .env файл

```bash
cp env.example .env
nano .env
```

Добавить ваш API ключ:
```
VITE_OPENAI_API_KEY=sk-...
OPENAI_API_KEY=sk-...
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Готово!

Выбрать:
- **Development**: `./start-servers.sh`
- **Production**: `./quick-deploy.sh`

---

## 🌐 Структура URL

### Development
```
Frontend:  http://localhost:1037/
API:       http://localhost:1037/api/chat/completions
Proxy:     http://localhost:1038/api/chat/completions (прямой доступ)
```

### Production
```
Frontend:  https://teacher.windexs.ru/
API:       https://teacher.windexs.ru/api/chat/completions
Proxy:     https://teacher.windexs.ru/api/ (через Nginx)
```

**Главное отличие: Нет портов!** 🎉

---

## 🧪 Проверка API

### Development
```bash
# Health check
curl http://localhost:1038/health

# Test API
curl -X POST http://localhost:1037/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'
```

### Production
```bash
# Health check
curl https://teacher.windexs.ru/api/health

# Test API
curl -X POST https://teacher.windexs.ru/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'
```

---

## 📊 Какие порты используются

| Режим | Компонент | Порт | URL |
|-------|-----------|------|-----|
| **Dev** | Frontend | 1037 | http://localhost:1037 |
| **Dev** | Proxy | 1038 | http://localhost:1038 |
| **Prod** | Frontend | 1031 | (не видно, через Nginx) |
| **Prod** | Proxy | 1038 | (не видно, через Nginx) |
| **Prod** | Nginx | 80/443 | https://teacher.windexs.ru |

---

## 🛑 Остановка серверов

### Development
```bash
./stop-servers.sh
```

### Production
```bash
sudo systemctl stop teacher-proxy teacher-frontend
```

---

## 📖 Подробная информация

Если нужно больше деталей:

- **SUMMARY.md** - Что было изменено
- **DOMAIN_CONFIG.md** - Полная конфигурация доменов
- **PROXY_CONFIGURATION.md** - Как работает прокси
- **DEPLOYMENT_CHECKLIST.md** - Чек-лист перед production
- **DEPLOYMENT_GUIDE.md** - Полный гайд развертывания

---

## 💡 Полезные команды

```bash
# Проверить статус сервисов (production)
sudo systemctl status teacher-proxy teacher-frontend

# Перезапустить сервисы (production)
sudo systemctl restart teacher-proxy teacher-frontend

# Смотреть логи в реальном времени (production)
sudo journalctl -u teacher-proxy -f
sudo journalctl -u teacher-frontend -f

# Проверить какие порты слушают
netstat -tlnp | grep -E "(1031|1037|1038)"

# Протестировать Nginx конфиг
sudo nginx -t
```

---

## 🚨 Если что-то не работает

### Dev сервер не стартует
```bash
# Проверить если порт занят
netstat -tlnp | grep 1037

# Если занят, найти процесс и убить
sudo kill -9 <PID>

# Перезапустить
./start-servers.sh
```

### API вызовы не работают
```bash
# Проверить здоровье прокси
curl http://localhost:1038/health

# Посмотреть логи
journalctl -u teacher-proxy -n 50
```

### Production не работает
```bash
# Проверить Nginx
sudo nginx -t
sudo systemctl restart nginx

# Проверить сервисы
sudo systemctl status teacher-proxy teacher-frontend

# Посмотреть логи
sudo journalctl -u teacher-proxy -f
```

---

## ✅ Готово!

Теперь вы готовы:

- ✅ Запустить локально: `./start-servers.sh`
- ✅ Развернуть на production: `./quick-deploy.sh`
- ✅ Открыть браузер и начать использовать приложение
- ✅ Делать API вызовы через прокси

**Удачи с разработкой! 🚀**

