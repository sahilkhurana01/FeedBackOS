import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { clerkUserId: "user_demo_northstar" },
    update: {},
    create: {
      clerkUserId: "user_demo_northstar",
      email: "owner@northstar-cafe.demo",
      name: "Alex Morgan",
      role: "OWNER",
    },
  });

  const business = await prisma.business.create({
    data: {
      name: "Northstar Café",
      industry: "Hospitality & Dining",
      userId: user.id,
    },
  });

  console.log(`Seeded business: ${business.name} (${business.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
