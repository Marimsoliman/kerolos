// scripts/fix-project-ids.ts
import dbConnect from "../src/lib/mongodb";
import Project from "../src/models/Project";

async function fixProjectIds() {
  await dbConnect();

  const projects = await Project.find({});

  for (const project of projects) {
    if (!project.id) {
      // Generate id from name
      const id = project.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      project.id = id;
      await project.save();

      console.log(`✅ Fixed project: ${project.name} → ${id}`);
    }
  }

  console.log("✅ All projects fixed!");
  process.exit(0);
}

fixProjectIds().catch(console.error);