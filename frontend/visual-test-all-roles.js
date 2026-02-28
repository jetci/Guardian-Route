import puppeteer from 'puppeteer';

const ROLES = [
    {
        role: 'DEVELOPER',
        email: 'jetci.jm@gmail.com',
        password: 'g0KEk,^],k;yo',
        expectedPath: '/developer'
    },
    {
        role: 'ADMIN',
        email: 'admin@obtwiang.go.th',
        password: 'password123',
        expectedPath: '/admin/dashboard'
    },
    {
        role: 'SUPERVISOR',
        email: 'supervisor@obtwiang.go.th',
        password: 'password123',
        expectedPath: '/supervisor'
    },
    {
        role: 'EXECUTIVE',
        email: 'executive@obtwiang.go.th',
        password: 'password123',
        expectedPath: '/executive-dashboard'
    },
    {
        role: 'FIELD_OFFICER',
        email: 'field@obtwiang.go.th',
        password: 'password123',
        expectedPath: '/field-officer/dashboard'
    }
];

(async () => {
    console.log('🚀 Starting Comprehensive Login Verification for ALL Roles (Incognito Mode)...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const user of ROLES) {
        console.log(`\n----------------------------------------`);
        console.log(`👤 Testing Role: ${user.role}`);
        console.log(`----------------------------------------`);

        // Create a new incognito context for each test to ensure clean state
        const context = await browser.createBrowserContext();
        const page = await context.newPage();

        try {
            // 1. Go to Login
            console.log('1️⃣  Navigating to Login Page...');
            await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

            // 2. Enter Credentials
            console.log('2️⃣  Entering Credentials...');
            await page.type('input[type="email"]', user.email);
            await page.type('input[type="password"]', user.password);

            // 3. Login
            console.log('3️⃣  Clicking Login...');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('button[type="submit"]'),
            ]);

            // 4. Verify URL
            const url = page.url();
            console.log(`4️⃣  Current URL: ${url}`);

            const isSuccess = url.includes(user.expectedPath);

            if (isSuccess) {
                console.log(`   ✅ SUCCESS: Redirected to ${user.expectedPath}`);
            } else {
                console.error(`   ❌ FAILURE: Expected ${user.expectedPath}, got ${url}`);
            }

            // Wait for render
            await new Promise(r => setTimeout(r, 2000));

            // 5. Screenshot
            const filename = `login_success_${user.role.toLowerCase()}.png`;
            const path = `C:/Users/J/.gemini/antigravity/brain/2e312f9b-4091-4677-8efb-0d38d7385667/${filename}`;
            console.log(`5️⃣  Capturing Screenshot: ${filename}`);
            await page.screenshot({ path });

        } catch (error) {
            console.error(`❌ Error testing ${user.role}:`, error);
        } finally {
            await context.close();
        }
    }

    console.log('\n✨ All tests completed.');
    await browser.close();
})();
