package com.example.login.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.entity.ProfileLike;
import com.example.login.repository.ProfileLikeRepository;

/** Profile likes: one like per (from, to); toggling reverts it. */
@Service
public class LikeService {

    private static final Logger log = LoggerFactory.getLogger(LikeService.class);

    private final ProfileLikeRepository repository;

    public LikeService(ProfileLikeRepository repository) {
        this.repository = repository;
    }

    /** Likes if not yet liked, otherwise removes the like. Returns the new liked state. */
    @Transactional
    public boolean toggle(String fromCode, String toCode) {
        if (repository.existsByFromCodeAndToCode(fromCode, toCode)) {
            repository.deleteByFromCodeAndToCode(fromCode, toCode);
            log.info("Like removed: {} -> {}", fromCode, toCode);
            return false;
        }
        ProfileLike like = new ProfileLike();
        like.setFromCode(fromCode);
        like.setToCode(toCode);
        repository.save(like);
        log.info("Like added: {} -> {}", fromCode, toCode);
        return true;
    }

    @Transactional(readOnly = true)
    public long count(String toCode) {
        return repository.countByToCode(toCode);
    }

    @Transactional(readOnly = true)
    public boolean hasLiked(String fromCode, String toCode) {
        return repository.existsByFromCodeAndToCode(fromCode, toCode);
    }

    /** Registration codes of everyone who liked the given profile (owner-only). */
    @Transactional(readOnly = true)
    public List<String> likers(String toCode) {
        return repository.findByToCodeOrderByIdDesc(toCode).stream()
            .map(ProfileLike::getFromCode)
            .collect(Collectors.toList());
    }
}
