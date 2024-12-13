package com.mbektas.swe573_backend.dto;

import com.mbektas.swe573_backend.entity.MysteryObject;
import lombok.Data;
import java.util.Set;

@Data
public class PostListDto {
    private Long id;
    private String title;
    private String description;
    private Set<String> tags;
    private byte[] mysteryObjectImage;
    private boolean isSolved;

    public PostListDto(Long id, String title, String description, byte[] mysteryObjectImage, boolean isSolved) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mysteryObjectImage = mysteryObjectImage;
        this.isSolved = isSolved;
    }
}
