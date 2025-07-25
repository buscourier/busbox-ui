import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocumentsListComponent } from '@shared/features/documents';

@Component({
  selector: 'app-documents',
  imports: [DocumentsListComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {}
