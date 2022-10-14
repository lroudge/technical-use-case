import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { JobStats } from "../lib/types";

ChartJS.register(ChartDataLabels);

// This is needed in order to have a smooth tooltip positioned where the cursor is and following it
Tooltip.positioners.custom = function (elements, position) {
  return {
    x: position.x,
    y: position.y,
  };
};

export const JobStatsChart: React.FC = ({
  jobName,
  jobStats,
}: {
  jobName?: string;
  jobStats?: JobStats;
}) => {
  const labels = ["Salaries range from p25 to p75"];
  const data = {
    labels,
    datasets: [
      {
        label: jobName,
        borderColor: "rgb(255, 153, 185, 0.5)",
        backgroundColor: "rgb(255, 153, 185, 0.5)",
        barPercentage: 0.7,
        borderWidth: 2,
        borderRadius: 5,
        hidden: jobStats === undefined || jobName === undefined,
        borderSkipped: false,
        data: labels.map(() => [jobStats?.p25Salary, jobStats?.p75Salary]),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        labels: {
          p75: {
            color: "rgb(204, 102, 153)",
            anchor: "end",
            align: "top",
            font: {
              size: 18,
            },
            formatter: function (value) {
              return String.fromCodePoint(0x2191) + ` ${jobStats?.p75Salary} €`;
            },
          },
          median: {
            color: "rgb(191, 64, 128)",
            anchor: "center",
            font: {
              size: 22,
              weight: "bold",
            },
            formatter: function (value) {
              return `${jobStats?.medianSalary} €`;
            },
          },
          p25: {
            color: "rgb(204, 102, 153)",
            anchor: "start",
            align: "bottom",
            font: {
              size: 18,
            },
            formatter: function (value) {
              return String.fromCodePoint(0x2193) + ` ${jobStats?.p25Salary} €`;
            },
          },
        },
      },
      tooltip: {
        xAlign: "left",
        titleFont: { size: 20 },
        bodyFont: { size: 18 },
        bodySpacing: 6,
        bodyColor: "#f1f5f9",
        titleColor: "#f1f5f9",
        backgroundColor: "rgb(191, 64, 128)",
        position: "custom",
        padding: 10,
        displayColors: false,
        callbacks: {
          title: () => jobName,
          label: () => {
            return jobStats ? [
              `Sample size: ${jobStats.sampleSize} employees`,
              `P75 salary: ${jobStats.p75Salary} €`,
              `Median salary: ${jobStats.medianSalary} €`,
              `P25 salary: ${jobStats.p25Salary} €`,
            ] : [];
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 30000,
        max: 80000,
      },
    },
  };

  return (
    <div className="h-3/4 w-1/2">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};
