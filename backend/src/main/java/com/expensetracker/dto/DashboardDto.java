package com.expensetracker.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO for the Dashboard summary returned by /api/dashboard.
 */
@Data
@Builder
public class DashboardDto {

    /** Total of all income transactions */
    private BigDecimal totalIncome;

    /** Total of all expense transactions */
    private BigDecimal totalExpense;

    /** totalIncome - totalExpense */
    private BigDecimal totalBalance;

    /** Current month's income - current month's expenses */
    private BigDecimal monthlySavings;

    /** 5 most recent transactions */
    private List<TransactionResponse> recentTransactions;

    /** Expense amounts grouped by category (for Pie Chart) */
    private Map<String, BigDecimal> expenseByCategory;

    /** Monthly income totals for the current year (for Bar/Line Charts) */
    private Map<String, BigDecimal> monthlyIncome;

    /** Monthly expense totals for the current year */
    private Map<String, BigDecimal> monthlyExpense;
}
