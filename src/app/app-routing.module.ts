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
  { path: 'dashboard', component: DashboardComponent },
  { path: 'loading', component: LoadingScreenComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'gameroom', component: GameroomComponent },
  { path: 'statsroom', component: StatsroomComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, 
  { path: 'register', component: RegisterComponent },
  { path: 'successRegister', component: SuccessRegisterComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static MenuModule: any;
}
