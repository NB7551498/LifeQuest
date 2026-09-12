import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LifeQuest - Your Real Life RPG',
  description: 'Turn your real-life productivity into an RPG. Build habits, complete quests, level up, and become legendary.',
  keywords: ['productivity', 'rpg', 'habit tracker', 'gamification', 'quests'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
