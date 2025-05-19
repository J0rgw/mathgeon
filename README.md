# Mathgeon

Mathgeon is a retro-styled, pixel-art inspired **web roguelite game** where your weapon is logic and math. You progress by solving equations inside dungeons, and compete in global leaderboards.

Built with **React 19**, **TypeScript 5**, **Firebase Realtime Database**, and **Vite**, featuring a nostalgic pixel-art interface with smooth animations and responsive design.

![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/J0rgw/mathgeon)![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)![Typst](https://img.shields.io/badge/typst-239DAD.svg?style=for-the-badge&logo=typst&logoColor=white)

---

## Project Structure

```
mathgeon/
├── public/                  # Static assets
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── McButton.tsx      # Custom pixel-art button component
│   │   ├── McInput.tsx       # Styled input component
│   │   └── AlertMessage.tsx  # Alert/notification component
│   │
│   ├── logic/                # Core game logic
│   │   └── gameplay/         # Game mechanics
│   │       ├── equation.ts   # Equation handling
│   │       ├── generators.ts # Equation generation
│   │       └── solver.ts     # Math solving logic
│   │
│   ├── pages/                # Application pages
│   │   ├── Home.tsx          # Main menu and navigation
│   │   ├── Play.tsx          # Gameplay screen
│   │   └── Admin.tsx         # Admin interface
│   │
│   ├── routes/               # Application routing
│   │   └── AppRouter.tsx     # Route definitions
│   │
│   ├── services/             # External services
│   │   ├── firebase.ts       # Firebase config and auth
│   │   └── highscore.ts      # High score management
│   │
│   ├── styles/               # CSS styles
│   │   ├── animations.css    # CSS animations
│   │   ├── book.css          # Book-style UI
│   │   ├── gameplay.css      # Gameplay-specific styles
│   │   ├── homeLayout.css    # Layout components
│   │   └── main.css          # Global styles
│   │
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Root component
│   ├── index.tsx             # Application entry point
│   └── vite-env.d.ts         # Vite type definitions
│
├── .gitignore
├── database.rules.json        # Firebase security rules
├── firebase.json             # Firebase configuration
├── package.json              # Project dependencies and scripts
├── README.md                 # This file
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

---

## Tech Stack

### Frontend
- **React 19** - Modern UI library for building interactive user interfaces
- **TypeScript 5** - Static typing for JavaScript
- **Vite** - Next-generation frontend tooling for fast development
- **React Router 6** - Client-side routing
- **CSS Modules** - Component-scoped styles

### Backend & Infrastructure
- **Firebase Authentication** - User management and authentication
- **Firebase Realtime Database** - Real-time data synchronization

### Game Logic
- **Mathsteps** - Advanced equation solving and manipulation
- **Custom Equation Generator** - Dynamic problem generation
- **State Management** - Built-in React hooks for state management

### Styling & UI
- **Pixel-Art Design** - Retro gaming aesthetic
- **CSS Animations** - Smooth transitions and effects
- **Google Fonts** - `Press Start 2P` for authentic retro feel
- **Responsive Design** - Works on various screen sizes

---

## Core Features

### Gameplay

- **Math-Based Challenges**
  - Solve equations to progress through dungeon rooms
  - Progressive difficulty scaling
  - Multiple operation types (addition, subtraction, multiplication, division)
  - Combo system for consecutive correct answers

- **Dungeon System**
  - Multiple dungeons with unique themes
  - Up to 10 rooms per dungeon
  - Lives system with limited attempts

### User System

- **Authentication**
  - Email/password registration and login
  - Username-based profiles
  - Secure password management
  - Session persistence

- **Progress Tracking**
  - High scores per dungeon
  - Room progression tracking
  - Achievement system
  - Combo statistics

### Leaderboard

- Global rankings for each dungeon
- Real-time updates
- Top 10 players display
- Detailed score breakdowns
- Username display with safe text handling

### Admin Features

- Special administrative interface
- User management tools
- Game statistics and analytics
- Content management system
- Dungeon configuration

### UI/UX

- Retro pixel-art aesthetic
- Smooth animations and transitions
- Intuitive navigation
- Responsive design for desktop and mobile
- Accessible interface

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/J0rgw/mathgeon.git
   cd mathgeon
   ```

2. **Install dependencies**
   ```bash
   npm install @types/node
   ```

3. **Set up Firebase**
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Set up a Realtime Database with appropriate security rules
   - Create a `.env` file in the project root with your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     VITE_EQUATIONS_ENDPOINT=your-equations-api-endpoint
     ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   # or
   yarn build
   yarn preview
   ```

## Firebase Database Structure

```json
{
  "users": {
    "UID123": {
      "username": "MathMaster",
      "email": "user@example.com",
      "createdAt": 1620000000000,
      "isAdmin": false
    }
  },
  "dungeons": {
    "cavern-of-addition": {
      "name": "Cavern of Addition",
      "difficulty": "easy",
      "description": "Master the basics of addition"
    },
    "temple-of-subtraction": {
      "name": "Temple of Subtraction",
      "difficulty": "medium",
      "description": "Test your subtraction skills"
    }
  },
  "userProgress": {
    "UID123": {
      "cavern-of-addition": {
        "score": 2500,
        "highestLevel": 10,
        "lastPlayed": 1620000000000,
        "completed": true
      }
    }
  },
  "leaderboard": {
    "cavern-of-addition": {
      "UID123": {
        "username": "MathMaster",
        "score": 2500,
        "timestamp": 1620000000000
      }
    }
  }
}
```
---

## TODO

- Responsive mobile layout

---
## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Code Style

- Use TypeScript types wherever possible
- Keep components small and focused
- Write meaningful commit messages

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [Grand](https://github.com/A31Nesta/grand) for equation solving
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for build tooling
