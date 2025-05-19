import { Component, Input, SimpleChanges } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { StatsData, WeekStatsDto, MonthStatsDto, DifficultyStatsDto, DifficultyStatsResponse } from '../interfaces/stats.interface';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  standalone: true,
  imports: [NgxChartsModule,MatCardModule],
  providers: []
})


export class StatsComponent {

  @Input() data: MonthStatsDto[] | DifficultyStatsDto[] = [];
  @Input() title: string = '';
  @Input() chartType: 'month' | 'difficulty' = 'month';
  
  multi: any[] | undefined;
  multiMonths: any[] | undefined;
  multiDifficulties: any[] | undefined; // Para manejar los datos de dificultad
  chartData: any[] | undefined;  // Variable que se usará para los resultados
  view: [number, number] = [700, 300];  // Ajuste tamaño del gráfico

  // Chart options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Período';
  yAxisLabel: string = 'Cantidad';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4299e1', '#222222'] // Azul para aciertos, negro para fallos
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.setChartData(this.data);
    }
  }
  
  setChartData(data: MonthStatsDto[] | DifficultyStatsDto[]): void {
    if (this.chartType === 'month' && Array.isArray(data)) {
      this.setMonthData(data as MonthStatsDto[]);
    } else if (this.chartType === 'difficulty' && Array.isArray(data)) {
      this.setDifficultyData(data as DifficultyStatsDto[]);
    } else {
      console.error('Tipo de datos no compatible con el gráfico:', data);
    }
    this.chartData = this.chartType === 'month' ? this.multiMonths : this.multiDifficulties;
  }
  
  setMonthData(monthStatsData: MonthStatsDto[]): void {
    this.multiMonths = [
      {
        name: 'Aciertos',
        series: monthStatsData.map((monthStats) => ({
          name: monthStats.month,
          value: monthStats.totalMonthSuccesses || 0,
        })),
      },
      {
        name: 'Fallos',
        series: monthStatsData.map((monthStats) => ({
          name: monthStats.month,
          value: monthStats.totalMonthFailures || 0,
        })),
      },
    ];
  }

  setDifficultyData(difficultyStatsData: DifficultyStatsDto[]): void {
    // Verifica los datos antes de procesarlos
    console.log('Datos de dificultad recibidos:', difficultyStatsData);
  
    if (!difficultyStatsData || difficultyStatsData.length === 0) {
      console.error('No se recibieron datos válidos de dificultad.');
      return;
    }
  
    // Procesa los datos para el gráfico
    this.multiDifficulties = [
      {
        name: 'Aciertos',
        series: difficultyStatsData.map((difficultyStats) => ({
          name: difficultyStats.difficulty,   // Este es el nombre de la dificultad
          value: difficultyStats.totalSuccesses || 0,  // Este es el valor de los aciertos
        })),
      },
      {
        name: 'Fallos',
        series: difficultyStatsData.map((difficultyStats) => ({
          name: difficultyStats.difficulty,  // Este es el nombre de la dificultad
          value: difficultyStats.totalFailures || 0, // Este es el valor de los fallos
        })),
      },
    ];
  
    // Verifica los datos procesados antes de asignarlos al gráfico
    console.log('Datos procesados para el gráfico:', this.multiDifficulties);
  }
  
    
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

// Datos de prueba
private testData: MonthStatsDto[] = [
  {
    month: 'ENERO',
    totalMonthQuestionsAnswered: 10,
    totalMonthSuccesses: 7,
    totalMonthFailures: 3,
    successMonthRate: 70,
    failureMonthRate: 30
  },
  {
    month: 'FEBRERO',
    totalMonthQuestionsAnswered: 15,
    totalMonthSuccesses: 12,
    totalMonthFailures: 3,
    successMonthRate: 80,
    failureMonthRate: 20
  },
  {
    month: 'MARZO',
    totalMonthQuestionsAnswered: 8,
    totalMonthSuccesses: 5,
    totalMonthFailures: 3,
    successMonthRate: 62.5,
    failureMonthRate: 37.5
  },
  {
    month: 'ABRIL',
    totalMonthQuestionsAnswered: 20,
    totalMonthSuccesses: 15,
    totalMonthFailures: 5,
    successMonthRate: 75,
    failureMonthRate: 25
  },
  {
    month: 'MAYO',
    totalMonthQuestionsAnswered: 6,
    totalMonthSuccesses: 4,
    totalMonthFailures: 2,
    successMonthRate: 66.67,
    failureMonthRate: 33.33
  },
];

}