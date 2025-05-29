import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { TuiAlertService } from '@taiga-ui/core';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthFacade } from '@auth';

import { ProfileFacade } from './profile.facade';
import type { ProfileViewModel } from './types';

@Component({
  selector: 'app-profile',
  imports: [RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  vm$!: Observable<ProfileViewModel>;

  index = 0;

  private readonly profileFacade = inject(ProfileFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.vm$ = this.profileFacade.getViewModel();

    this.loadProfile();
    this.setupErrorHandling();
  }

  private loadProfile(): void {
    this.authFacade
      .getCurrentUser()
      .pipe(
        tap((user) => {
          if (user) {
            this.profileFacade.loadAll(user.id);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private setupErrorHandling(): void {
    this.vm$
      .pipe(
        map((vm) => vm.errorStatus),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((errorStatus) => {
        if (errorStatus.fieldsError) {
          this.showErrorNotification('Не удалось загрузить данные пользователя');
        }

        if (errorStatus.fieldsUpdateError) {
          this.showErrorNotification('Не удалось обновить данные пользователя');
        }

        if (errorStatus.confidantsError) {
          this.showErrorNotification('Не удалось загрузить доверенных лиц');
        }
      });
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
