import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, expand, map, reduce, switchMap, tap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { MessageService } from './messages.service';
import { FinishedGame, GameData, Question } from '../app/interfaces';
import { DifficultyStatsDto, DifficultyStatsResponse, GamesPlayedStatsResponse, MonthStatsDto, StatsData, StatsGeneralesDto } from '../app/interfaces/stats.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {

   private url = 'http://localhost:7785/game';

   gameData: GameData = {
     // id : 0,
     name: '',
     category: '',
     questions: [],
     difficulty: '',
     answerType: '',
     numQuestions: 0
   };

   games: GameData[] = [];

   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getLastGame(idUser: string, category: string): Observable<GameData> {
    const url = `${this.url}/getLastGame?idUser=${idUser}&category=${category}`;
    return this.http.get<GameData>(url);
  }

  deleteLastGame(userId: string, category: string): Observable<GameData> {
    const url = `${this.url}/lastGame/${userId}?category=${category}`;
    return this.http.delete<GameData>(url);
  }

  updateGame(idGame: string, successes: number): Observable<any> {
    const url = `${this.url}/updateGame`;
    const body = { idGame, successes };
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateGame'))
    );
  }

  // getMonthlyStatistics(idUser: string): Observable<MonthStatsDto> {
  //   const url = `${this.url}/getMonthlyStatistics?idUser=${idUser}`;
  //   return this.http.get<MonthStatsDto>(url);
  // }

  getDifficultyStatistics(idUser: string): Observable<DifficultyStatsResponse> {
    const url = `${this.url}/getStatisticsByDifficulty?idUser=${idUser}`;
    return this.http.get<DifficultyStatsResponse>(url);
  }

  getGamesPlayedStatistics(idUser: string): Observable<GamesPlayedStatsResponse[]> {
    const url = `${this.url}/gamesPlayedStats?idUser=${idUser}`;
    return this.http.get<GamesPlayedStatsResponse[]>(url);
  }

  getTotalsStatistics(idUser: string): Observable<StatsGeneralesDto> {
    const endpoint = `${this.url}/getTotalsStatistics?idUser=${idUser}`;
    return this.http.get<StatsGeneralesDto>(endpoint).pipe(
      catchError(this.handleError<StatsGeneralesDto>('getTotalsStatistics'))
    );
  }

  getMonthlySuccessFailure(idUser: string): Observable<MonthStatsDto[]> {
    const endpoint = `${this.url}/getMonthlySuccessFailure?idUser=${idUser}`;
    return this.http.get<MonthStatsDto[]>(endpoint).pipe(
      catchError(this.handleError<MonthStatsDto[]>('getMonthlySuccessFailure', []))
    );
  }

  getUserGames(idUser: string): Observable<FinishedGame[]> {
    const url = `${this.url}/getUserGames?idUser=${idUser}`;
    return this.http.get<FinishedGame[]>(url);
  }

        /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
        private handleError<T>(operation = 'operation', result?: T) {
          return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
          };
        }

        /** Log a RutinaService message with the MessageService */
        private log(message: string) {
          this.messageService.add(`RutinaService: ${message}`);
        }

}
