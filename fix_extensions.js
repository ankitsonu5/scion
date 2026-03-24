const fs = require("fs");
const path = require("path");

const baseDir = "c:\\Users\\idkth\\Documents\\scion";
const audit = JSON.parse(fs.readFileSync("full_image_audit.json", "utf8"));

const extensions = [".jpg", ".jpeg", ".png", ".webp"];

function fixExtensions() {
  const missing = audit.filter((a) => !a.exists && !a.src.startsWith("http"));
  console.log(`Found ${missing.length} missing local images.`);

  const fixes = [];

  missing.forEach((m) => {
    const decodedSrc = decodeURIComponent(m.src.split("?")[0]);
    const ext = path.extname(decodedSrc);
    const nameWithoutExt = decodedSrc.slice(0, -ext.length);

    for (const targetExt of extensions) {
      if (targetExt === ext) continue;
      const candidateSrc = nameWithoutExt + targetExt;
      const fullPath = path.join(
        baseDir,
        candidateSrc.replace(/\//g, path.sep),
      );
      if (fs.existsSync(fullPath)) {
        fixes.push({ file: m.file, oldSrc: m.src, newSrc: candidateSrc });
        break;
      }
    }
  });

  console.log(`Suggested fixes: ${fixes.length}`);

  // Apply fixes
  const filesToUpdate = [...new Set(fixes.map((f) => f.file))];
  filesToUpdate.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    const fileFixes = fixes.filter((f) => f.file === file);
    fileFixes.forEach((fix) => {
      // Be careful with replacement to only replace the exact src
      const escapedOld = fix.oldSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedOld, "g");
      content = content.replace(regex, fix.newSrc);
    });
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated ${file}`);
  });
}

fixExtensions();
