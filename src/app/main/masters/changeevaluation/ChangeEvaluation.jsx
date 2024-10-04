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
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import MocHeader from "../../moc/MocHeader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../moc/common_modal/delete_modal/DeleteModal";
import MasterAddEditModal from "../../moc/common_modal/master_modal/MasterAddEditModal";

function createData(
  index,
  code,
  description,
  status,
  action,
  isActive,
  id,
  lookupType
) {
  return { index, code, description, status, action, isActive, id, lookupType };
}

export default function StickyHeadTable() {
  const feature = decryptFeature();
  // const feature = storedFeature ? storedFeature : [];
  const columns = [
    // { id: "index", label: "#", minWidth: 50 },
    // { id: "code", label: "Code", minWidth: 100 },
    { id: "index", label: "#" },
    { id: "code", label: "Code" },
    {
      id: "description",
      label: "Description",
      //minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "status",
      label: "Status",
      //minWidth: 70,
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
  const [highriskactivityList, SetHighriskactivityList] = useState([]);
  const [dense, setDense] = useState(false);
  const [deletes, setDelete] = useState(false);
  const [Id, setId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState({});

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = highriskactivityList.filter(
    (row) =>
      row.index.toString().includes(searchQuery) ||
      row.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [lookupAdd, setLookUpAdd] = useState({
    LookupType: "changeevaluation",
    code: "",
    crudMode: "INSERT",
    description: "",
    isActive: true,
    name: "",
    parentId: 0,
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
    apiAuth.get(`/LookupData/List/changeevaluation`).then((resp) => {
      setIsLoading(false);
      const transformedData = resp?.data.data?.map((item, index) =>
        createData(
          index + 1,
          item.code,
          item.description,
          dense,
          "Action",
          item.isActive,
          item.id,
          item.lookupType
        )
      );
      SetHighriskactivityList(transformedData);
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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setLookUpAdd({
      ...lookupAdd,
      LookupType: "changeevaluation",
      code: "",
      crudMode: "INSERT",
      description: "",
      isActive: true,
      name: "",
      parentId: 0,
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
        if (lookupAdd.code.length < 2) {
          setOpen(false);

          toast.error("Code Maximum length is 2 charcters");
        } else {
          apiAuth.post(`/LookupData/Create`, lookupAdd).then((resp) => {
            if (resp.data.statusCode === 200) {
              setOpen(false);
              toast.success("Created.");
              setLookUpAdd({
                ...lookupAdd,
                LookupType: "changeevaluation",
                code: "",
                crudMode: "INSERT",
                description: "",
                isActive: true,
                name: "",
                parentId: 0,
              });
              getRecords();
            } else {
              setLookUpAdd({
                ...lookupAdd,
                LookupType: "changeevaluation",
                code: "",
                crudMode: "INSERT",
                description: "",
                isActive: true,
                name: "",
                parentId: 0,
              });
              setOpen(false);
              toast.error(resp.data.message);
            }
          });
        }
      }
    }
  };

  const handleEdit = (row) => {
    setLookUpAdd({
      ...row,
      crudMode: "UPDATE",
      id: row.id,
      lookupType: row.lookupType,
      parentType: "",
      LookupType: "changeevaluation",
    });
    setId(row.id);
    handleOpen();
  };

  const handleDelete = (row) => {

    setId(row.id);
    handleOpenDelete();
  };

  const handleChangeDense = (event, row) => {
    const updatedDepartmentList = [...highriskactivityList];
    const updatedRow = updatedDepartmentList.find((item) => item.id === row.id);

    if (updatedRow) {
      updatedRow.isActive = event.target.checked;

      // Update the state immediately to reflect the change in the UI
      SetHighriskactivityList(updatedDepartmentList);

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
      <MocHeader master={"Master"} type={"Change Evaluation"} />
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

      <MasterAddEditModal
        open={open}
        handleClose={handleClose}
        lookupAdd={lookupAdd}
        handleAdd={handleAdd}
        errors={errors}
        handleSubmit={handleSubmit}
      />

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
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Change Evaluation</b>
          </InputLabel>
          <div className="flex items-center d-sm-block  justify-between mt-0">
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
          count={highriskactivityList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
