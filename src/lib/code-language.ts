export function getCodeLanguage(filePath: string): string {
  const file = filePath.toLowerCase();

  if (file.endsWith(".ts") || file.endsWith(".tsx")) return "typescript";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".css")) return "css";
  if (file.endsWith(".scss")) return "scss";
  if (file.endsWith(".html")) return "html";
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".yml") || file.endsWith(".yaml")) return "yaml";
  if (file.endsWith(".sql")) return "sql";
  if (file.endsWith(".xml")) return "xml";
  if (file.endsWith(".sh")) return "bash";
  if (file.endsWith(".py")) return "python";
  if (file.endsWith(".go")) return "go";
  if (file.endsWith(".java")) return "java";
  if (file.endsWith(".kt")) return "kotlin";
  if (file.endsWith(".rs")) return "rust";
  if (file.endsWith(".php")) return "php";
  if (file.endsWith(".rb")) return "ruby";
  if (file.endsWith(".c")) return "c";
  if (file.endsWith(".cpp") || file.endsWith(".cc")) return "cpp";
  if (file.endsWith(".cs")) return "csharp";
  if (file.endsWith(".swift")) return "swift";
  if (file.endsWith(".prisma")) return "prisma";
  if (file.endsWith(".toml")) return "toml";
  if (file.endsWith(".dockerfile") || file.endsWith("dockerfile"))
    return "docker";

  return "text";
}
