import { Pipe, PipeTransform } from '@angular/core';
import { GameplayHistory } from '../game-page/game-page.component';

@Pipe({
  name: 'gameplayHistoryFilter',
  standalone: true,
})
export class GameplayHistoryFilterPipe implements PipeTransform {
  transform(items: GameplayHistory[], filter: string): GameplayHistory[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.action === filter || filter === 'All');
  }
}
