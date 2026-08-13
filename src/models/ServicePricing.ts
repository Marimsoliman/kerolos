// src/models/ServicePricing.ts
import mongoose from "mongoose";

const servicePricingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    desc: { type: String, default: "" },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServicePricing ||
  mongoose.model("ServicePricing", servicePricingSchema);