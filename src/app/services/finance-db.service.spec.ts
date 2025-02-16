import { TestBed } from '@angular/core/testing';

import { FinanceDbService } from './finance-db.service';

describe('FinanceDbService', () => {
  let service: FinanceDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanceDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
