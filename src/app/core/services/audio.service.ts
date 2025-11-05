import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext?: AudioContext;

  playAlertSound(): void {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextCtor =
        (
          window as unknown as {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
          }
        ).AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const ctx = this.audioContext ?? (this.audioContext = new AudioContextCtor());
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      // Soft two-note chime with envelope
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.connect(ctx.destination);

      // Envelope: quick attack, gentle decay
      masterGain.gain.linearRampToValueAtTime(0.06, now + 0.01);
      masterGain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.25);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now + 0.06); // E6
      osc2.connect(masterGain);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.32);
    } catch {
      // best-effort only
    }
  }
}
