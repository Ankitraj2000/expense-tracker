package com.expensetracker.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO for report generation (monthly or yearly).
 */
@Data
@Builder
public class ReportDto {

    private String period;        // e.g. "January 2025" or "2025"
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;

    /** Expense breakdown by category */
    private Map<String, BigDecimal> expenseByCategory;

    /** Income breakdown by category */
    private Map<String, BigDecimal> incomeByCategory;

    /** All transactions in the period */
    private List<TransactionResponse> transactions;
}
