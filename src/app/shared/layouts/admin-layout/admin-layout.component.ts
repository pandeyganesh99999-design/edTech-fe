import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ConfigService } from '../../../core/services/config.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NavItem, TenantConfig } from '../../../core/models/config.model';
import { filter, map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private configService = inject(ConfigService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  user$ = this.authService.authState$;
  tenant$ = this.tenantService.tenantContext$;
  navItems: NavItem[] = [];
  sidebarCollapsed = false;
  currentYear = new Date().getFullYear();
  currentRoute = '';
  breadcrumbs: { label: string; route?: string }[] = [];

  private subscriptions = new Subscription();

  ngOnInit(): void {
    // Subscribe to tenant changes to update theme
    this.subscriptions.add(
      this.tenant$.subscribe(tenant => {
        if (tenant?.theme) {
          this.themeService.applyTheme(tenant.theme);
        }
      })
    );

    // Subscribe to filtered navigation items
    this.subscriptions.add(
      this.user$.pipe(
        map(user => user?.user?.role || 'employee'),
        map(role => this.configService.getFilteredNavItems(role, this.tenantService.currentTenant?.tenantId))
      ).subscribe(items => {
        this.navItems = items;
      })
    );

    // Track current route for breadcrumbs
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).url),
        startWith(this.router.url)
      ).subscribe(url => {
        this.currentRoute = url;
        this.updateBreadcrumbs(url);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  private updateBreadcrumbs(url: string): void {
    const segments = url.split('/').filter(segment => segment);
    this.breadcrumbs = [{ label: 'Home', route: '/dashboard' }];

    // Simple breadcrumb logic - can be enhanced
    if (segments.length > 0) {
      const currentSegment = segments[segments.length - 1];
      const navItem = this.findNavItemByRoute(url);
      if (navItem) {
        this.breadcrumbs.push({ label: navItem.label });
      } else {
        this.breadcrumbs.push({ label: this.capitalizeFirst(currentSegment) });
      }
    }
  }

  private findNavItemByRoute(route: string): NavItem | null {
    const findInItems = (items: NavItem[]): NavItem | null => {
      for (const item of items) {
        if (item.route === route) return item;
        if (item.children) {
          const found = findInItems(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInItems(this.navItems);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Add tenant switcher functionality
  switchTenant(tenantId: string): void {
    this.tenantService.switchTenant(tenantId);
  }
}