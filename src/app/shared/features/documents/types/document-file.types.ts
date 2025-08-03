import type { DocumentCategory } from './document-category.types';

export interface DocumentFile {
  name: string;
  type: 'pdf' | 'docx';
  link: string;
  charcode: DocumentCategory;
}
