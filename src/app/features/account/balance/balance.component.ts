import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { BalanceFacade } from './balance.facade';
import type { BalanceViewModel } from './types';

@Component({
  selector: 'app-balance',
  imports: [AsyncPipe, TuiButton, TuiHintDirective, TuiCurrencyPipe, TuiSkeleton],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceComponent implements OnInit {
  vm$!: Observable<BalanceViewModel>;

  facade = inject(BalanceFacade);

  ngOnInit(): void {
    this.vm$ = this.facade.getViewModel();
    this.loadSummary();
  }

  loadSummary(): void {
    this.facade.loadSummary();
  }
}
