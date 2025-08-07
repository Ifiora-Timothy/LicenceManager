import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function POST(request: Request) {
  try {
    await connectToMongoose();
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const existing = await ProductModel.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: 'Product already exists' }, { status: 400 });
    }
    const product = await ProductModel.create({ name, description });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
