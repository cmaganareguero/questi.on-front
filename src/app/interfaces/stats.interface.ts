export interface StatsData {
  totalQuestionsAnswered: number;
  totalSuccesses: number;
  totalFailures: number;
  successRate: number;
  failureRate: number;
  weekMonthStats: WeekStatsDto[];    // Datos de estadísticas semanales
  monthStats: MonthStatsDto[];       // Datos de estadísticas mensuales (nuevo)
  difficultyStats: DifficultyStatsDto[]; // Nueva propiedad para estadísticas de dificultad
}

export interface WeekStatsDto {
  totalWeekQuestionsAnswered: number;
  totalWeekSuccesses: number;
  totalWeekFailures: number;
  successWeekRate: number;
  failureWeekRate: number;
  week: string | null;  // Representa la semana, por ejemplo "2024-41" (Año-Semana)
}

export interface MonthStatsDto {
  totalMonthQuestionsAnswered: number;
  totalMonthSuccesses: number;
  totalMonthFailures: number;
  successMonthRate: number;
  failureMonthRate: number;
  month: string;  // Representa el mes, por ejemplo "Octubre 2024"
}

export interface StatsGeneralesDto {
  totalGames: number;
  totalSuccesses: number;
  totalFailures: number;
}

export interface DifficultyStatsDto {
  difficulty: string;
  totalQuestionsAnswered: number;
  totalSuccesses: number;
  totalFailures: number;
  successRate: number;
  failureRate: number;
}

export interface DifficultyStatsResponse {
  facil: DifficultyStatsDto;  // Estadísticas para "Fácil"
  dificil: DifficultyStatsDto; // Estadísticas para "Difícil"
  media: DifficultyStatsDto;  // Estadísticas para "Media"
}

export interface GamesPlayedStatsResponse {
  month: String;
  gamesCount: number;
}





