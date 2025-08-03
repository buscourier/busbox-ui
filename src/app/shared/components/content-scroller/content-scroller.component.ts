import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  HostBinding,
  HostListener,
  ViewChild,
} from '@angular/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-content-scroller',
  imports: [],
  templateUrl: './content-scroller.component.html',
  styleUrl: './content-scroller.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentScrollerComponent implements AfterViewInit {
  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef<HTMLElement>;
  @ViewChild('scrollProgress', { static: false }) scrollProgress!: ElementRef<HTMLElement>;

  @HostBinding('class') get hostClasses(): string {
    return cn('block rounded-lg p-4 shadow-lg');
  }

  get scrollIndicatorClass(): string {
    return cn(
      'relative mb-4 h-1 w-full cursor-pointer overflow-hidden',
      'rounded-full bg-gray-200 transition-colors hover:bg-gray-300',
    );
  }

  get scrollProgressClass(): string {
    return cn(
      'h-full rounded-full transition-all duration-75',
      'bg-gradient-to-r from-yellow-500/50 to-yellow-500',
    );
  }

  private updateProgressFn?: () => void;
  private isIndicatorActive = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initScrollIndicator();
    }, 100);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.updateProgressFn) {
      setTimeout(this.updateProgressFn, 50);
    }
  }

  onContainerScroll(): void {
    if (this.updateProgressFn) {
      this.updateProgressFn();
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!this.contentContainer?.nativeElement) return;

    const container = this.contentContainer.nativeElement;

    // Check visibility if content in viewport
    const containerRect = container.getBoundingClientRect();
    const isTableVisible = containerRect.top < window.innerHeight && containerRect.bottom > 0;

    if (!isTableVisible) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) return;

    const scrollDirection = event.deltaY > 0 ? 'right' : 'left';

    if (
      (scrollDirection === 'right' && scrollLeft < maxScroll) ||
      (scrollDirection === 'left' && scrollLeft > 0)
    ) {
      event.preventDefault();

      const newScrollPosition = Math.max(0, Math.min(maxScroll, scrollLeft + event.deltaY));

      container.scrollTo({
        left: newScrollPosition,
        behavior: 'auto',
      });
    }
  }

  private initScrollIndicator(): void {
    if (!this.contentContainer?.nativeElement || !this.scrollProgress?.nativeElement) {
      return;
    }

    const container = this.contentContainer.nativeElement;
    const progress = this.scrollProgress.nativeElement;

    this.updateProgressFn = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      const indicatorContainer = progress.parentElement;
      if (!indicatorContainer) return;

      if (scrollWidth <= clientWidth) {
        indicatorContainer.style.display = 'none';
        return;
      } else {
        indicatorContainer.style.display = 'block';
      }

      const maxScroll = scrollWidth - clientWidth;
      const scrollPercent = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

      // Width calculation
      const visibleRatio = clientWidth / scrollWidth;
      const indicatorWidth = Math.max(20, visibleRatio * 100); // Min 20%

      const maxPosition = 100 - indicatorWidth;
      const position = (scrollPercent / 100) * maxPosition;

      progress.style.width = `${indicatorWidth}%`;
      progress.style.transform = `translateX(${position}%)`;
    };

    this.updateProgressFn();
  }

  onIndicatorClick(event: MouseEvent): void {
    if (!this.contentContainer?.nativeElement || this.isIndicatorActive) return;

    this.isIndicatorActive = true;

    const indicatorContainer = event.currentTarget as HTMLElement;
    const container = this.contentContainer.nativeElement;

    const rect = indicatorContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));

    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = (clickPercent / 100) * maxScroll;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.isIndicatorActive = false;
    }, 300);
  }

  onIndicatorKeydown(event: KeyboardEvent): void {
    if (!this.contentContainer?.nativeElement) return;

    const container = this.contentContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    const scrollStep = maxScroll * 0.1; // 10%

    let newScroll = currentScroll;

    switch (event.key) {
      case 'ArrowLeft':
      case 'Home':
        newScroll = event.key === 'Home' ? 0 : Math.max(0, currentScroll - scrollStep);
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'End':
        newScroll =
          event.key === 'End' ? maxScroll : Math.min(maxScroll, currentScroll + scrollStep);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        // When the user presses the Enter or Space key scroll 50%
        newScroll = maxScroll * 0.5;
        event.preventDefault();
        break;
    }

    if (newScroll !== currentScroll) {
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  }

  scrollToPosition(position: number): void {
    if (!this.contentContainer?.nativeElement) return;

    const container = this.contentContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.max(0, Math.min(maxScroll, position));

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }

  scrollToPercent(percent: number): void {
    if (!this.contentContainer?.nativeElement) return;

    const container = this.contentContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = (Math.max(0, Math.min(100, percent)) / 100) * maxScroll;

    this.scrollToPosition(targetScroll);
  }
}
