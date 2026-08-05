import { db } from "@/lib/db";

type TreeNode = {
  [key: string]: TreeNode;
};

const IGNORED = [
  "node_modules",
  ".next",
  ".git",
  "package-lock.json",
  "migration.sql",
  "migration_lock.toml",
];

export class FileTreeService {
  static async get(repositoryId: string): Promise<string> {
    const files = await db.repositoryChunk.findMany({
      where: {
        repositoryId,
      },
      distinct: ["filePath"],
      select: {
        filePath: true,
      },
    });

    const root: TreeNode = {};

    for (const { filePath } of files) {
      const normalized = filePath.replaceAll("\\", "/");

      if (IGNORED.some((item) => normalized.includes(item))) {
        continue;
      }

      const parts = normalized.split("/");

      let current = root;

      for (const part of parts) {
        current[part] ??= {};
        current = current[part];
      }
    }

    const render = (
      node: TreeNode,
      prefix = "",
      rootLevel = false,
    ): string[] => {
      const entries = Object.entries(node).sort(([a, av], [b, bv]) => {
        const aDir = Object.keys(av).length > 0;
        const bDir = Object.keys(bv).length > 0;

        if (aDir !== bDir) {
          return aDir ? -1 : 1;
        }

        return a.localeCompare(b);
      });

      const lines: string[] = [];

      entries.forEach(([name, children], index) => {
        const last = index === entries.length - 1;

        if (rootLevel) {
          lines.push(name);
        } else {
          lines.push(`${prefix}${last ? "└── " : "├── "}${name}`);
        }

        if (Object.keys(children).length > 0) {
          lines.push(
            ...render(
              children,
              rootLevel ? "" : prefix + (last ? "    " : "│   "),
              false,
            ),
          );
        }

        if (rootLevel && index !== entries.length - 1) {
          lines.push("");
        }
      });

      return lines;
    };

    return render(root, "", true).join("\n");
  }
}
