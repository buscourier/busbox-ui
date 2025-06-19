import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, type Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ModalConfig {
  paramName: string;
  modalFn: (id: string) => Observable<unknown>;
}

export interface ModalUrlOptions {
  clearOtherModals?: boolean;
  replaceHistory?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly destroyDialog$ = new Subject<void>();
  private readonly activeModals = new Map<string, boolean>();
  private readonly destroyRef = inject(DestroyRef);

  private readonly MODAL_PARAMS = ['orderId', 'invoiceId'] as const;

  constructor() {
    this.initPopstateListener();
  }

  showModalWithUrl(
    modalFn: (id: string) => Observable<unknown>,
    id: string,
    paramName: string,
    options: ModalUrlOptions = {},
  ): void {
    const { clearOtherModals = true, replaceHistory = false } = options;

    // Prevent duplicate
    if (this.activeModals.get(paramName)) {
      return;
    }

    const url = new URL(window.location.href);

    if (clearOtherModals) {
      this.clearAllModalParams(url);
    }

    url.searchParams.set(paramName, id);

    if (replaceHistory) {
      window.history.replaceState({}, '', url.toString());
    } else {
      window.history.pushState({}, '', url.toString());
    }

    this.activeModals.set(paramName, true);

    modalFn(id)
      .pipe(
        takeUntil(this.destroyDialog$),
        finalize(() => {
          this.closeModal(paramName);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * Close modal and remove url params
   */
  closeModal(paramName: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    window.history.replaceState({}, '', url.toString());

    this.activeModals.set(paramName, false);
  }

  closeAllModals(): void {
    this.destroyDialog$.next();
    this.clearAllActiveModals();
  }

  isModalOpen(paramName: string): boolean {
    return this.activeModals.get(paramName) || false;
  }

  getActiveModalId(paramName: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  /**
   * Sync modal state with URL
   */
  syncWithUrl(modalConfigs: Record<string, ModalConfig>): void {
    const urlParams = new URLSearchParams(window.location.search);

    Object.entries(modalConfigs).forEach(([paramName, config]) => {
      const id = urlParams.get(paramName);
      if (id && !this.isModalOpen(paramName)) {
        this.showModalWithUrl(config.modalFn, id, paramName, { replaceHistory: true });
      }
    });
  }

  getModalParamsFromUrl(): Record<string, string> {
    const urlParams = new URLSearchParams(window.location.search);
    const modalParams: Record<string, string> = {};

    this.MODAL_PARAMS.forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        modalParams[param] = value;
      }
    });

    return modalParams;
  }

  private initPopstateListener(): void {
    window.addEventListener('popstate', this.handlePopState.bind(this));

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('popstate', this.handlePopState.bind(this));
      this.destroyDialog$.complete();
    });
  }

  private handlePopState(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const hasAnyModalParam = this.MODAL_PARAMS.some((param) => urlParams.has(param));

    if (!hasAnyModalParam) {
      this.closeAllModals();
    }
  }

  private clearAllModalParams(url: URL): void {
    this.MODAL_PARAMS.forEach((param) => {
      url.searchParams.delete(param);
    });
  }

  private clearAllActiveModals(): void {
    this.MODAL_PARAMS.forEach((param) => {
      this.activeModals.set(param, false);
    });
  }
}
