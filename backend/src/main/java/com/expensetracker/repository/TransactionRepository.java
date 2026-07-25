package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Transaction entity with rich query support for
 * filtering, aggregation, and pagination.
 * All queries use native SQL to avoid Hibernate JPQL type-resolution
 * issues with PostgreSQL (e.g. lower(bytea), YEAR/MONTH functions).
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ── Basic Lookups ────────────────────────────────────────────

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    Page<Transaction> findByUserId(Long userId, Pageable pageable);

    void deleteAllByUserId(Long userId);

    // ── Filtered search with keyword, type, category, date range ─

    @Query(value = """
            SELECT * FROM transactions t
            WHERE t.user_id = :userId
              AND (:type IS NULL OR t.type = CAST(:type AS VARCHAR))
              AND (:category IS NULL OR t.category = :category)
              AND (CAST(:startDate AS DATE) IS NULL OR t.date >= CAST(:startDate AS DATE))
              AND (CAST(:endDate AS DATE) IS NULL OR t.date <= CAST(:endDate AS DATE))
              AND (:keyword IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """,
            countQuery = """
            SELECT COUNT(*) FROM transactions t
            WHERE t.user_id = :userId
              AND (:type IS NULL OR t.type = CAST(:type AS VARCHAR))
              AND (:category IS NULL OR t.category = :category)
              AND (CAST(:startDate AS DATE) IS NULL OR t.date >= CAST(:startDate AS DATE))
              AND (CAST(:endDate AS DATE) IS NULL OR t.date <= CAST(:endDate AS DATE))
              AND (:keyword IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """,
            nativeQuery = true)
    Page<Transaction> findByFilters(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // ── Aggregation ───────────────────────────────────────────────

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    @Query(value = """
            SELECT COALESCE(SUM(amount), 0) FROM transactions
            WHERE user_id = :userId
              AND type = :type
              AND EXTRACT(YEAR FROM date) = :year
              AND EXTRACT(MONTH FROM date) = :month
            """, nativeQuery = true)
    BigDecimal sumByUserIdAndTypeAndMonth(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("year") int year,
            @Param("month") int month
    );

    // ── Recent Transactions ───────────────────────────────────────

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.date DESC, t.createdAt DESC")
    List<Transaction> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);

    // ── Monthly Report ────────────────────────────────────────────

    @Query(value = """
            SELECT * FROM transactions
            WHERE user_id = :userId
              AND EXTRACT(YEAR FROM date) = :year
              AND EXTRACT(MONTH FROM date) = :month
            ORDER BY date DESC
            """, nativeQuery = true)
    List<Transaction> findByUserIdAndYearAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month
    );

    // ── Yearly Report ─────────────────────────────────────────────

    @Query(value = """
            SELECT * FROM transactions
            WHERE user_id = :userId
              AND EXTRACT(YEAR FROM date) = :year
            ORDER BY date DESC
            """, nativeQuery = true)
    List<Transaction> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);

    // ── Category-wise totals ──────────────────────────────────────

    @Query(value = """
            SELECT category, COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE user_id = :userId AND type = :type
            GROUP BY category
            """, nativeQuery = true)
    List<Object[]> sumAmountByCategoryAndType(@Param("userId") Long userId, @Param("type") String type);

    // ── Monthly totals for charts ─────────────────────────────────

    @Query(value = """
            SELECT EXTRACT(MONTH FROM date) AS month,
                   EXTRACT(YEAR FROM date)  AS year,
                   SUM(amount)              AS total
            FROM transactions
            WHERE user_id = :userId
              AND type = :type
              AND EXTRACT(YEAR FROM date) = :year
            GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> monthlyTotals(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("year") int year
    );
}
