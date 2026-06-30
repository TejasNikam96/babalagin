package com.example.login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.login.entity.ProfileLike;

/** DAO for {@link ProfileLike}. */
@Repository
public interface ProfileLikeRepository extends JpaRepository<ProfileLike, Long> {

    long countByToCode(String toCode);

    boolean existsByFromCodeAndToCode(String fromCode, String toCode);

    void deleteByFromCodeAndToCode(String fromCode, String toCode);

    /** Who liked this profile (most recent first) — owner-only view. */
    List<ProfileLike> findByToCodeOrderByIdDesc(String toCode);
}
