import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';

import { PopUpComponent } from '../../pop-up/pop-up.component';
import { CardfieldComponent } from '../../cardfield/cardfield.component';
import { StatsroomComponent } from '../../statsroom/statsroom.component';

import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { GameService } from '../../../services/game.service';

import { GameUser } from '../../interfaces/user';
import { FinishedGame } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    StatsroomComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    PopUpComponent,
    CardfieldComponent,
    HttpClientModule
  ],
  providers: [
    UserService,
    AuthorizationService,
    GameService
  ]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profileForm!: FormGroup;

  private userEmail!: string;
  public data: GameUser = { name: '', email: '' };
  public playedGames!: FinishedGame[];

  userImageUrl: string = 'assets/defaultUser.png';
  userCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private gameService: GameService,
    private authService: AuthorizationService,
    private readonly router: Router
  ) {}

ngOnInit(): void {
  this.profileForm = this.fb.group({
    name: [{ value: 'Celia', disabled: true }],
    email: [{ value: 'celia@example.com', disabled: true }],
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });
}

get newPassword() {
  return this.profileForm.get('newPassword')!;
}

getNewPasswordError(): string {
  if (this.newPassword.hasError('required')) return 'La nueva contraseña es obligatoria';
  if (this.newPassword.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
  return '';
}

onSubmit(): void {
  if (this.profileForm.invalid) return;

  const { currentPassword, newPassword } = this.profileForm.value;

  // Aquí llamarías a tu backend para cambiar la contraseña
  console.log('Contraseña actual:', currentPassword);
  console.log('Nueva contraseña:', newPassword);

  // Ejemplo de integración:
  // this.userService.changePassword(currentPassword, newPassword).subscribe(...)
}

  navigateToDashboard(): void {
  this.router.navigate(['/dashboard']);
  }

  navigateToStatsroom(): void {
  this.router.navigate(['/statsroom']);
  }
}
