import { Injectable } from '@angular/core';

export interface ProgressIndicator {
  show(message?: string): void;

  hide(): void;

  updateProgress(current: number, total: number): void;
}

@Injectable({ providedIn: 'root' })
export class DefaultProgressIndicator implements ProgressIndicator {
  private readonly loadingIndicatorId = 'pdf-generation-loader';

  show(message = 'Создание PDF...'): void {
    if (document.getElementById(this.loadingIndicatorId)) {
      return;
    }

    const loader = document.createElement('div');
    loader.id = this.loadingIndicatorId;
    loader.innerHTML = `
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-black bg-opacity-90 text-sm rounded-lg px-7 py-5 flex items-center gap-2.5 text-white">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>${message}</span>
        </div>
      </div>`;

    document.body.appendChild(loader);
  }

  hide(): void {
    const loader = document.getElementById(this.loadingIndicatorId);
    loader?.remove();
  }

  updateProgress(current: number, total: number): void {
    const loader = document.getElementById(this.loadingIndicatorId);
    if (loader) {
      const progressText = loader.querySelector('span');
      if (progressText) {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        progressText.textContent = `Создание PDF... ${percentage}%`;
      }
    }
  }
}
