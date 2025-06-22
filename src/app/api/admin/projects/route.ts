// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Project from '@/models/Project';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // Required for multipart/form-data
  },
};

function validateFields(fields: Record<string, string>): string | null {
  const requiredFields = ['title', 'description', 'techStack', 'githubLink', 'liveLink'];
  for (const field of requiredFields) {
    if (!fields[field] || fields[field].trim() === '') {
      return `${field} is required`;
    }
  }
  return null;
}

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

// GET all projects (public access if you want)
export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new project (admin only)
export async function POST(req: NextRequest) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const validationError = validateFields(fields);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    if (!fileBuffer) {
      return NextResponse.json({ error: 'No video file uploaded' }, { status: 400 });
    }
    const uploadResult = await uploadToCloudinary(fileBuffer, 'portfolio/videos', 'video');
    if (!uploadResult || !uploadResult.url || !uploadResult.public_id) {
      console.error('Cloudinary upload failed:', uploadResult);
      return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }
    let techStackArr: string[] = [];
    if (fields.techStack) {
      try {
        techStackArr = JSON.parse(fields.techStack);
        if (!Array.isArray(techStackArr)) throw new Error();
      } catch {
        techStackArr = fields.techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    const newProject = await Project.create({
      title: fields.title,
      description: fields.description,
      techStack: techStackArr,
      githubLink: fields.githubLink,
      liveLink: fields.liveLink,
      video: {
        secure_url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      isFeatured: fields.isFeatured === 'true',
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (err: any) {
    console.error('Failed to save project:', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}