package com.mbektas.swe573_backend.controller;

import com.mbektas.swe573_backend.dto.PostCreationDto;
import com.mbektas.swe573_backend.dto.PostDetailsDto;
import com.mbektas.swe573_backend.dto.PostListDto;
import com.mbektas.swe573_backend.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:4200", "https://swe573-frontend-594781402587.us-central1.run.app"})
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/create")
    public ResponseEntity<Map<String, Long>> createPost(
            @RequestPart("post") PostCreationDto postCreationDto,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        Map<String, Long> response = postService.createPost(postCreationDto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/getForPostList")
    public Page<PostListDto> getPostsForPostList(Pageable pageable) {
        return postService.getAllPostsForPostList(pageable);
    }

    @GetMapping("/getForPostDetails/{postId}")
    public ResponseEntity<PostDetailsDto> getPostDetails(@PathVariable Long postId) {
        PostDetailsDto postDetailsDto = postService.getPostDetails(postId);
        return ResponseEntity.ok(postDetailsDto);
    }
}