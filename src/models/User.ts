import mongoose, { Schema } from 'mongoose';
import { User } from '../types';

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth users
  role: { type: String, default: 'admin' },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);