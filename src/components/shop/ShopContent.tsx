"use client";

import ComingSoon from "@/components/shop/ComingSoon";
import type { ProductType } from "@/lib/products";

export default function ShopContent({
  initialProducts,
}: {
  initialProducts: ProductType[];
}) {
  return <ComingSoon />;
}