import mongoose, { Schema, Document } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  currency: string;
  paymentMethod: "instapay" | "paypal";
  status: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    currency: { type: String, default: "EGP" },
    paymentMethod: { type: String, enum: ["instapay", "paypal"], default: "instapay" },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
