import { Component, Input } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { GameService } from '../../services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { DifficultyStatsDto, DifficultyStatsResponse, MonthStatsDto, StatsData } from '../interfaces/stats.interface';
import { MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-statsroom',
  templateUrl: './statsroom.component.html',
  styleUrl: './statsroom.component.scss',
  standalone: true,
  imports:[StatsComponent, HttpClientModule, MatIconModule, RouterModule, MatButtonModule],
  providers: [GameService]
})
export class StatsroomComponent {
 username : string = '';
  @Input() profilePicUrl: string = '/assets/defaultUser.png'; // Ruta de la imagen
  mothStatsData: MonthStatsDto[] = [];
  difficultyStatsData: DifficultyStatsDto[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const userId = 'c8043065-5806-428a-a722-8a91f1bf4862'; // Cambia esto según tu lógica
    console.log('Hola');  // Aquí se imprimen los datos en la consola
    this.gameService.getMonthlyStatistics(userId).subscribe({
        next: data => {
            console.log('Datos recibidos de getMonthlyStatistics:', data);
            if (!Array.isArray(data)) {
                console.error('Los datos recibidos no son un array:', data);
                this.mothStatsData = this.getTestMonthData(); // Manejar caso de error
                return;
            }

            // Usamos reduce para crear un objeto con los datos
            const monthDataMap = data.reduce((acc, item) => {
                if (item && item.month) {
                    acc[item.month] = {
                        totalMonthQuestionsAnswered: item.totalQuestionsAnswered || 0,
                        totalMonthSuccesses: item.totalSuccesses || 0,
                        totalMonthFailures: item.totalFailures || 0,
                        successMonthRate: item.successRate || 0,
                        failureMonthRate: item.failureRate || 0
                    };
                }
                return acc;
            }, {});

            // Obtenemos todos los meses hasta el actual
            const allMonths = this.getAllMonthsUntilCurrent();

            // Creamos los datos completos para los meses
            this.mothStatsData = allMonths.map(month => ({
                totalMonthQuestionsAnswered: monthDataMap[month]?.totalMonthQuestionsAnswered || 0,
                totalMonthSuccesses: monthDataMap[month]?.totalMonthSuccesses || 0,
                totalMonthFailures: monthDataMap[month]?.totalMonthFailures || 0,
                successMonthRate: monthDataMap[month]?.successMonthRate || 0,
                failureMonthRate: monthDataMap[month]?.failureMonthRate || 0,
                month: month
            }));
        },
        error: err => {
            console.error('Error al obtener las estadísticas mensuales:', err);
            // Manejo del error, usando datos de prueba si es necesario
            this.mothStatsData = this.getTestMonthData(); // Usa tus datos de prueba aquí
        }
    }); 

    this.gameService.getDifficultyStatistics(userId).subscribe({
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
        // Manejo de error, podrías asignar datos de prueba aquí si es necesario
        this.difficultyStatsData = this.getTestDifficultyData(); // Usa datos de prueba si es necesario
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
        difficulty: difficulty,
        totalQuestionsAnswered: difficultyData.totalQuestionsAnswered || 0,
        totalSuccesses: difficultyData.totalSuccesses || 0,
        totalFailures: difficultyData.totalFailures || 0,
        successRate: difficultyData.successRate || 0,
        failureRate: difficultyData.failureRate || 0,
      };
    });
  }

  private getTestMonthData(): MonthStatsDto[] {
    return [
      {
        month: '2024-05',
        totalMonthQuestionsAnswered: 10,
        totalMonthSuccesses: 6,
        totalMonthFailures: 4,
        successMonthRate: 60,
        failureMonthRate: 40,
      },
    ];
  }
    
  private getTestDifficultyData(): DifficultyStatsDto[] {
    return [
      {
        difficulty: 'FACIL',
        totalQuestionsAnswered: 10,
        totalSuccesses: 6,
        totalFailures: 4,
        successRate: 60,
        failureRate: 40,
      },
      {
        difficulty: 'MEDIA',
        totalQuestionsAnswered: 15,
        totalSuccesses: 8,
        totalFailures: 7,
        successRate: 53,
        failureRate: 47,
      },
      {
        difficulty: 'DIFICIL',
        totalQuestionsAnswered: 20,
        totalSuccesses: 12,
        totalFailures: 8,
        successRate: 60,
        failureRate: 40,
      },
    ];
  }
  
}
