// register.component.ts
import { Component } from '@angular/core';
import {
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatRadioModule,
  ],
  providers: [UserService],
})
export class RegisterComponent {
  // Dos banderas separadas:
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm: FormGroup;
  errorMessage = '';

constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private router: Router
) {
  this.registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });
}

// Quitamos validador a nivel grupo para que el botón no se deshabilite por mismatch

// Validador manual para contraseñas que se usa solo en onSubmit
passwordsMatch(): boolean {
  const pw = this.registerForm.get('password')?.value;
  const cpw = this.registerForm.get('confirmPassword')?.value;
  return pw === cpw;
}

getErrorMessage(control: AbstractControl | null): string {
  if (!control) return '';
  if (control.hasError('required')) {
    return 'Este campo es obligatorio';
  }
  if (
    control === this.registerForm.get('email') &&
    control.hasError('email')
  ) {
    return 'Correo electrónico no válido';
  }
  return '';
}

togglePasswordVisibility(field: 'password' | 'confirmPassword') {
  if (field === 'password') {
    this.hidePassword = !this.hidePassword;
  } else {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}

onSubmit() {
  if (this.registerForm.invalid) {
    this.errorMessage = '';
    return; // Campos obligatorios no completos o inválidos
  }

  if (!this.passwordsMatch()) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  // Si llegó aquí, todo OK
  this.errorMessage = '';

  const { username, email, password } = this.registerForm.value;

  const newUser = {
    name: username,
    email,
    password,
  };

  this.userService.addUser(newUser).subscribe(
    (user) => {
      console.log('Usuario registrado:', user);
      this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
    },
    (error) => {
      console.error('Error al registrar:', error);
      this.errorMessage =
        'Ha ocurrido un error al registrar. Intenta de nuevo más tarde.';
    }
  );
}
}
