import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  replies?: Comment[];
}

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: any;
  comments: Comment[] = [];
  loading = true;
  commentContent: string = '';
  replyContentMap: { [commentId: number]: string } = {};

  // Track pending votes to prevent multiple simultaneous votes
  pendingVotes: Set<number> = new Set();

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
          this.loadComments(postId);
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
        parentCommentId: null
      };

      this.commentService.createComment(commentData).subscribe(
        () => {
          this.commentContent = '';
          this.loadComments(this.post.id);
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
          this.replyContentMap[parentCommentId] = '';
          delete this.replyContentMap[parentCommentId];
          this.loadComments(this.post.id);
        },
        error => {
          console.error('Error submitting reply:', error);
        }
      );
    }
  }

  upvoteComment(commentId: number): void {
    // Prevent multiple simultaneous votes
    if (this.pendingVotes.has(commentId)) return;

    // Find the comment to update
    const commentToUpdate = this.findCommentById(this.comments, commentId);
    if (!commentToUpdate) return;

    // Optimistic UI update
    const wasUpvoted = commentToUpdate.userUpvoted;
    const wasDownvoted = commentToUpdate.userDownvoted;

    if (wasUpvoted) {
      // If already upvoted, remove upvote
      commentToUpdate.userUpvoted = false;
      commentToUpdate.upvotes--;
    } else {
      // Add upvote
      commentToUpdate.userUpvoted = true;
      commentToUpdate.upvotes++;

      // Remove downvote if it exists
      if (wasDownvoted) {
        commentToUpdate.userDownvoted = false;
        commentToUpdate.downvotes--;
      }
    }

    // Track pending vote
    this.pendingVotes.add(commentId);

    // Send vote to server
    this.commentService.upvoteComment(commentId).subscribe(
      () => {
        // Successful vote
        this.pendingVotes.delete(commentId);
      },
      error => {
        // Rollback UI changes on error
        console.error('Error upvoting comment:', error);

        // Revert the optimistic update
        if (commentToUpdate) {
          commentToUpdate.userUpvoted = wasUpvoted;
          commentToUpdate.userDownvoted = wasDownvoted;

          if (wasUpvoted) {
            commentToUpdate.upvotes--;
          } else {
            commentToUpdate.upvotes++;
          }

          if (wasDownvoted) {
            commentToUpdate.downvotes++;
          }
        }

        this.pendingVotes.delete(commentId);
      }
    );
  }

  downvoteComment(commentId: number): void {
    if (this.pendingVotes.has(commentId)) return;

    const commentToUpdate = this.findCommentById(this.comments, commentId);
    if (!commentToUpdate) return;

    const wasDownvoted = commentToUpdate.userDownvoted;
    const wasUpvoted = commentToUpdate.userUpvoted;

    if (wasDownvoted) {
      // If already downvoted, remove downvote
      commentToUpdate.userDownvoted = false;
      commentToUpdate.downvotes--;
    } else {
      // Add downvote
      commentToUpdate.userDownvoted = true;
      commentToUpdate.downvotes++;

      // Remove upvote if it exists
      if (wasUpvoted) {
        commentToUpdate.userUpvoted = false;
        commentToUpdate.upvotes--;
      }
    }

    this.pendingVotes.add(commentId);

    this.commentService.downvoteComment(commentId).subscribe(
      () => {
        this.pendingVotes.delete(commentId);
      },
      error => {
        console.error('Error downvoting comment:', error);

        if (commentToUpdate) {
          commentToUpdate.userDownvoted = wasDownvoted;
          commentToUpdate.userUpvoted = wasUpvoted;

          if (wasDownvoted) {
            commentToUpdate.downvotes--;
          } else {
            commentToUpdate.downvotes++;
          }

          if (wasUpvoted) {
            commentToUpdate.upvotes++;
          }
        }

        this.pendingVotes.delete(commentId);
      }
    );
  }

  cancelReply(commentId: number): void {
    delete this.replyContentMap[commentId];
  }

  // Recursive function to find a comment by ID in a nested comment structure
  private findCommentById(comments: Comment[], commentId: number): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;

      if (comment.replies) {
        const nestedComment = this.findCommentById(comment.replies, commentId);
        if (nestedComment) return nestedComment;
      }
    }
    return null;
  }
}
