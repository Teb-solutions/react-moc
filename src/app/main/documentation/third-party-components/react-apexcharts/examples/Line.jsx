import { useState } from "react";
import Chart from "react-apexcharts";
function Line() {
  const [state] = useState({
    options: {
      stroke: {
        curve: "smooth", // Add as const to enforce type as 'smooth'
        width: 2,
      },

      markers: {
        size: 0,
      },
      xaxis: {
        categories: [
          "CMS0091",
          "CMS0092",
          "CMS0094",
          "CMS0095",
          "CMS0098",
          "CMS089",
          "CMS0090",
          "CMS0097",
          "CMS0090",
          "CMS0097",
          "CMS0090",
          "CMS0097",
          "CMS0090",
          "CMS0097",
        ],
      },
    },
    series: [
      {
        data: [30, 40, 25, 50, 49, 21, 70, 51, 23, 74, 24, 50, 30, 40],
      },
    ],
  });
  return (
    <div className="line">
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        width="500"
        height="250"
      />
    </div>
  );
}
export default Line;
