import mongoose, { Schema } from 'mongoose';
import { Product } from '../types';

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);