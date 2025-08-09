import mongoose, { Schema } from 'mongoose';
import { License } from '../types';

type ILicenseType = Omit<License, 'productId' | 'consumerId' | 'createdBy'> & { 
  productId: Schema.Types.ObjectId;
  consumerId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
};

const LicenseSchema = new Schema<ILicenseType>({
  licenseKey: { type: String, required: true, unique: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  consumerId: { type: Schema.Types.ObjectId, ref: 'Consumer', required: true },
  licenseType: { type: String, enum: ['full', 'trial'], required: true },
  expires: { type: Date },
  active: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

LicenseSchema.index({ licenseKey: 1, consumerId: 1 });
// Add compound index for uniqueness check - now per user
LicenseSchema.index({ licenseType: 1, productId: 1, consumerId: 1, createdBy: 1 }, { unique: true });

LicenseSchema.pre('save', async function(next) {
  // Only check for new documents
  if (!this.isNew) return next();
  const existing = await mongoose.models.License.findOne({
    productId: this.productId,
    consumerId: this.consumerId,
    createdBy: this.createdBy,
  });
  if (existing) {
  return next(new Error('License already exists for this product, consumer, and user.'));
  }
  next();
});

export default mongoose.models.License || mongoose.model<ILicenseType>('License', LicenseSchema);