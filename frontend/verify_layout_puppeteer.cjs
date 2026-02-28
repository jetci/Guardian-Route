const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('🚀 Starting Layout Verification...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to desktop size
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        // 1. Login
        console.log('📍 Navigating to Login...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

        console.log('🔑 Clicking Supervisor Quick Login...');
        await page.click('.quick-login-button.supervisor');

        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('✅ Logged in. Current URL:', page.url());

        if (!page.url().includes('/supervisor')) {
            throw new Error('Failed to navigate to Supervisor Dashboard');
        }

        // 2. Verify KPI Card
        console.log('🔍 Inspecting KPI Cards...');
        // Wait for the card with the specific class or content
        await page.waitForSelector('.min-h-\\[180px\\]', { timeout: 5000 });

        const cards = await page.$$('.min-h-\\[180px\\]');
        console.log(`📊 Found ${cards.length} KPI cards with min-h-[180px] class.`);

        if (cards.length === 0) {
            throw new Error('No KPI cards found with min-h-[180px] class!');
        }

        // Get computed style of the first card
        const height = await page.evaluate(el => {
            const style = window.getComputedStyle(el);
            return style.height;
        }, cards[0]);

        console.log(`📏 First Card Height: ${height}`);

        const heightVal = parseFloat(height);
        if (heightVal < 180) {
            throw new Error(`Card height ${heightVal}px is less than required 180px!`);
        }

        // 3. Take Screenshot
        const screenshotPath = path.join('C:\\Users\\J\\.gemini\\antigravity\\brain\\185e4e34-07a0-4826-94db-69ef710faa0f', 'supervisor_dashboard_verified.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved to: ${screenshotPath}`);

        console.log('✅ VERIFICATION PASSED');
    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error.message);
        const errorScreenshotPath = path.join('C:\\Users\\J\\.gemini\\antigravity\\brain\\185e4e34-07a0-4826-94db-69ef710faa0f', 'verification_failed.png');
        await page.screenshot({ path: errorScreenshotPath });
        console.log(`📸 Error screenshot saved to: ${errorScreenshotPath}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
