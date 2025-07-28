import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-storage',
  imports: [RouterLink, ContactLinkPipe],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageComponent {
  private readonly navigationService = inject(NavigationService);
  protected readonly contact = inject(CONTACT_INFO);

  get contactsLink(): string {
    return '/' + this.navigationService.findByLink('contacts')!.link;
  }

  get rulesLink(): string {
    return '/' + this.navigationService.findByLink('cargo-rules')!.link;
  }
}
