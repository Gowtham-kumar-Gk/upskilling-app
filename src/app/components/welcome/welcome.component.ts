import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  onClickLogin() {
    this.router.navigate(['/login']);
  }

  onClickRegister() {
    this.router.navigate(['/register']);
  }
}
