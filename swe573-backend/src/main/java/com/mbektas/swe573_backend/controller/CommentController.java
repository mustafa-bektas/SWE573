package com.mbektas.swe573_backend.controller;

import com.mbektas.swe573_backend.dto.CommentCreateDto;
import com.mbektas.swe573_backend.dto.CommentDetailsDto;
import com.mbektas.swe573_backend.entity.Comment;
import com.mbektas.swe573_backend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:4200", "https://swe573-frontend-594781402587.us-central1.run.app"})
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Long>> createComment(@RequestBody CommentCreateDto commentCreateDto, @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Long> response = commentService.createComment(commentCreateDto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get/{postId}")
    public ResponseEntity<List<CommentDetailsDto>> getCommentsForPost(@PathVariable Long postId, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        List<CommentDetailsDto> comments = commentService.getCommentsForPost(postId, username);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/upvote/{commentId}")
    public ResponseEntity<Map<String, Long>> upvoteComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Long> response = commentService.upvoteComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/downvote/{commentId}")
    public ResponseEntity<Map<String, Long>> downvoteComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Long> response = commentService.downvoteComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
