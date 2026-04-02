export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  level: number;
  text: string;
  answers: Answer[];
}