// src/app/admin/dashboard/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTrash2, FiMail, FiClock } from "react-icons/fi";
interface Inquiry {
  _id: string;
  name: string;
  email: string;
  company: string;
  services: string[];
  budget: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (Array.isArray(data)) setInquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, read: true } : inq))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const openWhatsApp = (inq: Inquiry) => {
    const text = encodeURIComponent(
      `Hi ${inq.name}! Thanks for reaching out about ${inq.services.join(", ")}. I'd love to discuss your project.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <main className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-accent hover:underline mb-6"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black font-display">
              Messages
              {unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center justify-center w-8 h-8 bg-accent text-white text-sm font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {inquiries.length} message(s) from the contact form
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading messages...</p>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <FiMail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  inq.read ? "border-gray-200" : "border-accent/30 bg-accent/[0.02]"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => {
                    setExpandedId(expandedId === inq._id ? null : inq._id);
                    if (!inq.read) markAsRead(inq._id);
                  }}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {inq.read ? (
  <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
) : (
  <FiMail className="w-5 h-5 text-accent flex-shrink-0" />
)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${inq.read ? "text-gray-700" : "text-black"}`}>
                          {inq.name}
                        </span>
                        {inq.company && (
                          <span className="text-xs text-gray-400">• {inq.company}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {inq.services.join(", ")} — {inq.message.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </button>

                {/* Expanded */}
                {expandedId === inq._id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Email</span>
                        <a href={`mailto:${inq.email}`} className="text-sm text-accent hover:underline">
                          {inq.email}
                        </a>
                      </div>
                      {inq.company && (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Company</span>
                          <span className="text-sm text-gray-700">{inq.company}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Services</span>
                        <div className="flex flex-wrap gap-1.5">
                          {inq.services.map((s) => (
                            <span key={s} className="text-[11px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      {inq.budget && (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Budget</span>
                          <span className="text-sm text-gray-700 font-medium">{inq.budget}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Message</span>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={`mailto:${inq.email}?subject=Re: Your Project Inquiry — Kerolos`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent-dark transition"
                      >
                        <FiMail className="w-4 h-4" /> Reply via Email
                      </a>
                      <button
                        onClick={() => openWhatsApp(inq)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm rounded-lg hover:bg-[#20BD5A] transition"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition ml-auto"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
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