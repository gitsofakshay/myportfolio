// app/api/admin/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig/db';
import Project from '@/models/Project';
import { verifyAdminAuth } from '@/lib/verifyAdmin';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
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

export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  verifyAdminAuth();
  await connectToDatabase();

  try {
    const { fields, fileBuffer } = await parseFormData(req);
    const validationError = validateFields(fields);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    // Check if projectId is provided
    const { projectId } = params;
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    // Find existing project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    let videoData = project.video;
    // If new video is uploaded, replace old Cloudinary video
    if (fileBuffer) {
      if (project.video?.public_id) {
        await deleteFromCloudinary(project.video.public_id, 'video');
      }
      const uploadResult = await uploadToCloudinary(fileBuffer, 'portfolio/videos', 'video');
      if (!uploadResult || !uploadResult.url || !uploadResult.public_id) {
        return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
      }
      videoData = {
        secure_url: uploadResult.url,
        public_id: uploadResult.public_id,
      };
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
    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: fields.title,
        description: fields.description,
        techStack: techStackArr,
        githubLink: fields.githubLink,
        liveLink: fields.liveLink,
        isFeatured: fields.isFeatured === 'true',
        video: videoData,
      },
      { new: true }
    );
    return NextResponse.json(updatedProject, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

//Route to delete project
export async function DELETE(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    verifyAdminAuth();
    await connectToDatabase();
    const { projectId } = params;
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    // Delete associated Cloudinary video
    if (project.video?.public_id) {
      await deleteFromCloudinary(project.video.public_id, 'video');
    }
    await project.deleteOne();
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}