import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Define the interface for the document
export interface IPersonalInfo extends Document {
  fullName: string;
  title: string;
  bio: string;
  profileImage: string; // Cloudinary URL or public path
  profileImagePublicId: string,
  location: string;
  email: string;
  phone: string;
}

// 2. Create the schema
const personalInfoSchema: Schema<IPersonalInfo> = new Schema<IPersonalInfo>(
  {
    fullName:   { type: String, required: true },
    title:      { type: String, required: true },
    bio:        { type: String },
    profileImage: { type: String },
    profileImagePublicId: {type: String},
    location:   { type: String },
    email:      { type: String, required: true },
    phone:      { type: String }
  },
  { timestamps: true }
);

// 3. Export the model
const PersonalInfo: Model<IPersonalInfo> = mongoose.models.PersonalInfo || mongoose.model<IPersonalInfo>('PersonalInfo', personalInfoSchema);
export default PersonalInfo;
