package com.example.login.service;

import java.util.List;
import java.util.Optional;

import com.example.login.dto.ProfileSummary;
import com.example.login.dto.RegistrationRequest;
import com.example.login.dto.SearchCriteria;
import com.example.login.entity.Registration;

/** Business operations for matrimonial registrations. */
public interface RegistrationService {

    /** Persists a new registration and returns the saved entity (with generated id). */
    Registration register(RegistrationRequest request);

    /** Returns a single registration by id, or throws if not found. */
    Registration getById(Long id);

    /** Returns all registrations. */
    List<Registration> getAll();

    /**
     * Validates profile-login credentials against the registrations table:
     * matches the registration code and email (case-insensitive on email).
     * Returns the matching registration, or empty if no match.
     */
    Optional<Registration> login(String registrationId, String email);

    /**
     * Partner search. Blank/"Any" filters are ignored. {@code lookingFor} matches
     * the profile gender ("Groom"/"Bride"); age and height are matched as ranges.
     */
    List<ProfileSummary> search(SearchCriteria criteria);

    /** Admin listing with optional gender + isActive + created-date-range filters. */
    List<Registration> adminSearch(String gender, String isActive, String createdFrom, String createdTo);

    /** Admin edit: overwrite all editable fields of an existing registration. */
    Registration adminUpdate(Long id, Registration incoming);

    /**
     * Public profile detail by code. Email & mobile are removed unless the viewer
     * is accepted-connected with this profile. Null if not found.
     */
    Registration getPublicDetail(String registrationCode, String viewerCode);

    /** Success stories: registrations flagged successStory=Y, paired by partnerId. */
    List<com.example.login.dto.SuccessStory> getSuccessStories();
}
