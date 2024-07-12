import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
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

const OrgImplementation = ({
  impDetails,
  appActivity,
  appActions,
  lastActCode,
  currentActivityForm,
  orgEvaluationId,
}) => {
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
  const [expanded, setExpanded] = useState(null);
  const [impComments, setImpComments] = useState([]);
  const [comments, setComments] = useState("");
  const [openAudit, setOpenAudit] = useState(false);
  const [openAuditComment, setOpenAuditComment] = useState(false);
  const handleCloseAudit = () => setOpenAudit(false);
  const handleCloseAuditComment = () => setOpenAuditComment(false);
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
    }));
  };
  const handleAddAuditComment = (e) => {
    const { name, value } = e.target;
    setAuditData((prevState) => ({
      ...prevState,
      comments: value,
    }));
  };

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

  const handelComments = (e, taskid) => {
    apiAuth
      .get(`ChangeImpact/ListTaskCommentst?id=${taskid}`)
      .then((resp) => {
        const comments = resp.data.data;
        setImpComments(comments);
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
    apiAuth
      .post(`/OrgMoc/ImplementationSubmit/${orgEvaluationId}`, {
        activityUID: appActivity.uid,
        actionUID: uid,
        formUID: appActivity.formUID,
      })
      .then((response) => {
        toast.success("MOC successfully closed");
        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        toast.success("Some Error Occured");
      });
  };

  return (
    <div className="w-full">
      <ToastContainer className="toast-container" />
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
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full justify-between">
              <h2 className="text-2xl font-semibold">Implementation</h2>
            </div>
          </div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
            style={{ marginTop: "10px" }}
          >
            <div className="flex items-center">
              <h2
                _ngcontent-fyk-c288=""
                class="text-2xl font-semibold"
                style={{ marginRight: "15px" }}
              >
                {impDetails.length} Tasks
              </h2>
            </div>

            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{
                marginBottom: "15px",
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
          {impDetails.map((detail, index) => (
            <Accordion
              key={detail.id}
              expanded={expanded === detail.id}
              sx={{
                mt: 2,
                minHeight: "70px",
                transition: "height 0.3s",
                "&.Mui-expanded": {
                  minHeight: "100px",
                },
                "@media (max-width: 600px)": {
                  mt: 4,
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
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "17%" }}
                >
                  <div className="flex items-center">Task #{detail.id}</div>
                </div>

                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "17%" }}
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
                  style={{ width: "17%" }}
                >
                  <div className="flex items-center">No Risks</div>
                </div>
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "17%" }}
                >
                  <div className="flex items-center">
                    {detail.assignedStaff}
                  </div>
                </div>

                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "17%" }}
                >
                  <div className="flex items-center">
                    {formatDate(detail.dueDate)}
                  </div>
                </div>
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "17%" }}
                >
                  <div className="flex items-center">
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
                      onClick={() => handelOpenAudit(detail.audits, "")}
                    >
                      Audits
                    </Button>
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
                      {detail?.particularName && detail?.particularSubName && (
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
                      <div>&nbsp;</div>
                      <div className="flex items-center justify-center my-3">
                        <div className="flex-auto border-b"></div>
                        <div
                          className="flex-0 "
                          style={{ fontSize: "xx-small" }}
                        >
                          <b>{detail?.assignedByStaff}</b> has assigned task to{" "}
                          <b>{detail?.assignedStaff}</b> on{" "}
                          {formatDate(detail.assignedAt)}
                        </div>
                        <div className="flex-auto border-b"></div>
                      </div>
                      <div>&nbsp;</div>
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
                              style={{ position: "relative" }}
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
                              <button
                                className="icon-button"
                                onClick={() => handleOpen(msg.id)}
                                style={{
                                  top: "-15px",
                                  right: "-20px",
                                }}
                              >
                                <FuseSvgIcon size={20}>
                                  heroicons-solid:document
                                </FuseSvgIcon>
                                <span className="count"></span>
                              </button>
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
                          <div>&nbsp;</div>

                          <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
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
                                onClick={(e) => handelApproveImpl(e, detail)}
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
          {currentActivityForm.canEdit && (
            <>
              <div>&nbsp;</div>
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
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default OrgImplementation;
