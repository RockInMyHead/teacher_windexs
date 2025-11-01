# Проверка статуса серверов
VITE_DEV_PORT=${VITE_DEV_PORT:-1037}
PROXY_PORT=${PROXY_PORT:-1038}

echo "=== Vite Dev Server (порт $VITE_DEV_PORT) ==="
curl -s -o /dev/null -w '%{http_code}' http://localhost:$VITE_DEV_PORT && echo ' ✅ Работает' || echo ' ❌ Не работает'

echo "=== Proxy Server (порт $PROXY_PORT) ==="
curl -s -o /dev/null -w '%{http_code}' http://localhost:$PROXY_PORT/health && echo ' ✅ Работает' || echo ' ❌ Не работает'

echo ''
echo "🌐 Откройте в браузере: http://localhost:$VITE_DEV_PORT"
echo "🤖 AI функции доступны через прокси: http://localhost:$PROXY_PORT"
