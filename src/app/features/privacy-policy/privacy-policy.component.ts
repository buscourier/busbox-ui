import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { catchError, EMPTY, finalize, type Observable } from 'rxjs';

import { PolicyService } from '@core/services/policy.service';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-privacy-policy',
  imports: [AsyncPipe, TuiSkeleton, TuiRepeatTimes, PageLayoutComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  isLoading = false;

  private readonly policyService = inject(PolicyService);
  private readonly alerts = inject(TuiAlertService);
  private transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  getPageContent(): Observable<string> {
    this.isLoading = true;

    return this.policyService.getPrivacyPolicy().pipe(
      finalize(() => (this.isLoading = false)),
      catchError((err) => {
        this.showErrorNotification(err);
        return EMPTY;
      }),
    );
  }

  private showErrorNotification(message: string): void {
    this.alerts
      .open(message, {
        label: this.transloco.translate('alert.labels.error'),
        autoClose: 0,
        appearance: 'error',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
