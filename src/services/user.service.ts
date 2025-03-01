import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './messages.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { GameUser, User } from '../app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private bd = 'http://localhost:7780/users/add';

  private bdConsumer = 'http://localhost:7789/users/getUserIdByEmail'

  user: User = {
    name: '',
    password: '',
    email: ''
 };

 httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getUsers(): Observable<User[]> {
    // Enviar una petición GET a la URL
    console.log(this.http.get<User[]>(this.bd))
    return this.http.get<User[]>(this.bd);
  }

  addUser(newUser: User): Observable<User> {
    return this.http.post<User>(this.bd, newUser, this.httpOptions).pipe(
      tap((user: User) => this.log(`added user with id=${user.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  getUserDetailsByEmail(userEmail: string): Observable<GameUser> {
    const url = `http://localhost:7789/users/getUserDetailsByEmail?userEmail=${userEmail}`;
    return this.http.get<GameUser>(url);
  }

  getIdUserByEmail(emailUser: string): Observable<string> {
    const url = `http://localhost:7789/users/getUserIdByEmail?userEmail=${emailUser}`;
    return this.http.get(url, { responseType: 'text' });
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
