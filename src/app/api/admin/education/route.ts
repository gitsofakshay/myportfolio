// app/api/admin/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Education from '@/models/Education';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { validateEducationFields } from './validate';

// GET all education records
export async function GET() {
  try {
    await connectToDatabase();
    const educationList = await Education.find().sort({ startDate: -1 });
    return NextResponse.json(educationList);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// POST new education entry
export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body: Record<string, unknown> = await req.json();

    // Validation
    const errors = validateEducationFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const newEducation = await Education.create({
      institution: typeof body.institution === 'string' ? body.institution.trim() : '',
      degree: typeof body.degree === 'string' ? body.degree.trim() : '',
      fieldOfStudy: typeof body.fieldOfStudy === 'string' && body.fieldOfStudy.trim() !== '' ? body.fieldOfStudy.trim() : undefined,
      startDate: typeof body.startDate === 'string' ? new Date(body.startDate) : undefined,
      endDate: typeof body.endDate === 'string' ? new Date(body.endDate) : undefined,
      currentlyStudying: typeof body.currentlyStudying === 'boolean' ? body.currentlyStudying : false,
      gradeOrPercentage: typeof body.gradeOrPercentage === 'string' && body.gradeOrPercentage.trim() !== '' ? body.gradeOrPercentage.trim() : undefined,
      description: Array.isArray(body.description) && body.description.length > 0
        ? body.description.map((d) => typeof d === 'string' ? d.trim() : '').filter(Boolean)
        : undefined,
      location: typeof body.location === 'string' && body.location.trim() !== '' ? body.location.trim() : undefined,
    });
    return NextResponse.json(newEducation, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
