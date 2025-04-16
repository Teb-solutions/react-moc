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
import _, { set } from "lodash";
import { useLocation, useNavigate } from "react-router";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { use } from "i18next";
import {
  CalculateRiskClassification,
  riskClassificationDisplay,
} from "../moc/common_components/RiskAnalysisCalculate";
import RiskClassificationDisplay from "../riskRegister/common/RiskClassificationDisplay";
import { RiskAnalysisHazardSituationControlMeasureStatus } from "../riskRegister/helpers/enum";
import { propsToClassKey } from "@mui/styles";

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
interface IControlMeasureStatusCount {
  siteName: string;
  pending: number;
  implemented: number;
  notImplemented: number;
  total: number;
}

interface IControlMeasuresReport {
  id: number;
  type: number;
  controlMeasureId: any;
  controlMeasure: string;
  status: number;
  taskId: number;
  residualRiskClassification: number;
  taskStatus: number;
  lastApprovedByStaffId: any;
  statusUpdatedByStaffName: string;
  statusUpdatedAt: any;
  canMarkImplemented: boolean;
  updatedAt: string;
  updatedBy: number;
  updatedByStaffName: string;
  riskRegisterId: number;
  hiraNumber: string;
  siteId: number;
  divisionId: number;
  siteName: string;
  divisionName: string;
}

/**
 * The ProjectDashboardApp page.
 */
function ControlMeasuresReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IControlMeasuresReport[]>([]);
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
      apiAuth
        .get(`/RiskRegister/controlmeasures/approved`)
        .then(async (resp) => {
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

  const [sitewiseData, setSiteWiseData] = useState<
    IControlMeasureStatusCount[]
  >([]);
  useEffect(() => {
    if (data.length > 0) {
      const siteWiseStatus = getSiteWiseControlMeasuresStatus(data);
      setSiteWiseData(siteWiseStatus);
    }
  }, [data]);

  const getSiteWiseControlMeasuresStatus = (data: IControlMeasuresReport[]) => {
    // First group by siteName
    const siteWiseData = data.reduce(
      (acc: { [key: string]: IControlMeasureStatusCount }, item) => {
        const siteName = item.siteName;

        if (!acc[siteName]) {
          acc[siteName] = {
            siteName: siteName,
            pending: 0,
            implemented: 0,
            notImplemented: 0,
            total: 0,
          };
        }

        // Assuming status values:
        // 1 = Pending
        // 2 = Implemented
        // 3 = Not Implemented
        switch (item.status) {
          case RiskAnalysisHazardSituationControlMeasureStatus.Pending:
            acc[siteName].pending += 1;
            break;
          case RiskAnalysisHazardSituationControlMeasureStatus.Implemented:
            acc[siteName].implemented += 1;
            break;
          case RiskAnalysisHazardSituationControlMeasureStatus.NotImplemented:
            acc[siteName].notImplemented += 1;
            break;
          default:
            break;
        }

        acc[siteName].total += 1;
        return acc;
      },
      {}
    );

    return Object.values(siteWiseData);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "controlMeasureId",
        headerName: "Control Measure ID",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Link to={`/risk/riskevaluation/${params.row.riskRegisterId}`}>
            {params.row.controlMeasureId}
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
      { field: "controlMeasure", headerName: "Control Measure", width: 500 },

      {
        field: "hiraNumber",
        headerName: "HIRA Number",
        width: 150,
      },
      {
        field: "residualRiskClassification",
        headerName: "Risk",
        renderCell: (params: GridRenderCellParams) => {
          const riskClassificationDisplayName = riskClassificationDisplay(
            params.row.residualRiskClassification
          );
          return (
            <div className="flex flex-col">
              <p className="ml-5">
                <RiskClassificationDisplay
                  residualRiskClassification={
                    params.row.residualRiskClassification
                  }
                  residualRiskClassificationDisplay={
                    riskClassificationDisplayName
                  }
                />
                {/* {params.row.residualRisk} */}
              </p>
            </div>
          );
        },
        width: 200,
      },
      {
        field: "statusUpdatedByStaffName",
        headerName: "Status Updated By",
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <div className="flex flex-col">
            <p className="ml-5">{params.row.statusUpdatedByStaffName}</p>
            <p className="ml-5 text-xs">
              {(params.row.statusUpdatedAt &&
                dayjs(params.row.statusUpdatedAt).format(
                  "MMM DD, YYYY HH:mm"
                )) ||
                "NA"}
            </p>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <div className="flex flex-col">
              <p className="ml-5">
                {
                  RiskAnalysisHazardSituationControlMeasureStatus[
                    params.row.status
                  ]
                }
              </p>
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
      "controlMeasureId",
      "divisionName",
      "siteName",
      "controlMeasure",
      "hiraNumber",
      "residualRiskClassification",
      "statusUpdatedByStaffName",
      "statusUpdatedAt",
      "status",
    ];
    exportToCSV(data, fields, "ControlMeasuresReport");
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full white_bg">
      <div className="">
        <MocHeader nothing={"nothing"} type={"Report"} />
        <div style={{ margin: "20px" }}>
          <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
            <InputLabel id="category-select-label" className="text-4xl">
              <b>Approved Control Measures List</b>
            </InputLabel>
          </div>

          <b className="text-lg">Total Count: {data.length || 0}</b>
          <Box className=" flex flex-row gap-20 justify-end mt-10">
            <Button
              variant="outlined"
              className="mt-5"
              onClick={() => handleExportToCSV()}
            >
              Export all to CSV
            </Button>
          </Box>
          <Paper
            className="box_reset mt-24"
            sx={{ width: "100%", overflow: "hidden", backgroundColor: "none" }}
          >
            <Typography variant="h6" className="mb-16">
              Site-wise Control Measures Distribution
            </Typography>
            <DataGrid
              rows={sitewiseData}
              columns={[
                { field: "siteName", headerName: "Site Name", flex: 1 },
                { field: "pending", headerName: "Pending", width: 130 },
                { field: "implemented", headerName: "Implemented", width: 130 },
                {
                  field: "notImplemented",
                  headerName: "Not Implemented",
                  width: 150,
                },
                { field: "total", headerName: "Total", width: 130 },
              ]}
              getRowId={(row) => row.siteName}
              autoHeight
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
            <Typography variant="h6" className="mb-16">
                          Site-wise Control Measure Distribution Status
                        </Typography>
                        <SiteWiseRiskChart data={sitewiseData} />
            <Typography variant="h6" className="my-16">
              All Control Measures List
            </Typography>
            <DataGrid
              rows={data}
              columns={columns}
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

export default ControlMeasuresReport;


function SiteWiseRiskChart({ data }) {
  // Process data for the chart
  const processChartData = (data) => {
    const sites = data.map((item) => item.siteName);

    // Create series data for each risk level
    const pending = data.map((item) => item.pending);
    const implemented = data.map((item) => item.implemented);
    const notImplemented = data.map((item) => item.notImplemented);
    

    return {
      sites,
      series: [
        {
          name: "Implemented",
          data: implemented,
          color: "#00E396", // Green
        },
        {
          name: "Pending",
          data: pending,
          color: "#FFEB3B", // Yellow
        },
      
        {
          name: "Not Implemented",
          data: notImplemented,
          color: "#DC2626", // Deep Red
        },
      ],
    };
  };

  const chartData = processChartData(data);

  const options: ApexOptions = {
    chart: {
      type: "bar" as const, // Type assertion here
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.sites,
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Tasks",
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: true,
      // formatter: function (val) {
      //   return val || ''; // Don't show 0 values
      // },
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tasks";
        },
      },
    },
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