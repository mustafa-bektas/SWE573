import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 0;
  pageSize: number = 8; // Reduced to match new grid layout
  loading = true;
  searchQuery: string = '';
  totalPosts: number = 0;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.currentPage = 0; // Reset page when search changes
      this.fetchPosts();
    });
  }

  fetchPosts(): void {
    this.loading = true;

    const fetchMethod = this.searchQuery
      ? this.postService.searchPosts(this.searchQuery, this.currentPage, this.pageSize)
      : this.postService.getPosts(this.currentPage, this.pageSize);

    fetchMethod.pipe(
      catchError(error => {
        console.error('Error fetching posts:', error);
        // Optional: Add error toast or notification
        return of({ content: [], totalElements: 0 });
      }),
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.posts = data.content;
      this.totalPosts = data.totalElements;
    });
  }

  onCardClick(post: any) {
    this.router.navigate(['/post', post.id]);
  }

  nextPage(): void {
    if (this.posts.length === this.pageSize) {
      this.currentPage++;
      this.fetchPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchPosts();
    }
  }
}
