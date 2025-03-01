export interface GameData {
  id?: string;
  name?: string;
  category: string;
  difficulty: string;
  answerType: string;
  date?: string;
  successes?: number;
  failures?: number;
  numQuestions: number;
  idUser?: string;
  questions?: Question[];
}

export interface Question {
  // id? : number;
  question: string;
  // category: string;
  // game? : GameData;
  answers: string[];
  correctAnswerIndex : number;
}

export interface FinishedGame {
  name: string;
  category: string;
  difficulty: string;
  answerType: string;
  numQuestions: number;
  successes: number;
  failures: number;
}

  