import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  users: User[] = [];
  userR: string = '';
  selectedUser!: User;
  showModal = false;

  constructor(
    private userService: UserService,
    private appW: AppComponent,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.userR = this.roleService.getRole();
    console.log('Retrieved role:', this.userR);
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (err: any) => {
        console.error('Error fetching user data', err);
      }
    );
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        alert('User deleted');
        this.users = this.users.filter((user) => user.id !== id);
      });
    }
  }

  editUser(user: User) {
    console.log('Attempting to navigate to edit user:', user.id);
    this.router
      .navigate(['/edit-user/', user.id])
      .then((success) => {
        if (success) {
          console.log('Navigation successful');
        } else {
          console.error('Navigation failed');
        }
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }

  navigateToAddUser() {
    this.router.navigate(['/register']);
  }
}
