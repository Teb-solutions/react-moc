import { useParams } from "react-router";
import { useGetPermenant } from "src/utils/swr";
import { IListControlMeasures } from "../../../helpers/type";
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

export const ControlMeasuresList = () => {
  const riskId = useParams<{ riskId: string }>();
  const { data, isLoading, mutate } = useGetPermenant<{
    data: IListControlMeasures[];
    message: string;
    statusCode: number;
  }>(`/RiskRegister/controlmeasures/${riskId.riskId}`);

  const handleStatusChange = (id: number, status: boolean) => {
    // console.log('status', status);
    if (status) {
      apiAuth
        .post(`/RiskRegister/controlmeasure/mark/${riskId.riskId}`, {
          controlMeasures: [id],
        })
        .then((res) => {
          // console.log(res);
          if (res.data.statusCode === 200) {
            toast.success("Marked control measure as implemented");
            mutate();
          } else {
            toast.error(res.data.message || "An error occured");
          }
          // Handle the response here
        })
        .catch((error) => {
          // console.error(error);
          toast.error("An error occured");
          // Handle the error here
        });
    }
   
  };
  const columns: GridColDef[] = useMemo(() => [
    // {
    //   field: 'index',
    //   headerName: 'Index',
    //   width: 70,
    //   renderCell: (params) => Number(params.api.getRowIndexRelativeToVisibleRows(params.row)) + 1
    // },
    { field: "controlMeasure", headerName: "Control Measure", width: 700 },
    {
      field: "residualRiskClassification",
      headerName: "Risk",
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${riskClassificationDisplay(params.row.residualRiskClassification) || ""}`,
    },
    // { field: 'taskId', headerName: 'Task ID', width: 100 },
    
    {
      field: "updatedByStaffName",
      headerName: "Created By",
      width: 300,
      renderCell: (params: GridRenderCellParams) =>
        <div className="flex flex-col">
          <p className="ml-5">{params.row.updatedByStaffName}</p>
          <p className="ml-5 text-xs">{params.row.updatedAt&&dayjs(params.row.updatedAt).format("MMM DD, YYYY HH:mm")}</p>
          </div>,
    },

    {
      field: "status",
      headerName: "Verified",
      width: 230,
      renderCell: (params: GridRenderCellParams) =>
        params.row.status === 1 ? (
          <div className="flex flex-row">
          <div><Icon className="ml-5 text-green-500 mt-5">check</Icon>
          </div>
          <div className="flex flex-col">
          <p className="ml-5">{params.row.implementedByStaffName}</p>
          <p className="ml-5 text-xs">{params.row.implementedAt&&dayjs(params.row.implementedAt).format("MMM DD, YYYY HH:mm")}</p>
          </div>
          </div>
        ) : params.row.canMarkImplemented ? (
          <Checkbox
            onChange={(event) =>
              handleStatusChange(params.row.id, event.target.checked)
            }
          />
        ) : (
          <Icon className="ml-5 text-red-500">close</Icon>
        ),
    },

    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ], [data]);

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="w-full">
      <p className="px-24 pt-10 text-gray-500 font-semibold">
        Approved tasks control measures and their status are listed here.
      </p>
      <Paper
        className="box_reset px-24 py-10 bg-white"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        {isLoading && <p>Loading...</p>}
        {!isLoading && !data && (
          <p className="py-24"> - No control measures found</p>
        )}
        {!isLoading && data && data?.data.length === 0 && (
          <p className="my-24"> - No control measures found</p>
        )}
        {data && !isLoading && data?.data.length > 0 && (
          <DataGrid
            rows={data?.data}
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
