package com.example.login.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.ProfileSummary;
import com.example.login.dto.SearchCriteria;
import com.example.login.entity.Registration;
import com.example.login.service.RegistrationService;

/**
 * Partner-search API backing the "Find Your Life Partner" form.
 */
@RestController
@RequestMapping("/api/profiles")
@CrossOrigin
public class ProfileSearchController {

    private final RegistrationService registrationService;

    public ProfileSearchController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /** Query params bind to SearchCriteria by name (lookingFor, ageFrom, heightFromInches, ...). */
    @GetMapping("/search")
    public List<ProfileSummary> search(SearchCriteria criteria) {
        return registrationService.search(criteria);
    }

    /** Full profile detail by code (email & mobile excluded). For the View Profile popup. */
    @GetMapping("/{code}")
    public ResponseEntity<Registration> detail(@PathVariable String code,
                                               @RequestParam(value = "viewerCode", required = false) String viewerCode) {
        Registration r = registrationService.getPublicDetail(code, viewerCode);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }
}
