import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerDataService } from '../service/player-data.service';
import { PlayerFormComponent } from '../player-form/player-form.component';
import { GameNavigationService } from '../service/game-navigation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenVerificationService } from '../service/token-verification.service';

interface TokenResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerFormComponent],
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'],
})
export class IntroPageComponent {
  public playerName: string = '';
  public playerEmail: string = '';
  public selectedColorPalette: string = 'normal';

  constructor(
    private tokenVerificationService: TokenVerificationService,
    private gameNavigationService: GameNavigationService,
    private playerDataService: PlayerDataService,
    private httpClient: HttpClient
  ) {}

  startGame(playerData: {
    playerName: string;
    playerEmail: string;
    token: string;
  }) {
    this.playerDataService.setPlayerData(
      playerData.playerName,
      playerData.playerEmail
    );
    this.gameNavigationService.navigateToGamePage(this.selectedColorPalette);
    this.startTokenVerification(playerData.token);
  }

  checkToken(token: string): Observable<TokenResponse> {
    const body = { 'auth-token': token };
    return this.httpClient.post<TokenResponse>(
      'http://scores.chrum.it/check-token',
      body,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  startTokenVerification(token: string) {
    this.checkToken(token).subscribe({
      next: (response) => {
        console.log('Odpowiedź serwera: ', response);
        this.tokenVerificationService.setToken(token);
        this.tokenVerificationService.setTokenStatus(response.success);
        this.tokenVerificationService.setTokenMessage(
          response.success
            ? 'Token został pomyślnie zweryfikowany.'
            : 'Weryfikacja tokena nie powiodła się.'
        );
      },
      error: (error) => {
        this.tokenVerificationService.setTokenStatus(false);
        let errorMsg = ` Szczegóły: ${error.error.message}`;
        this.tokenVerificationService.setTokenMessage(
          `${this.tokenVerificationService.getTokenMessageValue()} ${errorMsg}`
        );
      },
    });
  }
}
