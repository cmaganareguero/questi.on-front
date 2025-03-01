import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ExitDialogComponent, ExitDialogData } from '../app/exit-dialog/exit-dialog.component';
import { GameService } from '../services/game.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmExitGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private dialog: MatDialog, private gameService: GameService) {}

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    return true;
  }

  canDeactivateWithConfirmation(): Observable<boolean> {
    const dialogRef = this.dialog.open(ExitDialogComponent, {
      data: {
        message: '¿Estás seguro de que deseas salir de la partida?',
      },
    });

    return dialogRef.afterClosed();
  }
}
