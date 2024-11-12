package com.mbektas.swe573_backend.dto;

import com.mbektas.swe573_backend.entity.MysteryObject;
import lombok.Data;

import java.util.Set;

@Data
public class PostDetailsDto {
    private Long id;
    private String title;
    private String description;
    private Set<String> tags;
    private MysteryObject mysteryObject;

    public PostDetailsDto(Long id, String title, String description, MysteryObject mysteryObject) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mysteryObject = mysteryObject;
    }
}
