import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  video?: {
    secure_url: string;
    public_id: string;
  };
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema<IProject> = new Schema<IProject>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    techStack:   { type: [String], required: true },
    githubLink:  { type: String },
    liveLink:    { type: String },
    video: {
      secure_url: { type: String },
      public_id:  { type: String }
    },
    isFeatured:  { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
export default Project;
