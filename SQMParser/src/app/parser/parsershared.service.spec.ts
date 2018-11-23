import { TestBed } from '@angular/core/testing';

import { ParserSharedService } from './parsershared.service';

describe('ParsersharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParserSharedService = TestBed.get(ParserSharedService);
    expect(service).toBeTruthy();
  });
});
