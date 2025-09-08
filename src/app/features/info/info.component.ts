import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-info',
  imports: [RouterOutlet, PageLayoutComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {}
