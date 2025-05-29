import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { Observable } from 'rxjs';

import { TitleService } from '@core/services/title.service';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  pageTitle$!: Observable<string>;

  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.pageTitle$ = this.titleService.getTitle();
  }
}
