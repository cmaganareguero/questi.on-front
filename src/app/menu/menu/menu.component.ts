import { Component, HostListener, NgModule } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatSidenavModule, MatToolbarModule,MatButtonModule],
})
export class MenuComponent {
  isHidden: boolean = false;
  lastScrollTop: number = 0;

  constructor(private readonly router: Router) { }

  // Detectamos el evento de scroll
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToDashboard(): void {
  this.router.navigate(['/dashboard']);
  }

  navigateToStatsroom(): void {
  this.router.navigate(['/statsroom']);
}

}
