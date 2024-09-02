import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  Button,
  InputAdornment,
  InputLabel,
  TextField,
  FormControlLabel,
  Switch,
  TablePagination,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import Loader from "src/app/main/loader/Loader";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import MocHeader from "../../moc/MocHeader";

function createData(index, location, activity, riskevaluation) {
  return { index, location, activity, riskevaluation };
}

export default function StickyHeadTable() {
  const columns = [
    { id: "index", label: "#", minWidth: 50 },

    {
      id: "location",
      label: "Location",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "activity",
      label: "Activity",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "riskevaluation",
      label: "Risk Evaluation",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [riskMatrixList, setRiskMatrixList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = riskMatrixList.filter(
    (row) =>
      row.index.toString().includes(searchQuery) ||
      row.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.riskevaluation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getRecords() {
    apiAuth.get(`/RiskMatrix/List`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp.data.data.map((item, index) =>
        createData(
          index + 1,
          item.locationName,
          item.activityName,
          item.riskEvaluationName
        )
      );
      setRiskMatrixList(transformedData);
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleChangeDense = (event, row) => {

    const updatedDepartmentList = [...riskMatrixList];
    const updatedRow = updatedDepartmentList.find(item => item.id === row.id);

    if (updatedRow) {
      updatedRow.isActive = event.target.checked;

      // Update the state immediately to reflect the change in the UI
      setRiskMatrixList(updatedDepartmentList);

      // Call the update API
      apiAuth
        .put(`/LookupData/Update/${updatedRow.id}`, {
          ...updatedRow,
          isActive: updatedRow.isActive,
        })
        .then((resp) => {
          toast.success("Updated.");
          getRecords(); // Fetch the updated records
        })
        .catch((error) => {
          console.error("Failed to update the status:", error);
        });
    }
  };
  if (isLoading) {
    return <FuseLoading />;
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <MocHeader master={"Master"} type={"Risk Matrix"} />

      <div>
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ fontSize: "xx-large", color: "black" }}
          >
            <b>Risk Matrix</b>
          </InputLabel>
          <div className="flex items-center d-sm-block justify-between mt-0">
            <div className="flex-auto"></div>
            <TextField
              variant="filled"
              fullWidth
              className="my-4"
              placeholder="Search "
              style={{ marginRight: "15px", backgroundColor: "white" }}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ marginTop: "0px", paddingTop: "0px" }}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center w-full border-b justify-between"></div>
      <Paper className="box_reset" sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartmentList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ borderBottom: "1px solid #dddddd" }}
                          >
                            {column.id === "status" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    className="switch_check"
                                    checked={row.isActive} // Reflects the isActive property of the department
                                    onChange={(event) =>
                                      handleChangeDense(
                                        event,
                                        row
                                      )
                                    } // Passes the index of the department
                                  />
                                }
                              />
                            ) : column.render ? (
                              column.render(row) // Render custom actions
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={riskMatrixList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
