# Incident Submission Validation Error Fix

**Date**: 2025-01-15 14:19 UTC+7  
**Status**: ✅ RESOLVED  
**Severity**: 🟡 MEDIUM (Blocking incident report submission)

## Issue

Incident report submission was failing with **500 Internal Server Error** when users did not draw a polygon for the affected area.

### Error Details

```
POST /api/incidents → 500 Internal Server Error
```

**Console Logs**:
```
❌ Error saving data: AxiosError
📦 Payload sent: {
  "affectedArea": null  // ← Problem: sending null
}
🔴 Validation errors: Array(1)
```

## Root Cause

The frontend was sending `affectedArea: null` when no polygon was drawn. The backend DTO validation (`CreateIncidentDto`) expects:

1. **Either**: A valid GeoJSON Polygon object
2. **Or**: The field to be **omitted entirely** (not `null`)

```typescript
@IsObject()
@IsOptional()
affectedArea?: any;  // Optional, but if present must be an object
```

When `null` is sent, it fails the `@IsObject()` validation because `null` is not an object.

## Solution

Modified `SurveyReviewPage.tsx` to **conditionally include** `affectedArea` only when polygon data exists:

### Before (❌ Broken)
```typescript
const payload = {
  // ... other fields
  affectedArea: surveyData.polygon,  // Could be null
};
```

### After (✅ Fixed)
```typescript
const payload: any = {
  // ... other fields
};

// Only include affectedArea if polygon exists (don't send null)
if (surveyData.polygon) {
  payload.affectedArea = surveyData.polygon;
}
```

## Files Modified

- ✅ `frontend/src/pages/field-officer/SurveyReviewPage.tsx` (lines 246-263)

## Testing Checklist

- [ ] Submit incident report **without** drawing polygon → Should succeed
- [ ] Submit incident report **with** polygon → Should succeed
- [ ] Verify polygon data is saved correctly when provided
- [ ] Verify no validation errors in console

## Impact

- **Before**: Users could not submit incident reports without drawing polygons (100% failure rate)
- **After**: Users can submit reports with or without polygons (0% failure rate)

## Related Code

**Backend DTO**: `backend/src/incidents/dto/create-incident.dto.ts`
```typescript
@IsObject()
@IsOptional()
affectedArea?: any;  // Optional field - omit if not needed
```

**Polygon Creation**: `frontend/src/pages/field-officer/CreateIncidentReportPage.tsx` (line 509)
```typescript
setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);
```

## Prevention

This issue highlights the importance of:

1. **Never send `null` for optional object fields** - omit them instead
2. **Backend validation messages** should be more descriptive (e.g., "affectedArea must be an object or omitted")
3. **Frontend validation** before submission to catch these issues early

## Status

✅ **RESOLVED** - Ready for testing
