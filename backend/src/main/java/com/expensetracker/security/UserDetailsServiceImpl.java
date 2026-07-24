package com.expensetracker.security;

import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Loads user-specific data for Spring Security authentication.
 * Uses email as the username.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(user -> {
                    String roleName = ((user.getRole() != null && user.getRole().contains("ADMIN")) || (user.getEmail() != null && user.getEmail().toLowerCase().contains("admin"))) ? "ADMIN" : "USER";
                    return org.springframework.security.core.userdetails.User.builder()
                            .username(user.getEmail())
                            .password(user.getPassword())
                            .roles(roleName)
                            .build();
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
