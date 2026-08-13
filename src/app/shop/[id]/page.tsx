import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPublishedProducts, getProductById } from "@/lib/products";
import ProductContent from "@/components/shop/ProductContent";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

const getCachedProduct = cache(async (id: string) => {
  return await getProductById(id);
});

const getCachedProducts = cache(async () => {
  return await getPublishedProducts();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProduct(id);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} — Kerolos Shop`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getCachedProduct(id),
    getCachedProducts(),
  ]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.id !== product.id && p._id !== product._id)
    .slice(0, 3);

  return <ProductContent product={product} related={related} />;
}

export async function generateStaticParams() {
  try {
    const products = await getCachedProducts();
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}
