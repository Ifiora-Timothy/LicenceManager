import mongoose, { Schema } from 'mongoose';
import { Consumer } from '../types';

// Define interface for the database model
interface IConsumer extends Omit<Consumer, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
}

const ConsumerSchema = new Schema<IConsumer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  accountNumber: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound indexes to ensure email and accountNumber are unique per user
ConsumerSchema.index({ email: 1, createdBy: 1 }, { unique: true });
ConsumerSchema.index({ accountNumber: 1, createdBy: 1 }, { unique: true });

// Update the updatedAt field before saving
ConsumerSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

export default mongoose.models.Consumer || mongoose.model<IConsumer>('Consumer', ConsumerSchema);
