"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiShoppingBag } from "react-icons/fi";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  shortDescription?: string;
  published: boolean;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products/all");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (p: Product) => {
    try {
      await fetch(`/api/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !p.published }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await fetch(`/api/products/${p._id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black">
              Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your shop products
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-accent/90 transition"
          >
            <FiPlus className="w-4 h-4" />
            New Product
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <FiShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">No products yet.</p>
            <Link
              href="/admin/dashboard/products/new"
              className="text-accent font-medium text-sm"
            >
              Create your first product →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-300 font-display font-bold text-2xl">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      p.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-display font-semibold text-black truncate">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {p.price.toLocaleString("en-US")} EGP
                    {p.category && ` • ${p.category}`}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg border transition ${
                        p.published
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/dashboard/products/edit/${p._id}`}
                      className="flex-1 text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(p)}
                      className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
