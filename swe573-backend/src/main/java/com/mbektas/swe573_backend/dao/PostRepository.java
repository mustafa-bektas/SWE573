package com.mbektas.swe573_backend.dao;

import com.mbektas.swe573_backend.dto.PostDetailsDto;
import com.mbektas.swe573_backend.dto.PostListDto;
import com.mbektas.swe573_backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Set;

@CrossOrigin(origins = {"http://localhost:4200", "https://swe573-frontend-594781402587.us-central1.run.app"})
public interface PostRepository  extends JpaRepository<Post, Long> {
    @Query("SELECT DISTINCT new com.mbektas.swe573_backend.dto.PostListDto(p.id, p.title, p.description, mo.image) " +
            "FROM Post p " +
            "LEFT JOIN p.mysteryObject mo")
    Page<PostListDto> findAllForPostList(Pageable pageable);

    @Query("SELECT p " +
            "FROM Post p " +
            "LEFT JOIN FETCH p.mysteryObject mo " +
            "WHERE p.id = :id")
    Post findPostDetailsById(Long id);


    @Query("SELECT p.tags FROM Post p WHERE p.id = :postId")
    Set<String> findTagsByPostId(@Param("postId") Long postId);
}
