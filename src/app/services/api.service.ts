import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHighScore(): Observable<any>{
    const url = `${this.apiUrl}/SpaceTrader/highscore`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(url, {headers});
  }

  sendHighScore(gameState: number, score: number, alias: string): Observable<any> {
    const url = `${this.apiUrl}/SpaceTrader/highscore`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { gameState, score, alias };

    return this.http.post<any>(url, payload, { headers });
  }
}
