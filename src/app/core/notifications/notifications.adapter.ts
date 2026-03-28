import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsAdapter {
  error(message: string): void {
    this.show('error', message);
  }

  success(message: string): void {
    this.show('success', message);
  }

  private readonly alert = inject(TuiAlertService);

  private readonly labels: Record<'error' | 'success', string> = {
    error: 'Ошибка',
    success: 'Готово',
  };

  private show(kind: 'error' | 'success', message: string): void {
    this.alert
      .open(message, {
        label: this.labels[kind],
        autoClose: 0,
        appearance: kind,
      })
      .subscribe();
  }
}
