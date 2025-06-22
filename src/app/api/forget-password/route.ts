import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import User from '@/models/User';
import { verifyJwt } from '@/helper/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const token = req.cookies.get('adminToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No token found.' }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = verifyJwt(token); // Will throw if token is invalid 
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { newPassword } = await req.json();
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  user.password = newPassword;
  await user.save();

  return NextResponse.json({ message: 'Password changed successfully' });
}
