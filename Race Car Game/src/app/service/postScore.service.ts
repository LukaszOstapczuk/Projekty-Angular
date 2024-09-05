import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ScoreResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpClient: HttpClient) {}

  submitScore(
    name: string,
    score: number,
    token: string
  ): Observable<ScoreResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'auth-token': token,
    });

    const body = { name, game: 'race', score };

    return this.httpClient.post<ScoreResponse>(
      'http://scores.chrum.it/scores',
      body,
      {
        headers,
      }
    );
  }
}
