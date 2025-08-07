#!/usr/bin/env node

/**
 * Test script for the /api/check_license endpoint
 * This simulates how an MQL5/MQL4 client would interact with the license server
 */

const API_BASE_URL = 'http://localhost:3000';
const API_SECRET = 'your-strong-api-secret-here'; // Should match .env.local

async function testLicenseCheck() {
  console.log('🧪 Testing License Verification API\n');

  // Test cases
  const testCases = [
    {
      name: 'Valid License Test',
      data: {
        licenseKey: 'DEMO-LICENSE-KEY',
        productName: 'AutoBotX',
        accountNumber: '12345678'
      }
    },
    {
      name: 'Missing Fields Test',
      data: {
        licenseKey: 'DEMO-LICENSE-KEY',
        productName: 'AutoBotX'
        // accountNumber missing
      }
    },
    {
      name: 'Invalid License Key Test',
      data: {
        licenseKey: 'INVALID-KEY',
        productName: 'AutoBotX',
        accountNumber: '12345678'
      }
    },
    {
      name: 'Invalid Product Test',
      data: {
        licenseKey: 'DEMO-LICENSE-KEY',
        productName: 'NonExistentProduct',
        accountNumber: '12345678'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 ${testCase.name}`);
    console.log(`Request: ${JSON.stringify(testCase.data, null, 2)}`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/check_license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': API_SECRET
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }

    console.log('─'.repeat(50));
  }

  // Test unauthorized access
  console.log('🔒 Testing Unauthorized Access');
  try {
    const response = await fetch(`${API_BASE_URL}/api/check_license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': 'wrong-secret'
      },
      body: JSON.stringify({
        licenseKey: 'DEMO-LICENSE-KEY',
        productName: 'AutoBotX',
        accountNumber: '12345678'
      })
    });

    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }

  console.log('─'.repeat(50));

  // Test wrong HTTP method
  console.log('🚫 Testing Wrong HTTP Method (GET)');
  try {
    const response = await fetch(`${API_BASE_URL}/api/check_license`, {
      method: 'GET',
      headers: {
        'X-API-Secret': API_SECRET
      }
    });

    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Example MQL5 request format (for documentation)
function generateMQL5Example() {
  console.log('\n📱 Example MQL5/MQL4 Request Format:\n');
  console.log(`
//+------------------------------------------------------------------+
//| MQL5 Example: License Verification                              |
//+------------------------------------------------------------------+

string server_url = "https://yourserver.com/api/check_license";
string api_secret = "your-strong-api-secret-here";
string license_key = "USER-PROVIDED-LICENSE-KEY";
string product_name = "AutoBotX";
string account_number = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));

string headers = "Content-Type: application/json\\r\\nX-API-Secret: " + api_secret;
string json_data = "{\\"licenseKey\\":\\"" + license_key + "\\",\\"productName\\":\\"" + product_name + "\\",\\"accountNumber\\":\\"" + account_number + "\\"}";

char result[];
string result_headers;
int timeout = 5000; // 5 seconds

int res = WebRequest("POST", server_url, headers, timeout, CharArrayToString(StringToCharArray(json_data)), result, result_headers);

if(res == 200) {
    string response = CharArrayToString(result);
    // Parse JSON response to check license status
    Print("License verification response: ", response);
} else {
    Print("License verification failed with code: ", res);
}
`);
}

if (require.main === module) {
  testLicenseCheck()
    .then(() => {
      generateMQL5Example();
      console.log('\n✅ Testing completed!');
    })
    .catch(console.error);
}

module.exports = { testLicenseCheck };
