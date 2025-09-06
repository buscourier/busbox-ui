import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import type { Observable } from 'rxjs';

import { PageContentService, type PageViewModel } from '@core/services';
import { cn } from '@core/utils';

import { BreadcrumbsComponent } from '@shared/components/breadcrumbs';

@Component({
  selector: 'app-page-layout',
  imports: [BreadcrumbsComponent, AsyncPipe],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent implements OnInit {
  @Input() showTitle!: boolean;
  @Input() showDescription!: boolean;
  @Input() showBreadcrumbs!: boolean;

  @HostBinding('class') get hostClass(): string {
    return cn('block w-full pb-10 md:pb-16');
  }

  pageViewModel$!: Observable<PageViewModel>;

  private readonly pageContentService = inject(PageContentService);

  ngOnInit(): void {
    this.pageViewModel$ = this.pageContentService.getPageViewModel();
  }
}
