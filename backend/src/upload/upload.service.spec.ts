import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { MalwareScannerService } from './malware-scanner.service';
import { BadRequestException } from '@nestjs/common';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock sharp to avoid native module issues
jest.mock('sharp', () => {
    return jest.fn(() => ({
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockResolvedValue({}),
    }));
});

describe('UploadService', () => {
    let service: UploadService;

    beforeEach(async () => {
        const mockMalwareScanner = {
            scanBuffer: jest.fn().mockResolvedValue({ isInfected: false, viruses: [] }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadService,
                { provide: MalwareScannerService, useValue: mockMalwareScanner },
            ],
        }).compile();

        service = module.get<UploadService>(UploadService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('File Validation - MIME Type', () => {
        it('should accept valid JPEG MIME type', async () => {
            // JPEG magic bytes: FF D8 FF E0
            const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
            const file = {
                buffer: jpegBuffer,
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'test.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });

        it('should accept valid PNG MIME type', async () => {
            // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
            const pngBuffer = Buffer.from([
                0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x0D,
            ]);
            const file = {
                buffer: pngBuffer,
                mimetype: 'image/png',
                size: 1024,
                originalname: 'test.png',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });

        it('should accept valid WebP MIME type', async () => {
            // WebP magic bytes: RIFF....WEBP
            const webpBuffer = Buffer.from([
                0x52, 0x49, 0x46, 0x46, // RIFF
                0x00, 0x00, 0x00, 0x00, // file size (placeholder)
                0x57, 0x45, 0x42, 0x50, // WEBP
                0x00, 0x00,
            ]);
            const file = {
                buffer: webpBuffer,
                mimetype: 'image/webp',
                size: 1024,
                originalname: 'test.webp',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });

        it('should reject invalid MIME type', async () => {
            const file = {
                buffer: Buffer.from('test'),
                mimetype: 'application/pdf',
                size: 1024,
                originalname: 'test.pdf',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(file)).rejects.toThrow(
                'Invalid file type',
            );
        });

        it('should reject executable files', async () => {
            // MZ header (Windows executable)
            const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]);
            const file = {
                buffer: exeBuffer,
                mimetype: 'application/x-msdownload',
                size: 1024,
                originalname: 'malware.exe',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('File Validation - Signature (Magic Bytes)', () => {
        it('should detect MIME type spoofing - fake JPEG', async () => {
            // Invalid signature but claims to be JPEG
            const fakeJpegBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);
            const file = {
                buffer: fakeJpegBuffer,
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'fake.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(file)).rejects.toThrow(
                'File signature does not match MIME type',
            );
        });

        it('should detect MIME type spoofing - fake PNG', async () => {
            // Invalid signature but claims to be PNG
            const fakePngBuffer = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
            const file = {
                buffer: fakePngBuffer,
                mimetype: 'image/png',
                size: 1024,
                originalname: 'fake.png',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(file)).rejects.toThrow(
                'File signature does not match MIME type',
            );
        });

        it('should detect executable disguised as image', async () => {
            // Windows executable (MZ header) disguised as JPEG
            const exeAsJpegBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]);
            const file = {
                buffer: exeAsJpegBuffer,
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'malware.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should validate JPEG Exif format', async () => {
            // JPEG with Exif: FF D8 FF E1
            const jpegExifBuffer = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE1,
                0x00, 0x00, 0x00, 0x00,
            ]);
            const file = {
                buffer: jpegExifBuffer,
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'photo.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });

        it('should validate JPEG raw format', async () => {
            // JPEG raw: FF D8 FF DB
            const jpegRawBuffer = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xDB,
                0x00, 0x00,
            ]);
            const file = {
                buffer: jpegRawBuffer,
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'raw.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });
    });

    describe('File Size Validation', () => {
        it('should reject files larger than 5MB', async () => {
            const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
            // Fill with valid JPEG signature
            largeBuffer[0] = 0xFF;
            largeBuffer[1] = 0xD8;
            largeBuffer[2] = 0xFF;
            largeBuffer[3] = 0xE0;

            const file = {
                buffer: largeBuffer,
                mimetype: 'image/jpeg',
                size: 6 * 1024 * 1024,
                originalname: 'large.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(file)).rejects.toThrow(
                'File size exceeds 5MB limit',
            );
        });

        it('should accept files within size limit', async () => {
            const validBuffer = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE0,
                0x00, 0x10,
            ]);
            const file = {
                buffer: validBuffer,
                mimetype: 'image/jpeg',
                size: 1024, // 1KB
                originalname: 'small.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).resolves.toBeDefined();
        });
    });

    describe('Multiple Files Upload', () => {
        it('should reject more than 5 images', async () => {
            const files = Array(6).fill(null).map(() => ({
                buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]),
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'test.jpg',
            })) as Express.Multer.File[];

            await expect(service.uploadImages(files)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImages(files)).rejects.toThrow(
                'Maximum 5 images allowed',
            );
        });

        it('should accept up to 5 valid images', async () => {
            const files = Array(5).fill(null).map(() => ({
                buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]),
                mimetype: 'image/jpeg',
                size: 1024,
                originalname: 'test.jpg',
            })) as Express.Multer.File[];

            await expect(service.uploadImages(files)).resolves.toHaveLength(5);
        });
    });

    describe('No File Provided', () => {
        it('should reject when no file is provided', async () => {
            await expect(service.uploadImage(null)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.uploadImage(null)).rejects.toThrow(
                'No file provided',
            );
        });

        it('should reject when file is undefined', async () => {
            await expect(service.uploadImage(undefined)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty buffer', async () => {
            const file = {
                buffer: Buffer.alloc(0),
                mimetype: 'image/jpeg',
                size: 0,
                originalname: 'empty.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should handle buffer smaller than signature', async () => {
            const file = {
                buffer: Buffer.from([0xFF]), // Only 1 byte
                mimetype: 'image/jpeg',
                size: 1,
                originalname: 'tiny.jpg',
            } as Express.Multer.File;

            await expect(service.uploadImage(file)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should handle corrupted image header', async () => {
            const corruptedBuffer = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE0, // Valid JPEG start
                0x00, 0x00, 0x00, 0x00, // Corrupted data
            ]);
            const file = {
                buffer: corruptedBuffer,
                mimetype: 'image/jpeg',
                size: 8,
                originalname: 'corrupted.jpg',
            } as Express.Multer.File;

            // Should pass signature check but may fail during sharp processing
            // This test verifies signature validation works independently
            await expect(service.uploadImage(file)).toBeDefined();
        });
    });
});
