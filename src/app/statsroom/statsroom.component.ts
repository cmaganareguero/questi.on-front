import { Component, Input } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { GameService } from '../../services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { DifficultyStatsDto, DifficultyStatsResponse, GamesPlayedStatsResponse, MonthStatsDto, StatsData, StatsGeneralesDto } from '../interfaces/stats.interface';
import { MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-statsroom',
  templateUrl: './statsroom.component.html',
  styleUrl: './statsroom.component.scss',
  standalone: true,
  imports:[StatsComponent,MatCardModule, HttpClientModule, MatIconModule, RouterModule, MatButtonModule],
  providers: [GameService, AuthorizationService]
})
export class StatsroomComponent {
 public isBrowser = true;
 username : string = '';
  @Input() profilePicUrl: string = '/assets/defaultUser.png'; // Ruta de la imagen
  mothStatsData: MonthStatsDto[] = [];
  difficultyStatsData: DifficultyStatsDto[] = [];
  gameMothStatsData: GamesPlayedStatsResponse[] = [];
  userId!: string | '';
  totalGames: number = 0;
  totalSuccesses: number = 0;
  totalFailures: number = 0;

  constructor(private gameService: GameService, private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken(); // Cambia esto según tu lógica
    console.log('Hola');  // Aquí se imprimen los datos en la consola

    //PARTIDAS JUGADAS POR MES
    this.getMonthGamesData();

    //ESTADISTICAS GENERALES
    this.gameService.getTotalsStatistics(this.userId).subscribe({
      next: (stats: StatsGeneralesDto) => {
        this.totalGames = stats.totalGames;
        this.totalSuccesses = stats.totalSuccesses;
        this.totalFailures = stats.totalFailures;
      },
      error: (err) => {
        console.error('Error al obtener totales generales:', err);
      }
    });

    // ACIERTOS Y FALLOS POR DIFICULTAS ( FACIL, MEDIA, DIFICIL)
    this.gameService.getDifficultyStatistics(this.userId).subscribe({
      next: data => {
        console.log('Datos recibidos de getDifficultyStatistics:', data);

        // Verificamos que los datos tengan la estructura esperada
        if (data && typeof data === 'object') {
          // Convertimos los datos de dificultad en un formato adecuado
          this.difficultyStatsData = this.transformDifficultyData(data);
        } else {
          console.error('Los datos no tienen la estructura esperada:', data);
        }
      },
      error: err => {
        console.error('Error al obtener las estadísticas de dificultad:', err);
      }
    });

    // ESTADISTICAS POR MES ( ACIERTOS Y FALLOS)
        this.gameService.getMonthlySuccessFailure(this.userId).subscribe({
      next: (data: MonthStatsDto[]) => {
        this.mothStatsData = data;
      },
      error: (err) => {
        console.error('Error al obtener aciertos/fallos por mes:', err);
      }
    });
}


  getAllMonthsUntilCurrent(): string[] {
    const months: string[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0

    for (let month = 0; month <= currentMonth; month++) {
        const monthString = `${currentYear}-${String(month + 1).padStart(2, '0')}`; // Formato YYYY-MM
        months.push(monthString);
    }

    return months;
  }

  transformDifficultyData(data: any): DifficultyStatsDto[] {
    return Object.keys(data).map(difficulty => {
      const difficultyData = data[difficulty];
      return {
        difficulty: difficulty.toUpperCase(),
        totalQuestionsAnswered: difficultyData.totalQuestionsAnswered || 0,
        totalSuccesses: difficultyData.totalSuccesses || 0,
        totalFailures: difficultyData.totalFailures || 0,
        successRate: difficultyData.successRate || 0,
        failureRate: difficultyData.failureRate || 0,
      };
    });
  }

private getMonthGamesData(): void {
  this.gameService.getGamesPlayedStatistics(this.userId)
    .subscribe({
      next: (response: GamesPlayedStatsResponse[]) => {
        // En lugar de mapear a {name,value}, guárdalo tal cual:
        this.gameMothStatsData = response;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de partidas por mes:', err);
      }
    });
}

}
