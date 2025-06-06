import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QuestionService } from '../../services/question.service';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-formcard',
  templateUrl: './formcard.component.html',
  styleUrls: ['./formcard.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
  ],
  providers: [UserService, QuestionService, AuthorizationService]
})
export class FormcardComponent implements OnInit {
  userId: string = '';

  // Función de validador personalizado para rechazar cadenas que, tras trim, queden vacías o sin letras:
  private static categoriaValidator(control: AbstractControl): ValidationErrors | null {
    const val: string = (control.value || '').trim();
    // 1) Si, tras trim, queda vacío:
    if (!val) {
      return { required: true };
    }
    // 2) Solo letras y espacios (incluye tildes y ñ):
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    if (!pattern.test(val)) {
      return { pattern: true };
    }
    // 3) Debe contener al menos una vocal (para evitar 'bcdfgh' sin sentido) y al menos 3 letras en total:
    const vowelPattern = /[AEIOUÁÉÍÓÚaeiouáéíóú]/;
    if (!vowelPattern.test(val) || val.replace(/ /g, '').length < 3) {
      return { nonsensical: true };
    }
    return null;
  }

  gameForm: FormGroup = new FormGroup({
    category: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        FormcardComponent.categoriaValidator
      ]
    ),
    numQuestions: new FormControl(
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(10) // máximo 10 preguntas
      ]
    ),
    numAnswers: new FormControl('', [Validators.required]),
    dificultad: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthorizationService,
    private dialogRef: MatDialogRef<FormcardComponent>
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken();

    // Suscribirse a cambios en 'category' para trim automático
    this.gameForm.get('category')?.valueChanges.subscribe(val => {
      if (typeof val === 'string') {
        const trimmed = val.trimStart(); // quitamos espacios al inicio
        if (trimmed !== val) {
          this.gameForm.get('category')?.setValue(trimmed, { emitEvent: false });
        }
      }
    });
  }

  getErrorMessage(controlName: string) {
    const control = this.gameForm.get(controlName);
    if (!control) {
      return '';
    }
    // Mensajes para 'category'
    if (controlName === 'category') {
      if (control.hasError('required')) {
        return 'La categoría es obligatoria';
      }
      if (control.hasError('minlength')) {
        return 'Mínimo 3 caracteres';
      }
      if (control.hasError('maxlength')) {
        return 'Máximo 50 caracteres';
      }
      if (control.hasError('pattern')) {
        return 'Solo letras y espacios';
      }
      if (control.hasError('nonsensical')) {
        return 'Introduce una categoría válida (con al menos una vocal)';
      }
    }

    // Mensajes para 'numQuestions'
    if (controlName === 'numQuestions') {
      if (control.hasError('required')) {
        return 'El número de preguntas es obligatorio';
      }
      if (control.hasError('min')) {
        return 'El mínimo es 1 pregunta';
      }
      if (control.hasError('max')) {
        return 'El máximo es 10 preguntas';
      }
    }

    // Mensajes genéricos
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    return '';
  }

  startGame() {
    if (this.gameForm.invalid) {
      return;
    }

    // Tomar la categoría ya "trimmed" y validada
    const categoryVal = this.gameForm.get('category')?.value.trim();

    const gameData = {
      category: categoryVal,
      numQuestions: this.gameForm.get('numQuestions')?.value,
      numAnswers: this.gameForm.get('numAnswers')?.value,
      dificultad: this.gameForm.get('dificultad')?.value
    };

    this.dialogRef.close(gameData);
    // Redirigir inmediatamente al loading
    this.router.navigate(['/loading']);

    this.questionService
      .getQuestions(
        this.userId,
        gameData.dificultad,
        gameData.numAnswers,
        gameData.category,
        gameData.numQuestions
      )
      .subscribe(
        response => {
          if (response === 202) {
            // Simulamos el cierre de diálogo si existiera
            setTimeout(() => {
              this.router.navigate(['/gameroom'], {
                queryParams: gameData
              });
            }, 15000);
          } else {
            console.log('Respuesta de la API:', response);
          }
        },
        error => {
          console.error('Error al obtener preguntas:', error);
        }
      );
  }
}
