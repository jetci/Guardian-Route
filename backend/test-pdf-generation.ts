import { PrismaClient } from '@prisma/client';
import { PdfGeneratorService } from './src/report/pdf-generator.service';
import * as path from 'path';

async function testPdfGeneration() {
  console.log('🧪 Testing PDF Generation Service...\n');

  const prisma = new PrismaClient();
  const pdfService = new PdfGeneratorService();

  try {
    // 1. Check database connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // 2. Get a test report
    console.log('2️⃣ Fetching a test report...');
    const report = await prisma.report.findFirst({
      include: {
        author: true,
      },
    });

    if (!report) {
      console.log('❌ No reports found in database');
      console.log('Creating a test report...\n');

      // Create a test user if not exists
      let testUser = await prisma.user.findFirst({
        where: { email: 'admin@obtwiang.go.th' },
      });

      if (!testUser) {
        console.log('❌ No test user found. Please run seed first.');
        process.exit(1);
      }

      // Create test report
      const newReport = await prisma.report.create({
        data: {
          title: 'รายงานทดสอบการสร้าง PDF',
          summary: 'นี่คือรายงานทดสอบระบบสร้าง PDF อัตโนมัติ',
          content: {
            sections: [
              {
                title: 'ข้อมูลทั่วไป',
                content: 'ระบบสามารถสร้าง PDF จากข้อมูลรายงานได้สำเร็จ',
              },
              {
                title: 'รายละเอียด',
                content: 'ทดสอบการแสดงผลภาษาไทยและการจัดรูปแบบ',
              },
            ],
          },
          type: 'CUSTOM',
          status: 'DRAFT',
          authorId: testUser.id,
        },
        include: {
          author: true,
        },
      });

      console.log(`✅ Test report created: ${newReport.id}\n`);
      
      // Use the new report
      const reportToTest = newReport;
      
      // 3. Generate HTML
      console.log('3️⃣ Generating HTML template...');
      const html = pdfService.generateReportHtml({
        title: reportToTest.title,
        summary: reportToTest.summary || undefined,
        content: reportToTest.content || undefined,
        createdAt: reportToTest.createdAt,
        author: `${reportToTest.author.firstName || ''} ${reportToTest.author.lastName || ''}`.trim() || 'Unknown',
      });
      console.log(`✅ HTML generated (${html.length} characters)\n`);

      // 4. Generate PDF
      console.log('4️⃣ Generating PDF from HTML...');
      const pdfBuffer = await pdfService.generatePdfFromHtml(html);
      console.log(`✅ PDF generated (${pdfBuffer.length} bytes)\n`);

      // 5. Save PDF to file
      console.log('5️⃣ Saving PDF to file...');
      const outputDir = path.join(process.cwd(), 'uploads', 'reports');
      const filename = `test-report-${reportToTest.id}-${Date.now()}.pdf`;
      const filePath = path.join(outputDir, filename);
      
      await pdfService.savePdfToFile(pdfBuffer, filePath);
      console.log(`✅ PDF saved to: ${filePath}\n`);

      // 6. Update report in database
      console.log('6️⃣ Updating report in database...');
      await prisma.report.update({
        where: { id: reportToTest.id },
        data: {
          pdfUrl: `/uploads/reports/${filename}`,
          pdfGeneratedAt: new Date(),
          status: 'READY',
        },
      });
      console.log('✅ Report updated in database\n');

      console.log('🎉 All tests passed successfully!');
      console.log(`\n📄 Test Report ID: ${reportToTest.id}`);
      console.log(`📁 PDF Location: ${filePath}`);
      console.log(`📊 PDF Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
      
    } else {
      console.log(`✅ Found report: ${report.id}\n`);

      // 3. Generate HTML
      console.log('3️⃣ Generating HTML template...');
      const html = pdfService.generateReportHtml({
        title: report.title,
        summary: report.summary || undefined,
        content: report.content || undefined,
        createdAt: report.createdAt,
        author: `${report.author.firstName || ''} ${report.author.lastName || ''}`.trim() || 'Unknown',
      });
      console.log(`✅ HTML generated (${html.length} characters)\n`);

      // 4. Generate PDF
      console.log('4️⃣ Generating PDF from HTML...');
      const pdfBuffer = await pdfService.generatePdfFromHtml(html);
      console.log(`✅ PDF generated (${pdfBuffer.length} bytes)\n`);

      // 5. Save PDF to file
      console.log('5️⃣ Saving PDF to file...');
      const outputDir = path.join(process.cwd(), 'uploads', 'reports');
      const filename = `test-report-${report.id}-${Date.now()}.pdf`;
      const filePath = path.join(outputDir, filename);
      
      await pdfService.savePdfToFile(pdfBuffer, filePath);
      console.log(`✅ PDF saved to: ${filePath}\n`);

      // 6. Update report in database
      console.log('6️⃣ Updating report in database...');
      await prisma.report.update({
        where: { id: report.id },
        data: {
          pdfUrl: `/uploads/reports/${filename}`,
          pdfGeneratedAt: new Date(),
          status: 'READY',
        },
      });
      console.log('✅ Report updated in database\n');

      console.log('🎉 All tests passed successfully!');
      console.log(`\n📄 Test Report ID: ${report.id}`);
      console.log(`📁 PDF Location: ${filePath}`);
      console.log(`📊 PDF Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pdfService.onModuleDestroy();
  }
}

// Run test
testPdfGeneration();
