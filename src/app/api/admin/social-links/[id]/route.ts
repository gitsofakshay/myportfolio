// app/api/admin/social-links/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import SocialLink from '@/models/SocialLink';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import mongoose from 'mongoose';

// Utility: Validate social link fields based on model
function validateSocialLinkFields(body: Record<string, unknown>) {
  const errors: string[] = [];

  if ('platform' in body) {
    if (typeof body.platform !== 'string' || body.platform.trim() === '') {
      errors.push('Platform must be a non-empty string.');
    }
  }
  if ('url' in body) {
    if (typeof body.url !== 'string' || body.url.trim() === '') {
      errors.push('URL must be a non-empty string.');
    } else {
      try {
        new URL(body.url);
      } catch {
        errors.push('URL must be a valid URL.');
      }
    }
  }
  if ('icon' in body && body.icon !== undefined && body.icon !== null) {
    if (typeof body.icon !== 'string') {
      errors.push('Icon must be a string.');
    }
  }
  if ('isActive' in body && typeof body.isActive !== 'boolean') {
    errors.push('isActive must be a boolean.');
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
    const {id} = params;
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid or missing SocialLink ID.' }, { status: 400 });
    }
    const body: Record<string, unknown> = await req.json();
    const errors = validateSocialLinkFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const updateData: Record<string, unknown> = {};
    if ('platform' in body && typeof body.platform === 'string') updateData.platform = body.platform.trim();
    if ('url' in body && typeof body.url === 'string') updateData.url = body.url.trim();
    if ('icon' in body && typeof body.icon === 'string') updateData.icon = body.icon ? body.icon.trim() : undefined;
    if ('isActive' in body && typeof body.isActive === 'boolean') updateData.isActive = body.isActive;
    const updated = await SocialLink.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: 'Link not found' }, { status: 404 });
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
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid or missing SocialLink ID.' }, { status: 400 });
    }
    const deleted = await SocialLink.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    return NextResponse.json({ message: 'Link deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
