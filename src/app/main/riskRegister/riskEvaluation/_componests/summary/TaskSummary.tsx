import { useParams } from "react-router";
import { useGetPermenant } from "src/utils/swr";
import { IListControlMeasures, ITaskSummaryList } from "../../../helpers/type";
import {
  Checkbox,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { riskClassificationDisplay } from "src/app/main/moc/common_components/RiskAnalysisCalculate";
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useMemo } from "react";

export const TaskSummary = () => {
  const riskId = useParams<{ riskId: string }>();
  const { data, isLoading } = useGetPermenant<{
    data: {list : ITaskSummaryList[]};
    message: string;
    statusCode: number;
  }>(`/RiskRegister/task/summary/${riskId.riskId}`);

  
  const columns: GridColDef[] = useMemo(() => [
   
   
    {
      field: "residualRiskClassification",
      headerName: "Risk",
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${riskClassificationDisplay(params.row.residualRiskClassification) || ""}`,
    },
    { field: 'totalTasks', headerName: 'Total', width: 100 },
    { field: 'draftTasks', headerName: 'Draft', width: 100 },
    { field: 'approvedTasks', headerName: 'Approved', width: 100 },
    { field: 'pendingApprovalTasks', headerName: 'Pending Approval', width: 100 },
    { field: 'rejectedPendingReviewTasks', headerName: 'Rejected', width: 100 },
    { field: 'approverName', headerName: 'Approver', width: 100 },
   
  ], [data]);

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="w-full">
      <p className="px-24 pt-10 text-gray-500 font-semibold">
        Task summary and their status is displayed here.
      </p>
      <Paper
        className="box_reset px-24 py-10 bg-white"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        {isLoading && <p>Loading...</p>}
        {!isLoading && data.statusCode!=200 && (
          <p className="py-24"> - Error fetching data</p>
        )}
        {!isLoading && !data && (
          <p className="py-24"> - No control measures found</p>
        )}
        {!isLoading && data && data?.data?.list?.length === 0 && (
          <p className="my-24"> - No control measures found</p>
        )}
        {data && !isLoading && data?.data?.list?.length > 0 && (
          <DataGrid
            rows={data?.data?.list}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 25, 50]}
            sx={{
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid #ccc", // Add row separators
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5", // Change the background color of the table header row
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none", // Remove the default cell border
              },
            }}
          />
        )}
      </Paper>
    </div>
  );
};
