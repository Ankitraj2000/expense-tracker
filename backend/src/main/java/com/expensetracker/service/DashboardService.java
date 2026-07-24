package com.expensetracker.service;

import com.expensetracker.dto.DashboardDto;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.model.TransactionType;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Service that aggregates transaction data for the dashboard overview.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;

    /**
     * Builds the complete dashboard summary for a user.
     */
    public DashboardDto getDashboard(Long userId) {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        // Total income and expense
        BigDecimal totalIncome  = transactionRepository.sumByUserIdAndType(userId, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(userId, TransactionType.EXPENSE);
        BigDecimal totalBalance = totalIncome.subtract(totalExpense);

        // Monthly savings
        BigDecimal monthlyIncome  = transactionRepository
                .sumByUserIdAndTypeAndMonth(userId, "INCOME", currentYear, currentMonth);
        BigDecimal monthlyExpense = transactionRepository
                .sumByUserIdAndTypeAndMonth(userId, "EXPENSE", currentYear, currentMonth);
        BigDecimal monthlySavings = monthlyIncome.subtract(monthlyExpense);

        // Recent 5 transactions
        List<TransactionResponse> recent = transactionRepository
                .findRecentByUserId(userId, PageRequest.of(0, 5))
                .stream()
                .map(TransactionResponse::from)
                .toList();

        // Expense by category (Pie Chart)
        Map<String, BigDecimal> expenseByCategory = buildCategoryMap(
                transactionRepository.sumAmountByCategoryAndType(userId, "EXPENSE")
        );

        // Monthly income & expense for current year (Bar/Line Charts)
        Map<String, BigDecimal> monthlyIncomeMap  = buildMonthlyMap(
                transactionRepository.monthlyTotals(userId, "INCOME", currentYear)
        );
        Map<String, BigDecimal> monthlyExpenseMap = buildMonthlyMap(
                transactionRepository.monthlyTotals(userId, "EXPENSE", currentYear)
        );

        return DashboardDto.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .totalBalance(totalBalance)
                .monthlySavings(monthlySavings)
                .recentTransactions(recent)
                .expenseByCategory(expenseByCategory)
                .monthlyIncome(monthlyIncomeMap)
                .monthlyExpense(monthlyExpenseMap)
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────

    private Map<String, BigDecimal> buildCategoryMap(List<Object[]> rows) {
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            map.put((String) row[0], (BigDecimal) row[1]);
        }
        return map;
    }

    private Map<String, BigDecimal> buildMonthlyMap(List<Object[]> rows) {
        // Pre-fill all 12 months with zero
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Month m : Month.values()) {
            map.put(m.name().substring(0, 3), BigDecimal.ZERO);
        }
        for (Object[] row : rows) {
            int monthNum = ((Number) row[0]).intValue();
            BigDecimal total = ((Number) row[2]).getClass() == BigDecimal.class
                    ? (BigDecimal) row[2]
                    : BigDecimal.valueOf(((Number) row[2]).doubleValue());
            String monthName = Month.of(monthNum).name().substring(0, 3);
            map.put(monthName, total);
        }
        return map;
    }
}
