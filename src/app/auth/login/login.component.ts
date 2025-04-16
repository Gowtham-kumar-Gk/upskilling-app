import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import { User } from '../../models/user.model';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  private userD!: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private http: HttpClient,
    private userService: UserService,
    private app: AppComponent
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      verificationCode: ['', Validators.required],
    });
  }

  sendVerificationCode() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      alert('please enter email');
      return;
    }
    this.http
      .post('http://localhost:8080/api/send-code', { email })
      .subscribe(() => {
        alert('verification code sent!');
      });
  }

  onSubmit() {
    const code = this.loginForm.get('verificationCode')?.value;
    //let isTrue: boolean = false;
    this.http
      .post('http://localhost:8080/api/verify-code', { code })
      .subscribe({
        next: () => {
          alert('Email verified successfully!');
          //isTrue = true;
        },
        error: () => {
          alert('Verification failed.');
          //isTrue = false;
        },
      });

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Get users from database and check
      this.userService.getUsers().subscribe({
        next: (users: User[]) => {
          const user = users.find(
            (u: any) => u.email === email && u.password === password
          );

          if (user) {
            alert(`Welcome ${user.name}!`);
            this.userD = user;
            this.roleService.setRole(user.userRole);
            console.log('Set role to:', user.userRole);
            this.router.navigate(['/details']);
          } else {
            alert('Invalid email or password.');
          }
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        },
      });
    }
  }
}
