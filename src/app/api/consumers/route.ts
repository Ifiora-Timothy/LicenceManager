import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import Consumer from '@/models/Consumer';
import { authOptions } from '@/lib/auth';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoose();
    
    // Only fetch consumers created by the current user
    const consumers = await Consumer.find({ 
      createdBy: (session.user as any).id 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(consumers);
  } catch (error) {
    console.error('Error fetching consumers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, country, accountNumber } = body;

    if (!name || !email || !accountNumber) {
      return NextResponse.json({ error: 'Name, email, and account number are required' }, { status: 400 });
    }

    await connectToMongoose();

    // Check for existing consumer with same email or accountNumber for this user
    const existingConsumer = await Consumer.findOne({
      $and: [
        { createdBy: (session.user as any).id },
        { $or: [{ email }, { accountNumber }] }
      ]
    });

    if (existingConsumer) {
      if (existingConsumer.email === email) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      if (existingConsumer.accountNumber === accountNumber) {
        return NextResponse.json({ error: 'Account number already exists' }, { status: 400 });
      }
    }

    const consumer = new Consumer({
      name,
      email,
      phone,
      country,
      accountNumber,
      createdBy: (session.user as any).id
    });

    await consumer.save();
    return NextResponse.json(consumer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consumer:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return NextResponse.json({ error: 'Email already exists for your account' }, { status: 400 });
      }
      if (error.keyPattern?.accountNumber) {
        return NextResponse.json({ error: 'Account number already exists for your account' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
