# License Manager

A comprehensive web application built with Next.js for managing software licenses, products, and consumers. This system allows you to create products, manage consumers (customers), and generate license keys for your software products.

## 🚀 Features

- **Product Management**: Create and manage software products
- **Consumer Management**: Manage customer accounts with trading panel integration
- **License Generation**: Generate unique license keys for products
- **License Verification**: Quick license lookup and validation
- **User Authentication**: Secure login/signup system with NextAuth
- **Dashboard**: Centralized management interface

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LicenceManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

### Step 1: Create Your Account
1. Navigate to the signup page
2. Register with your email and password
3. Login to access the dashboard

### Step 2: Create a Product
1. Go to the **Products** page from the dashboard
2. Click "Create Product" or similar button
3. Enter product details:
   - Product name (unique)
   - Description (optional)
4. Save the product

### Step 3: Add a Consumer
1. Navigate to the **Consumers** page
2. Click "Add Consumer" or similar button
3. Fill in consumer information:
   - **Name**: Consumer's full name
   - **Email**: Consumer's email address (unique)
   - **Phone**: Contact number (optional)
   - **Country**: Consumer's country (optional)
   - **Account Number**: Trading panel account number (unique, required)
4. Save the consumer

> **Important**: The Account Number is the consumer's trading panel account number and must be unique in the system.

### Step 4: Generate a License
1. Go to the **Licenses** page
2. Click "Create License" or similar button
3. Select:
   - **Product**: Choose from your created products
   - **Consumer**: Select the consumer purchasing the product
   - **License Type**: Choose between "full" or "trial"
   - **Expiration Date**: Set expiry date (optional for full licenses)
4. Generate the license

The system will automatically create a unique license key for the consumer.

### Step 5: License Management
- **View Licenses**: See all generated licenses
- **Toggle Status**: Activate/deactivate licenses
- **License Lookup**: Use the lookup feature to verify license keys
- **Check License API**: Integrate with your software for automatic license verification

## 🔍 License Lookup

The system provides multiple ways to verify licenses:

1. **Web Interface**: Use the lookup page to manually check license status
2. **API Endpoint**: Integrate with your software using the `/api/check_license` endpoint
3. **Consumer Lookup**: Find licenses by consumer account number

## 🔧 API Endpoints

The application provides several API endpoints for integration:

- `POST /api/check_license` - Verify license validity
- `GET /api/licenses` - Get all licenses
- `GET /api/products` - Get all products
- `GET /api/consumers` - Get all consumers
- `POST /api/auth/register` - User registration

## 📱 Pages Overview

- **Dashboard** (`/`): Main overview with quick access to all features
- **Products** (`/products`): Manage your software products
- **Consumers** (`/consumers`): Manage customer accounts
- **Licenses** (`/licenses`): Create and manage licenses
- **Lookup** (`/lookup`): Quick license verification tool
- **Login/Signup** (`/login`, `/signup`): Authentication pages

## 🎯 Use Case Example

1. **Software Company**: You develop a trading bot software
2. **Create Product**: Add "Trading Bot Pro" to your products
3. **Customer Registration**: A customer with trading account "TB123456" wants to purchase
4. **Add Consumer**: Create consumer record with account number "TB123456"
5. **Generate License**: Create a license linking the customer to your product
6. **License Key**: Customer receives unique license key for software activation
7. **Verification**: Your software can verify the license using the API

## 🔒 Security Features

- Password hashing with bcryptjs
- Unique constraints on critical fields (emails, account numbers, license keys)
- Session-based authentication
- API route protection

## 🚀 Development Scripts

```bash
npm run dev          # Start development server
npm run dev:port80   # Start development server on port 80
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📝 Notes

- Each consumer can have only one license per product
- License keys are automatically generated and unique
- Account numbers must be unique across all consumers
- The system supports both full and trial license types
- MongoDB indexes ensure optimal performance for lookups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.