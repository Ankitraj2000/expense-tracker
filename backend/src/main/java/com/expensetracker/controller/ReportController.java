package com.expensetracker.controller;

import com.expensetracker.dto.ReportDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for generating financial reports.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    /**
     * GET /api/reports/monthly?year=2025&month=1
     * Returns a monthly report for the given year and month.
     */
    @GetMapping("/monthly")
    public ResponseEntity<ReportDto> getMonthlyReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year,
            @RequestParam int month
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(reportService.getMonthlyReport(userId, year, month));
    }

    /**
     * GET /api/reports/yearly?year=2025
     * Returns a yearly report for the given year.
     */
    @GetMapping("/yearly")
    public ResponseEntity<ReportDto> getYearlyReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year
    ) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(reportService.getYearlyReport(userId, year));
    }

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
