import { TestBed } from '@angular/core/testing';

import { GlobalTaskUpdateService } from './global-task-update.service';

describe('GlobalTaskUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalTaskUpdateService = TestBed.get(GlobalTaskUpdateService);
    expect(service).toBeTruthy();
  });
});
