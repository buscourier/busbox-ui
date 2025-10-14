import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';

import { NavigationService } from '@core/services/navigation.service';

import type { LayoutOptions, PageContent, SeoMeta } from '@shared/types';

export interface PageViewModel {
  content: PageContent;
  layout: LayoutOptions;
}

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
export class PageContentService {
  private readonly document = inject(DOCUMENT);
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

  // Отдельные subjects для page и seo данных
  private pageContentSubject = new BehaviorSubject<PageContent>({ title: '' });
  private seoMetaSubject = new BehaviorSubject<SeoMeta>({});
  private pageViewModelSubject = new BehaviorSubject<PageViewModel>({
    content: { title: '' },
    layout: { showTitle: true, showDescription: true, showBreadcrumbs: false },
  });

  private pageContent$ = this.pageContentSubject.asObservable();
  private seoMeta$ = this.seoMetaSubject.asObservable();
  private pageViewModel$ = this.pageViewModelSubject.asObservable();

  constructor() {
    this.initAutoSeoUpdate();
  }

  private initAutoSeoUpdate(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.getActiveRoute()),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.manualSeoActive = false;
        this.updateFromRoute(data);
      });
  }

  private updateFromRoute(data: RouteData): void {
    if (this.manualSeoActive) return;

    const link = this.getCurrentLink(data);

    const pageContent = this.navigationService.getPageContent(link);
    const seoMeta = this.navigationService.getSeoMeta(link);
    const layoutOptions = this.navigationService.getLayoutOptions(link);

    const pageViewModel: PageViewModel = {
      content: pageContent,
      layout: layoutOptions,
    };

    this.pageViewModelSubject.next(pageViewModel);

    this.applySeoMeta(seoMeta);
  }

  private getCurrentLink(data: RouteData): string {
    if (data.pageKey) {
      return data.pageKey;
    }

    // Fallback: извлекаем из URL
    return this.router.url.substring(1).replace('/', '-');
  }

  private applySeoMeta(seoMeta: SeoMeta): void {
    this.setTitle(seoMeta.title);
    this.setDescription(seoMeta.description);
    this.setKeywords(seoMeta.keywords);
    this.setOpenGraph(seoMeta);
    this.setCanonicalUrl(seoMeta.url);
  }

  private setTitle(title?: string): void {
    if (title) {
      this.titleService.setTitle(`${title} | ${this.config.siteName}`);
    } else {
      this.titleService.setTitle(this.config.siteName);
    }
  }

  private setDescription(description?: string): void {
    if (description) {
      this.metaService.updateTag({
        name: 'description',
        content: description,
      });
    } else {
      this.metaService.removeTag('name="description"');
    }
  }

  private setKeywords(keywords?: string[]): void {
    if (keywords?.length) {
      this.metaService.updateTag({
        name: 'keywords',
        content: keywords.join(', '), // Объединяем массив
      });
    } else {
      this.metaService.removeTag('name="keywords"');
    }
  }

  private setOpenGraph(seoMeta: SeoMeta): void {
    this.metaService.updateTag({ property: 'og:site_name', content: this.config.siteName });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: this.config.locale });

    if (seoMeta.title) {
      this.metaService.updateTag({ property: 'og:title', content: seoMeta.title });
    }

    if (seoMeta.description) {
      this.metaService.updateTag({ property: 'og:description', content: seoMeta.description });
    }

    const ogImage = seoMeta.image || this.config.defaultImage;
    this.metaService.updateTag({ property: 'og:image', content: this.getFullUrl(ogImage) });

    const ogUrl = seoMeta.url || this.router.url;
    this.metaService.updateTag({ property: 'og:url', content: this.getFullUrl(ogUrl) });
  }

  private setCanonicalUrl(url?: string): void {
    const canonicalUrl = url ? this.getFullUrl(url) : `${this.config.baseUrl}${this.router.url}`;

    this.updateCanonicalLink(canonicalUrl);
  }

  private updateCanonicalLink(url: string): void {
    if (!this.document) return;

    const existing = this.document.querySelector('link[rel="canonical"]');
    existing?.remove();

    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.config.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  private getActiveRoute(): ActivatedRoute {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  //  Public API
  getPageViewModel(): Observable<PageViewModel> {
    return this.pageViewModel$;
  }

  getPageContent(): Observable<PageContent> {
    return this.pageViewModel$.pipe(map((vm) => vm.content));
  }

  getLayoutOptions(): Observable<LayoutOptions> {
    return this.pageViewModel$.pipe(map((vm) => vm.layout));
  }

  // Layouts Methods
  shouldShowTitle(): Observable<boolean> {
    return this.pageViewModel$.pipe(map((vm) => vm.layout.showTitle));
  }

  shouldShowDescription(): Observable<boolean> {
    return this.pageViewModel$.pipe(map((vm) => vm.layout.showDescription));
  }

  shouldShowBreadcrumbs(): Observable<boolean> {
    return this.pageViewModel$.pipe(map((vm) => vm.layout.showBreadcrumbs));
  }

  /** Заголовок страницы */
  getTitle(): Observable<string> {
    return this.pageContent$.pipe(map((content) => content.title));
  }

  /** Описание страницы */
  getDescription(): Observable<string[]> {
    return this.pageContent$.pipe(map((content) => content.description || []));
  }

  /** SEO метаданные */
  getSeoMeta(): Observable<SeoMeta> {
    return this.seoMeta$;
  }

  /** Ручная установка SEO */
  setManualSeo(seoMeta: SeoMeta): void {
    this.manualSeoActive = true;
    this.seoMetaSubject.next(seoMeta);
    this.applySeoMeta(seoMeta);
  }

  /** Ручная установка контента страницы */
  setManualPageContent(pageContent: PageContent): void {
    this.pageContentSubject.next(pageContent);
  }

  /** Сброс в автоматический режим */
  resetToAutoMode(): void {
    this.manualSeoActive = false;
    const currentRouteData = this.getActiveRoute().snapshot.data;
    this.updateFromRoute(currentRouteData);
  }

  isManualModeActive(): boolean {
    return this.manualSeoActive;
  }
}
