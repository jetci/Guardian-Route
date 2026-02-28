-- ตรวจสอบหมู่ 1
SELECT 
  id,
  "villageNo",
  name,
  CASE 
    WHEN boundary IS NULL THEN 'NULL'
    ELSE 'HAS DATA'
  END as boundary_status,
  "updatedAt"
FROM villages 
WHERE "villageNo" = 1;
