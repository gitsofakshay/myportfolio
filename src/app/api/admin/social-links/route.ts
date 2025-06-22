// app/api/admin/social-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import SocialLink from '@/models/SocialLink';
import { verifyAdminAuth } from '@/lib/verifyAdmin';

// Utility: Validate social link fields based on model
function validateSocialLinkFields(body: any) {
  const errors: string[] = [];

  if (!body.platform || typeof body.platform !== 'string' || body.platform.trim() === '') {
    errors.push('Platform is required and must be a non-empty string.');
  }
  if (!body.url || typeof body.url !== 'string' || body.url.trim() === '') {
    errors.push('URL is required and must be a non-empty string.');
  } else {
    // Basic URL validation 
    try {
      new URL(body.url);
    } catch {
      errors.push('URL must be a valid URL.');
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

export async function GET() {
  try {
    await connectToDatabase();
    const links = await SocialLink.find().sort({ createdAt: -1 });
    return NextResponse.json(links);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const body = await req.json(); // { platform, url, icon, isActive }

    // Validation
    const errors = validateSocialLinkFields(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const newLink = await SocialLink.create({
      platform: body.platform.trim(),
      url: body.url.trim(),
      icon: body.icon ? body.icon.trim() : undefined,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
