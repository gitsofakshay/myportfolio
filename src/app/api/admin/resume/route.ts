// app/api/admin/resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Resume from '@/models/Resume';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary } from '@/lib/cloudinary';
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

// GET the latest resume 
export async function GET() {
  try {
    await connectToDatabase();
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (!resume) {
      return NextResponse.json({ error: 'No resume found' }, { status: 404 });
    }
    return NextResponse.json(resume);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new resume with file upload
export async function POST(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();
  try {
    const { fileBuffer, fileInfo } = await parseFormData(req);
    if (!fileBuffer || !fileInfo) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }
    const uploadResult = await uploadToCloudinary(fileBuffer, 'portfolio/resumes', 'auto');
    const newResume = await Resume.create({
      fileUrl: uploadResult.url,
      publicId: uploadResult.public_id,
      fileName: fileInfo.filename || 'Resume.pdf',
      uploadedAt: new Date(),
      isActive: true,
    });
    return NextResponse.json(newResume, { status: 201 });
  } catch (uploadError: any) {
    return NextResponse.json({ error: uploadError.message || 'Resume upload failed' }, { status: 500 });
  }
}
