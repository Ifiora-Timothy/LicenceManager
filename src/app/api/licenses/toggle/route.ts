import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoose } from '@/lib/mongodb';
import License from '@/models/License';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { licenseId, active }: { licenseId: string; active: boolean } = body;

    if (!licenseId || typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    await connectToMongoose();
    
    const license = await License.findById(licenseId);
    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    license.active = active;
    await license.save();
    return NextResponse.json(license, { status: 200 });
  } catch (error) {
    console.error('Toggle license error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}