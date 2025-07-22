import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { type TuiDialogContext, TuiIcon } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { type Case, CasesService } from '@core/services';
import { cn } from '@core/utils';

@Component({
  selector: 'app-case-details',
  imports: [NgOptimizedImage, TuiIcon],
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'before:absolute z-[2px] before:top-2 before:right-2 before:size-12',
      'before:bg-white before:rounded-full',
    );
  }

  case!: Case | null;

  // imageLoaded = false;
  // imageError = false;

  protected get id(): string {
    return this.context.data;
  }

  readonly context = injectContext<TuiDialogContext<string, string>>();
  private readonly casesService = inject(CasesService);

  ngOnInit(): void {
    this.case = this.casesService.getCaseById(this.id);
  }
}
