package com.mbektas.swe573_backend.controller;

import com.mbektas.swe573_backend.dto.CommentDetailsDto;
import com.mbektas.swe573_backend.dto.PostListDto;
import com.mbektas.swe573_backend.entity.User;
import com.mbektas.swe573_backend.dao.UserRepository;
import com.mbektas.swe573_backend.security.JwtUtil;
import com.mbektas.swe573_backend.service.CommentService;
import com.mbektas.swe573_backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://swe573-frontend-594781402587.us-central1.run.app"})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PostService postService;
    private final CommentService commentService;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, PostService postService, CommentService commentService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        // Authenticate the user using their email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        // Retrieve the user from the database to get their full details, including ID
        User authenticatedUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate the token using email and userId
        String token = jwtUtil.generateToken(authenticatedUser.getEmail(), authenticatedUser.getId());

        // Create a JSON response with the token
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<PostListDto>> getUserPosts(@PathVariable Long userId) {
        List<PostListDto> userPosts = postService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    @GetMapping("/{userId}/comments")
    public ResponseEntity<List<CommentDetailsDto>> getUserComments(@PathVariable Long userId) {
        List<CommentDetailsDto> userComments = commentService.getUserComments(userId);
        return ResponseEntity.ok(userComments);
    }

}