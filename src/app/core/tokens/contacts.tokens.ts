import { InjectionToken } from '@angular/core';

export const PHONE_NUMBER = new InjectionToken<string>('Phone number');
export const MOBILE_NUMBER = new InjectionToken<string>('Mobile number');
export const TELEGRAM_ACCOUNT = new InjectionToken<string>('Telegram account');
export const WHATSAPP = new InjectionToken<string>('WhatsApp');
export const EMAIL = new InjectionToken<string>('Email address');

export interface ContactInfo {
  phone: string;
  mobile: string;
  telegram: string;
  whatsapp: string;
  email: string;
}

export const CONTACT_INFO = new InjectionToken<ContactInfo>('Contact information');
