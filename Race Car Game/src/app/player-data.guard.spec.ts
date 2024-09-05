import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { playerDataGuard } from './player-data.guard';

describe('playerDataGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => playerDataGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
