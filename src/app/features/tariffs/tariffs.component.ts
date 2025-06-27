import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import type { Observable } from 'rxjs';

import { TariffsFacade } from './tariffs.facade';
import type { TariffsViewModel } from './types';

@Component({
  selector: 'app-tariffs',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './tariffs.component.html',
  styleUrl: './tariffs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TariffsComponent implements OnInit {
  vm$!: Observable<TariffsViewModel>;

  private readonly facade = inject(TariffsFacade);

  ngOnInit(): void {
    this.vm$ = this.facade.getViewModel();

    this.facade.loadAllData('1');
  }
}
