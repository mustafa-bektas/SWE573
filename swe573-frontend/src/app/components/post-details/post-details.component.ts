import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: any;
  comments: any[] = [];
  loading = true; // Loading state variable
  commentContent: string = ''; // Content for new post comment
  replyContentMap: { [commentId: number]: string } = {}; // Track reply content for each comment

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(postId).subscribe(
        data => {
          this.post = data;
          this.loading = false; // Set loading to false after data is loaded
          this.loadComments(postId); // Load comments when post data is loaded
        },
        error => {
          console.error('Error loading post details:', error);
          this.loading = false; // Set loading to false even if there’s an error
        }
      );
    }
  }

  loadComments(postId: string): void {
    this.commentService.getCommentsForPost(postId).subscribe(
      data => {
        this.comments = data;
      },
      error => {
        console.error('Error loading comments:', error);
      }
    );
  }

  submitComment(): void {
    if (this.commentContent.trim()) {
      const commentData = {
        content: this.commentContent,
        postId: this.post.id,
        parentCommentId: null // Top-level comment
      };

      this.commentService.createComment(commentData).subscribe(
        () => {
          this.commentContent = ''; // Clear the input field
          this.loadComments(this.post.id); // Reload comments to include the new comment
        },
        error => {
          console.error('Error submitting comment:', error);
        }
      );
    }
  }

  submitReply(parentCommentId: number): void {
    const replyContent = this.replyContentMap[parentCommentId];
    if (replyContent && replyContent.trim()) {
      const replyData = {
        content: replyContent,
        postId: this.post.id,
        parentCommentId
      };

      this.commentService.createComment(replyData).subscribe(
        () => {
          this.replyContentMap[parentCommentId] = ''; // Clear the reply input field
          this.loadComments(this.post.id); // Reload comments to include the new reply
        },
        error => {
          console.error('Error submitting reply:', error);
        }
      );
    }
  }
}
