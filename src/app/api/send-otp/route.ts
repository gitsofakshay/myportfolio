import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/dbConfig/db';
import { sendAndStoreOtp } from '@/helper/handleOtp';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

  await sendAndStoreOtp(email, 'admin');

  return NextResponse.json({ message: 'OTP sent successfully' }); 
}
