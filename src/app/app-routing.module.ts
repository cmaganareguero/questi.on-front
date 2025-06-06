// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { MenuComponent } from './menu/menu/menu.component';
import { AttendeesComponent } from './user/attendees/attendees.component';
import { SuccessRegisterComponent } from './user/success-register/success-register.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { GameroomComponent } from './gameroom/gameroom.component';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';
import { StatsroomComponent } from './statsroom/statsroom.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { hideMenu: false }    // aquí sí mostramos menú
  },
  {
    path: 'loading',
    component: LoadingScreenComponent,
    data: { hideMenu: true }     // ocultar menú
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { hideMenu: false }    // sí menú
  },
  {
    path: 'gameroom',
    component: GameroomComponent,
    data: { hideMenu: true }     // ocultar menú
  },
  {
    path: 'statsroom',
    component: StatsroomComponent,
    data: { hideMenu: false }    // sí menú
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
    // Al hacer redirect, el perfil de datos se hereda de 'dashboard'
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { hideMenu: true }     // ocultar menú
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { hideMenu: true }     // ocultar menú
  },
  // Si en el futuro añades más rutas, recuerda poner data.hideMenu: true/false según convenga.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
