import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private baseUrl = 'http://localhost:7786/auth'; // URL de tu backend

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<any>(url, { name: email, password: password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('jwtToken', response.token);
          }
        })
      );
  }

  getUserIdFromToken(): string {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken: any = jwt_decode.jwtDecode(token) as { sub: string };
          console.log('Decoded Token:', decodedToken);
          return decodedToken.sub; // 'sub' es el campo comúnmente usado para el ID de usuario
        } catch (error) {
          console.error('Error al decodificar el token:', error);
        }
      } else {
        console.error('No se encontró un token en localStorage.');
      }
    } else {
      console.error('localStorage no está disponible en este entorno.');
    }
    return '';
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

