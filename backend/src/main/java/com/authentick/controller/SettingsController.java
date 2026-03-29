package com.authentick.controller;

import com.authentick.model.User;
import com.authentick.repository.UserRepository;
import com.authentick.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request,
                                           Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        if (request.containsKey("name")) user.setName(request.get("name"));
        if (request.containsKey("email")) user.setEmail(request.get("email"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request,
                                            Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        String current = request.get("currentPassword");
        String newPass = request.get("newPassword");

        if (!passwordEncoder.matches(current, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
