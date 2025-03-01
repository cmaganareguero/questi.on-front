import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule , MatDialog } from '@angular/material/dialog';
import { QuestionService } from '../../services/question.service';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-formcard',
  templateUrl: './formcard.component.html',
  styleUrl: './formcard.component.scss',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatFormFieldModule, CommonModule, HttpClientModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatRadioModule, FormsModule, MatSelectModule, MatDialogModule],
  providers: [UserService, QuestionService, AuthorizationService]
})
export class FormcardComponent {
  hide = true;
  dificultad: string = ''; // Variable para almacenar la dificultad
  userEmail : string = '';
  userId : string = '';

  gameForm: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    numQuestions: new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)]),
    numAnswers: new FormControl('', [Validators.required]),
    dificultad: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService, private router: Router, public dialog: MatDialog, private questionService: QuestionService, private authService: AuthorizationService) {} // Inyecta el servicio en el constructor


  ngOnInit(): void {

    this.userEmail = this.authService.getUserIdFromToken();
    console.log('ID de usuario:', this.userEmail);

    this.userService.getIdUserByEmail(this.userEmail).subscribe({
      next: (id: string) => {
        this.userId = id;
        console.log('User ID:', this.userId);
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      }
    });
  }
  

  getErrorMessage(controlName: string) {
    const control = this.gameForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('min')) {
      return 'El número mínimo de preguntas es 0';
    }
    if (control?.hasError('max')) {
      return 'El número máximo de preguntas es 20';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  register() {
    console.log('Haciendo clic en el botón de registro');
    if (this.gameForm.valid) {
      // Crear un objeto de tipo Game con los datos del formulario
      const newGame = {
        category: this.gameForm.get('category')?.value,
        numQuestions: this.gameForm.get('numQuestions')?.value,
        numAnswers: this.gameForm.get('numAnswers')?.value,
        dificultad: this.gameForm.get('dificultad')?.value // Incluye dificultad
        // Agrega más campos según sea necesario
      };
      console.log('holaaa bien reina');
    }
  }

  startGame() {
    if (this.gameForm.valid) {
      const gameData = {
        category: this.gameForm.get('category')?.value,
        numQuestions: this.gameForm.get('numQuestions')?.value,
        numAnswers: this.gameForm.get('numAnswers')?.value,
        dificultad: this.gameForm.get('dificultad')?.value
      };
  
      // Redirige al componente de carga mientras esperas la respuesta de la IA
      this.router.navigate(['/loading']);
  
      // Llama al servicio de preguntas
      this.questionService.getQuestions(this.userId, gameData.dificultad, gameData.numAnswers, gameData.category, gameData.numQuestions)
        .subscribe(response => {
          if (response === 202) {
            this.cerrarDialog();
            // Redirige al componente de la sala de juego con la información
            setTimeout(() => {
              this.router.navigate(['/gameroom'], { queryParams: gameData });
            }, 9000);
          } else {
            console.log('Respuesta de la API:', response);
            // Manejo adicional de la respuesta si es necesario
          }
        }, error => {
          console.error('Error al obtener preguntas:', error);
        });
    }
  }
  

  cerrarDialog(): void {
    // Verifica si dialogRef está definido y luego llama al método close() para cerrar el diálogo
    const dialogRef = this.dialog.closeAll();
  }

  onDificultadChange() {
    console.log('Dificultad seleccionada:', this.dificultad);
  }
}
