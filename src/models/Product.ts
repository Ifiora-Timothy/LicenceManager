import mongoose, { Schema } from 'mongoose';
import { Product } from '../types';

// Define interface for the database model
interface IProduct extends Omit<Product, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create compound index to ensure product names are unique per user
ProductSchema.index({ name: 1, createdBy: 1 }, { unique: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);