import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-services',
  imports: [RouterOutlet, PageLayoutComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {}
