import { TestBed } from '@angular/core/testing';

import { GetHighscoresService } from './get-highscores.service';

describe('GetHighscoresService', () => {
  let service: GetHighscoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetHighscoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
