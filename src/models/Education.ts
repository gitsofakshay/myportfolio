import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  currentlyStudying: boolean;
  gradeOrPercentage?: string;
  description?: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema: Schema<IEducation> = new Schema<IEducation>(
  {
    institution:       { type: String, required: true },
    degree:            { type: String, required: true }, 
    fieldOfStudy:      { type: String },
    startDate:         { type: Date, required: true },
    endDate:           { type: Date },
    currentlyStudying: { type: Boolean, default: false },
    gradeOrPercentage: { type: String },
    description:       { type: [String] },
    location:          { type: String }
  },
  { timestamps: true }
);

const Education: Model<IEducation> = mongoose.models.Education || mongoose.model<IEducation>('Education', educationSchema);
export default Education;
