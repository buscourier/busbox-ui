import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiExpand } from '@taiga-ui/experimental';

import {
  type Step,
  StepCardComponent,
  StepDirective,
  StepsComponent,
} from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-cargo-rules',
  imports: [
    SidebarLayoutComponent,
    StepCardComponent,
    StepsComponent,
    StepDirective,
    TuiExpand,
    TuiButton,
  ],
  templateUrl: './cargo-rules.component.html',
  styleUrl: './cargo-rules.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargoRulesComponent {
  isVisible = false;

  steps: Step[] = [
    {
      id: 1,
      icon: '@tui.package',
      title: 'Общие положения',
    },
    {
      id: 2,
      icon: '@tui.files',
      title: 'Отправления, запрещённые к перевозке',
    },
    {
      id: 3,
      icon: '@tui.badge-russian-ruble',
      title: 'Приёмка и выдача отправления',
    },
    {
      id: 4,
      icon: '@tui.package-open',
      title: 'Права и обязанности',
    },
    {
      id: 5,
      icon: '@tui.eye',
      title: 'Независимые обстоятельства',
    },
    {
      id: 6,
      icon: '@tui.triangle-alert',
      title: 'Претензии',
    },
  ];

  show() {
    this.isVisible = true;
  }
}
