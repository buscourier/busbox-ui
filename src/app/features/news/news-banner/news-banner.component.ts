import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiSkeleton } from '@taiga-ui/kit';

import { cn } from '@core/utils';

import type { NewsItem } from '@news/types';

@Component({
  selector: 'app-news-banner',
  imports: [RouterLink, TuiSkeleton],
  templateUrl: './news-banner.component.html',
  styleUrl: './news-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsBannerComponent {
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
