import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { GameData, Question } from '../interfaces';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthorizationService } from '../../services/authorization.service';
import { MatIconModule } from '@angular/material/icon';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-gameroom',
  templateUrl: './gameroom.component.html',
  styleUrls: ['./gameroom.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatChipsModule,
    ExitDialogComponent,
    MatCardModule,
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    FormsModule,
    MatIconModule,
    RouterOutlet,
    RouterModule
  ],
  providers: [QuestionService, GameService, UserService, AuthorizationService]
})
export class GameroomComponent implements OnInit, OnDestroy {
  color: ThemePalette = 'primary';
  progressValue = 0; // Inicializar el progreso en 0

  currentGame: GameData = {
    category: '',
    difficulty: '',
    answerType: '',
    numQuestions: 0,
    questions: []
  };
  currentQuestion: Question | undefined;
  selectedOption: string | null = null;
  showQuestions: boolean = false;
  category!: string;
  numQuestions!: number;
  numAnswers!: string;
  difficulty!: string;
  currentIndex: number = 0;
  additionalInfo: string = '';
  successes: number = 0;
  userEmail!: string;
  userId!: string;

  username: string = '';
  @Input() profilePicUrl: string = '/assets/defaultUser.png'; // Ruta de la imagen

  private routeSubscription: Subscription | undefined;

  constructor(
    private questionService: QuestionService,
    private gameService: GameService,
    private userService: UserService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) { }

ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    console.log('ID de usuario (token):', this.userId);

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      console.log('>>> queryParams.emit:', params);
      this.category     = params['category']    || '';
      this.numQuestions = +params['numQuestions'] || 2;
      this.numAnswers   = params['numAnswers']   || '';
      this.difficulty   = params['dificultad']   || '';

      console.log(`   → category="${this.category}", numQuestions=${this.numQuestions}, numAnswers="${this.numAnswers}", dificultad="${this.difficulty}"`);

      if (this.category) {
        console.log('   → Voy a cargar preguntas / última partida porque category sí existe');
        this.getQuestionsFromAPI(
          this.difficulty,
          this.numAnswers,
          this.category,
          this.numQuestions
        );
      } else {
        console.log('   → Category está vacío, no llamo a getQuestionsFromAPI()');
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getQuestionsFromAPI(difficulty: string, numAnswers: string, category: string, numQuestions: number) {

    this.getLastGameAndShowQuestions(this.userId, this.category);
  }

  // Método para usar preguntas simuladas en caso de error
  useMockQuestions() {
    const mockQuestions: Question[] = [
      {
        question: "¿Cuál es la capital de Francia?",
        answers: ["Madrid", "Roma", "París", "Berlín"],
        correctAnswerIndex: 2,
      },
      {
        question: "¿Qué es Angular?",
        answers: ["Un lenguaje de programación", "Un framework de JavaScript", "Un sistema operativo", "Una base de datos"],
        correctAnswerIndex: 1,
      },
      {
        question: "¿Cuál es el resultado de 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correctAnswerIndex: 1,
      }
    ];

    this.currentGame.questions = mockQuestions;
    this.currentGame.numQuestions = mockQuestions.length;
    this.showQuestions = true;
    this.showFirstQuestion();
    console.log('Juego con preguntas de prueba:', this.currentGame);
  }

  getLastGameAndShowQuestions(idUser: string, category: string) {
    this.gameService.getLastGame(idUser, category).subscribe({
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
            correctAnswerIndex: q.correctAnswerIndex,
            embedding: []
          })) || []
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

  showFirstQuestion() {
    if (this.currentGame.questions && this.currentGame.questions.length > 0) {
      this.currentIndex = 0;
      this.currentQuestion = this.currentGame.questions[0];
      this.selectedOption = null;
      this.updateProgress();
    }
  }

  selectOption(option: string) {
    if (this.selectedOption === null && this.currentQuestion) {
      this.selectedOption = option;
      if (this.isCorrectOption(option)) {
        this.successes++;
        console.log('Respuesta correcta, total aciertos:', this.successes);
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
      this.currentQuestion = undefined; // Indica que terminó el juego
      this.saveResults(); // Guardar resultados al finalizar
    }
    this.additionalInfo = '';
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

  leaveGame(): void {
    const dialogRef = this.dialog.open(ExitDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.router.navigate(['/']); // Ajusta la ruta según tu flujo
      }
    });
  }

  updateProgress() {
    this.progressValue = ((this.currentIndex + 1) / this.currentGame.numQuestions) * 100;
  }

  isCorrectOption(option: string): boolean {
    if (!this.currentQuestion || this.selectedOption === null) {
      return false;
    }
    const correctIndex = this.currentQuestion.correctAnswerIndex;
    return this.currentQuestion.answers[correctIndex] === option && this.selectedOption === option;
  }

  isIncorrectOption(option: string): boolean {
    if (!this.currentQuestion || this.selectedOption === null) {
      return false;
    }
    const correctAnswerIndex = this.currentQuestion.correctAnswerIndex;
    return this.selectedOption === option && this.currentQuestion.answers[correctAnswerIndex] !== option;
  }

  closeMoreInfo() {
    this.additionalInfo = '';
  }

  saveResults() {
    if (this.currentGame.id) {
      this.gameService.updateGame(this.currentGame.id, this.successes).subscribe(
        (response) => {
          console.log('Resultados guardados:', response);
        },
        (error) => {
          console.error('Error al guardar resultados:', error);
        }
      );
    }
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

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent): string | void {
    if (this.showQuestions && this.currentQuestion) {
      event.preventDefault();    // necesario en algunos navegadores
      return 'Si abandonas la partida perderás todo el progreso.';
    }
  }

  goHome(): void {
  this.router.navigate(['/dashboard']);
  }
}
