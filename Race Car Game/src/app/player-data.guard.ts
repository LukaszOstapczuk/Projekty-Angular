import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PlayerDataService } from './service/player-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private playerDataService: PlayerDataService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.playerDataService.hasPlayerData()) {
      return true;
    } else {
      this.router.navigate(['/intro-page']);
      return false;
    }
  }
}
