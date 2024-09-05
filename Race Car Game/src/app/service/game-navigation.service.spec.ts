import { TestBed } from '@angular/core/testing';

import { GameNavigationService } from './game-navigation.service';

describe('GameNavigationService', () => {
  let service: GameNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
