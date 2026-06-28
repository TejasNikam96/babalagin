package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/** Step 2 of the enroll form. Embedded into {@link Registration}. */
@Embeddable
public class Horoscope {

    @Column(name = "h_rashi")
    private String rashi;

    @Column(name = "h_nakshatra")
    private String nakshatra;

    @Column(name = "h_charan")
    private String charan;

    @Column(name = "h_gan")
    private String gan;

    @Column(name = "h_gotra")
    private String gotra;

    @Column(name = "h_manglik")
    private String manglik;

    @Column(name = "h_birth_time")
    private String birthTime;

    @Column(name = "h_birth_place")
    private String birthPlace;

    public String getRashi() { return rashi; }
    public void setRashi(String rashi) { this.rashi = rashi; }

    public String getNakshatra() { return nakshatra; }
    public void setNakshatra(String nakshatra) { this.nakshatra = nakshatra; }

    public String getCharan() { return charan; }
    public void setCharan(String charan) { this.charan = charan; }

    public String getGan() { return gan; }
    public void setGan(String gan) { this.gan = gan; }

    public String getGotra() { return gotra; }
    public void setGotra(String gotra) { this.gotra = gotra; }

    public String getManglik() { return manglik; }
    public void setManglik(String manglik) { this.manglik = manglik; }

    public String getBirthTime() { return birthTime; }
    public void setBirthTime(String birthTime) { this.birthTime = birthTime; }

    public String getBirthPlace() { return birthPlace; }
    public void setBirthPlace(String birthPlace) { this.birthPlace = birthPlace; }
}
