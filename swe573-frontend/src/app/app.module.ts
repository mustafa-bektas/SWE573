import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { MysteryObjectComponent } from './components/mystery-object/mystery-object.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { PostCreationComponent } from './components/post-creation/post-creation.component';
import { MysteryObjectModalComponent } from './components/mystery-object-modal/mystery-object-modal.component';
import {MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { ProfileComponent } from './components/profile/profile.component';

// Define routes for each component
const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' }, // Welcome page as the default route
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'mystery-object', component: MysteryObjectComponent, canActivate: [AuthGuard] },
  { path: 'create-post', component: PostCreationComponent, canActivate: [AuthGuard] }, // Add route for Post Creation
  { path: 'posts', component: PostListComponent },
  { path: 'post/:id', component: PostDetailsComponent },
  { path: 'profile/:id', component: ProfileComponent }
];

//export const baseApiUrl = 'https://swe573-backend-594781402587.us-central1.run.app';
export const baseApiUrl = 'http://localhost:8080';

@NgModule({
  declarations: [
    AppComponent,
    MysteryObjectComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    PostCreationComponent,
    MysteryObjectModalComponent,
    PostListComponent,
    PostDetailsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogModule,
    NgbAccordionModule
    // Configure the router with the defined routes
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
