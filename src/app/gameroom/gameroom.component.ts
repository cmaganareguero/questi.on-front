import { Component, Input } from '@angular/core';
import { GameData, Question } from '../interfaces';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {RouterModule} from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio'; 
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthorizationService } from '../../services/authorization.service';
import {MatIconModule} from '@angular/material/icon';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrl: './gameroom.component.scss',
  standalone: true,
imports: [RouterModule, ExitDialogComponent, MatCardModule, HttpClientModule, MatButtonModule, CommonModule, MatSliderModule, MatProgressSpinnerModule,MatRadioModule, FormsModule, MatIconModule, RouterOutlet, RouterModule ],
  providers: [QuestionService, GameService, UserService, AuthorizationService]
})
export class GameroomComponent {

  color: ThemePalette = 'primary';
  progressValue = 0; // Inicializar el progreso en 0
  
  currentGame: GameData = {
    category: '',
    difficulty: '',
    answerType: '',
    numQuestions: 0
  }; 
  currentQuestion: Question | undefined;
  selectedOption: string | null = null;
  showQuestions: boolean = false;
  category!: string;
  numQuestions!: number;
  numAnswers!: string;
  difficulty!: string;
  currentIndex: number = 0;
  additionalInfo!: string;
  successes: number = 0; 
  userEmail!: string;
  userId!: string;

  username : string = '';
  @Input() profilePicUrl: string = '/assets/defaultUser.png'; // Ruta de la imagen

  private routeSubscription: Subscription | undefined;

  constructor(private questionService: QuestionService, private gameService: GameService, private userService: 
    UserService, private authService: AuthorizationService, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.userEmail = this.authService.getUserIdFromToken();
    console.log('ID de usuario:', this.userEmail);

    this.userService.getIdUserByEmail(this.userEmail).subscribe({
      next: (id: string) => {
        this.userId = id;
        console.log('User ID:', this.userId);

        this.routeSubscription = this.route.queryParams.subscribe(params => {
          this.category = params['category'] || '';
          this.numQuestions = +params['numQuestions'] || 2;
          this.numAnswers = params['numAnswers'] || '';
          this.difficulty = params['dificultad'] || '';

          if (this.category) {
            this.getQuestionsFromAPI(this.difficulty, this.numAnswers, this.category, this.numQuestions);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      }
    });

    const userId = this.authService.getUserIdFromToken();
    this.username = userId;
    console.log('ID de usuario:', userId);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getQuestionsFromAPI(difficulty: string, numAnswers: string, category: string, numQuestions: number) {

    this.getLastGameAndShowQuestions(this.userId);
  
    this.questionService.getQuestions(this.userId, difficulty, numAnswers, category, numQuestions)
      .subscribe(response => {
        if (response === 202) {
          // Si la respuesta es 202, llama al método para obtener el último juego
          console.log(this.userId);
          this.getLastGameAndShowQuestions(this.userId);
        } else {
          console.log('Respuesta de la API:', response);
          // Continúa manejando la respuesta de la API de preguntas si es necesario
        }
      }, error => {
        console.error('Error al obtener preguntas:', error);
      });
  }
  
  getLastGameAndShowQuestions(idUser: string) {
    this.gameService.getLastGame(idUser).subscribe({
      next: (game) => {
        this.currentGame = {
          id: game.id,
          name: game.name,
          category: game.category,
          difficulty: game.difficulty,
          answerType: game.answerType,
          date: game.date,
          successes: game.successes,
          failures: game.failures,
          numQuestions: game.numQuestions,
          idUser: game.idUser,
          questions: game.questions?.map(q => ({
            question: q.question,
            answers: q.answers,
            correctAnswerIndex: q.correctAnswerIndex
          }))
        };
        this.showQuestions = true;
        this.showFirstQuestion();
        console.log('Juego obtenido:', this.currentGame);
      },
      error: (error) => {
        console.error('Error al obtener el último juego:', error);
      }
    });
  }

  getMoreInfo(): void {
    if (this.currentQuestion?.answers && this.currentQuestion?.correctAnswerIndex !== undefined) {
      const questionText = this.currentQuestion.question;
      const correctAnswerText = this.currentQuestion.answers[this.currentQuestion.correctAnswerIndex];
      console.log('Pregunta:', questionText);
      console.log('Respuesta:', correctAnswerText);

      this.questionService.getMoreInfo(questionText, correctAnswerText).subscribe(
        response => {
          console.log('Información adicional:', response);
          this.additionalInfo = response;
        },
        error => {
          console.error('Error al obtener más información:', error);
        }
      );
    } else {
      console.error('currentQuestion, answers, o correctAnswerIndex no está definido');
    }
  }

  showFirstQuestion() {
    if (this.currentGame.questions && this.currentGame.questions.length > 0) {
      this.currentQuestion = this.currentGame.questions[0];
      this.currentIndex = 0; // Reiniciar índice al mostrar la primera pregunta
      this.selectedOption = null; // Reiniciar opción seleccionada
      this.updateProgress();
    }
  }

  selectOption(option: string) {
    if (this.selectedOption === null) {
      this.selectedOption = option;
      if (this.isCorrectOption(option)) {
        this.successes++;
        console.log('Correct answer selected, total successes:', this.successes);
      }
    }
  }
  

  nextQuestion() {
    if (this.currentGame.questions && this.currentIndex < this.currentGame.questions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = this.currentGame.questions[this.currentIndex];
      this.selectedOption = null;
      this.updateProgress();
    } else {
      this.currentQuestion = undefined;
      this.saveResults(); // Llamar automáticamente a saveResults cuando se lleguen al final
    }
    this.additionalInfo = '';
  }

  updateProgress() {
    this.progressValue = ((this.currentIndex + 1) / this.currentGame.numQuestions) * 100;
  }

  isCorrectOption(option: string): boolean {
    if (!this.currentQuestion || this.selectedOption === null) {
      return false;
    }
    const correctAnswerIndex = this.currentQuestion.correctAnswerIndex;
    return this.currentQuestion.answers[correctAnswerIndex] === option && this.selectedOption === option;
  }

  isIncorrectOption(option: string): boolean {
    if (!this.currentQuestion || this.selectedOption === null) {
      return false;
    }
    const correctAnswerIndex = this.currentQuestion.correctAnswerIndex;
    return this.selectedOption === option && this.currentQuestion.answers[correctAnswerIndex] !== option;
  }

  saveResults() {
    if (this.currentGame.id) {
      this.gameService.updateGame(this.currentGame.id, this.successes).subscribe(
        response => {
          console.log('Resultados guardados:', response);
        },
        error => {
          console.error('Error al guardar resultados:', error);
        }
      );
    }
  }

  closeMoreInfo () {
    this.additionalInfo = '';
  }

  startNewGame() {
    console.log('ok');
  }

  openConfirmDialog(navigateTo: string): void {
    const dialogRef = this.dialog.open(ExitDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.router.navigate([navigateTo]); // Navegar si el usuario confirma
      }
    });
  }

}
