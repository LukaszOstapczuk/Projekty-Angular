import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss',
})
export class GameInfoComponent {
  @Input() gameStatus: string = '';
  @Input() points: number = 0;

  constructor() {}
}
