import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloadIconsService {
  private iconCache = new Map<string, string>();

  async preloadIcons(iconNames: string[]) {
    const promises = iconNames.map(async (name) => {
      if (!this.iconCache.has(name)) {
        try {
          const response = await fetch(`/assets/icons/${name}.svg`);
          const svgContent = await response.text();
          this.iconCache.set(name, svgContent);
        } catch (error) {
          console.warn(`Failed to preload icon: ${name}`, error);
        }
      }
    });

    await Promise.all(promises);
  }

  getIcon(name: string): string | null {
    return this.iconCache.get(name) || null;
  }
}
