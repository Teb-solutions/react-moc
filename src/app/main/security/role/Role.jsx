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
  Modal,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import Loader from "src/app/main/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import DeleteModal from "../../moc/common_modal/delete_modal/DeleteModal";

function createData(
  index,

  name,
  action,
  roleId
) {
  return { index, name, action, roleId };
}

export default function StickyHeadTable() {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];

  const columns = [
    { id: "index", label: "No", minWidth: 50 },
    // { id: "index", label: "No", minWidth: 50 },
    {
      id: "name",
      label: "Name",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },

    {
      id: "action",
      label: "Action",
      // minWidth: 170,
      align: "left",
      format: (value) => value.toFixed(2),
      render: (row) => (
        <div className="action_button">
          {feature.includes("RLCU") && (
            <Button
              onClick={() => handleEdit(row)}
              endIcon={
                <FuseSvgIcon size={20}>heroicons-solid:pencil</FuseSvgIcon>
              }
            ></Button>
          )}
          {feature.includes("RLD") && (
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
  const [departmentList, setDepartmentList] = useState([]);
  const [dense, setDense] = useState(false);
  const [deletes, setDelete] = useState(false);
  const [Id, setId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = departmentList.filter(
    (row) =>
      row.index.toString().includes(searchQuery) ||
      row.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [lookupAdd, setLookUpAdd] = useState({
    masterModule: "Role",
    crudMode: "INSERT",
    name: "",
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
    apiAuth.get(`/Role/List`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp.data.data.map((item, index) =>
        createData(
          index + 1,
          item.name,

          "Action",
          item.roleId
        )
      );
      setDepartmentList(transformedData);
    });
  }

  useEffect(() => {
    getRecords();
  }, [dense]);

  const handelAdd = (event) => {
    const { name, value } = event.target;
    setLookUpAdd({
      ...lookupAdd,
      [name]: value,
    });

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setEdit(false);
    setLookUpAdd({
      name: "",
    });
    setOpen(false);
  };

  const handleOpenDelete = () => {
    setDelete(true);
  };

  const handleCloseDelete = () => setDelete(false);

  const handleSubmitDelete = () => {
    apiAuth.delete(`/Role/${Id}`).then((resp) => {
      setDelete(false);
      toast.success("Deleted");

      getRecords();
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

    if (!lookupAdd.name) tempErrors.name = "Name is required";
    // Add other validations here
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = () => {
    if (validate()) {
      if (lookupAdd.crudMode == "UPDATE") {
        apiAuth.put(`/Role/${Id}`, lookupAdd).then((resp) => {
          setLookUpAdd({
            name: "",
          });
          toast.success("Updated.");

          setOpen(false);

          getRecords();
        });
      } else {
        apiAuth.post(`/Role/Create`, lookupAdd).then((resp) => {
          setLookUpAdd({
            name: "",
          });
          toast.success("Created.");
          setOpen(false);
          getRecords();
        });
      }
    }
  };

  const handleEdit = (row) => {
    setEdit(true);
    setLookUpAdd({
      ...row,
      crudMode: "UPDATE",
      id: 0,
      masterModule: "Role",
      roleId: row.roleId,
      name: row.name,
    });
    setId(row.roleId);
    handleOpen();
  };

  const handleDelete = (row) => {

    setId(row.roleId);
    handleOpenDelete();
  };

  const handleChangeDense = (event, index) => {
    const updatedDepartmentList = [...departmentList];
    updatedDepartmentList[index].isActive = event.target.checked;
    setDepartmentList(updatedDepartmentList);
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <div style={{ backgroundColor: "white" }}>
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
                  {!edit ? "Add" : "Edit"}
                </span>
                <span onClick={handleClose}>
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
                  label="Name"
                  name="name"
                  value={lookupAdd.name}
                  variant="outlined"
                  onChange={handelAdd}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
            </div>

            <div
              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
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
                {edit ? "Update" : "Submit"}
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <DeleteModal
        openDelete={deletes}
        handleCloseDelete={handleCloseDelete}
        title=""
      >
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
      </DeleteModal>
      <div>
        <div className="flex d-flex p-30 pt-24 pb-24 flex-col justify-between task_form_area sm:flex-row sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Role</b>
          </InputLabel>
          <div className="flex items-center justify-between mt-4">
            {feature.includes("RLC") && (
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
                                    checked={row.isActive} // Reflects the isActive property of the department
                                    onChange={(event) =>
                                      handleChangeDense(
                                        event,
                                        page * rowsPerPage + row.index - 1
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
          count={departmentList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
