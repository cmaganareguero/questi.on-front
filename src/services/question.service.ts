import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, expand, map, reduce, switchMap, tap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { MessageService } from './messages.service';
import { GameData, Question } from '../app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

   private questionsAPIUrl = "http://localhost:7780";
   private moreInfoAPIUrl = "http://localhost:7783/question/getMoreInfo";
   
   constructor(private http: HttpClient, private messageService: MessageService) { }

   private quizQuestions : Question[] = [];

  //  question: Question = {
  //   // id : 0,
  //   question : '',
  //   category: '',
  //   answers: [],
  //   correctAnswerIndex : 0
  // };

  gameData: GameData[] = [];

  games: GameData[] = [];

  
   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'json' as const
  };

  getQuestions(idUser: string, difficulty: string, answerType: string, category: string, numQuestions: number): Observable<any> {
    const body = {
      idUser: idUser,
      difficulty: difficulty,
      answerType: answerType,
      category: category,
      numQuestions: numQuestions
    };
  
    return this.http.post<any>(`${this.questionsAPIUrl}/questions`, body)
      .pipe(
        catchError(error => {
          // Manejar el error de la solicitud
          console.error('Error en la solicitud:', error);
          return of('Error'); // Devolver un valor observable para manejar el error en el componente
        })
      );
  }

  getMoreInfo(question: string, correctAnswer: string): Observable<string> {
    const params = new HttpParams()
      .set('question', question)
      .set('correctAnswer', correctAnswer);
  
    return this.http.get(this.moreInfoAPIUrl, { params, responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error al obtener más información:', error);
          return of('Error');
        })
      );
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
