#!/bin/bash

echo "🛑 Остановка серверов Windexs-Учитель..."

# Останавливаем все процессы node и vite
pkill -f "vite" 2>/dev/null && echo "✅ Vite dev server остановлен" || echo "ℹ️ Vite dev server не найден"
pkill -f "proxy-server.cjs" 2>/dev/null && echo "✅ Proxy server остановлен" || echo "ℹ️ Proxy server не найден"
pkill -f "node.*proxy-server" 2>/dev/null && echo "✅ Node proxy server остановлен" || echo "ℹ️ Node proxy server не найден"

echo ""
echo "✅ Все серверы остановлены!"
