import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { Box, InputLabel, Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import ReactApexChart from "react-apexcharts";
import Papa from "papaparse";
import { ApexOptions } from "apexcharts";
import FuseLoading from "@fuse/core/FuseLoading";
import { useCallback, useMemo } from "react";
import { useEffect } from "react";
import { apiAuth, apiTicketAuth } from "src/utils/http";
import MocHeader from "../moc/MocHeader";
import dayjs from "dayjs";
// import { exportToCSV } from "src/utils/exportToCSV";
import _, { get, set } from "lodash";
import { useLocation, useNavigate } from "react-router";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { use } from "i18next";
import { CalculateRiskClassification } from "../moc/common_components/RiskAnalysisCalculate";
import RiskClassificationDisplay from "../riskRegister/common/RiskClassificationDisplay";
import {
  RiskAnalysisHazardSituationControlMeasureStatus,
  TaskStatusEnum,
} from "../riskRegister/helpers/enum";

// export const exportToCSV = (data, fields, filename) => {
//   // Ensure fields is an array
//   if (!Array.isArray(fields)) {
//     console.error('The "fields" parameter must be an array. Received:', fields);
//     return;
//   }

//   const selectedData = data.map((item) => {
//     const newItem = {};
//     fields.forEach((field) => {
//       let value = item[field];

//       // First check if it's a number
//       if (typeof value === "number") {
//         value = `"${value}"`; // Wrap the number in double quotes to force it as a string in CSV
//       }
//       // Only check for date if the value is a string
//       else if (typeof value === "string" && value) {
//         // More strict date checking
//         const dateCheck = dayjs(value, "YYYY-MM-DDTHH:mm:ssZ", true);
//         if (dateCheck.isValid() && value.includes('T')) {  // Added T check to ensure it's actually a datetime
//           value = dateCheck.format("DD-MM-YYYY HH:mm");
//         }
//       }

//       // Assign the formatted value to the new object
//       newItem[field] = value;
//     });
//     return newItem;
//   });

//   const csv = Papa.unparse(selectedData);
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

//   // Trigger download
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `${filename}.csv`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

export const exportToCSV = (data, fields, filename) => {
  // Ensure fields is an array
  if (!Array.isArray(fields)) {
    console.error('The "fields" parameter must be an array. Received:', fields);
    return;
  }

  const selectedData = data.map((item) => {
    const newItem = {};
    fields.forEach((field) => {
      let value = item[field];

      // Only check for date if the value is a string
      if (typeof value === "string" && value) {
        // More strict date checking
        const dateCheck = dayjs(value, "YYYY-MM-DDTHH:mm:ssZ", true);
        if (dateCheck.isValid() && value.includes("T")) {
          // Added T check to ensure it's actually a datetime
          value = dateCheck.format("DD-MM-YYYY HH:mm");
        }
      }
      // Keep numbers as they are
      // No special handling needed for numbers as Papa.unparse will handle them correctly

      // Assign the value to the new object
      newItem[field] = value;
    });
    return newItem;
  });

  const csv = Papa.unparse(selectedData, {
    quotes: false, // This will prevent automatic quoting
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Trigger download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface ITasksReport {
  riskRegisterId: number;
  taskId: number;
  taskName: string;
  subTaskName: string;
  hazardType: number;
  hazardousSituation: string;
  residualRisk: number;
  residualRiskClassification: number;
  status: number;
  updatedAt: string;
  updatedBy: number;
  hiraNumber: string;
  siteId: number;
  divisionId: number;
  siteName: string;
  divisionName: string;
}

/**
 * The ProjectDashboardApp page.
 */
function TasksReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ITasksReport[]>([]);
  const [siteWiseRiskCounts, setSiteWiseRiskCounts] = useState([]);
  // const useParamsId = useParams().id;
  const location = useLocation();
  const pathname = location.pathname;
  const paginationModel = { page: 0, pageSize: 10 };
  const navigate = useNavigate();
  const fetchdataSetting = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) {
        navigate("/sign-in");
        return;
      }
      apiAuth.get(`/RiskRegister/task/list/approved`).then(async (resp) => {
        setData(resp?.data?.data);
        console.log(resp?.data?.data);
        // setFilteredData(resp?.data?.data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchdataSetting();
  }, []);

  useEffect(() => {
    const test = getSiteWiseRiskCount(data);
    console.log(test);
    setSiteWiseRiskCounts(test);
  }, [data]);

  const getSiteWiseRiskCount = (data) => {
    // First group by siteName
    const siteWiseData = data.reduce((acc, item) => {
      const siteName = item.siteName;

      if (!acc[siteName]) {
        // Initialize site data with risk classifications count
        acc[siteName] = {
          siteName: siteName,
          verylow: 0,
          low: 0,
          average: 0,
          significant: 0,
          high:0,
          total: 0,
        };
      }

      // Increment counts based on residualRiskClassification
      switch (item.residualRiskClassification) {
        case 1: // Assuming 1 is very low
          acc[siteName].verylow += 1;
          break;
        case 2: // Assuming 2 is low
          acc[siteName].low += 1;
          break;
        case 3: // Assuming 3 is avg
          acc[siteName].average += 1;
          break;
        case 4: // Assuming 4 is significant
          acc[siteName].significant += 1;
          break;
        case 5: // Assuming 5 is high
          acc[siteName].high += 1;
          break;
        default:
          break;
      }

      // Increment total count for the site
      acc[siteName].total += 1;

      return acc;
    }, {});

    // Convert the object to array format for DataGrid
    return Object.values(siteWiseData);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "taskId",
        headerName: "Task ID",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Link to={`/risk/riskevaluation/${params.row.riskRegisterId}`}>
            {params.row.taskId}
          </Link>
        ),
      },
      {
        field: "divisionName",
        headerName: "Division",
        width: 150,
      },
      {
        field: "siteName",
        headerName: "Site",
        width: 150,
      },
      { field: "taskName", headerName: "Task ", width: 500 },
      {
        field: "subTaskName",
        headerName: "Sub Task",
        width: 500,
      },
      {
        field: "hazardousSituation",
        headerName: "Hazardous Situation",
        width: 500,
      },
      {
        field: "residualRisk",
        headerName: "Residual Risk",
        width: 150,
      },

      {
        field: "hiraNumber",
        headerName: "HIRA Number",
        width: 150,
      },
      {
        field: "residualRiskClassification",
        headerName: "Risk",
        renderCell: (params: GridRenderCellParams) => {
          const { classification, classificationValue } =
            CalculateRiskClassification(params.row.residualRisk);
          return (
            <div className="flex flex-col">
              <p className="ml-5">
                <RiskClassificationDisplay
                  residualRiskClassification={classificationValue}
                  residualRiskClassificationDisplay={classification}
                />
              </p>
            </div>
          );
        },
        width: 200,
      },

      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <div className="flex flex-col">
              <p className="ml-5">{TaskStatusEnum[params.row.status]}</p>
              {}
            </div>
          );
          // return params.row.status === 0 ? "Pending" : params.row.status === 1 ? "Approved" : params.row.status === 2 ? "Rejected" : "";
        },
      },
    ],
    []
  );
  const handleExportToCSV = () => {
    const fields = [
      "taskId",
      "divisionName",
      "siteName",
      "taskName",
      "subTaskName",
      "hazardousSituation",
      "residualRisk",
      "hiraNumber",
      "residualRiskClassification",
      "status",
    ];
    exportToCSV(data, fields, "TasksReport");
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  // DataGrid columns configuration
  const columnsNew = [
    { field: "siteName", headerName: "Site Name", flex: 1 },
    { field: "verylow", headerName: "Very Low Risk", width: 130 },
    { field: "low", headerName: "Low Risk", width: 130 },
    { field: "average", headerName: "Average Risk", width: 130 },
    { field: "significant", headerName: "Significant Risk", width: 130 },
    { field: "high", headerName: "High Risk", width: 130 },
    { field: "total", headerName: "Total Tasks", width: 130 },
  ];

  return (
    <div className="flex flex-col w-full h-full white_bg">
      <div className="">
        <MocHeader nothing={"nothing"} type={"Report"} />
        <div style={{ margin: "20px" }}>
          <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
            <InputLabel id="category-select-label" className="text-4xl">
              <b>Approved Tasks List</b>
            </InputLabel>
          </div>

          <b className="text-lg">Total Count: {data.length || 0}</b>
          <Box className=" flex flex-row gap-20 justify-end mt-10">
            <Button
              variant="outlined"
              className="mt-5"
              onClick={() => handleExportToCSV()}
            >
              Export all tasks to CSV
            </Button>
          </Box>
          <Paper
            className="box_reset mt-24"
            sx={{ width: "100%", overflow: "hidden", backgroundColor: "none" }}
          >
            <InputLabel id="category-select-label" className="text-2xl">
              <b>Sitewise Tasks Count</b>
            </InputLabel>
            <DataGrid
              rows={siteWiseRiskCounts}
              columns={columnsNew}
              getRowId={(row) => row.siteName}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel } }}
              style={{
                minWidth: "60%", // Ensure grid takes full width
                height: "100%",
              }}
              sx={{
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #ccc",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#dbeafe",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
              }}
            />
            <Typography variant="h6" className="mb-16">
          Site-wise Task/Risk Distribution
        </Typography>
        <SiteWiseRiskChart data={siteWiseRiskCounts} />
            <br />
            <br />
            <InputLabel id="category-select-label" className="text-2xl">
              <b>All Tasks </b>
            </InputLabel>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.taskId}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[10, 25, 50]}
              style={{
                minWidth: "100%", // Ensure grid takes full width
                height: "100%",
              }}
              sx={{
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #ccc",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#dbeafe",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default TasksReport;


function SiteWiseRiskChart({ data }) {
  // Process data for the chart
  const processChartData = (data) => {
    const sites = data.map(item => item.siteName);
    
    // Create series data for each risk level
    const lowRisk = data.map(item => item.low);
    const verylowRisk = data.map(item => item.verylow);
    const avergaeRisk = data.map(item => item.average);
    const highRisk = data.map(item => item.high);
    const significantRisk = data.map(item => item.significant);

    return {
      sites,
      series: [
        {
          name: 'Very Low Risk',
          data: verylowRisk,
          color: '#00E396' // Green
        },
        {
          name: 'Low Risk',
          data: lowRisk,
          color: '#FFEB3B' // Yellow
        },
        {
          name: 'Average Risk',
          data: avergaeRisk,
          color: '#FFD740' // Amber/Orange
        },
        {
          name: 'Significant Risk',
          data: significantRisk,
          color: '#FFA000' // Red-Orange
        },
        {
          name: 'High Risk',
          data: highRisk,
          color: '#DC2626' // Deep Red
        }
      ]
    };
  };

  const chartData = processChartData(data);

  const options: ApexOptions = {
    chart: {
      type: 'bar' as const, // Type assertion here
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      type: 'category',
      categories: chartData.sites,
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Tasks'
      },
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    },
    dataLabels: {
      enabled: true,
      // formatter: function (val) {
      //   return val || ''; // Don't show 0 values
      // },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tasks"
        }
      }
    }
  };

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
}
