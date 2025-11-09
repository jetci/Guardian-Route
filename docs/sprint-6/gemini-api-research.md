# Gemini API Research for Sprint 6

**Research Date:** Nov 09, 2025  
**Purpose:** Design AI integration strategy for Full Report System

---

## 1. Gemini API Capabilities

### Multimodal Image Understanding
- **Native multimodal support:** Gemini models can process images, text, code, and video
- **No specialized ML training required:** Built-in capabilities for image analysis
- **Use cases:** Image captioning, classification, visual question answering, object detection, segmentation

### Key Features for Disaster Assessment
1. **Object Detection** - Detect objects with bounding box coordinates
2. **Segmentation** - Identify and segment different regions in images
3. **Visual Question Answering** - Answer questions about image content
4. **Damage Classification** - Classify severity and type of damage

---

## 2. API Methods for Image Input

### Method 1: Inline Image Data (Recommended for < 20MB)
```python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key="YOUR_API_KEY")
image = Image.open("/path/to/image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[image, "Analyze this disaster scene and describe the damage"],
)
```

### Method 2: File API (Recommended for larger files)
```python
# Upload file first
file = client.files.upload(path="/path/to/image.png")

# Use in request
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[file, "Analyze this disaster scene"],
)
```

---

## 3. Recommended Models

| Model | Best For | Context Window | Speed |
|:---|:---|:---|:---|
| **gemini-2.5-flash** | Fast analysis, real-time | 1M tokens | Fastest |
| **gemini-2.5-pro** | Complex analysis | 1M tokens | Slower but more accurate |
| **gemini-2.0-flash** | Object detection, segmentation | - | Fast |

**Recommendation:** Use `gemini-2.5-flash` for Sprint 6 (balance of speed and accuracy)

---

## 4. Structured Output for Disaster Analysis

### Request Format
```python
config = types.GenerateContentConfig(
    response_mime_type="application/json",
    response_schema={
        "type": "object",
        "properties": {
            "damageLevel": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
            "damageType": {"type": "array", "items": {"type": "string"}},
            "affectedStructures": {"type": "array", "items": {"type": "string"}},
            "riskFactors": {"type": "array", "items": {"type": "string"}},
            "summary": {"type": "string"},
            "confidence": {"type": "number"}
        }
    }
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[image, prompt],
    config=config
)
```

---

## 5. Implementation Strategy for Sprint 6

### Backend (NestJS)
1. **Update `gemini.service.ts`:**
   - Add method `analyzeDisasterImages(images: File[]): Promise<AIAnalysisResult>`
   - Use File API for images > 20MB
   - Use inline data for smaller images
   - Return structured JSON response

2. **Create new endpoint:**
   - `POST /api/reports/analyze-images`
   - Accept multiple images (max 5)
   - Return AI analysis result

3. **Data Model:**
```typescript
interface AIAnalysisResult {
  damageLevel: 'low' | 'medium' | 'high' | 'critical';
  damageTypes: string[];
  affectedStructures: string[];
  riskFactors: string[];
  summary: string;
  confidence: number;
  tags: string[];
}
```

### Frontend (React)
1. **Image Upload Component:**
   - Drag & drop or file picker
   - Preview uploaded images
   - Max 5 images, 20MB each

2. **AI Analysis Display:**
   - Show analysis results
   - Allow editing of AI-generated content
   - "🔁 Re-analyze" button
   - "✏️ Edit" mode

---

## 6. Prompt Engineering for Disaster Assessment

### Recommended Prompt Template
```
วิเคราะห์ภาพภัยพิบัติต่อไปนี้และให้ข้อมูลดังนี้:

1. ระดับความเสียหาย (low, medium, high, critical)
2. ประเภทความเสียหาย (เช่น อาคารพัง, น้ำท่วม, ไฟไหม้)
3. โครงสร้างที่ได้รับผลกระทบ (เช่น บ้านเรือน, ถนน, สะพาน)
4. ปัจจัยเสี่ยง (เช่น โครงสร้างไม่มั่นคง, พื้นที่เสี่ยงดินถล่ม)
5. สรุปสถานการณ์โดยรวม

กรุณาตอบเป็น JSON format ตามโครงสร้างที่กำหนด
```

---

## 7. Cost Estimation

### Gemini 2.5 Flash Pricing
- **Input:** $0.075 per 1M tokens
- **Output:** $0.30 per 1M tokens
- **Image tokens:** ~258 tokens per image (typical)

### Estimated Cost per Report
- 5 images × 258 tokens = 1,290 input tokens
- Prompt: ~200 tokens
- Response: ~500 tokens
- **Total:** ~$0.001 per report (negligible)

---

## 8. Rate Limits & Quotas

- **Free tier:** 15 requests per minute
- **Paid tier:** 1,000 requests per minute
- **File size limit:** 20MB per file (inline), unlimited (File API)

---

## 9. Error Handling

### Common Errors
1. **Image too large:** Use File API instead
2. **Unsupported format:** Convert to PNG/JPEG
3. **Rate limit exceeded:** Implement retry with exponential backoff
4. **API key invalid:** Check environment variables

### Retry Strategy
```typescript
async function analyzeWithRetry(images: File[], maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await geminiService.analyzeImages(images);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(2 ** i * 1000); // Exponential backoff
    }
  }
}
```

---

## 10. References

- [Gemini API Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Intelligent Disaster Assessment with Gemini (Kaggle)](https://www.kaggle.com/code/ohdokingde/intelligent-disaster-assessment-with-gemini)
- [RapidRelief Disaster Recovery Assistant](https://dev.to/sharafon/rapidrelief-ai-2025-5x-faster-damage-assessment-rescue-guide-2lf9)
