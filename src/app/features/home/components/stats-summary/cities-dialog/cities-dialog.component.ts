import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import {
  type TuiDialogContext,
  TuiLabel,
  TuiScrollbar,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { distinctUntilChanged, type Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cities-dialog',
  imports: [
    FormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    ReactiveFormsModule,
    AsyncPipe,
    TuiScrollbar,
    TuiAutoFocus,
  ],
  templateUrl: './cities-dialog.component.html',
  styleUrl: './cities-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitiesDialogComponent implements OnInit {
  readonly context = injectContext<TuiDialogContext<string, { title: string; cities: string[] }>>();

  searchControl = new FormControl<string>('');
  filteredCities$!: Observable<string[]>;

  get title(): string {
    return this.context.data.title;
  }

  get cities(): string[] {
    return this.context.data.cities;
  }

  ngOnInit(): void {
    this.filteredCities$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      // debounceTime(300),
      distinctUntilChanged(),
      map((searchValue) => {
        const search = searchValue?.toLowerCase() || '';

        if (!search) {
          return this.cities;
        }

        return this.cities.filter((city) => city.toLowerCase().includes(search));
      }),
    );
  }

  groupCitiesByLetter(cities: string[]) {
    return cities.reduce(
      (groups, city) => {
        const firstLetter = city.charAt(0).toUpperCase();

        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }

        groups[firstLetter].push(city);
        return groups;
      },
      {} as Record<string, string[]>,
    );
  }

  getSortedGroups(cities: string[]) {
    const grouped = this.groupCitiesByLetter(cities);

    const sortedLetters = Object.keys(grouped).sort((a, b) =>
      a.localeCompare(b, 'ru', { numeric: true }),
    );

    sortedLetters.forEach((letter) => {
      grouped[letter].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
    });

    return sortedLetters.map((letter) => ({
      letter,
      cities: grouped[letter],
    }));
  }
}
