import { Injectable, type OnDestroy } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';

export interface IntersectionObserverConfig {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export interface IntersectionEntry {
  elementId: string;
  isIntersecting: boolean;
  intersectionRatio: number;
  target: Element;
}

@Injectable({
  providedIn: 'root',
})
export class IntersectionObserverService implements OnDestroy {
  private observers = new Map<string, IntersectionObserver>();
  private intersectionSubjects = new Map<string, BehaviorSubject<IntersectionEntry[]>>();

  createObserver(
    observerId: string,
    config: IntersectionObserverConfig = {},
  ): Observable<IntersectionEntry[]> {
    this.destroyObserver(observerId);

    const defaultConfig: IntersectionObserverConfig = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px',
      ...config,
    };

    const subject = new BehaviorSubject<IntersectionEntry[]>([]);
    this.intersectionSubjects.set(observerId, subject);

    const observer = new IntersectionObserver((entries) => {
      const intersectionEntries: IntersectionEntry[] = entries.map((entry) => ({
        elementId: entry.target.getAttribute('data-observer-id') || '',
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        target: entry.target,
      }));

      subject.next(intersectionEntries);
    }, defaultConfig);

    this.observers.set(observerId, observer);
    return subject.asObservable();
  }

  observe(observerId: string, element: Element, elementId: string): void {
    const observer = this.observers.get(observerId);
    if (!observer) {
      console.warn(`Observer with id "${observerId}" not found`);
      return;
    }

    element.setAttribute('data-observer-id', elementId);
    observer.observe(element);
  }

  unobserve(observerId: string, element: Element): void {
    const observer = this.observers.get(observerId);
    if (observer) {
      observer.unobserve(element);
    }
  }

  destroyObserver(observerId: string): void {
    const observer = this.observers.get(observerId);
    const subject = this.intersectionSubjects.get(observerId);

    if (observer) {
      observer.disconnect();
      this.observers.delete(observerId);
    }

    if (subject) {
      subject.complete();
      this.intersectionSubjects.delete(observerId);
    }
  }

  getCurrentIntersections(observerId: string): IntersectionEntry[] {
    const subject = this.intersectionSubjects.get(observerId);
    return subject ? subject.value : [];
  }

  ngOnDestroy(): void {
    // Clear all observers
    this.observers.forEach((observer) => observer.disconnect());
    this.intersectionSubjects.forEach((subject) => subject.complete());
    this.observers.clear();
    this.intersectionSubjects.clear();
  }
}

/* Example */

// private setupIntersectionObserver(): void {
//   this.intersectionObserver
//     .createObserver('tariffs-observer', {
//       threshold: 0.1,
//       rootMargin: '-50px 0px -50px 0px',
//     })
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((entries) => {
//       let needsDetection = false;
//
//       entries.forEach((entry) => {
//         switch (entry.elementId) {
//           case 'parcels':
//             const newValue = entry.isIntersecting;
//             if (this.documentsInfoVisible !== newValue) {
//               this.documentsInfoVisible = newValue;
//               needsDetection = true;
//             }
//             break;
//         }
//       });
//
//       if (needsDetection) {
//         this.cdr.detectChanges();
//       }
//     });
// }
//
// private observeElements(): void {
//   if (this.parcelsContainer?.nativeElement) {
//   this.intersectionObserver.observe('tariffs-observer', this.parcelsContainer.nativeElement,
//   'parcels');
// }
//
// if (this.autopartsContainer?.nativeElement) {
//   this.intersectionObserver.observe('tariffs-observer', this.autopartsContainer.nativeElement,
//   'autoparts');
// }
// }
//
// private reinitializeObserver(): void {
//   this.intersectionObserver.destroyObserver('tariffs-observer');
//   this.setupIntersectionObserver();
//   this.observeElements();
// }
