import { plainToClass } from 'class-transformer';
import { SanitizeHtml, SanitizeHtmlAllowBasic, SanitizeAndTrim, Trim } from './sanitize.decorator';

// Mock isomorphic-dompurify with improved script tag handling
jest.mock('isomorphic-dompurify', () => ({
    __esModule: true,
    default: {
        sanitize: jest.fn((dirty: string, config?: any) => {
            if (!dirty || typeof dirty !== 'string') return dirty;

            let clean = dirty;

            // Always remove script tags with their content first
            clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

            if (!config || !config.ALLOWED_TAGS || config.ALLOWED_TAGS.length === 0) {
                // Remove all remaining HTML tags
                clean = clean.replace(/<[^>]*>/g, '');
                return clean.trim();
            } else {
                // Remove event handlers
                clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
                // Remove dangerous protocols
                clean = clean.replace(/javascript:/gi, '');
                clean = clean.replace(/data:text\/html/gi, '');
                return clean;
            }
        }),
    },
}));

class TestDto {
    @SanitizeHtml()
    title: string;

    @SanitizeHtmlAllowBasic()
    description: string;

    @SanitizeAndTrim()
    name: string;

    @Trim()
    email: string;
}

describe('Sanitize Decorators', () => {
    describe('SanitizeHtml', () => {
        it('should remove all HTML tags', () => {
            const input = { title: '<script>alert("XSS")</script>Hello' };
            const result = plainToClass(TestDto, input);

            expect(result.title).toBe('Hello');
            expect(result.title).not.toContain('<script>');
        });

        it('should remove dangerous attributes', () => {
            const input = { title: '<img src=x onerror="alert(1)">' };
            const result = plainToClass(TestDto, input);

            expect(result.title).not.toContain('onerror');
            expect(result.title).not.toContain('<img');
        });

        it('should handle normal text', () => {
            const input = { title: 'Normal text without HTML' };
            const result = plainToClass(TestDto, input);

            expect(result.title).toBe('Normal text without HTML');
        });
    });

    describe('SanitizeHtmlAllowBasic', () => {
        it('should allow basic formatting tags', () => {
            const input = { description: '<p>Hello <strong>World</strong></p>' };
            const result = plainToClass(TestDto, input);

            expect(result.description).toContain('Hello');
            expect(result.description).toContain('World');
        });

        it('should remove dangerous tags', () => {
            const input = { description: '<script>alert("XSS")</script><p>Safe</p>' };
            const result = plainToClass(TestDto, input);

            expect(result.description).not.toContain('<script>');
            expect(result.description).toContain('Safe');
        });
    });

    describe('SanitizeAndTrim', () => {
        it('should sanitize and trim whitespace', () => {
            const input = { name: '  <script>alert(1)</script>  John Doe  ' };
            const result = plainToClass(TestDto, input);

            expect(result.name).toBe('John Doe');
            expect(result.name).not.toContain('<script>');
            expect(result.name).not.toContain('alert');
        });
    });

    describe('Trim', () => {
        it('should trim leading and trailing whitespace', () => {
            const input = { email: '  user@example.com  ' };
            const result = plainToClass(TestDto, input);

            expect(result.email).toBe('user@example.com');
        });
    });

    describe('XSS Protection', () => {
        it('should block event handlers', () => {
            const input = {
                title: '<div onload="alert(1)" onclick="alert(2)">Text</div>'
            };
            const result = plainToClass(TestDto, input);

            expect(result.title).not.toContain('onload');
            expect(result.title).not.toContain('onclick');
            expect(result.title).toContain('Text');
        });
    });
});
