import { TestBed } from '@angular/core/testing';
import type { CanActivateFn } from '@angular/router';

import { calculatorGuard } from './calculator.guard';

describe('calculatorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => calculatorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
