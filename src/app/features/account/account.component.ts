import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, PageLayoutComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
