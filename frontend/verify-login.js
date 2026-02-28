// Using built-in fetch API (Node.js 18+)

console.log("🔍 Starting Login Verification Script...");
console.log("----------------------------------------");
console.log("Target: http://localhost:3001/api/auth/login");
console.log("Email: supervisor@obtwiang.go.th");
console.log("Password: password123");
console.log("----------------------------------------");

async function verifyLogin() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'supervisor@obtwiang.go.th',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ LOGIN SUCCESSFUL!");
            console.log("----------------------------------------");
            console.log("User:", data.user.firstName, data.user.lastName);
            console.log("Role:", data.user.role);
            console.log("Token received: Yes");
            console.log("----------------------------------------");
            console.log("Conclusion: The credentials are VALID and the Backend is RESPONDING.");
        } else {
            console.log("❌ LOGIN FAILED");
            console.log("Status:", response.status);
            console.log("Error:", data);
        }
    } catch (error) {
        console.error("❌ NETWORK ERROR");
        console.error(error);
    }
}

verifyLogin();
