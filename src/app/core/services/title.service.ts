import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, mergeMap, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly APP_NAME = 'Баскурьер';
  private titleSubject = new BehaviorSubject<string>('');
  private platformTitle = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private title$ = this.titleSubject.asObservable().pipe(startWith(''));

  constructor() {
    this.initTitleListener();
  }

  private initTitleListener(): void {
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
        this.updateTitle(data['title'] || '');
      });
  }

  private updateTitle(title: string): void {
    this.titleSubject.next(title);

    if (title) {
      this.platformTitle.setTitle(`${this.APP_NAME} | ${title}`);
    } else {
      this.platformTitle.setTitle(this.APP_NAME);
    }
  }

  getTitle(): Observable<string> {
    return this.title$;
  }

  setTitle(title: string): void {
    this.updateTitle(title);
  }

  getFullTitle(): Observable<string> {
    return this.title$.pipe(
      map((title) => (title ? `${this.APP_NAME} | ${title}` : this.APP_NAME)),
    );
  }
}
