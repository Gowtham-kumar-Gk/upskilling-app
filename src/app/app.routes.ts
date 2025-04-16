import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DetailsComponent } from './components/details/details.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'details', component: DetailsComponent },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    data: {
      renderMode: 'default', // disables static prerendering for this route
    },
  },
];
