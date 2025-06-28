// app/api/admin/resume/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Resume from '@/models/Resume';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // @ts-expect-error: Node.js/Next.js stream type mismatch workaround
    Readable.fromWeb(req.body).pipe(busboy);
  });
}

export async function PUT(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();
  try {
    const { fields, fileBuffer, fileInfo } = await parseFormData(req);
    const fileName = fields.fileName;
    const isActive = fields.isActive;
    // Extract id from URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!fileName || typeof isActive === 'undefined') {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }
    const resume = await Resume.findById(id);
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    const updatedFields: Record<string, unknown> = {
      fileName,
      isActive: isActive === 'true'
    };
    if (fileBuffer && fileInfo) {
      if (resume.publicId) {
        await deleteFromCloudinary(resume.publicId, 'auto');
      }
      const uploadResult = await uploadToCloudinary(fileBuffer, 'portfolio/resumes', 'auto');
      updatedFields.fileUrl = uploadResult.url;
      updatedFields.publicId = uploadResult.public_id;
      updatedFields.uploadedAt = new Date();
    }
    const updated = await Resume.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
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
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }
    const resume = await Resume.findById(id);
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    if (resume.publicId) {
      await deleteFromCloudinary(resume.publicId, 'raw');
    }
    await Resume.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Resume deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
