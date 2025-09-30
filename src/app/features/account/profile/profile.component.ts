import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { AuthFacade } from '@auth';

import { ProfileFacade } from './profile.facade';
import type { ProfileViewModel } from './types';

@Component({
  selector: 'app-profile',
  imports: [RouterOutlet, PageLayoutComponent],
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

  ngOnInit(): void {
    this.vm$ = this.profileFacade.getViewModel();

    this.loadProfile();
  }

  private loadProfile(): void {
    this.authFacade
      .getCurrentUser()
      .pipe(
        tap((user) => {
          if (user) {
            this.profileFacade.loadAll();
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
