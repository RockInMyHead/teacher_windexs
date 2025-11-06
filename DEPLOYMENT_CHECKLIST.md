# ✅ Чек-лист развертывания

## 🔍 Перед развертыванием

- [ ] .env файл создан с `OPENAI_API_KEY`
- [ ] SSL сертификаты установлены (Let's Encrypt)
- [ ] Домен `teacher.windexs.ru` указывает на сервер
- [ ] Порты открыты: 80, 443, 1031, 1038

## 🏗️ Развертывание

### 1. Подготовка
```bash
cd /path/to/teacher
cp env.example .env
# Отредактировать .env и добавить OPENAI_API_KEY
nano .env
```
- [ ] .env файл заполнен

### 2. Установка зависимостей
```bash
npm install
```
- [ ] npm install завершен

### 3. SSL сертификаты
```bash
sudo certbot --nginx -d teacher.windexs.ru
```
- [ ] Сертификаты установлены
- [ ] Nginx перезагружен

### 4. Сборка
```bash
./deploy-production.sh
```
- [ ] Build завершен
- [ ] Конфигурация Nginx скопирована
- [ ] Сервисы созданы

## 🧪 Проверка

### Health checks
```bash
# Прокси
curl https://teacher.windexs.ru/api/health

# Frontend
curl https://teacher.windexs.ru/

# Nginx status
sudo systemctl status nginx
```
- [ ] API health check успешен
- [ ] Frontend доступен
- [ ] Nginx запущен

### Логи
```bash
# Проверить все логи
sudo journalctl -u teacher-proxy -n 20
sudo journalctl -u teacher-frontend -n 20
sudo tail -f /var/log/nginx/error.log
```
- [ ] Нет ошибок в логах
- [ ] Сервисы стартуют нормально

### API Тест
```bash
curl -X POST https://teacher.windexs.ru/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```
- [ ] API вызов работает
- [ ] Ответ от OpenAI получается

## 🔐 Безопасность

- [ ] HTTPS работает (301 редирект с HTTP)
- [ ] API ключ в .env (не в коде)
- [ ] API ключ не видно в браузере (DevTools)
- [ ] CORS настроен правильно
- [ ] Прокси запросы логируются

## 📊 Мониторинг

Установить алерты для:
- [ ] CPU использование
- [ ] Memory использование
- [ ] Disk space
- [ ] Service crashes
- [ ] API errors

## 🔧 Поддержка

### Перезапуск сервисов
```bash
sudo systemctl restart teacher-proxy teacher-frontend nginx
```

### Проверка портов
```bash
netstat -tlnp | grep -E "(80|443|1031|1038)"
```

### Очистка кэша
```bash
sudo systemctl restart nginx
```

### Обновление конфигурации
```bash
sudo cp nginx-teacher.conf /etc/nginx/sites-available/teacher.windexs.ru
sudo nginx -t
sudo systemctl reload nginx
```

## 📝 Документация

- [ ] Прочитана: `DOMAIN_CONFIG.md`
- [ ] Прочитана: `PROXY_CONFIGURATION.md`
- [ ] Прочитана: `DEPLOYMENT_GUIDE.md`
- [ ] Прочитана: `README.md`

## 🚀 Go Live

- [ ] Все проверки пройдены
- [ ] Уведомлены пользователи
- [ ] Скриншот статус страницы сделан
- [ ] Готово к production

## 📞 Контакты для помощи

При проблемах:
1. Проверить логи: `journalctl -u teacher-proxy -f`
2. Проверить здоровье: `curl https://teacher.windexs.ru/api/health`
3. Посмотреть nginx ошибки: `sudo tail -f /var/log/nginx/error.log`

