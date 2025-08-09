import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session: session,
      hasUser: !!session?.user,
      userId: (session?.user as any)?.id,
      userEmail: session?.user?.email,
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({ error: 'Error getting session' }, { status: 500 });
  }
}
