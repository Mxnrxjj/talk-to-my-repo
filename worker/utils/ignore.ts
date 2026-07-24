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
]);

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".svg",

  ".pdf",
  ".zip",
  ".tar",
  ".gz",

  ".exe",
  ".dll",
  ".so",

  ".woff",
  ".woff2",
  ".ttf",
  ".eot",

  ".mp3",
  ".mp4",
  ".wav",
  ".mov",
]);

export function shouldIgnoreDirectory(name: string): boolean {
  return IGNORED_DIRECTORIES.has(name);
}

export function shouldIgnoreFile(name: string): boolean {
  const extension = path.extname(name).toLowerCase();

  return IGNORED_EXTENSIONS.has(extension);
}
