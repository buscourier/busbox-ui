import { NgTemplateOutlet } from '@angular/common';
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  type ElementRef,
  HostBinding,
  Input,
  type OnDestroy,
  type QueryList,
  ViewChildren,
} from '@angular/core';

import { cn } from '@core/utils';

import { StepDirective } from './step.directive';

@Component({
  selector: 'app-steps',
  imports: [NgTemplateOutlet],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent implements AfterViewInit, OnDestroy {
  @Input() separated = false;
  @Input() animationDelay = 150;
  @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;
  @ViewChildren('stepElement') stepElements!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  @HostBinding('class') get hostClasses(): string {
    return cn('block');
  }

  get shadowClass(): string {
    return cn(
      'pointer-events-none absolute inset-0',
      'rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent',
      'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
    );
  }

  get stepPointClass(): string {
    return cn(
      // Layout & positioning
      'relative z-10 flex h-12 w-12 items-center justify-center',
      // Shape & spacing
      'rounded-full',
      // Background & effects
      'bg-gradient-primary shadow-elevated',
      // Typography
      'text-lg font-bold text-gray-900',
    );
  }

  get stepContentClass(): string {
    return cn(
      'rounded-2xl p-6',
      'bg-gradient-card shadow-card hover:shadow-elevated',
      'transition-all duration-300',
    );
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
            this.observer!.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' },
    );

    this.stepElements.forEach((el) => {
      this.observer!.observe(el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
