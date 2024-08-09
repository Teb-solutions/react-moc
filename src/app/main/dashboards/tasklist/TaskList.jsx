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
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
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
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MocHeader from "../moc/MocHeader";
function createData(
  index,
  what,
  how,
  changeRequestNo,
  assignedToStaff,
  isCompleted,

  deadline,
  dueDate,
  assignedToStaffId
) {
  return {
    index,
    what,
    how,
    changeRequestNo,
    assignedToStaff,
    isCompleted,

    deadline,
    dueDate,
    assignedToStaffId,
  };
}

export default function StickyHeadTable() {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];
  const columns = [
    // { id: "index", label: "#", minWidth: 50 },
    // { id: "code", label: "Code", minWidth: 100 },
    { id: "index", label: "Task Id" },
    { id: "what", label: "What is the task" },
    {
      id: "how",
      label: "How is the task",
      //minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    { id: "changeRequestNo", label: "Request No" },
    { id: "assignedToStaff", label: "Assigned to" },
    {
      id: "isCompleted",
      label: "Current status",
      render: (row) => (row.isCompleted ? "Completed" : "Not Completed"),
    },
    // {
    //   id: "status",
    //   label: "Status",
    //   //minWidth: 170,
    //   align: "left",
    //   format: (value) => value.toFixed(2),
    // },
    {
      id: "action",
      label: "Action",
      //minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
      render: (row) => (
        <div className="action_button whitespace_">
          <Button
            onClick={() => handleView(row)}
            endIcon={<FuseSvgIcon size={20}>heroicons-solid:eye</FuseSvgIcon>}
          ></Button>
          <Button
            onClick={() => handleEdit(row)}
            endIcon={
              <FuseSvgIcon size={20}>heroicons-solid:pencil</FuseSvgIcon>
            }
          ></Button>
          <Button
            onClick={() => handleDelete(row)}
            endIcon={<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>}
          ></Button>
        </div>
      ),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [siteList, setSiteList] = useState([]);
  const [dense, setDense] = useState(false);
  const [deletes, setDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [taskview, setTaskview] = useState(false);

  const [errors, setErrors] = useState({});
  const [Idsss, setId] = useState("");
  const [staff, setStaff] = useState([]);
  const [openView, setOpenView] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [reasons, setReason] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = siteList.filter(
    (row) =>
      row.changeRequestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.what.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.index.toString().includes(searchQuery)
  );

  const [lookupAdd, setLookUpAdd] = useState({
    id: 0,
    assignedStaffId: 0,
    actionWhat: "string",
    actionHow: "string",
    deadline: 1,
    dueDate: "2024-08-08T06:22:26.920Z",
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
    width: "600px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",
    boxShadow: 24,
    // p: 4,
    padding: "0px",
  };
  function getRecords() {
    apiAuth.get(`/Staff/LOV`).then((resp) => {
      setStaff(resp.data.data);
    });
    apiAuth.get(`/Task/GetAllActiveTasks`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp.data.data.map((item, index) =>
        createData(
          item.id,

          item.what,
          item.how,
          item.changeRequestNo,
          item.assignedToStaff,
          item.isCompleted,
          item.deadline,
          item.dueDate,
          item.assignedToStaffId
        )
      );
      setSiteList(transformedData);
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

  const handleAutocompleteChange = (event, newValue) => {
    setLookUpAdd({
      ...lookupAdd,
      assignedStaffId: newValue?.value || 0,
    });
  };

  const handleOpen = () => {
    setOpen(true);
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

  const handleOpenDelete = (row) => {
    setDelete(true);
  };

  const handleCloseDelete = () => setDelete(false);

  const handleSubmitDelete = () => {
    apiAuth
      .put(`/Task/RemoveTask`, {
        id: Idsss,
        reason: reasons,
      })
      .then((resp) => {
        if (resp.data.statusCode == "424") {
          toast.error(resp.data.message);
          setDelete(false);
        } else {
          toast.success("Deleted.");
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

    if (!lookupAdd.actionWhat) tempErrors.actionWhat = "This field is required";
    if (!lookupAdd.actionHow) tempErrors.actionHow = "This field is required";
    if (!lookupAdd.assignedStaffId)
      tempErrors.assignedStaffId = "Staff is required";

    if (!lookupAdd.dueDate) tempErrors.dueDate = "Date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      apiAuth.put(`/Task/UpdateTask`, lookupAdd).then((resp) => {
        setOpen(false);
        toast.success("Updated.");
        getRecords();
      });
    }
  };

  const handleEdit = (row) => {
    setLookUpAdd({
      id: row.index, // Assuming `id` is the unique identifier
      actionWhat: row.what,
      actionHow: row.how,
      assignedStaffId: row.assignedToStaffId,
      deadline: row.deadline,
      dueDate: row.dueDate,
    });
    handleOpen();
  };

  const handleView = (row) => {
    setTaskview(true);
    setOpenView(row);
    handleOpenDelete(row);
  };
  const handleDelete = (row) => {
    setTaskview(false);

    setId(row.index);
    handleOpenDelete(row);
  };

  const handleChangeDense = (event, index) => {
    const updatedDepartmentList = [...siteList];
    const updatedRow = updatedDepartmentList[index];
    updatedRow.isActive = event.target.checked;

    // Update the state immediately to reflect the change in the UI
    setSiteList(updatedDepartmentList);

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
  };
  if (isLoading) {
    return <FuseLoading />;
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <MocHeader nothing={"nothing"} type={"Task List"} />
      <ToastContainer
        className="toast-container"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
                <span className="text-popup font-medium">Edit</span>
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
              >
                <TextField
                  id="outlined-basic"
                  label="What is the task *"
                  inputProps={{
                    maxLength: 100, // Limit to 100 characters
                  }}
                  name="actionWhat"
                  value={lookupAdd.actionWhat}
                  variant="outlined"
                  onChange={handleAdd}
                  error={!!errors.actionWhat}
                  helperText={errors.actionWhat}
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
                  label="How is the task done *"
                  name="actionHow"
                  value={lookupAdd.actionHow}
                  variant="outlined"
                  onChange={handleAdd}
                  error={!!errors.actionHow}
                  helperText={errors.actionHow}
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
                <FormControl fullWidth>
                  <Autocomplete
                    id="assignedStaffId"
                    name="assignedStaffId"
                    options={staff}
                    getOptionLabel={(option) => option.text || ""}
                    value={
                      staff.find(
                        (staffs) => staffs.value === lookupAdd.assignedStaffId
                      ) || null
                    }
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assigned to"
                        error={!!errors.assignedStaffId}
                      />
                    )}
                  />

                  {errors.assignedStaffId && (
                    <span style={{ color: "red" }}>
                      {errors.assignedStaffId}
                    </span>
                  )}
                </FormControl>
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
                  label="Due Date *"
                  name="dueDate"
                  type="date" // Ensure the input type is date for proper date formatting
                  value={lookupAdd.dueDate.slice(0, 10)} // Extract the date part (YYYY-MM-DD)
                  variant="outlined"
                  onChange={handleAdd}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                />
              </Box>
            </div>

            <div
              className="flex items-center space-x-12"
              style={{
                marginTop: "0",
                marginBottom: "0",
                justifyContent: "end",
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
                onClick={handleClose}
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
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
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
          {taskview == false ? (
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
                    <img src="/assets/images/etc/icon.png" alt="icon" />
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
                      Do you want to delete?
                    </Typography>
                  </Typography>
                </div>
              </Box>

              {/* Full-width text area for typing the reason */}
              <Box sx={{ marginTop: "15px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Type your reason here..."
                  onChange={(e) => setReason(e.target.value)}
                  // Add any additional props or event handlers you need
                />
              </Box>

              <div
                className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                style={{
                  marginTop: "15px",
                  justifyContent: "end",
                  backgroundColor: "rgba(248,250,252)",
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
          ) : (
            <Box sx={style}>
              <Box
                className="p-30 pt-24 pb-24"
                style={{
                  // padding: "30px",
                  backgroundColor: "#4f46e5",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              >
                <div className="flex justify-between text-white">
                  <span className="text-popup font-medium">Task Details</span>
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
              <Paper className="w-full mx-auto  rounded-16 shadow overflow-hidden">
                <div className="p-30 pt-24 pb-24">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:gap-16 w-full gap-6">
                    <div className="">
                      <div className="mt-3 leading-6 text-secondary">
                        How is the task
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {openView.what}
                      </div>
                    </div>

                    <div className="">
                      <div className="mt-3 leading-6 text-secondary">
                        What is the task done
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {openView.how}
                      </div>
                    </div>
                    <div className="">
                      <div className="mt-3 leading-6 text-secondary">
                        Assigned staff
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {openView.assignedToStaff}
                      </div>
                    </div>
                    <div className="">
                      <div className="mt-3 leading-6 text-secondary">
                        Due Date
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {openView.dueDate.slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-1 gap-y-6 w-full">
                    <div className="my-6">
                      <div className="mt-3 leading-6 text-secondary">
                        Comments
                      </div>
                      <div className="text-lg leading-6 font-medium">
                      </div>
                    </div>
                    <div className="my-6">
                      <div className="mt-3 leading-6 text-secondary">
                        Description
                      </div>
                      <div className="text-lg leading-6 font-medium">
                      </div>
                    </div>
                  </div> */}
                </div>
              </Paper>
            </Box>
          )}
        </Fade>
      </Modal>
      <div>
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Task List</b>
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
            {/* <Button
                variant="contained"
                className="my-4"
                color="secondary"
                onClick={handleOpen}
              >
                <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                <span className="mx-4 sm:mx-8">Add</span>
              </Button> */}
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
                    className="whitespace_"
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
                                    checked={row.isActive}
                                    onChange={(event) =>
                                      handleChangeDense(
                                        event,
                                        page * rowsPerPage + row.index - 1
                                      )
                                    }
                                  />
                                }
                              />
                            ) : column.render ? (
                              column.render(row)
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
          count={siteList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
