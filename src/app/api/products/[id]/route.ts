import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import LicenseModel from '@/models/License';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectToMongoose();
    const { id } = await params;

    // Check if product exists
    const product = await ProductModel.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if there are any licenses associated with this product
    const associatedLicenses = await LicenseModel.find({ productId: id });
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
