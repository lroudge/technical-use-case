import { faker } from "@faker-js/faker";
import { prisma } from "../lib/prisma";

const JOBS = [
  "Back-end Developer",
  "Front-end Developer",
  "Full-stack Developer",
  "DevOps",
];

Array.from({ length: 100 }).forEach(() => {
  JOBS.push(faker.name.jobTitle());
});

async function main() {
  console.info("Creating jobs...");
  const jobs = await Promise.all(
    JOBS.map((name) => {
      return prisma.job.create({
        data: {
          name,
        },
      });
    })
  );

  console.info("Creating employees...");
  await Promise.all(
    jobs.map((job) => {
      const employeesCount = Math.round(2000 + Math.random() * 10000);

      return prisma.employee.createMany({
        data: new Array(employeesCount).fill(0).map(() => {
          return {
            jobId: job.id,
            salary: Math.round(30000_00 + Math.random() * 50000_00),
          };
        }),
      });
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
