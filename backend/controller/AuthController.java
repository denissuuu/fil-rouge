package com.yplaza.backend.controller;

import com.yplaza.backend.config.JwtService;
import com.yplaza.backend.entity.User;
import com.yplaza.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        var user = User.builder()
                .firstName(request.get("firstName"))
                .lastName(request.get("lastName"))
                .email(request.get("email"))
                .password(passwordEncoder.encode(request.get("password")))
                .role(User.Role.CLIENT)
                .build();
        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("email"),
                        request.get("password")
                )
        );
        var user = userRepository.findByEmail(request.get("email")).orElseThrow();
        var token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }
}