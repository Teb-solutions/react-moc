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
import { Box, Modal } from "@mui/material";
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

function createData(staff, role, site, division, action) {
  return { staff, role, site, division, action };
}

export default function StickyHeadTable() {
  const columns = [
    {
      id: "staff",
      label: "Staff",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "role",
      label: "Role",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "site",
      label: "Site",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "division",
      label: "Division",
      minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "action",
      label: "Action",
      //minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
      render: (row) => (
        <div className="action_button">
          <Button
            onClick={() => handleEdit(row)}
            endIcon={
              <FuseSvgIcon size={20}>heroicons-solid:pencil</FuseSvgIcon>
            }
          ></Button>
          <Button
            // onClick={() => handleDelete(row)}
            endIcon={<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>}
          ></Button>
        </div>
      ),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [staffRole, setStaffRole] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const [lookupAdd, setLookUpAdd] = useState({
    staff: "activity",
    role: "",
    site: "INSERT",
    division: "",
    isActive: true,
  });

  const handleEdit = (row) => {
    setLookUpAdd({
      ...row,
      crudMode: "UPDATE",
      staff: row.staff,
      role: row.role,
      site: row.site,
      division: row.division,
      isActive: true,
    });
    // setId(row.id);
    handleOpen();
  };
  const handleClose = () => {
    setLookUpAdd({
      ...lookupAdd,
      LookupType: "activity",
      code: "",
      crudMode: "INSERT",
      description: "",
      isActive: true,
      name: "",
      parentId: 0,
    });

    setOpen(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = staffRole.filter(
    (row) =>
      row.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getRecords() {
    apiAuth.get(`/Staff/Roles/`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp.data.data.map((item, index) =>
        createData(
          item.staffName,
          item.roleName,
          item.siteName,
          item.divisionName,
          "Action"
        )
      );
      setStaffRole(transformedData);
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
    const updatedDepartmentList = [...staffRole];
    const updatedRow = updatedDepartmentList.find((item) => item.id === row.id);

    if (updatedRow) {
      updatedRow.isActive = event.target.checked;

      // Update the state immediately to reflect the change in the UI
      setStaffRole(updatedDepartmentList);

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
      <MocHeader master={"Master"} type={"Staff Approver Roles"} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <div className="flex justify-between text-white">
                <span className="text-popup font-medium">
                  {lookupAdd.crudMode === "INSERT" ? "Add" : "Edit"}
                </span>
                <span
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fit=""
                    height="24"
                    width="24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </div>
            </Box>
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                marginTop: "0",
                paddingBottom: "0",
              }}
            >
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1 },
                }}
                noValidate
                autoComplete="off"
                sty
              >
                <TextField
                  id="outlined-basic"
                  className="flex-grow-1 "
                  label="Staff *"
                  name="Staff"
                  inputProps={{
                    maxLength: 5, // Limit to 30 characters, which approximates 5 words
                  }}
                  value={lookupAdd.staff}
                  //   variant="outlined"
                  //   onChange={handleAdd}
                  //   error={!!errors.code}
                  //   helperText={errors.code}
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, marginTop: "30px" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  className="flex-grow-1 "
                  label="Role *"
                  name="role"
                  value={lookupAdd.role}
                  variant="outlined"
                  //   onChange={handleAdd}
                  //   error={!!errors.description}
                  //   helperText={errors.description}
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, marginTop: "30px" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  className="flex-grow-1 "
                  label="Site *"
                  name="site"
                  value={lookupAdd.site}
                  variant="outlined"
                  //   onChange={handleAdd}
                  //   error={!!errors.description}
                  //   helperText={errors.description}
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, marginTop: "30px" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  className="flex-grow-1 "
                  label="Division *"
                  name="division"
                  value={lookupAdd.division}
                  variant="outlined"
                  //   onChange={handleAdd}
                  //   error={!!errors.description}
                  //   helperText={errors.description}
                />
              </Box>
            </div>

            <div
              className="flex items-center space-x-12"
              style={{
                marginTop: "0",
                marginBottom: "0",
                justifyContent: "end",
                // backgroundColor: " rgba(248,250,252)",
                padding: "30px",
                paddingBottom: "30px",
              }}
            >
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="primary"
                style={{
                  padding: "15px",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid grey",
                  paddingLeft: "25px",
                  paddingRight: "25px",
                }}
                // onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{
                  padding: "15px",
                  backgroundColor: "#4f46e5",
                  paddingLeft: "25px",
                  paddingRight: "25px",
                }}
                type="submit"
                // onClick={handleSubmit}
              >
                {/* {lookupAdd.crudMode === "UPDATE" ? "Update" : "Add"} */}
                Add
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div>
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ fontSize: "xx-large", color: "black" }}
          >
            <b>Staff Approver Roles</b>
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
            <Button
              variant="contained"
              className="my-4"
              color="secondary"
              onClick={handleOpen}
            >
              <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
              <span className="mx-4 sm:mx-8">Add</span>
            </Button>
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
                                      handleChangeDense(event, row)
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
          count={staffRole.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
