// app/api/admin/experience/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Experience from '@/models/Experience';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { validateExperienceFields } from './validate';

// GET all experiences
export async function GET() {
  try {
    await connectToDatabase();
    const experienceList = await Experience.find().sort({ startDate: -1 });
    return NextResponse.json(experienceList);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// POST new experience
export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body: Record<string, unknown> = await req.json();

    // Validation
    const errors = validateExperienceFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const newExperience = await Experience.create({
      title: typeof body.title === 'string' ? body.title.trim() : '',
      company: typeof body.company === 'string' ? body.company.trim() : '',
      location: typeof body.location === 'string' && body.location.trim() !== '' ? body.location.trim() : undefined,
      startDate: typeof body.startDate === 'string' ? new Date(body.startDate) : undefined,
      endDate: typeof body.endDate === 'string' ? new Date(body.endDate) : undefined,
      currentlyWorking: typeof body.currentlyWorking === 'boolean' ? body.currentlyWorking : false,
      description: Array.isArray(body.description) && body.description.length > 0
        ? body.description.map((d) => typeof d === 'string' ? d.trim() : '').filter(Boolean)
        : undefined,
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
