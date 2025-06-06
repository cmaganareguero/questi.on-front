import { Component, Input, SimpleChanges } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import {
  MonthStatsDto,
  DifficultyStatsDto,
  GamesPlayedStatsResponse
} from '../interfaces/stats.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  standalone: true,
  imports: [NgxChartsModule, MatCardModule]
})
export class StatsComponent {
  @Input() data:
    | MonthStatsDto[]
    | DifficultyStatsDto[]
    | GamesPlayedStatsResponse[] = [];
  @Input() title = '';
  @Input() chartType: 'month' | 'difficulty' | 'games' = 'month';

  multiMonths: any[] = [];
  multiDifficulties: any[] = [];
  multiGames: any[] = [];
  chartData: any[] = [];
  view: [number, number] = [700, 300];

  // Opciones del gráfico
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  yAxisLabel = 'Cantidad';
  timeline = false;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4299e1', '#222222']
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    switch (this.chartType) {
      case 'month':
        this.buildMonthSeries(this.data as MonthStatsDto[]);
        this.chartData = this.multiMonths;
        this.yAxisLabel = 'Cantidad';
        break;

      case 'difficulty':
        this.buildDifficultySeries(this.data as DifficultyStatsDto[]);
        this.chartData = this.multiDifficulties;
        this.yAxisLabel = 'Cantidad';
        break;

      case 'games':
        this.buildGamesSeries(this.data as GamesPlayedStatsResponse[]);
        this.chartData = this.multiGames;
        this.yAxisLabel = 'N.º de partidas';
        break;

      default:
        this.chartData = [];
        break;
    }
  }

  private buildMonthSeries(monthData: MonthStatsDto[]): void {
    this.multiMonths = [
      {
        name: 'Aciertos',
        series: monthData.map((m) => ({
          name: m.month,
          value: m.totalMonthSuccesses || 0
        }))
      },
      {
        name: 'Fallos',
        series: monthData.map((m) => ({
          name: m.month,
          value: m.totalMonthFailures || 0
        }))
      }
    ];
  }

  private buildDifficultySeries(diffData: DifficultyStatsDto[]): void {
    this.multiDifficulties = [
      {
        name: 'Aciertos',
        series: diffData.map((d) => ({
          name: d.difficulty,
          value: d.totalSuccesses || 0
        }))
      },
      {
        name: 'Fallos',
        series: diffData.map((d) => ({
          name: d.difficulty,
          value: d.totalFailures || 0
        }))
      }
    ];
  }

  private buildGamesSeries(gamesData: GamesPlayedStatsResponse[]): void {
    this.multiGames = [
      {
        name: 'Partidas jugadas',
        series: gamesData.map((g) => ({
          name: g.month,
          value: g.gamesCount
        }))
      }
    ];
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
}
