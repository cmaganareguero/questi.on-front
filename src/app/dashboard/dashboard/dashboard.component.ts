import { Component, Input } from '@angular/core';
import { GamecardComponent } from '../gamecard/gamecard.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { MatIconModule} from '@angular/material/icon';
import { MatDialogModule , MatDialog } from '@angular/material/dialog';
import { UserInfoDialogComponent } from '../../user-info-dialog/user-info-dialog.component';
import {MatCardModule} from '@angular/material/card';
import { AuthorizationService } from '../../../services/authorization.service';
import { RouterOutlet } from '@angular/router';
import {RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormcardComponent } from '../../formcard/formcard.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [GamecardComponent, MatIconModule, HttpClientModule, MatDialogModule,RouterOutlet,RouterModule, UserInfoDialogComponent,MatCardModule, FormcardComponent, MatButtonModule],
  providers: [UserService, AuthorizationService]
})
export class DashboardComponent {

  constructor(private userService: UserService, public dialog: MatDialog, private authService: AuthorizationService) { }

  username : string = '';
  @Input() profilePicUrl: string = '/assets/defaultUser.png'; // Ruta de la imagen

  ngOnInit(): void {
    // Ejemplo de cómo obtener el ID de usuario desde el token
    const userId = this.authService.getUserIdFromToken();
    this.username = userId;
    console.log('ID de usuario:', userId);
  }

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


}
