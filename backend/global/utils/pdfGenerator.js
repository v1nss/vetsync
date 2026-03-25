import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const COLORS = {
  primary: rgb(0.969, 0.549, 0.471),      // #f78c78 — coral primary
  primaryLight: rgb(0.996, 0.937, 0.929), // #feeee d — light coral bg
  primaryDark: rgb(0.82, 0.36, 0.27),     // #d15c45 — darker coral for contrast
  accent: rgb(0.95, 0.72, 0.65),          // #f2b8a6 — soft coral accent
  dark: rgb(0.13, 0.13, 0.18),            // near-black text
  muted: rgb(0.55, 0.45, 0.43),           // warm muted labels
  border: rgb(0.95, 0.87, 0.84),          // warm subtle borders
  white: rgb(1, 1, 1),
  danger: rgb(0.82, 0.22, 0.22),
  rowAlt: rgb(0.99, 0.96, 0.95),          // warm alternating row bg
};

const PAGE_W = 595;  // A4
const PAGE_H = 842;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── Font helpers ─────────────────────────────────────────────────────────────
async function loadFonts(pdfDoc) {
  return {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    oblique: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
  };
}

function drawText(page, text, { x, y, size = 11, font, color = COLORS.dark, maxWidth }) {
  const safeText = text == null ? "—" : String(text);
  if (maxWidth) {
    // Naive word-wrap
    const words = safeText.split(" ");
    let line = "";
    let currentY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        page.drawText(line, { x, y: currentY, size, font, color });
        currentY -= size + 4;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) page.drawText(line, { x, y: currentY, size, font, color });
    return currentY - (size + 4);
  }
  page.drawText(safeText, { x, y, size, font, color });
  return y - (size + 4);
}

