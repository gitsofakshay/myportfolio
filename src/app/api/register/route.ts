import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, email, password, registerToken } = await req.json();

    // Check for existing admin
    const existingAdmin = await User.findOne({});
    if (existingAdmin && registerToken !== process.env.ADMIN_REGISTER_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized registration' }, { status: 403 });
    }

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Prevent duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Save user
    const newUser = new User({ username, email, password});
    await newUser.save();

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
