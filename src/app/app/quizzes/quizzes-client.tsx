"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, CheckCircle2, XCircle, Award, Star, Flame, Trophy } from "lucide-react";
import { QUIZ_CATEGORIES, Question } from "@/lib/rpg/quiz-data";

export default function QuizzesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startCategoryQuiz = (catId: string, diff: "easy" | "medium" | "hard") => {
    const category = QUIZ_CATEGORIES.find((c) => c.id === catId);
    if (!category) return;
    const questions: Question[] = [];
    category.subcategories.forEach((sub) => {
      if (sub.questions[diff]) {
        questions.push(...sub.questions[diff]);
      }
    });

    if (questions.length > 0) {
      setActiveQuizQuestions(questions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setScore(0);
      setQuizFinished(false);
    } else {
      alert("No questions available for this difficulty tier yet!");
    }
  };

  const startDailyTrial = () => {
    const allQuestions: Question[] = [];
    QUIZ_CATEGORIES.forEach((c) => {
      c.subcategories.forEach((sub) => {
        Object.values(sub.questions).forEach((qList) => allQuestions.push(...qList));
      });
    });
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setActiveQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (activeQuizQuestions && index === activeQuizQuestions[currentIndex].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuizQuestions) return;
    if (currentIndex + 1 < activeQuizQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const getDifficultyRewardMultiplier = () => {
    switch (selectedDifficulty) {
      case "easy":
        return 10;
      case "medium":
        return 25;
      case "hard":
        return 50;
      default:
        return 10;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300">
            🧠 Knowledge Arena & Quizzes
          </h1>
          <p className="text-slate-400 mt-1">Test your intellect in Programming, Academics, and Science to gain Intellect XP!</p>
        </div>

        <button
          onClick={startDailyTrial}
          className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span>Start 5-Question Daily Trial</span>
        </button>
      </div>

      {/* Active Quiz Player */}
      {activeQuizQuestions && !quizFinished && (
        <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-8 max-w-3xl mx-auto space-y-6 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3">
            <span>Question {currentIndex + 1} of {activeQuizQuestions.length}</span>
            <span className="text-amber-400">Category Trial</span>
          </div>

          <div className="text-xl font-bold text-white leading-relaxed">
            {activeQuizQuestions[currentIndex].question}
          </div>

          <div className="space-y-3">
            {activeQuizQuestions[currentIndex].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeQuizQuestions[currentIndex].correctIndex;
              const showResult = selectedOption !== null;

              let btnClass = "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800";
              if (showResult) {
                if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-300";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && activeQuizQuestions[currentIndex].explanation && (
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 uppercase tracking-wider">Explanation</div>
              <div>{activeQuizQuestions[currentIndex].explanation}</div>
            </div>
          )}

          {selectedOption !== null && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleNextQuestion}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
              >
                {currentIndex + 1 === activeQuizQuestions.length ? "Finish Quiz" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Finished Result Screen */}
      {quizFinished && activeQuizQuestions && (
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
            TRIAL COMPLETE!
          </h2>

          <div className="text-5xl font-black text-white">
            {score} / {activeQuizQuestions.length}
          </div>

          <div className="flex items-center justify-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold text-lg">
            <span className="text-amber-400">+{score * getDifficultyRewardMultiplier() * 10} Intellect XP</span>
            <span className="text-yellow-400">+{score * 15} 🪙 Gold</span>
          </div>

          <button
            onClick={() => setActiveQuizQuestions(null)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
          >
            Return to Arena
          </button>
        </div>
      )}

      {/* Category List */}
      {!activeQuizQuestions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUIZ_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    {cat.attribute}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subcategories:</div>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <span key={sub.id} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Select Tier:</span>
                  <div className="flex gap-1">
                    {(["easy", "medium", "hard"] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          selectedDifficulty === diff
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startCategoryQuiz(cat.id, selectedDifficulty)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-sm text-white transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Enter {cat.name} Trial</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
