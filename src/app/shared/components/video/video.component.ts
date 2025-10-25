import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  type ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { TuiLoader } from '@taiga-ui/core';
type PlyrType = typeof import('plyr').default;
type PlyrInstance = import('plyr').default;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiLoader],
  host: {
    class: `block`,
  },
})
export class VideoComponent {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLDivElement>;
  @Input() src!: string;
  @Input() poster?: string;
  @Input() options?: import('plyr').Options;

  isLoading = true;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private player?: PlyrInstance;
  private initializing = false;

  get trustedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  constructor() {
    afterNextRender(async () => {
      await this.initializePlayer();

      this.destroyRef.onDestroy(() => {
        this.player?.destroy();
      });
    });
  }

  private isYouTube(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/i.test(url);
  }

  private async initializePlayer(): Promise<void> {
    if (this.player || this.initializing) return;

    this.initializing = true;

    const Plyr: PlyrType = (await import('plyr')).default;

    const baseOptions: import('plyr').Options = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      loadSprite: true,
      clickToPlay: true,
      autopause: true,
    };

    this.player = new Plyr(this.videoElement.nativeElement, {
      ...baseOptions,
      ...(this.options ?? {}),
    });

    this.setSource(this.src);

    this.player.once('ready', () => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    this.initializing = false;
  }

  setSource(url: string): void {
    if (!this.player) return;

    if (this.isYouTube(url)) {
      this.player.source = {
        type: 'video',
        sources: [{ src: url, provider: 'youtube' }],
        poster: this.poster,
      };
    } else {
      this.player.source = {
        type: 'video',
        sources: [{ src: url, type: 'video/mp4' }],
        poster: this.poster,
      };
    }
  }
}
