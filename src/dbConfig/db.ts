import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global caching to prevent multiple connections in development
let cached = (global as unknown as { mongoose?: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose?: MongooseCache }).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!cached) {
    throw new Error('Mongoose cache is not initialized');
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'myportfolio', 
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('MongoDB connected');
      return mongoose;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
