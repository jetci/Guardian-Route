import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PhotosService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'incidents');

  constructor(private prisma: PrismaService) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  async uploadPhoto(
    incidentId: string,
    file: Express.Multer.File,
    userId: string,
  ) {
    // Verify incident exists and user has permission
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    // Check if user is the creator or has appropriate role
    if (incident.createdById !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!['ADMIN', 'SUPERVISOR', 'EXECUTIVE'].includes(user.role)) {
        throw new BadRequestException('You do not have permission to upload photos to this incident');
      }
    }

    // Save file
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);

    // Get current photos array
    const currentPhotos = (incident.photos as string[]) || [];
    const photoUrl = `/uploads/incidents/${filename}`;

    // Update incident with new photo
    await this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        photos: [...currentPhotos, photoUrl],
      },
    });

    return {
      id: filename,
      url: photoUrl,
      filename: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    };
  }

  async getPhotos(incidentId: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
      select: { photos: true },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    const photos = (incident.photos as string[]) || [];
    
    return photos.map((url, index) => ({
      id: path.basename(url),
      url,
      filename: path.basename(url),
      uploadedAt: null, // We don't store individual upload times
    }));
  }

  async deletePhoto(
    incidentId: string,
    photoId: string,
    userId: string,
  ) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    // Check permissions
    if (incident.createdById !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        throw new BadRequestException('You do not have permission to delete photos from this incident');
      }
    }

    const currentPhotos = (incident.photos as string[]) || [];
    const photoUrl = `/uploads/incidents/${photoId}`;
    
    if (!currentPhotos.includes(photoUrl)) {
      throw new NotFoundException('Photo not found');
    }

    // Delete file from filesystem
    try {
      const filepath = path.join(this.uploadDir, photoId);
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue even if file deletion fails
    }

    // Update incident
    await this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        photos: currentPhotos.filter(url => url !== photoUrl),
      },
    });

    return { message: 'Photo deleted successfully' };
  }
}
