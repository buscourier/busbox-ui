import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, mergeMap, startWith } from 'rxjs/operators';

import { NavigationService } from '@core/services/navigation.service';

import type { SeoData } from '@shared/types';

interface RouteData {
  pageKey?: string;
  title?: string;
  description?: string | string[];
  keywords?: string;
  hideBreadcrumb?: boolean;

  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigationService = inject(NavigationService);

  private readonly config = {
    siteName: 'Баскурьер',
    baseUrl: 'https://баскурьер.рф',
    defaultImage: '/assets/images/og-default.jpg',
    locale: 'ru_RU',
  };

  private manualSeoActive = false;
  private currentRoute = '';

  private titleSubject = new BehaviorSubject<string>('');
  private descriptionSubject = new BehaviorSubject<string | string[]>('');

  private title$ = this.titleSubject.asObservable().pipe(startWith(''));
  private description$ = this.descriptionSubject.asObservable().pipe(startWith(''));

  constructor() {
    this.initAutoSeoUpdate();
  }

  private initAutoSeoUpdate(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.currentRoute = this.router.url;
        this.manualSeoActive = false; // Сбрасываем при навигации
        this.updateSeoFromRoute(data);
      });
  }

  private updateSeoFromRoute(data: RouteData): void {
    if (this.manualSeoActive) return;

    let seoData: SeoData = {};

    if (data.pageKey) {
      const navData = this.navigationService.getSeoDataByLink(data.pageKey);
      if (navData) {
        seoData = navData;
      }
    }

    if (!seoData.title && data.title) {
      seoData.title = data.title;
    }
    if (!seoData.description && data.description) {
      seoData.description = data.description;
    }
    if (!seoData.keywords && data.keywords) {
      seoData.keywords = data.keywords;
    }

    this.applySeoData(seoData);
  }

  private applySeoData(data: SeoData): void {
    this.setTitle(data.title);
    this.setDescription(data.description);
    this.setKeywords(data.keywords);
    this.setOpenGraph(data);
    this.setCanonicalUrl(data.url);
  }

  private setTitle(title?: string): void {
    const pageTitle = title || '';
    this.titleSubject.next(pageTitle);

    if (pageTitle) {
      this.titleService.setTitle(`${pageTitle} | ${this.config.siteName}`);
    } else {
      this.titleService.setTitle(this.config.siteName);
    }
  }

  private setDescription(description?: string | string[]): void {
    this.descriptionSubject.next(description || '');

    const pageDescription = Array.isArray(description) ? description.join(' ') : description || '';

    if (pageDescription) {
      this.metaService.updateTag({
        name: 'description',
        content: pageDescription,
      });
    } else {
      // Remove description if it empty
      this.metaService.removeTag('name="description"');
    }
  }

  private setKeywords(keywords?: string): void {
    if (keywords) {
      this.metaService.updateTag({
        name: 'keywords',
        content: keywords,
      });
    } else {
      this.metaService.removeTag('name="keywords"');
    }
  }

  private setOpenGraph(data: SeoData): void {
    this.metaService.updateTag({ property: 'og:site_name', content: this.config.siteName });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: this.config.locale });

    if (data.title) {
      this.metaService.updateTag({ property: 'og:title', content: data.title });
    }

    const ogDescription = Array.isArray(data.description)
      ? data.description.join(' ')
      : data.description;

    if (ogDescription) {
      this.metaService.updateTag({ property: 'og:description', content: ogDescription });
    }

    const ogImage = data.image
      ? this.getFullUrl(data.image)
      : this.getFullUrl(this.config.defaultImage);
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({
      property: 'og:image:alt',
      content: data.title || this.config.siteName,
    });

    const ogUrl = data.url ? this.getFullUrl(data.url) : `${this.config.baseUrl}${this.router.url}`;
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });
  }

  private setCanonicalUrl(url?: string): void {
    const canonicalUrl = url ? this.getFullUrl(url) : `${this.config.baseUrl}${this.router.url}`;

    // Delete existing canonical
    const existing = document.querySelector('link[rel="canonical"]');
    existing?.remove();

    // Add new canonical
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.config.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  // public API
  getDescription(): Observable<string | string[]> {
    return this.description$;
  }

  getTitle(): Observable<string> {
    return this.title$;
  }

  getFullTitle(): Observable<string> {
    return this.title$.pipe(
      map((title) => (title ? `${title} | ${this.config.siteName}` : this.config.siteName)),
    );
  }

  setPageSeo(title: string, description: string | string[], keywords?: string): void {
    this.manualSeoActive = true;
    this.applySeoData({ title, description, keywords });
  }

  resetToAutoMode(): void {
    this.manualSeoActive = false;
    // Перезагружаем SEO для текущего роута
    const currentRouteData = this.getCurrentRouteData();
    if (currentRouteData) {
      this.updateSeoFromRoute(currentRouteData);
    }
  }

  isManualModeActive(): boolean {
    return this.manualSeoActive;
  }

  private getCurrentRouteData(): RouteData {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
  }
}
