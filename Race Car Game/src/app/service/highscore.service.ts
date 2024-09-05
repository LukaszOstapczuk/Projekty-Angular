import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Highscore } from '../highscore.model';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService {
  private url = 'http://scores.chrum.it/race';

  constructor(private http: HttpClient) {}

  getHighscores(): Observable<Highscore[]> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.get<Highscore[]>(this.url, { headers });
  }
}
