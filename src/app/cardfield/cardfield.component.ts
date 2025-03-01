import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FinishedGame } from '../interfaces';


@Component({
  selector: 'app-cardfield',
  templateUrl: './cardfield.component.html',
  styleUrl: './cardfield.component.scss',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatButtonModule]
})
export class CardfieldComponent {
  @Input()
  game!: FinishedGame;
}
