# Mathgeon

Mathgeon is a retro-styled, pixel-art inspired **web roguelite game** where your weapon is logic and math. You progress by solving equations inside dungeons, level up, and compete in global leaderboards.

Built with **React**, **TypeScript**, **Firebase Realtime Database**, and custom animated CSS for a nostalgic book-style scroll interface.

---

## Project Structure

```
mathgeon/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── McButton.tsx        # Custom pixel-art button component
│   │   └── McInput.tsx         # Styled input component
│   ├── pages/
│   │   └── Home.tsx            # Main logic and UI container
│   ├── services/
│   │   └── firebase.ts         # Firebase config and auth
│   ├── styles/
│   │   ├── book.css            # Scroll book UI styles
│   │   ├── main.css            # Global pixel font and base styles
│   │   ├── animations.css      # Title animation and page transitions
│   │   └── homeLayout.css      # Layouts, leaderboard, profile, form styling
│   └── index.tsx
├── package.json
└── README.md
```

---

## Tech Stack

- **React** + **React Router**
- **TypeScript**
- **Firebase Auth & Realtime DB**
- **Custom CSS Book-Style Scroll UI**
- **Google Font: `Press Start 2P`**
- **Pixel art-inspired UI + retro styling**

---

## Core Features

### Book-style Navigation

- Horizontal scroll snap UI using `carousel`
- Each "page" is part of a book layout:
  1. Title + Game Description
  2. Login/Register or Profile
  3. Dungeon Selector
  4. Leaderboard

### Authentication

- Sign up with email, username & password
- Login using **username** (email retrieved from DB)
- Profile displays: username, email, hidden password
- Change password & logout options

### Dungeons

- Pulled from Firebase under `/dungeons`
- Each dungeon has:
  - Name
  - Unique difficulty
  - Operation types
- Will include math gameplay in future iteration

### Leaderboard

- Pulls scores from `/userProgress`
- Displays **top 10 per dungeon**
- Names, scores, and rank aligned in retro style
- Supports long usernames with safe wrapping
- Scrollable selector for dungeon category

---

## ⚙️ Running the Project

1. **Install dependencies**

```bash
npm install
```

2. **Start dev server**

```bash
npm run dev
```

3. Make sure to configure your Firebase project in `firebase.ts`

---

## Firebase Structure

```json
{
  "users": {
    "UID123": {
      "username": "BigBoss999",
      "email": "big@boss.com"
    }
  },
  "dungeons": {
    "Cavern-of-Addition": { "name": "Cavern of Addition" }
  },
  "userProgress": {
    "UID123": {
      "Cavern-of-Addition": {
        "score": 2200,
        "highestLevel": 7
      }
    }
  }
}
---
## 📌 TODO

- Implement core math gameplay loop
- Add score multipliers
- Store high scores in real time
- Responsive mobile layout
---
