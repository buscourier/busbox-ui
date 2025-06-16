import { TestBed } from '@angular/core/testing';

import { InvoiceGeneratorService } from './invoice-generator.service';

describe('InvoiceGeneratorService', () => {
  let service: InvoiceGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
