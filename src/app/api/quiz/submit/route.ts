import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage/json-db';

const QUESTIONS: Record<string, { q: string; options: string[]; answer: number }[]> = {
  python: [
    { q: "What does `len()` do in Python?", options: ["Returns length", "Converts to list", "Returns type", "Prints output"], answer: 0 },
    { q: "Which keyword is used to define a function in Python?", options: ["func", "function", "def", "define"], answer: 2 },
    { q: "What is the output of `print(2 ** 3)`?", options: ["6", "8", "5", "9"], answer: 1 },
    { q: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Set", "Tuple"], answer: 3 },
    { q: "What does `import` do?", options: ["Deletes a module", "Loads a module", "Creates a variable", "Compiles code"], answer: 1 },
    { q: "Which loop iterates over a sequence?", options: ["for", "while", "do-while", "repeat"], answer: 0 },
  ],
  java: [
    { q: "What is the entry point of a Java program?", options: ["start()", "main()", "init()", "run()"], answer: 1 },
    { q: "Which keyword creates a class in Java?", options: ["struct", "object", "class", "type"], answer: 2 },
    { q: "Java runs on which virtual machine?", options: ["JVM", "JRE", "JDK", "JIT"], answer: 0 },
    { q: "Which is NOT a primitive type in Java?", options: ["int", "boolean", "String", "char"], answer: 2 },
    { q: "What does `System.out.println()` do?", options: ["Reads input", "Writes output", "Compiles code", "Imports package"], answer: 1 },
    { q: "Which modifier makes a method accessible everywhere?", options: ["private", "protected", "public", "default"], answer: 2 },
  ],
  gk: [
    { q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: 2 },
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
    { q: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
    { q: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], answer: 2 },
    { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
  ],
  news: [
    { q: "What does 'AI' stand for in technology?", options: ["Auto Interface", "Artificial Intelligence", "Applied Innovation", "Active Input"], answer: 1 },
    { q: "Which company developed ChatGPT?", options: ["Google", "Meta", "OpenAI", "Microsoft"], answer: 2 },
    { q: "What is a 'hashtag' used for on social media?", options: ["Deleting posts", "Categorizing content", "Sending messages", "Blocking users"], answer: 1 },
    { q: "What does '5G' refer to?", options: ["5th Generation", "5 Gigabytes", "5 Gigahertz", "5 Graphics"], answer: 0 },
    { q: "Which planet did NASA's Perseverance rover land on?", options: ["Venus", "Mars", "Moon", "Jupiter"], answer: 1 },
    { q: "What is 'blockchain' primarily used for?", options: ["Gaming", "Decentralized transactions", "Video editing", "Photo storage"], answer: 1 },
  ],
  dosdonts: [
    { q: "Do: What should you do before pushing code?", options: ["Skip testing", "Review and test", "Delete files", "Ignore errors"], answer: 1 },
    { q: "Don't: What should you NOT share publicly?", options: ["Your name", "API keys and secrets", "Public projects", "Documentation"], answer: 1 },
    { q: "Do: How should you handle errors?", options: ["Ignore them", "Use try-catch blocks", "Delete the file", "Restart the app"], answer: 1 },
    { q: "Don't: What is bad practice in version control?", options: ["Commit often", "Write clear messages", "Push directly to main", "Use branches"], answer: 2 },
    { q: "Do: What is the best way to learn a new framework?", options: ["Read docs only", "Build projects", "Watch others code", "Memorize syntax"], answer: 1 },
    { q: "Don't: What should you avoid in passwords?", options: ["Long phrases", "Using same password everywhere", "Using special characters", "Using a password manager"], answer: 1 },
  ],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, answers } = body;
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer token_', '') || 'demo-user';

    if (!QUESTIONS[category]) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }
    if (!answers || !Array.isArray(answers) || answers.length !== QUESTIONS[category].length) {
      return NextResponse.json({ message: 'Invalid answers' }, { status: 400 });
    }

    let correct = 0;
    QUESTIONS[category].forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    const xpEarned = correct * 10;
    const db = readDB();
    let userIndex = db.users.findIndex((u) => u._id === userId);

    if (userIndex === -1) {
      // Create demo user entry
      db.users.push({
        _id: userId,
        username: 'Demo Hero',
        email: 'demo@lifequest.app',
        level: 1,
        xp: 0,
        totalXP: 0,
        quizzesCompleted: 0,
        correctAnswers: 0,
        categoryScores: {
          python: { played: 0, correct: 0 },
          java: { played: 0, correct: 0 },
          gk: { played: 0, correct: 0 },
          news: { played: 0, correct: 0 },
          dosdonts: { played: 0, correct: 0 },
        },
        createdAt: new Date().toISOString(),
      });
      userIndex = db.users.length - 1;
    }

    const user = db.users[userIndex];
    const newXP = user.xp + xpEarned;
    const newTotalXP = user.totalXP + xpEarned;
    let newLevel = user.level;
    let remainderXP = newXP;

    while (remainderXP >= 100) {
      remainderXP -= 100;
      newLevel++;
    }

    const catScores = { ...(user.categoryScores || {}) };
    if (!catScores[category]) catScores[category] = { played: 0, correct: 0 };
    catScores[category] = {
      played: catScores[category].played + 1,
      correct: catScores[category].correct + correct,
    };

    db.users[userIndex] = {
      ...user,
      xp: remainderXP,
      totalXP: newTotalXP,
      level: newLevel,
      quizzesCompleted: (user.quizzesCompleted || 0) + 1,
      correctAnswers: (user.correctAnswers || 0) + correct,
      categoryScores: catScores,
    };

    writeDB(db);

    return NextResponse.json({
      score: correct,
      total: QUESTIONS[category].length,
      xpEarned,
      user: { level: newLevel, xp: remainderXP, totalXP: newTotalXP },
    });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
