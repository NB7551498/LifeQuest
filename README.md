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

### 🔐 Security
- **All reward calculation happens server-side** — clients only send `POST /api/quests/:id/complete`
- Server verifies authentication, quest ownership, and `active` status (no duplicate completions)
- Row Level Security (RLS) enabled on all tables
- Server-side Zod validation on every API boundary

---

## 🛠 Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling  | Tailwind CSS v4, Framer Motion, Recharts |
| Forms    | React Hook Form + Zod |
| Backend  | Next.js Route Handlers (`src/app/api/*`) |
| Database | Supabase / PostgreSQL + Row Level Security |
| Auth     | Supabase Auth (email/password) |
| Deployment | Vercel + Supabase |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/NB7551498/LifeQuest.git
cd LifeQuest
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. In **SQL Editor**, run the two scripts in order:
   - `supabase/migrations/001_initial_schema.sql` — creates all tables, triggers, and RLS policies
   - `supabase/seed.sql` — seeds shop items and achievements
3. Copy your **Project URL**, **anon key**, and **service_role key** from *Settings → API*

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — the `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and must stay secret.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — create an account and start adventuring.

### 5. Production build

```bash
npm run build
npm start
```
---

## 🗄 Database Schema

| Table              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `profiles`         | User identity, level, total XP, gold, title          |
| `character_stats`  | The six trainable attributes                         |
| `quests`           | User quests with server-assigned rewards             |
| `quest_completions`| Historical log of every completion                   |
| `streaks`          | Current/longest streak + last activity date          |
| `items`            | Shop catalog (seeded)                                |
| `inventory`        | Purchased items, quantities, equipped state          |
| `achievements`     | Achievement definitions (seeded)                     |
| `user_achievements`| Unlocked per-user achievements                       |
| `transactions`     | Permanent XP/gold ledger                             |

An `AFTER INSERT ON auth.users` trigger automatically creates the `profile`, `character_stats`, and `streaks` row for every new signup.

---

## 🔌 API Routes

| Method | Route                          | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| GET    | `/api/profile`                 | Fetch profile + stats + streak    |
| PATCH  | `/api/profile`                 | Update username / avatar          |
| GET    | `/api/quests`                  | List quests (filterable)          |
| POST   | `/api/quests`                  | Create a quest                     |
| GET    | `/api/quests/:id`              | Fetch a single quest              |
| PATCH  | `/api/quests/:id`              | Update a quest                     |
| DELETE | `/api/quests/:id`              | Delete (abandon) an active quest   |
| POST   | `/api/quests/:id/complete`     | Complete quest → full RPG engine   |
| POST   | `/api/shop/purchase`           | Buy an item with gold              |
| POST   | `/api/inventory/:id/equip`     | Equip / unequip an inventory item  |
| GET    | `/api/analytics`               | Raw analytics payload              |

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
