import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISocialLink extends Document {
  platform: string;      // e.g., 'GitHub', 'LinkedIn'
  url: string;           // Full link to the profile
  icon?: string;         // Optional icon name (for frontend rendering)
  isActive: boolean;     // Whether to display this link
  createdAt: Date;
  updatedAt: Date; 
}

const socialLinkSchema: Schema<ISocialLink> = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },    // e.g., "LinkedIn"
    url:      { type: String, required: true },    // e.g., "https://linkedin.com/in/username"
    icon:     { type: String },                    // e.g., "linkedin", "github" (for icon library)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SocialLink: Model<ISocialLink> = mongoose.models.SocialLink || mongoose.model<ISocialLink>('SocialLink', socialLinkSchema);
export default SocialLink;
