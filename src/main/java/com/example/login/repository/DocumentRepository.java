package com.example.login.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.login.entity.Document;

/** DAO for {@link Document}. */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /** The most recent document of a given type for a user (active one). */
    Optional<Document> findFirstByRegistrationCodeAndDocTypeOrderByIdDesc(String registrationCode, String docType);

    /** All documents for a user, newest first. */
    List<Document> findByRegistrationCodeOrderByIdDesc(String registrationCode);

    /** Count of profile images for a user (cheap: does not load the base64 data). */
    @Query("select count(d) from Document d where d.registrationCode = :code "
         + "and (d.docType is null or d.docType = 'profileImage')")
    long countImages(@Param("code") String code);
}
