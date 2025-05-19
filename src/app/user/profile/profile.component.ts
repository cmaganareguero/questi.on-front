import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';

import { PopUpComponent } from '../../pop-up/pop-up.component';
import { CardfieldComponent } from '../../cardfield/cardfield.component';
import { StatsroomComponent } from '../../statsroom/statsroom.component';

import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { GameService } from '../../../services/game.service';

import { GameUser } from '../../interfaces/user';
import { FinishedGame } from '../../interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    StatsroomComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    PopUpComponent,
    CardfieldComponent,
    HttpClientModule
  ],
  providers: [
    UserService,
    AuthorizationService,
    GameService
  ]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profileForm!: FormGroup;

  private userEmail!: string;
  public data: GameUser = { name: '', email: '' };
  public playedGames!: FinishedGame[];

  userImageUrl: string = 'assets/defaultUser.png';
  userCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private gameService: GameService,
    private authService: AuthorizationService
  ) {}

  ngOnInit(): void {
    // 1) Inicializar formulario
    this.profileForm = this.fb.group({
      email:   ['', [Validators.required, Validators.email]],
      aboutMe: ['', [Validators.maxLength(300)]]
    });

    // 2) Cargar datos de usuario
    this.userEmail = this.authService.getUserIdFromToken();
    this.userService.getUserDetailsByEmail(this.userEmail)
      .subscribe(user => {
        this.data = user;
        this.profileForm.patchValue({
          email:   user.email,
          aboutMe: (user as any).aboutMe || ''  // si tu API devuelve campo “aboutMe”
        });
      });

    // 3) Cargar juegos
    this.userService.getIdUserByEmail(this.userEmail).subscribe({
      next: (id: string) => {
        this.gameService.getUserGames(id).subscribe(games => {
          this.playedGames = games;
        });
      },
      error: err => console.error('Error al obtener ID usuario:', err)
    });
  }

  // Getters para validaciones
  get email()   { return this.profileForm.get('email')!; }
  get aboutMe() { return this.profileForm.get('aboutMe')!; }

  getEmailError(): string {
    if (this.email.hasError('required')) return 'El correo es obligatorio';
    if (this.email.hasError('email'))    return 'Formato de correo inválido';
    return '';
  }

  getAboutMeError(): string {
    if (this.aboutMe.hasError('maxlength'))
      return 'Máximo 300 caracteres';
    return '';
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const updatedData = this.profileForm.value;
    // Llama a tu servicio para guardar los cambios
    // this.userService.(this.data.name, updatedData)
    //   .subscribe({
    //     next: (res: any) => console.log('Perfil actualizado', res),
    //     error: (err: any) => console.error('Error al actualizar perfil', err)
    //   });
  }

  // Manejadores de imagen
  openImageUploader(): void {
    this.fileInput.nativeElement.click();
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.userImageUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  addCategory(): void {
    console.error('prueba');
  }
}
