import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { Box, InputLabel, Button } from "@mui/material";
import Paper from "@mui/material/Paper";

import Papa from 'papaparse';

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
import { CalculateRiskClassification } from "../moc/common_components/RiskAnalysisCalculate";
import RiskClassificationDisplay from "../riskRegister/common/RiskClassificationDisplay";
import { RiskAnalysisHazardSituationControlMeasureStatus, TaskStatusEnum } from "../riskRegister/helpers/enum";

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
        if (dateCheck.isValid() && value.includes('T')) {  // Added T check to ensure it's actually a datetime
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
    newline: "\r\n"
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
  riskRegisterId: number
  taskId: number
  taskName: string
  subTaskName: string
  hazardType: number
  hazardousSituation: string
  residualRisk: number
  residualRiskClassification: number
  status: number
  updatedAt: string
  updatedBy: number
  hiraNumber: string
  siteId: number
  divisionId: number
  siteName: string
  divisionName: string
}


/**
 * The ProjectDashboardApp page.
 */
function TasksReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ITasksReport[]>([]);
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
        .get(`/RiskRegister/task/list/approved`)
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
            CalculateRiskClassification(params.row.residualRiskClassification);
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
              <p className="ml-5">
                {
                  TaskStatusEnum[
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
