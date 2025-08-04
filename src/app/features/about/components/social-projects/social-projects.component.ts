import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-social-projects',
  imports: [TuiIcon],
  templateUrl: './social-projects.component.html',
  styleUrl: './social-projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialProjectsComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('mx-auto grid max-w-4xl gap-8 md:grid-cols-2');
  }

  projects = [
    {
      icon: 'man',
      description: 'Бесплатная доставка газет пенсионерам',
    },
    {
      icon: 'shelter',
      description: 'Помощь детскому приюту «Ковчег»',
    },
  ];
}
