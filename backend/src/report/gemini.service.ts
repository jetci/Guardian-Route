import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private readonly visionApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

  async analyzePhotos(photoUrls: string[]): Promise<any> {
    try {
      const prompt = `วิเคราะห์รูปภาพเหตุการณ์ภัยพิบัติและให้ข้อมูลในรูปแบบ JSON ดังนี้:
{
  "damageLevel": "ระดับความเสียหาย (ต่ำ/ปานกลาง/สูง/วิกฤต)",
  "affectedStructures": "โครงสร้างที่ได้รับผลกระทบ",
  "estimatedAffectedArea": จำนวนพื้นที่โดยประมาณ (ตารางเมตร),
  "visibleHazards": "อันตรายที่มองเห็นได้",
  "recommendations": "ข้อเสนอแนะเบื้องต้น",
  "confidence": ค่าความเชื่อมั่น 0-1
}

วิเคราะห์จากรูปภาพและให้ข้อมูลที่ละเอียดและเป็นประโยชน์`;

      // Note: This is a simplified version
      // In production, you would:
      // 1. Fetch images from URLs
      // 2. Convert to base64
      // 3. Send to Gemini Vision API with proper format
      
      const response = await fetch(`${this.visionApiUrl}?key=${this.apiKey}`, {
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
                // In production, add image parts here
                // {
                //   inline_data: {
                //     mime_type: 'image/jpeg',
                //     data: base64ImageData
                //   }
                // }
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.statusText}`);
      }

      const result = await response.json();
      const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Try to parse JSON from response
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                         analysisText.match(/```\n([\s\S]*?)\n```/) ||
                         [null, analysisText];
        const jsonStr = jsonMatch[1] || analysisText;
        return JSON.parse(jsonStr);
      } catch (parseError) {
        this.logger.warn('Could not parse JSON from Gemini response, returning text');
        // Return structured fallback
        return {
          damageLevel: 'ไม่สามารถประเมินได้',
          affectedStructures: analysisText,
          estimatedAffectedArea: 0,
          visibleHazards: 'กรุณาตรวจสอบรูปภาพด้วยตนเอง',
          recommendations: 'กรุณาเพิ่มข้อมูลเพิ่มเติม',
          confidence: 0.5,
        };
      }
    } catch (error) {
      this.logger.error('Error analyzing photos:', error);
      throw new Error('ไม่สามารถวิเคราะห์รูปภาพได้');
    }
  }
}
