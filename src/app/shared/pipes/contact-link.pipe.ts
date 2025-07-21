import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'contactLink', standalone: true })
export class ContactLinkPipe implements PipeTransform {
  transform(value: string, type: 'tel' | 'telegram' | 'whatsapp' | 'email'): string {
    if (!value) {
      console.warn(`No value for ${type}`);
      return '#';
    }

    switch (type) {
      case 'tel':
        return `tel:${value.replace(/\D/g, '')}`;
      case 'whatsapp':
        return `https://wa.me/${value.replace(/\D/g, '')}`;
      case 'telegram':
        return `https://t.me/${value}`;
      case 'email':
        return `mailto:${value}`;
      default:
        return value;
    }
  }
}
