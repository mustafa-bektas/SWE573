import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { MysteryObjectComponent } from './components/mystery-object/mystery-object.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/auth.guard';
import {NonAuthGuard} from './services/non-auth.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';

// Define routes for each component
const routes: Routes = [
  { path: '', component: WelcomeComponent }, // Welcome page as the default route
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'mystery-object', component: MysteryObjectComponent, canActivate: [AuthGuard] },
  // other routes...
];


@NgModule({
  declarations: [
    AppComponent,
    MysteryObjectComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule.forRoot(routes) // Configure the router with the defined routes
  ],
  providers: [
    AuthGuard,
    NonAuthGuard,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
