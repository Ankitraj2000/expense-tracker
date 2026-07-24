package com.expensetracker.controller;

import com.expensetracker.dto.UserProfileDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Admin dashboard and user management.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    /**
     * GET /api/admin/stats
     * Returns system-wide high-level metrics.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalTransactions", totalTransactions);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/admin/users
     * Returns all registered users with their roles and info.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserProfileDto> dtos = users.stream().map(u -> {
            UserProfileDto dto = new UserProfileDto();
            dto.setId(u.getId());
            dto.setName(u.getName());
            dto.setEmail(u.getEmail());
            dto.setRole(u.getRole() != null ? u.getRole() : "ROLE_USER");
            dto.setCreatedAt(u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Deletes a user by ID.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    /**
     * POST /api/admin/users/{id}/toggle-role
     * Toggles a user's role between ROLE_USER and ROLE_ADMIN.
     */
    @PostMapping("/users/{id}/toggle-role")
    public ResponseEntity<UserProfileDto> toggleRole(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String current = user.getRole() != null ? user.getRole() : "ROLE_USER";
        user.setRole(current.equals("ROLE_ADMIN") ? "ROLE_USER" : "ROLE_ADMIN");
        userRepository.save(user);

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);

        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/admin/users/{id}/details
     * Returns comprehensive financial details and recent transactions for a specific user.
     */
    @GetMapping("/users/{id}/details")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var totalIncome = transactionRepository.sumByUserIdAndType(id, com.expensetracker.model.TransactionType.INCOME);
        var totalExpense = transactionRepository.sumByUserIdAndType(id, com.expensetracker.model.TransactionType.EXPENSE);
        var recentTx = transactionRepository.findRecentByUserId(id, org.springframework.data.domain.PageRequest.of(0, 20))
                .stream()
                .map(com.expensetracker.dto.TransactionResponse::from)
                .toList();

        Map<String, Object> details = new HashMap<>();
        details.put("id", user.getId());
        details.put("name", user.getName());
        details.put("email", user.getEmail());
        details.put("role", user.getRole() != null ? user.getRole() : "ROLE_USER");
        details.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        details.put("totalIncome", totalIncome != null ? totalIncome : 0);
        details.put("totalExpense", totalExpense != null ? totalExpense : 0);
        details.put("netBalance", (totalIncome != null ? totalIncome : java.math.BigDecimal.ZERO).subtract(totalExpense != null ? totalExpense : java.math.BigDecimal.ZERO));
        details.put("transactions", recentTx);

        return ResponseEntity.ok(details);
    }
}
