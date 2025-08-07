import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import License from '@/models/License';
import Consumer from '@/models/Consumer';
import Product from '@/models/Product';
import { Printer } from 'lucide-react';

interface CheckLicenseRequest {
  licenseKey: string;
  productName: string;
  accountNumber: string;
}

interface CheckLicenseResponse {
  status: 'valid' | 'invalid';
  product?: string;
  expires?: string;
  active?: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check API secret authentication
    const apiSecret = request.headers.get('x-api-secret');
    console.log('API Secret:', apiSecret); // Debugging line

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let requestBody: CheckLicenseRequest;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { licenseKey, productName, accountNumber } = requestBody;

    // Validate required fields
    if (!licenseKey || !productName || !accountNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToMongoose();

    // Find consumer by account number
    const consumer = await Consumer.findOne({ accountNumber });
    if (!consumer) {
        console.log('Consumer not found for account number:', accountNumber, 'License Key:', licenseKey);
      return NextResponse.json(
        { status: 'invalid', error: 'License not found' },
        { status: 200 }
      );
    }
    

    // Find product by name
    const product = await Product.findOne({ name: productName });
    if (!product) {
      console.log('Product not found for name:', productName, 'License Key:', licenseKey);
      return NextResponse.json(
        { status: 'invalid', error: 'Invalid product' },
        { status: 200 }
      );
    }

    // Find license for the consumer and product
    const license = await License.findOne({
      licenseKey,
      consumerId: consumer._id,
      productId: product._id,
    }).populate('productId').populate('consumerId');

    if (!license) {
      return NextResponse.json(
        { status: 'invalid', error: 'License not found' },
        { status: 200 }
      );
    }

    // Check if license is active
    if (!license.active) {
      return NextResponse.json(
        { status: 'invalid', error: 'License deactivated' },
        { status: 200 }
      );
    }

    // Check if license is expired
    if (license.expires && new Date(license.expires) < new Date()) {
      return NextResponse.json(
        { status: 'invalid', error: 'License expired' },
        { status: 200 }
      );
    }

    // License is valid - return success response
    const response: CheckLicenseResponse = {
      status: 'valid',
      product: productName,
      expires: license.expires ? new Date(license.expires).toISOString() : undefined,
      active: true,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
