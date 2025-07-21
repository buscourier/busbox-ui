import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-cargo-types',
  imports: [TuiIcon],
  templateUrl: './cargo-types.component.html',
  styleUrl: './cargo-types.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex',
  },
})
export class CargoTypesComponent {}
