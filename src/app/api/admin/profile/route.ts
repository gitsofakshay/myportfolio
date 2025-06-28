import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Profile from '@/models/PersonalInfo';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Required fields for validation
const requiredFields = ['fullName', 'title', 'bio', 'location', 'email', 'phone'];

function validateFields(fields: Record<string, string>): string | null {
  for (const field of requiredFields) {
    if (!fields[field] || !fields[field].trim()) {
      return `Missing or empty field: ${field}`;
    }
  }
  return null;
}

async function parseFormData(req: NextRequest): Promise<{ fields: Record<string, string>, fileBuffer: Buffer | null, fileInfo: Record<string, unknown> | null }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: Object.fromEntries(req.headers.entries()),
    });
    const fields: Record<string, string> = {};
    let fileBuffer: Buffer | null = null;
    let fileInfo: Record<string, unknown> | null = null;
    busboy.on('field', (name, value) => {
      fields[name] = value;
    });
    busboy.on('file', (name, file, info) => {
      const chunks: Buffer[] = [];
      fileInfo = info as unknown as Record<string, unknown>;
      file.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });
    busboy.on('finish', () => {
      resolve({ fields, fileBuffer, fileInfo });
    });
    busboy.on('error', reject);
    // Convert the web stream to a Node.js readable stream
    // @ts-expect-error: Node.js/Next.js stream type mismatch workaround
    Readable.fromWeb(req.body).pipe(busboy);
  });
}

export async function POST(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const validationError = validateFields(fields);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    let profileImage = '';
    let profileImagePublicId = '';
    if (fileBuffer) {
      const upload = await uploadToCloudinary(fileBuffer, 'portfolio/profile', 'image');
      profileImage = upload.url;
      profileImagePublicId = upload.public_id;
    }
    const newProfile = await Profile.create({
      fullName: fields.fullName,
      email: fields.email,
      title: fields.title,
      bio: fields.bio,
      location: fields.location ?? '',
      phone: fields.phone ?? '',
      profileImage,
      profileImagePublicId,
    });
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const validationError = validateFields(fields);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const profile = await Profile.findOne();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    let profileImage = profile.profileImage;
    let profileImagePublicId = profile.profileImagePublicId;
    if (fileBuffer) {
      const upload = await uploadToCloudinary(fileBuffer, 'portfolio/profile', 'image');
      profileImage = upload.url;
      profileImagePublicId = upload.public_id;
    }
    const updated = await Profile.findOneAndUpdate(
      {},
      {
        fullName: fields.fullName,
        email: fields.email,
        title: fields.title,
        bio: fields.bio,
        location: fields.location ?? '',
        phone: fields.phone ?? '',
        profileImage,
        profileImagePublicId,
      },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne();
    return NextResponse.json(profile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
