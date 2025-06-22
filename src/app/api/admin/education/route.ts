// app/api/admin/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Education from '@/models/Education';
import { verifyAdminAuth } from '@/lib/verifyAdmin';

// Validation utility for Education
export function validateEducationFields(body: any): string[] {
  const errors: string[] = [];

  if (!body.institution || typeof body.institution !== 'string' || body.institution.trim() === '') {
    errors.push('Institution is required and must be a non-empty string.');
  }
  if (!body.degree || typeof body.degree !== 'string' || body.degree.trim() === '') {
    errors.push('Degree is required and must be a non-empty string.');
  }
  if ('fieldOfStudy' in body && body.fieldOfStudy !== undefined && body.fieldOfStudy !== null && typeof body.fieldOfStudy !== 'string') {
    errors.push('fieldOfStudy must be a string.');
  }
  if (!body.startDate || isNaN(Date.parse(body.startDate))) {
    errors.push('startDate is required and must be a valid date.');
  }
  if ('endDate' in body && body.endDate && isNaN(Date.parse(body.endDate))) {
    errors.push('endDate must be a valid date if provided.');
  }
  if ('currentlyStudying' in body && typeof body.currentlyStudying !== 'boolean') {
    errors.push('currentlyStudying must be a boolean.');
  }
  if ('gradeOrPercentage' in body && body.gradeOrPercentage !== undefined && body.gradeOrPercentage !== null && typeof body.gradeOrPercentage !== 'string') {
    errors.push('gradeOrPercentage must be a string.');
  }
  if ('description' in body && body.description !== undefined && body.description !== null) {
    if (!Array.isArray(body.description) || !body.description.every((item: any) => typeof item === 'string')) {
      errors.push('description must be an array of strings.');
    }
  }
  if ('location' in body && body.location !== undefined && body.location !== null && typeof body.location !== 'string') {
    errors.push('location must be a string.');
  }

  return errors; 
}

// GET all education records
export async function GET() {
  try {
    await connectToDatabase();
    const educationList = await Education.find().sort({ startDate: -1 });
    return NextResponse.json(educationList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new education entry
export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body = await req.json();

    // Validation 
    const errors = validateEducationFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const newEducation = await Education.create({
      institution: body.institution.trim(),
      degree: body.degree.trim(),
      fieldOfStudy: body.fieldOfStudy && body.fieldOfStudy.trim() !== '' ? body.fieldOfStudy.trim() : undefined,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      currentlyStudying: typeof body.currentlyStudying === 'boolean' ? body.currentlyStudying : false,
      gradeOrPercentage: body.gradeOrPercentage && body.gradeOrPercentage.trim() !== '' ? body.gradeOrPercentage.trim() : undefined,
      description: Array.isArray(body.description) && body.description.length > 0
        ? body.description.map((d: string) => d.trim()).filter(Boolean)
        : undefined,
      location: body.location && body.location.trim() !== '' ? body.location.trim() : undefined,
    });
    return NextResponse.json(newEducation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
