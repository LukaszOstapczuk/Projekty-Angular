import { Pipe, PipeTransform } from '@angular/core';
import { GameplayHistory } from '../game-page/game-page.component';

@Pipe({
  name: 'sortHistory',
  standalone: true,
})
export class SortHistoryPipe implements PipeTransform {
  transform(
    items: GameplayHistory[],
    sortOrder: 'asc' | 'desc'
  ): GameplayHistory[] {
    if (!items) return [];

    const sortedItems = [...items].sort((a, b) => {
      const dateA = a.timeStamp.getTime();
      const dateB = b.timeStamp.getTime();

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return sortedItems;
  }
}
