import type { Metadata } from "next";
import CartContent from "@/components/shop/CartContent";

export const metadata: Metadata = {
  title: "Cart — Kerolos Shop",
  description: "Your cart.",
};

export default function CartPage() {
  return <CartContent />;
}
