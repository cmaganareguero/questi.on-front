import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule,FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { AuthorizationService } from '../../../services/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, CommonModule, MatButtonModule, MatInputModule, MatSelectModule, MatRadioModule, HttpClientModule],
  providers: [AuthorizationService]
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
      private snackBar: MatSnackBar,

  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }
      ],
      password: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change'
        }
      ]
    });
  }

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['registered'] === 'true') {
      this.snackBar.open('Registro completado correctamente.', 'X', {
        duration: 2000,
      });
    }
  });
}

  getErrorMessage(control: AbstractControl | null): string {
    if (!control) return '';
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (
      control === this.loginForm.get('email') &&
      control.hasError('email')
    ) {
      return 'Correo electrónico no válido';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMessage =
          'Error en la autenticación. Por favor, verifica tus credenciales.';
        console.error('Error en autenticación:', err);
      }
    });
  }
}
