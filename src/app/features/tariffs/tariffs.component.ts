import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  inject,
  type OnInit,
  type TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiChip, TuiSkeleton } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { DocumentToPdfService, MultiElementRenderer } from '@core/services/pdf';
import { DOCUMENT_RENDERER } from '@core/tokens';

import { DocumentsFacade, LocationsFacade } from '@shared/store';
import type { DocumentFile, PickupCity } from '@shared/types';

import { TariffsViewerService } from '@tariffs/services';

import { TariffsFacade } from './tariffs.facade';
import type { QueryParams, ParcelsTableData, ParcelTableRow, TariffsViewModel } from './types';

@Component({
  selector: 'app-tariffs',
  imports: [AsyncPipe, TuiSkeleton, FormsModule, TuiChip, TuiRepeatTimes, TuiButton, TuiIcon],
  templateUrl: './tariffs.component.html',
  styleUrl: './tariffs.component.css',
  providers: [
    {
      provide: DOCUMENT_RENDERER,
      useClass: MultiElementRenderer,
    },
    DocumentToPdfService,
    TariffsViewerService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TariffsComponent implements OnInit {
  @ViewChild('zonesContainer', { static: false }) zonesContainer!: ElementRef;
  @ViewChild('parcelsContainer', { static: false }) parcelsContainer!: ElementRef<HTMLElement>;
  @ViewChild('autopartsContainer', { static: false }) autopartsContainer!: ElementRef<HTMLElement>;
  @ViewChild('otherContainer', { static: false }) otherContainer!: ElementRef<HTMLElement>;
  @ViewChild('actions', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  vm$!: Observable<TariffsViewModel>;
  cities$!: Observable<PickupCity[]>;
  rulesDocument$!: Observable<DocumentFile | null>;

  SKELETON_COUNT = 8;

  private readonly facade = inject(TariffsFacade);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly documentsFacade = inject(DocumentsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tariffsViewer = inject(TariffsViewerService);

  ngOnInit(): void {
    this.vm$ = this.facade.getViewModel();
    this.cities$ = this.locationsFacade.getPickupCities();
    this.rulesDocument$ = this.documentsFacade.getRules();

    this.initializeUrl();
  }

  async handlePrint(city: PickupCity | null): Promise<void> {
    this.tariffsViewer
      .generateTariffs(
        {
          zones: this.zonesContainer?.nativeElement,
          parcels: this.parcelsContainer?.nativeElement,
          autoparts: this.autopartsContainer?.nativeElement,
          other: this.otherContainer?.nativeElement,
        },
        city!,
        {
          customActions: this.actionsTemplate,
        },
      )
      .subscribe();
  }

  getZoneRows(tableData: ParcelsTableData, zoneId: string): ParcelTableRow[] {
    // Return only rows that have data for this zone
    return tableData.rows.filter((row) => row.zones[zoneId]);
  }

  onCityChange(city: PickupCity): void {
    this.updateUrl({ cityId: city.id });
  }

  downloadPdf(pdfUrl: string): void {
    this.tariffsViewer.downloadPdf(pdfUrl, `Тарифы_Владивосток.pdf`);
  }

  printPdf(pdfUrl: string): void {
    this.tariffsViewer.printPdf(pdfUrl);
  }

  showRules(document: DocumentFile): void {
    console.log('document.link', document.link);

    this.tariffsViewer.showPdf(document.link, document.name).subscribe();
  }

  private initializeUrl(): void {
    const queryParams = this.route.snapshot.queryParams;

    if (Object.keys(queryParams).length === 0) {
      this.updateUrl({ cityId: '1' });
    }
  }

  private updateUrl(params: Partial<QueryParams>): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }
}
