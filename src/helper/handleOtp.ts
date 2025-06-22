import OTP from '@/models/OTP';
import { sendOtpEmail } from './sendEmail';

export function generateOtp(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function sendAndStoreOtp(email: string, usertype = 'admin') {
  const otp = generateOtp();

  // Remove old OTPs for this user/email
  await OTP.deleteMany({ email, usertype });

  // Store new OTP in DB
  await OTP.create({ email, otp, usertype });

  // Send via email
  await sendOtpEmail(email, otp);
}
