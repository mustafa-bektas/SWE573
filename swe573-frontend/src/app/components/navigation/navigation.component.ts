import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  postId?: number;
  commentId?: number;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  searchQuery: string = '';
  notifications: Notification[] = [];
  unreadCount: number = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn.value) {
      this.fetchNotifications();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/posts'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = ''; // Clear the search input
    }
  }

  fetchNotifications(): void {
    const userId = this.authService.getUserId();
    this.notificationService.getNotifications(userId).subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter((n) => !n.isRead).length;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        const notification = this.notifications.find((n) => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
        }
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
  }

  dismissNotification(notificationId: number): void {
    this.notificationService.dismissNotification(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.filter((n) => n.id !== notificationId);
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
      },
      (error) => {
        console.error('Error dismissing notification:', error);
      }
    );
  }

  navigateTo(notification: Notification): void {
    if (notification.postId) {
      this.router.navigateByUrl(`/post/${notification.postId}`).then(() => {
        this.markAsRead(notification.id);
      });
    }
    this.markAsRead(notification.id);
  }
}
