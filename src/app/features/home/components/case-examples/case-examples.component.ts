import { animate, style, transition, trigger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';

import { type Case, CasesService, NavigationService } from '@core/services';

@Component({
  selector: 'app-case-examples',
  imports: [TuiCarousel, TuiButton, NgOptimizedImage, RouterLink, TuiPagination, TuiIcon],
  templateUrl: './case-examples.component.html',
  styleUrl: './case-examples.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseExamplesComponent implements OnInit {
  index = 0;
  showExampleInfo = true;
  examples: Case[] = [];

  private readonly casesService = inject(CasesService);
  readonly navigationService = inject(NavigationService);

  get pageLink() {
    return this.navigationService.findByLink('complex-tasks');
  }

  ngOnInit(): void {
    this.examples = this.casesService.getCases();
  }

  onIndex(index: number): void {
    this.showExampleInfo = false;
    this.index = index;

    setTimeout(() => {
      this.showExampleInfo = true;
    }, 50);
  }

  onCarouselIndexChange(): void {
    this.showExampleInfo = false;
    setTimeout(() => {
      this.showExampleInfo = true;
    }, 50);
  }

  get currentExample() {
    return this.examples[this.index];
  }
}
