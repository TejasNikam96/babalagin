package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

/** Step 1 of the enroll form. Embedded into {@link Registration}. */
@Embeddable
public class Personal {

    @NotBlank(message = "First name is required")
    @Column(name = "p_first_name")
    private String firstName;

    @Column(name = "p_middle_name")
    private String middleName;

    @NotBlank(message = "Last name is required")
    @Column(name = "p_last_name")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "A valid email is required")
    @Column(name = "p_email")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Column(name = "p_mobile")
    private String mobile;

    /** Profile type used by search: "Groom" or "Bride". */
    @Column(name = "p_gender")
    private String gender;

    /** Community used by search, e.g. Marathi / Maratha. */
    @Column(name = "p_community")
    private String community;

    /** Height in total inches (feet*12 + inches), for range search. */
    @Column(name = "p_height_total_inches")
    private Integer heightTotalInches;

    @Column(name = "p_dob_day")
    private String dobDay;

    @Column(name = "p_dob_month")
    private String dobMonth;

    @Column(name = "p_dob_year")
    private String dobYear;

    @Column(name = "p_sub_caste")
    private String subCaste;

    @Column(name = "p_marital_status")
    private String maritalStatus;

    @Column(name = "p_height_feet")
    private String heightFeet;

    @Column(name = "p_height_inches")
    private String heightInches;

    @Column(name = "p_weight")
    private String weight;

    @Column(name = "p_blood_group")
    private String bloodGroup;

    @Column(name = "p_complexion")
    private String complexion;

    @Column(name = "p_physical_disability")
    private String physicalDisability;

    @Column(name = "p_disability_details")
    private String disabilityDetails;

    @Column(name = "p_diet")
    private String diet;

    @Column(name = "p_spectacles")
    private String spectacles;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCommunity() { return community; }
    public void setCommunity(String community) { this.community = community; }

    public Integer getHeightTotalInches() { return heightTotalInches; }
    public void setHeightTotalInches(Integer heightTotalInches) { this.heightTotalInches = heightTotalInches; }

    public String getDobDay() { return dobDay; }
    public void setDobDay(String dobDay) { this.dobDay = dobDay; }

    public String getDobMonth() { return dobMonth; }
    public void setDobMonth(String dobMonth) { this.dobMonth = dobMonth; }

    public String getDobYear() { return dobYear; }
    public void setDobYear(String dobYear) { this.dobYear = dobYear; }

    public String getSubCaste() { return subCaste; }
    public void setSubCaste(String subCaste) { this.subCaste = subCaste; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getHeightFeet() { return heightFeet; }
    public void setHeightFeet(String heightFeet) { this.heightFeet = heightFeet; }

    public String getHeightInches() { return heightInches; }
    public void setHeightInches(String heightInches) { this.heightInches = heightInches; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getComplexion() { return complexion; }
    public void setComplexion(String complexion) { this.complexion = complexion; }

    public String getPhysicalDisability() { return physicalDisability; }
    public void setPhysicalDisability(String physicalDisability) { this.physicalDisability = physicalDisability; }

    public String getDisabilityDetails() { return disabilityDetails; }
    public void setDisabilityDetails(String disabilityDetails) { this.disabilityDetails = disabilityDetails; }

    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }

    public String getSpectacles() { return spectacles; }
    public void setSpectacles(String spectacles) { this.spectacles = spectacles; }
}
