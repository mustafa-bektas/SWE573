package com.mbektas.swe573_backend.dao;

import com.mbektas.swe573_backend.entity.MysteryObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface MysteryObjectRepository extends JpaRepository<MysteryObject, Long> {
}