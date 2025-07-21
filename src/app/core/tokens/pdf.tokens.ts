import { InjectionToken } from '@angular/core';

import type {
  DocumentRenderer,
  DomProcessor,
  ImageConverter,
  PdfBuilder,
  ProgressIndicator,
} from '../services/pdf';

export const DOM_PROCESSOR = new InjectionToken<DomProcessor>('DomProcessor');
export const IMAGE_CONVERTER = new InjectionToken<ImageConverter>('ImageConverter');
export const PDF_BUILDER = new InjectionToken<PdfBuilder>('PdfBuilder');
export const PROGRESS_INDICATOR = new InjectionToken<ProgressIndicator>('ProgressIndicator');
export const DOCUMENT_RENDERER = new InjectionToken<DocumentRenderer<unknown>>('DocumentRenderer');
