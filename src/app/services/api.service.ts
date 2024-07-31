import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHighScore(): Observable<any> {
    const url = `${this.apiUrl}/SpaceTrader/highscore`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  sendHighScore(score: number, alias: string, gameState: number): Observable<any> {
    const url = `${this.apiUrl}/SpaceTrader/highscore`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { score, alias, gameState };

    return this.http.post<any>(url, payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
