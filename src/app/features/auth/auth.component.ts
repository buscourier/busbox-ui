import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiNotification } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { TitleService } from '@core/services/title.service';

import type { ApiError } from '@shared/types';

import { AuthFacade } from './auth.facade';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, TuiNotification, AsyncPipe, TranslocoPipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  providers: [
    provideTranslocoScope({
      scope: 'features/auth',
      alias: 'auth',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly titleService = inject(TitleService);

  pageTitle$!: Observable<string>;

  error$!: Observable<ApiError | null>;

  ngOnInit(): void {
    this.error$ = this.authFacade.getError();
    this.pageTitle$ = this.titleService.getTitle();
  }
}
