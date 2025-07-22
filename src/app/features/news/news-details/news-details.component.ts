import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { cn } from '@core/utils';

import { NewsFacade } from '@news';
import type { NewsDetailsViewModel } from '@news/types';

@Component({
  selector: 'app-news-details',
  imports: [AsyncPipe, TuiSkeleton, TuiRepeatTimes],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailsComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'news-content',
      'before:absolute z-[2px] before:top-2 before:right-2 before:size-12',
      'before:bg-white before:rounded-full',
    );
  }

  vm$!: Observable<NewsDetailsViewModel>;

  imageLoaded = false;
  imageError = false;

  readonly context = injectContext<TuiDialogContext<string, string>>();

  private readonly newsFacade = inject(NewsFacade);

  protected get id(): string {
    return this.context.data;
  }

  ngOnInit(): void {
    this.newsFacade.loadNewsDetails(this.id);
    this.vm$ = this.newsFacade.getViewModel().pipe(map((vm) => vm.details));
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
    this.imageLoaded = true; // Скрываем лоадер даже при ошибке
  }
}
