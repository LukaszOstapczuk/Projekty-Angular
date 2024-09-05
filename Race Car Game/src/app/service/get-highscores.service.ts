import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Highscore {
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class GetHighscoresService {
  constructor(private http: HttpClient) {}

  getHighscores() {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.get<Highscore[]>('http://scores.chrum.it/race', {
      headers: headers,
    });
  }
}
