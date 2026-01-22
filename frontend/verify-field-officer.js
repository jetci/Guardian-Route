// Using built-in fetch API (Node.js 18+)

console.log("🔍 Verifying Field Officer Role...");
console.log("----------------------------------------");

async function verifyFieldOfficer() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'field@obtwiang.go.th',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ LOGIN SUCCESSFUL");
            console.log("User:", data.user.firstName, data.user.lastName);
            console.log("Email:", data.user.email);
            console.log("Role:", data.user.role); // This is what we need to see
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

verifyFieldOfficer();
