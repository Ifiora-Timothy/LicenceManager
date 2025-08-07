import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import Consumer from '@/models/Consumer';
import { authOptions } from '@/lib/auth';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   await connectToMongoose();
    const consumers = await Consumer.find({}).sort({ createdAt: -1 });
    return NextResponse.json(consumers);
  } catch (error) {
    console.error('Error fetching consumers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, country, accountNumber } = body;

    if (!name || !email || !accountNumber) {
      return NextResponse.json({ error: 'Name, email, and account number are required' }, { status: 400 });
    }

    await connectToMongoose();

    const consumer = new Consumer({
      name,
      email,
      phone,
      country,
      accountNumber
    });

    await consumer.save();
    return NextResponse.json(consumer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consumer:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      if (error.keyPattern?.accountNumber) {
        return NextResponse.json({ error: 'Account number already exists' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
