import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AppComponent } from '../../app.component';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registrationForm: FormGroup;
  isEmailVerified = false;
  isLoading = false;
  errorMessage = '';

  //private userService : UserService;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private app: AppComponent,
    private roleService: RoleService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      stream: ['', [Validators.required]],
      projName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      password: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      verificationCode: ['', Validators.required],
    });
  }

  /*sendVerificationCode() {
    const email = this.registrationForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .post('http://localhost:8080/api/send-code/', { email })
      .subscribe({
        next: () => {
          alert('Verification code sent to your email!');
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to send verification code';
          console.error('Error sending code:', err);
          this.isLoading = false;
        },
      });
  }*/

  sendVerificationCode() {
    const email = this.registrationForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    console.log('Attempting to send OTP to:', email); // Debug log

    this.http.post('http://localhost:8080/api/send-code', { email }).subscribe({
      next: (response) => {
        console.log('OTP send response:', response); // Debug log
        alert('Verification code sent to your email!');
      },
      error: (error) => {
        console.error('OTP send error:', error); // Debug log
        this.errorMessage =
          error.error?.message || 'Failed to send verification code';
        alert('Error sending verification code: ' + this.errorMessage);
      },
    });
  }

  verifyCode() {
    const code = this.registrationForm.get('verificationCode')?.value;
    if (!code) {
      this.errorMessage = 'Please enter verification code';
      return;
    }

    this.isLoading = true;

    this.http
      .post('http://localhost:8080/api/verify-code', { code })
      .subscribe({
        next: () => {
          this.isEmailVerified = true;
          this.isLoading = false;
          alert('Email verified successfully!');
        },
        error: (err) => {
          this.errorMessage = 'Invalid verification code';
          this.isLoading = false;
          console.error('Verification failed:', err);
        },
      });
  }

  onSubmit() {
    const code = this.registrationForm.get('verificationCode')?.value;
    if (!code) {
      this.errorMessage = 'Please enter verification code';
      return;
    }

    this.isLoading = true;

    this.http
      .post<{ message: string }>('http://localhost:8080/api/verify-code', {
        code,
      })
      .subscribe({
        next: (res) => {
          this.isEmailVerified = true;
          this.isLoading = false;
          alert('Email verified successfully!');

          // ✅ Now proceed with registration
          if (this.registrationForm.invalid) {
            console.log('Form invalid:', this.registrationForm.value);
            console.log('Form errors:', this.registrationForm.errors);
            this.errorMessage = 'Please fill all required fields correctly';
            return;
          }

          this.user = this.registrationForm.value;
          //this.http.post('http://localhost:8080/admin/users',formData).subscribe(() => alert(user))
          this.userService.addUser(this.user).subscribe({
            next: () => {
              alert('Registration successful!');
              this.roleService.setRole(this.user.userRole);
              console.log('Set role to:', this.user.userRole);
              this.registrationForm.reset();
              this.router.navigate(['/login']);
            },
            error: (err) => {
              this.errorMessage = 'Failed to register user';
              this.isLoading = false;
              console.error('Registration error:', err);
            },
          });
        },
        error: (err) => {
          this.errorMessage = 'Invalid verification code';
          this.isLoading = false;
          console.error('Verification failed:', err);
        },
      });
  }
}
