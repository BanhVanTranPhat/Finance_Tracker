// Test transaction creation
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

async function testTransaction() {
  try {
    console.log("Testing transaction creation...");

    // First, register a test user
    console.log("1. Registering test user...");
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ User registered:", registerResponse.data.message);

    const token = registerResponse.data.token;

    // Test creating a transaction
    console.log("2. Creating transaction...");
    const transactionData = {
      type: "expense",
      amount: 100000,
      date: new Date().toISOString(),
      category: "Test Category",
      note: "Test transaction",
    };

    const transactionResponse = await axios.post(
      `${API_BASE_URL}/transactions`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Transaction created:", transactionResponse.data);

    // Test getting transactions
    console.log("3. Getting transactions...");
    const getTransactionsResponse = await axios.get(
      `${API_BASE_URL}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Transactions retrieved:", getTransactionsResponse.data);
  } catch (error) {
    console.error(
      "❌ Error testing transaction:",
      error.response?.data || error.message
    );
  }
}

testTransaction();
