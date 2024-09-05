import { Component, OnInit } from '@angular/core';
import { HighscoreService } from '../service/highscore.service';
import { CommonModule } from '@angular/common';
import { SortHighscorePipe } from '../filters/sort-highscore.pipe';
import { Highscore } from '../highscore.model';

@Component({
  selector: 'app-highscore',
  standalone: true,
  templateUrl: './highscore.component.html',
  styleUrl: './highscore.component.scss',
  imports: [CommonModule, SortHighscorePipe],
})
export class HighscoreComponent implements OnInit {
  highscores: Highscore[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private highscoreService: HighscoreService) {}

  ngOnInit() {
    this.highscoreService.getHighscores().subscribe({
      next: (data: Highscore[]) => {
        this.highscores = data
          .sort((a: Highscore, b: Highscore) => b.score - a.score)
          .slice(0, 10);
      },
      error: (error) => {
        console.error('Error fetching highscores', error);
      },
    });
  }
  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.highscores.sort((a, b) =>
      order === 'desc' ? b.score - a.score : a.score - b.score
    );
  }
}
