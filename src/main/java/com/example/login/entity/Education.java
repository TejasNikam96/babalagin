package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/** Step 3 of the enroll form. Embedded into {@link Registration}. */
@Embeddable
public class Education {

    @Column(name = "edu_highest_education")
    private String highestEducation;

    @Column(name = "edu_field_of_study")
    private String fieldOfStudy;

    @Column(name = "edu_institution")
    private String institution;

    @Column(name = "edu_occupation")
    private String occupation;

    /** Occupation category used by search, e.g. Private Service / Business. */
    @Column(name = "edu_occupation_type")
    private String occupationType;

    @Column(name = "edu_employer")
    private String employer;

    @Column(name = "edu_annual_income")
    private String annualIncome;

    public String getHighestEducation() { return highestEducation; }
    public void setHighestEducation(String highestEducation) { this.highestEducation = highestEducation; }

    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getOccupationType() { return occupationType; }
    public void setOccupationType(String occupationType) { this.occupationType = occupationType; }

    public String getEmployer() { return employer; }
    public void setEmployer(String employer) { this.employer = employer; }

    public String getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(String annualIncome) { this.annualIncome = annualIncome; }
}
