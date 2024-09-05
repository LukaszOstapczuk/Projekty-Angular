import { Pipe, PipeTransform } from '@angular/core';
import { Highscore } from '../highscore.model';

@Pipe({
  name: 'sortHighscore',
  standalone: true,
})
export class SortHighscorePipe implements PipeTransform {
  transform(items: Highscore[], sortOrder: 'asc' | 'desc'): Highscore[] {
    if (!items) return [];

    const sortedItems = [...items].sort((a, b) => {
      const scoreA = a.score;
      const scoreB = b.score;

      if (sortOrder === 'asc') {
        return scoreA - scoreB;
      } else {
        return scoreB - scoreA;
      }
    });

    return sortedItems;
  }
}
