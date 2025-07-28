import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

import { cn } from '@core/utils';

import type { NewsItem } from '../types';

@Component({
  selector: 'app-news-card',
  imports: [TuiIcon, RouterLink, TuiSkeleton],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent {
  @Input() article!: NewsItem;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'block overflow-hidden rounded-xl bg-white transition-all duration-300',
      'shadow-lg hover:-translate-y-1 hover:shadow-xl',
      'border-8 border-white',
    );
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
