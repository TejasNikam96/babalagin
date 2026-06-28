package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/** Step 5 of the enroll form. Embedded into {@link Registration}. */
@Embeddable
public class Family {

    @Column(name = "fam_father_name")
    private String fatherName;

    @Column(name = "fam_father_occupation")
    private String fatherOccupation;

    @Column(name = "fam_mother_name")
    private String motherName;

    @Column(name = "fam_mother_occupation")
    private String motherOccupation;

    @Column(name = "fam_siblings")
    private String siblings;

    @Column(name = "fam_family_type")
    private String familyType;

    @Column(name = "fam_family_status")
    private String familyStatus;

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getFatherOccupation() { return fatherOccupation; }
    public void setFatherOccupation(String fatherOccupation) { this.fatherOccupation = fatherOccupation; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getMotherOccupation() { return motherOccupation; }
    public void setMotherOccupation(String motherOccupation) { this.motherOccupation = motherOccupation; }

    public String getSiblings() { return siblings; }
    public void setSiblings(String siblings) { this.siblings = siblings; }

    public String getFamilyType() { return familyType; }
    public void setFamilyType(String familyType) { this.familyType = familyType; }

    public String getFamilyStatus() { return familyStatus; }
    public void setFamilyStatus(String familyStatus) { this.familyStatus = familyStatus; }
}
