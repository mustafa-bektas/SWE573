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
}
