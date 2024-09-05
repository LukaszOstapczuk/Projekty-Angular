import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetHighscoresService } from '../service/get-highscores.service';
import { CommonModule } from '@angular/common';
import { SortHighscorePipe } from '../filters/sort-highscore.pipe';
import { PlayerDataService } from '../service/player-data.service';
import { Highscore } from '../highscore.model';

@Component({
  selector: 'app-highscore-list',
  standalone: true,
  templateUrl: './highscore-list.component.html',
  styleUrl: './highscore-list.component.scss',
  imports: [CommonModule, SortHighscorePipe],
})
export class HighscoreListComponent implements OnInit, OnDestroy {
  highscores: any[] = [];
  filteredScores: any[] = [];
  playerName: string = '';
  interval: number | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  filterByPlayer: boolean = false;

  constructor(
    private getHighscores: GetHighscoresService,
    private playerDataService: PlayerDataService
  ) {}

  ngOnInit() {
    this.playerName = this.playerDataService.getPlayerName();
    this.loadHighscores();
    this.interval = window.setInterval(() => this.loadHighscores(), 30000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  loadHighscores() {
    this.getHighscores.getHighscores().subscribe(
      (scores) => {
        this.highscores = scores;
        this.applyFilters();
      },
      (error) => {
        console.error('Błąd podczas ładowania wyników: ', error);
      }
    );
  }

  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.applyFilters();
  }

  togglePlayerFilter() {
    this.filterByPlayer = !this.filterByPlayer;
    this.applyFilters();
  }

  applyFilters() {
    let scores = [...this.highscores];
    if (this.filterByPlayer) {
      scores = scores.filter((score) => score.name === this.playerName);
    }
    if (this.sortOrder === 'asc') {
      scores.sort((a, b) => a.score - b.score);
    } else {
      scores.sort((a, b) => b.score - a.score);
    }
    this.filteredScores = scores;
  }
}
