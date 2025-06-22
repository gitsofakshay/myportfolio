// app/api/admin/skills/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Skill from '@/models/Skills';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import mongoose from 'mongoose';

// Utility: Validate skill fields based on model
function validateSkillFields(body: any) {
  const errors: string[] = [];
  const allowedLevels = ['Beginner', 'Intermediate', 'Expert'];

  if ('name' in body) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('Skill name must be a non-empty string.');
    }
  }
  if ('level' in body) {
    if (!allowedLevels.includes(body.level)) {
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

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const {id} = await params;
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid or missing Skill ID.' }, { status: 400 });
    }
    const body = await req.json();
    const errors = validateSkillFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    // Clean up fields 
    const updateData: any = {};
    if ('name' in body) updateData.name = body.name.trim();
    if ('level' in body) updateData.level = body.level;
    if ('category' in body) updateData.category = body.category ? body.category.trim() : undefined;

    const updated = await Skill.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
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
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid or missing Skill ID.' }, { status: 400 });
    }
    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    return NextResponse.json({ message: 'Skill deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
