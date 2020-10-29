import { TestBed } from '@angular/core/testing';

import { FilmLocationService } from './film-location.service';

describe('FilmLocationServiceService', () => {
  let service: FilmLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
