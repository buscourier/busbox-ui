import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-complex-tasks',
  imports: [],
  templateUrl: './complex-tasks.component.html',
  styleUrl: './complex-tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplexTasksComponent {}
