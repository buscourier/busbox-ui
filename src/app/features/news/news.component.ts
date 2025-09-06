import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';
import { type Observable, tap } from 'rxjs';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { NewsCardComponent } from './news-card';
import { NewsDetailsComponent } from './news-details';
import { NewsFacade } from './news.facade';
import type { NewsViewModel } from './types';

@Component({
  selector: 'app-news',
  imports: [AsyncPipe, NewsCardComponent, PageLayoutComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  vm$!: Observable<NewsViewModel>;

  newsDetailsDialog = tuiDialog(NewsDetailsComponent, {
    closeable: true,
    dismissible: true,
    size: 'l',
  });

  private readonly newsFacade = inject(NewsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.vm$ = this.newsFacade.getViewModel();

    this.newsFacade.loadNews();

    this.route.queryParams
      .pipe(
        tap(({ id }) => {
          if (id) {
            this.showNewsDetails(id);
          }
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  showNewsDetails(id: string): void {
    this.newsDetailsDialog(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.router.navigate(['/news']);
        },
      });
  }
}
