import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "sentinel-urban-ai-main");
const viteBin = path.join(appDir, "node_modules", "vite", "bin", "vite.js");

console.log("Starting UrbanSenseAI development server...");
const child = spawn(process.execPath, [viteBin, "dev", "--port", "8080", "--host", "127.0.0.1"], {
  cwd: appDir,
  stdio: "inherit",
});

child.on("error", (err) => {
  console.error("Failed to start server:", err);
});
