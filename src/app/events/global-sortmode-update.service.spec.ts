import { TestBed } from '@angular/core/testing';

import { GlobalSortmodeUpdateService } from './global-sortmode-update.service';

describe('GlobalSortmodeUpdateService', () => {
  let service: GlobalSortmodeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalSortmodeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
