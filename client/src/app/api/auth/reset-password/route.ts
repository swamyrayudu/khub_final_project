import { NextRequest, NextResponse } from 'next/server';
import { db, sellers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { verificationCodes } from '@/lib/verification-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword, confirmPassword } = body;

    // Validate inputs
    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Verify the OTP is still valid (hasn't been used yet)
    const key = `password-reset:${email}`;
    const storedOTP = verificationCodes.get(key);
    
    if (!storedOTP) {
      return NextResponse.json(
        { success: false, message: 'OTP verification required. Please verify OTP first.' },
        { status: 400 }
      );
    }

    // Check if email exists in sellers table
    const seller = await db
      .select({ id: sellers.id })
      .from(sellers)
      .where(eq(sellers.email, email))
      .limit(1);

    if (seller.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Account not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in database
    await db
      .update(sellers)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(sellers.id, seller[0].id));

    // Clean up the OTP after successful reset
    verificationCodes.delete(key);

    console.log(`✅ Password reset successfully for ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
