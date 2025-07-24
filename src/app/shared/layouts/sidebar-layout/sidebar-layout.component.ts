import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  type TemplateRef,
  ViewChild,
} from '@angular/core';
import { TuiButton, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

import { PdfViewerService } from '@core/services/pdf';

import { DocumentCardComponent } from '@shared/components/document-card';
import { PdfActionsComponent } from '@shared/components/pdf-actions';
import type { DocumentFile } from '@shared/types';

export interface SidebarLayoutAction {
  label: string;
  icon?: string;
  handler: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar-layout',
  imports: [
    DocumentCardComponent,
    NgTemplateOutlet,
    TuiButton,
    TuiIcon,
    PdfActionsComponent,
    TuiLoader,
    TuiSkeleton,
  ],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutComponent {
  @Input() documents: DocumentFile[] = [];
  @Input() isDocumentsLoading = false;
  @Input() actions: SidebarLayoutAction[] = [];
  @Input() customSidebarContent?: TemplateRef<unknown>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  private readonly pdfViewer = inject(PdfViewerService);

  onDocumentShow(document: DocumentFile): void {
    this.pdfViewer
      .showPdf(document.link, document.name, {
        customActions: this.actionsTemplate,
      })
      .subscribe();
  }

  printPdf(url: string) {
    this.pdfViewer.printPdf(url);
  }

  downloadPdf($event: string) {
    console.log('download pdf', $event);
  }
}
