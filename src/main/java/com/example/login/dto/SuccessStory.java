package com.example.login.dto;

/** A success-story couple (a profile and its linked partner). */
public class SuccessStory {

    private ProfileSummary person;
    private ProfileSummary partner; // may be null if partnerId not set/found

    public SuccessStory(ProfileSummary person, ProfileSummary partner) {
        this.person = person;
        this.partner = partner;
    }

    public ProfileSummary getPerson() { return person; }
    public ProfileSummary getPartner() { return partner; }
}
