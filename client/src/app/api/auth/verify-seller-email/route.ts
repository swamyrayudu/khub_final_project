import { NextRequest, NextResponse } from 'next/server';
import { db, sellers } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email exists in sellers table
    const seller = await db
      .select({
        id: sellers.id,
        email: sellers.email,
        shopOwnerName: sellers.shopOwnerName,
      })
      .from(sellers)
      .where(eq(sellers.email, email))
      .limit(1);

    if (seller.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          exists: false,
          message: 'No account found with this email address' 
        },
        { status: 404 }
      );
    }

    // Email exists
    return NextResponse.json(
      { 
        success: true, 
        exists: true,
        message: 'Email verified successfully',
        data: {
          email: seller[0].email,
          name: seller[0].shopOwnerName
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verifying seller email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
