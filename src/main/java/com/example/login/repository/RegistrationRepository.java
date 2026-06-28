package com.example.login.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.login.entity.Registration;

/**
 * DAO for {@link Registration}. Spring Data JPA generates the implementation,
 * providing save/find/delete and paging out of the box.
 */
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    /** Profile-login lookup: exact registration code + case-insensitive email. */
    @Query("select r from Registration r "
         + "where r.registrationCode = :code "
         + "and lower(r.personal.email) = lower(:email)")
    Optional<Registration> findByRegistrationCodeAndEmail(@Param("code") String code,
                                                          @Param("email") String email);

    @Query("select count(r) > 0 from Registration r where lower(r.personal.email) = lower(:email)")
    boolean existsByEmail(@Param("email") String email);

    /** Count registrations by active flag ("Y"/"N") for the admin dashboard. */
    long countByIsActive(String isActive);

    @Query("select r from Registration r where lower(r.personal.email) = lower(:email)")
    Optional<Registration> findByEmail(@Param("email") String email);

    Optional<Registration> findByRegistrationCode(String registrationCode);

    List<Registration> findBySuccessStory(String successStory);

    /** Admin profiles filter: gender + isActive + createdDate range (each optional). */
    @Query("select r from Registration r where "
         + "(:gender is null or lower(r.personal.gender) = lower(:gender)) and "
         + "(:isActive is null or r.isActive = :isActive) and "
         + "(:from is null or r.createdDate >= :from) and "
         + "(:to is null or r.createdDate <= :to) "
         + "order by r.id desc")
    List<Registration> adminSearch(@Param("gender") String gender,
                                   @Param("isActive") String isActive,
                                   @Param("from") LocalDateTime from,
                                   @Param("to") LocalDateTime to);

    /**
     * Partner search. Any parameter that is null (or 'Any' for education) is
     * ignored. Age is matched via the birth-year range computed by the caller.
     */
    @Query("select r from Registration r where "
         + "(:gender is null or lower(r.personal.gender) = lower(:gender)) and "
         + "(:maritalStatus is null or :maritalStatus = 'Any' or lower(r.personal.maritalStatus) = lower(:maritalStatus)) and "
         + "(:education is null or :education = 'Any' or lower(r.education.highestEducation) = lower(:education)) and "
         + "(:occupationType is null or :occupationType = 'Any' or lower(r.education.occupationType) = lower(:occupationType)) and "
         + "(:incomeRange is null or :incomeRange = 'Any' or lower(r.education.annualIncome) = lower(:incomeRange)) and "
         + "(:city is null or :city = 'Any' or lower(r.address.city) = lower(:city)) and "
         + "(:nativePlace is null or :nativePlace = 'Any' or lower(r.address.nativePlace) = lower(:nativePlace)) and "
         + "(:community is null or :community = 'Any' or lower(r.personal.community) = lower(:community)) and "
         + "(:mangalik is null or lower(r.horoscope.manglik) = lower(:mangalik)) and "
         + "(:yearFrom is null or r.personal.dobYear >= :yearFrom) and "
         + "(:yearTo is null or r.personal.dobYear <= :yearTo) and "
         + "(:heightFrom is null or r.personal.heightTotalInches >= :heightFrom) and "
         + "(:heightTo is null or r.personal.heightTotalInches <= :heightTo) "
         + "order by r.id desc")
    List<Registration> search(@Param("gender") String gender,
                              @Param("maritalStatus") String maritalStatus,
                              @Param("education") String education,
                              @Param("occupationType") String occupationType,
                              @Param("incomeRange") String incomeRange,
                              @Param("city") String city,
                              @Param("nativePlace") String nativePlace,
                              @Param("community") String community,
                              @Param("mangalik") String mangalik,
                              @Param("yearFrom") String yearFrom,
                              @Param("yearTo") String yearTo,
                              @Param("heightFrom") Integer heightFrom,
                              @Param("heightTo") Integer heightTo);
}
