import jsPDF from 'jspdf';
import { formatDate } from './formatters';

function formatPDFCurrency(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num === null || num === undefined) return 'Rs. 0.00';
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Generates a downloadable PDF report using jsPDF.
 *
 * @param {Object} params
 * @param {Object} params.report   - Report data from the API
 * @param {Object} params.user     - User profile info
 */
export async function generatePDFReport({ report, user }) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // ── Colors ────────────────────────────────────────────────
  const PRIMARY   = [99, 102, 241];  // indigo-500
  const INCOME_C  = [16, 185, 129];  // emerald-500
  const EXPENSE_C = [239, 68, 68];   // red-500
  const DARK      = [30, 30, 46];
  const GRAY      = [100, 116, 139];
  const LIGHT_BG  = [248, 250, 252];

  // ── Helper functions ─────────────────────────────────────
  const addPage = () => {
    pdf.addPage();
    y = margin;
  };

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - margin) addPage();
  };

  const setFont = (size, style = 'normal', color = DARK) => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.setTextColor(...color);
  };

  // ── Header ────────────────────────────────────────────────
  pdf.setFillColor(...PRIMARY);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  setFont(20, 'bold', [255, 255, 255]);
  pdf.text('Expense Tracker Report', margin, 18);

  setFont(10, 'normal', [200, 210, 255]);
  pdf.text(`Period: ${report.period || 'N/A'}`, margin, 28);
  pdf.text(`Generated: ${formatDate(new Date(), 'dd MMM yyyy, HH:mm')}`, margin, 35);

  // User info (right side)
  setFont(9, 'normal', [200, 210, 255]);
  pdf.text(`User: ${user?.name || 'User'}`, pageWidth - margin - 60, 28, { align: 'left' });
  pdf.text(`Email: ${user?.email || ''}`, pageWidth - margin - 60, 35, { align: 'left' });

  y = 55;

  // ── Summary Cards ─────────────────────────────────────────
  setFont(13, 'bold', DARK);
  pdf.text('Financial Summary', margin, y);
  y += 8;

  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cards = [
    { label: 'Total Income', value: formatPDFCurrency(report.totalIncome), color: INCOME_C },
    { label: 'Total Expenses', value: formatPDFCurrency(report.totalExpense), color: EXPENSE_C },
    { label: 'Net Savings', value: formatPDFCurrency(report.netSavings), color: PRIMARY },
  ];

  cards.forEach((card, i) => {
    const x = margin + i * (cardWidth + 5);
    pdf.setFillColor(...LIGHT_BG);
    pdf.roundedRect(x, y, cardWidth, 22, 3, 3, 'F');
    pdf.setFillColor(...card.color);
    pdf.rect(x, y, 3, 22, 'F');

    setFont(7, 'normal', GRAY);
    pdf.text(card.label.toUpperCase(), x + 8, y + 8);
    setFont(11, 'bold', card.color);
    pdf.text(card.value, x + 8, y + 18);
  });

  y += 32;

  // ── Expense by Category ───────────────────────────────────
  if (report.expenseByCategory && Object.keys(report.expenseByCategory).length > 0) {
    checkPageBreak(50);
    setFont(12, 'bold', DARK);
    pdf.text('Expense by Category', margin, y);
    y += 6;

    Object.entries(report.expenseByCategory).forEach(([cat, amount]) => {
      checkPageBreak(8);
      const total = report.totalExpense;
      const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

      setFont(9, 'normal', DARK);
      pdf.text(cat, margin + 2, y);
      pdf.text(`${formatPDFCurrency(amount)} (${pct}%)`, pageWidth - margin - 2, y, { align: 'right' });

      // Progress bar
      y += 2;
      pdf.setFillColor(230, 232, 240);
      pdf.rect(margin, y, pageWidth - margin * 2, 3, 'F');
      pdf.setFillColor(...EXPENSE_C);
      pdf.rect(margin, y, (pageWidth - margin * 2) * (pct / 100), 3, 'F');
      y += 7;
    });
  }

  // ── Transactions Table ─────────────────────────────────────
  checkPageBreak(20);
  y += 4;
  setFont(12, 'bold', DARK);
  pdf.text('Transactions', margin, y);
  y += 6;

  // Table header
  const cols = [22, 55, 90, 130, 165];
  pdf.setFillColor(...PRIMARY);
  pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  setFont(8, 'bold', [255, 255, 255]);
  ['Date', 'Category', 'Description', 'Type', 'Amount'].forEach((h, i) => {
    pdf.text(h, cols[i], y + 5.5);
  });
  y += 8;

  // Table rows
  const transactions = (report.transactions || []).slice(0, 50); // Cap at 50 rows
  transactions.forEach((tx, idx) => {
    checkPageBreak(7);
    const rowBg = idx % 2 === 0 ? [255, 255, 255] : LIGHT_BG;
    pdf.setFillColor(...rowBg);
    pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F');

    setFont(8, 'normal', DARK);
    pdf.text(formatDate(tx.date, 'dd/MM/yy'), cols[0], y + 4.5);
    pdf.text((tx.category || '').substring(0, 14), cols[1], y + 4.5);
    pdf.text((tx.description || '-').substring(0, 18), cols[2], y + 4.5);

    const typeColor = tx.type === 'INCOME' ? INCOME_C : EXPENSE_C;
    setFont(8, 'bold', typeColor);
    pdf.text(tx.type, cols[3], y + 4.5);

    setFont(8, 'bold', DARK);
    pdf.text(formatPDFCurrency(tx.amount), cols[4], y + 4.5);

    y += 7;
  });

  // ── Footer ─────────────────────────────────────────────────
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    setFont(8, 'normal', GRAY);
    pdf.text(
      `Page ${i} of ${totalPages} — Expense Tracker`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // ── Save ───────────────────────────────────────────────────
  pdf.save(`expense-tracker-report-${(report.period || 'report').replace(/\s+/g, '-')}.pdf`);
}

/**
 * Captures a DOM element as a PNG and adds it to an existing PDF page.
 * @param {jsPDF} pdf
 * @param {string} elementId
 * @param {number} x
 * @param {number} y
 * @param {number} width
 */
export async function captureElementToPDF(pdf, elementId, x, y, width) {
  const element = document.getElementById(elementId);
  if (!element) return y;

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const aspectRatio = canvas.height / canvas.width;
  const height = width * aspectRatio;

  pdf.addImage(imgData, 'PNG', x, y, width, height);
  return y + height + 5;
}
