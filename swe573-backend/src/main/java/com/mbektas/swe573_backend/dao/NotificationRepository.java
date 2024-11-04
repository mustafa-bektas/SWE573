package com.mbektas.swe573_backend.dao;

import com.mbektas.swe573_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
