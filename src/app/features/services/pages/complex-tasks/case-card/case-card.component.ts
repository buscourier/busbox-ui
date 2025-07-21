import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

import type { Case } from '@core/services';
import { cn } from '@core/utils';

@Component({
  selector: 'app-case-card',
  imports: [TuiIcon, TuiSkeleton, RouterLink, NgOptimizedImage],
  templateUrl: './case-card.component.html',
  styleUrl: './case-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCardComponent {
  @Input() case!: Case;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'block bg-white rounded-xl overflow-hidden transition-all duration-300',
      'shadow-lg  hover:-translate-y-1 hover:shadow-xl',
      'border-8 border-white',
    );
  }

  // imageLoaded = false;
  // imageError = false;
  //
  // onImageLoad(): void {
  //   this.imageLoaded = true;
  // }
  //
  // onImageError(): void {
  //   this.imageError = true;
  //   this.imageLoaded = true; // Скрываем лоадер даже при ошибке
  // }
}
