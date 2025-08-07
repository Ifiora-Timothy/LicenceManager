import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET() {
  await connectToMongoose();
  const products = await ProductModel.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}
