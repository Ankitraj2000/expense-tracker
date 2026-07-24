package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Transaction;
import com.expensetracker.model.TransactionType;
import com.expensetracker.model.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Service for CRUD operations on transactions with filtering and pagination.
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    // ── Valid Categories ──────────────────────────────────────────

    private static final Set<String> INCOME_CATEGORIES = Set.of(
            "Salary", "Freelancing", "Business", "Investments", "Other"
    );

    private static final Set<String> EXPENSE_CATEGORIES = Set.of(
            "Food", "Shopping", "Travel", "Bills", "Medical",
            "Entertainment", "Education", "Other"
    );

    // ── Create ────────────────────────────────────────────────────

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        TransactionType type = parseType(request.getType());
        validateCategory(type, request.getCategory());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Transaction tx = Transaction.builder()
                .user(user)
                .type(type)
                .category(request.getCategory())
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    // ── Read (with filters & pagination) ─────────────────────────

    public Page<TransactionResponse> getAll(
            Long userId,
            String type,
            String category,
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        TransactionType typeEnum = (type != null && !type.isBlank()) ? parseType(type) : null;
        String resolvedCategory = (category != null && category.isBlank()) ? null : category;
        String resolvedKeyword = (keyword != null && keyword.isBlank()) ? null : keyword;

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return transactionRepository
                .findByFilters(userId, typeEnum != null ? typeEnum.name() : null, resolvedCategory, startDate, endDate, resolvedKeyword, pageable)
                .map(TransactionResponse::from);
    }

    // ── Read by ID ────────────────────────────────────────────────

    public TransactionResponse getById(Long userId, Long id) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return TransactionResponse.from(tx);
    }

    // ── Update ────────────────────────────────────────────────────

    @Transactional
    public TransactionResponse update(Long userId, Long id, TransactionRequest request) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        TransactionType type = parseType(request.getType());
        validateCategory(type, request.getCategory());

        tx.setType(type);
        tx.setCategory(request.getCategory());
        tx.setAmount(request.getAmount());
        tx.setDescription(request.getDescription());
        tx.setDate(request.getDate());

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    // ── Delete ────────────────────────────────────────────────────

    @Transactional
    public void delete(Long userId, Long id) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepository.delete(tx);
    }

    // ── Helpers ───────────────────────────────────────────────────

    private TransactionType parseType(String type) {
        try {
            return TransactionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid transaction type. Must be INCOME or EXPENSE.");
        }
    }

    private void validateCategory(TransactionType type, String category) {
        Set<String> valid = type == TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        if (!valid.contains(category)) {
            throw new BadRequestException("Invalid category '" + category + "' for type " + type);
        }
    }
}
