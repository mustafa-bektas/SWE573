package com.mbektas.swe573_backend.service;

import com.mbektas.swe573_backend.dao.MysteryObjectRepository;
import com.mbektas.swe573_backend.dao.PostRepository;
import com.mbektas.swe573_backend.dao.UserRepository;
import com.mbektas.swe573_backend.dto.PostCreationDto;
import com.mbektas.swe573_backend.dto.PostDetailsDto;
import com.mbektas.swe573_backend.dto.PostListDto;
import com.mbektas.swe573_backend.entity.MysteryObject;
import com.mbektas.swe573_backend.entity.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final MysteryObjectRepository mysteryObjectRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, MysteryObjectRepository mysteryObjectRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.mysteryObjectRepository = mysteryObjectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Long> createPost(PostCreationDto postCreationDto, String userName) {
        Post post = new Post();
        post.setTitle(postCreationDto.getTitle());
        post.setDescription(postCreationDto.getContent());
        post.setTags(postCreationDto.getTags());
        post.setUser(userRepository.findByUsername(userName).orElseThrow());

        MysteryObject mysteryObject = postCreationDto.getMysteryObject();

        if (mysteryObject.getImage() != null) {
            // Decode the Base64 image
            mysteryObject.setImage(Base64.getDecoder().decode(mysteryObject.getImage()));
        }

        mysteryObjectRepository.save(mysteryObject);
        post.setMysteryObject(mysteryObject);

        Post savedPost = postRepository.save(post);

        Map<String, Long> response = new HashMap<>();
        response.put("postId", savedPost.getId());
        response.put("mysteryObjectId", mysteryObject.getId());

        return response;
    }

    public Page<PostListDto> getAllPostsForPostList(Pageable pageable) {
        Page<PostListDto> posts = postRepository.findAllForPostList(pageable);
        posts.forEach(post -> {
            Set<String> tags = postRepository.findTagsByPostId(post.getId());
            post.setTags(tags);
        });
        return posts;
    }

    public PostDetailsDto getPostDetails(Long postId) {
        PostDetailsDto post = postRepository.findPostDetailsById(postId);
        Set<String> tags = postRepository.findTagsByPostId(postId);
        post.setTags(tags);
        return post;
    }
}
