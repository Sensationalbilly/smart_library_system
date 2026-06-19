# Smart Financial Shield App

React Native mobile application for personal financial management using Expo.

## Overview

A cross-platform mobile app (iOS, Android, Web) built with React Native and Expo that helps users manage their finances with transaction tracking and analytics.

## Project Structure

```
smart-financial-shield-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Dashboard overview
│   │   ├── TransactionsScreen.js  # Transaction management
│   │   ├── AnalyticsScreen.js     # Financial analytics
│   │   └── SettingsScreen.js      # App settings
│   ├── components/
│   │   ├── TransactionCard.js     # Transaction display component
│   │   ├── CategoryBadge.js       # Category indicator
│   │   └── StatCard.js            # Statistics display
│   ├── services/
│   │   ├── api.js                 # API client
│   │   ├── storage.js             # Local storage management
│   │   └── auth.js                # Authentication
│   ├── constants/
│   │   ├── colors.js              # Color palette
│   │   ├── categories.js          # Transaction categories
│   │   └── config.js              # App configuration
│   └── utils/
│       ├── formatters.js          # Data formatting utilities
│       ├── validators.js          # Input validation
│       └── helpers.js             # Helper functions
├── assets/                         # Images and icons
├── __tests__/                      # Test files
├── App.js                          # Root component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── jest.config.js                  # Jest testing configuration
├── babel.config.js                 # Babel configuration
└── README.md                       # This file
```

## Prerequisites

- Node.js 16+ or later
- npm or yarn
- Expo CLI

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Expo CLI globally (optional):**
```bash
npm install -g expo-cli
```

## Development

### Start the development server:

```bash
npm start
```

This opens Expo Go menu where you can:
- **Press `i`** to open iOS simulator
- **Press `a`** to open Android emulator
- **Press `w`** to open web browser
- **Scan QR code** with Expo Go app on physical device

### Development Scripts

```bash
# Start Expo server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Run tests
npm test

# Run linter
npm run lint

# Eject from Expo (caution: cannot be reversed)
npm run eject
```

## Project Features

- **Dashboard** - Overview of financial summary
- **Transactions** - Add, view, and manage transactions
- **Analytics** - Visual charts and financial insights
- **Settings** - User preferences and configuration
- **Bottom Tab Navigation** - Easy navigation between sections
- **Local Storage** - Persist data locally using AsyncStorage
- **API Integration** - Connect to backend for sync

## API Integration

The app connects to the backend API for:
- Creating transactions
- Fetching transaction history
- Generating analytics

Configure the API endpoint in `src/constants/config.js`.

## Testing

Run tests with Jest:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## Building for Production

### iOS Build

```bash
eas build --platform ios
```

### Android Build

```bash
eas build --platform android
```

### Web Build

```bash
eas build --platform web
```

## Folder Structure

**`src/screens/`** - Main screen components for each tab
**`src/components/`** - Reusable UI components
**`src/services/`** - API and data management services
**`src/constants/`** - Configuration and constants
**`src/utils/`** - Utility functions

## Navigation

The app uses React Navigation with:
- **Bottom Tab Navigator** - Main navigation between 4 tabs
- **Stack Navigator** - Header navigation in each tab

## Styling

- React Native StyleSheet for component styling
- Color theme from `src/constants/colors.js`
- Ionicons for tab icons

## Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=Smart Financial Shield
```

## Performance Optimization

- Lazy loading screens
- Memoized components to prevent unnecessary re-renders
- Image optimization
- Code splitting

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Commit with clear messages
5. Push and create a Pull Request

## Troubleshooting

### Port 19000 already in use
```bash
lsof -ti:19000 | xargs kill -9
```

### Clear Expo cache
```bash
expo start --clear
```

### Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
