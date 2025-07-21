import type { TemplateRef } from '@angular/core';

export enum PageFormat {
  A4 = 'a4',
  LETTER = 'letter',
}

export enum PageOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

export enum ImageFormat {
  PNG = 'png',
  JPEG = 'jpeg',
  WEBP = 'webp',
}

export interface DocumentProcessingOptions {
  scale?: number;
  quality?: number;
  pixelRatio?: number;
  skipFonts?: boolean;
  includeQueryParams?: boolean;
  imageLoadTimeout?: number;
  renderWaitTime?: number;
  imageFormat?: ImageFormat;
}

export interface PdfGenerationOptions {
  filename?: string;
  format?: PageFormat;
  orientation?: PageOrientation;
  imageFormat?: ImageFormat;
  showProgress?: boolean;
  onProgress?: (current: number, total: number) => void;
}

export interface DocumentCopyOptions {
  copyLabels?: string[];
  addSeparators?: boolean;
}

export interface PdfGenerationResult {
  success: boolean;
  filename?: string;
  error?: string;
  pageCount?: number;
  fileSize?: number;
  blob?: Blob;
}

export interface PageConfig {
  element: HTMLElement;
  label?: string;
  scale?: number;
  format?: PageFormat;
  orientation?: 'portrait' | 'landscape';
  padding?: string;
  backgroundColor?: string;
}

export interface MultiElementData<T = unknown> {
  elements: HTMLElement[];
  data?: T;
  pageLabels?: string[];
  pageConfigs?: PageConfig[];
  coverPage?: CoverPage;
}

export interface PdfViewerOptions {
  autoDownload?: boolean;
  downloadLabel?: string;
  customActions?: TemplateRef<unknown>;
}

export interface GenerationOptions {
  processing?: Partial<DocumentProcessingOptions>;
  generation?: Partial<PdfGenerationOptions>;
  copies?: Partial<DocumentCopyOptions>;
}

export interface CoverPage {
  title: string;
  description?: string;
}

//
// export const PageFormat = {
//   A4: 'a4',
//   LETTER: 'letter',
// } as const;
//
// export type PageFormat = (typeof PageFormat)[keyof typeof PageFormat];
//
// export const PageOrientation = {
//   PORTRAIT: 'portrait',
//   LANDSCAPE: 'landscape',
// } as const;
//
// export type PageOrientation = (typeof PageOrientation)[keyof typeof PageOrientation];
//
// export const ImageFormat = {
//   PNG: 'png',
//   JPEG: 'jpeg',
//   WEBP: 'webp',
// } as const;
//
// export type ImageFormat = (typeof ImageFormat)[keyof typeof ImageFormat];
//
// export const JsPdfFormat = {
//   JPEG: 'JPEG',
//   PNG: 'PNG',
//   WEBP: 'WEBP',
// } as const;
//
// export type JsPdfFormat = (typeof JsPdfFormat)[keyof typeof JsPdfFormat];
