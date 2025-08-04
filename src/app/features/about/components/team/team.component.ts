import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { NavigationService } from '@core/services';
import { cn } from '@core/utils';

import { ListComponent, ListItemDirective } from '@shared/components/list';

@Component({
  selector: 'app-team',
  imports: [NgOptimizedImage, ListComponent, ListItemDirective, TuiButton, TuiIcon, RouterLink],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'gap grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-12 xl:grid-cols-[495px_1fr] xl:gap-20',
    );
  }

  private readonly navigationService = inject(NavigationService);

  get careerLink(): string {
    return this.navigationService.findByLink('career')!.link;
  }

  activities = [
    { text: 'Проводим планерки', icon: '@tui.users' },
    { text: 'Совместные выезды', icon: '@tui.map-pin' },
    { text: 'Обучение и тренинги', icon: '@tui.trending-up' },
    { text: 'Интересные и яркие корпоративы', icon: '@tui.star' },
  ];
}
