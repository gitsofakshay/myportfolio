// app/api/admin/experience/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Experience from '@/models/Experience';
import { verifyAdminAuth } from '@/lib/verifyAdmin';

// Validation utility for Experience
export function validateExperienceFields(body: any): string[] {
  const errors: string[] = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string.');
  }
  if (!body.company || typeof body.company !== 'string' || body.company.trim() === '') {
    errors.push('Company is required and must be a non-empty string.');
  }
  if (!body.startDate || isNaN(Date.parse(body.startDate))) {
    errors.push('startDate is required and must be a valid date.');
  }
  if ('endDate' in body && body.endDate && isNaN(Date.parse(body.endDate))) {
    errors.push('endDate must be a valid date if provided.');
  }
  if ('currentlyWorking' in body && typeof body.currentlyWorking !== 'boolean') {
    errors.push('currentlyWorking must be a boolean.');
  }
  if ('location' in body && body.location !== undefined && body.location !== null && typeof body.location !== 'string') {
    errors.push('location must be a string.');
  }
  if ('description' in body && body.description !== undefined && body.description !== null) {
    if (!Array.isArray(body.description) || !body.description.every((item: any) => typeof item === 'string')) {
      errors.push('description must be an array of strings.');
    }
  }
  return errors;
}

// GET all experiences
export async function GET() {
  try {
    await connectToDatabase();
    const experienceList = await Experience.find().sort({ startDate: -1 });
    return NextResponse.json(experienceList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new experience
export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body = await req.json(); 

    // Validation
    const errors = validateExperienceFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const newExperience = await Experience.create({
      title: body.title.trim(),
      company: body.company.trim(),
      location: body.location && body.location.trim() !== '' ? body.location.trim() : undefined,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      currentlyWorking: typeof body.currentlyWorking === 'boolean' ? body.currentlyWorking : false,
      description: Array.isArray(body.description) && body.description.length > 0
        ? body.description.map((d: string) => d.trim()).filter(Boolean)
        : undefined,
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
