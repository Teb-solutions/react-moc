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
import { Box, MenuItem, Select } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  Button,
  InputAdornment,
  InputLabel,
  TextField,
  FormControlLabel,
  Switch,
  TablePagination,
  Modal,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import Loader from "src/app/main/loader/Loader";
import { FormControl } from "@mui/base";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import MocHeader from "../../moc/MocHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function createData(
  index,
  designation,
  name,
  description,
  status,
  action,
  isActive,
  id,
  lookupType,
  designationId
) {
  return {
    index,
    designation,
    name,
    description,
    status,
    action,
    isActive,
    id,
    lookupType,
    designationId,
  };
}

export default function StickyHeadTable() {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];
  const columns = [
    // { id: "index", label: "#", minWidth: 50 },
    { id: "index", label: "#" },
    {
      id: "designation",
      label: "Designation",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "name",
      label: "Name",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "description",
      label: "Description",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "status",
      label: "Status",
      // minWidth: 70,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "action",
      label: "Action",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
      render: (row) => (
        <div className="action_button">
          {feature.includes("MUPT") && (
            <Button
              onClick={() => handleEdit(row)}
              endIcon={
                <FuseSvgIcon size={20}>heroicons-solid:pencil</FuseSvgIcon>
              }
            ></Button>
          )}
          {feature.includes("MDEL") && (
            <Button
              onClick={() => handleDelete(row)}
              endIcon={
                <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
              }
            ></Button>
          )}
        </div>
      ),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [hazardList, SetHazardList] = useState([]);
  const [dense, setDense] = useState(false);
  const [deletes, setDelete] = useState(false);
  const [Id, setId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [particularList, setParticularList] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = hazardList.filter(
    (row) =>
      row.index.toString().includes(searchQuery) ||
      row.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [lookupAdd, setLookUpAdd] = useState({
    crudMode: "INSERT",
    description: "",
    isActive: true,
    name: "",
    designationId: 0,
  });
  const [open, setOpen] = useState(false);
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
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
  function getRecords() {
    apiAuth.get(`/DesignationTask/List/`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp.data.data.map((item, index) =>
        createData(
          index + 1,
          item.designationName,
          item.name,
          item.description,
          dense,
          "Action",
          item.isActive,
          item.id,
          item.lookupType,
          item.designationId
        )
      );
      SetHazardList(transformedData);
    });
  }

  useEffect(() => {
    getRecords();
  }, [dense]);

  const handleAdd = (event) => {
    const { name, value } = event.target;
    setLookUpAdd({
      ...lookupAdd,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setErrors({});
  };

  useEffect(() => {
    apiAuth.get(`/LookupData/Lov/5`).then((resp) => {
      setParticularList(resp.data.data);
    });
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setLookUpAdd({
      ...lookupAdd,
      crudMode: "INSERT",
      description: "",
      isActive: true,
      name: "",
      designationId: 0,
    });
    setOpen(false);
  };

  const handleOpenDelete = () => {
    setDelete(true);
  };

  const handleCloseDelete = () => setDelete(false);

  const handleSubmitDelete = () => {
    apiAuth.delete(`/LookupData/Delete/${Id}`).then((resp) => {
      if (resp.data.statusCode == "424") {
        toast.error(resp.data.message);
        setDelete(false);
      } else {
        setDelete(false);

        getRecords();
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const validate = () => {
    let tempErrors = {};
    if (!lookupAdd.parentId) tempErrors.parentId = "Designation is required";
    if (!lookupAdd.code) tempErrors.code = "Code is required";
    if (!lookupAdd.description)
      tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (lookupAdd.crudMode == "UPDATE") {
        apiAuth.put(`/LookupData/Update/${Id}`, lookupAdd).then((resp) => {
          setOpen(false);
          toast.success("Updated.");
          getRecords();
        });
      } else {
        apiAuth.post(`/LookupData/Create`, lookupAdd).then((resp) => {
          setOpen(false);
          toast.success("Created.");

          getRecords();
        });
      }
    }
  };

  const handleEdit = (row) => {
    let particularId = particularList?.find(
      (item) => item.text === row.designation
    )?.value;
    setLookUpAdd({
      ...row,
      crudMode: "UPDATE",
      id: row.id,
      lookupType: row.lookupType,
      designationId: particularId,
    });

    setId(row.id);
    handleOpen();
  };

  const handleDelete = (row) => {
    console.log(row, "roww");
    setId(row.id);
    handleOpenDelete();
  };

  const handleChangeDense = (event, index, row) => {
    console.log(row, "rowwwwwww");
    const updatedDepartmentList = [...hazardList];
    const updatedRow = updatedDepartmentList[index];
    updatedRow.isActive = event.target.checked;

    // Update the state immediately to reflect the change in the UI
    SetHazardList(updatedDepartmentList);

    // Call the update API
    apiAuth
      .put(`/DesignationTask/${updatedRow.id}`, {
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
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <div style={{ backgroundColor: "white" }}>
      <MocHeader master={"Master"} type={"Designation Task"} />
      <ToastContainer className="toast-container" />

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
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "16px",
              boxShadow: 24,
              p: 0,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box
              style={{
                padding: "20px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                </svg>{" "}
              </span>
            </Box>
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel id="functionName-label" className="custom_label">
                    Designation *
                  </InputLabel>

                  <Select
                    labelId="functionName-label"
                    id="designationId"
                    name="designationId"
                    value={lookupAdd.designationId}
                    onChange={handleAdd}
                    // label="Designation *"
                    fullWidth
                    error={!!errors.parentId}
                  >
                    <MenuItem value="" disabled>
                      <em>Designation *</em>
                    </MenuItem>
                    {particularList.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.parentId && (
                    <span style={{ color: "red" }}>{errors.parentId}</span>
                  )}
                </FormControl>
              </Box>
              <Box sx={{ mb: 3 }}>
                <TextField
                  id="code"
                  fullWidth
                  label="Task Name *"
                  name="code"
                  value={lookupAdd.code}
                  variant="outlined"
                  onChange={handleAdd}
                  error={!!errors.code}
                  helperText={errors.code}
                />
              </Box>
              <Box>
                <TextField
                  id="description"
                  fullWidth
                  label="Task Description *"
                  name="description"
                  value={lookupAdd.description}
                  variant="outlined"
                  onChange={handleAdd}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                // backgroundColor: "rgba(248, 250, 252)",
                p: 2,
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                marginTop: "0",
                marginBottom: "0",
                justifyContent: "end",
                // backgroundColor: " rgba(248,250,252)",
                padding: "30px",
                paddingBottom: "30px",
                paddingTop: "0",
              }}
            >
              <Button
                variant="contained"
                style={{
                  marginRight: "8px",
                  padding: "10px 20px",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid grey",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                }}
                type="submit"
                onClick={handleSubmit}
              >
                {lookupAdd.crudMode === "UPDATE" ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deletes}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletes}>
          <Box sx={style1}>
            <Box>
              <div className="flex">
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    marginRight: "5px",
                    marginTop: "5px",

                    color: "red",
                  }}
                >
                  <img src="/assets/images/etc/icon.png" />
                </Typography>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  Confirm action
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontSize: "15px",
                      fontWeight: "800px !important",
                      color: "grey",
                    }}
                  >
                    Do you want to delete ?
                  </Typography>
                </Typography>
              </div>
            </Box>
            <div
              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
              style={{
                marginTop: "15px",
                justifyContent: "end",
                backgroundColor: " rgba(248,250,252)",
                padding: "10px",
              }}
            >
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="primary"
                style={{
                  padding: "23px",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid grey",
                }}
                onClick={handleCloseDelete}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{ padding: "23px", backgroundColor: "red" }}
                type="submit"
                onClick={handleSubmitDelete}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div>
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Designation Tasks</b>
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
            {feature.includes("MCRT") && (
              <Button
                variant="contained"
                color="secondary"
                className="my-4"
                onClick={handleOpen}
              >
                <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                <span className="mx-4 sm:mx-8">Add</span>
              </Button>
            )}
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
                      sx={{ padding: dense ? "4px" : "default" }}
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
                                        page * rowsPerPage + row.index - 1,
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
          count={hazardList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
