package com.expensetracker.service;

import com.expensetracker.dto.ReportDto;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.model.Transaction;
import com.expensetracker.model.TransactionType;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for generating monthly and yearly financial reports.
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    /**
     * Generates a report for a specific month and year.
     *
     * @param userId  authenticated user's ID
     * @param year    4-digit year
     * @param month   month number (1–12)
     */
    public ReportDto getMonthlyReport(Long userId, int year, int month) {
        List<Transaction> transactions =
                transactionRepository.findByUserIdAndYearAndMonth(userId, year, month);

        String period = Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + year;
        return buildReport(period, transactions);
    }

    /**
     * Generates a report for an entire year.
     *
     * @param userId authenticated user's ID
     * @param year   4-digit year
     */
    public ReportDto getYearlyReport(Long userId, int year) {
        List<Transaction> transactions =
                transactionRepository.findByUserIdAndYear(userId, year);

        return buildReport(String.valueOf(year), transactions);
    }

    // ── Private Helpers ───────────────────────────────────────────

    private ReportDto buildReport(String period, List<Transaction> transactions) {
        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> expenseByCategory = groupByCategory(transactions, TransactionType.EXPENSE);
        Map<String, BigDecimal> incomeByCategory  = groupByCategory(transactions, TransactionType.INCOME);

        List<TransactionResponse> transactionResponses = transactions.stream()
                .map(TransactionResponse::from)
                .toList();

        return ReportDto.builder()
                .period(period)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(totalIncome.subtract(totalExpense))
                .expenseByCategory(expenseByCategory)
                .incomeByCategory(incomeByCategory)
                .transactions(transactionResponses)
                .build();
    }

    private Map<String, BigDecimal> groupByCategory(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(t -> t.getType() == type)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
    }
}
