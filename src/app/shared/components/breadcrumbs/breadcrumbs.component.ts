import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { type BreadcrumbItem, BreadcrumbsService } from '@core/services';

@Component({
  selector: 'app-breadcrumbs',
  imports: [TuiBreadcrumbs, AsyncPipe, TuiItem, TuiLink, RouterLink, JsonPipe],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  private readonly breadcrumbsService = inject(BreadcrumbsService);

  breadcrumbs$!: Observable<BreadcrumbItem[]>;

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbsService.getBreadcrumbs();
  }
}
