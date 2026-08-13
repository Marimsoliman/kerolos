// src/models/Logo.ts
import mongoose from 'mongoose';

const LogoSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    name: { type: String, default: 'Brand Logo' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Logo || mongoose.model('Logo', LogoSchema);