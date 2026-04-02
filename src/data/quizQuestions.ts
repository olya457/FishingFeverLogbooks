import { Question } from '../types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 'l1q1', level: 1,
    text: 'What is the best time of day to catch many fish?',
    answers: [
      { text: 'Midday', isCorrect: false },
      { text: 'Early morning', isCorrect: true },
      { text: 'Late afternoon', isCorrect: false },
      { text: 'Midnight', isCorrect: false },
    ],
  },
  {
    id: 'l1q2', level: 1,
    text: 'Which bait is commonly used for freshwater fishing?',
    answers: [
      { text: 'Worms', isCorrect: true },
      { text: 'Cheese', isCorrect: false },
      { text: 'Rice', isCorrect: false },
      { text: 'Bread crumbs', isCorrect: false },
    ],
  },
  {
    id: 'l1q3', level: 1,
    text: 'What tool is used to reel in a fishing line?',
    answers: [
      { text: 'Hook', isCorrect: false },
      { text: 'Float', isCorrect: false },
      { text: 'Reel', isCorrect: true },
      { text: 'Net', isCorrect: false },
    ],
  },
  {
    id: 'l1q4', level: 1,
    text: 'Where do fish often hide?',
    answers: [
      { text: 'Open deep water', isCorrect: false },
      { text: 'Near underwater structures', isCorrect: true },
      { text: 'In dry areas', isCorrect: false },
      { text: 'In shallow sand only', isCorrect: false },
    ],
  },
  {
    id: 'l1q5', level: 1,
    text: 'What is used to attract fish to bite?',
    answers: [
      { text: 'Anchor', isCorrect: false },
      { text: 'Bait', isCorrect: true },
      { text: 'Rope', isCorrect: false },
      { text: 'Weight', isCorrect: false },
    ],
  },

  {
    id: 'l2q1', level: 2,
    text: 'What helps you detect a fish bite when float fishing?',
    answers: [
      { text: 'The float moving underwater', isCorrect: true },
      { text: 'The rod turning green', isCorrect: false },
      { text: 'The boat shaking', isCorrect: false },
      { text: 'The hook disappearing', isCorrect: false },
    ],
  },
  {
    id: 'l2q2', level: 2,
    text: 'Why do anglers use camouflage or dull clothing?',
    answers: [
      { text: 'To look professional', isCorrect: false },
      { text: 'To avoid scaring fish', isCorrect: true },
      { text: 'To stay warm', isCorrect: false },
      { text: 'To match the boat', isCorrect: false },
    ],
  },
  {
    id: 'l2q3', level: 2,
    text: 'What is a common artificial fishing lure?',
    answers: [
      { text: 'Spinner', isCorrect: true },
      { text: 'Stone', isCorrect: false },
      { text: 'Leaf', isCorrect: false },
      { text: 'Shell', isCorrect: false },
    ],
  },
  {
    id: 'l2q4', level: 2,
    text: 'Why is a sharp hook important?',
    answers: [
      { text: 'It looks better', isCorrect: false },
      { text: 'It helps catch fish securely', isCorrect: true },
      { text: 'It floats better', isCorrect: false },
      { text: 'It sinks slower', isCorrect: false },
    ],
  },
  {
    id: 'l2q5', level: 2,
    text: 'What weather often improves fishing conditions?',
    answers: [
      { text: 'Slightly cloudy weather', isCorrect: true },
      { text: 'Strong storms', isCorrect: false },
      { text: 'Heavy snow', isCorrect: false },
      { text: 'Extreme heat', isCorrect: false },
    ],
  },

  {
    id: 'l3q1', level: 3,
    text: 'What does a fishing line connect?',
    answers: [
      { text: 'Rod and hook', isCorrect: true },
      { text: 'Boat and anchor', isCorrect: false },
      { text: 'Net and fish', isCorrect: false },
      { text: 'Bait and water', isCorrect: false },
    ],
  },
  {
    id: 'l3q2', level: 3,
    text: 'What does a sinker do?',
    answers: [
      { text: 'Keeps bait floating', isCorrect: false },
      { text: 'Helps bait sink deeper', isCorrect: true },
      { text: 'Sharpens the hook', isCorrect: false },
      { text: 'Attracts fish', isCorrect: false },
    ],
  },
  {
    id: 'l3q3', level: 3,
    text: 'What is a fishing net used for?',
    answers: [
      { text: 'Cleaning fish', isCorrect: false },
      { text: 'Catching fish from water safely', isCorrect: true },
      { text: 'Holding bait', isCorrect: false },
      { text: 'Measuring fish', isCorrect: false },
    ],
  },
  {
    id: 'l3q4', level: 3,
    text: 'Why do fish gather near underwater plants?',
    answers: [
      { text: 'For shade and food', isCorrect: true },
      { text: 'To sleep', isCorrect: false },
      { text: 'To hide from water', isCorrect: false },
      { text: 'To change color', isCorrect: false },
    ],
  },
  {
    id: 'l3q5', level: 3,
    text: 'What should anglers do if fish stop biting?',
    answers: [
      { text: 'Leave immediately', isCorrect: false },
      { text: 'Change bait or location', isCorrect: true },
      { text: 'Stop fishing forever', isCorrect: false },
      { text: 'Remove the hook', isCorrect: false },
    ],
  },
 
  {
    id: 'l4q1', level: 4,
    text: 'What is the purpose of a fishing float?',
    answers: [
      { text: 'To decorate the line', isCorrect: false },
      { text: 'To signal when fish bite', isCorrect: true },
      { text: 'To cut the line', isCorrect: false },
      { text: 'To store bait', isCorrect: false },
    ],
  },
  {
    id: 'l4q2', level: 4,
    text: 'Which fish is known as a freshwater predator?',
    answers: [
      { text: 'Pike', isCorrect: true },
      { text: 'Carp', isCorrect: false },
      { text: 'Roach', isCorrect: false },
      { text: 'Bream', isCorrect: false },
    ],
  },
  {
    id: 'l4q3', level: 4,
    text: 'Why do anglers fish near drop-offs?',
    answers: [
      { text: 'Fish often patrol depth changes', isCorrect: true },
      { text: 'Water is warmer', isCorrect: false },
      { text: 'The bait floats there', isCorrect: false },
      { text: 'Boats stay closer', isCorrect: false },
    ],
  },
  {
    id: 'l4q4', level: 4,
    text: 'What does casting mean?',
    answers: [
      { text: 'Pulling fish out', isCorrect: false },
      { text: 'Throwing the line into the water', isCorrect: true },
      { text: 'Cutting the line', isCorrect: false },
      { text: 'Fixing the rod', isCorrect: false },
    ],
  },
  {
    id: 'l4q5', level: 4,
    text: 'Why should anglers stay quiet near water?',
    answers: [
      { text: 'To relax', isCorrect: false },
      { text: 'Fish can sense vibrations and noise', isCorrect: true },
      { text: 'Water is loud', isCorrect: false },
      { text: 'Rods break easily', isCorrect: false },
    ],
  },

  {
    id: 'l5q1', level: 5,
    text: 'What does catch and release mean?',
    answers: [
      { text: 'Catch fish and keep them all', isCorrect: false },
      { text: 'Catch fish and release them back into water', isCorrect: true },
      { text: 'Only watch fish', isCorrect: false },
      { text: 'Throw fish away', isCorrect: false },
    ],
  },
  {
    id: 'l5q2', level: 5,
    text: 'Why do fish follow baitfish?',
    answers: [
      { text: 'For protection', isCorrect: false },
      { text: 'Because they are predators and hunt smaller fish', isCorrect: true },
      { text: 'To swim faster', isCorrect: false },
      { text: 'To hide', isCorrect: false },
    ],
  },
  {
    id: 'l5q3', level: 5,
    text: 'What is a tackle box used for?',
    answers: [
      { text: 'Storing fishing gear', isCorrect: true },
      { text: 'Keeping fish alive', isCorrect: false },
      { text: 'Storing water', isCorrect: false },
      { text: 'Holding the rod', isCorrect: false },
    ],
  },
  {
    id: 'l5q4', level: 5,
    text: 'Why do anglers change lure color?',
    answers: [
      { text: 'To match fishing clothes', isCorrect: false },
      { text: 'To attract fish in different water conditions', isCorrect: true },
      { text: 'To sink faster', isCorrect: false },
      { text: 'To make noise', isCorrect: false },
    ],
  },
  {
    id: 'l5q5', level: 5,
    text: 'What helps anglers remember successful fishing spots?',
    answers: [
      { text: 'Writing notes in a fishing log', isCorrect: true },
      { text: 'Throwing markers', isCorrect: false },
      { text: 'Guessing next time', isCorrect: false },
      { text: 'Changing rods', isCorrect: false },
    ],
  },

  {
    id: 'l6q1', level: 6,
    text: 'What is the main purpose of fishing bait?',
    answers: [
      { text: 'To decorate the hook', isCorrect: false },
      { text: 'To attract fish to bite', isCorrect: true },
      { text: 'To keep the line heavy', isCorrect: false },
      { text: 'To scare other fish', isCorrect: false },
    ],
  },
  {
    id: 'l6q2', level: 6,
    text: 'Which place is often best for fishing in a lake?',
    answers: [
      { text: 'Middle of empty water', isCorrect: false },
      { text: 'Near underwater plants or structures', isCorrect: true },
      { text: 'Only near the shore', isCorrect: false },
      { text: 'In shallow sand', isCorrect: false },
    ],
  },
  {
    id: 'l6q3', level: 6,
    text: 'Why do anglers use different lure colors?',
    answers: [
      { text: 'To look better', isCorrect: false },
      { text: 'To match water and light conditions', isCorrect: true },
      { text: 'To make the lure heavier', isCorrect: false },
      { text: 'To change the rod color', isCorrect: false },
    ],
  },
  {
    id: 'l6q4', level: 6,
    text: 'What does a fishing reel help you do?',
    answers: [
      { text: 'Cut the line', isCorrect: false },
      { text: 'Control and retrieve the fishing line', isCorrect: true },
      { text: 'Clean the hook', isCorrect: false },
      { text: 'Store bait', isCorrect: false },
    ],
  },
  {
    id: 'l6q5', level: 6,
    text: 'Why do fish gather near underwater rocks or logs?',
    answers: [
      { text: 'They like hard surfaces', isCorrect: false },
      { text: 'They hide and search for food there', isCorrect: true },
      { text: 'Water is warmer there', isCorrect: false },
      { text: 'The current stops there', isCorrect: false },
    ],
  },
  {
    id: 'l7q1', level: 7,
    text: 'What is the best action if fish are not biting?',
    answers: [
      { text: 'Stop fishing immediately', isCorrect: false },
      { text: 'Change bait or fishing spot', isCorrect: true },
      { text: 'Throw the rod away', isCorrect: false },
      { text: 'Wait all day without changes', isCorrect: false },
    ],
  },
  {
    id: 'l7q2', level: 7,
    text: 'What does a fishing float indicate?',
    answers: [
      { text: 'The depth of water', isCorrect: false },
      { text: 'When a fish bites the bait', isCorrect: true },
      { text: 'The strength of the wind', isCorrect: false },
      { text: 'The length of the rod', isCorrect: false },
    ],
  },
  {
    id: 'l7q3', level: 7,
    text: 'Why do anglers fish near river bends?',
    answers: [
      { text: 'Fish gather where the current slows down', isCorrect: true },
      { text: 'Water is always deeper', isCorrect: false },
      { text: 'The bait floats faster', isCorrect: false },
      { text: 'Boats stay closer', isCorrect: false },
    ],
  },
  {
    id: 'l7q4', level: 7,
    text: 'Why is patience important in fishing?',
    answers: [
      { text: 'Fish may take time to approach bait', isCorrect: true },
      { text: 'The rod needs rest', isCorrect: false },
      { text: 'Water moves slowly', isCorrect: false },
      { text: 'Hooks become sharper', isCorrect: false },
    ],
  },
  {
    id: 'l7q5', level: 7,
    text: 'What helps improve fishing success over time?',
    answers: [
      { text: 'Guessing fishing spots', isCorrect: false },
      { text: 'Recording fishing results and learning from them', isCorrect: true },
      { text: 'Using only one lure', isCorrect: false },
      { text: 'Fishing randomly', isCorrect: false },
    ],
  },

  {
    id: 'l8q1', level: 8,
    text: 'What does casting mean in fishing?',
    answers: [
      { text: 'Throwing the line into the water', isCorrect: true },
      { text: 'Pulling the fish out', isCorrect: false },
      { text: 'Cutting the line', isCorrect: false },
      { text: 'Fixing the rod', isCorrect: false },
    ],
  },
  {
    id: 'l8q2', level: 8,
    text: 'Why do fish often move deeper during hot days?',
    answers: [
      { text: 'Water is cooler deeper', isCorrect: true },
      { text: 'Bait floats there', isCorrect: false },
      { text: 'The sun is stronger there', isCorrect: false },
      { text: 'Plants grow deeper', isCorrect: false },
    ],
  },
  {
    id: 'l8q3', level: 8,
    text: 'What is a common reason fish stop biting?',
    answers: [
      { text: 'The line is invisible', isCorrect: false },
      { text: 'Conditions or bait are not suitable anymore', isCorrect: true },
      { text: 'The rod is too long', isCorrect: false },
      { text: 'Water is too clear', isCorrect: false },
    ],
  },
  {
    id: 'l8q4', level: 8,
    text: 'What should anglers do after catching one fish?',
    answers: [
      { text: 'Leave the area immediately', isCorrect: false },
      { text: 'Cast again in the same spot because more fish may be nearby', isCorrect: true },
      { text: 'Stop fishing', isCorrect: false },
      { text: 'Change rods', isCorrect: false },
    ],
  },
  {
    id: 'l8q5', level: 8,
    text: 'What helps fish find bait more easily?',
    answers: [
      { text: 'Bright lure colors in murky water', isCorrect: true },
      { text: 'Invisible hooks', isCorrect: false },
      { text: 'Short rods', isCorrect: false },
      { text: 'Dry bait', isCorrect: false },
    ],
  },

  {
    id: 'l9q1', level: 9,
    text: 'What is the purpose of a sinker (weight)?',
    answers: [
      { text: 'To keep bait deeper in the water', isCorrect: true },
      { text: 'To attract fish', isCorrect: false },
      { text: 'To color the line', isCorrect: false },
      { text: 'To hold the rod', isCorrect: false },
    ],
  },
  {
    id: 'l9q2', level: 9,
    text: 'Why do anglers use nets when landing fish?',
    answers: [
      { text: 'To keep the rod dry', isCorrect: false },
      { text: 'To safely lift fish from the water', isCorrect: true },
      { text: 'To store bait', isCorrect: false },
      { text: 'To cut the line', isCorrect: false },
    ],
  },
  {
    id: 'l9q3', level: 9,
    text: 'Where are fish often found during windy weather?',
    answers: [
      { text: 'In dry areas', isCorrect: false },
      { text: 'Near shores where wind pushes food', isCorrect: true },
      { text: 'Only in deep water', isCorrect: false },
      { text: 'Under boats', isCorrect: false },
    ],
  },
  {
    id: 'l9q4', level: 9,
    text: 'What is one advantage of fishing early in the morning?',
    answers: [
      { text: 'Fish are often more active then', isCorrect: true },
      { text: 'Water disappears', isCorrect: false },
      { text: 'Bait sinks faster', isCorrect: false },
      { text: 'Hooks float', isCorrect: false },
    ],
  },
  {
    id: 'l9q5', level: 9,
    text: 'What is an important rule of responsible fishing?',
    answers: [
      { text: 'Catch as many fish as possible', isCorrect: false },
      { text: 'Follow local fishing regulations', isCorrect: true },
      { text: 'Fish only at night', isCorrect: false },
      { text: 'Never release fish', isCorrect: false },
    ],
  },

  {
    id: 'l10q1', level: 10,
    text: 'Why should anglers check their fishing line regularly?',
    answers: [
      { text: 'To make it longer', isCorrect: false },
      { text: 'To ensure it is not damaged or weak', isCorrect: true },
      { text: 'To change its color', isCorrect: false },
      { text: 'To make it heavier', isCorrect: false },
    ],
  },
  {
    id: 'l10q2', level: 10,
    text: 'Why are underwater plants good fishing spots?',
    answers: [
      { text: 'Fish hide and find food there', isCorrect: true },
      { text: 'Water is always warm there', isCorrect: false },
      { text: 'The line sinks faster there', isCorrect: false },
      { text: 'Hooks become sharper', isCorrect: false },
    ],
  },
  {
    id: 'l10q3', level: 10,
    text: 'What does a tackle box store?',
    answers: [
      { text: 'Fishing gear and equipment', isCorrect: true },
      { text: 'Water', isCorrect: false },
      { text: 'Fish', isCorrect: false },
      { text: 'Boats', isCorrect: false },
    ],
  },
  {
    id: 'l10q4', level: 10,
    text: 'Why do anglers sometimes change fishing depth?',
    answers: [
      { text: 'Fish may move to different depths during the day', isCorrect: true },
      { text: 'The rod changes size', isCorrect: false },
      { text: 'Bait floats higher', isCorrect: false },
      { text: 'The line breaks', isCorrect: false },
    ],
  },
  {
    id: 'l10q5', level: 10,
    text: 'What is the best way to improve fishing skills?',
    answers: [
      { text: 'Fishing only once a year', isCorrect: false },
      { text: 'Learning from experience and observation', isCorrect: true },
      { text: 'Using only one bait', isCorrect: false },
      { text: 'Ignoring fishing conditions', isCorrect: false },
    ],
  },
];

export const getQuestionsByLevel = (level: number): Question[] =>
  quizQuestions.filter(q => q.level === level);

export const TOTAL_LEVELS = 10;