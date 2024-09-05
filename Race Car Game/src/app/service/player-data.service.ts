import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerDataService {
  private playerName: string = '';
  private playerEmail: string = '';

  constructor() {
    this.loadPlayerData();
  }

  setPlayerData(name: string, email: string) {
    this.playerName = name;
    this.playerEmail = email;
    this.savePlayerData();
  }

  getPlayerName() {
    return this.playerName;
  }

  getPlayerEmail() {
    return this.playerEmail;
  }

  hasPlayerData(): boolean {
    return !!this.playerName && !!this.playerEmail;
  }

  clearPlayerData() {
    this.playerName = '';
    this.playerEmail = '';
    localStorage.removeItem('playerData');
  }

  private savePlayerData() {
    localStorage.setItem(
      'playerData',
      JSON.stringify({
        playerName: this.playerName,
        playerEmail: this.playerEmail,
      })
    );
  }

  private loadPlayerData() {
    const data = localStorage.getItem('playerData');
    if (data) {
      const { playerName, playerEmail } = JSON.parse(data);
      this.playerName = playerName;
      this.playerEmail = playerEmail;
    }
  }
}
