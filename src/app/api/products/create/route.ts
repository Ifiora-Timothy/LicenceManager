import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug: Log session to see what we're getting
    console.log('Session:', JSON.stringify(session, null, 2));
    console.log('Session user:', session.user);
    console.log('Session user id:', (session.user as any).id);

    const userId = (session.user as any).id;
    if (!userId) {
      console.error('No user ID found in session');
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    await connectToMongoose();
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Check if product with this name already exists for this user
    const existing = await ProductModel.findOne({ 
      name, 
      createdBy: userId 
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Product already exists' }, { status: 400 });
    }
    
    console.log('Creating product with userId:', userId);
    
    // Create product with the current user as the creator
    const product = await ProductModel.create({ 
      name, 
      description,
      createdBy: userId
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
