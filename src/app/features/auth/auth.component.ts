import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { TuiNotification } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { PageContentService, type PageViewModel } from '@core/services';

import { PageLayoutComponent } from '@shared/layouts/page-layout';
import type { ApiError } from '@shared/types';

import { AuthFacade } from './auth.facade';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, TuiNotification, AsyncPipe, PageLayoutComponent],
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
  pageViewModel$!: Observable<PageViewModel>;

  error$!: Observable<ApiError | null>;

  private readonly pageContentService = inject(PageContentService);
  private readonly authFacade = inject(AuthFacade);

  ngOnInit(): void {
    this.error$ = this.authFacade.getError();
    this.pageViewModel$ = this.pageContentService.getPageViewModel();
  }
}
