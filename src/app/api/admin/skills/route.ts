// app/api/admin/skills/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Skill from '@/models/Skills';
import { verifyAdminAuth } from '@/lib/verifyAdmin';

// GET all skills
export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ createdAt: -1 });
    return NextResponse.json(skills);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// POST new skill
export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();

    await connectToDatabase();
    const body: Record<string, unknown> = await req.json(); 

    // Validation
    const { name, level, category } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Skill name is required and must be a non-empty string.' }, { status: 400 });
    }

    const allowedLevels = ['Beginner', 'Intermediate', 'Expert'];
    if (level && (typeof level !== 'string' || !allowedLevels.includes(level))) {
      return NextResponse.json({ error: `Level must be one of: ${allowedLevels.join(', ')}` }, { status:400 });
    }

    if (category && typeof category !== 'string') {
      return NextResponse.json({ error: 'Category must be a string.' }, { status: 400 });
    }

    const newSkill = await Skill.create({
      name: (name as string).trim(),
      level: level || 'Intermediate',
      category: category ? (category as string).trim() : undefined,
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
