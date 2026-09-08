import fs from "fs";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "public", "temp");

const FILE_EXPIRY = 15 * 1000; // 15 seconds

const cleanupTempFiles = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    return;
  }

  const files = fs.readdirSync(TEMP_DIR);

  for (const file of files) {
    const filePath = path.join(TEMP_DIR, file);

    try {
      const stats = fs.statSync(filePath);

      if (!stats.isFile()) {
        continue;
      }

      const fileAge = Date.now() - stats.mtimeMs;

      if (fileAge >= FILE_EXPIRY) {
        fs.unlinkSync(filePath);

        console.log(`Deleted temp file: ${file}`);
      }
    } catch (error) {
      console.error(
        `Failed to cleanup ${file}:`,
        error.message
      );
    }
  }
};

const startTempCleanup = () => {
  console.log("Temp cleanup service started");

  // Check every 5 seconds
  setInterval(cleanupTempFiles, 5000);
};

export {
  cleanupTempFiles,
  startTempCleanup,
};