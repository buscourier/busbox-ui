import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination, TuiSkeleton } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { ORGANIZATION_FIELD_ALIASES, PERSONAL_FIELD_ALIASES } from '../../constants';
import { ProfileFacade } from '../../profile.facade';
import type { ProfileViewModel } from '../../types';

@Component({
  selector: 'app-profile-view',
  imports: [AsyncPipe, TuiSkeleton, TuiButton, RouterLink, TuiCarousel, TuiPagination],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileViewComponent implements OnInit {
  vm$!: Observable<ProfileViewModel>;
  index = 0;

  protected readonly PERSONAL_FIELD_ALIASES = PERSONAL_FIELD_ALIASES;
  protected readonly ORGANIZATION_FIELD_ALIASES = ORGANIZATION_FIELD_ALIASES;

  private readonly profileFacade = inject(ProfileFacade);

  ngOnInit(): void {
    this.vm$ = this.profileFacade.getViewModel();
  }
}
