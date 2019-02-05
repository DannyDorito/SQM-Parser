import { TestBed } from '@angular/core/testing';
import { SaverService } from './saver.service';

describe('SaverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaverService = TestBed.get(SaverService);
    expect(service).toBeTruthy();
  });
});
