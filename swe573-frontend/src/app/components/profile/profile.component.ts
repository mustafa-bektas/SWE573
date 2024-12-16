import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import {HttpClient} from '@angular/common/http';
import {baseApiUrl} from '../../app.module';
import {AuthService} from '../../services/auth.service';

export interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[];
  createdAt?: Date;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number;
  posts: Post[] = [];
  comments: Comment[] = [];
  loadingPosts = true;
  loadingComments = true;
  userName: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getUserName();
    this.loadUserPosts();
    this.loadUserComments();
  }

  loadUserPosts(): void {
    this.postService.getUserPosts(this.userId).subscribe(
      (data) => {
        // Sort posts by most recent first, handling potential undefined dates
        this.posts = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        this.loadingPosts = false;
      },
      (error) => {
        console.error('Error loading posts:', error);
        this.loadingPosts = false;
      }
    );
  }

  loadUserComments(): void {
    this.commentService.getUserComments(this.userId).subscribe(
      (data) => {
        // Sort comments by most recent first
        this.comments = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loadingComments = false;
      },
      (error) => {
        console.error('Error loading comments:', error);
        this.loadingComments = false;
      }
    );
  }

  // Helper method to format date
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getUserName() {
    this.authService.getUserNameFromId(this.userId).subscribe(
      (data) => {
        this.userName = data;
      },
      (error) => {
        console.error('Error loading user name:', error);
      }
    );
  }
}
