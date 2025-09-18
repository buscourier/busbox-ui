import { animate, keyframes, style, transition, trigger } from '@angular/animations';

export const parcelItemAnimation = trigger('parcelItem', [
  transition(':enter', [
    animate(
      '500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      keyframes([
        style({
          opacity: 0,
          transform: 'scale(0.8) translateY(20px) rotate(-2deg)',
          offset: 0,
        }),
        style({
          opacity: 0.5,
          transform: 'scale(0.9) translateY(10px) rotate(1deg)',
          offset: 0.5,
        }),
        style({
          opacity: 1,
          transform: 'scale(1) translateY(0) rotate(0)',
          offset: 1,
        }),
      ]),
    ),
  ]),
  transition(':leave', [
    animate(
      '350ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      keyframes([
        style({
          opacity: 1,
          transform: 'scale(1) translateX(0)',
          offset: 0,
        }),
        style({
          opacity: 0.5,
          transform: 'scale(0.95) translateX(10px)',
          offset: 0.3,
        }),
        style({
          opacity: 0,
          transform: 'scale(0.9) translateX(30px)',
          offset: 1,
        }),
      ]),
    ),
  ]),
]);
