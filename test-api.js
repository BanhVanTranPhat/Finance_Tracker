// Test script to check API endpoints
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

async function testAPI() {
  try {
    console.log("Testing API endpoints...");

    // Test health check
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log("✅ Health check:", healthResponse.data);

    // Test categories endpoint (should return 401 without auth)
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
      console.log("✅ Categories:", categoriesResponse.data);
    } catch (error) {
      console.log("❌ Categories (expected 401):", error.response?.status);
    }

    // Test wallets endpoint (should return 401 without auth)
    try {
      const walletsResponse = await axios.get(`${API_BASE_URL}/wallets`);
      console.log("✅ Wallets:", walletsResponse.data);
    } catch (error) {
      console.log("❌ Wallets (expected 401):", error.response?.status);
    }

    // Test transactions endpoint (should return 401 without auth)
    try {
      const transactionsResponse = await axios.get(
        `${API_BASE_URL}/transactions`
      );
      console.log("✅ Transactions:", transactionsResponse.data);
    } catch (error) {
      console.log("❌ Transactions (expected 401):", error.response?.status);
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
  }
}

testAPI();
