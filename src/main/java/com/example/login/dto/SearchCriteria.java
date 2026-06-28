package com.example.login.dto;

/**
 * Bound from the search query parameters (field names = query param names).
 * Any blank / "Any" value means "no filter on that field".
 */
public class SearchCriteria {

    private String lookingFor;       // Groom / Bride
    private String maritalStatus;    // Unmarried / Divorced
    private Integer ageFrom;
    private Integer ageTo;
    private Integer heightFromInches;
    private Integer heightToInches;
    private String mangalik;         // "Yes" to require mangalik
    private String education;
    private String occupationType;
    private String location;         // city
    private String incomeRange;
    private String nativePlace;
    private String community;

    public String getLookingFor() { return lookingFor; }
    public void setLookingFor(String lookingFor) { this.lookingFor = lookingFor; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public Integer getAgeFrom() { return ageFrom; }
    public void setAgeFrom(Integer ageFrom) { this.ageFrom = ageFrom; }

    public Integer getAgeTo() { return ageTo; }
    public void setAgeTo(Integer ageTo) { this.ageTo = ageTo; }

    public Integer getHeightFromInches() { return heightFromInches; }
    public void setHeightFromInches(Integer heightFromInches) { this.heightFromInches = heightFromInches; }

    public Integer getHeightToInches() { return heightToInches; }
    public void setHeightToInches(Integer heightToInches) { this.heightToInches = heightToInches; }

    public String getMangalik() { return mangalik; }
    public void setMangalik(String mangalik) { this.mangalik = mangalik; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getOccupationType() { return occupationType; }
    public void setOccupationType(String occupationType) { this.occupationType = occupationType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getIncomeRange() { return incomeRange; }
    public void setIncomeRange(String incomeRange) { this.incomeRange = incomeRange; }

    public String getNativePlace() { return nativePlace; }
    public void setNativePlace(String nativePlace) { this.nativePlace = nativePlace; }

    public String getCommunity() { return community; }
    public void setCommunity(String community) { this.community = community; }
}
