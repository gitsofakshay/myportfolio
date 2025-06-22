import { clearCookie } from '@/helper/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookie = clearCookie();
  return NextResponse.json({ message: 'Logged out' }, {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
