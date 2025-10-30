import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-cargo-types',
  imports: [TuiIcon],
  templateUrl: './cargo-types.component.html',
  styleUrl: './cargo-types.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex gap-6 flex-wrap',
  },
})
export class CargoTypesComponent {
  items = [
    {
      name: 'Посылки',
      icon: this.getIcon('parcel'),
    },
    {
      name: 'Документы',
      icon: this.getIcon('docs'),
    },
    {
      name: 'Автозапчасти',
      icon: this.getIcon('box'),
    },
  ];

  getIcon(name: string): string {
    return `/assets/icons/${name}.svg`;
  }
}
