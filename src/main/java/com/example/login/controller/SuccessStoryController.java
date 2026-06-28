package com.example.login.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.SuccessStory;
import com.example.login.service.RegistrationService;

/** Public success-stories API (registrations flagged successStory=Y, paired by partnerId). */
@RestController
@CrossOrigin
public class SuccessStoryController {

    private final RegistrationService registrationService;

    public SuccessStoryController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/api/success-stories")
    public List<SuccessStory> successStories() {
        return registrationService.getSuccessStories();
    }
}
