import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, tuiDialog } from '@taiga-ui/core';

import { CONTACT_INFO } from '@core/tokens';

import { ListComponent, ListItemDirective } from '@shared/components/list';
import { ContactLinkPipe } from '@shared/pipes';

import { ResumeComponent } from './resume';
import { StatsComponent } from './stats';

@Component({
  selector: 'app-career',
  imports: [
    NgOptimizedImage,
    ListItemDirective,
    ListComponent,
    TuiButton,
    StatsComponent,
    ContactLinkPipe,
  ],
  templateUrl: './career.component.html',
  styleUrl: './career.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerComponent {
  protected readonly contact = inject(CONTACT_INFO);

  suggestions = [
    `Стать частью уникальной компании, не имеющей аналогов в России.`,
    `Выполнять задачи, которые помогают развитию Приморского края и республики
     Татарстан, ведь наши клиенты - крупные компании регионов.`,
    `Радовать посылками счастливых получателей!`,
    `Работать под началом опытных и позитивных людей.`,
    `Влиять на процессы развития всей компании.`,
    `Стабильную зарплату.`,
    `Перспективы карьерного роста.`,
  ];

  tasks = [
    `Приемка и отправка посылок и документов`,
    `Ведение баз данных в специальных, современных программах.`,
    `Оформление необходимых документов для отправок.`,
  ];

  matches = [
    `Быстро понимаешь смысл задач компании и ты хочешь научишься их решать.`,
    `Тебя вдохновлят общением с людьми и решение их задач.`,
    `У тебя четкая, внятная речь и дружелюбный настрой.`,
  ];

  dialog = tuiDialog(ResumeComponent, {
    size: 'm',
  });

  openResume(): void {
    this.dialog(1).subscribe();
  }
}
