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

async function parseFormData(req: NextRequest): Promise<{ fields: Record<string, string>, fileBuffer: Buffer | null, fileInfo: any }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: Object.fromEntries(req.headers.entries()),
    });
    const fields: Record<string, string> = {};
    let fileBuffer: Buffer | null = null;
    let fileInfo: any = null;
    busboy.on('field', (name, value) => {
      fields[name] = value;
    });
    busboy.on('file', (name, file, info) => {
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
    Readable.fromWeb(req.body as any).pipe(busboy);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer, fileInfo } = await parseFormData(req);
    const fileName = fields.fileName;
    const isActive = fields.isActive;
    if (!fileName || typeof isActive === 'undefined') {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }
    const resume = await Resume.findById(id);
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    let updatedFields: any = {
      fileName,
      isActive: isActive === 'true'
    };
    if (fileBuffer && fileInfo) {
      if (resume.publicId) {
        await deleteFromCloudinary(resume.publicId, 'raw');
      }
      const uploadResult = await uploadToCloudinary(fileBuffer, 'portfolio/resumes', 'raw');
      updatedFields.fileUrl = uploadResult.url;
      updatedFields.publicId = uploadResult.public_id;
      updatedFields.uploadedAt = new Date();
    }
    const updated = await Resume.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const { id } = await params;
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
