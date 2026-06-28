package com.example.login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.login.entity.Notification;

/** DAO for {@link Notification}. */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRegistrationCodeOrderByIdDesc(String registrationCode);

    long countByRegistrationCodeAndReadFalse(String registrationCode);

    // ---- accepted-interest connection queries ----
    List<Notification> findByFromCodeAndTypeAndStatus(String fromCode, String type, String status);

    List<Notification> findByRegistrationCodeAndTypeAndStatus(String registrationCode, String type, String status);

    boolean existsByFromCodeAndRegistrationCodeAndTypeAndStatus(String fromCode, String registrationCode, String type, String status);
}
