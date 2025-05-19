import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, ReactiveFormsModule,ReactiveFormsModule,MatCardModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, HttpClientModule, MatButtonModule, CommonModule, MatInputModule,MatSelectModule, MatRadioModule]
  ,providers: [UserService]
})
export class RegisterComponent {
  hide = true;
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);
  
  constructor(private userService: UserService, private router: Router) {} // Inyecta el servicio en el constructor

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control === this.email && control.hasError('email')) {
      return 'Correo electrónico no válido';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  register() {
    console.log('Haciendo clic en el botón de registro');
    if (
      this.username.valid &&
      this.email.valid &&
      this.password.valid &&
      this.confirmPassword.valid &&
      this.username.value !== null &&
      this.email.value !== null &&
      this.password.value !== null &&
      this.confirmPassword.value !== null
    ) {
      console.log('Si');
      if (this.password.value !== this.confirmPassword.value) {
        console.error('Las contraseñas no coinciden');
        return;
      }
        
        const user = {
          name: this.username.value,
          email: this.email.value,
          password: this.password.value,          
        };
  
        this.userService.addUser(user).subscribe(
          (user) => {
            console.log('Usuario registrado exitosamente:', user);
            this.router.navigate(['/successRegister']);
          },
          (error) => {
            console.error('Error al registrar el usuario:', error);
          }
        );
      } else {
        console.error('Todos los campos deben tener un valor');
      }
    }
}
