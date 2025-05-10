import { Component, ElementRef, ViewChild } from '@angular/core';
import { PopUpComponent } from '../../pop-up/pop-up.component';


import {MatIconModule} from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CardfieldComponent } from '../../cardfield/cardfield.component';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthorizationService } from '../../../services/authorization.service';
import { GameUser } from '../../interfaces/user';
import { GameService } from '../../../services/game.service';
import { FinishedGame } from '../../interfaces';
import { StatsroomComponent } from '../../statsroom/statsroom.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [MatIconModule, StatsroomComponent, MatTabsModule,MatFormFieldModule,MatInputModule, MatCardModule, PopUpComponent, MatButtonModule, CardfieldComponent, HttpClientModule],
  providers: [UserService, AuthorizationService, GameService]
})
export class ProfileComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  private userEmail!: string;

  public playedGames!: FinishedGame[];
  public data: GameUser = {
    name: '',
    email: '',
  };

  constructor(private userService: UserService, private gameService: GameService, private authService: AuthorizationService) { }

  userImageUrl: string = 'assets/defaultUser.png'; // Ruta de la imagen por defecto
  userCategories: string[] = [];

  openImageUploader(): void {
    this.fileInput.nativeElement.click();
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  addCategory(): void {
    console.error('prueba');
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserIdFromToken();
    this.userService.getUserDetailsByEmail(this.userEmail).subscribe((data) => {
      this.data = data;
    });
    this.userService.getIdUserByEmail(this.userEmail).subscribe({
      next: (id: string) => {
        this.gameService.getUserGames(id).subscribe((games) => {
          this.playedGames = games;
          console.log('GAMES', games);
        })
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      }
    });
  }

}

