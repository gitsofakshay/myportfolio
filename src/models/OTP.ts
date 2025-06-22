import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Iotp extends Document {
  email: string;
  otp: string;
  usertype: string;
  createdAt: Date;
}

const otpSchema: Schema<Iotp> = new Schema<Iotp>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    usertype: {
      type: String,
      default: 'admin',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Auto-delete after 5 minutes (300s)
    },
  },
  { timestamps: true }
);

const OTP: Model<Iotp> = mongoose.models.otp || mongoose.model<Iotp>('otp', otpSchema);
export default OTP;
