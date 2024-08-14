import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Badge,
  Box,
  Button,
  Fade,
  FormControl,
  FormLabel,
  InputAdornment,
  Modal,
  OutlinedInput,
  Paper,
  Step,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
function createData(
  index,

  Task,
  Audit,
  date,
  staff
) {
  return { index, Task, Audit, date, staff };
}
const OrgImplementation = ({
  impDetails,
  appActivity,
  appActions,
  lastActCode,
  currentActivityForm,
  orgEvaluationId,
  setImpDetails,
}) => {
  const columns = [
    { id: "index", label: "#", minWidth: 50 },
    {
      id: "Task",
      label: "Task",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Audit",
      label: "Audit Comments",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: "Done By Date",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "staff",
      label: "Done BY staff",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const styleAuditCom = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    height: "25%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1100px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });
  const drawerStyle = (open) => ({
    width: 350,
    bgcolor: "background.paper",
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: 24,
    p: 2,
    position: "absolute",
    top: 0,
    right: open ? 0 : -250, // Move drawer out of view when closed
    height: "100%",
    zIndex: 10,
    transition: "right 0.3s ease",
    overflow: "auto", // Smooth transition for opening/closing
  });
  const style2 = {
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

  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
  const [expanded, setExpanded] = useState(null);
  const [impComments, setImpComments] = useState([]);
  const [comments, setComments] = useState("");
  const [openAudit, setOpenAudit] = useState(false);
  const [openAuditComment, setOpenAuditComment] = useState(false);
  const handleCloseAudit = () => setOpenAudit(false);
  const handleCloseAuditComment = () => setOpenAuditComment(false);
  const [currentAudit, setCurrentAudit] = useState([]);

  const [auditData, setAuditData] = useState({
    comments: "",
    isActive: true,
    auditsid: "",
  });
  const handleAccordionChange = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : null);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  console.log(currentAudit, "ppppppp");

  const filteredDepartmentList = currentAudit.filter((row) =>
    row.Audit.toString().includes(searchQuery)
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handelOpenAuditComment = (auditsid) => {
    setOpenAuditComment(true);
    setAuditData((prevState) => ({
      ...prevState,
      auditsid: auditsid,
    }));
  };
  const handleAddAuditComment = (e) => {
    const { name, value } = e.target;
    setAuditData((prevState) => ({
      ...prevState,
      comments: value,
    }));
  };
  function getRecords() {
    apiAuth.get(`/OrgMoc/GetImplementation/${orgEvaluationId}`).then((resp) => {
      setImpDetails(resp.data?.data?.taskList);
    });
  }

  const handelAuditCommentSubmit = () => {
    apiAuth
      .put(
        `/ChangeImplementation/Audit/?requestToken=${orgEvaluationId}&&taskId=${auditData.auditsid}`,
        {
          comments: auditData.comments,
          isActive: auditData.isActive,
        }
      )
      .then((resp) => {
        setOpenAuditComment(false);
        getRecords();
      });
  };
  const [documentCounts, setDocumentCounts] = useState({});

  const handelComments = (e, taskid) => {
    apiAuth
      .get(`ChangeImpact/ListTaskCommentst?id=${taskid}`)
      .then((resp) => {
        const comments = resp.data.data;
        setImpComments(comments);
        comments.forEach((comment) => {
          const id = comment.id;
          apiAuth
            .get(`/DocumentManager/DocumentCount?id=${id}&documentType=Task`)
            .then((documentResp) => {
              const count = documentResp.data.data; // Assuming this is the count value
              setDocumentCounts((prevCounts) => ({
                ...prevCounts,
                [id]: count,
              }));
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching task comments:", error);
      });
  };

  const handelApproveImpl = (e, task) => {
    const updatedTask = {
      ...task,
      submissionList: impComments,
      comments: comments,
      parentId: 0,
      taskStatus: 3,
      changeEvaluationId: 0,
      changeImapactId: 0,
      taskStatusText: "Work In Progress",
    };

    apiAuth
      .post(`ChangeImpact/ActionTask?id=${orgEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelRejectImpl = (e, task) => {
    const updatedTask = {
      ...task,
      comments: comments,
      submissionList: impComments,
      ChangeEvaluationId: 0,
      ParentId: 0,
      taskStatus: 4,
    };
    apiAuth
      .post(`/ChangeImpact/ActionTask?id=${orgEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseAuditMoc = (uid) => {
    let taskListApproved = impDetails?.filter((x) => x.taskStatus == 3);
    if (impDetails?.length != taskListApproved?.length) {
      toast?.error("There are some pending Tasks to be approved.");
      return;
    } else {
      apiAuth
        .post(`/OrgMoc/ImplementationSubmit/${orgEvaluationId}`, {
          activityUID: appActivity.uid,
          actionUID: uid,
          formUID: appActivity.formUID,
        })
        .then((response) => {
          toast?.success("MOC successfully closed");
          setTimeout(() => {
            location.reload();
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
          toast?.success("Some Error Occured");
        });
    }
  };

  const handelOpenAudit = async (audits, value) => {
    setOpenAudit(true);
    const transformedData = audits.map((item, index) =>
      createData(
        index + 1,
        item.task,
        item.comments,
        formatDate(item.donebydate),
        item.auditDoneBy
      )
    );
    setCurrentAudit(transformedData);
  };
  const [deletes, setDeletes] = useState(false);
  const [open, setOpen] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [fileDetails, setFileDetails] = useState(false);
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const handleOpen = (id) => {
    apiAuth
      .get(
        `DocumentManager/DocList/${id}/Task?changeRequestToken=${orgEvaluationId}`
      )
      .then((response) => {
        setListDocument(response?.data?.data);
      });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [fileName, setFileName] = useState("");

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
    setFileName(doc.name);
  };

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  const handleCloseDelete = () => {
    setDeletes(false);
  };
  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ChangeRequest?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };

  return (
    <div className="w-full">
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
          <Box sx={style2}>
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
                style={{
                  padding: "23px",
                  backgroundColor: "red",
                }}
                type="submit"
                onClick={handleSubmitDelete}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAuditComment}
        onClose={handleCloseAuditComment}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAuditComment}>
          <Box sx={styleAuditCom}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              <h4>Add Audit</h4>
            </Box>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "4rem",
                  fontWeight: "800px !important",
                }}
              >
                <div className="flex-auto">
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "10px",
                      }}
                      className="flex flex-row"
                    >
                      <Box sx={{ width: "100%" }}>
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Comments *
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="comments"
                          onChange={handleAddAuditComment}
                        />
                      </Box>
                    </div>
                  </div>{" "}
                </div>
                <div className="flex justify-end ">
                  <Button
                    className="whitespace-nowrap ms-5 me-12 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "5px",
                    }}
                    onClick={handelAuditCommentSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAudit}
        onClose={handleCloseAudit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAudit}>
          <Box sx={style1}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              Audit List
            </Box>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full  border-b justify-end"
              style={{ marginTop: "10px" }}
            >
              <TextField
                variant="filled"
                fullWidth
                placeholder="Search"
                style={{
                  marginBottom: "15px",
                  backgroundColor: "white",
                  marginRight: "30px",
                }}
                //   value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        marginTop: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 320 }}
              />
            </div>
            <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
              <TableContainer style={{ marginTop: "15px" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns?.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                          }}
                        >
                          {column?.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDepartmentList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                            sx={{ padding: "default" }}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ borderBottom: "1px solid #dddddd" }}
                                >
                                  {column.render
                                    ? column.render(row) // Render custom actions
                                    : column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
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
                style={{ display: "flex", marginTop: "10px" }}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={currentAudit.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
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
          <Box sx={style1}>
            <Box>
              <Box className="flex justify-between" style={{ margin: "30px" }}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "4rem",
                    fontWeight: "800px !important",
                  }}
                >
                  File Manager
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                className="d-flex flex-wrap p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto custom_height"
                component="div"
                style={{
                  backgroundColor: "#e3eeff80",
                }}
              >
                {listDocument.map((doc, index) => (
                  <div className="content " key={index}>
                    <div
                      onClick={() => handelDetailDoc(doc)}
                      style={{ textAlign: "-webkit-center" }}
                    >
                      <img src="/assets/images/etc/icon_N.png" style={{}} />
                      <h6 className="truncate-text">{doc?.name}</h6>
                      <h6>by {doc?.staffName}</h6>
                    </div>
                  </div>
                ))}
              </Typography>
            </Box>
            {fileDetails && (
              <Box sx={drawerStyle(fileDetails)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setFileDetails(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
                  </Button>
                </div>

                <div className="text-center">
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        disabled
                        // onClick={handelDetailDoc}
                        style={{
                          textAlign: "-webkit-center",
                        }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument?.name}
                    </div>
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "25ch",
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Information</BoldLabel>}
                      variant="standard"
                      disabled
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "25ch",
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="selectedFileName"
                      label="Created By"
                      variant="standard"
                      disabled
                      value={selectedDocument.staffName}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "25ch",
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label=" Created At"
                      name="description"
                      variant="standard"
                      disabled
                      value={formatDate(selectedDocument.createdAt)}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "25ch",
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Description</BoldLabel>}
                      name="descritpion"
                      variant="standard"
                      disabled
                      value={
                        selectedDocument?.description === null
                          ? ""
                          : selectedDocument?.descritpion
                      }
                    />
                  </Box>
                </div>

                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{
                    marginTop: "15px",
                    justifyContent: "center",
                    backgroundColor: " rgba(248,250,252)",
                  }}
                >
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                    onClick={(e) =>
                      handleDelete(
                        e,
                        selectedDocument?.documentId,
                        selectedDocument?.token
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div className="flex items-center w-full p-30 pt-24 pb-24 justify-between">
            <h2 className="text-2xl font-semibold">Implementation</h2>
          </div>

          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full border-b justify-between"
          ></div>
          <div className="p-30 pt-24 pb-24">
            <div
              _ngcontent-fyk-c288=""
              class="flex flex-wrap items-center w-full justify-between border_box"
            >
              <div className="flex  items-center">
                <h2
                  _ngcontent-fyk-c288=""
                  class="text-xl font-semibold"
                  style={{ marginRight: "0" }}
                >
                  {impDetails.length} Tasks
                </h2>
              </div>

              <TextField
                variant="filled"
                fullWidth
                placeholder="Search"
                style={{
                  marginBottom: "0",
                  backgroundColor: "white",
                }}
                //   value={searchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        marginTop: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 320 }}
              />
            </div>
            <div className="border_accordian">
              {impDetails.map((detail, index) => (
                <Accordion
                  key={detail.id}
                  expanded={expanded === detail.id}
                  sx={{
                    minHeight: "70px",
                    transition: "height 0.3s",
                    "&.Mui-expanded": {
                      minHeight: "100px",
                    },
                  }}
                  onChange={handleAccordionChange(detail.id)}
                >
                  <AccordionSummary
                    style={{ minHeight: "60px" }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                    onClick={(e) => handelComments(e, detail.id)}
                  >
                    <div className="flex flex-wrap justify-between w-100 pr-10">
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center">
                          Task #{detail.id}
                        </div>
                      </div>
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center" style={{}}>
                          {detail.isCompleted && detail.taskStatus === 3 ? (
                            <span className="text-green">Approved</span>
                          ) : detail.isCompleted && detail.taskStatus !== 3 ? (
                            <span className="text-red">Awaiting Approval</span>
                          ) : (
                            <span className="text-black">Not Completed</span>
                          )}
                        </div>
                      </div>
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center">No Risks</div>
                      </div>
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center">
                          {detail.assignedStaff}
                        </div>
                      </div>
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center">
                          {formatDate(detail.dueDate)}
                        </div>
                      </div>
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "17%" }}
                      >
                        <div className="flex items-center">
                          <StyledBadge badgeContent={detail?.audits?.length}>
                            <Button
                              className="whitespace-nowrap mt-5 mb-5"
                              style={{
                                border: "1px solid",
                                backgroundColor: "#0000",
                                color: "black",
                                borderColor: "rgba(203,213,225)",
                              }}
                              variant="contained"
                              color="warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handelOpenAudit(detail.audits, "");
                              }}
                            >
                              Audits
                            </Button>
                          </StyledBadge>
                          {lastActCode?.canExecute && (
                            <Button
                              className="whitespace-nowrap ms-5 mt-5 mb-5"
                              style={{
                                border: "1px solid",
                                backgroundColor: "#0000",
                                color: "black",
                                borderColor: "rgba(203,213,225)",
                              }}
                              variant="contained"
                              color="warning"
                              onClick={() => handelOpenAuditComment(detail.id)}
                            >
                              <FuseSvgIcon
                                className="text-48"
                                size={24}
                                color="action"
                              >
                                heroicons-outline:document-text
                              </FuseSvgIcon>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stepper orientation="vertical">
                      <Step>
                        <div style={{ alignItems: "flex-start" }}>
                          <div className="flex flex-col items-start mt-5">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#dbeafe",
                              }}
                            >
                              <b>{detail?.assignedByStaff}</b>
                              <p>What is the task : {detail?.actionWhat}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-start mt-5">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#dbeafe",
                              }}
                            >
                              <p>How is Task done : {detail?.actionHow}</p>
                            </div>
                          </div>
                          {detail?.particularName &&
                            detail?.particularSubName && (
                              <div className="flex flex-col items-start mt-5">
                                <div
                                  className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                  style={{
                                    padding: "20px",
                                    backgroundColor: "#dbeafe",
                                  }}
                                >
                                  <p>
                                    Impact :{" "}
                                    {`${detail?.particularName} > ${detail?.particularSubName}`}
                                  </p>
                                </div>
                              </div>
                            )}
                          <div className="flex flex-col items-start mt-5">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#dbeafe",
                              }}
                            >
                              <p>Due Date : {formatDate(detail.dueDate)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center my-3">
                            <div className="flex-auto border-b"></div>
                            <div
                              className="flex-0 "
                              style={{ fontSize: "xx-small" }}
                            >
                              <b>{detail?.assignedByStaff}</b> has assigned task
                              to <b>{detail?.assignedStaff}</b> on{" "}
                              {formatDate(detail.assignedAt)}
                            </div>
                            <div className="flex-auto border-b"></div>
                          </div>

                          {impComments.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex flex-row flex-wrap mb-2"
                              style={{
                                width: "auto",
                                display: "block",
                                clear: "both",
                              }}
                            >
                              {msg?.remark && (
                                <div
                                  className="flex flex-row items-start mt-5"
                                  style={{
                                    position: "relative",
                                    justifyContent: "end",
                                  }}
                                >
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-grey-100 text-gray-700"
                                    style={{ padding: "10px" }}
                                  >
                                    <div
                                      className="font-semibold"
                                      style={{
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {" "}
                                      {detail.assignedStaff}{" "}
                                    </div>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: msg?.remark,
                                      }}
                                    ></div>
                                    <div className="my-0.5 text-xs font-medium text-secondary">
                                      <small>
                                        {msg.startedDate &&
                                        !msg.workInProgressDate &&
                                        !msg.completedDate &&
                                        !msg.dueDate
                                          ? `Started on ${formatDate(msg.startedDate)}`
                                          : msg.workInProgressDate &&
                                              !msg.completedDate &&
                                              !msg.dueDate
                                            ? `Work in Progress since ${formatDate(msg.workInProgressDate)}`
                                            : msg.dueDate && !msg.completedDate
                                              ? `Due on ${formatDate(msg.dueDate)}`
                                              : msg.completedDate
                                                ? `Completed on ${formatDate(msg.completedDate)}`
                                                : "Unknown"}
                                      </small>
                                    </div>
                                  </div>

                                  <StyledBadge
                                    badgeContent={documentCounts[msg.id]}
                                  >
                                    <button
                                      className="icon-button"
                                      onClick={() => handleOpen(msg.id)}
                                      style={{
                                        top: "-0px",
                                      }}
                                    >
                                      <FuseSvgIcon size={20}>
                                        heroicons-solid:document
                                      </FuseSvgIcon>
                                    </button>
                                  </StyledBadge>
                                </div>
                              )}
                              {msg.comments && (
                                <div className="flex flex-col items-start mt-5">
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "10px",
                                      backgroundColor: "#dbeafe",
                                    }}
                                  >
                                    <div
                                      className="font-semibold"
                                      style={{
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {" "}
                                      {detail.assignedByStaff}{" "}
                                    </div>
                                    <div
                                      className="min-w-4 leading-5 "
                                      dangerouslySetInnerHTML={{
                                        __html: msg.comments,
                                      }}
                                      style={{
                                        fontSize: "smaller",
                                      }}
                                    ></div>
                                    <div
                                      className="min-w-4 leading-5"
                                      style={{
                                        fontSize: "xx-small",
                                      }}
                                    >
                                      {" "}
                                      {msg.approvalStatusDate && (
                                        <>
                                          {msg.approverId
                                            ? "Approved on"
                                            : "Rejected on"}{" "}
                                          {new Date(
                                            msg.approvalStatusDate
                                          ).toLocaleString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                          })}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {detail.isCompleted && detail.taskStatus !== 3 && (
                            <>
                              <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0 mt-5">
                                <div
                                  _ngcontent-fyk-c288=""
                                  class="flex items-center w-full  border-b justify-between"
                                ></div>
                              </div>
                              {currentActivityForm.canEdit && (
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "100%" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <FormControl
                                      fullWidth
                                      sx={{
                                        m: 1,
                                        maxWidth: "100%",
                                      }}
                                    >
                                      <span className="font-semibold leading-none">
                                        Comments*
                                      </span>
                                      <OutlinedInput
                                        id="reasonForNewDocument"
                                        name="reasonForNewDocument"
                                        onChange={(e) =>
                                          setComments(e.target.value)
                                        }
                                        label="Reason For Change*"
                                        className="mt-5"
                                      />
                                    </FormControl>
                                  </Box>
                                </div>
                              )}
                              {currentActivityForm.canEdit && (
                                <div className="flex justify-start ">
                                  <Button
                                    className="whitespace-nowrap ms-5 "
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                      marginTop: "10px",
                                      backgroundColor: "white",
                                      color: "black",
                                    }}
                                    onClick={(e) => handelRejectImpl(e, detail)}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    className="whitespace-nowrap ms-5 "
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                      marginTop: "10px",
                                    }}
                                    onClick={(e) =>
                                      handelApproveImpl(e, detail)
                                    }
                                  >
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </Step>
                    </Stepper>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
            {currentActivityForm.canEdit && (
              <>
                <div
                  _ngcontent-fyk-c288=""
                  class="flex items-center w-full  border-b justify-between"
                ></div>
                <div className="flex justify-end ">
                  {appActions?.map((btn) => (
                    <Button
                      className="whitespace-nowrap ms-5 "
                      variant="contained"
                      color="secondary"
                      style={{
                        marginTop: "10px",
                      }}
                      onClick={() => handleCloseAuditMoc(btn.uid)}
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default OrgImplementation;
