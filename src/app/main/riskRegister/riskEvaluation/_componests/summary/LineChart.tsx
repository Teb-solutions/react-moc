import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useTaskStore } from "../common/taskStore";
import { RiskClassification } from "../../../helpers/enum";
import { color } from "framer-motion";
function LineChart({ width }: { width?: string }) {
  const { tasks } = useTaskStore();
  const labelArray = tasks.map((task) => "TASK" + task.taskId);
  const valueArray = tasks.map((task) => task.residualRiskClassification);
  const options = {
    stroke: {
      curve: "smooth" as const,
      width: 2,
      color: "#EF4444",
    },

    markers: {
      size: 0,
    },
    xaxis: {
      categories: labelArray,
    },
  };

  const series = [
    {
      data: valueArray,
    },
  ];
  return (
    <div className="pr-5">
      {valueArray && labelArray && (
        <Chart
          options={options}
          series={series}
          type="line"
          width={width ? width : "100%"}
          height="250"
        />
      )}
    </div>
  );
}
export default LineChart;
