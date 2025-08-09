import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoose } from '@/lib/mongodb';
import License from '@/models/License';
import Product from '@/models/Product';
import Consumer from '@/models/Consumer';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { License as ILicence} from '@/types';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, consumerId, licenseType, expires }: Partial<ILicence> = body;

    if (!productId || !consumerId || !licenseType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToMongoose();
    
    // Validate productId as a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    // Validate consumerId as a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(consumerId)) {
      return NextResponse.json({ error: 'Invalid consumerId' }, { status: 400 });
    }

    // Ensure the product belongs to the current user
    const product = await Product.findOne({ 
      _id: productId, 
      createdBy: (session.user as any).id 
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    // Ensure the consumer belongs to the current user
    const consumer = await Consumer.findOne({ 
      _id: consumerId, 
      createdBy: (session.user as any).id 
    });
    if (!consumer) {
      return NextResponse.json({ error: 'Consumer not found or access denied' }, { status: 404 });
    }

    const license = new License({
      licenseKey: uuidv4(),
      productId,
      consumerId,
      licenseType,
      expires: expires ? new Date(expires) : null,
      createdBy: (session.user as any).id,
    });

    await license.save();
    return NextResponse.json(license, { status: 201 });
  } catch (error:any) {
    console.error('Create license error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { licenseId } = await request.json();
    if (!licenseId || !mongoose.Types.ObjectId.isValid(licenseId)) {
      return NextResponse.json({ error: 'Invalid licenseId' }, { status: 400 });
    }
    
    await connectToMongoose();
    
    // Only delete licenses created by the current user
    const deleted = await License.findOneAndDelete({ 
      _id: licenseId, 
      createdBy: (session.user as any).id 
    });
    
    if (!deleted) {
      return NextResponse.json({ error: 'License not found or access denied' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'License deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete license error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}