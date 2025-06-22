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
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    }

    // Validation
    const errors = validateEducationFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const updateData: any = {};
    if ('institution' in body) updateData.institution = body.institution.trim();
    if ('degree' in body) updateData.degree = body.degree.trim();
    if ('fieldOfStudy' in body) updateData.fieldOfStudy = body.fieldOfStudy && body.fieldOfStudy.trim() !== '' ? body.fieldOfStudy.trim() : undefined;
    if ('startDate' in body) updateData.startDate = new Date(body.startDate);
    if ('endDate' in body) updateData.endDate = body.endDate ? new Date(body.endDate) : undefined;
    if ('currentlyStudying' in body) updateData.currentlyStudying = body.currentlyStudying;
    if ('gradeOrPercentage' in body) updateData.gradeOrPercentage = body.gradeOrPercentage && body.gradeOrPercentage.trim() !== '' ? body.gradeOrPercentage.trim() : undefined;
    if ('description' in body && Array.isArray(body.description)) {
      updateData.description = body.description.map((d: string) => d.trim()).filter(Boolean);
      if (updateData.description.length === 0) updateData.description = undefined;
    }
    if ('location' in body) updateData.location = body.location && body.location.trim() !== '' ? body.location.trim() : undefined;

    const updated = await Education.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    }
    const deleted = await Education.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    return NextResponse.json({ message: 'Education deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
