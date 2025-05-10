import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './gamelist/game.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { MenuComponent } from "./menu/menu/menu.component";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    BrowserAnimationsModule,
    MenuComponent
],
  bootstrap: [AppComponent],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class AppModule { }
