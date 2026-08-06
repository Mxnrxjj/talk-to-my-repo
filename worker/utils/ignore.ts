import path from "node:path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
  ".turbo",
  ".cache",
  "out",
  "vendor",
]);

const IGNORED_EXTENSIONS = new Set([
  // Images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".svg",

  // Documents
  ".pdf",

  // Archives
  ".zip",
  ".tar",
  ".gz",

  // Binaries
  ".exe",
  ".dll",
  ".so",

  // Fonts
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",

  // Media
  ".mp3",
  ".mp4",
  ".wav",
  ".mov",

  // Diagrams
  ".excalidraw",

  // Lock files
  ".lock",

  // Database files
  ".sqlite",
  ".db",
]);

export function shouldIgnoreDirectory(name: string): boolean {
  return IGNORED_DIRECTORIES.has(name);
}

export function shouldIgnoreFile(name: string): boolean {
  const lowerName = name.toLowerCase();

  if (
    lowerName.startsWith("test-") ||
    lowerName.endsWith(".test.ts") ||
    lowerName.endsWith(".spec.ts") ||
    lowerName.endsWith(".map")
  ) {
    return true;
  }

  const extension = path.extname(lowerName);

  return IGNORED_EXTENSIONS.has(extension);
}
