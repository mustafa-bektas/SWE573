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

    public Map<String, Long> createComment(CommentCreateDto commentCreateDto, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
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
        return comments.stream().map(comment -> modelMapper.map(comment, CommentDetailsDto.class)).toList();
    }
}
