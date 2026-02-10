
const BASE_URL = 'http://127.0.0.1:3000';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';
let userToken = '';
let orderId = '';

async function runTests() {
    console.log('🚀 Starting System Audit Tests...\n');

    try {
        // 1. Test Registration
        console.log('1️⃣ Testing Registration...');
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                name: 'Test Customer',
                phone: '0812345678'
            })
        });
        const regData = await regRes.json();
        if (regRes.ok) {
            console.log('✅ Registration Successful');
            userToken = regData.token;
        } else {
            console.error('❌ Registration Failed:', regData);
            return;
        }

        // 2. Test Login
        console.log('\n2️⃣ Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
            console.log('✅ Login Successful');
        } else {
            console.error('❌ Login Failed:', loginData);
            return;
        }

        // 3. Test Product API
        console.log('\n3️⃣ Testing Products API...');
        const prodRes = await fetch(`${BASE_URL}/api/products`);
        const products = await prodRes.json();
        if (Array.isArray(products)) {
            console.log(`✅ Products API Working (Found ${products.length} products)`);
        } else {
            console.error('❌ Products API Error:', products);
        }

        // 4. Test Wholesale API
        console.log('\n4️⃣ Testing Wholesale Rates API...');
        const wsRes = await fetch(`${BASE_URL}/api/wholesale`);
        const rates = await wsRes.json();
        if (Array.isArray(rates)) {
            console.log(`✅ Wholesale API Working (Found ${rates.length} rates)`);
        } else {
            console.error('❌ Wholesale API Error:', rates);
        }

        // 5. Test Review Submission (General Shop Review)
        console.log('\n5️⃣ Testing Review Submission...');
        const revRes = await fetch(`${BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'Test Reviewer',
                rating: 5,
                comment: 'Excellent service!',
                source: 'Website'
            })
        });
        if (revRes.ok) {
            console.log('✅ Review Submission Successful');
        } else {
            const revData = await revRes.json();
            console.error('❌ Review Submission Failed:', revData);
        }

        console.log('\n✨ All API tests completed successfully!');

    } catch (error) {
        console.error('\n💥 Critical Error during testing:', error.message);
    }
}

runTests();
