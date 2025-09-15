import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync("prisma/makeModels.json", "utf-8"));
  console.log("Data loaded:", data);

  for (const make of data) {
    const createdMake = await prisma.make.upsert({
      where: { name: make.name },
      update: { popular: make.popular },
      create: {
        name: make.name,
        popular: make.popular,
      },
    });

    for (const model of make.models) {
      await prisma.model.upsert({
        where: {
          name_makeId: {
            name: model.name,
            makeId: createdMake.id,
          },
        },
        update: { popular: model.popular },
        create: {
          name: model.name,
          popular: model.popular,
          makeId: createdMake.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    console.log("✅ Database seeded with makes and models");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
