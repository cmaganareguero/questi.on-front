import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './messages.service';
import { Observable, of } from 'rxjs';
import { Video } from '../app/interfaces/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private bd = 'http://localhost:7779/getVideos';

  video: Video = {
   // id : 0,
   url : '',
   title: ''
 };

 httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getVideos(): Observable<Video[]> {
    // Enviar una petición GET a la URL
    console.log(this.http.get<Video[]>(this.bd))
    return this.http.get<Video[]>(this.bd);
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
  this.messageService.add(`UserService: ${message}`);
}

}
