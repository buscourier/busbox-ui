import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appListItem]',
})
export class ListItemDirective {
  public template = inject(TemplateRef<unknown>);
}
