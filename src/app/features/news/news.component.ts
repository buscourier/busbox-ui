import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import type { Observable } from 'rxjs';

import { NewsFacade } from '@news/news.facade';
import type { NewsViewModel } from '@news/types';

@Component({
  selector: 'app-news',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  vm$!: Observable<NewsViewModel>;

  private readonly newsFacade = inject(NewsFacade);

  ngOnInit(): void {
    this.vm$ = this.newsFacade.getViewModel();

    this.newsFacade.loadNews();
  }
}
