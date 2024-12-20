package com.mbektas.swe573_backend.dao;

import com.mbektas.swe573_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200", "https://swe573-frontend-594781402587.us-central1.run.app"})
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}
