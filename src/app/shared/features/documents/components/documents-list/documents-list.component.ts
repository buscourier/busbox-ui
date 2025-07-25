import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  type OnInit,
  type TemplateRef,
  ViewChild,
} from '@angular/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PdfViewerService } from '@core/services/pdf';
import { cn } from '@core/utils';

import { PdfActionsComponent } from '@shared/components/pdf-actions';

import { DocumentsFacade } from '../../facade';
import type { DocumentCategory, DocumentFile } from '../../types';

import { DocumentCardComponent } from '../document-card';

@Component({
  selector: 'app-documents-list',
  imports: [AsyncPipe, DocumentCardComponent, PdfActionsComponent, TuiSkeleton],
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsListComponent implements OnInit {
  @Input() documentTypes?: DocumentCategory[];
  @Input() allDocuments = false;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  @HostBinding('class') get hostClasses(): string {
    return cn('flex gap-4 flex-wrap');
  }

  documents$!: Observable<DocumentFile[]>;
  isDocumentsLoading$!: Observable<boolean>;

  private readonly documentsFacade = inject(DocumentsFacade);
  private readonly pdfViewer = inject(PdfViewerService);

  ngOnInit(): void {
    this.setupDocuments();
  }

  onDocumentShow(document: DocumentFile) {
    if (document.type === 'pdf') {
      this.openDocument(document);
    } else {
      this.downloadDocument(document);
    }
  }

  openDocument(document: DocumentFile): void {
    this.pdfViewer
      .showPdf(document.link, document.name, {
        customActions: this.actionsTemplate,
      })
      .subscribe();
  }

  downloadDocument(document: DocumentFile): void {
    this.pdfViewer.downloadPdf(document.link, document.name);
  }

  printPdf(url: string) {
    this.pdfViewer.printPdf(url);
  }

  downloadPdf($event: string) {
    console.log('download pdf', $event);
  }

  private setupDocuments(): void {
    this.isDocumentsLoading$ = this.documentsFacade.isLoading$;

    if (this.allDocuments) {
      this.documents$ = this.documentsFacade.getDocuments();
      return;
    }

    if (this.documentTypes && this.documentTypes.length > 0) {
      this.documents$ = this.getDocumentsByTypes(this.documentTypes);
      return;
    }
  }

  private getDocumentsByTypes(types: DocumentCategory[]): Observable<DocumentFile[]> {
    const documentObservables = types.map((type) => this.documentsFacade.getDocumentByType(type));

    return combineLatest(documentObservables).pipe(
      map((docs) => docs.filter((doc) => doc !== null) as DocumentFile[]),
    );
  }
}
