# MQL5/MQL4 License Verification API

## Overview

This API provides license verification services for MetaTrader Expert Advisors (EAs) and indicators built with MQL5/MQL4. The primary endpoint `/api/check_license` validates license keys against the server database.

## Authentication

All requests must include the `X-API-Secret` header with a valid API secret key.

```
X-API-Secret: your-strong-api-secret-here
```

## Primary Endpoint

### POST /api/check_license

Validates a license key for a specific product and account.

#### Request

**Method:** `POST`  
**URL:** `https://yourserver.com/api/check_license`  
**Content-Type:** `application/json`

**Headers:**
```
Content-Type: application/json
X-API-Secret: your-strong-api-secret-here
```

**Request Body:**
```json
{
  "licenseKey": "string",     // The license key provided by the user
  "productName": "string",    // Name of the EA/indicator (e.g., "AutoBotX")
  "accountNumber": "string"   // MetaTrader account number from AccountNumber()
}
```

#### Response

**Success Response (Valid License):**
```json
{
  "status": "valid",
  "product": "AutoBotX",
  "expires": "2025-12-31T00:00:00Z",  // Optional: null if no expiration
  "active": true
}
```

**Error Responses:**

| Status Code | Response | Description |
|------------|----------|-------------|
| 200 | `{"status": "invalid", "error": "License not found"}` | License key doesn't exist or doesn't match account/product |
| 200 | `{"status": "invalid", "error": "License deactivated"}` | License exists but is deactivated |
| 200 | `{"status": "invalid", "error": "License expired"}` | License has expired |
| 200 | `{"status": "invalid", "error": "Invalid product"}` | Product name doesn't match |
| 400 | `{"error": "Missing required fields"}` | Required fields are missing from request |
| 401 | `{"error": "Unauthorized"}` | Invalid or missing API secret |
| 405 | `{"error": "Method not allowed. Use POST."}` | Wrong HTTP method used |
| 500 | `{"error": "Server error"}` | Internal server error |

## MQL5/MQL4 Implementation Example

```mql5
//+------------------------------------------------------------------+
//| License verification function for MQL5/MQL4                     |
//+------------------------------------------------------------------+

input string InpLicenseKey = "";  // License Key (enter your license)

string ServerURL = "https://yourserver.com/api/check_license";
string ApiSecret = "your-strong-api-secret-here";  // Store securely
string ProductName = "AutoBotX";  // Your EA/Indicator name

//+------------------------------------------------------------------+
//| Verify license on initialization                                |
//+------------------------------------------------------------------+
bool VerifyLicense()
{
    if(InpLicenseKey == "")
    {
        Alert("Please enter your license key in the EA settings");
        return false;
    }
    
    string accountNumber = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));
    
    // Prepare request
    string headers = "Content-Type: application/json\r\nX-API-Secret: " + ApiSecret;
    string jsonData = StringFormat(
        "{\"licenseKey\":\"%s\",\"productName\":\"%s\",\"accountNumber\":\"%s\"}",
        InpLicenseKey, ProductName, accountNumber
    );
    
    // Make request
    char result[];
    string responseHeaders;
    int timeout = 5000;  // 5 seconds
    
    int httpCode = WebRequest("POST", ServerURL, headers, timeout, 
                             StringToCharArray(jsonData), result, responseHeaders);
    
    if(httpCode == 200)
    {
        string response = CharArrayToString(result);
        
        // Parse JSON response (simple parsing for status)
        if(StringFind(response, "\"status\":\"valid\"") >= 0)
        {
            Print("✅ License verified successfully");
            return true;
        }
        else
        {
            // Extract error message
            int errorPos = StringFind(response, "\"error\":\"");
            if(errorPos >= 0)
            {
                errorPos += 9; // Skip past "error":"
                int errorEnd = StringFind(response, "\"", errorPos);
                if(errorEnd > errorPos)
                {
                    string errorMsg = StringSubstr(response, errorPos, errorEnd - errorPos);
                    Alert("❌ License verification failed: " + errorMsg);
                }
            }
            return false;
        }
    }
    else
    {
        Alert("❌ Failed to connect to license server. HTTP Code: " + IntegerToString(httpCode));
        return false;
    }
}

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // Verify license before allowing EA to run
    if(!VerifyLicense())
    {
        Alert("License verification failed. EA will not run.");
        return INIT_FAILED;
    }
    
    Print("License verified. EA initialized successfully.");
    return INIT_SUCCEEDED;
}
```

## Security Considerations

1. **API Secret**: Store the API secret securely and never expose it in plain text in your compiled EA
2. **HTTPS**: Always use HTTPS in production to encrypt communication
3. **Rate Limiting**: Consider implementing rate limiting to prevent abuse
4. **Logging**: Monitor API usage for suspicious activity

## Testing

Use the provided test script to verify your implementation:

```bash
node test-license-api.js
```

Make sure to:
1. Set up your `.env.local` file with the correct `API_SECRET`
2. Create test products and consumers in your database
3. Generate test license keys for validation

## Environment Setup

Create a `.env.local` file with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/licensemanager

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# API Secret for MQL5/MQL4 Client Authentication
API_SECRET=your-strong-api-secret-here
```

## Error Handling Best Practices

1. **Network Errors**: Handle connection timeouts and network failures gracefully
2. **Invalid Responses**: Parse JSON responses safely and handle malformed data
3. **User Feedback**: Provide clear error messages to users
4. **Fallback Behavior**: Consider what happens when license verification fails (demo mode, limited functionality, etc.)

## Additional Endpoints (Future Extensions)

While `/api/check_license` is the primary endpoint, you may want to add:

- `/api/license_info` - Get detailed license information
- `/api/activate_license` - One-time license activation
- `/api/heartbeat` - Periodic license status checks
- `/api/usage_tracking` - Track feature usage for analytics
