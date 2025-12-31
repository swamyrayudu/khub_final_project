import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { verificationCodes } from '@/lib/verification-storage';

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createPasswordResetEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #0a0a0a; text-align: center; margin-bottom: 20px;">Password Reset Request</h1>
        <p style="color: #525252; font-size: 16px;">You requested to reset your password. Use this code to proceed:</p>
        <div style="background: #f97316; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #737373; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #737373; font-size: 12px; margin-top: 15px;">If you didn't request a password reset, please ignore this email and contact support if you have concerns.</p>
      </div>
    </div>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Valid email is required', success: false },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + (10 * 60 * 1000);

    // Store with a prefix to distinguish from registration OTPs
    verificationCodes.set(`password-reset:${email}`, { code: otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Localhunt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - One Time Code',
      html: createPasswordResetEmailTemplate(otp),
    });

    console.log(`✅ Password reset OTP sent to ${email}: ${otp}`);

    return NextResponse.json({
      message: 'Password reset code sent successfully',
      success: true
    });

  } catch (error) {
    console.error('❌ Error sending password reset code:', error);
    return NextResponse.json(
      { message: 'Failed to send password reset code', success: false },
      { status: 500 }
    );
  }
}
