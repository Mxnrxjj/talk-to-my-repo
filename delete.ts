import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.repository.delete({
    where: {
      id: "cmsgetw490000m4tc9gmr4mko",
    },
  });

  console.log("Deleted");
}

main().finally(async () => {
  await db.$disconnect();
});
