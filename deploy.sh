#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  SUFRA AMMAN - LUXURY QR AR MENU & AI WAITER DEPLOYMENT   "
echo "  Target: Firebase Hosting (*.web.app / *.firebaseapp.com) "
echo "=========================================================="

# 1. Build production distribution
echo "📦 Step 1: Building production bundle with Vite & TypeScript..."
npm run build

echo "✅ Step 1 complete: dist/ generated successfully."

# 2. Check if Firebase CLI is logged in
echo "🚀 Step 2: Preparing Firebase deployment..."

if ! command -v firebase &> /dev/null
then
    echo "Firebase CLI not found in PATH. Using npx firebase-tools..."
    FIREBASE_CMD="npx --yes firebase-tools"
else
    FIREBASE_CMD="firebase"
fi

echo "To deploy to your Firebase project (*.web.app):"
echo "1) Run: $FIREBASE_CMD login"
echo "2) Run: $FIREBASE_CMD init hosting (choose existing project or create new)"
echo "3) Run: $FIREBASE_CMD deploy --only hosting"
echo ""
echo "Your app will be live at: https://<YOUR-PROJECT-ID>.web.app"
