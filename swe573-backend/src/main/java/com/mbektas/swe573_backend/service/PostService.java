package com.mbektas.swe573_backend.service;

import com.mbektas.swe573_backend.dao.MysteryObjectRepository;
import com.mbektas.swe573_backend.dao.PostRepository;
import com.mbektas.swe573_backend.dao.UserRepository;
import com.mbektas.swe573_backend.dto.PostCreationDto;
import com.mbektas.swe573_backend.entity.MysteryObject;
import com.mbektas.swe573_backend.entity.Post;
import com.mbektas.swe573_backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private PostRepository postRepository;
    private MysteryObjectRepository mysteryObjectRepository;
    private UserRepository userRepository;

    public PostService(PostRepository postRepository, MysteryObjectRepository mysteryObjectRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.mysteryObjectRepository = mysteryObjectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Post createPost(PostCreationDto postCreationDto, String userName) {

        Post post = new Post();
        post.setTitle(postCreationDto.getTitle());
        post.setDescription(postCreationDto.getContent());
        post.setTags(postCreationDto.getTags());
        post.setUser(userRepository.findByUsername(userName).orElseThrow());

        MysteryObject mysteryObject = postCreationDto.getMysteryObject();
        mysteryObjectRepository.save(mysteryObject);
        post.setMysteryObject(mysteryObject);

        return postRepository.save(post);
    }
}
