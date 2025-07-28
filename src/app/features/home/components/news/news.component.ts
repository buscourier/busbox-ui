import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { CAROUSEL_BREAKPOINTS } from '@core/tokens';

import { CarouselComponent } from '@shared/components/carousel';

import { NewsCardComponent, NewsFacade } from '@news';
import type { NewsItem } from '@news/types';

@Component({
  selector: 'app-news',
  imports: [AsyncPipe, TuiButton, RouterLink, NewsCardComponent, CarouselComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  providers: [
    {
      provide: CAROUSEL_BREAKPOINTS,
      useValue: {
        default: 1,
        md: 2,
        lg: 3,
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  lastNews$!: Observable<NewsItem[]>;

  private readonly newsFacade = inject(NewsFacade);

  ngOnInit(): void {
    this.lastNews$ = this.newsFacade.getLatestNews();
    this.newsFacade.loadNews();
  }
}
