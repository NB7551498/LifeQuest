# ⚔️ LifeQuest — The Real Life RPG

> **Turn your real-life productivity into an RPG.** Create quests, earn XP and gold, develop your character's attributes, maintain daily streaks, unlock achievements, and become legendary.

LifeQuest is a full-stack gamified productivity app built with **Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase (PostgreSQL + Auth)**. It treats real-world tasks as quests with a persistent RPG economy — every completed quest is a record in your permanent quest log, not just a checkbox.

---

## ✨ Features

### ⚔️ Quest System
- Create quests with title, category, difficulty, attribute, deadline, and recurrence
- Server-calculated rewards: **XP**, **Gold**, and **Attribute XP** scale with difficulty
- Recurring quests stay active with a completion history
- Preview expected rewards while creating a quest
- Optimistic UI completion with rollback on failure

### 🧬 Character & RPG Engine
- **6 attributes**: Intellect 🧠, Strength 💪, Vitality ❤️, Discipline 🎯, Creativity ✨, Social 💬
- Each quest trains its relevant attribute
- **Non-linear XP curve**: `XP for level N = ⌊100 × N^1.5⌋` — later levels require progressively more XP
- Titles unlock with level: Novice → Apprentice → Adventurer → Warrior → Elite → Master → Legend

### 🔥 Streaks
- Timezone-safe daily streak tracking
- Streak bonuses scale with streak length
- Milestone bonuses (3 / 7 / 14 / 30-day)
- Weekly activity view

### 🪙 Economy & Shop
- Earn gold from quests, streaks, and achievements
- Spend gold in the Hero Shop on weapons, shields, badges, themes, and consumables
- Server-side price verification — the client can never set its own rewards

### 🎒 Inventory
- Purchased items are stored in your inventory
- **Equip / Unequip** weapons, shields, badges, and themes (one item per slot)
- Items show rarity color coding

### 🏆 Achievements
- 15 seeded achievements (first blood, streak milestones, level milestones, attribute mastery, economy, speed running)
- Progress bars for locked achievements
- Unlocking awards bonus XP + gold

### 📊 Analytics & History
- Weekly XP bar chart + 7-day trend
- Completion rate, best attribute, attribute radar
- Full transaction history (earned/spent/achievement/streak)

#### 🎮 Arena Mini-Games & Quizzes
- **Skill Games** ([`/app/games`](http://localhost:3000/app/games)): Reaction Challenge, Memory Trial, Number Sprint, and Logic Dungeon
- **Knowledge Arena** ([`/app/quizzes`](http://localhost:3000/app/quizzes)): Python, Java, General Knowledge, Current News, and Developer Do's & Don'ts
- Difficulty Tiers (Easy +20 XP, Medium +40 XP, Hard +75 XP, Expert +120 XP) with automated RPG attribute rewards

### 🐉 Boss Battles & Adventure Map
- **Boss Battles** ([`/app/boss`](http://localhost:3000/app/boss)): Daily task completions deal real HP damage to active productivity bosses (e.g. *The Procrastination Dragon*).
- **World Map** ([`/app/map`](http://localhost:3000/app/map)): Visual adventure node graph with level unlock progression.

### 💾 Local JSON Persistence & Auth Fallback
- Local persistent file database (`data/db.json`) guarantees instant offline demo mode functionality.

---

## 🛠 Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling  | Tailwind CSS v4, Framer Motion, Recharts |
| Forms    | React Hook Form + Zod |
| Backend  | Next.js Route Handlers (`src/app/api/*`) |
| Storage  | Local JSON Database (`data/db.json`) + Supabase / PostgreSQL |
| Auth     | Supabase Auth + Instant Demo Mode |
| Deployment | Vercel + Supabase |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/NB7551498/LifeQuest.git
cd LifeQuest
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — click **🎮 Enter Realm (Instant Demo)** and start adventuring immediately without mandatory external database setups!

---

## 🔌 API Routes

| Method | Route                          | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| GET    | `/api/profile`                 | Fetch profile + stats + streak    |
| PATCH  | `/api/profile`                 | Update username / avatar          |
| GET    | `/api/quests`                  | List quests (filterable by day/attribute)|
| POST   | `/api/quests`                  | Create a quest                    |
| GET    | `/api/quests/:id`              | Fetch a single quest              |
| PATCH  | `/api/quests/:id`              | Update a quest                    |
| DELETE | `/api/quests/:id`              | Delete (abandon) an active quest  |
| POST   | `/api/quests/:id/complete`     | Complete quest → full RPG engine  |
| POST   | `/api/auth/register`           | Register new user                 |
| POST   | `/api/auth/login`              | Authenticate user                 |
| GET    | `/api/auth/me`                 | Fetch authenticated user info     |
| GET    | `/api/todos`                   | List todos by day & priority      |
| POST   | `/api/todos`                   | Create todo task                  |
| PATCH  | `/api/todos/:id/toggle`        | Toggle todo completion            |
| DELETE | `/api/todos/:id`               | Delete todo task                  |
| GET    | `/api/quiz/categories`         | Fetch quiz categories catalog     |
| GET    | `/api/quiz/questions/:category`| Fetch quiz questions for category |
| POST   | `/api/quiz/submit`             | Grade answers & award RPG XP/Gold |
| GET    | `/api/user/stats`              | User metrics & category scores    |
| DELETE | `/api/user/reset`              | Reset user data & stats           |
| POST   | `/api/shop/purchase`           | Buy an item with gold             |
| POST   | `/api/inventory/:id/equip`     | Equip / unequip an inventory item |
| GET    | `/api/analytics`               | Raw analytics payload             |

### The `complete` endpoint runs the whole RPG engine server-side:

```
Complete quest → verify ownership & status → calculate XP/Gold/Attribute XP
    → streak bonus + milestone → level-up → title update
    → write completion, profile, stats, transactions
    → evaluate & reward achievements → return rewards payload
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # /login, /signup, /auth-callback
│   ├── app/             # /app/* dashboard (sidebar layout)
│   ├── api/             # Route handlers (all business logic)
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/          # Sidebar, header, mobile nav
│   └── rpg/             # XP bar, quest card, level-up modal, etc.
├── lib/
│   ├── rpg/             # XP, streak, achievement, title engines
│   ├── supabase/        # Browser / server / admin clients
│   ├── types/           # Database + API types
│   └── validation/      # Zod schemas
└── proxy.ts             # Auth-gated route protection (Next.js 16 Proxy)

supabase/
├── migrations/001_initial_schema.sql
└── seed.sql
```

---

## ☁️ Deploying

### Supabase
- Already configured via the migration + seed scripts above.

### Vercel
1. Push this repository to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables from your Supabase project
4. Deploy 🎉

---

## 📄 License

[MIT](./LICENSE) © 2026 Nikhil Rajbhar

---

**Built by [Nikhil Rajbhar](https://github.com/NB7551498)** — now go slay some quests. 🐉
