import type { Provider } from '@angular/core';
import type { TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_ICON_RESOLVER } from '@taiga-ui/core';

import { PreloadIconsService } from '@core/services';

export function provideIconResolver(): Provider {
  return {
    provide: TUI_ICON_RESOLVER,
    useFactory: (preloadService: PreloadIconsService): TuiStringHandler<string> => {
      return (name: string) => {
        if (name.startsWith('@tui.')) {
          return `assets/taiga-ui/icons/${name.replace('@tui.', '')}.svg`;
        }

        const cachedIcon = preloadService.getIcon(name);
        if (cachedIcon) {
          return `data:image/svg+xml;base64,${btoa(cachedIcon)}`;
        }

        return `/assets/icons/${name}.svg`;
      };
    },
    deps: [PreloadIconsService],
  };
}
