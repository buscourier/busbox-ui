import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiSkeleton } from '@taiga-ui/kit';
import { catchError, EMPTY, finalize, type Observable } from 'rxjs';

import { NotificationsAdapter } from '@core/notifications';
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

  private readonly notifications = inject(NotificationsAdapter);
  private readonly policyService = inject(PolicyService);

  getPageContent(): Observable<string> {
    this.isLoading = true;

    return this.policyService.getPrivacyPolicy().pipe(
      finalize(() => (this.isLoading = false)),
      catchError(() => {
        this.notifications.error('Не удалось загрузить политику конфиденциальности');
        return EMPTY;
      }),
    );
  }
}
