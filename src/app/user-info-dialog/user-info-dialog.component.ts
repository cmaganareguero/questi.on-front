import { Component } from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ThemePalette} from '@angular/material/core';
import { MatChipsModule} from '@angular/material/chips';
import { MatRadioModule} from '@angular/material/radio';
import { MatSelectModule} from '@angular/material/select';
import { FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}

interface Animal {
  name: string;
  sound: string;
}

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
  standalone : true,
  imports: [MatCardModule,MatIconModule, MatFormFieldModule, CommonModule, HttpClientModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatChipsModule, MatRadioModule, MatSelectModule, FormsModule],
  providers: [UserService]

})
export class UserInfoDialogComponent {

  motivo: string = ''; // Variable motivo agregada
  textControl = new FormControl('', [Validators.required]); // Cambiar a validación de texto
  errorMessage = '';
  curso: string = ''; // Variable para almacenar el curso
  ramaCarrera: string = ''; // Variable para almacenar la rama/carrera
  dificultad: string = ''; // Variable para almacenar la dificultad

  constructor(private userService: UserService) {
    this.textControl.valueChanges.subscribe(() => this.updateErrorMessage()); // Actualizar mensaje de error al cambiar el valor del campo
  }

  availableColors: ChipColor[] = [
    {name: 'Estudiante', color: 'primary'},
    {name: 'Profesor', color: 'accent'},
    {name: 'Otro', color: 'warn'},
  ];
  
  animalControl = new FormControl<Animal | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'ESO', sound: 'Meow!'},
    {name: 'Bachillerato', sound: 'Moo!'},
    {name: 'Universitario', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];

  updateErrorMessage() {
    this.errorMessage = this.textControl.hasError('required') ? 'You must enter a value' : ''; // Verificar si es requerido
  }

  onMotivoChange() {
    console.log('Motivo seleccionado:', this.motivo);
    console.log('Curso seleccionado:', this.animalControl.value?.name);
  }

  onCursoChange() {
    console.log('Curso seleccionado:', this.animalControl.value?.name);
  }

  onRamaCarreraChange() {
    console.log('Rama/Carrera introducida:', this.ramaCarrera);
  }

  onDificultadChange() {
    console.log('Dificultad seleccionada:', this.dificultad);
  }
}
