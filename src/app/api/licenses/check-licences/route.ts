import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import License from '@/models/License';
import Consumer from '@/models/Consumer';
import { LicenseCheckRequest, LicenseCheckResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { licenseKey, productName, accountNumber }: LicenseCheckRequest = await request.json();
    const apiSecret = request.headers.get('x-api-secret');

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({ status: 'invalid', error: 'Unauthorized' }, { status: 401 });
    }

    if (!licenseKey || !productName || !accountNumber) {
      return NextResponse.json({ status: 'invalid', error: 'Missing required fields' }, { status: 400 });
    }

    await connectToMongoose();
    
    // First find the consumer by account number
    const consumer = await Consumer.findOne({ accountNumber });
    if (!consumer) {
      return NextResponse.json({ status: 'invalid', error: 'Consumer not found' }, { status: 404 });
    }

    // Then find the license for that consumer
    const license = await License.findOne({
      licenseKey,
      consumerId: consumer._id,
    }).populate('productId').populate('consumerId');

    if (!license) {
      return NextResponse.json({ status: 'invalid', error: 'License not found' }, { status: 404 });
    }

    if (!license.active) {
      return NextResponse.json({ status: 'invalid', error: 'License deactivated' }, { status: 403 });
    }

    if (license.expires && new Date(license.expires) < new Date()) {
      return NextResponse.json({ status: 'invalid', error: 'License expired' }, { status: 403 });
    }

    if (license.productId && license.productId.name !== productName) {
      return NextResponse.json({ status: 'invalid', error: 'Invalid product' }, { status: 403 });
    }

    if (!license.productId) {
      return NextResponse.json({ status: 'invalid', error: 'Product not found' }, { status: 404 });
    }

    const response: LicenseCheckResponse = {
      status: 'valid',
      product: license.productId.name,
      expires: license.expires ? license.expires.toISOString() : null,
      active: license.active,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('License check error:', error);
    return NextResponse.json({ status: 'invalid', error: 'Server error' }, { status: 500 });
  }
}