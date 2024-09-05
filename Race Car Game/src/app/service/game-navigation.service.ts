import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerDataService } from './player-data.service';

@Injectable({
  providedIn: 'root',
})
export class GameNavigationService {
  constructor(
    private router: Router,
    private playerDataService: PlayerDataService
  ) {}

  navigateToStart() {
    this.router.navigate(['/intro-page']);
  }

  navigateToGamePage(colorPalette: string) {
    this.router.navigate(['/game-page', { colors: colorPalette }]);
  }

  checkPlayerDataAndNavigate(colorPalette: string) {
    const playerName = this.playerDataService.getPlayerName();
    const playerEmail = this.playerDataService.getPlayerEmail();

    if (playerName && playerEmail) {
      this.router.navigate(['/game-page', { colors: colorPalette }]);
    } else {
      alert('Please provide Player Name and Email.');
      this.navigateToStart();
    }
  }
}
