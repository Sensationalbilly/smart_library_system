# SMART FINANCIAL SHIELD — Expo Starter

This is a minimal Expo starter project for the SMART FINANCIAL SHIELD AI app. It includes a small scaffold with a home screen and a scam detection screen that POSTs text to your backend `/risk` endpoint.

Quick start

1. Install Expo CLI (if you don't have it):

```powershell
npm install -g expo-cli
```

2. From this folder, install dependencies:

```powershell
cd smart-financial-shield-starter
npm install
```

3. Run the app:

```powershell
npm start
```

Update API URL

Open `src/services/api.js` and replace `https://your-api-gateway-url` with your backend URL.

Files of interest

- `App.js` — main navigator
- `src/screens/ScamDetectionScreen.js` — sample UI + axios POST to `/risk`
- `src/services/api.js` — simple API wrapper

Now you can expand screens, add authentication, and plug in AI features.
