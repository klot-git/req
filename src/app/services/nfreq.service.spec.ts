import { TestBed } from '@angular/core/testing';

import { NfreqService } from './nfreq.service';

describe('NfreqService', () => {
  let service: NfreqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NfreqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
