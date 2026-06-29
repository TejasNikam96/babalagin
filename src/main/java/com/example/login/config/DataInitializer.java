package com.example.login.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.login.entity.Address;
import com.example.login.entity.AppUser;
import com.example.login.entity.Document;
import com.example.login.entity.Education;
import com.example.login.entity.Expectation;
import com.example.login.entity.Family;
import com.example.login.entity.Horoscope;
import com.example.login.entity.Personal;
import com.example.login.entity.Registration;
import com.example.login.repository.AppUserRepository;
import com.example.login.repository.DocumentRepository;
import com.example.login.repository.RegistrationRepository;

/**
 * Seeds an admin account on startup, since there is no self-service signup.
 * Credentials are configurable via application properties; defaults are
 * admin / admin123.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner seedAdmin(AppUserRepository userRepository,
                                       PasswordEncoder encoder,
                                       @Value("${app.admin.username:admin}") String adminUsername,
                                       @Value("${app.admin.password:admin123}") String adminPassword) {
        return args -> {
            if (!userRepository.existsByUsername(adminUsername)) {
                AppUser admin = new AppUser(adminUsername, encoder.encode(adminPassword), "ADMIN");
                userRepository.save(admin);
                log.info("Seeded admin user '{}' into the users table.", adminUsername);
            } else {
                log.info("Admin user '{}' already exists; skipping seed.", adminUsername);
            }
        };
    }

    /**
     * Seeds/updates 10 dummy profiles (upsert by email) with all searchable
     * fields so the "Find Your Life Partner" / Matching Search filters work.
     */
    @Bean
    public CommandLineRunner seedDummyProfiles(RegistrationRepository repo, DocumentRepository docRepo) {
        return args -> {
            // {first,last,email,mobile,gender,dobYear,maritalStatus,education,occupation,
            //  occupationType,income,city,nativePlace,community,manglik,heightFeet,heightInches}
            String[][] data = {
                {"Sai","Joshi","dummy1@example.com","9000000001","Bride","2001","Unmarried","Graduate","Teacher","Private Service","4 - 8 Lakh","Pune","PUNE","Marathi","No","5","2"},
                {"Priya","Patil","dummy2@example.com","9000000002","Bride","1999","Unmarried","Post Graduate","Analyst","Private Service","8 - 16 Lakh","Mumbai","MUMBAI","Maratha","Yes","5","4"},
                {"Anjali","Deshmukh","dummy3@example.com","9000000003","Bride","2002","Unmarried","Graduate","Software Engineer","Private Service","8 - 16 Lakh","Pune","PUNE","Deshastha","No","5","3"},
                {"Sneha","Kulkarni","dummy4@example.com","9000000004","Bride","1997","Unmarried","Post Graduate","Physician","Professional","16 - 25 Lakh","Nashik","NASHIK","Chitpavan","Yes","5","5"},
                {"Pooja","More","dummy5@example.com","9000000005","Bride","2000","Unmarried","Post Graduate","Manager","Business","8 - 16 Lakh","Pune","KOLHAPUR","Kunbi","No","5","1"},
                {"Rahul","Joshi","dummy6@example.com","9000000006","Groom","1996","Unmarried","Graduate","Software Engineer","Private Service","8 - 16 Lakh","Pune","PUNE","Marathi","No","5","9"},
                {"Amit","Patil","dummy7@example.com","9000000007","Groom","1995","Unmarried","Post Graduate","Product Manager","Private Service","16 - 25 Lakh","Mumbai","MUMBAI","Maratha","Yes","5","11"},
                {"Vikram","Deshpande","dummy8@example.com","9000000008","Groom","1998","Unmarried","Post Graduate","Surgeon","Professional","25 Lakh & Above","Pune","PUNE","Deshastha","No","6","0"},
                {"Nikhil","Rao","dummy9@example.com","9000000009","Groom","1999","Unmarried","Graduate","Businessman","Business","8 - 16 Lakh","Nagpur","NAGPUR","Marathi","Yes","5","8"},
                {"Sandeep","Jadhav","dummy10@example.com","9000000010","Groom","1994","Unmarried","Graduate","Accountant","Self Employed","16 - 25 Lakh","Kolhapur","KOLHAPUR","Kunbi","No","5","10"},
                {"Kiran","Patil","dummy11@example.com","9000000011","Groom","1992","Divorced","Graduate","Businessman","Business","8 - 16 Lakh","Pune","PUNE","Marathi","No","5","10"},
                {"Meena","Joshi","dummy12@example.com","9000000012","Bride","1996","Divorced","Post Graduate","Teacher","Private Service","4 - 8 Lakh","Mumbai","MUMBAI","Maratha","No","5","3"},
            };

            int upserted = 0;
            for (String[] d : data) {
                Registration r = repo.findByEmail(d[2]).orElseGet(Registration::new);
                boolean isNew = r.getId() == null;

                Personal p = new Personal();
                p.setFirstName(d[0]);
                p.setLastName(d[1]);
                p.setEmail(d[2]);
                p.setMobile(d[3]);
                p.setGender(d[4]);
                p.setDobDay("1");
                p.setDobMonth("1");
                p.setDobYear(d[5]);
                p.setMaritalStatus(d[6]);
                p.setCommunity(d[13]);
                int feet = Integer.parseInt(d[15]);
                int inch = Integer.parseInt(d[16]);
                p.setHeightFeet(d[15]);
                p.setHeightInches(d[16]);
                p.setHeightTotalInches(feet * 12 + inch);
                r.setPersonal(p);

                Education e = new Education();
                e.setHighestEducation(d[7]);
                e.setOccupation(d[8]);
                e.setOccupationType(d[9]);
                e.setAnnualIncome(d[10]);
                r.setEducation(e);

                Address a = new Address();
                a.setCountry("India");
                a.setState("Maharashtra");
                a.setCity(d[11]);
                a.setNativePlace(d[12]);
                r.setAddress(a);

                Horoscope h = new Horoscope();
                h.setManglik(d[14]);
                r.setHoroscope(h);

                if (r.getFamily() == null) r.setFamily(new Family());
                if (r.getExpectation() == null) r.setExpectation(new Expectation());

                // Ensure the new audit/flag columns are populated (existing rows
                // won't fire @PrePersist on an update).
                if (r.getIsActive() == null) r.setIsActive("Y");
                if (r.getSuccessStory() == null) r.setSuccessStory("N");
                if (r.getCreatedDate() == null) r.setCreatedDate(java.time.LocalDateTime.now());

                Registration saved = repo.save(r);
                if (isNew) {
                    saved.setRegistrationCode(String.format("REG%05d", saved.getId()));
                    repo.save(saved);
                }
                seedPhotos(docRepo, saved.getRegistrationCode(), d[4]);
                upserted++;
            }
            log.info("Seeded/updated {} dummy profiles.", upserted);

            // Mark a couple of pairs as success stories (linked via partnerId).
            linkSuccessCouple(repo, "dummy1@example.com", "dummy6@example.com");
            linkSuccessCouple(repo, "dummy2@example.com", "dummy7@example.com");

            // Give every profile a payment-expiry date if it doesn't have one yet.
            backfillRenewalDates(repo);
        };
    }

    private final java.util.Random rnd = new java.util.Random();

    /**
     * Sets a random payment/renewal expiry date for any profile whose expiry is
     * empty. Dates are spread from the start of the current month over ~5 months,
     * so several land in the current month (idempotent: never overwrites an
     * existing date).
     */
    private void backfillRenewalDates(RegistrationRepository repo) {
        java.time.LocalDateTime monthStart = java.time.LocalDate.now().withDayOfMonth(1).atStartOfDay();
        int updated = 0;
        for (Registration r : repo.findAll()) {
            if (r.getRenewedUntil() == null) {
                r.setRenewedUntil(monthStart.plusDays(rnd.nextInt(160)).plusHours(rnd.nextInt(24)));
                repo.save(r);
                updated++;
            }
        }
        if (updated > 0) {
            log.info("Backfilled random payment-expiry dates for {} profile(s).", updated);
        }
    }

    /** Rotating offset so different dummy users get different photos from the pool. */
    private int photoOffset = 0;

    /**
     * Seeds 3 gender-matched royalty-free portrait photos (base64) into the
     * documents table for a profile. Removes any old gray SVG placeholder, and
     * is idempotent (skips if the profile already has real photos). Photo files
     * live in src/main/resources/seed-photos (downloaded from randomuser.me,
     * which are free to use).
     */
    private void seedPhotos(DocumentRepository docRepo, String code, String gender) {
        if (code == null) {
            return;
        }
        java.util.List<Document> existing = docRepo.findByRegistrationCodeOrderByIdDesc(code).stream()
            .filter(d -> d.getDocType() == null || "profileImage".equalsIgnoreCase(d.getDocType()))
            .collect(java.util.stream.Collectors.toList());

        // Remove the legacy gray SVG placeholder avatars.
        for (Document d : existing) {
            if ("image/svg+xml".equalsIgnoreCase(d.getContentType())) {
                docRepo.delete(d);
            }
        }
        long realPhotos = existing.stream()
            .filter(d -> !"image/svg+xml".equalsIgnoreCase(d.getContentType())).count();
        if (realPhotos >= 2) {
            return; // already has real photos
        }

        String prefix = "Bride".equalsIgnoreCase(gender) ? "women" : "men";
        int offset = photoOffset++;
        int added = 0;
        for (int k = 0; k < 3; k++) {
            int idx = ((offset * 3 + k) % 6) + 1; // pool of 6 images per gender
            byte[] bytes = readClasspathBytes("seed-photos/" + prefix + "_" + idx + ".jpg");
            if (bytes == null) continue;
            Document doc = new Document();
            doc.setRegistrationCode(code);
            doc.setDocType("profileImage");
            doc.setFileName(prefix + "_" + idx + ".jpg");
            doc.setContentType("image/jpeg");
            doc.setDataBase64(java.util.Base64.getEncoder().encodeToString(bytes));
            docRepo.save(doc);
            added++;
        }
        log.info("Seeded {} photo(s) for {}", added, code);
    }

    private byte[] readClasspathBytes(String path) {
        try (java.io.InputStream is = new org.springframework.core.io.ClassPathResource(path).getInputStream()) {
            return org.springframework.util.StreamUtils.copyToByteArray(is);
        } catch (Exception e) {
            log.warn("Seed photo not found on classpath: {}", path);
            return null;
        }
    }

    /** Links two profiles as a success-story couple (successStory=Y + partnerId cross). */
    private void linkSuccessCouple(RegistrationRepository repo, String emailA, String emailB) {
        Registration a = repo.findByEmail(emailA).orElse(null);
        Registration b = repo.findByEmail(emailB).orElse(null);
        if (a == null || b == null) {
            return;
        }
        a.setSuccessStory("Y");
        a.setPartnerId(b.getRegistrationCode());
        b.setSuccessStory("Y");
        b.setPartnerId(a.getRegistrationCode());
        repo.save(a);
        repo.save(b);
    }
}
