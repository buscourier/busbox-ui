import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { TuiLineClamp, TuiSkeleton } from '@taiga-ui/kit';

import { cn } from '@core/utils';

import type { NewsItem } from '../types';

@Component({
  selector: 'app-news-card',
  imports: [TuiIcon, RouterLink, TuiSkeleton, TuiLineClamp],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent {
  @Input() article!: NewsItem;

  private readonly router = inject(Router);

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'group block overflow-hidden rounded-xl bg-white transition-all duration-300',
      'shadow-lg hover:-translate-y-1 hover:shadow-xl',
      'cursor-pointer border-8 border-white',
    );
  }

  @HostListener('click') onClick(): void {
    this.router.navigate(['/news'], {
      queryParams: { id: this.article.news_id },
    });
  }

  imageLoaded = false;
  imageError = false;

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
    this.imageLoaded = true; // Скрываем лоадер даже при ошибке
  }
}
