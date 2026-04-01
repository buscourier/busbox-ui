import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { Observable } from 'rxjs';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { ProfileFacade } from './profile.facade';
import type { ProfileViewModel } from './types';

@Component({
  selector: 'app-profile',
  imports: [RouterOutlet, PageLayoutComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  vm$!: Observable<ProfileViewModel>;

  index = 0;

  private readonly profile = inject(ProfileFacade);

  ngOnInit(): void {
    this.vm$ = this.profile.getViewModel();

    this.profile.loadAll();
  }
}
