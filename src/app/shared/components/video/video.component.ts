import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  type ElementRef,
  inject,
  Input,
  type OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { TuiLoader } from '@taiga-ui/core';
import Plyr from 'plyr';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiLoader],
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLDivElement>;
  @Input() src!: string;
  @Input() poster?: string;

  isLoading = true;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private player?: Plyr;

  get trustedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  // controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  private initializePlayer(): void {
    this.player = new Plyr(this.videoElement.nativeElement, {
      controls: ['play-large', 'progress'],
      autoplay: false,
      hideControls: true,
      loadSprite: true,
      youtube: {
        noCookie: false,
        rel: 0,
        modestbranding: 1,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
      },
    });

    this.player.on('ready', () => {
      this.hideLoader();
    });
  }

  private hideLoader(): void {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.player?.destroy();
  }

  protected readonly onabort = onabort;
}
