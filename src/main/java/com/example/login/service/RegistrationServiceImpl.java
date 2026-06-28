package com.example.login.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.RegistrationRequest;
import com.example.login.entity.Registration;
import com.example.login.exception.ResourceNotFoundException;
import com.example.login.repository.RegistrationRepository;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository repository;
    private final NotificationService notificationService;
    private final DocumentService documentService;

    public RegistrationServiceImpl(RegistrationRepository repository, NotificationService notificationService,
                                   DocumentService documentService) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.documentService = documentService;
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
        return repository.save(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Registration> login(String registrationId, String email) {
        if (registrationId == null || email == null) {
            return Optional.empty();
        }
        return repository.findByRegistrationCodeAndEmail(registrationId.trim(), email.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.example.login.dto.ProfileSummary> search(com.example.login.dto.SearchCriteria c) {
        // Convert the age range to a birth-year range (string compare on 4-digit years).
        int currentYear = java.time.Year.now().getValue();
        String yearFrom = c.getAgeTo() != null ? String.valueOf(currentYear - c.getAgeTo()) : null;
        String yearTo = c.getAgeFrom() != null ? String.valueOf(currentYear - c.getAgeFrom()) : null;

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

        return repository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public Registration getPublicDetail(String registrationCode, String viewerCode) {
        Registration r = repository.findByRegistrationCode(registrationCode).orElse(null);
        if (r != null && r.getPersonal() != null) {
            // Contact details are visible only to an accepted-connected viewer.
            boolean connected = viewerCode != null && notificationService.areConnected(viewerCode, registrationCode);
            if (!connected) {
                r.getPersonal().setEmail(null);   // readOnly tx -> not flushed
                r.getPersonal().setMobile(null);
            }
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
