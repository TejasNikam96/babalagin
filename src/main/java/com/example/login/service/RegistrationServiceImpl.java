package com.example.login.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.RegistrationRequest;
import com.example.login.entity.Registration;
import com.example.login.exception.ResourceNotFoundException;
import com.example.login.repository.RegistrationRepository;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationServiceImpl.class);

    private final RegistrationRepository repository;
    private final NotificationService notificationService;
    private final DocumentService documentService;
    private final com.example.login.repository.RegistrationTempRepository tempRepository;

    public RegistrationServiceImpl(RegistrationRepository repository, NotificationService notificationService,
                                   DocumentService documentService,
                                   com.example.login.repository.RegistrationTempRepository tempRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.documentService = documentService;
        this.tempRepository = tempRepository;
    }

    @Override
    @Transactional
    public com.example.login.entity.RegistrationTemp saveTemp(RegistrationRequest request) {
        com.example.login.entity.Personal p = request.getPersonal();
        String email = (p != null && p.getEmail() != null) ? p.getEmail().trim() : null;
        // Upsert by email so repeated "Next" clicks don't pile up duplicate drafts.
        com.example.login.entity.RegistrationTemp temp = null;
        if (email != null && !email.isEmpty()) {
            java.util.List<com.example.login.entity.RegistrationTemp> existing =
                tempRepository.findByPersonalEmail(email);
            if (!existing.isEmpty()) {
                temp = existing.get(0);
            }
        }
        if (temp == null) {
            temp = new com.example.login.entity.RegistrationTemp();
        }
        temp.setPersonal(p);
        com.example.login.entity.RegistrationTemp saved = tempRepository.save(temp);
        log.info("Saved personal-details draft to registrations_temp: id={}", saved.getId());
        return saved;
    }

    /** Build a ProfileSummary with its profile photo (from the documents table). */
    private com.example.login.dto.ProfileSummary toSummary(Registration r) {
        com.example.login.dto.ProfileSummary ps = com.example.login.dto.ProfileSummary.from(r);
        ps.setPhoto(documentService.getProfileImageDataUrl(ps.getRegistrationCode()));
        return ps;
    }

    @Override
    @Transactional
    public Registration register(RegistrationRequest request) {
        Registration entity = new Registration();
        // The form sections are reused as embeddable value objects, so mapping
        // the request to the entity is a direct copy of each section.
        com.example.login.entity.Personal p = request.getPersonal();
        if (p != null) {
            // Derive a numeric height (total inches) for range search.
            Integer total = toInches(p.getHeightFeet(), p.getHeightInches());
            if (total != null) {
                p.setHeightTotalInches(total);
            }
        }
        entity.setPersonal(p);
        entity.setHoroscope(request.getHoroscope());
        entity.setEducation(request.getEducation());
        entity.setAddress(request.getAddress());
        entity.setFamily(request.getFamily());
        entity.setExpectation(request.getExpectation());

        // First save to obtain the generated id, then derive the login code.
        Registration saved = repository.save(entity);
        saved.setRegistrationCode(String.format("REG%05d", saved.getId()));
        Registration result = repository.save(saved);
        log.info("Registration created: id={}, code={}", result.getId(), result.getRegistrationCode());

        // Profile fully created -> remove any personal-details draft for this email.
        if (p != null && p.getEmail() != null && !p.getEmail().trim().isEmpty()) {
            try {
                tempRepository.deleteByPersonalEmail(p.getEmail().trim());
                log.info("Cleared registrations_temp draft for completed registration code={}",
                        result.getRegistrationCode());
            } catch (Exception ex) {
                log.warn("Could not clear registrations_temp draft: {}", ex.getMessage());
            }
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Registration> login(String registrationId, String email) {
        if (registrationId == null || email == null) {
            log.warn("Login attempt with missing registrationId or email");
            return Optional.empty();
        }
        Optional<Registration> match = repository.findByRegistrationCodeAndEmail(registrationId.trim(), email.trim());
        if (match.isPresent()) {
            log.info("Login credentials matched for code={}", registrationId.trim());
        } else {
            log.warn("Login credentials did not match for code={}", registrationId.trim());
        }
        return match;
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.example.login.dto.ProfileSummary> search(com.example.login.dto.SearchCriteria c) {
        // Convert the age range to a birth-year range (string compare on 4-digit years).
        int currentYear = java.time.Year.now().getValue();
        String yearFrom = c.getAgeTo() != null ? String.valueOf(currentYear - c.getAgeTo()) : null;
        String yearTo = c.getAgeFrom() != null ? String.valueOf(currentYear - c.getAgeFrom()) : null;

        log.debug("Profile search: lookingFor={}, maritalStatus={}, location={}, ageFrom={}, ageTo={}",
                c.getLookingFor(), c.getMaritalStatus(), c.getLocation(), c.getAgeFrom(), c.getAgeTo());
        return repository.search(
                nz(c.getLookingFor()),
                nz(c.getMaritalStatus()),
                nz(c.getEducation()),
                nz(c.getOccupationType()),
                nz(c.getIncomeRange()),
                nz(c.getLocation()),
                nz(c.getNativePlace()),
                nz(c.getCommunity()),
                nz(c.getMangalik()),
                yearFrom,
                yearTo,
                c.getHeightFromInches(),
                c.getHeightToInches()
            ).stream()
            .map(this::toSummary)
            .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> adminSearch(String gender, String isActive, String createdFrom, String createdTo) {
        java.time.LocalDateTime from = null;
        java.time.LocalDateTime to = null;
        try {
            if (createdFrom != null && !createdFrom.trim().isEmpty()) {
                from = java.time.LocalDate.parse(createdFrom.trim()).atStartOfDay();
            }
            if (createdTo != null && !createdTo.trim().isEmpty()) {
                to = java.time.LocalDate.parse(createdTo.trim()).atTime(23, 59, 59);
            }
        } catch (java.time.format.DateTimeParseException e) {
            // ignore unparseable dates -> treated as no filter
        }
        return repository.adminSearch(nz(gender), nz(isActive), from, to);
    }

    @Override
    @Transactional
    public Registration adminUpdate(Long id, Registration incoming) {
        Registration existing = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id " + id));

        existing.setRegistrationCode(incoming.getRegistrationCode());

        com.example.login.entity.Personal p = incoming.getPersonal();
        if (p != null) {
            Integer total = toInches(p.getHeightFeet(), p.getHeightInches());
            p.setHeightTotalInches(total);
        }
        existing.setPersonal(p);
        existing.setHoroscope(incoming.getHoroscope());
        existing.setEducation(incoming.getEducation());
        existing.setAddress(incoming.getAddress());
        existing.setFamily(incoming.getFamily());
        existing.setExpectation(incoming.getExpectation());
        existing.setIsActive(incoming.getIsActive());
        existing.setSuccessStory(incoming.getSuccessStory());
        existing.setPartnerId(incoming.getPartnerId());

        Registration result = repository.save(existing);
        log.info("Admin updated registration: id={}, code={}", result.getId(), result.getRegistrationCode());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Registration getPublicDetail(String registrationCode, String viewerCode) {
        Registration r = repository.findByRegistrationCode(registrationCode).orElse(null);
        if (r != null && r.getPersonal() != null) {
            // Email and mobile are never exposed publicly -- even to an accepted
            // connection. Connected users communicate via the in-app messaging
            // feature instead. (readOnly tx -> these nulls are not flushed.)
            r.getPersonal().setEmail(null);
            r.getPersonal().setMobile(null);
        }
        return r;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.example.login.dto.SuccessStory> getSuccessStories() {
        List<com.example.login.dto.SuccessStory> out = new java.util.ArrayList<>();
        for (Registration r : repository.findBySuccessStory("Y")) {
            Registration partner = null;
            if (r.getPartnerId() != null && !r.getPartnerId().trim().isEmpty()) {
                partner = repository.findByRegistrationCode(r.getPartnerId().trim()).orElse(null);
            }
            // De-duplicate couples: when both are flagged, emit only from the smaller code.
            boolean partnerAlsoStory = partner != null && "Y".equalsIgnoreCase(partner.getSuccessStory());
            if (partnerAlsoStory && r.getRegistrationCode() != null && partner.getRegistrationCode() != null
                    && r.getRegistrationCode().compareTo(partner.getRegistrationCode()) > 0) {
                continue;
            }
            out.add(new com.example.login.dto.SuccessStory(
                toSummary(r),
                partner != null ? toSummary(partner) : null));
        }
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.Map<String, Long> getDashboardStats() {
        java.util.Map<String, Long> m = new java.util.LinkedHashMap<>();
        m.put("drafts", tempRepository.count());
        m.put("active", repository.countByIsActive("Y"));
        m.put("inactive", repository.countByIsActive("N"));
        m.put("successStories", (long) getSuccessStories().size());
        m.put("totalRegistrations", repository.count());
        return m;
    }

    /** Blank -> null so the query treats it as "no filter". */
    private String nz(String s) {
        return (s == null || s.trim().isEmpty()) ? null : s.trim();
    }

    /** feet + inches strings -> total inches, or null if not parseable. */
    private Integer toInches(String feet, String inches) {
        try {
            if (feet == null || feet.trim().isEmpty()) {
                return null;
            }
            int f = Integer.parseInt(feet.trim());
            int i = (inches == null || inches.trim().isEmpty()) ? 0 : Integer.parseInt(inches.trim());
            return f * 12 + i;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Registration getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getAll() {
        return repository.findAll();
    }
}
