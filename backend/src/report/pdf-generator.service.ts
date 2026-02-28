import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfGeneratorService {
    /**
     * Generate PDF from HTML content
     */
    async generatePdfFromHtml(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: 'networkidle0',
            });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm',
                },
            });

            return Buffer.from(pdfBuffer);
        } finally {
            await browser.close();
        }
    }

    /**
     * Generate report PDF
     */
    async generateReportPdf(report: any): Promise<Buffer> {
        const html = this.generateReportHtml(report);
        return this.generatePdfFromHtml(html);
    }

    /**
     * Generate HTML template for report
     */
    private generateReportHtml(report: any): string {
        return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>รายงาน - ${report.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #1e40af;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .header p {
      color: #64748b;
      font-size: 12px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      background-color: #eff6ff;
      color: #1e40af;
      padding: 10px 15px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid #2563eb;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      color: #475569;
    }
    .info-value {
      color: #1e293b;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-draft { background-color: #f1f5f9; color: #64748b; }
    .status-submitted { background-color: #dbeafe; color: #1e40af; }
    .status-approved { background-color: #dcfce7; color: #166534; }
    .status-rejected { background-color: #fee2e2; color: #991b1b; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border: 1px solid #e2e8f0;
    }
    th {
      background-color: #f8fafc;
      font-weight: bold;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ ระบบจัดการภัยพิบัติ Guardian Route</h1>
    <p>ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่</p>
  </div>

  <div class="section">
    <div class="section-title">📋 ข้อมูลรายงาน</div>
    <div class="info-grid">
      <div class="info-label">รหัสรายงาน:</div>
      <div class="info-value">${report.id}</div>
      
      <div class="info-label">ชื่อรายงาน:</div>
      <div class="info-value">${report.title}</div>
      
      <div class="info-label">ประเภท:</div>
      <div class="info-value">${this.getReportTypeLabel(report.type)}</div>
      
      <div class="info-label">สถานะ:</div>
      <div class="info-value">
        <span class="status-badge status-${report.status.toLowerCase()}">${this.getStatusLabel(report.status)}</span>
      </div>
      
      <div class="info-label">วันที่สร้าง:</div>
      <div class="info-value">${this.formatDate(report.createdAt)}</div>
      
      ${report.submittedAt ? `
      <div class="info-label">วันที่ส่ง:</div>
      <div class="info-value">${this.formatDate(report.submittedAt)}</div>
      ` : ''}
      
      ${report.approvedAt ? `
      <div class="info-label">วันที่อนุมัติ:</div>
      <div class="info-value">${this.formatDate(report.approvedAt)}</div>
      ` : ''}
    </div>
  </div>

  ${report.summary ? `
  <div class="section">
    <div class="section-title">📝 สรุปรายงาน</div>
    <p>${report.summary}</p>
  </div>
  ` : ''}

  ${report.content ? `
  <div class="section">
    <div class="section-title">📄 เนื้อหารายงาน</div>
    <div>${JSON.stringify(report.content, null, 2)}</div>
  </div>
  ` : ''}

  ${report.affectedHouseholds || report.affectedPersons || report.totalDamageEstimate ? `
  <div class="section">
    <div class="section-title">📊 สถิติความเสียหาย</div>
    <div class="info-grid">
      ${report.affectedHouseholds ? `
      <div class="info-label">จำนวนครัวเรือนที่ได้รับผลกระทบ:</div>
      <div class="info-value">${report.affectedHouseholds} ครัวเรือน</div>
      ` : ''}
      
      ${report.affectedPersons ? `
      <div class="info-label">จำนวนผู้ได้รับผลกระทบ:</div>
      <div class="info-value">${report.affectedPersons} คน</div>
      ` : ''}
      
      ${report.totalDamageEstimate ? `
      <div class="info-label">ประเมินความเสียหาย:</div>
      <div class="info-value">${this.formatCurrency(report.totalDamageEstimate)} บาท</div>
      ` : ''}
    </div>
  </div>
  ` : ''}

  ${report.reviewNotes ? `
  <div class="section">
    <div class="section-title">💬 หมายเหตุการพิจารณา</div>
    <p>${report.reviewNotes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>สร้างโดยระบบ Guardian Route • ${this.formatDate(new Date())}</p>
    <p>© 2026 องค์การบริหารส่วนตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่</p>
  </div>
</body>
</html>
    `;
    }

    private getReportTypeLabel(type: string): string {
        const labels = {
            INCIDENT: 'รายงานเหตุการณ์',
            INCIDENT_SUMMARY: 'สรุปเหตุการณ์',
            TASK: 'รายงานงาน',
            TASK_PROGRESS: 'ความคืบหน้างาน',
            SURVEY: 'รายงานการสำรวจ',
            SURVEY_RESULTS: 'ผลการสำรวจ',
            MONTHLY: 'รายงานประจำเดือน',
            MONTHLY_SUMMARY: 'สรุปประจำเดือน',
            CUSTOM: 'รายงานกำหนดเอง',
        };
        return labels[type] || type;
    }

    private getStatusLabel(status: string): string {
        const labels = {
            DRAFT: 'ฉบับร่าง',
            GENERATING: 'กำลังสร้าง',
            READY: 'พร้อมใช้งาน',
            ERROR: 'เกิดข้อผิดพลาด',
            SUBMITTED: 'ส่งแล้ว',
            UNDER_REVIEW: 'กำลังพิจารณา',
            REVISION_REQUIRED: 'ต้องแก้ไข',
            APPROVED: 'อนุมัติแล้ว',
            REJECTED: 'ไม่อนุมัติ',
        };
        return labels[status] || status;
    }

    private formatDate(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    private formatCurrency(amount: number): string {
        return amount.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
}
