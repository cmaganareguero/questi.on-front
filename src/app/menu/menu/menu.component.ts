import { Component, NgModule } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import {RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatSidenavModule, MatToolbarModule, RouterOutlet, RouterModule,MatButtonModule],
})
export class MenuComponent {
  opened = false;
}
