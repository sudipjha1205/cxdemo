#!/bin/bash
set -e
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   CX Intelligence Platform — Setup    ║"
echo "╚═══════════════════════════════════════╝"
echo ""
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Backend
echo "📦 Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "⚠️  Set ANTHROPIC_API_KEY in backend/.env then press Enter"
  read -p ""
fi
pip install -r requirements.txt -q
echo "✅ Backend ready"

# Frontend
echo "📦 Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --silent
echo "✅ Frontend ready"

echo ""
echo "🚀 Starting servers..."
cd "$SCRIPT_DIR/backend" && python3 app.py &
BACKEND_PID=$!
sleep 2
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Running!"
echo "   Open http://localhost:5173 in your browser"
echo "   Press Ctrl+C to stop"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT INT TERM
wait
