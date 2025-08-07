import mongoose, { Schema } from 'mongoose';
import { Consumer } from '../types';

const ConsumerSchema = new Schema<Consumer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String },
  accountNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Note: indexes on email and accountNumber are already created by unique: true option

// Update the updatedAt field before saving
ConsumerSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

export default mongoose.models.Consumer || mongoose.model<Consumer>('Consumer', ConsumerSchema);
