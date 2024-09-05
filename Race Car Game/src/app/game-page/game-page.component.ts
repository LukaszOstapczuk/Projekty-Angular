import {
  Component,
  HostListener,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
} from '@angular/core';
import { NgxRaceModule, NgxRaceComponent } from 'ngx-race';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameplayHistoryFilterPipe } from '../filters/gameplay-history-filter.pipe';
import { SortHistoryPipe } from '../filters/sort-history.pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerDataService } from '../service/player-data.service';
import { GameInfoComponent } from '../game-info/game-info.component';
import { GameControllerComponent } from '../game-controller/game-controller.component';
import { GameNavigationService } from '../service/game-navigation.service';
import { HighscoreComponent } from '../highscore/highscore.component';
import { TokenVerificationService } from '../service/token-verification.service';
import { GameService } from '../service/postScore.service';
import { subscribeOn } from 'rxjs';
import { HighscoreListComponent } from '../highscore-list/highscore-list.component';

export enum SelectedAction {
  All = 'All',
  GameStarted = 'Game Started',
  GamePaused = 'Game Paused',
  GameResumed = 'Game Resumed',
  GameEnded = 'Game Ended',
  TurboOn = 'Turbo On',
  TurboOff = 'Turbo Off',
  CarOvertaken = 'Car Overtaken',
  ActionLeft = 'Action Left',
  ActionRight = 'Action Right',
}

