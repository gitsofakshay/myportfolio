import { NextRequest, NextResponse } from 'next/server';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { connectToDatabase } from '@/dbConfig/db';
import { signJwt, createCookie } from '@/helper/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { email, otp } = await req.json();

  // Check OTP in DB
  const record = await OTP.findOne({ email, otp, usertype: 'admin' });
  if (!record) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  // Find the admin user
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  // OTP is valid - delete it now (consume once)
  await OTP.deleteMany({ email, usertype: 'admin' });

  // Generate JWT and set cookie
  const token = signJwt({ id: user._id, email: user.email });
  const cookie = createCookie(token);

  return NextResponse.json(
    { message: 'OTP verified and logged in successfully' },
    { status: 200, headers: { 'Set-Cookie': cookie } } 
  );
}
