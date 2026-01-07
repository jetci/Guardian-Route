-- Add composite indexes for better query performance
-- BUG-DB-001: Missing composite indexes

-- Incidents: ค้นหาด้วย status + priority (common query pattern)
CREATE INDEX IF NOT EXISTS "idx_incidents_status_priority" ON "incidents"("status", "priority");

-- Incidents: ค้นหาด้วย village + status
CREATE INDEX IF NOT EXISTS "idx_incidents_village_status" ON "incidents"("village_id", "status");

-- Incidents: ค้นหาด้วย assigned user + status
CREATE INDEX IF NOT EXISTS "idx_incidents_assigned_status" ON "incidents"("assigned_to_id", "status");

-- Tasks: ค้นหาด้วย assigned user + status (very common)
CREATE INDEX IF NOT EXISTS "idx_tasks_assigned_status" ON "tasks"("assigned_to_id", "status");

-- Tasks: ค้นหาด้วย incident + status
CREATE INDEX IF NOT EXISTS "idx_tasks_incident_status" ON "tasks"("incident_id", "status");

-- Tasks: ค้นหาด้วย village + status
CREATE INDEX IF NOT EXISTS "idx_tasks_village_status" ON "tasks"("village_id", "status");

-- User Notifications: ค้นหาด้วย user + read status (very common)
CREATE INDEX IF NOT EXISTS "idx_user_notifications_user_read" ON "user_notifications"("user_id", "is_read");

-- Reports: ค้นหาด้วย type + status
CREATE INDEX IF NOT EXISTS "idx_reports_type_status" ON "reports"("type", "status");

-- Reports: ค้นหาด้วย author + status
CREATE INDEX IF NOT EXISTS "idx_reports_author_status" ON "reports"("author_id", "status");

-- Field Surveys: ค้นหาด้วย field officer + status
CREATE INDEX IF NOT EXISTS "idx_field_surveys_officer_status" ON "field_surveys"("field_officer_id", "status");

-- Activity Logs: ค้นหาด้วย user + action
CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_action" ON "activity_logs"("user_id", "action");

-- Activity Logs: ค้นหาด้วย entity + created_at (for timeline queries)
CREATE INDEX IF NOT EXISTS "idx_activity_logs_entity_created" ON "activity_logs"("entity", "created_at");

-- Activity Logs: ค้นหาด้วย entity_id + entity_type
CREATE INDEX IF NOT EXISTS "idx_activity_logs_entity_id_type" ON "activity_logs"("entity_id", "entity");
