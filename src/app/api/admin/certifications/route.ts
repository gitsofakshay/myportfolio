// app/api/admin/certifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Certification from '@/models/Certification';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
}; 

const requiredFields = ['name', 'issuingOrganization', 'issueDate'];

function validate(fields: Record<string, string>): string | null {
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
    busboy.on('file', (name, file, info: Record<string, unknown>) => {
      const chunks: Buffer[] = [];
      fileInfo = info;
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
    // @ts-expect-error: Node.js Readable expects a web ReadableStream, but types are not fully compatible
    Readable.fromWeb(req.body as unknown).pipe(busboy);
  });
}

// GET all certifications
export async function GET() {
  try {
    await connectToDatabase();
    const list = await Certification.find().sort({ issueDate: -1 });
    return NextResponse.json(list);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

// POST new certification
export async function POST(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const errorMessage = validate(fields);
    if (errorMessage) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    let certificateImage = '';
    let certificateImagePublicId = '';
    if (fileBuffer) {
      const upload = await uploadToCloudinary(fileBuffer, 'portfolio/certificates', 'image');
      certificateImage = upload.url;
      certificateImagePublicId = upload.public_id;
    }
    const cert = await Certification.create({
      name: fields.name,
      issuingOrganization: fields.issuingOrganization,
      issueDate: fields.issueDate ? new Date(fields.issueDate) : undefined,
      expirationDate: fields.expirationDate ? new Date(fields.expirationDate) : undefined,
      doesNotExpire: fields.doesNotExpire === 'true',
      credentialId: fields.credentialId,
      credentialUrl: fields.credentialUrl,
      certificateImage: certificateImage || '',
      certificateImagePublicId: certificateImagePublicId || '',
    });
    return NextResponse.json(cert, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
