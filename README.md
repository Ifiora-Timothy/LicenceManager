# License Manager

A comprehensive license management system built with Next.js for managing software licenses, particularly designed for MQL5/MQL4 trading applications.

## Features

- **License Management**: Create, activate, deactivate, and upgrade software licenses
- **Consumer Management**: Manage consumers and their account information
- **Product Management**: Handle multiple software products
- **MQL5/MQL4 API**: Dedicated API endpoints for MetaTrader Expert Advisors and indicators
- **Authentication**: Secure admin authentication with NextAuth
- **Database**: MongoDB integration for data persistence

## API for MQL5/MQL4 Clients

The system provides a dedicated API endpoint for license verification from trading applications:

**Endpoint**: `POST /api/check_license`

This endpoint validates license keys, product names, and account numbers for MetaTrader applications. See [API Documentation](docs/API_DOCUMENTATION.md) for detailed implementation instructions.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LicenceManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and configure your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Secret key for NextAuth
   - `API_SECRET`: Secret key for MQL5/MQL4 API authentication

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing the API

Test the MQL5/MQL4 license verification API:

```bash
node test-license-api.js
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   │   ├── check_license/  # MQL5/MQL4 license verification
│   │   ├── licenses/    # License management
│   │   ├── products/    # Product management
│   │   └── consumers/   # Consumer management
│   ├── licenses/        # License management UI
│   ├── products/        # Product management UI
│   └── consumers/       # Consumer management UI
├── components/          # Reusable UI components
├── lib/                # Utility libraries
├── models/             # Database models
└── types/              # TypeScript type definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
