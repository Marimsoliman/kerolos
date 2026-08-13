// src/app/admin/dashboard/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import EditProjectForm from "./EditForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  
  // ⚡ جلب البيانات مباشرة من قاعدة البيانات في أقل من 10 مللي ثانية!
  const project = await getProjectById(decodeURIComponent(id));

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}