interface GameFinishEvent {
  playerName: string;
  playerEmail: string;
  gameStatus: string;
  points: number;
  timeSpent: number;
  gameplayHistory: GameplayHistory[];
}
export interface GameplayHistory {
  timeStamp: Date;
  action: string;
}

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgxRaceModule,
    FormsModule,
    GameplayHistoryFilterPipe,
    SortHistoryPipe,
    RouterLink,
    GameInfoComponent,
    GameControllerComponent,
    HighscoreComponent,
    HighscoreListComponent,
  ],
})
export class GamePageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private playerDataService: PlayerDataService,
    private gameNavigationService: GameNavigationService,
    private tokenVerificationService: TokenVerificationService,
    private gameService: GameService
  ) {}
  public selectedColorPalette: string = 'normal';
  public playerName: string = '';
  public playerEmail: string = '';
  public tokenStatus: boolean | null = null;
  public tokenMessage: string = '';
  public score: number = 0;
  public authToken: string = '';

  @Output() exitGameEvent = new EventEmitter<void>();
  @Output() finishGameEvent = new EventEmitter<GameFinishEvent>();

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.selectedColorPalette = params['colors'];
    });
    this.playerName = this.playerDataService.getPlayerName();
    this.playerEmail = this.playerDataService.getPlayerEmail();
    this.gameNavigationService.checkPlayerDataAndNavigate(
      this.selectedColorPalette
    );
    this.tokenVerificationService.tokenStatus$.subscribe(
      (status: boolean | null) => {
        this.tokenStatus = status;
      }
    );

    this.tokenVerificationService.tokenMessage$.subscribe((message: string) => {
      this.tokenMessage = message;
    });
  }

  gameplayHistory: GameplayHistory[] = [];
  timer: any;
  gameStatus: string = 'Ready';
  points: number = 0;
  timeSpent: number = 0;
  selectedAction: string = 'All';
  selectedSortOrder: 'asc' | 'desc' = 'asc';

  get isControlDisabled(): boolean {
    return (
      this.gameStatus === 'Paused' ||
      this.gameStatus === 'Ready' ||
      this.gameStatus === 'Ended'
    );
  }
  get selectedActionValues() {
    return Object.values(SelectedAction);
  }

  @ViewChild(NgxRaceComponent)
  private _race!: NgxRaceComponent;
  public onTurboOnButtonPressed() {
    this._race.actionTurboOn();
  }
  public onTurboOffButtonPressed() {
    this._race.actionTurboOff();
  }
  public onActionStartButtonPressed() {
    this._race.actionStart();
  }
  public onActionStopButtonPressed() {
    this._race.actionStop();
  }
  public onActionResetButtonPressed() {
    this._race.actionReset();
  }
  public onActionLeftButtonPressed() {
    this._race.actionLeft();
  }
  public onActionRightButtonPressed() {
    this._race.actionRight();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameStatus === 'Paused' || this.gameStatus === 'Ended') {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        this.turboOn();
        break;
      case 'ArrowDown':
      case 's':
        this.turboOff();
        break;
      case 'ArrowLeft':
      case 'a':
        this.actionLeft();
        break;
      case 'ArrowRight':
      case 'd':
        this.actionRight();
        break;
    }
  }

  onGameEnd() {
    const token = this.tokenVerificationService.getToken();
    console.log('Sending data to API:', {
      name: this.playerName,
      game: 'race',
      score: this.points,
    });
    this.gameService
      .submitScore(this.playerName, this.points, token)
      .subscribe({
        next: (response) => {
          console.log('Wynik został pomyślnie przesłany:', response);
          console.log('przeslane informacje', subscribeOn);
        },
        error: (error) => {
          if (error.status === 403) {
            console.error('Błąd autoryzacji:', error.message);
          } else if (error.status === 422) {
            console.error('Niekompletne dane:', error.message);
          } else {
            console.error('Nieoczekiwany błąd:', error.message);
          }
        },
      });
  }

  updateGameplayHistory(action: string) {
    if (
      this.gameStatus === 'Started' ||
      this.gameStatus === 'Paused' ||
      this.gameStatus === 'Ended'
    ) {
      this.gameplayHistory.push({ timeStamp: new Date(), action: action });
    }
  }
  finishGame() {
    this.gameStatus = 'Ended';
    if (this._race) {
      this._race.actionStop();
    }
    this.stopTimer();
    this.updateGameplayHistory('Game Ended');
    this.finishGameEvent.emit({
      playerName: this.playerName,
      playerEmail: this.playerEmail,
      gameStatus: this.gameStatus,
      points: this.points,
      timeSpent: this.timeSpent,
      gameplayHistory: this.gameplayHistory,
    });
    this.onGameEnd();
  }

  startGame() {
    this.gameStatus = 'Started';
    this._race.actionStart();
    this.startTimer();
    this.timeSpent = 0;
    this.points = 0;
    this.gameplayHistory = [];
    this.updateGameplayHistory('Game Started');
  }

  resumeGame() {
    this.gameStatus = 'Started';
    this._race.actionStart();
    this.startTimer();
    this.updateGameplayHistory('Game Resumed');
  }

  stopGame() {
    this.gameStatus = 'Paused';
    this._race.actionStop();
    this.stopTimer();
    this.updateGameplayHistory('Game Paused');
  }
  endGame() {
    this.gameStatus = 'Ended';
    this._race.actionStop();
    this.stopTimer();
    this.finishGame();
    this.updateGameplayHistory('Game Ended');
  }
  resetGame() {
    this.gameStatus = 'Ready';
    this._race.actionReset();
    this.stopTimer();
    this.timeSpent = 0;
    this.points = 0;
  }
  exitGame() {
    this.exitGameEvent.emit();
    this.updateGameplayHistory('Game Ended');
  }
  turboOn() {
    if (this.gameStatus === 'Started') {
      this._race.actionTurboOn();
      this.points += 5;
      this.updateGameplayHistory('Turbo On');
    }
  }
  turboOff() {
    this._race.actionTurboOff();
    this.updateGameplayHistory('Turbo Off');
  }

  grantPoints() {
    this.points += 10;
    this.updateGameplayHistory('Car Overtaken');
  }

  actionLeft() {
    this._race.actionLeft();
    this.updateGameplayHistory('Action Left');
  }

  actionRight() {
    this._race.actionRight();
    this.updateGameplayHistory('Action Right');
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.timeSpent = this.timeSpent + 1000;
      if (this.timeSpent % 300000 === 0) {
        this.points += 25;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.timer as any);
  }

  gameOver() {
    this.stopTimer();
    this.gameStatus = 'Ended';
    this.updateGameplayHistory('Game Ended');
    setTimeout(() => {
      if (this._race) {
        this._race.actionStop();
      }
      this.onGameEnd();
    }, 3000);
  }
}
