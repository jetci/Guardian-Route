-- ตรวจสอบว่ามี backup หรือ transaction log
SELECT 
  schemaname,
  tablename,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE tablename = 'villages';

-- ดู recent changes (ถ้ามี audit log)
SELECT * FROM villages 
ORDER BY updated_at DESC 
LIMIT 20;
