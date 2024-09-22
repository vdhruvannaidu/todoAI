import { TestBed } from '@angular/core/testing';

import { AuthserverService } from './authserver.service';

describe('AuthserverService', () => {
  let service: AuthserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
