import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import EditProductForm from "./EditForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const products = await getAllProducts();
  const product = products.find(
    (p) => p._id === id || p.id === decodeURIComponent(id)
  );

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
