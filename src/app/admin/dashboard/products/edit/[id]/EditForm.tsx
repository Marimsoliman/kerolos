"use client";

import ProductForm from "../../ProductForm";
import type { ProductType } from "@/lib/products";

export default function EditProductForm({ product }: { product: ProductType }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-black">
            Edit Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {product.name}
          </p>
        </div>
        <ProductForm
          mode="edit"
          initial={{
            _id: product._id,
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            shortDescription: product.shortDescription,
            description: product.description,
            features: product.features,
            published: product.published,
          }}
        />
      </div>
    </div>
  );
}
