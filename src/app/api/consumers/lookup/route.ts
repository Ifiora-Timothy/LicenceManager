import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import Consumer from '@/models/Consumer';
import License from '@/models/License';

export async function POST(request: NextRequest) {
  try {
    const { email, accountNumber } = await request.json();

    if (!email && !accountNumber) {
      return NextResponse.json({ error: 'Either email or account number is required' }, { status: 400 });
    }

    await connectToMongoose();

    // Find consumer by email or account number
    const query: any = {};
    if (email) query.email = email;
    if (accountNumber) query.accountNumber = accountNumber;

    const consumer = await Consumer.findOne(query);
    if (!consumer) {
      return NextResponse.json({ error: 'Consumer not found' }, { status: 404 });
    }

    // Get all licenses for this consumer
    const licenses = await License.find({ consumerId: consumer._id })
      .populate('productId', 'name description')
      .populate('consumerId', 'name email accountNumber')
      .sort({ createdAt: -1 });

    const response = {
      consumer: {
        name: consumer.name,
        email: consumer.email,
        phone: consumer.phone,
        country: consumer.country,
        accountNumber: consumer.accountNumber,
      },
      licenses: licenses.map(license => ({
        _id: license._id,
        licenseKey: license.licenseKey,
        product: license.productId || null,
        licenseType: license.licenseType,
        expires: license.expires,
        active: license.active,
        createdAt: license.createdAt,
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Consumer lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
