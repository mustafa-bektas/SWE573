import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  notifications: Notification[] = [];
  unreadCount: number = 0;
  userId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.userId = this.authService.getUserId();
          this.fetchNotifications();
        } else {
          this.resetNotifications();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/posts'], {
        queryParams: { q: this.searchQuery.trim() }
      });
      this.searchQuery = ''; // Clear the search input
    }
  }

  fetchNotifications(): void {
    if (this.userId) {
      this.notificationService.getNotifications(this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (notifications) => {
            this.notifications = notifications;
            this.unreadCount = notifications.filter((n) => !n.isRead).length;
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );
    }
  }

  private resetNotifications(): void {
    this.notifications = [];
    this.unreadCount = 0;
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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
    this.notificationService.dismissNotification(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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
