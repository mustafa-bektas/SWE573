import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import {AuthService} from '../../services/auth.service';

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
  pendingVotes: Set<number> = new Set();
  pendingPostVote = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.isLoggedIn = this.authService.isLoggedIn.value;
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
    if (this.pendingVotes.has(commentId)) return;

    const commentToUpdate = this.findCommentById(this.comments, commentId);
    if (!commentToUpdate) return;

    const wasUpvoted = commentToUpdate.userUpvoted;
    const wasDownvoted = commentToUpdate.userDownvoted;

    if (wasUpvoted) {
      commentToUpdate.userUpvoted = false;
      commentToUpdate.upvotes--;
    } else {
      commentToUpdate.userUpvoted = true;
      commentToUpdate.upvotes++;

      if (wasDownvoted) {
        commentToUpdate.userDownvoted = false;
        commentToUpdate.downvotes--;
      }
    }

    this.pendingVotes.add(commentId);

    this.commentService.upvoteComment(commentId).subscribe(
      () => {
        this.pendingVotes.delete(commentId);
      },
      error => {
        console.error('Error upvoting comment:', error);

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
      commentToUpdate.userDownvoted = false;
      commentToUpdate.downvotes--;
    } else {
      commentToUpdate.userDownvoted = true;
      commentToUpdate.downvotes++;

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

  upvotePost(): void {
    if (this.pendingPostVote) return;

    const wasUpvoted = this.post.userUpvoted;
    const wasDownvoted = this.post.userDownvoted;

    if (wasUpvoted) {
      this.post.userUpvoted = false;
      this.post.upvotes--;
    } else {
      this.post.userUpvoted = true;
      this.post.upvotes++;

      if (wasDownvoted) {
        this.post.userDownvoted = false;
        this.post.downvotes--;
      }
    }

    this.pendingPostVote = true;

    this.postService.upvotePost(this.post.id).subscribe(
      () => {
        this.pendingPostVote = false;
      },
      error => {
        console.error('Error upvoting post:', error);

        this.post.userUpvoted = wasUpvoted;
        this.post.userDownvoted = wasDownvoted;

        if (wasUpvoted) {
          this.post.upvotes--;
        } else {
          this.post.upvotes++;
        }

        if (wasDownvoted) {
          this.post.downvotes++;
        }

        this.pendingPostVote = false;
      }
    );
  }

  downvotePost(): void {
    if (this.pendingPostVote) return;

    const wasDownvoted = this.post.userDownvoted;
    const wasUpvoted = this.post.userUpvoted;

    if (wasDownvoted) {
      this.post.userDownvoted = false;
      this.post.downvotes--;
    } else {
      this.post.userDownvoted = true;
      this.post.downvotes++;

      if (wasUpvoted) {
        this.post.userUpvoted = false;
        this.post.upvotes--;
      }
    }

    this.pendingPostVote = true;

    this.postService.downvotePost(this.post.id).subscribe(
      () => {
        this.pendingPostVote = false;
      },
      error => {
        console.error('Error downvoting post:', error);

        this.post.userDownvoted = wasDownvoted;
        this.post.userUpvoted = wasUpvoted;

        if (wasDownvoted) {
          this.post.downvotes--;
        } else {
          this.post.downvotes++;
        }

        if (wasUpvoted) {
          this.post.upvotes++;
        }

        this.pendingPostVote = false;
      }
    );
  }

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
