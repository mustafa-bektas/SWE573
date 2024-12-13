import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  loading = true; // Loading state variable
  searchQuery: string = '';

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.fetchPosts();
    });
  }

  fetchPosts(): void {
    this.loading = true; // Set loading to true before API call

    if (this.searchQuery) {
      this.postService.searchPosts(this.searchQuery, this.currentPage, this.pageSize).subscribe(
        data => {
          this.posts = data.content;
          this.loading = false; // Set loading to false after data is loaded
        },
        error => {
          console.error('Error fetching posts:', error);
          this.loading = false; // Set loading to false even if there’s an error
        }
      );
      return;
    }

    this.postService.getPosts(this.currentPage, this.pageSize).subscribe(
      data => {
        this.posts = data.content;
        this.loading = false; // Set loading to false after data is loaded
      },
      error => {
        console.error('Error fetching posts:', error);
        this.loading = false; // Set loading to false even if there’s an error
      }
    );
  }

  onCardClick(post: any) {
    this.router.navigate(['/post', post.id]);
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchPosts();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchPosts();
    }
  }

  navigateToSearch(query: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query },
      queryParamsHandling: 'merge', // Merge with existing query parameters
    });
  }
}
