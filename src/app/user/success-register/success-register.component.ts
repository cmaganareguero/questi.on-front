import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-success-register',
  templateUrl: './success-register.component.html',
  styleUrl: './success-register.component.scss',
  standalone: true,
  imports: [MatCardModule, MatRadioModule, MatSelectModule, MatInputModule, MatButtonModule]
})
export class SuccessRegisterComponent {

}
