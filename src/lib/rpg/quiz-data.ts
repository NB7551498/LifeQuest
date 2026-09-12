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
        id: 'tech_history',
        name: 'Tech & Science',
        questions: {
          easy: [
            {
              id: 'gen-e-1',
              question: 'Who is widely considered the pioneer of computer science and inventor of the Turing Machine?',
              options: ['Steve Jobs', 'Alan Turing', 'Bill Gates', 'Tim Berners-Lee'],
              correctIndex: 1,
            },
          ],
          medium: [
            {
              id: 'gen-m-1',
              question: 'Which year was the World Wide Web introduced to the public domain by CERN?',
              options: ['1979', '1985', '1993', '1999'],
              correctIndex: 2,
            },
          ],
        },
      },
    ],
  },
];
