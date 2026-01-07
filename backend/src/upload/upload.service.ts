import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MalwareScannerService } from './malware-scanner.service';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly malwareScannerService: MalwareScannerService) { }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validate file
    this.validateFile(file);

    // Scan for malware
    const scanResult = await this.malwareScannerService.scanBuffer(file.buffer);
    if (scanResult.isInfected) {
      throw new BadRequestException(
        `File contains malware: ${scanResult.viruses.join(', ')}`
      );
    }

    // Generate unique filename
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.uploadDir, filename);

    // Optimize and save image
    await sharp(file.buffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Return URL
    return `/uploads/${filename}`;
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    if (files.length > 5) {
      throw new BadRequestException('Maximum 5 images allowed');
    }

    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      // File doesn't exist or already deleted
      console.error('Error deleting file:', error);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed',
      );
    }

    // Validate file signature (magic bytes)
    if (!this.validateFileSignature(file)) {
      throw new BadRequestException(
        'File signature does not match MIME type. Possible file type spoofing detected.',
      );
    }
  }

  /**
   * Validate file signature (magic bytes) to prevent MIME type spoofing
   * @param file - The uploaded file to validate
   * @returns true if signature matches MIME type, false otherwise
   */
  private validateFileSignature(file: Express.Multer.File): boolean {
    const buffer = file.buffer;

    // File signatures (magic bytes) for supported formats
    const signatures = {
      jpeg: [
        [0xFF, 0xD8, 0xFF, 0xE0], // JPEG JFIF
        [0xFF, 0xD8, 0xFF, 0xE1], // JPEG Exif
        [0xFF, 0xD8, 0xFF, 0xE2], // JPEG
        [0xFF, 0xD8, 0xFF, 0xE3], // JPEG
        [0xFF, 0xD8, 0xFF, 0xDB], // JPEG raw
      ],
      png: [
        [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
      ],
      webp: [
        [0x52, 0x49, 0x46, 0x46], // RIFF (WebP container)
      ],
    };

    // Check JPEG
    if (file.mimetype === 'image/jpeg') {
      return signatures.jpeg.some(sig => this.checkSignature(buffer, sig));
    }

    // Check PNG
    if (file.mimetype === 'image/png') {
      return signatures.png.some(sig => this.checkSignature(buffer, sig));
    }

    // Check WebP (need to verify RIFF + WEBP)
    if (file.mimetype === 'image/webp') {
      const hasRiff = this.checkSignature(buffer, signatures.webp[0]);
      const hasWebp = buffer.length >= 12 &&
        buffer[8] === 0x57 && // W
        buffer[9] === 0x45 && // E
        buffer[10] === 0x42 && // B
        buffer[11] === 0x50;   // P
      return hasRiff && hasWebp;
    }

    return false;
  }

  /**
   * Check if buffer starts with the given signature
   */
  private checkSignature(buffer: Buffer, signature: number[]): boolean {
    if (buffer.length < signature.length) {
      return false;
    }

    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        return false;
      }
    }

    return true;
  }
}
