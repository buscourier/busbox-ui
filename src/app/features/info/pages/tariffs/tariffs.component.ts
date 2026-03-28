import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { TuiNotification } from '@taiga-ui/core';
import { TuiChip, TuiSkeleton } from '@taiga-ui/kit';
import { type Observable, take } from 'rxjs';

import { DocumentToPdfService, MultiElementRenderer } from '@core/services/pdf';
import { DOCUMENT_RENDERER } from '@core/tokens';
import { cn } from '@core/utils';

import { ContentScrollerComponent } from '@shared/components/content-scroller';
import { PdfActionsComponent } from '@shared/components/pdf-actions';
import { type SidebarLayoutAction, SidebarLayoutComponent } from '@shared/layouts';
import type { PickupCity } from '@shared/types';

import { LocationsFacade } from '@store';

import { TariffsViewerService } from './services';
import { TariffsFacade } from './tariffs.facade';
import type { QueryParams, ParcelsTableData, ParcelTableRow, TariffsViewModel } from './types';

@Component({
  selector: 'app-tariffs',
  imports: [
    AsyncPipe,
    TuiSkeleton,
    FormsModule,
    TuiChip,
    TuiRepeatTimes,
    SidebarLayoutComponent,
    PdfActionsComponent,
    TuiNotification,
    ContentScrollerComponent,
  ],
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
  @ViewChild('parcelsFirstContainer', { static: false })
  parcelsFirstContainer!: ElementRef<HTMLElement>;
  @ViewChild('parcelsSecondContainer', { static: false })
  parcelsSecondContainer!: ElementRef<HTMLElement>;
  @ViewChild('autopartsContainer', { static: false }) autopartsContainer!: ElementRef<HTMLElement>;
  @ViewChild('otherContainer', { static: false }) otherContainer!: ElementRef<HTMLElement>;
  @ViewChild('actions', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  vm$!: Observable<TariffsViewModel>;
  cities$!: Observable<PickupCity[]>;

  SKELETON_COUNT = 8;

  get pageActions(): SidebarLayoutAction[] {
    return [
      {
        label: 'Распечатать тарифы',
        icon: '@tui.printer',
        handler: () => {
          this.vm$.pipe(take(1)).subscribe((vm) => {
            this.handlePrint(vm.selectedCity);
          });
        },
      },
    ];
  }

  get cityBadgeClass(): string {
    return cn(
      'animate-fade-in inline-block rounded-full border',
      'border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-yellow-900 transition-all duration-300',
    );
  }

  private observer?: IntersectionObserver;
  private readonly facade = inject(TariffsFacade);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tariffsViewer = inject(TariffsViewerService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.vm$ = this.facade.getViewModel();
    this.cities$ = this.locationsFacade.getPickupCities();

    this.initializeUrl();
  }

  async handlePrint(city: PickupCity | null): Promise<void> {
    this.tariffsViewer
      .generateTariffs(
        {
          zones: this.zonesContainer?.nativeElement,
          parcelsFirst: this.parcelsFirstContainer?.nativeElement,
          parcelsSecond: this.parcelsSecondContainer?.nativeElement,
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
