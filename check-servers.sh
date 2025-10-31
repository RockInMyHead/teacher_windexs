# Проверка статуса серверов
echo '=== Vite Dev Server (порт 4000) ==='
curl -s -o /dev/null -w '%{http_code}' http://localhost:4000 && echo ' ✅ Работает' || echo ' ❌ Не работает'

echo '=== Proxy Server (порт 4002) ==='
curl -s -o /dev/null -w '%{http_code}' http://localhost:4002/health && echo ' ✅ Работает' || echo ' ❌ Не работает'

echo ''
echo '🌐 Откройте в браузере: http://localhost:4000'
echo '🤖 AI функции доступны через прокси: http://localhost:4002'
