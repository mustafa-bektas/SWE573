package com.mbektas.swe573_backend.controller;

import com.mbektas.swe573_backend.dto.PostCreationDto;
import com.mbektas.swe573_backend.entity.Post;
import com.mbektas.swe573_backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(
            @RequestBody PostCreationDto postCreationDto,
            @AuthenticationPrincipal UserDetails userDetails)  {
        Post post = postService.createPost(postCreationDto, userDetails.getUsername());
        return ResponseEntity.ok(post);
    }
}
