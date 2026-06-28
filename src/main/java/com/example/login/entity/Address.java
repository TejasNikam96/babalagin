package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/** Step 4 of the enroll form. Embedded into {@link Registration}. */
@Embeddable
public class Address {

    @Column(name = "addr_country")
    private String country;

    @Column(name = "addr_state")
    private String state;

    @Column(name = "addr_city")
    private String city;

    /** Native place used by search. */
    @Column(name = "addr_native_place")
    private String nativePlace;

    @Column(name = "addr_pincode")
    private String pincode;

    @Column(name = "addr_permanent", length = 1000)
    private String permanentAddress;

    @Column(name = "addr_current", length = 1000)
    private String currentAddress;

    @Column(name = "addr_same_as_permanent")
    private Boolean sameAsPermanent;

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getNativePlace() { return nativePlace; }
    public void setNativePlace(String nativePlace) { this.nativePlace = nativePlace; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getPermanentAddress() { return permanentAddress; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }

    public String getCurrentAddress() { return currentAddress; }
    public void setCurrentAddress(String currentAddress) { this.currentAddress = currentAddress; }

    public Boolean getSameAsPermanent() { return sameAsPermanent; }
    public void setSameAsPermanent(Boolean sameAsPermanent) { this.sameAsPermanent = sameAsPermanent; }
}
