import { NextApiRequest, NextApiResponse } from "next";
import percentile from "percentile";
import { prisma } from "../../../lib/prisma";
import { JobStats } from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JobStats>
) {
  const { jobId } = req.query;
  const employees = await prisma.employee.findMany({
    where: { jobId: Number(jobId) },
  });

  const salaries = employees
    .map(({ salary }) => Math.round(salary / 100))
    .sort((a, b) => a - b);

  const [p25Salary, medianSalary, p75Salary] = percentile(
    [25, 50, 75],
    salaries
  ) as number[];

  const stats = {
    jobId: Number(jobId),
    sampleSize: employees.length,
    medianSalary,
    p25Salary,
    p75Salary,
  };

  res.json(stats);
}
