// lib/verifyAdmin.ts
import { cookies } from 'next/headers';
import { verifyJwt } from '../helper/auth';

export async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;
  if (!token) throw new Error('Unauthorized');
  return verifyJwt(token); // returns decoded data if valid
}
