// app/api/admin/certifications/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Certification from '@/models/Certification';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
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

export async function PUT(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();
  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const errorMessage = validate(fields);
    if (errorMessage) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Extract id from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
    }
    let certificateImage = fields.existingImage || '';
    let certificateImagePublicId = fields.existingImagePublicId || '';
    if (fileBuffer) {
      const upload = await uploadToCloudinary(fileBuffer, 'portfolio/certificates', 'image');
      certificateImage = upload.url;
      certificateImagePublicId = upload.public_id;
    }
    const updated = await Certification.findByIdAndUpdate(
      id,
      {
        name: fields.name,
        issuingOrganization: fields.issuingOrganization,
        issueDate: fields.issueDate ? new Date(fields.issueDate) : undefined,
        expirationDate: fields.expirationDate ? new Date(fields.expirationDate) : undefined,
        doesNotExpire: fields.doesNotExpire === 'true',
        credentialId: fields.credentialId,
        credentialUrl: fields.credentialUrl,
        certificateImage: certificateImage,
        certificateImagePublicId: certificateImagePublicId,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
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
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
    }
    const certificate = await Certification.findById(id);
    if (!certificate) return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    if (certificate.certificateImagePublicId) {
      await deleteFromCloudinary(certificate.certificateImagePublicId, 'image');
    }
    await certificate.deleteOne();
    return NextResponse.json({ message: 'Certification deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

