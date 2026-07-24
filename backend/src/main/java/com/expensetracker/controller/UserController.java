package com.expensetracker.controller;

import com.expensetracker.dto.ChangePasswordRequest;
import com.expensetracker.dto.UserProfileDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for authenticated user profile management.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    /**
     * GET /api/users/me
     * Returns the authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    /**
     * PUT /api/users/me
     * Updates the authenticated user's profile (name, email).
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileDto dto
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(userService.updateProfile(userId, dto));
    }

    /**
     * PATCH /api/users/me/password
     * Changes the authenticated user's password.
     */
    @PatchMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        Long userId = resolveUserId(userDetails);
        userService.changePassword(userId, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // ── Helper ────────────────────────────────────────────────────

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
