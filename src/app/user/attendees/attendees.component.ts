import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrl: './attendees.component.scss',
  standalone: true
})
export class AttendeesComponent {

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.map(user => ({
          ...user
          
        }));
      },
      (error) => {
        console.error('Error al obtener los videos:', error);
      }
    );
  }

}
