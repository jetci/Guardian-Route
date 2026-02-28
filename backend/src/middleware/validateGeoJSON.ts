/**
 * GeoJSON Validation Middleware
 * Validates uploaded GeoJSON files for structure and content
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.geojson', '.json'];

/**
 * Validate file upload
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if file exists
    if (!req.file) {
      throw new ValidationError('กรุณาเลือกไฟล์ที่ต้องการอัปโหลด');
    }

    const file = req.file;

    // Validate file extension
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      throw new ValidationError('กรุณาเลือกไฟล์ .geojson หรือ .json เท่านั้น');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(`ไฟล์มีขนาดใหญ่เกิน 10MB (ขนาดปัจจุบัน: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate GeoJSON structure
 */
export const validateGeoJSONStructure = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ValidationError('ไม่พบไฟล์ที่ต้องการตรวจสอบ');
    }

    // Parse JSON
    let geoJSON: any;
    try {
      const fileContent = req.file.buffer.toString('utf-8');
      geoJSON = JSON.parse(fileContent);
    } catch (error) {
      throw new ValidationError('ไฟล์ไม่ใช่ JSON ที่ถูกต้อง');
    }

    // Validate GeoJSON type
    if (!geoJSON.type) {
      throw new ValidationError('GeoJSON ต้องมี property "type"');
    }

    // Validate FeatureCollection
    if (geoJSON.type !== 'FeatureCollection') {
      throw new ValidationError('GeoJSON ต้องเป็น FeatureCollection');
    }

    // Validate features array
    if (!Array.isArray(geoJSON.features)) {
      throw new ValidationError('GeoJSON ต้องมี property "features" เป็น array');
    }

    // Validate features count
    if (geoJSON.features.length === 0) {
      throw new ValidationError('GeoJSON ต้องมีอย่างน้อย 1 feature');
    }

    // Validate each feature
    for (let i = 0; i < geoJSON.features.length; i++) {
      const feature = geoJSON.features[i];

      // Check feature type
      if (feature.type !== 'Feature') {
        throw new ValidationError(`Feature ที่ ${i + 1} ต้องมี type เป็น "Feature"`);
      }

      // Check geometry
      if (!feature.geometry) {
        throw new ValidationError(`Feature ที่ ${i + 1} ต้องมี property "geometry"`);
      }

      // Check geometry type
      const validGeometryTypes = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'];
      if (!validGeometryTypes.includes(feature.geometry.type)) {
        throw new ValidationError(`Feature ที่ ${i + 1} มี geometry type ไม่ถูกต้อง`);
      }

      // Check coordinates
      if (!feature.geometry.coordinates) {
        throw new ValidationError(`Feature ที่ ${i + 1} ต้องมี property "coordinates"`);
      }
    }

    // Attach parsed GeoJSON to request
    req.body.parsedGeoJSON = geoJSON;
    req.body.featuresCount = geoJSON.features.length;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate data type parameter
 */
export const validateDataType = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dataType } = req.body;
    const validDataTypes = ['villages', 'flood_risk', 'fire_risk', 'custom'];

    if (!dataType) {
      throw new ValidationError('กรุณาระบุ dataType');
    }

    if (!validDataTypes.includes(dataType)) {
      throw new ValidationError(`dataType ต้องเป็นหนึ่งใน: ${validDataTypes.join(', ')}`);
    }

    next();
  } catch (error) {
    next(error);
  }
};
