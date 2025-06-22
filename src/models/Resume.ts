import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResume extends Document {
  fileUrl: string;         // Secure URL (e.g., Cloudinary or AWS S3)
  publicId?: string;       // For managing/deleting from cloud storage
  fileName: string;        // Display name (e.g., "Akshay_Kushwaha_Resume.pdf")
  uploadedAt: Date;        // Timestamp of the upload
  isActive: boolean;       // Flag to mark the current resume
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema: Schema<IResume> = new Schema<IResume>(
  {
    fileUrl:    { type: String, required: true },
    publicId:   { type: String }, // Optional: for secure deletion
    fileName:   { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    isActive:   { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', resumeSchema);
export default Resume;
