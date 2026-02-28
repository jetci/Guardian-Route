import puppeteer from 'puppeteer';

(async () => {
    console.log('🚀 Starting Visual Verification Test...');

    // Launch browser (headless: false so user can see it if they are watching, but mostly for screenshots)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        console.log('1️⃣ Navigating to Login Page...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

        // Take initial screenshot
        await page.screenshot({ path: 'C:/Users/J/.gemini/antigravity/brain/2e312f9b-4091-4677-8efb-0d38d7385667/01_login_page.png' });

        console.log('2️⃣ Entering Credentials...');
        await page.type('input[type="email"]', 'supervisor@obtwiang.go.th');
        await page.type('input[type="password"]', 'password123');

        console.log('3️⃣ Clicking Login...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]'),
        ]);

        console.log('4️⃣ Verifying Dashboard...');
        const url = page.url();
        console.log(`   Current URL: ${url}`);

        if (url.includes('/dashboard/supervisor')) {
            console.log('   ✅ Navigation Successful!');
        } else {
            console.error('   ❌ Navigation Failed or Redirected elsewhere');
        }

        // Wait a bit for dashboard to fully render
        await new Promise(r => setTimeout(r, 2000));

        console.log('5️⃣ Capturing Proof Screenshot...');
        await page.screenshot({ path: 'C:/Users/J/.gemini/antigravity/brain/2e312f9b-4091-4677-8efb-0d38d7385667/02_login_success_proof.png' });

        console.log('✅ Test Complete. Screenshots saved.');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        await page.screenshot({ path: 'C:/Users/J/.gemini/antigravity/brain/2e312f9b-4091-4677-8efb-0d38d7385667/error_screenshot.png' });
    } finally {
        await browser.close();
    }
})();
