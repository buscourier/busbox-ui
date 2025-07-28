import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type TemplateRef } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { DocumentsListComponent } from '@shared/features/documents';
import type { DocumentCategory } from '@shared/features/documents/types';

export interface SidebarLayoutAction {
  label: string;
  icon?: string;
  handler: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar-layout',
  imports: [NgTemplateOutlet, TuiButton, TuiIcon, DocumentsListComponent],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutComponent {
  @Input() documentTypes?: DocumentCategory[];
  @Input() actions: SidebarLayoutAction[] = [];
  @Input() customSidebarContent?: TemplateRef<unknown>;
}
