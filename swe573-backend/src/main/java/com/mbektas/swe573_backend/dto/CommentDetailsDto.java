package com.mbektas.swe573_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDetailsDto {
    private Long id;
    private String content;
    private String author; // To show the author's username
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDetailsDto> replies; // Nested replies

    private int upvotes;
    private int downvotes;

    private boolean userUpvoted;
    private boolean userDownvoted;

    public CommentDetailsDto(Long id, String content, String authorName, LocalDateTime createdAt, LocalDateTime updatedAt, List<CommentDetailsDto> replies, int upvotes, int downvotes, boolean userUpvoted, boolean userDownvoted) {
        this.id = id;
        this.content = content;
        this.author = authorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.replies = replies;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.userUpvoted = userUpvoted;
        this.userDownvoted = userDownvoted;
    }

    public CommentDetailsDto() {
    }
}
