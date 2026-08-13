import type { Metadata } from "next";
import CheckoutContent from "@/components/shop/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — Kerolos Shop",
  description: "Complete your order — InstaPay or PayPal.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
