import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DeliveryDetailsComponent } from '@delivery/delivery-details';
import { DeliveryPointComponent } from '@delivery/delivery-point';
import { PickupPointComponent } from '@delivery/pickup-point';

@Component({
  selector: 'app-calculator',
  imports: [PickupPointComponent, DeliveryPointComponent, DeliveryDetailsComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {}
