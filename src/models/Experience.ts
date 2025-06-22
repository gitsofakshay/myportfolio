import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IExperience extends Document {
  title: string;               // Job title
  company: string;             // Company or organization
  location?: string;           // City, remote, hybrid, etc.
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string[];      // Bullet points of responsibilities
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema: Schema<IExperience> = new Schema<IExperience>(
  {
    title:             { type: String, required: true },
    company:           { type: String, required: true },
    location:          { type: String },
    startDate:         { type: Date, required: true },
    endDate:           { type: Date },
    currentlyWorking:  { type: Boolean, default: false },
    description:       { type: [String] }
  },
  { timestamps: true }
);

const Experience: Model<IExperience> = mongoose.models.Experience || mongoose.model<IExperience>('Experience', experienceSchema);
export default Experience;
