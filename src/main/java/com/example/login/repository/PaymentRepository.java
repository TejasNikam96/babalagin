package com.example.login.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.login.entity.Payment;

/** DAO for {@link Payment}. */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByRegistrationId(String registrationId);
}
