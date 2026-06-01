package com.yplaza.backend.service;

import com.yplaza.backend.config.JwtService;
import com.yplaza.backend.dto.LoginRequest;
import com.yplaza.backend.dto.RegisterRequest;
import com.yplaza.backend.entity.User;
import com.yplaza.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService — Tests unitaires")
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .firstName("Jean")
                .lastName("Dupont")
                .email("jean@example.com")
                .password("hashed_password")
                .role(User.Role.CLIENT)
                .build();
    }

    @Test
    @DisplayName("register() — crée un utilisateur et retourne un token")
    void register_shouldCreateUserAndReturnToken() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Jean");
        request.setLastName("Dupont");
        request.setEmail("jean@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("jean@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt_token");

        var response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getEmail()).isEqualTo("jean@example.com");
        assertThat(response.getRole()).isEqualTo(User.Role.CLIENT);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register() — lève une exception si l'email est déjà utilisé")
    void register_shouldThrowIfEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("jean@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("jean@example.com")).thenReturn(Optional.of(sampleUser));

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already in use");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("login() — retourne un token pour des identifiants valides")
    void login_shouldReturnTokenForValidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("jean@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("jean@example.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken(sampleUser)).thenReturn("jwt_token");

        var response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getFirstName()).isEqualTo("Jean");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("login() — lève une exception pour des identifiants invalides")
    void login_shouldThrowForInvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("jean@example.com");
        request.setPassword("wrong_password");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
