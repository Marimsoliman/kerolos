"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiImage,
  FiLogOut,
  FiMove,
  FiMail,
  FiDollarSign,
  FiShoppingBag,
} from "react-icons/fi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Project {
  _id: string;
  id: string;
  name: string;
  category: string;
  year: string;
  image: string;
  published: boolean;
  order: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
      fetchUnreadCount();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/all");
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(sorted);
      } else if (data.error) {
        setError(data.error);
        setProjects([]);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnreadCount(data.filter((i: any) => !i.read).length);
      }
    } catch (e) {
      console.error("Failed to fetch unread count:", e);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setProjects(updatedItems);

    try {
      setSaving(true);
      await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects: updatedItems.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Failed to save new order");
      fetchProjects();
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (projectId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-16">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black">
              Kerolos <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {session?.user?.name || session?.user?.email}
            </p>
          </div>

          {/* ⚡ Buttons مع Messages + Pricing */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard/messages"
              className="relative bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FiMail className="w-4 h-4" />
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/dashboard/pricing"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <FiDollarSign className="w-4 h-4" />
              Pricing
            </Link>

            <Link
              href="/admin/dashboard/logos"
              className="bg-black text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition flex items-center gap-2"
            >
              <FiImage className="w-4 h-4" />
              Logos
            </Link>

            <Link
              href="/admin/dashboard/products"
              className="bg-violet-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-violet-700 transition flex items-center gap-2"
            >
              <FiShoppingBag className="w-4 h-4" />
              Products
            </Link>

            <Link
              href="/admin/dashboard/new"
              className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-accent/90 transition flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              New Project
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-accent/5 hover:text-accent transition"
              title="Sign Out"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-black">All Projects</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {projects.length} project(s) • Drag to reorder
            </p>
          </div>
          {saving && (
            <span className="text-sm text-accent font-medium">
              Saving order...
            </span>
          )}
        </div>

        {error && (
          <div className="bg-accent/5 text-accent p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Drag & Drop Grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, index) => (
                  <Draggable
                    key={project._id}
                    draggableId={project._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all ${
                          snapshot.isDragging
                            ? "shadow-2xl scale-105 rotate-2"
                            : ""
                        }`}
                      >
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between cursor-move hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-2">
                            <FiMove className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-mono text-gray-500">
                              #{index + 1}
                            </span>
                          </div>
                          {!project.published && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                              Draft
                            </span>
                          )}
                        </div>

                        <div className="relative aspect-video bg-gray-100">
                          <Image
                            src={project.image || "/placeholder.jpg"}
                            alt={project.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5">
                          <div className="mb-4">
                            <h3 className="font-bold text-black text-lg mb-1">
                              {project.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">
                              {project.category} • {project.year}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Link
                              href={`/admin/dashboard/edit/${project.id}`}
                              className="flex-1 bg-gray-100 text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center flex items-center justify-center gap-2"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                togglePublish(project.id, project.published)
                              }
                              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                              title={
                                project.published ? "Unpublish" : "Publish"
                              }
                            >
                              {project.published ? (
                                <FiEye className="w-4 h-4 text-green-600" />
                              ) : (
                                <FiEyeOff className="w-4 h-4 text-gray-400" />
                              )}
                            </button>

                            <button
                              onClick={() => deleteProject(project.id)}
                              className="px-3 py-2 bg-accent/5 rounded-lg hover:bg-accent/10 transition"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4 text-accent" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {projects.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4 text-sm">
              No projects found in database.
            </p>
            <Link
              href="/admin/dashboard/new"
              className="text-accent hover:underline font-medium text-sm"
            >
              + Create your first project
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}