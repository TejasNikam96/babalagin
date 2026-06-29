package com.example.login.dto;

import java.time.Year;

import com.example.login.entity.Personal;
import com.example.login.entity.Registration;

/** A search-result profile card. */
public class ProfileSummary {

    private String registrationCode;
    private String photo; // profile image data URL (from documents table)
    private int photoCount; // number of photos (for the "multiple photos" badge)
    private String name;
    private String gender;
    private Integer age;
    private String height;
    private String mangalik;
    private String education;
    private String occupation;
    private String occupationType;
    private String incomeRange;
    private String city;
    private String nativePlace;
    private String community;
    private String maritalStatus;
    private String isActive; // "Y" / "N" -> UI shows a "Not Active" tag when "N"

    public static ProfileSummary from(Registration r) {
        ProfileSummary p = new ProfileSummary();
        p.registrationCode = r.getRegistrationCode();
        p.isActive = r.getIsActive();
        Personal per = r.getPersonal();
        if (per != null) {
            String first = per.getFirstName() != null ? per.getFirstName() : "";
            String last = per.getLastName() != null ? per.getLastName() : "";
            p.name = (first + " " + last).trim();
            p.gender = per.getGender();
            p.community = per.getCommunity();
            p.maritalStatus = per.getMaritalStatus();
            p.age = computeAge(per.getDobYear());
            p.height = formatHeight(per.getHeightTotalInches());
        }
        if (r.getHoroscope() != null) {
            p.mangalik = r.getHoroscope().getManglik();
        }
        if (r.getEducation() != null) {
            p.education = r.getEducation().getHighestEducation();
            p.occupation = r.getEducation().getOccupation();
            p.occupationType = r.getEducation().getOccupationType();
            p.incomeRange = r.getEducation().getAnnualIncome();
        }
        if (r.getAddress() != null) {
            p.city = r.getAddress().getCity();
            p.nativePlace = r.getAddress().getNativePlace();
        }
        return p;
    }

    private static String formatHeight(Integer totalInches) {
        if (totalInches == null) {
            return null;
        }
        return (totalInches / 12) + "'" + (totalInches % 12) + "\"";
    }

    private static Integer computeAge(String dobYear) {
        if (dobYear == null || !dobYear.matches("\\d{4}")) {
            return null;
        }
        return Year.now().getValue() - Integer.parseInt(dobYear);
    }

    public String getRegistrationCode() { return registrationCode; }
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    public int getPhotoCount() { return photoCount; }
    public void setPhotoCount(int photoCount) { this.photoCount = photoCount; }
    public String getName() { return name; }
    public String getGender() { return gender; }
    public Integer getAge() { return age; }
    public String getHeight() { return height; }
    public String getMangalik() { return mangalik; }
    public String getEducation() { return education; }
    public String getOccupation() { return occupation; }
    public String getOccupationType() { return occupationType; }
    public String getIncomeRange() { return incomeRange; }
    public String getCity() { return city; }
    public String getNativePlace() { return nativePlace; }
    public String getCommunity() { return community; }
    public String getMaritalStatus() { return maritalStatus; }
    public String getIsActive() { return isActive; }
}
