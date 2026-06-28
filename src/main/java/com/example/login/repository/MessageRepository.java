package com.example.login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.login.entity.Message;

/** DAO for {@link Message}. */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /** Full conversation between two codes (either direction), oldest first. */
    @Query("SELECT m FROM Message m WHERE (m.fromCode = :a AND m.toCode = :b) "
         + "OR (m.fromCode = :b AND m.toCode = :a) ORDER BY m.id ASC")
    List<Message> findConversation(@Param("a") String a, @Param("b") String b);
}
