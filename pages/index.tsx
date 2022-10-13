import axios from "axios";
import useSWR from "swr";
import { Decimal } from "decimal.js";
import { useEffect, useState, useCallback } from "react";
import { prisma } from "../lib/prisma";
import { JobStats } from "../lib/types";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Home: React.FC = () => {
  const [jobStats, setJobStats] = useState<JobStats | undefined>();

  const { data: jobs, error } = useSWR("/api/jobs", fetcher);

  const fetchJobStats = useCallback(
    async (jobName: string) => {
      const job = jobs?.length
        ? jobs.find(({ name }) => name === jobName)
        : undefined;

      if (job) {
        const { data, error } = await axios.get(`/api/jobs/${job.id}`);

        if (error) {
          alert(
            `There was an error when trying to fetch job stats for job "${job.id}": ${error}.`
          );
        }

        if (data) {
          setJobStats(data);
        }
      }
    },
    [jobs]
  );

  if (error)
    return (
      <div>
        Failed to load page: <p>{error}</p>
      </div>
    );

  if (!jobs) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col justify-evenly items-center text-4xl">
      <h1>Job Market Data Browser</h1>
      <div className="w-full h-3/4 flex flex-col justify-evenly items-center text-2xl">
        <div className="w-full h-1/4 flex flex-col justify-center items-center">
          <label htmlFor="job-name-choice">Choose a job:</label>
          <input
            list="job-names"
            id="job-name-choice"
            name="job-name-choice"
            onChange={(e) => {
              fetchJobStats(e.target.value);
            }}
          ></input>

          <datalist id="job-names">
            {jobs.map(({ name, id }) => {
              return <option value={name} key={id}></option>;
            })}
          </datalist>
        </div>
        <div className="text-xl">{JSON.stringify(jobStats)}</div>
      </div>
    </div>
  );
};

export default Home;
