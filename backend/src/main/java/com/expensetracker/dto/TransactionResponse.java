package com.expensetracker.dto;

import com.expensetracker.model.Transaction;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for a single transaction.
 */
@Data
@Builder
public class TransactionResponse {

    private Long id;
    private String type;
    private String category;
    private BigDecimal amount;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * Static factory method — maps a Transaction entity to a TransactionResponse.
     */
    public static TransactionResponse from(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .type(t.getType().name())
                .category(t.getCategory())
                .amount(t.getAmount())
                .description(t.getDescription())
                .date(t.getDate())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
