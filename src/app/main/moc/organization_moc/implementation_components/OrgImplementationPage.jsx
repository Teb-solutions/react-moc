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
import { display } from "@mui/system";
import AuditModal from "../../common_modal/audit_modals/AddAudit";
import AuditListModal from "../../common_modal/audit_modals/AuditList";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
import DocumentModal from "../../common_modal/documentModal";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import DateExtend from "../../asset_moc/implementaion_components/DateExtend";
function createData(index, Task, Audit, date, staff) {
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
      top: "17px",
      right: "8px",
    },
  }))(Badge);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [impComments, setImpComments] = useState([]);
  const [comments, setComments] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openAudit, setOpenAudit] = useState(false);
  const [openAuditComment, setOpenAuditComment] = useState(false);
  const [currentAudit, setCurrentAudit] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  const handelOpenAuditComment = (auditsid) => {
    setOpenAuditComment(true);
    setAuditData((prevState) => ({
      ...prevState,
      auditsid: auditsid,
      comments: "",
    }));
  };
  function getRecords() {
    apiAuth.get(`/OrgMoc/GetImplementation/${orgEvaluationId}`).then((resp) => {
      setImpDetails(resp.data?.data?.taskList);
    });
  }

  const validateForm = () => {
    let tempErrors = {};
    const cleanedComments = auditData?.comments?.replace(/\s+/g, " ").trim();

    auditData.comments = cleanedComments;
    if (!cleanedComments) tempErrors.comments = "Comments is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handelAuditCommentSubmit = () => {
    if (!validateForm()) {
      return;
    }
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
    if (comments.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsButtonDisabled(true);

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
        setIsButtonDisabled(false);

        apiAuth
          .get(`ChangeImpact/ListTaskCommentst?id=${task.id}`)
          .then((resp) => {
            const comments = resp.data.data;
            setImpComments(comments);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelRejectImpl = (e, task) => {
    if (comments.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsButtonDisabled(true);

    const updatedTask = {
      ...task,
      comments: comments,
      submissionList: impComments,
      ChangeEvaluationId: 0,
      ParentId: 0,
      taskStatus: 4,
      changeImapactId: 0,
    };
    apiAuth
      .post(`/ChangeImpact/ActionTask?id=${orgEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        setIsButtonDisabled(false);

        apiAuth
          .get(`ChangeImpact/ListTaskCommentst?id=${task.id}`)
          .then((resp) => {
            const comments = resp.data.data;
            setImpComments(comments);
          });
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
        .post(`OrgMoc/ImplementationSubmit/${orgEvaluationId}`, {
          activityUID: appActivity.uid,
          actionUID: uid,
          formUID: appActivity.formUID,
        })
        .then((response) => {
          if (response.data.statusCode == 400) {
            toast?.error(response.data.message);
          } else {
            toast?.success("MOC successfully closed");

            setTimeout(() => {
              location.reload();
            }, 1000);
          }
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

  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const [dateExtendopen, setDateExtendOpen] = useState(false);
  const [commentss, setCommentss] = useState("");
  const [ShowTask, setShowTask] = useState(false);
  const [dueDateValidation, setDueDateValidation] = useState(null);
  const [task, setTask] = useState({});
  const [reqDate, setReqDate] = useState(null);
  const [dueDateCommentValidation, setDueDateCommentValidation] =
    useState(null);
  const handledateExtendopen = (e, task, show) => {
    e.preventDefault();
    if (show === "false") {
      setShowTask(true);
    } else {
      setShowTask(false);
    }
    getRecords();
    setTask(task);

    setDateExtendOpen(true);
  };

  const handlehandledateExtendClose = () => {
    setDueDateValidation(false);

    setDueDateCommentValidation(false);
    setDateExtendOpen(false);
  };

  const handleSubmits = (task, value) => {
    if (!commentss || !reqDate) {
      if (!reqDate) setDueDateValidation("Due Date is required");
      if (!comments)
        setDueDateCommentValidation("Please provide a reason for extension");

      return;
    }
    let formattedReqDate = dayjs(reqDate).format("MM-DD-YYYY");
    let formattedOldDate = dayjs(task.dueDate).format("MM-DD-YYYY");

    const lastTaskDateUpdate = task.taskDateUpdates.filter(
      (update) => update.taskdateupdateStatus === 1
    );

    apiAuth
      .put(
        `/Task/ApproveTaskDateUpdate/?requestToken=${orgEvaluationId}&taskId=${task?.sourceTaskId}&updatedateID=${lastTaskDateUpdate[0].id}`,
        {
          OldDate: formattedOldDate,
          ApprovedComments: commentss,
          ApprovedDate: formattedReqDate,
          TaskdateupdateStatus: value == 2 ? "Approved" : "Rejected",
          updatedateID: lastTaskDateUpdate[0].id,
        }
      )
      .then((response) => {
        if (response.data.statusCode == 500) {
          getRecords();
          setDateExtendOpen(false);

          toast.error(response.data.message);
        } else {
          setDateExtendOpen(false);
          toast.success(response.data.message);
          setTimeout(() => location.reload(), 1000);

          setCommentss("");
          setReqDate(null);
          setTask({
            ...task,
            activeDateUpdateRequest: 1,
          });
        }
      })
      .catch((err) => {
        setDateExtendOpen(false);
        toast.error("Some error occured");
      });
  };

  return (
    <div className="w-full">
      <DateExtend
        dateExtendopen={dateExtendopen}
        handlehandledateExtendClose={handlehandledateExtendClose}
        task={task}
        ShowTask={ShowTask}
        formatDates={formatDates}
        setCommentss={setCommentss}
        AdapterDateFns={AdapterDateFns}
        reqDate={reqDate}
        setReqDate={setReqDate}
        dueDateValidation={dueDateValidation}
        setDueDateValidation={setDueDateValidation}
        commentss={commentss}
        dueDateCommentValidation={dueDateCommentValidation}
        setDueDateCommentValidation={setDueDateCommentValidation}
        handleSubmits={handleSubmits}
      />
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
      <AuditModal
        open={openAuditComment}
        handleClose={() => {
          setOpenAuditComment(false), setErrors({});
        }}
        handleSubmit={handelAuditCommentSubmit}
        errors={errors}
        setErrors={setErrors}
        auditData={auditData}
        onChange={(name, value) => {
          setAuditData((prev) => ({ ...prev, [name]: value })),
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: "",
            }));
        }}
      />
      <AuditListModal
        open={openAudit}
        handleClose={() => setOpenAudit(false)}
        auditData={currentAudit}
        onAddAudit={openAudit}
      />

      <DocumentModal
        step={1}
        open={open}
        handleModalClose={handleClose}
        listDocument={listDocument}
        handelDetailDoc={handelDetailDoc}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        selectedDocument={selectedDocument}
        formatDate={formatDate}
        documenDowToken={documenDowToken}
      />

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
                          {lastActCode?.canEdit && (
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
                          {detail?.taskDateUpdates.length !== 0 &&
                            lastActCode?.canEdit &&
                            (!detail.taskDateUpdates[
                              detail.taskDateUpdates.length - 1
                            ]?.approvedComments ? (
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handledateExtendopen(e, detail, "true");
                                }}
                              >
                                <FuseSvgIcon
                                  className="text-48"
                                  size={24}
                                  color="red"
                                >
                                  heroicons-outline:calendar
                                </FuseSvgIcon>
                              </Button>
                            ) : (
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handledateExtendopen(e, detail, "false");
                                }}
                              >
                                <FuseSvgIcon
                                  className="text-48"
                                  size={24}
                                  color="action"
                                >
                                  heroicons-outline:calendar
                                </FuseSvgIcon>
                              </Button>
                            ))}
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
                                  {documentCounts[msg.id] ? (
                                    documentCounts[msg.id] != 0 && (
                                      <button
                                        className="icon-button"
                                        onClick={() => handleOpen(msg.id)}
                                        style={{
                                          top: "-6px",
                                          right: "0px",
                                        }}
                                      >
                                        <FuseSvgIcon size={20}>
                                          heroicons-solid:document
                                        </FuseSvgIcon>
                                        {documentCounts[msg.id] != 0 && (
                                          <span
                                            className="count"
                                            style={{
                                              backgroundColor: "black",
                                            }}
                                          >
                                            {documentCounts[msg.id]}
                                          </span>
                                        )}
                                      </button>
                                    )
                                  ) : (
                                    <></>
                                  )}
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
                                          {msg.approvalStatus === 3
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
                                        onChange={(e) => {
                                          setComments(e.target.value);
                                          if (e.target.value.trim() !== "") {
                                            setErrorMessage(""); // Clear error message on input change
                                          }
                                        }}
                                        label="Reason For Change*"
                                        className="mt-5"
                                      />
                                      {errorMessage && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errorMessage}
                                        </div>
                                      )}
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
                                    disabled={isButtonDisabled}
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
                                    disabled={isButtonDisabled}
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
