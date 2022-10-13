import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { Job } from "@prisma/client";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Job[]>
) {
  const jobs = await prisma.job.findMany();

  res.json(jobs);
}
