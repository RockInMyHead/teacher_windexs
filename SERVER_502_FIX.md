# 🔴 Ошибка 502 Bad Gateway - Решение

## 🚨 Проблема

```
Bad Gateway
The proxy server received an invalid response from an upstream server.
```

Это означает, что Nginx не может подключиться к приложению.

## ✅ Решение

### Шаг 1: SSH на сервер

```bash
ssh user@teacher.windexs.ru
```

### Шаг 2: Проверить статус приложения

```bash
# Запущено ли приложение?
ps aux | grep node

# Слушает ли порт 1031?
netstat -tlnp | grep 1031

# Работает ли health check?
curl http://localhost:1031/health
```

### Шаг 3: Если приложение НЕ запущено

```bash
cd ~/windexs-ai-learn

# Установить зависимости
npm install

# Собрать проект
npm run build

# Запустить приложение
node single-port-server.cjs
```

### Шаг 4: Проверить что работает

```bash
# В другом терминале/SSH сеансе:
curl http://localhost:1031/health

# Должен вернуть: {"status":"ok"} или похожий ответ
```

### Шаг 5: Открыть в браузере

```
https://teacher.windexs.ru
```

Должно работать! ✅

## 📊 Диагностика

### Проверить логи Nginx

```bash
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log
```

### Перезагрузить Nginx

```bash
sudo systemctl restart nginx
# или
sudo service nginx restart
```

### Проверить конфигурацию Nginx

```bash
sudo nginx -t
```

## 🛠️ Если используется PM2

### Проверить статус

```bash
pm2 status
pm2 logs
```

### Перезагрузить приложение

```bash
pm2 restart all
```

## 💾 Оптимальный вариант - использовать PM2

### 1. Установить PM2

```bash
npm install -g pm2
```

### 2. Запустить приложение

```bash
cd ~/windexs-ai-learn
npm install
npm run build
pm2 start single-port-server.cjs --name="teacher-app"
pm2 save
```

### 3. Установить автозагрузку

```bash
pm2 startup
# Скопировать и выполнить выданную команду
pm2 save
```

### 4. Проверить

```bash
pm2 status          # Должен быть статус "online"
pm2 logs            # Посмотреть логи в реальном времени
```

## 🔧 Типичные ошибки и решения

### Ошибка: "Cannot find module"

```bash
npm install
npm run build
```

### Ошибка: "EADDRINUSE: address already in use :::1031"

```bash
# Порт 1031 уже занят
lsof -i :1031               # Найти процесс
kill -9 <PID>               # Убить процесс (заменить <PID>)
node single-port-server.cjs # Запустить заново
```

### Ошибка: "Cannot GET /"

Приложение работает, но Nginx конфиг неправильный. Проверить:

```bash
cat /etc/nginx/sites-available/teacher.windexs.ru
# или проверить что переведено в sites-enabled
ls -la /etc/nginx/sites-enabled/
```

## 📝 Конфигурация Nginx

Nginx должен быть настроен так:

```nginx
location / {
    proxy_pass http://localhost:1031;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Если конфига нет в sites-enabled:

```bash
# Скопировать конфиг из проекта
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru

# Включить сайт
sudo ln -s /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/

# Проверить конфиг
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl restart nginx
```

## ✨ Полная инструкция с нуля

```bash
# 1. SSH на сервер
ssh user@teacher.windexs.ru

# 2. Перейти в проект (или клонировать)
cd ~/windexs-ai-learn
# или
git clone https://github.com/RockInMyHead/teacher_windexs.git ~/windexs-ai-learn

# 3. Установить зависимости
npm install

# 4. Собрать проект
npm run build

# 5. Установить PM2 (рекомендуется)
npm install -g pm2

# 6. Запустить приложение
pm2 start single-port-server.cjs --name="teacher-app"
pm2 save

# 7. Настроить Nginx
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo ln -s /etc/nginx/sites-available/teacher.windexs.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Проверить
curl http://localhost:1031/health
curl -k https://teacher.windexs.ru/health
```

## 🎯 Когда работает правильно

Должны увидеть:

1. ✅ Процесс Node запущен:
   ```bash
   ps aux | grep node
   # node single-port-server.cjs
   ```

2. ✅ Портак 1031 слушает:
   ```bash
   netstat -tlnp | grep 1031
   # tcp  0  0 127.0.0.1:1031  LISTEN
   ```

3. ✅ Health check работает:
   ```bash
   curl http://localhost:1031/health
   # {"status":"ok"}
   ```

4. ✅ Https работает:
   ```bash
   curl -k https://teacher.windexs.ru/health
   # {"status":"ok"}
   ```

5. ✅ Браузер открывает сайт:
   ```
   https://teacher.windexs.ru
   # Должна открыться приложение БЕЗ 502 ошибки
   ```

## 📞 Если всё ещё не работает

Пришлите вывод:

1. `ps aux | grep node`
2. `netstat -tlnp | grep 1031`
3. `curl http://localhost:1031/health` (вывод)
4. `tail -50 /var/log/nginx/error.log`
5. Вывод консоли при запуске `node single-port-server.cjs`

---

**Версия:** 1.0.0  
**Дата:** Ноябрь 2025

