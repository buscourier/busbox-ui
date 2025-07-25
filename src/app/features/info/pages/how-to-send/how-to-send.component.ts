import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-how-to-send',
  imports: [SidebarLayoutComponent],
  templateUrl: './how-to-send.component.html',
  styleUrl: './how-to-send.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToSendComponent {}
