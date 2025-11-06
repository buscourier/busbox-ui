import { JsonPipe, NgOptimizedImage } from '@angular/common';
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

import { cn } from '@core/utils';

import type { ServiceCard, ServiceType } from './service-card.types';

const iconMap: Record<ServiceType, string> = {
  guard: '@tui.shield-check',
  task: '@tui.lightbulb',
  courier: '@tui.zap',
};

const iconLabelMap: Record<ServiceType, string> = {
  guard: 'Безопасно',
  task: 'Индивидуально',
  courier: 'Удобно',
};

const linkMap: Record<ServiceType, string> = {
  guard: 'Подробнее',
  task: 'Посмотреть кейсы',
  courier: 'Подробнее',
};

@Component({
  selector: 'app-service-card',
  imports: [NgOptimizedImage, TuiIcon, RouterLink, JsonPipe],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {
  @Input() service!: ServiceCard;

  private readonly router = inject(Router);

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'group relative block overflow-hidden pb-2',
      'rounded-xl bg-white transition-all duration-300',
      'cursor-pointer text-left shadow-lg hover:-translate-y-1 hover:shadow-xl',
    );
  }

  @HostListener('click') onClick(): void {
    this.router.navigateByUrl(`/services/${this.service.id}`);
  }

  get iconBoxClass() {
    return cn('mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50', {
      'bg-red-50': this.service.type === 'guard',
      'bg-yellow-50': this.service.type === 'task',
      'bg-orange-50': this.service.type === 'courier',
    });
  }

  get iconLabelClass() {
    return cn('text-xs font-medium tracking-wide uppercase', {
      'text-red-500': this.service.type === 'guard',
      'text-white': this.service.type === 'task',
      'text-orange-600': this.service.type === 'courier',
    });
  }

  get iconClass() {
    return cn({
      'text-red-500': this.service.type === 'guard',
      'text-yellow-500': this.service.type === 'task',
      'text-orange-600': this.service.type === 'courier',
    });
  }

  get linkClass() {
    return cn(
      'flex items-center font-medium text-black transition-colors group-hover:text-yellow-500',
    );
  }

  get icon(): string {
    return iconMap[this.service.type];
  }

  get iconLabel(): string {
    return iconLabelMap[this.service.type];
  }

  get link(): string {
    return linkMap[this.service.type];
  }
}