// ─── Shared layout primitives ─────────────────────────────────────────────────
function drawPageHeader(page, fonts, clinicName, reportTitle) {
  // Header background
  page.drawRectangle({ x: 0, y: PAGE_H - 72, width: PAGE_W, height: 72, color: COLORS.primary });

  // Clinic name
  drawText(page, clinicName, { x: MARGIN + 32, y: PAGE_H - 26, size: 15, font: fonts.bold, color: COLORS.white });
  drawText(page, reportTitle, { x: MARGIN + 32, y: PAGE_H - 46, size: 9,  font: fonts.regular, color: COLORS.white });

  // Generated date (top-right)
  const dateStr = `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;
  const dateW = fonts.regular.widthOfTextAtSize(dateStr, 8);
  drawText(page, dateStr, { x: PAGE_W - MARGIN - dateW, y: PAGE_H - 46, size: 8, font: fonts.regular, color: COLORS.white });
}

function drawPageFooter(page, fonts, pageNumber, totalPages) {
  page.drawLine({ start: { x: MARGIN, y: 40 }, end: { x: PAGE_W - MARGIN, y: 40 }, thickness: 0.5, color: COLORS.border });
  drawText(page, "Confidential – For veterinary use only", { x: MARGIN, y: 26, size: 7.5, font: fonts.oblique, color: COLORS.muted });
  const pageLabel = `Page ${pageNumber} of ${totalPages}`;
  const labelW = fonts.regular.widthOfTextAtSize(pageLabel, 8);
  drawText(page, pageLabel, { x: PAGE_W - MARGIN - labelW, y: 26, size: 8, font: fonts.regular, color: COLORS.muted });
}

function drawSectionHeading(page, fonts, label, y) {
  page.drawRectangle({ x: MARGIN, y: y - 2, width: CONTENT_W, height: 22, color: COLORS.primaryLight, borderRadius: 3 });
  page.drawRectangle({ x: MARGIN, y: y - 2, width: 4, height: 22, color: COLORS.primary, borderRadius: 2 });
  drawText(page, label.toUpperCase(), { x: MARGIN + 12, y: y + 6, size: 9, font: fonts.bold, color: COLORS.primary });
  return y - 30;
}

function drawLabelValue(page, fonts, label, value, x, y, colWidth = 240) {
  drawText(page, label, { x, y, size: 8, font: fonts.regular, color: COLORS.muted });
  drawText(page, value ?? "—", { x, y: y - 13, size: 10, font: fonts.bold, color: COLORS.dark, maxWidth: colWidth - 10 });
}

function drawDivider(page, y) {
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.4, color: COLORS.border });
}

// ─── Badge helper ─────────────────────────────────────────────────────────────
function drawBadge(page, fonts, text, x, y, color = COLORS.accent) {
  const textW = fonts.bold.widthOfTextAtSize(text, 8);
  page.drawRectangle({ x: x - 4, y: y - 6, width: textW + 10, height: 16, color: color, borderRadius: 4 });
  drawText(page, text, { x: x + 1, y: y, size: 8, font: fonts.bold, color: COLORS.white });
}

// ─── PATIENT report ───────────────────────────────────────────────────────────
async function generatePatientReport(pdfDoc, fonts, reportData) {
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  drawPageHeader(page, fonts, reportData.clinicName, "Patient Medical Record");

  let y = PAGE_H - 94;

  // ── Pet Identity Card ──────────────────────────────────────────────────────
  page.drawRectangle({ x: MARGIN, y: y - 64, width: CONTENT_W, height: 74, color: COLORS.primaryLight, borderRadius: 6 });

  // Large pet name
  drawText(page, reportData.petName, { x: MARGIN + 16, y: y - 12, size: 20, font: fonts.bold, color: COLORS.primary });

  // Pet ID badge
  drawBadge(page, fonts, `ID: ${reportData.petId}`, MARGIN + 16, y - 28, COLORS.primary);

  // Species / breed tag
  const speciesStr = [reportData.species, reportData.breed].filter(Boolean).join(" · ");
  drawText(page, speciesStr, { x: MARGIN + 16, y: y - 50, size: 9, font: fonts.oblique, color: COLORS.muted });

  // Gender badge
  const genderColor = reportData.gender?.toLowerCase() === "female" ? rgb(0.75, 0.25, 0.55) : COLORS.primary;
  if (reportData.gender) drawBadge(page, fonts, reportData.gender, MARGIN + 200, y - 28, genderColor);

  y -= 84;
  drawDivider(page, y + 6);
  y -= 10;

  // ── Patient Details ────────────────────────────────────────────────────────
  y = drawSectionHeading(page, fonts, "Patient Details", y);
  y -= 8;

  const col1 = MARGIN + 8;
  const col2 = MARGIN + CONTENT_W / 2 + 8;
  const colW = CONTENT_W / 2 - 16;

  drawLabelValue(page, fonts, "Date of Birth",    reportData.birthdate,    col1, y, colW);
  drawLabelValue(page, fonts, "Age",              reportData.age,          col2, y, colW);
  y -= 38;

  drawLabelValue(page, fonts, "Weight",           reportData.weight != null ? `${reportData.weight}` : null, col1, y, colW);
  drawLabelValue(page, fonts, "Registration No.", reportData.registration, col2, y, colW);
  y -= 38;

  drawLabelValue(page, fonts, "Total Appointments", reportData.appointmentCount != null ? String(reportData.appointmentCount) : null, col1, y, colW);
  y -= 46;

  drawDivider(page, y + 4);
  y -= 14;

  // ── Owner Information ──────────────────────────────────────────────────────
  y = drawSectionHeading(page, fonts, "Owner Information", y);
  y -= 8;

  drawLabelValue(page, fonts, "Full Name", reportData.owner?.name,    col1, y, colW);
  drawLabelValue(page, fonts, "Email",     reportData.owner?.email,   col2, y, colW);
  y -= 38;

  drawLabelValue(page, fonts, "Phone",     reportData.owner?.phone,   col1, y, colW);
  drawLabelValue(page, fonts, "Address",   reportData.owner?.address, col2, y, colW * 1.2);
  y -= 46;

  drawDivider(page, y + 4);
  y -= 14;
}

// ─── CLINIC report (placeholder) ─────────────────────────────────────────────
async function generateClinicReport(pdfDoc, fonts, reportData) {
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  drawPageHeader(page, fonts, reportData.clinicName ?? "Veterinary Clinic", "Clinic Summary Report");

  let y = PAGE_H - 94;

  // ── Placeholder notice ─────────────────────────────────────────────────────
  page.drawRectangle({
    x: MARGIN, y: y - 160, width: CONTENT_W, height: 170,
    color: COLORS.rowAlt, borderRadius: 6, borderColor: COLORS.border, borderWidth: 0.8,
  });

  const icon = "?"; // placeholder symbol
  drawText(page, icon,                        { x: MARGIN + CONTENT_W / 2 - 10, y: y - 30,  size: 24, font: fonts.bold,    color: COLORS.muted });
  drawText(page, "Clinic Report – Coming Soon", { x: MARGIN + CONTENT_W / 2 - 70, y: y - 68,  size: 14, font: fonts.bold,    color: COLORS.primary });
  drawText(page, "This section is reserved for clinic-level analytics.", { x: MARGIN + 60, y: y - 96,  size: 10, font: fonts.regular, color: COLORS.muted });
  drawText(page, "Planned sections:", { x: MARGIN + 60, y: y - 120, size: 10, font: fonts.bold,    color: COLORS.dark });

  const placeholders = [
    "• Appointment statistics & trends",
    "• Revenue summary",
    "• Staff performance overview",
    "• Patient demographics",
  ];
  let bulletY = y - 138;
  for (const item of placeholders) {
    drawText(page, item, { x: MARGIN + 72, y: bulletY, size: 9, font: fonts.regular, color: COLORS.muted });
    bulletY -= 14;
  }

  drawPageFooter(page, fonts, 1, 1);
}

// ─── Main entry point ─────────────────────────────────────────────────────────
/**
 * Generates a PDF report buffer for the given reportType.
 *
 * @param {Object} reportData  - The data object to render (shape depends on reportType)
 * @param {"patient"|"clinic"} reportType - Which template to use
 * @returns {Promise<Buffer>}  - A Node.js Buffer containing the PDF bytes
 */
export const generatePDFReport = async (reportData, reportType) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${reportType} Report`);
  pdfDoc.setAuthor(reportData.clinicName ?? "Veterinary Clinic");
  pdfDoc.setCreationDate(new Date());

  const fonts = await loadFonts(pdfDoc);

  switch (reportType) {
    case "patient":
      await generatePatientReport(pdfDoc, fonts, reportData);
      break;

    case "clinic":
      await generateClinicReport(pdfDoc, fonts, reportData);
      break;

    default:
      throw new Error(`Unknown reportType "${reportType}". Supported: "patient", "clinic".`);
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};