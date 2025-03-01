import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule , MatDialog } from '@angular/material/dialog';
import { FormcardComponent } from '../../formcard/formcard.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, RouterLink, FormsModule,HttpClientModule, MatDialogModule, FormcardComponent, MatButtonModule ]
})
export class GamecardComponent {

  @Input() id: number | undefined = 0;
  @Input() name: string = "";
  @Input() category: string = "";

  colors = ['#ffffff'];

  color = '';

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormcardComponent, {
      width: '650px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Puedes manejar el resultado del formulario aquí
    });
  }

  assignRandomColor(): void {
    // Generar un número aleatorio entre 0 y la longitud del array de colores
    let randomIndex = Math.floor(Math.random() * this.colors.length);
    // Acceder al elemento del array de colores con ese índice y asignarlo a la variable color
    this.color = this.colors[randomIndex];
  }

  

  ngOnInit(): void {

    this.assignRandomColor();
  }

}
