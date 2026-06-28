package com.example.login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.login.entity.RegistrationTemp;

/** DAO for {@link RegistrationTemp} (personal-details drafts). */
@Repository
public interface RegistrationTempRepository extends JpaRepository<RegistrationTemp, Long> {

    /** Drafts matching an email (embedded Personal.email -> p_email column). */
    List<RegistrationTemp> findByPersonalEmail(String email);

    void deleteByPersonalEmail(String email);
}
