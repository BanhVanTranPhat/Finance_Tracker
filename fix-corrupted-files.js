import fs from "fs";
import path from "path";

const srcDir = "./src";

function fixCorruptedFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Check if file is corrupted (minified)
    if (content.includes("import{") && content.length < 2000) {
      console.log(`Fixing corrupted file: ${filePath}`);

      // This is a placeholder - in reality, we'd need to restore from git or backup
      console.log(
        `File ${filePath} appears to be corrupted and needs manual restoration`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      fixCorruptedFile(filePath);
    }
  }
}

console.log("Scanning for corrupted files...");
scanDirectory(srcDir);
console.log("Scan complete!");
