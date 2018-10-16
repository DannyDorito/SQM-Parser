import { TestBed } from '@angular/core/testing';

import { LexerService } from './lexer.service';

describe('LexerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LexerService = TestBed.get(LexerService);
    expect(service).toBeTruthy();
  });
});
