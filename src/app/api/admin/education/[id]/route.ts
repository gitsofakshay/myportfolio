// app/api/admin/education/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Education from '@/models/Education';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { validateEducationFields } from '../route'; // Import validation function

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const body = await req.json();

    // Validation
    const errors = validateEducationFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const updated = await Education.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    
    const deleted = await Education.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    return NextResponse.json({ message: 'Education deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
