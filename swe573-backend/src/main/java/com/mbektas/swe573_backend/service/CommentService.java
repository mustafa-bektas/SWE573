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
import java.util.stream.Collectors;

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
                commentDetailsDtos.add(mapCommentToDto(comment, comment.getUser()));
            }
        }

        return commentDetailsDtos;
    }

    public Map<String, Long> upvoteComment(Long commentId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        // Check if user already upvoted
        if (comment.getUpvotedBy().contains(user)) {
            // If already upvoted, remove the upvote
            comment.getUpvotedBy().remove(user);
            comment.setUpvotesCount(comment.getUpvotesCount() - 1);
        } else {
            // If not upvoted, add upvote
            comment.getUpvotedBy().add(user);
            comment.setUpvotesCount(comment.getUpvotesCount() + 1);

            // Remove downvote if exists
            if (comment.getDownvotedBy().contains(user)) {
                comment.getDownvotedBy().remove(user);
                comment.setDownvotesCount(comment.getDownvotesCount() - 1);
            }
        }

        commentRepository.save(comment);

        Map<String, Long> response = new HashMap<>();
        response.put("commentId", comment.getId());

        return response;
    }

    public Map<String, Long> downvoteComment(Long commentId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        // Check if user already downvoted
        if (comment.getDownvotedBy().contains(user)) {
            // If already downvoted, remove the downvote
            comment.getDownvotedBy().remove(user);
            comment.setDownvotesCount(comment.getDownvotesCount() - 1);
        } else {
            // If not downvoted, add downvote
            comment.getDownvotedBy().add(user);
            comment.setDownvotesCount(comment.getDownvotesCount() + 1);

            // Remove upvote if exists
            if (comment.getUpvotedBy().contains(user)) {
                comment.getUpvotedBy().remove(user);
                comment.setUpvotesCount(comment.getUpvotesCount() - 1);
            }
        }

        commentRepository.save(comment);

        Map<String, Long> response = new HashMap<>();
        response.put("commentId", comment.getId());

        return response;
    }

    private CommentDetailsDto mapCommentToDto(Comment comment, User currentUser) {
        boolean userUpvoted = comment.getUpvotedBy().contains(currentUser);
        boolean userDownvoted = comment.getDownvotedBy().contains(currentUser);

        return new CommentDetailsDto(
                comment.getId(),
                comment.getContent(),
                comment.getUser().getUsername(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getReplies().stream()
                        .map(reply -> mapCommentToDto(reply, currentUser))
                        .collect(Collectors.toList()),
                comment.getUpvotesCount(),
                comment.getDownvotesCount(),
                userUpvoted,
                userDownvoted
        );
    }
}