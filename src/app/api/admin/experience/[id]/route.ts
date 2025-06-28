// app/api/admin/experience/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Experience from '@/models/Experience';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { validateExperienceFields } from '../route'; 

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body: Record<string, unknown> = await req.json();

    // Validation 
    const errors = validateExperienceFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const {id} = params;

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if ('title' in body && typeof body.title === 'string') updateData.title = body.title.trim();
    if ('company' in body && typeof body.company === 'string') updateData.company = body.company.trim();
    if ('location' in body && typeof body.location === 'string') updateData.location = body.location && body.location.trim() !== '' ? body.location.trim() : undefined;
    if ('startDate' in body && typeof body.startDate === 'string') updateData.startDate = new Date(body.startDate);
    if ('endDate' in body && typeof body.endDate === 'string') updateData.endDate = body.endDate ? new Date(body.endDate) : undefined;
    if ('currentlyWorking' in body && typeof body.currentlyWorking === 'boolean') updateData.currentlyWorking = body.currentlyWorking;
    if ('description' in body && Array.isArray(body.description)) {
      updateData.description = body.description.map((d) => typeof d === 'string' ? d.trim() : '').filter(Boolean);
      if ((updateData.description as string[]).length === 0) updateData.description = undefined;
    }

    const updated = await Experience.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
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
    const {id} = params;
    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }
    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    return NextResponse.json({ message: 'Experience deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
