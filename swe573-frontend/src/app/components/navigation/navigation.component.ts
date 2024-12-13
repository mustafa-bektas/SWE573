import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  searchQuery: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/posts'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = ''; // Clear the search input
    }
  }
}
