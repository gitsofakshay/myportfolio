import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  category?: string; // e.g., "Frontend", "Backend", "DevOps", etc.
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema: Schema<ISkill> = new Schema<ISkill>(
  {
    name:     { type: String, required: true },
    level:    { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Expert'], 
      default: 'Intermediate' 
    },
    category: { type: String }
  },
  { timestamps: true }
);

const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);
export default Skill;
