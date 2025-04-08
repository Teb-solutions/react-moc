import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTaskStore } from "../common/taskStore";
import { RiskClassification } from "../../../helpers/enum";
import { ApexOptions } from "apexcharts";

function AreaChart({ width }: { width?: string }) {
  const { tasks } = useTaskStore();
  
  const threshold = 400;

  // Sort tasks by taskId
  const sortedTasks = [...tasks].sort((a, b) => a.taskId - b.taskId);
  
  // Create arrays with null values for all positions
  const highRiskValues = new Array(sortedTasks.length).fill(null);
  const lowRiskValues = new Array(sortedTasks.length).fill(null);

  // Fill in values at their correct positions
  sortedTasks.forEach((task, index) => {
    if (task.residualRisk > threshold) {
      highRiskValues[index] = task.residualRisk;
    } else {
      lowRiskValues[index] = task.residualRisk;
    }
  });

  // Create area data
  const areaData = sortedTasks.map(() => threshold);
  const taskIds = sortedTasks.map(task => task.taskId);

  // Calculate max y-axis value with 10% padding
  const maxRiskValue = Math.max(...sortedTasks.map(task => task.residualRisk));
  const yAxisMax = Math.ceil(maxRiskValue * 1.1)>500? Math.ceil(maxRiskValue * 1.1) : 500;

  const options: ApexOptions = {
    chart: {
      height: 350,
      animations: {
        enabled: false
      },
      zoom: {
        enabled: false
      },
      type: 'line'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: [0, 0, 2],
    },
    colors: [
      '#FF4560', // High Risk - Red
      '#00E396', // Low Risk - Green
      '#008FFB'  // Threshold - Blue
    ],
    fill: {
      type: ['solid', 'solid', 'gradient'],
      opacity: [1, 1, 0.3]
    },
    markers: {
      size: [6, 6, 0],
      colors: ['#FF4560', '#00E396', '#008FFB'],
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        if (seriesIndex === 2) { // Threshold series
          return `
            <div class="apexcharts-tooltip-box" style="padding: 5px;">
              <span>Threshold: ${threshold}</span>
            </div>
          `;
        } else {
          const value = w.globals.series[seriesIndex][dataPointIndex];
          const taskId = taskIds[dataPointIndex];
          if (value === null || value === undefined) return '';
          
          return `
            <div class="apexcharts-tooltip-box" style="padding: 5px;">
              <span>Task ID: ${taskId}</span><br/>
              <span>Risk Value: ${value}</span>
            </div>
          `;
        }
      }
    },
    legend: {
      show: true,
      position: 'top' as 'top',
    },
    xaxis: {
      type: 'category',
      categories: taskIds,
      labels: {
        show: true,
        rotate: 0,
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        },
      },
      title: {
        text: 'Task ID'
      },
      tickPlacement: 'on'
    },
    yaxis: {
      min: 0,
      max: yAxisMax,
      tickAmount: 8,
      title: {
        text: 'Residual Risk Value'
      },
      labels: {
        formatter: (value: number) => Math.round(value).toString()
      }
    },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      strokeDashArray: 0,
      position: 'back' as 'back' | 'front',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    }
  };

  const series = [
    {
      name: "Critical Tasks",
      type: 'scatter',
      data: highRiskValues
    },
    {
      name: "Non Critical Tasks",
      type: 'scatter',
      data: lowRiskValues
    },
    {
      name: "Threshold",
      type: 'area',
      data: areaData
    }
  ];

  return (
    <div className="pr-5">
      {tasks.length > 0 && (
        <ReactApexChart
          options={options}
          series={series}
          height={350}
          width={width ? width : "100%"}
          type="line"
        />
      )}
    </div>
  );
}

export default AreaChart;
