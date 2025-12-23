/**
 * Survey Validation Tests
 * Unit tests for surveyValidation.ts
 */

import { validateSurveyForm, type SurveyFormData } from '../surveyValidation';

describe('surveyValidation', () => {
    describe('validateSurveyForm', () => {
        const validData: SurveyFormData = {
            village: 'village-123',
            villageName: 'หมู่ 1',
            disasterType: 'น้ำท่วม',
            severity: '3',
            estimatedHouseholds: '50',
            notes: 'ทดสอบรายงานน้ำท่วมพื้นที่หมู่บ้าน',
            latitude: 19.9167,
            longitude: 99.8833,
            polygon: { type: 'Polygon', coordinates: [[[]]] }
        };

        it('should pass validation with valid data', () => {
            const errors = validateSurveyForm(validData);
            expect(Object.keys(errors)).toHaveLength(0);
        });

        it('should return error when village and villageName are missing', () => {
            const data = { ...validData, village: undefined, villageName: undefined };
            const errors = validateSurveyForm(data);
            expect(errors.village).toBe('กรุณาเลือกหมู่บ้านหรือระบุชื่อหมู่บ้าน');
        });

        it('should return error when disasterType is empty', () => {
            const data = { ...validData, disasterType: '' };
            const errors = validateSurveyForm(data);
            expect(errors.disasterType).toBe('กรุณาเลือกประเภทภัย');
        });

        it('should return error when severity is out of range', () => {
            const data = { ...validData, severity: '6' };
            const errors = validateSurveyForm(data);
            expect(errors.severity).toContain('1-5');
        });

        it('should return error when severity is not a number', () => {
            const data = { ...validData, severity: 'abc' };
            const errors = validateSurveyForm(data);
            expect(errors.severity).toContain('1-5');
        });

        it('should return error when estimatedHouseholds is negative', () => {
            const data = { ...validData, estimatedHouseholds: '-5' };
            const errors = validateSurveyForm(data);
            expect(errors.estimatedHouseholds).toBe('กรุณาระบุจำนวนครัวเรือนที่ถูกต้อง');
        });

        it('should return error when notes are too short', () => {
            const data = { ...validData, notes: 'สั้น' };
            const errors = validateSurveyForm(data);
            expect(errors.notes).toContain('10 ตัวอักษร');
        });

        it('should return error when location is missing', () => {
            const data = {
                ...validData,
                latitude: undefined,
                longitude: undefined,
                polygon: undefined
            };
            const errors = validateSurveyForm(data);
            expect(errors.location).toContain('GPS หรือวาดพื้นที่');
        });

        it('should accept location with only GPS coordinates', () => {
            const data = { ...validData, polygon: undefined };
            const errors = validateSurveyForm(data);
            expect(errors.location).toBeUndefined();
        });

        it('should accept location with only polygon', () => {
            const data = { ...validData, latitude: undefined, longitude: undefined };
            const errors = validateSurveyForm(data);
            expect(errors.location).toBeUndefined();
        });

        it('should return multiple errors for multiple invalid fields', () => {
            const data = {
                disasterType: '',
                severity: '10',
                estimatedHouseholds: '-1',
                notes: 'สั้น'
            } as SurveyFormData;

            const errors = validateSurveyForm(data);
            expect(Object.keys(errors).length).toBeGreaterThan(3);
        });
    });
});
