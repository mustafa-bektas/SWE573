package com.mbektas.swe573_backend.service;

import com.mbektas.swe573_backend.dao.CommentRepository;
import com.mbektas.swe573_backend.dao.PostRepository;
import com.mbektas.swe573_backend.dao.UserRepository;
import com.mbektas.swe573_backend.dto.CommentCreateDto;
import com.mbektas.swe573_backend.dto.CommentDetailsDto;
import com.mbektas.swe573_backend.entity.Comment;
import com.mbektas.swe573_backend.entity.Post;
import com.mbektas.swe573_backend.entity.User;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public Map<String, Long> createComment(CommentCreateDto commentCreateDto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(commentCreateDto.getPostId()).orElseThrow();

        Comment parentComment = null;
        if (commentCreateDto.getParentCommentId() != null) {
            parentComment = commentRepository.findById(commentCreateDto.getParentCommentId()).orElseThrow();
        }

        Comment comment = new Comment();
        comment.setContent(commentCreateDto.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setParentComment(parentComment);

        Comment savedComment = commentRepository.save(comment);

        Map<String, Long> response = new HashMap<>();
        response.put("commentId", savedComment.getId());

        return response;
    }

    public List<CommentDetailsDto> getCommentsForPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        List<CommentDetailsDto> commentDetailsDtos = new ArrayList<>();
        for (var comment : comments) {
            if (comment.getParentComment() == null)
            {
                commentDetailsDtos.add(mapCommentToDto(comment));
            }
        }

        return commentDetailsDtos;
    }

    private CommentDetailsDto mapCommentToDto(Comment comment) {
        // Map the top-level comment
        var authorName = comment.getUser().getUsername();

        // Recursively map replies
        var replies = comment.getReplies().stream()
                .map(this::mapCommentToDto) // Recursive mapping
                .toList();

        // Return the mapped DTO
        return new CommentDetailsDto(
                comment.getId(),
                comment.getContent(),
                authorName,
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                replies
        );
    }
}
