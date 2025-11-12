import type { Provider } from '@angular/core';

import {
  DefaultDomProcessor,
  DefaultProgressIndicator,
  HtmlToImageConverter,
  JsPdfBuilder,
  TripleDocumentRenderer,
} from '@core/services/pdf';
import {
  DOCUMENT_RENDERER,
  DOM_PROCESSOR,
  IMAGE_CONVERTER,
  PDF_BUILDER,
  PROGRESS_INDICATOR,
} from '@core/tokens';

export const PDF_PROVIDERS: Provider[] = [
  {
    provide: DOM_PROCESSOR,
    useClass: DefaultDomProcessor,
  },
  {
    provide: IMAGE_CONVERTER,
    useClass: HtmlToImageConverter,
  },
  {
    provide: PDF_BUILDER,
    useClass: JsPdfBuilder,
  },
  {
    provide: PROGRESS_INDICATOR,
    useClass: DefaultProgressIndicator,
  },
  {
    provide: DOCUMENT_RENDERER,
    useClass: TripleDocumentRenderer,
  },
];
