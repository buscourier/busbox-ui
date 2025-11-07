import type { ServerRoute } from '@angular/ssr';
import { RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // SSG - Static Site Generation
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  // {
  //   path: 'about',
  //   renderMode: RenderMode.Prerender,
  // },
  {
    path: 'services',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'services/**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/how-to-send',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/how-to-receive',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/cargo-rules',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/storage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/documents',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contacts',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'career',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Server,
  },
  {
    path: 'feedback',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'info/tariffs',
    renderMode: RenderMode.Server,
  },
  {
    path: 'news',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tracking',
    renderMode: RenderMode.Server,
  },

  // CSR - Client-Side Rendering
  {
    path: 'auth/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'account/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'delivery/**',
    renderMode: RenderMode.Client,
  },

  // Default SSR
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
