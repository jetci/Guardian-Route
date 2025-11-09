import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Role Management Module
 * 
 * Test Cases:
 * - TC-RM-001: View All Roles
 * - TC-RM-002: Create New Role
 * - TC-RM-003: Edit Existing Role
 * - TC-RM-004: Delete Role
 */

test.describe('Role Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to Role Management page
    await page.goto('/admin/role-management');
    await page.waitForLoadState('networkidle');
  });

  test('TC-RM-001: View All Roles', async ({ page }) => {
    // Verify page loaded
    await expect(page).toHaveURL(/\/admin\/role-management/);

    // Click on Roles tab (บทบาท)
    const rolesTab = page.locator('button:has-text("บทบาท"), [role="tab"]:has-text("บทบาท")').first();
    await rolesTab.click();

    // Wait for roles table to load
    await page.waitForTimeout(1000);

    // Verify roles table is visible
    const rolesTable = page.locator('table, [data-testid="roles-table"]');
    await expect(rolesTable).toBeVisible({ timeout: 5000 });

    // Verify table headers
    const headers = ['ชื่อบทบาท', 'รหัส', 'จำนวนผู้ใช้', 'จำนวนสิทธิ์', 'การจัดการ'];
    for (const header of headers) {
      const headerElement = page.locator(`th:has-text("${header}"), td:has-text("${header}")`);
      const isVisible = await headerElement.count() > 0;
      expect(isVisible).toBeTruthy();
    }

    // Verify at least some roles are displayed
    const roleRows = page.locator('tbody tr, [data-testid="role-row"]');
    const rowCount = await roleRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('TC-RM-002: Create New Role', async ({ page }) => {
    // Click on Roles tab
    const rolesTab = page.locator('button:has-text("บทบาท"), [role="tab"]:has-text("บทบาท")').first();
    await rolesTab.click();
    await page.waitForTimeout(1000);

    // Click "Create Role" button
    const createButton = page.locator('button:has-text("สร้างบทบาทใหม่"), button:has-text("Create")').first();
    await createButton.click();

    // Wait for modal to open
    await page.waitForTimeout(500);

    // Verify modal is visible
    const modal = page.locator('[role="dialog"], .chakra-modal, [data-testid="create-role-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });

    // Fill in role details
    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="name"], input[placeholder*="รหัส"]', `TEST_ROLE_${timestamp}`);
    await page.fill('input[name="displayName"], input[placeholder*="display"], input[placeholder*="ชื่อแสดง"]', `ทดสอบบทบาท ${timestamp}`);
    await page.fill('textarea[name="description"], textarea[placeholder*="description"], textarea[placeholder*="คำอธิบาย"]', 'บทบาทสำหรับทดสอบ E2E');

    // Click Create button
    const submitButton = page.locator('button:has-text("สร้าง"), button:has-text("Create")').last();
    await submitButton.click();

    // Wait for success toast
    await page.waitForTimeout(1000);

    // Verify success toast appears
    const successToast = page.locator('[role="alert"], .chakra-alert, text=/สำเร็จ/i, text=/success/i');
    await expect(successToast.first()).toBeVisible({ timeout: 5000 });

    // Verify modal is closed
    await expect(modal).not.toBeVisible({ timeout: 3000 });

    // Verify new role appears in the list
    const newRole = page.locator(`text=/TEST_ROLE_${timestamp}/i`);
    await expect(newRole).toBeVisible({ timeout: 5000 });
  });

  test('TC-RM-003: Edit Existing Role', async ({ page }) => {
    // Click on Roles tab
    const rolesTab = page.locator('button:has-text("บทบาท"), [role="tab"]:has-text("บทบาท")').first();
    await rolesTab.click();
    await page.waitForTimeout(1000);

    // Find a role to edit (use FIELD_OFFICER as it's less critical)
    const roleRow = page.locator('tr:has-text("FIELD_OFFICER"), tr:has-text("เจ้าหน้าที่ภาคสนาม")').first();
    
    // Click action menu
    const actionMenu = roleRow.locator('button[aria-label*="menu"], button:has-text("⋮")').first();
    await actionMenu.click();
    await page.waitForTimeout(300);

    // Click Edit option
    const editOption = page.locator('button:has-text("แก้ไข"), [role="menuitem"]:has-text("แก้ไข")').first();
    await editOption.click();

    // Wait for modal to open
    await page.waitForTimeout(500);

    // Verify modal is visible
    const modal = page.locator('[role="dialog"], .chakra-modal');
    await expect(modal).toBeVisible({ timeout: 3000 });

    // Verify pre-filled data
    const displayNameInput = page.locator('input[name="displayName"], input[placeholder*="display"]');
    const currentValue = await displayNameInput.inputValue();
    expect(currentValue).toBeTruthy();

    // Change display name
    const timestamp = Date.now();
    await displayNameInput.fill(`เจ้าหน้าที่ภาคสนาม (แก้ไข ${timestamp})`);

    // Click Save button
    const saveButton = page.locator('button:has-text("บันทึก"), button:has-text("Save")').last();
    await saveButton.click();

    // Wait for success toast
    await page.waitForTimeout(1000);

    // Verify success toast appears
    const successToast = page.locator('[role="alert"], text=/สำเร็จ/i');
    await expect(successToast.first()).toBeVisible({ timeout: 5000 });

    // Verify modal is closed
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('TC-RM-004: Delete Role (should fail for roles with users)', async ({ page }) => {
    // Click on Roles tab
    const rolesTab = page.locator('button:has-text("บทบาท"), [role="tab"]:has-text("บทบาท")').first();
    await rolesTab.click();
    await page.waitForTimeout(1000);

    // Try to delete ADMIN role (which should have users)
    const adminRow = page.locator('tr:has-text("ADMIN"), tr:has-text("ผู้ดูแลระบบ")').first();
    
    // Click action menu
    const actionMenu = adminRow.locator('button[aria-label*="menu"], button:has-text("⋮")').first();
    await actionMenu.click();
    await page.waitForTimeout(300);

    // Click Delete option
    const deleteOption = page.locator('button:has-text("ลบ"), [role="menuitem"]:has-text("ลบ")').first();
    await deleteOption.click();

    // Wait for confirmation dialog
    await page.waitForTimeout(500);

    // Verify confirmation dialog is visible
    const dialog = page.locator('[role="alertdialog"], [role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3000 });

    // Click Delete button in dialog
    const confirmButton = page.locator('button:has-text("ลบ"), button:has-text("Delete")').last();
    await confirmButton.click();

    // Wait for error toast
    await page.waitForTimeout(1000);

    // Verify error toast appears (cannot delete role with users)
    const errorToast = page.locator('[role="alert"], text=/ไม่สามารถลบ/i, text=/cannot delete/i');
    await expect(errorToast.first()).toBeVisible({ timeout: 5000 });

    // Verify ADMIN role still exists in the list
    const adminRole = page.locator('text=/ADMIN/i');
    await expect(adminRole.first()).toBeVisible({ timeout: 3000 });
  });
});
