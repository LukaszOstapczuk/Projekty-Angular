import { Component } from '@angular/core';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { CommonModule } from '@angular/common';
import { GameplayHistory } from './game-page/game-page.component';
import { RouterOutlet } from '@angular/router';

interface GameFinishEvent {
  playerName: string;
  playerEmail: string;
  gameStatus: string;
  points: number;
  timeSpent: number;
  gameplayHistory: GameplayHistory[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IntroPageComponent, GamePageComponent, CommonModule, RouterOutlet],
  standalone: true,
})
export class AppComponent {}
