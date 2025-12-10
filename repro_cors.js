
const API_BASE = "https://cs571api.cs.wisc.edu/rest/f25/bucket/cards";
const CARD_ID = "8a4ca498-15fc-4cbd-aae3-0aabc9918336";
const HEADERS = {
    "X-CS571-ID": "bid_8468662ee7601a059c382abbca315e96cef99228707b9ddb37f7b8d2f8559274",
    "Content-Type": "application/json"
};

// Mocking the fix in api.js: using query param
async function testFix() {
    console.log(`Testing Fix: PUT ${API_BASE}?id=${CARD_ID}`);
    try {
        const response = await fetch(`${API_BASE}?id=${CARD_ID}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
                test: "data",
                note: "This is a test update to verify the fix."
            })
        });
        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log(`Response:`, data);
    } catch (error) {
        console.error(`Error:`, error.message);
    }
}

testFix();
