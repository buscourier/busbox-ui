import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';
import { tap } from 'rxjs';

import { type Case, CasesService } from '@core/services';

import { ContactFormComponent } from '@shared/components/contact-form';
import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { CaseCardComponent } from './case-card';
import { CaseDetailsComponent } from './case-details';

@Component({
  selector: 'app-complex-tasks',
  imports: [ContactFormComponent, CaseCardComponent, PageLayoutComponent],
  templateUrl: './complex-tasks.component.html',
  styleUrl: './complex-tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplexTasksComponent implements OnInit {
  cases: Case[] = [];

  caseDetailsDialog = tuiDialog(CaseDetailsComponent, {
    closeable: true,
    dismissible: true,
    size: 'l',
  });

  private readonly casesService = inject(CasesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.cases = this.casesService.getCases();

    this.route.queryParams
      .pipe(
        tap(({ id }) => {
          if (id) {
            this.showCaseDetails(id);
          }
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  showCaseDetails(id: string): void {
    this.caseDetailsDialog(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.router.navigate(['/services/complex-tasks']);
        },
      });
  }
}
