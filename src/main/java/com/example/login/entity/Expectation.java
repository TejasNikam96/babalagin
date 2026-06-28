package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/** Step 6 of the enroll form (partner preferences). Embedded into {@link Registration}. */
@Embeddable
public class Expectation {

    @Column(name = "exp_age_from")
    private String ageFrom;

    @Column(name = "exp_age_to")
    private String ageTo;

    @Column(name = "exp_height_from")
    private String heightFrom;

    @Column(name = "exp_height_to")
    private String heightTo;

    @Column(name = "exp_education")
    private String education;

    @Column(name = "exp_occupation")
    private String occupation;

    @Column(name = "exp_location")
    private String location;

    @Column(name = "exp_other_preferences", length = 1000)
    private String otherPreferences;

    public String getAgeFrom() { return ageFrom; }
    public void setAgeFrom(String ageFrom) { this.ageFrom = ageFrom; }

    public String getAgeTo() { return ageTo; }
    public void setAgeTo(String ageTo) { this.ageTo = ageTo; }

    public String getHeightFrom() { return heightFrom; }
    public void setHeightFrom(String heightFrom) { this.heightFrom = heightFrom; }

    public String getHeightTo() { return heightTo; }
    public void setHeightTo(String heightTo) { this.heightTo = heightTo; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getOtherPreferences() { return otherPreferences; }
    public void setOtherPreferences(String otherPreferences) { this.otherPreferences = otherPreferences; }
}
