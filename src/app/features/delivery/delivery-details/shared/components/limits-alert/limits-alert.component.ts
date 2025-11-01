import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { TuiPopover } from '@taiga-ui/cdk';
import type { TuiAlertOptions } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import type { ParcelItemLimits } from '@delivery/delivery-details/types';

@Component({
  selector: 'app-limits-alert',
  imports: [],
  templateUrl: './limits-alert.component.html',
  styleUrl: './limits-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimitsAlertComponent {
  transloco = inject(TranslocoService);

  protected readonly context =
    injectContext<TuiPopover<TuiAlertOptions<ParcelItemLimits>, ParcelItemLimits>>();

  protected limits = this.context.data;
}
