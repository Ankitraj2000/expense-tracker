package com.expensetracker.controller;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * REST controller for transaction CRUD with search, filter, sort, and pagination.
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    /**
     * POST /api/transactions
     * Creates a new transaction (income or expense).
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequest request
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(userId, request));
    }

    /**
     * GET /api/transactions
     * Returns a paginated, filtered, sorted list of the user's transactions.
     *
     * Query params:
     *   type, category, startDate, endDate, keyword, page, size, sortBy, sortDir
     */
    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(transactionService.getAll(
                userId, type, category, startDate, endDate, keyword, page, size, sortBy, sortDir
        ));
    }

    /**
     * GET /api/transactions/{id}
     * Returns a single transaction by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(transactionService.getById(userId, id));
    }

    /**
     * PUT /api/transactions/{id}
     * Updates an existing transaction.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(transactionService.update(userId, id, request));
    }

    /**
     * DELETE /api/transactions/{id}
     * Deletes a transaction by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        Long userId = resolveUserId(userDetails);
        transactionService.delete(userId, id);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }

    // ── Helper ────────────────────────────────────────────────────

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
