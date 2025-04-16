import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  user: User = {
    id: 0,
    name: '',
    email: '',
    stream: '',
    projName: '',
    status: '',
    userRole: '',
  };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        (data: User) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user:', error);
          this.errorMessage = 'Failed to load user data';
        }
      );
    }
  }

  onSubmit(): void {
    if (!this.isValidForm()) {
      return;
    }

    this.isSubmitting = true;
    this.userService.updateUser(this.user.id, this.user).subscribe(
      () => {
        this.router.navigate(['/details']);
      },
      (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Failed to update user';
        this.isSubmitting = false;
      }
    );
  }

  isValidForm(): boolean {
    if (!this.user.name || !this.user.email) {
      this.errorMessage = 'Name and Email are required';
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  onCancel(): void {
    this.router.navigate(['/details']);
  }
}
