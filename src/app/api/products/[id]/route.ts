import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import LicenseModel from '@/models/License';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoose();
    const { id } = await params;

    // Check if product exists and belongs to the current user
    const product = await ProductModel.findOne({ 
      _id: id, 
      createdBy: (session.user as any).id 
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Check if there are any licenses associated with this product (created by this user)
    const associatedLicenses = await LicenseModel.find({ 
      productId: id,
      createdBy: (session.user as any).id 
    });
    
    if (associatedLicenses.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete product. There are ${associatedLicenses.length} license(s) associated with this product.` 
        },
        { status: 400 }
      );
    }

    // Delete the product
    await ProductModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
