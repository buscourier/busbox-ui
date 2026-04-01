import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import type { Observable } from 'rxjs';

import { CAROUSEL_BREAKPOINTS } from '@core/tokens';

import { CarouselComponent } from '@shared/components/carousel';

import { NewsBannerComponent, NewsFacade } from '@news';

import type { NewsItem } from '@news/types';

@Component({
  selector: 'app-news',
  imports: [AsyncPipe, CarouselComponent, NewsBannerComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  providers: [
    {
      provide: CAROUSEL_BREAKPOINTS,
      useValue: {
        default: 1,
        sm: 2,
        lg: 3,
        xl: 3,
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'group block',
  },
})
export class NewsComponent implements OnInit {
  lastNews$!: Observable<NewsItem[]>;

  private readonly newsFacade = inject(NewsFacade);

  ngOnInit(): void {
    this.lastNews$ = this.newsFacade.getLatestNews();
    this.newsFacade.loadNews();
  }
}
