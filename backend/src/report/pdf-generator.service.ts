import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private browser: Browser | null = null;

  /**
   * Initialize Puppeteer browser instance
   */
  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.logger.log('Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
      this.logger.log('Puppeteer browser initialized successfully');
    }
    return this.browser;
  }

  /**
   * Generate PDF from HTML content
   * @param html HTML content to convert to PDF
   * @param options PDF generation options
   * @returns Buffer containing the PDF data
   */
  async generatePdfFromHtml(
    html: string,
    options?: {
      format?: 'A4' | 'Letter';
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      displayHeaderFooter?: boolean;
      headerTemplate?: string;
      footerTemplate?: string;
    },
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    let page: Page | null = null;

    try {
      this.logger.log('Creating new page for PDF generation...');
      page = await browser.newPage();

      // Set content with proper encoding
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Default options
      const pdfOptions = {
        format: options?.format || 'A4',
        margin: options?.margin || {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        displayHeaderFooter: options?.displayHeaderFooter || false,
        headerTemplate: options?.headerTemplate || '',
        footerTemplate: options?.footerTemplate || '',
        printBackground: true,
      };

      this.logger.log('Generating PDF with options:', pdfOptions);
      const pdfBuffer = await page.pdf(pdfOptions as any);

      this.logger.log(`PDF generated successfully (${pdfBuffer.length} bytes)`);
      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error('Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Save PDF buffer to file
   * @param pdfBuffer PDF data buffer
   * @param filePath Full path where to save the PDF
   */
  async savePdfToFile(pdfBuffer: Buffer, filePath: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, pdfBuffer);
      this.logger.log(`PDF saved to: ${filePath}`);
    } catch (error) {
      this.logger.error('Error saving PDF to file:', error);
      throw new Error(`Failed to save PDF: ${error.message}`);
    }
  }

  /**
   * Generate default HTML template for reports
   * @param reportData Report data to include in the template
   * @returns HTML string
   */
  generateReportHtml(reportData: {
    title: string;
    summary?: string;
    content?: any;
    createdAt: Date;
    author: string;
  }): string {
    const { title, summary, content, createdAt, author } = reportData;

    return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Sarabun', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
    }
    
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 3px solid #2c5282;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #2c5282;
      margin-bottom: 10px;
    }
    
    .header .subtitle {
      font-size: 16px;
      color: #666;
    }
    
    .meta-info {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background-color: #f7fafc;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .meta-item {
      font-size: 13px;
    }
    
    .meta-item strong {
      color: #2c5282;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #2c5282;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .content {
      padding: 15px;
      background-color: #fff;
      border-left: 4px solid #4299e1;
      margin-bottom: 15px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    table th,
    table td {
      padding: 10px;
      text-align: left;
      border: 1px solid #e2e8f0;
    }
    
    table th {
      background-color: #edf2f7;
      font-weight: 600;
      color: #2d3748;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ระบบจัดการภัยพิบัติ อบต.เวียง</h1>
    <div class="subtitle">Guardian Route Dashboard</div>
  </div>

  <div class="meta-info">
    <div class="meta-item">
      <strong>วันที่สร้าง:</strong> ${new Date(createdAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </div>
    <div class="meta-item">
      <strong>ผู้จัดทำ:</strong> ${author}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">${title}</h2>
    ${summary ? `<div class="content"><p>${summary}</p></div>` : ''}
  </div>

  ${
    content
      ? `
  <div class="section">
    <h2 class="section-title">รายละเอียด</h2>
    <div class="content">
      <pre style="white-space: pre-wrap; font-family: 'Sarabun', sans-serif;">${JSON.stringify(content, null, 2)}</pre>
    </div>
  </div>
  `
      : ''
  }

  <div class="footer">
    <p>สร้างโดยระบบ Guardian Route Dashboard</p>
    <p>องค์การบริหารส่วนตำบลเวียง อำภอดอยเต่า จังหวัดเชียงใหม่</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Cleanup browser instance
   */
  async onModuleDestroy() {
    if (this.browser) {
      this.logger.log('Closing Puppeteer browser...');
      await this.browser.close();
      this.browser = null;
    }
  }
}
