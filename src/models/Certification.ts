import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICertification extends Document {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string; // Cloudinary URL or other storage path
  certificateImagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
} 

const certificationSchema: Schema<ICertification> = new Schema<ICertification>(
  {
    name:                 { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate:            { type: Date, required: true },
    expirationDate:       { type: Date },
    doesNotExpire:        { type: Boolean, default: false },
    credentialId:         { type: String },
    credentialUrl:        { type: String },
    certificateImage:     { type: String },
    certificateImagePublicId: {type: String},
  },
  { timestamps: true }
);

const Certification: Model<ICertification> = mongoose.models.Certification || mongoose.model<ICertification>('Certification', certificationSchema);
export default Certification;
