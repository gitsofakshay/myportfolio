import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import User from '@/models/User';
import { signJwt, createCookie } from '@/helper/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 401 });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return NextResponse.json({ message: 'Invalid password' }, { status: 401 });

    const token = signJwt({ id: user._id, email: user.email });
    const cookie = createCookie(token);

    const response = NextResponse.json({ message: 'Login successful' });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
