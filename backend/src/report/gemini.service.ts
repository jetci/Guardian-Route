import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  async analyzeIncidentReport(data: {
    title: string;
    description: string;
    severity: string;
    affectedHouseholds: number;
    affectedPopulation: number;
    infrastructureDamage?: string;
    casualties?: number;
    injuries?: number;
  }): Promise<string> {
    try {
      const prompt = `วิเคราะห์รายงานเหตุการณ์ภัยพิบัติต่อไปนี้และให้คำแนะนำ:

หัวข้อ: ${data.title}
รายละเอียด: ${data.description}
ระดับความรุนแรง: ${data.severity}
ครัวเรือนที่ได้รับผลกระทบ: ${data.affectedHouseholds}
ประชากรที่ได้รับผลกระทบ: ${data.affectedPopulation}
${data.infrastructureDamage ? `ความเสียหายโครงสร้างพื้นฐาน: ${data.infrastructureDamage}` : ''}
${data.casualties ? `ผู้เสียชีวิต: ${data.casualties}` : ''}
${data.injuries ? `ผู้บาดเจ็บ: ${data.injuries}` : ''}

กรุณาวิเคราะห์และให้คำแนะนำในหัวข้อต่อไปนี้:
1. การประเมินสถานการณ์
2. ความเร่งด่วนในการตอบสนอง
3. ทรัพยากรที่จำเป็น
4. มาตรการป้องกันในอนาคต
5. ข้อเสนอแนะเพิ่มเติม`;

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const analysis = result.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถวิเคราะห์ได้';

      return analysis;
    } catch (error) {
      this.logger.error('Error calling Gemini API:', error);
      return 'เกิดข้อผิดพลาดในการวิเคราะห์ด้วย AI กรุณาลองใหม่อีกครั้ง';
    }
  }

  async analyzePhotos(photoUrls: string[]): Promise<string> {
    try {
      const prompt = `วิเคราะห์รูปภาพเหตุการณ์ภัยพิบัติ ${photoUrls.length} รูป และสรุปสิ่งที่พบเห็น ความเสียหาย และสภาพพื้นที่`;

      // Note: Gemini Vision API requires different endpoint
      // For now, return placeholder
      return `การวิเคราะห์รูปภาพ ${photoUrls.length} รูป: กรุณาตรวจสอบรูปภาพและเพิ่มรายละเอียดเพิ่มเติม`;
    } catch (error) {
      this.logger.error('Error analyzing photos:', error);
      return 'ไม่สามารถวิเคราะห์รูปภาพได้';
    }
  }
}
