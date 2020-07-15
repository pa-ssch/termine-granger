import { TestBed } from '@angular/core/testing';

import { GlobalDisplaymodeUpdateService } from './global-displaymode-update.service';

describe('GlobalDisplaymodeUpdateService', () => {
  let service: GlobalDisplaymodeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDisplaymodeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
