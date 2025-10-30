import { IMAGE_LOADER, type ImageLoaderConfig } from '@angular/common';
import { type Provider } from '@angular/core';

export function provideImageLoader(): Provider {
  return {
    provide: IMAGE_LOADER,
    useFactory: () => {
      return (cfg: ImageLoaderConfig) => {
        const src = cfg.src.trim().replace(/^\/+/, '');

        const ops: string[] = [];
        if (cfg.width) ops.push(`w:${cfg.width}`);
        const q = cfg.loaderParams?.['q'];
        const dpr = cfg.loaderParams?.['dpr'];
        if (q) ops.push(`q:${q}`);
        if (dpr) ops.push(`dpr:${dpr}`);
        if (cfg.isPlaceholder) ops.push('blur:15', 'q:20');

        const opts = ops.length ? `/${ops.join('/')}` : '';

        return `/img/unsafe${opts}/plain/${encodeURIComponent(src)}@webp`;
      };
    },
  };
}
