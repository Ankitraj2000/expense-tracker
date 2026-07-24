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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock private TransactionRepository transactionRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private TransactionService transactionService;

    private User testUser;
    private TransactionRequest request;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        request = new TransactionRequest();
        request.setType("EXPENSE");
        request.setCategory("Food");
        request.setAmount(new BigDecimal("50.00"));
        request.setDescription("Lunch");
        request.setDate(LocalDate.now());
    }

    @Test
    void create_ValidExpense_ReturnsResponse() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Transaction saved = Transaction.builder()
                .id(1L)
                .user(testUser)
                .type(TransactionType.EXPENSE)
                .category("Food")
                .amount(new BigDecimal("50.00"))
                .description("Lunch")
                .date(LocalDate.now())
                .build();

        when(transactionRepository.save(any())).thenReturn(saved);

        TransactionResponse response = transactionService.create(1L, request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("EXPENSE", response.getType());
        assertEquals("Food", response.getCategory());
    }

    @Test
    void create_InvalidType_ThrowsBadRequest() {
        request.setType("INVALID");
        assertThrows(BadRequestException.class, () -> transactionService.create(1L, request));
    }

    @Test
    void create_InvalidCategory_ThrowsBadRequest() {
        request.setCategory("Gaming"); // Not in EXPENSE_CATEGORIES
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        assertThrows(BadRequestException.class, () -> transactionService.create(1L, request));
    }

    @Test
    void delete_ExistingTransaction_Succeeds() {
        Transaction tx = Transaction.builder()
                .id(1L)
                .user(testUser)
                .type(TransactionType.EXPENSE)
                .category("Food")
                .amount(new BigDecimal("50.00"))
                .date(LocalDate.now())
                .build();

        when(transactionRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(tx));

        assertDoesNotThrow(() -> transactionService.delete(1L, 1L));
        verify(transactionRepository).delete(tx);
    }

    @Test
    void delete_NotFound_ThrowsResourceNotFound() {
        when(transactionRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> transactionService.delete(1L, 99L));
    }
}
