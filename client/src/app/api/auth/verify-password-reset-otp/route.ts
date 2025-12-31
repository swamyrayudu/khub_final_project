import { NextRequest, NextResponse } from 'next/server';
import { verificationCodes, cleanExpiredCodes } from '@/lib/verification-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Verify Password Reset OTP called');
    
    // Clean expired codes first
    cleanExpiredCodes();

    const { email, code } = await request.json();
    console.log(`📧 Verifying password reset - Email: ${email}, Code: ${code}`);

    // Validate input
    if (!email || !code) {
      console.log('❌ Missing email or code');
      return NextResponse.json(
        { message: 'Email and OTP code are required', success: false },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      console.log('❌ Invalid code length');
      return NextResponse.json(
        { message: 'OTP code must be 6 digits', success: false },
        { status: 400 }
      );
    }

    // Get stored verification data with password-reset prefix
    const key = `password-reset:${email}`;
    const storedData = verificationCodes.get(key);
    console.log('💾 Stored data for', key, ':', storedData);
    
    if (!storedData) {
      console.log('❌ No password reset OTP found for:', email);
      return NextResponse.json(
        { message: 'No OTP found. Please request a new one.', success: false },
        { status: 400 }
      );
    }

    // Check if code has expired
    const now = Date.now();
    if (now > storedData.expiresAt) {
      console.log(`❌ OTP expired for ${email}. Current time: ${new Date(now).toLocaleTimeString()}, Expires: ${new Date(storedData.expiresAt).toLocaleTimeString()}`);
      verificationCodes.delete(key);
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.', success: false },
        { status: 400 }
      );
    }

    // Verify the code
    if (code.toString().trim() !== storedData.code.toString().trim()) {
      console.log(`❌ Wrong OTP for ${email}. Expected: ${storedData.code}, Got: ${code}`);
      return NextResponse.json(
        { message: 'Invalid OTP. Please try again.', success: false },
        { status: 400 }
      );
    }

    // Success - mark as verified but don't delete yet (user needs it for password reset)
    console.log(`✅ Password reset OTP verified successfully: ${email}`);
    
    return NextResponse.json({
      message: 'OTP verified successfully!',
      success: true,
      verifiedEmail: email
    }, { status: 200 });

  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error during OTP verification', success: false },
      { status: 500 }
    );
  }
}
