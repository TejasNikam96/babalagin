package com.example.login.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.example.login.entity.Address;
import com.example.login.entity.Education;
import com.example.login.entity.Expectation;
import com.example.login.entity.Family;
import com.example.login.entity.Horoscope;
import com.example.login.entity.Personal;

/**
 * Request body for {@code POST /api/registration}.
 *
 * <p>Mirrors the nested JSON the React form sends (the Redux {@code formData}
 * object). The section classes are reused from the entity package — they are
 * plain POJOs as far as Jackson is concerned, and JPA-aware when embedded in
 * {@link com.example.login.entity.Registration}.</p>
 */
public class RegistrationRequest {

    @NotNull(message = "personal section is required")
    @Valid
    private Personal personal;

    private Horoscope horoscope;
    private Education education;
    private Address address;
    private Family family;
    private Expectation expectation;

    public Personal getPersonal() { return personal; }
    public void setPersonal(Personal personal) { this.personal = personal; }

    public Horoscope getHoroscope() { return horoscope; }
    public void setHoroscope(Horoscope horoscope) { this.horoscope = horoscope; }

    public Education getEducation() { return education; }
    public void setEducation(Education education) { this.education = education; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public Family getFamily() { return family; }
    public void setFamily(Family family) { this.family = family; }

    public Expectation getExpectation() { return expectation; }
    public void setExpectation(Expectation expectation) { this.expectation = expectation; }
}
