import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoose();
    
    // Only fetch products created by the current user
    const products = await ProductModel.find({ 
      createdBy: (session.user as any).id 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
