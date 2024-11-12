import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: any;
  comments: any[] = [];
  loading = true; // Loading state variable

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(postId).subscribe(
        data => {
          this.post = data;
          this.loading = false; // Set loading to false after data is loaded
        },
        error => {
          console.error('Error loading post details:', error);
          this.loading = false; // Set loading to false even if there’s an error
        }
      );
    }
  }
}
