import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToMongoose } from '@/lib/mongodb';
import Consumer from '@/models/Consumer';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid consumer ID' }, { status: 400 });
    }

    await connectToMongoose();

    // Find and delete the consumer only if it belongs to the current user
    const deletedConsumer = await Consumer.findOneAndDelete({
      _id: id,
      createdBy: (session.user as any).id
    });

    if (!deletedConsumer) {
      return NextResponse.json({ 
        error: 'Consumer not found or you do not have permission to delete it' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Consumer deleted successfully',
      deletedConsumer: {
        _id: deletedConsumer._id,
        name: deletedConsumer.name,
        email: deletedConsumer.email
      }
    });

  } catch (error) {
    console.error('Error deleting consumer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid consumer ID' }, { status: 400 });
    }

    await connectToMongoose();

    // Find consumer only if it belongs to the current user
    const consumer = await Consumer.findOne({
      _id: id,
      createdBy: (session.user as any).id
    });

    if (!consumer) {
      return NextResponse.json({ 
        error: 'Consumer not found or you do not have permission to access it' 
      }, { status: 404 });
    }

    return NextResponse.json(consumer);

  } catch (error) {
    console.error('Error fetching consumer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
