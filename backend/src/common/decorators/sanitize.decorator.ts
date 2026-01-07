import { Transform } from 'class-transformer';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Decorator สำหรับ sanitize HTML - ลบ HTML tags ทั้งหมด
 * ใช้สำหรับ input ที่ไม่ควรมี HTML เลย เช่น title, name
 */
export function SanitizeHtml() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            return DOMPurify.sanitize(value, {
                ALLOWED_TAGS: [], // ไม่อนุญาต HTML tags ใดๆ
                ALLOWED_ATTR: [],
            });
        }
        return value;
    });
}

/**
 * Decorator สำหรับอนุญาต HTML พื้นฐาน - สำหรับ rich text
 * ใช้สำหรับ description, content ที่ต้องการ basic formatting
 */
export function SanitizeHtmlAllowBasic() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            return DOMPurify.sanitize(value, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
                ALLOWED_ATTR: [],
            });
        }
        return value;
    });
}

/**
 * Decorator สำหรับ trim whitespace
 */
export function Trim() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
        return value;
    });
}

/**
 * Decorator สำหรับ sanitize และ trim
 */
export function SanitizeAndTrim() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            const sanitized = DOMPurify.sanitize(value, {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
            });
            return sanitized.trim();
        }
        return value;
    });
}
