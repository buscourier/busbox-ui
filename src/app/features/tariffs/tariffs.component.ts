import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { TariffsFacade } from './tariffs.facade';
import type { ParcelsTableData, ParcelTableRow, TariffsViewModel } from './types';

@Component({
  selector: 'app-tariffs',
  imports: [AsyncPipe, JsonPipe, CurrencyPipe, TuiSkeleton],
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

  getZoneRows(tableData: ParcelsTableData, zoneId: string): ParcelTableRow[] {
    // Return only rows that have data for this zone
    return tableData.rows.filter((row) => row.zones[zoneId]);
  }

  getSkeletonArray(count: number): number[] {
    return Array(count).fill(0);
  }
}
