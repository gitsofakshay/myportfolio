// app/api/admin/skills/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Skill from '@/models/Skills';
import { verifyAdminAuth } from '@/lib/verifyAdmin';

// Utility: Validate skill fields based on model
function validateSkillFields(body: Record<string, unknown>) {
  const errors: string[] = [];
  const allowedLevels = ['Beginner', 'Intermediate', 'Expert'];

  if ('name' in body) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('Skill name must be a non-empty string.');
    }
  }
  if ('level' in body) {
    if (typeof body.level !== 'string' || !allowedLevels.includes(body.level)) {
      errors.push(`Level must be one of: ${allowedLevels.join(', ')}`);
    }
  }
  if ('category' in body && body.category !== undefined && body.category !== null) {
    if (typeof body.category !== 'string') {
      errors.push('Category must be a string.');
    }
  }
  return errors;
}

export async function PUT(req: NextRequest) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    // Extract id from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }
    const body: Record<string, unknown> = await req.json();
    const errors = validateSkillFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    // Clean up fields
    const updateData: Record<string, unknown> = {};
    if ('name' in body && typeof body.name === 'string') updateData.name = body.name.trim();
    if ('level' in body && typeof body.level === 'string') updateData.level = body.level;
    if ('category' in body && typeof body.category === 'string') updateData.category = body.category ? body.category.trim() : undefined;

    const updated = await Skill.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    // Extract id from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }
    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    return NextResponse.json({ message: 'Skill deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
