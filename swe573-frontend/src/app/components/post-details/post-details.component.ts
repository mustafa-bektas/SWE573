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
  loading = true; // Loading state
  commentContent: string = ''; // Top-level comment content
  replyContentMap: { [commentId: number]: string } = {}; // Map for reply content per comment

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
          this.loading = false;
          this.loadComments(postId); // Load comments
        },
        error => {
          console.error('Error loading post details:', error);
          this.loading = false;
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
        parentCommentId: null // Indicates a top-level comment
      };

      this.commentService.createComment(commentData).subscribe(
        () => {
          this.commentContent = ''; // Clear input
          this.loadComments(this.post.id); // Reload comments
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
          delete this.replyContentMap[parentCommentId]; // Remove the entry to close the reply text box
          this.loadComments(this.post.id); // Reload comments to include the new reply
        },
        error => {
          console.error('Error submitting reply:', error);
        }
      );
    }
  }
}
