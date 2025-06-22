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
    const body = await req.json();

    // Validation 
    const errors = validateExperienceFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const {id} = await params;

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }
    // Prepare update data
    const updateData: any = {};
    if ('title' in body) updateData.title = body.title.trim();
    if ('company' in body) updateData.company = body.company.trim();
    if ('location' in body) updateData.location = body.location && body.location.trim() !== '' ? body.location.trim() : undefined;
    if ('startDate' in body) updateData.startDate = new Date(body.startDate);
    if ('endDate' in body) updateData.endDate = body.endDate ? new Date(body.endDate) : undefined;
    if ('currentlyWorking' in body) updateData.currentlyWorking = body.currentlyWorking;
    if ('description' in body && Array.isArray(body.description)) {
      updateData.description = body.description.map((d: string) => d.trim()).filter(Boolean);
      if (updateData.description.length === 0) updateData.description = undefined;
    }

    const updated = await Experience.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const {id} = await params;
    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }
    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    return NextResponse.json({ message: 'Experience deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
