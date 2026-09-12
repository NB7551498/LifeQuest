"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, Hash, Puzzle, Trophy, Sparkles, RefreshCw, CheckCircle2, Award } from "lucide-react";
import {
  calculateReactionReward,
  calculateMemoryReward,
  calculateSprintReward,
  calculateLogicReward,
  GameReward,
} from "@/lib/rpg/games-engine";

export default function GamesClient() {
  const [activeTab, setActiveTab] = useState<"reaction" | "memory" | "sprint" | "logic">("reaction");
  const [rewardToast, setRewardToast] = useState<GameReward | null>(null);

  const showReward = (reward: GameReward) => {
    setRewardToast(reward);
    setTimeout(() => setRewardToast(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300">
            ⚔️ Skill Mini-Games
          </h1>
          <p className="text-slate-400 mt-1">Train your real-world cognition, focus, and agility to earn XP and Gold!</p>
        </div>
      </div>

      {/* Reward Toast Popup */}
      <AnimatePresence>
        {rewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 p-4 bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-4"
          >
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">{rewardToast.rank} Performance!</div>
              <div className="text-lg font-black text-white flex items-center gap-3">
                <span>+{rewardToast.xp} XP</span>
                <span className="text-yellow-400">+{rewardToast.gold} 🪙</span>
              </div>
              <div className="text-xs text-slate-400">+{rewardToast.attributeXp} {rewardToast.attribute} XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-3">
        {[
          { id: "reaction", label: "⚡ Reaction Challenge", icon: Zap },
          { id: "memory", label: "🧠 Memory Trial", icon: Brain },
          { id: "sprint", label: "🔢 Number Sprint", icon: Hash },
          { id: "logic", label: "🧩 Logic Dungeon", icon: Puzzle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                  : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Game Display */}
      {activeTab === "reaction" && <ReactionGame onComplete={showReward} />}
      {activeTab === "memory" && <MemoryGame onComplete={showReward} />}
      {activeTab === "sprint" && <SprintGame onComplete={showReward} />}
      {activeTab === "logic" && <LogicGame onComplete={showReward} />}
    </div>
  );
}

/* ⚡ REACTION CHALLENGE GAME */
function ReactionGame({ onComplete }: { onComplete: (reward: GameReward) => void }) {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<any>(null);

  const startTest = () => {
    setGameState("waiting");
    const delay = Math.floor(Math.random() * 3000) + 1500; // 1.5s - 4.5s random wait
    const timeout = setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, delay);
    setTimerId(timeout);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timerId);
      setGameState("idle");
      alert("Too early! Wait for the target to turn green.");
    } else if (gameState === "ready") {
      const elapsed = Date.now() - startTime;
      setReactionMs(elapsed);
      setGameState("result");
      if (!bestTime || elapsed < bestTime) setBestTime(elapsed);

      const reward = calculateReactionReward(elapsed);
      onComplete(reward);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          ⚡ Reaction Speed Challenge
        </h2>
        <p className="text-sm text-slate-400">Click as soon as the target turns green. Trains Discipline & Agility!</p>
      </div>

      <div
        onClick={gameState === "waiting" || gameState === "ready" ? handleClick : undefined}
        className={`h-64 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 ${
          gameState === "idle"
            ? "bg-slate-800/40 border-slate-700 hover:border-amber-500/50"
            : gameState === "waiting"
            ? "bg-red-950/60 border-red-500 animate-pulse"
            : gameState === "ready"
            ? "bg-emerald-600 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105"
            : "bg-slate-800 border-amber-500/50"
        }`}
      >
        {gameState === "idle" && (
          <div className="space-y-3 text-slate-300">
            <Zap className="w-16 h-16 mx-auto text-amber-400" />
            <div className="font-bold text-lg">Click "Start Trial" to Begin</div>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="space-y-2 text-red-400">
            <div className="text-4xl font-black">🔴 WAIT FOR GREEN</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Don't click yet...</div>
          </div>
        )}

        {gameState === "ready" && (
          <div className="space-y-2 text-white">
            <div className="text-5xl font-black animate-bounce">⚡ CLICK NOW!</div>
          </div>
        )}

        {gameState === "result" && (
          <div className="space-y-3">
            <div className="text-4xl font-black text-amber-400">{reactionMs} ms</div>
            <div className="text-sm text-slate-300">Fast reflexes! You earned XP & Gold.</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 text-sm font-medium text-slate-400">
        <div>Personal Best: <span className="text-white font-bold">{bestTime ? `${bestTime} ms` : "None"}</span></div>
        <button
          onClick={startTest}
          className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
        >
          {gameState === "result" ? "Try Again" : "Start Trial"}
        </button>
      </div>
    </div>
  );
}

/* 🧠 MEMORY TRIAL GAME */
function MemoryGame({ onComplete }: { onComplete: (reward: GameReward) => void }) {
  const SYMBOLS = ["⚔️", "🛡️", "🧪", "🏹", "🧙", "🐉"];
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initGame = () => {
    const deck = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({ id: idx, symbol, flipped: false, matched: false }));
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        const newMatches = matches + 1;
        setMatches(newMatches);

        if (newMatches === SYMBOLS.length) {
          setIsGameOver(true);
          const reward = calculateMemoryReward(newMatches, moves + 1, SYMBOLS.length);
          onComplete(reward);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6 max-w-2xl mx-auto shadow-2xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">🧠 Memory Trial</h2>
          <p className="text-xs text-slate-400">Match all symbol pairs with minimal moves.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Moves: <span className="text-white font-bold">{moves}</span></div>
          <div className="text-xs text-amber-400">Matches: {matches} / {SYMBOLS.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(idx)}
            className={`h-24 rounded-2xl flex items-center justify-center text-3xl cursor-pointer transition-all border-2 select-none ${
              card.flipped || card.matched
                ? "bg-slate-800 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "bg-slate-950 border-slate-800 hover:border-slate-700"
            }`}
          >
            {card.flipped || card.matched ? card.symbol : "❓"}
          </motion.div>
        ))}
      </div>

      {isGameOver && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
          <div className="text-lg font-bold text-emerald-400">🎉 Memory Trial Completed!</div>
          <p className="text-xs text-slate-300">You matched all pairs in {moves} moves.</p>
          <button
            onClick={initGame}
            className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

/* 🔢 NUMBER SPRINT MATH GAME */
function SprintGame({ onComplete }: { onComplete: (reward: GameReward) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [problem, setProblem] = useState<{ q: string; options: number[]; answer: number } | null>(null);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;
    if (op === "+") ans = a + b;
    if (op === "-") ans = a - b;
    if (op === "×") ans = a * b;

    const wrongOptions = [ans + 2, ans - 3, ans + 5, ans - 1].filter((x) => x !== ans).slice(0, 3);
    const options = [ans, ...wrongOptions].sort(() => Math.random() - 0.5);

    setProblem({ q: `${a} ${op} ${b} = ?`, options, answer: ans });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(10);
    generateProblem();
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      const reward = calculateSprintReward(score);
      onComplete(reward);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleAnswer = (chosen: number) => {
    if (!problem) return;
    if (chosen === problem.answer) {
      setScore((s) => s + 1);
    }
    generateProblem();
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6 max-w-xl mx-auto text-center shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          🔢 Number Sprint
        </h2>
        <p className="text-sm text-slate-400">Solve as many math problems as possible in 10 seconds!</p>
      </div>

      {!isPlaying ? (
        <div className="space-y-6 py-6">
          <div className="text-4xl font-black text-amber-400">{score > 0 ? `Last Score: ${score}` : "Ready to Sprint?"}</div>
          <button
            onClick={startGame}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg hover:shadow-lg transition-all"
          >
            Start 10s Sprint
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <div className="text-xl font-bold text-red-400">⏱️ {timeLeft}s</div>
            <div className="text-xl font-bold text-amber-400">Score: {score}</div>
          </div>

          <div className="py-8 bg-slate-950 rounded-2xl border border-slate-800 text-4xl font-black text-white">
            {problem?.q}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {problem?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="py-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-black text-xl text-white transition-all border border-slate-700"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* 🧩 LOGIC DUNGEON GAME */
function LogicGame({ onComplete }: { onComplete: (reward: GameReward) => void }) {
  const [room, setRoom] = useState(1);
  const [pattern, setPattern] = useState({ seq: ["A", "C", "E", "G"], next: "I", options: ["H", "I", "J", "K"] });

  const nextRoom = (choice: string) => {
    if (choice === pattern.next) {
      const newRoom = room + 1;
      setRoom(newRoom);
      if (newRoom >= 5) {
        const reward = calculateLogicReward(newRoom);
        onComplete(reward);
        setRoom(1);
      }
    } else {
      alert("Wrong pattern! Dungeon reset.");
      setRoom(1);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6 max-w-xl mx-auto text-center shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          🏰 Logic Dungeon (Room {room} / 5)
        </h2>
        <p className="text-sm text-slate-400">Determine the next symbol in the sequence to unlock the next room.</p>
      </div>

      <div className="py-10 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center gap-4 text-3xl font-black text-amber-400">
        <span>A</span>
        <span>→</span>
        <span>C</span>
        <span>→</span>
        <span>E</span>
        <span>→</span>
        <span className="text-slate-600">?</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {pattern.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => nextRoom(opt)}
            className="py-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xl text-white transition-all border border-slate-700"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
