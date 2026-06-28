package com.example.login.dto;

import java.time.LocalDateTime;

import com.example.login.entity.Message;

/** A single chat message returned to the client. */
public class MessageResponse {

    private Long id;
    private String fromCode;
    private String toCode;
    private String content;
    private LocalDateTime createdDate;

    public static MessageResponse from(Message m) {
        MessageResponse r = new MessageResponse();
        r.id = m.getId();
        r.fromCode = m.getFromCode();
        r.toCode = m.getToCode();
        r.content = m.getContent();
        r.createdDate = m.getCreatedDate();
        return r;
    }

    public Long getId() { return id; }
    public String getFromCode() { return fromCode; }
    public String getToCode() { return toCode; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedDate() { return createdDate; }
}
