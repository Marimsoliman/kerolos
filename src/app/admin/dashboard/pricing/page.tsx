// src/app/admin/dashboard/pricing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiMove, FiLoader } from "react-icons/fi";

interface Service {
  _id: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  order: number;
  active: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (srv: Service) => {
    setEditingId(srv._id);
    setEditForm({ ...srv });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      await fetchPricing();
      setEditingId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (srv: Service) => {
    try {
      await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: srv._id, active: !srv.active }),
      });
      await fetchPricing();
    } catch (e) {
      console.error(e);
    }
  };

  const addFeature = () => {
    setEditForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setEditForm((prev) => {
      const features = [...(prev.features || [])];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const removeFeature = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-accent hover:underline mb-6"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-black font-display mb-2">
          Service Pricing
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Edit prices, descriptions, and features. Changes appear on the contact page immediately.
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div className="space-y-4">
            {services.map((srv) => (
              <div
                key={srv._id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  srv.active ? "border-gray-200" : "border-gray-200 opacity-50"
                }`}
              >
                {editingId === srv._id ? (
                  /* EDIT MODE */
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Service Name</label>
                        <input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Price Range</label>
                        <input
                          value={editForm.price || ""}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          placeholder="$1,000 — $3,000"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                      <input
                        value={editForm.desc || ""}
                        onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Features</label>
                      <div className="space-y-2">
                        {(editForm.features || []).map((f, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              value={f}
                              onChange={(e) => updateFeature(i, e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
                              placeholder={`Feature ${i + 1}`}
                            />
                            <button
                              onClick={() => removeFeature(i)}
                              className="px-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addFeature}
                          className="text-xs text-accent hover:underline flex items-center gap-1"
                        >
                          <FiPlus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="px-5 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent-dark transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE */
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-black">{srv.name}</h3>
                          <span className="text-accent font-bold text-sm">{srv.price}</span>
                          {!srv.active && (
                            <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{srv.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {srv.features.map((f) => (
                            <span key={f} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              • {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(srv)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition ${
                            srv.active
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {srv.active ? "Active" : "Hidden"}
                        </button>
                        <button
                          onClick={() => startEdit(srv)}
                          className="px-3 py-1.5 bg-accent/10 text-accent text-xs rounded-lg hover:bg-accent/20 transition"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}