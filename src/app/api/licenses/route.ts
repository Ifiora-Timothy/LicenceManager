import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoose } from '@/lib/mongodb';
import License from '@/models/License';
import Product from '@/models/Product';
import Consumer from '@/models/Consumer';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { License as ILicence} from '@/types';


export async function GET(request: NextRequest) {
  // Ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToMongoose();
    const licenses = await License.find()
      .populate('productId', 'name')
      .populate('consumerId', 'name email accountNumber')
      .sort({ createdAt: -1 });
      
    const data = licenses.map((lic) => ({
      _id: lic._id.toString(),
      licenseKey: lic.licenseKey,
      productId: lic.productId ? lic.productId.toString() : null,
      consumerId: lic.consumerId ? lic.consumerId.toString() : null,
      licenseType: lic.licenseType,
      expires: lic.expires ? lic.expires.toISOString() : null,
      active: lic.active,
      createdAt: lic.createdAt.toISOString(),
      product: lic.productId,
      consumer: lic.consumerId,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch licenses error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}




export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
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

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
      return NextResponse.json({ error: 'Consumer not found' }, { status: 404 });
    }

    const license = new License({
      licenseKey: uuidv4(),
      productId,
      consumerId,
      licenseType,
      expires: expires ? new Date(expires) : null,
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
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { licenseId } = await request.json();
    if (!licenseId || !mongoose.Types.ObjectId.isValid(licenseId)) {
      return NextResponse.json({ error: 'Invalid licenseId' }, { status: 400 });
    }
    
    await connectToMongoose();
    
    const deleted = await License.findByIdAndDelete(licenseId);
    if (!deleted) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'License deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete license error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Handle upgrade from trial to full license
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { licenseId, licenseType }: { licenseId: string; licenseType: string } = await request.json();
    // Validate licenseId
    if (!licenseId || !mongoose.Types.ObjectId.isValid(licenseId)) {
      return NextResponse.json({ error: 'Invalid licenseId' }, { status: 400 });
    }
    // Only allow upgrade to full
    if (licenseType !== 'full') {
      return NextResponse.json({ error: 'Invalid licenseType. Only upgrade to full is allowed.' }, { status: 400 });
    }
    await connectToMongoose();
    const license = await License.findById(licenseId);
    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }
    if (license.licenseType === 'full') {
      return NextResponse.json({ error: 'License is already full' }, { status: 400 });
    }
    // Update licenseType
    license.licenseType = 'full';
    await license.save();
    return NextResponse.json(license, { status: 200 });
  } catch (error: any) {
    console.error('Update license error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}