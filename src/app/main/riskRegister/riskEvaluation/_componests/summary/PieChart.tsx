import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useTaskStore } from "../common/taskStore";
import { RiskClassification } from "../../../helpers/enum";
function PieChart() {
  const { tasks } = useTaskStore();
  const options = {
    chart: {
      width: 380,
      type: "pie" as const,
    },
    labels: [
      "High Risk",
      "Significant Risk",
      "Average Risk",
      "Low Risk",
      "Very Low Risk",
    ],
    colors: [
      "#EF4444", // High Risk (text-red-500)
      "#F97316", // Significant Risk (text-orange-500)
      "#F59E0B", // Average Risk (text-amber-500)
      "#FDE047", // Low Risk (text-yellow-500)
      "#10B981", // Very Low Risk (text-green-500)
    ],
    legend: {
      position: "bottom" as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = useMemo(
    () => [
      tasks.filter(
        (task) =>
          Number(task.residualRiskClassification) ===
          RiskClassification.HighRisk
      ).length,

      tasks.filter(
        (task) =>
          Number(task.residualRiskClassification) ===
          RiskClassification.SignificantRisk
      ).length,
      tasks.filter(
        (task) =>
          Number(task.residualRiskClassification) ===
          RiskClassification.AverageRisk
      ).length,

      tasks.filter(
        (task) =>
          Number(task.residualRiskClassification) === RiskClassification.LowRisk
      ).length,
      tasks.filter(
        (task) =>
          Number(task.residualRiskClassification) ===
          RiskClassification.VeryLowRisk
      ).length,
    ],
    [tasks]
  );
  return (
    <div className="line">
      <Chart options={options} series={series} type="pie" width="350" />
    </div>
  );
}
export default PieChart;
