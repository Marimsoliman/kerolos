"use client";

import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-black">
            New Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a product to your shop
          </p>
        </div>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
