export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  attribute: string;
  subcategories: {
    id: string;
    name: string;
    questions: Record<string, Question[]>; // difficulty -> questions
  }[];
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    description: 'Master code syntax, algorithms, data structures, and database query logic.',
    attribute: 'intellect',
    subcategories: [
      {
        id: 'python',
        name: 'Python',
        questions: {
          easy: [
            { id: 'py-1', question: 'What does `len()` do in Python?', options: ['Returns length', 'Converts to list', 'Returns type', 'Prints output'], correctIndex: 0 },
            { id: 'py-2', question: 'Which keyword is used to define a function in Python?', options: ['func', 'function', 'def', 'define'], correctIndex: 2 },
            { id: 'py-3', question: 'What is the output of `print(2 ** 3)`?', options: ['6', '8', '5', '9'], correctIndex: 1 },
          ],
          medium: [
            { id: 'py-4', question: 'Which data type is immutable in Python?', options: ['List', 'Dictionary', 'Set', 'Tuple'], correctIndex: 3 },
            { id: 'py-5', question: 'What does `import` do?', options: ['Deletes a module', 'Loads a module', 'Creates a variable', 'Compiles code'], correctIndex: 1 },
          ],
          hard: [
            { id: 'py-6', question: 'Which loop iterates over a sequence?', options: ['for', 'while', 'do-while', 'repeat'], correctIndex: 0 },
          ]
        }
      },
      {
        id: 'java',
        name: 'Java',
        questions: {
          easy: [
            { id: 'java-1', question: 'What is the entry point of a Java program?', options: ['start()', 'main()', 'init()', 'run()'], correctIndex: 1 },
            { id: 'java-2', question: 'Which keyword creates a class in Java?', options: ['struct', 'object', 'class', 'type'], correctIndex: 2 },
          ],
          medium: [
            { id: 'java-3', question: 'Java runs on which virtual machine?', options: ['JVM', 'JRE', 'JDK', 'JIT'], correctIndex: 0 },
            { id: 'java-4', question: 'Which is NOT a primitive type in Java?', options: ['int', 'boolean', 'String', 'char'], correctIndex: 2 },
          ],
          hard: [
            { id: 'java-5', question: 'What does `System.out.println()` do?', options: ['Reads input', 'Writes output', 'Compiles code', 'Imports package'], correctIndex: 1 },
            { id: 'java-6', question: 'Which modifier makes a method accessible everywhere?', options: ['private', 'protected', 'public', 'default'], correctIndex: 2 },
          ]
        }
      },
      {
        id: 'javascript',
        name: 'JavaScript & TS',
        questions: {
          easy: [
            {
              id: 'js-e-1',
              question: 'Which operator is used to test strict equality in JavaScript?',
              options: ['==', '===', '=', '!='],
              correctIndex: 1,
              explanation: '=== checks both value and type equality without coercion.',
            },
            {
              id: 'js-e-2',
              question: 'What keyword declares a block-scoped variable that cannot be reassigned?',
              options: ['var', 'let', 'const', 'static'],
              correctIndex: 2,
            },
          ],
          medium: [
            {
              id: 'js-m-1',
              question: 'What is the output of `typeof null` in JavaScript?',
              options: ['null', 'undefined', 'object', 'number'],
              correctIndex: 2,
              explanation: 'typeof null returning "object" is a historical JavaScript bug retained for compatibility.',
            },
            {
              id: 'js-m-2',
              question: 'Which method transforms an array into a single accumulated result?',
              options: ['map()', 'filter()', 'reduce()', 'forEach()'],
              correctIndex: 2,
            },
          ],
          hard: [
            {
              id: 'js-h-1',
              question: 'In the event loop, microtasks (Promises) are executed at what priority relative to macrotasks (setTimeout)?',
              options: [
                'Microtasks run after macrotasks',
                'Microtasks run before the next macrotask in the queue',
                'Microtasks and macrotasks run concurrently',
                'Macrotasks pause microtasks',
              ],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        questions: {
          easy: [
            {
              id: 'dsa-e-1',
              question: 'Which data structure uses First-In-First-Out (FIFO) order?',
              options: ['Stack', 'Queue', 'Binary Tree', 'Hash Map'],
              correctIndex: 1,
            },
          ],
          medium: [
            {
              id: 'dsa-m-1',
              question: 'What is the average time complexity of searching in a balanced Binary Search Tree (BST)?',
              options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
              correctIndex: 2,
            },
          ],
          hard: [
            {
              id: 'dsa-h-1',
              question: 'Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?',
              options: ['Kruskal Algorithm', 'Dijkstra Algorithm', 'Floyd-Warshall Algorithm', 'Depth-First Search'],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'academics',
    name: 'Academics',
    icon: '🎓',
    description: 'Test core computer science subjects: DBMS, Operating Systems, Networks, and Math.',
    attribute: 'intellect',
    subcategories: [
      {
        id: 'dbms',
        name: 'DBMS & SQL',
        questions: {
          easy: [
            {
              id: 'db-e-1',
              question: 'What does SQL stand for?',
              options: [
                'Sequential Query Language',
                'Structured Query Language',
                'Server Quality Logic',
                'System Query List',
              ],
              correctIndex: 1,
            },
          ],
          medium: [
            {
              id: 'db-m-1',
              question: 'Which Normal Form guarantees no partial dependency on a composite candidate key?',
              options: ['1NF', '2NF', '3NF', 'BCNF'],
              correctIndex: 1,
            },
          ],
          hard: [
            {
              id: 'db-h-1',
              question: 'In ACID properties, what does "I" stand for?',
              options: ['Integrity', 'Isolation', 'Index', 'Iterative'],
              correctIndex: 1,
              explanation: 'Isolation ensures concurrent transactions execute independently.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'general',
    name: 'General Knowledge & Science',
    icon: '🌎',
    description: 'Science trivia, technology history, and problem-solving puzzles.',
    attribute: 'creativity',
    subcategories: [
      {
        id: 'gk',
        name: 'General Knowledge',
        questions: {
          easy: [
            { id: 'gk-1', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctIndex: 2 },
            { id: 'gk-2', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
          ],
          medium: [
            { id: 'gk-3', question: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], correctIndex: 2 },
            { id: 'gk-4', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
          ],
          hard: [
            { id: 'gk-5', question: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'], correctIndex: 2 },
            { id: 'gk-6', question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
          ]
        }
      },
      {
        id: 'news',
        name: 'Current News & Tech',
        questions: {
          easy: [
            { id: 'news-1', question: "What does 'AI' stand for in technology?", options: ['Auto Interface', 'Artificial Intelligence', 'Applied Innovation', 'Active Input'], correctIndex: 1 },
            { id: 'news-2', question: 'Which company developed ChatGPT?', options: ['Google', 'Meta', 'OpenAI', 'Microsoft'], correctIndex: 2 },
          ],
          medium: [
            { id: 'news-3', question: "What is a 'hashtag' used for on social media?", options: ['Deleting posts', 'Categorizing content', 'Sending messages', 'Blocking users'], correctIndex: 1 },
            { id: 'news-4', question: "What does '5G' refer to?", options: ['5th Generation', '5 Gigabytes', '5 Gigahertz', '5 Graphics'], correctIndex: 0 },
          ],
          hard: [
            { id: 'news-5', question: "Which planet did NASA's Perseverance rover land on?", options: ['Venus', 'Mars', 'Moon', 'Jupiter'], correctIndex: 1 },
            { id: 'news-6', question: "What is 'blockchain' primarily used for?", options: ['Gaming', 'Decentralized transactions', 'Video editing', 'Photo storage'], correctIndex: 1 },
          ]
        }
      },
      {
        id: 'dosdonts',
        name: "Developer Do's & Don'ts",
        questions: {
          easy: [
            { id: 'dd-1', question: 'Do: What should you do before pushing code?', options: ['Skip testing', 'Review and test', 'Delete files', 'Ignore errors'], correctIndex: 1 },
            { id: 'dd-2', question: "Don't: What should you NOT share publicly?", options: ['Your name', 'API keys and secrets', 'Public projects', 'Documentation'], correctIndex: 1 },
          ],
          medium: [
            { id: 'dd-3', question: 'Do: How should you handle errors?', options: ['Ignore them', 'Use try-catch blocks', 'Delete the file', 'Restart the app'], correctIndex: 1 },
            { id: 'dd-4', question: "Don't: What is bad practice in version control?", options: ['Commit often', 'Write clear messages', 'Push directly to main', 'Use branches'], correctIndex: 2 },
          ],
          hard: [
            { id: 'dd-5', question: 'Do: What is the best way to learn a new framework?', options: ['Read docs only', 'Build projects', 'Watch others code', 'Memorize syntax'], correctIndex: 1 },
            { id: 'dd-6', question: "Don't: What should you avoid in passwords?", options: ['Long phrases', 'Using same password everywhere', 'Using special characters', 'Using a password manager'], correctIndex: 1 },
          ]
        }
      },
    ],
  },
];
