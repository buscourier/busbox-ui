import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { NewsCardComponent, NewsFacade } from '@news';
import type { NewsItem } from '@news/types';

@Component({
  selector: 'app-news',
  imports: [AsyncPipe, TuiButton, RouterLink, NewsCardComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
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
