const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folder = "public/images/projects/stellar-coffee";

async function convertImages() {
  const files = fs.readdirSync(folder);

  const images = files.filter((file) =>
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  for (const file of images) {
    const inputPath = path.join(folder, file);
    const outputPath = path.join(
      folder,
      file.replace(/\.(jpg|jpeg|png)$/i, ".webp")
    );

    console.log(`Converting: ${file}`);

    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
  }

  console.log("✅ All images converted to WebP!");
}

convertImages().catch((err) => {
  console.error("❌ Error:", err);
});