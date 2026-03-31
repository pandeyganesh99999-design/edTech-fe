import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeConfig } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme$ = new BehaviorSubject<ThemeConfig | null>(null);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  get currentTheme() {
    return this.currentTheme$.value;
  }

  get theme$() {
    return this.currentTheme$.asObservable();
  }

  applyTheme(theme: ThemeConfig) {
    // Remove existing tenant theme
    this.removeTenantTheme();

    // Apply new theme
    const root = document.documentElement;
    this.renderer.setAttribute(root, 'data-tenant-theme', 'true');

    // Set CSS custom properties for theme colors
    this.setThemeColors(theme);

    this.currentTheme$.next(theme);
  }

  private setThemeColors(theme: ThemeConfig) {
    const root = document.documentElement;

    // Generate color palette from primary color
    const primaryColors = this.generateColorPalette(theme.primary);
    const secondaryColors = this.generateColorPalette(theme.secondary);
    const accentColors = this.generateColorPalette(theme.accent);

    // Apply primary colors
    Object.entries(primaryColors).forEach(([key, value]) => {
      this.renderer.setStyle(root, `--tenant-primary-${key}`, value);
    });

    // Apply secondary colors
    Object.entries(secondaryColors).forEach(([key, value]) => {
      this.renderer.setStyle(root, `--tenant-secondary-${key}`, value);
    });

    // Apply accent colors
    Object.entries(accentColors).forEach(([key, value]) => {
      this.renderer.setStyle(root, `--tenant-accent-${key}`, value);
    });

    // Set logo if provided
    if (theme.logo) {
      this.renderer.setStyle(root, '--tenant-logo', `url(${theme.logo})`);
    }
  }

  private generateColorPalette(baseColor: string): { [key: string]: string } {
    // Simple color palette generation - in production, use a proper color library
    const colors: { [key: string]: string } = {
      '50': this.lightenColor(baseColor, 0.9),
      '100': this.lightenColor(baseColor, 0.8),
      '200': this.lightenColor(baseColor, 0.6),
      '300': this.lightenColor(baseColor, 0.4),
      '400': this.lightenColor(baseColor, 0.2),
      '500': baseColor,
      '600': this.darkenColor(baseColor, 0.1),
      '700': this.darkenColor(baseColor, 0.2),
      '800': this.darkenColor(baseColor, 0.3),
      '900': this.darkenColor(baseColor, 0.4)
    };
    return colors;
  }

  private lightenColor(color: string, amount: number): string {
    // Simple color lightening - in production, use a proper color library
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  removeTenantTheme() {
    const root = document.documentElement;
    this.renderer.removeAttribute(root, 'data-tenant-theme');

    // Remove tenant-specific CSS properties
    const styles = root.style;
    Array.from(styles).forEach(prop => {
      if (prop.startsWith('--tenant-')) {
        this.renderer.removeStyle(root, prop);
      }
    });

    this.currentTheme$.next(null);
  }

  toggleDarkMode() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    this.renderer.setAttribute(root, 'data-theme', isDark ? 'light' : 'dark');
  }
}