"use client";

import ComingSoon from "@/components/shop/ComingSoon";
import type { ProductType } from "@/lib/products";

export default function ProductContent({
  product,
  related,
}: {
  product: ProductType;
  related: ProductType[];
}) {
  return <ComingSoon />;
}