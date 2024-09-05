import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenVerificationService {
  private tokenStatusSource = new BehaviorSubject<boolean | null>(null);
  private tokenMessageSource = new BehaviorSubject<string>('');
  private tokenSource = new BehaviorSubject<string>('');

  public token$ = this.tokenSource.asObservable();
  public tokenStatus$ = this.tokenStatusSource.asObservable();
  public tokenMessage$ = this.tokenMessageSource.asObservable();

  setToken(token: string): void {
    this.tokenSource.next(token);
  }

  getToken(): string {
    return this.tokenSource.value;
  }

  getTokenMessageValue(): string {
    return this.tokenMessageSource.getValue();
  }

  setTokenStatus(status: boolean | null) {
    this.tokenStatusSource.next(status);
  }

  setTokenMessage(message: string) {
    this.tokenMessageSource.next(message);
  }
  clearToken(): void {
    this.tokenSource.next('');
  }
}
