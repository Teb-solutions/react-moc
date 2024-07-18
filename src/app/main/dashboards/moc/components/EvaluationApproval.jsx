import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import SearchIcon from "@mui/icons-material/Search";
import Chart from "react-apexcharts";
import { useState } from "react";
import { apiAuth } from "src/utils/http";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { ToastContainer, toast } from "react-toastify";
const EvaluationApproval = ({
  contentDetails,
  showRiskAnalysisChart,
  riskAnalysisChartOptions,
  assetEvaluationId,
  lastActCode,
  AppActivity,
  AppActions,
  remarkRequest,
  setRemarkRequest,
  handleStepChange,
  setContent,
}) => {
  const [reviewed, setReviewed] = useState({});
  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [dateExtendopen, setDateExtendOpen] = useState(false);
  const handlehandledateExtendClose = () => setDateExtendOpen(false);
  const [selectedStaff, setSelectedStaff] = useState([]);

  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [staff, setStaff] = useState([]);

  const [newRemark, setNewRemark] = useState("");
  const [newImpactTaskRemark, setNewImpactTaskRemark] = useState("");

  const handleInputChange = (event, type) => {
    if (type === "Consultaion") {
      setNewRemark(event.target.value);
    } else if (type === "ImpactTask") {
      setNewImpactTaskRemark(event.target.value);
    }
  };
  const handleRemarkChange = (index, event) => {
    const updatedRemarks = [...remarkRequest];
    updatedRemarks[index].remark = event.target.value;
    setRemarkRequest(updatedRemarks);
  };
  const getRecords = async () => {
    try {
      const resp = await apiAuth.get(
        `/ApprovalManager/RemarksbyRequest/${AppActivity.uid}`
      );
      setRemarkRequest(resp.data.data);
      apiAuth
        .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
        .then((resp) => {
          setContent(resp.data.data.phases);
        });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };
  useEffect(() => {
    getRecords();
  }, []);
  const handleSaveClick = (type) => {
    const remark = type === "Consultaion" ? newRemark : newImpactTaskRemark;
    const payload = {
      activityId: AppActivity.uid,
      remark: remark,
      activityCode: lastActCode.code,
      evaluationType: type,
      version: lastActCode.version,
    };
    apiAuth
      .post(`/ApprovalManager/CreateComment/${assetEvaluationId}/0`, payload)
      .then((resp) => {
        if (type == "Consultaion") {
          toast.success("Consultation comment added.");
        } else {
          toast.success("Task comment added.");
        }
        setNewRemark("");
        setNewImpactTaskRemark("");
        getRecords();
      });

    console.log(payload, "payyy");
  };
  const handleUpdateClick = (index, id) => {
    const payload = {
      activityId: remarkRequest[index].activityId,
      remark: remarkRequest[index].remark,
      activityCode: remarkRequest[index].activityCode,
      evaluationType: remarkRequest[index].evaluationTypeString,
      version: remarkRequest[index].version,
    };

    apiAuth
      .post(
        `/ApprovalManager/CreateComment/${assetEvaluationId}/${id}`,
        payload
      )
      .then((response) => {
        if (response.status === 200) {
          const updatedRemarks = [...remarks];
          updatedRemarks[index] = response.data.data[index];
          // setRemarks(updatedRemarks);
        }
      })
      .catch((error) => {
        console.error("Error updating the remark:", error);
      });
  };
  const handleStaffChange = (event) => {
    setSelectedStaff(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handledateExtendopen = (e) => {
    e.preventDefault();
    apiAuth.get(`/Staff/LOV`).then((resp) => {
      setStaff(resp.data.data);
    });
    setDateExtendOpen(true);
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "55%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "1px",
  };
  const [expanded, setExpanded] = useState(false);
  const [clickedTasks, setClickedTasks] = useState({});

  const handelCommentImp = (id, rwid, value) => {
    debugger;
    if (value == 1) {
      apiAuth
        .put(
          `/ChangeEvaluationConsultation/AddReview/${id}/${lastActCode.code}/0`,
          {
            remark: handelCommentRemark,
          }
        )
        .then((resp) => {
          toast.success("Review successfully added");
          setHandelCommentRemark("");
          handleStepChange();
        });
    } else {
      apiAuth
        .put(
          `/ChangeEvaluationConsultation/AddReview/${id}/${lastActCode.code}/${rwid}`,
          {
            remark: handelCommentRemark,
          }
        )
        .then((resp) => {
          toast.success("Review successfully updated");
          setHandelCommentRemark("");
          handleStepChange();
        });
    }
  };

  const handelImpactCommentImp = (id, value) => {
    apiAuth
      .put(`/Task/AddReview/${id}/${lastActCode.code}`, {
        remark: handelCommentRemark,
      })
      .then((resp) => {
        if (value == 1) {
          toast.success("Review successfully added");
        } else {
          toast.success("Review successfully Updated");
        }
        setHandelCommentRemark("");
        handleStepChange();
      });
  };

  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const isMyComment = (comment) => {
    return comment.isCreatedByMe;
  };
  console.log(AppActivity, "AppActivity");
  const formatDatess = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const handelreview = (id) => {
    debugger;
    apiAuth
      .put(`/SummaryDetails/ConsultationReviewStatus/${assetEvaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        toast.success("Successfully marked the item as reviewed");
        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        setClickedTasks((prevClickedTasks) => ({
          ...prevClickedTasks,
          [id]: true,
        }));
        console.log(response);
      });
  };

  const handelImpactreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/TaskReviewStatus/${assetEvaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        toast.success("Successfully marked the item as reviewed");

        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        setClickedTasks((prevClickedTasks) => ({
          ...prevClickedTasks,
          [id]: true,
        }));
        console.log(response);
      });
  };

  const handleCheckboxChange = (isChecked, taskDetails) => {
    if (isChecked) {
      const updatedTasks = [...selectedTasks, taskDetails];
      setSelectedTasks(updatedTasks);

      // Show send popup when first checkbox is checked
      if (updatedTasks.length === 1) {
        setShowSendPopup(true);
      }
    } else {
      // Remove task from selectedTasks if unchecked
      const filteredTasks = selectedTasks.filter(
        (task) => task.id !== taskDetails.id
      );
      setSelectedTasks(filteredTasks);

      // Hide send popup if no tasks are selected
      if (filteredTasks.length === 0) {
        setShowSendPopup(false);
      }
    }
  };

  const sendSelectedTasks = () => {
    // Implement your logic to send selectedTasks array to an API or perform an action
    console.log("Sending selected tasks:", selectedTasks);
    // Reset selectedTasks array after sending
    setSelectedTasks([]);
    // Hide send popup
    setShowSendPopup(false);
  };

  const handleSubmit = () => {
    const taskIds = selectedTasks.map((task) => task.id);
    // Prepare payload in the required format
    const payload = {
      comments: comments,
      team: selectedStaff,
      Task: taskIds, // Assuming Task ID is fixed or derived from another source
      emails: email,
      ActivityCode: lastActCode?.code,
      Version: lastActCode?.version,
    };
    console.log(payload, "payload");

    apiAuth
      .put(`/SummaryDetails/SendComment/${assetEvaluationId}`, payload)
      .then((response) => {
        toast.success(
          "Selected tasks successfully sent for external consultation"
        );
        handlehandledateExtendClose();
      });
  };

  const SubmitApprovelCreate = (e, btuid, btname, bttype) => {
    const payload = {
      activityId: AppActivity.uid,
      actionType: bttype,
      actionUid: btuid,
      actionUID: btuid,
      actionName: btname,
      formUID: AppActivity.formUID,
      formType: AppActivity.form,
      version: AppActivity.version,
      remark: null,
      taskscomment: null,
      consultaioncomment: null,
      activityCode: AppActivity.code,
    };
    apiAuth
      .post(`/ApprovalManager/Create/${assetEvaluationId}`, payload)
      .then((response) => {
        getRecords();
      });
  };

  return (
    <div className="w-full h-full">
      <ToastContainer className="toast-container" />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={dateExtendopen}
        onClose={handlehandledateExtendClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={dateExtendopen}>
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
              Send for external consultation
            </Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
              <Grid container spacing={2} className="mt-5">
                <Grid item xs={12}>
                  <Table
                    className="mat-elevatio demo-table col-span-12 mt-0 w-full"
                    sx={{ width: "100%" }}
                  >
                    <TableHead
                      sx={{
                        borderBottom: "2px solid silver",
                        fontSize: "medium",
                      }}
                    >
                      <TableRow>
                        <TableCell className="text-left pb-3">Impact</TableCell>
                        <TableCell className="text-left pb-3">
                          What is the task
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          How is the task done
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Task Deadline
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Task Assigned To
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Due Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTasks?.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.impact}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.task}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.how}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.deadline}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.assignedTo}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.dueDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div>&nbsp;</div>
                  <Grid item xs={12} className="mt-5">
                    <FormControl fullWidth sx={{ flexGrow: 1 }}>
                      <InputLabel id="staff-label">Select Staff</InputLabel>
                      <Select
                        labelId="staff-label"
                        id="staff-select"
                        multiple
                        value={selectedStaff}
                        onChange={handleStaffChange}
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {selected.map((value) => (
                              <div key={value}>
                                <ListItemText
                                  primary={
                                    staff.find(
                                      (staffMember) =>
                                        staffMember.value === value
                                    )?.text
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {staff.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Checkbox
                              checked={selectedStaff.indexOf(option.value) > -1}
                            />
                            <ListItemText primary={option.text} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="mt-5"
                    style={{ marginTop: "10px" }}
                  >
                    <TextField
                      label="Email"
                      multiline
                      rows={1}
                      fullWidth
                      required
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="mt-5"
                    style={{ marginTop: "10px" }}
                  >
                    <TextField
                      label="Comments"
                      multiline
                      rows={1}
                      fullWidth
                      required
                      value={comments}
                      onChange={handleCommentsChange}
                    />
                  </Grid>
                  <div
                    className="mt-5"
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <div>
                      <Button
                        variant="contained"
                        style={{ color: "white", backgroundColor: "blue" }}
                        onClick={handleSubmit}
                      >
                        Send Email
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          display: showSendPopup ? "flex" : "none",
          justifyContent: "end",
          color: "white",
        }}
      >
        <button
          onClick={handledateExtendopen}
          style={{
            backgroundColor: "blue",
            padding: "10px",
            borderRadius: "20px",
          }}
        >
          Send selected {selectedTasks.length} task(s) for external consultation
        </button>
      </div>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
          <div>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full  border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                Summary Details
              </h2>
            </div>
            <div _ngcontent-fyk-c288="" class="px-6 mb-6 ng-star-inserted">
              <div>&nbsp;</div>
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Request No{" "}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.requestNo}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Initiator
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.initiatorName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Initiated On
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {formatDates(contentDetails?.requestDate)}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Type{" "}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.requestTypeName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Expense Nature
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.expenseNature}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Expense Type
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.expenseType}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Change Type
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.changeType}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Project Value
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.projectValue}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Date of termination of change
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {formatDates(contentDetails?.changeTerminationDate)}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Project Description
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.projectDescription}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>

              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Location of change
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetails?.changeLocationString}
                </div>

                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Change Benefits
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.changeBenefits}
                  </div>
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div className="flex items-center w-full border-b justify-between">
            <h2 className="text-2xl font-semibold">Change Evaluation Team</h2>
          </div>
          <div className="evaluation-team-container grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentDetails?.evaluationTeam?.map((list, index) => (
              <div
                className="inventory-grid grid items-center gap-4 py-3 px-2"
                key={index}
              >
                <div
                  className="flex items-center"
                  style={{ marginTop: "15px" }}
                >
                  <img
                    src="/assets/images/etc/userpic.png"
                    alt="Card cover image"
                    className="rounded-full mr-4"
                    style={{ width: "4rem", height: "4rem" }}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold leading-none">
                      {list.staffName}
                    </span>
                    <span className="text-sm text-secondary leading-none pt-5">
                      {list?.roleName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">Stake Holders</h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "15px" }}
              //   value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: "0px" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          {contentDetails?.consultaion?.map((itm) => (
            <div>
              <div className="flex items-center" style={{ marginTop: "15px" }}>
                <img
                  src="/assets/images/etc/userpic.png"
                  alt="Card cover image"
                  className="rounded-full mr-4"
                  style={{ width: "3.5rem", height: "3.5rem" }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold leading-none">
                    {itm?.staff}
                  </span>
                  <span className="text-sm text-secondary leading-none pt-5">
                    Consulted On {formatDates(itm?.consultedDate)}
                  </span>
                </div>
                {itm.requestTypeName != "Document" && AppActivity.canEdit && (
                  <div className="task-button ml-auto">
                    <button
                      className="task-mark-reviewed-button mat-stroked-button"
                      onClick={() => handelreview(itm.id)}
                      disabled={itm?.reviewd || clickedTasks[itm.id]}
                    >
                      {itm?.reviewd || clickedTasks[itm.id] ? (
                        <span
                          className="mat-button-wrapper"
                          style={{
                            backgroundColor: "rgba(220,252,231)",
                          }}
                        >
                          You have reviewed this just now
                        </span>
                      ) : (
                        <span className="mat-button-wrapper">
                          Click here to mark as reviewed
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center" style={{ marginTop: "10px" }}>
                <h5> {itm?.remark}</h5>
              </div>
              <div className="mt-5" style={{ marginTop: "20px" }}>
                <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                  Task Added
                </span>

                <span className="task-detail-value">{itm.tasks[0]}</span>
              </div>
              <div>&nbsp;</div>

              {itm.reviews.length > 0 ? (
                <div>
                  <Accordion
                    expanded={expanded == itm.id}
                    onChange={handleExpansionChange(itm.id)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        <span className="text-brown">
                          {itm?.reviews?.length} Review
                        </span>{" "}
                        {hasAddedComment(itm.reviews) && (
                          <span className="text-green">
                            (You have added 1 review)
                          </span>
                        )}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {AppActivity.canEdit && !hasAddedComment(itm.reviews) && (
                        <div className="mat-form-field-wrapper">
                          <div className="mat-form-field-flex">
                            <img
                              src="/assets/images/etc/userpic.png"
                              alt="Card cover image"
                              className="rounded-full mr-4"
                              style={{
                                width: "5rem",
                                height: "5rem",
                              }}
                            />
                            <div className="mat-form-field-infix">
                              <textarea
                                rows="2"
                                className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                placeholder="Write a comment..."
                                id="ImpTaskReview265"
                                data-placeholder="Write a comment..."
                                aria-invalid="false"
                                aria-required="false"
                                style={{ height: "36px" }}
                                onChange={(e) =>
                                  setHandelCommentRemark(e.target.value)
                                }
                              ></textarea>
                              <button
                                className="mat-focus-indicator mat-raised-button mat-button-base"
                                style={{ float: "right" }}
                                onClick={() => `handelCommentImp`(itm.id, 1, 1)}
                              >
                                <span className="mat-button-wrapper">Save</span>
                                <span className="mat-ripple mat-button-ripple"></span>
                                <span className="mat-button-focus-overlay"></span>
                              </button>
                              <span className="mat-form-field-label-wrapper"></span>
                            </div>
                          </div>

                          <div className="mat-form-field-subscript-wrapper">
                            <div
                              className="mat-form-field-hint-wrapper"
                              style={{
                                opacity: 1,
                                transform: "translateY(0%)",
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {itm?.reviews?.map((rwv, index) => (
                        <div className="mat-form-field-wrapper" key={index}>
                          <div className="mat-form-field-flex">
                            <img
                              src="/assets/images/etc/userpic.png"
                              alt="Card cover image"
                              className="rounded-full mr-4"
                              style={{
                                width: "3rem",
                                height: "3rem",
                              }}
                            />

                            {AppActivity.canEdit && isMyComment(rwv) ? (
                              <div className="mat-form-field-infix">
                                <textarea
                                  rows="2"
                                  className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                  placeholder="Write a comment..."
                                  id="ImpTaskReview265"
                                  data-placeholder="Write a comment..."
                                  aria-invalid="false"
                                  aria-required="false"
                                  style={{ height: "36px" }}
                                  defaultValue={rwv.remark}
                                  onChange={(e) =>
                                    setHandelCommentRemark(e.target.value)
                                  }
                                ></textarea>

                                <button
                                  className="mat-focus-indicator mat-raised-button mat-button-base"
                                  style={{ float: "right" }}
                                  onClick={() =>
                                    handelCommentImp(
                                      itm.id,
                                      itm.reviews[1].id,

                                      2
                                    )
                                  }
                                >
                                  <span className="mat-button-wrapper">
                                    Update
                                  </span>

                                  <span className="mat-ripple mat-button-ripple"></span>
                                  <span className="mat-button-focus-overlay"></span>
                                </button>

                                <span className="mat-form-field-label-wrapper"></span>
                              </div>
                            ) : (
                              <div className="mat-form-field-infix">
                                <span className="">
                                  {rwv?.createdByStaffName + "55"}
                                </span>
                                &nbsp;&nbsp;
                                <span
                                  className="text-gray"
                                  style={{ fontSize: "10px" }}
                                >
                                  {rwv?.remark}
                                </span>
                              </div>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "x-small",
                              paddingLeft: "35px",
                            }}
                          >
                            {" "}
                            {itm.reviews[0]?.updatedAt &&
                              new Date(
                                itm.reviews[0]?.updatedAt
                              ).toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                hour12: true,
                                timeZoneName: "short",
                              })}
                          </span>
                          <div className="mat-form-field-subscript-wrapper">
                            <div
                              className="mat-form-field-hint-wrapper"
                              style={{
                                opacity: 1,
                                transform: "translateY(0%)",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </div>
              ) : (
                <div className="mat-form-field-wrapper">
                  <div className="mat-form-field-flex">
                    <img
                      src="/assets/images/etc/userpic.png"
                      alt="Card cover image"
                      className="rounded-full mr-4"
                      style={{
                        width: "5rem",
                        height: "5rem",
                      }}
                    />
                    <div className="mat-form-field-infix">
                      <textarea
                        rows="2"
                        className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                        placeholder="Write a comment..."
                        id="ImpTaskReview265"
                        data-placeholder="Write a comment..."
                        aria-invalid="false"
                        aria-required="false"
                        style={{ height: "36px" }}
                        onChange={(e) => setHandelCommentRemark(e.target.value)}
                      ></textarea>
                      <button
                        className="mat-focus-indicator mat-raised-button mat-button-base"
                        style={{ float: "right" }}
                        onClick={() => handelCommentImp(itm.id, 1, 1)}
                      >
                        <span className="mat-button-wrapper">Save</span>
                        <span className="mat-ripple mat-button-ripple"></span>
                        <span className="mat-button-focus-overlay"></span>
                      </button>
                      <span className="mat-form-field-label-wrapper"></span>
                    </div>
                  </div>

                  <div className="mat-form-field-subscript-wrapper">
                    <div
                      className="mat-form-field-hint-wrapper"
                      style={{
                        opacity: 1,
                        transform: "translateY(0%)",
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Paper>
      </SwipeableViews>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">Evaluation Impacts</h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "15px" }}
              //   value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: "0px" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          {showRiskAnalysisChart && (
            <div id="chart" class="mb-2 mt-2 p-2">
              <Chart
                options={{
                  ...riskAnalysisChartOptions,
                  annotations: riskAnalysisChartOptions.annotations || {},
                  dataLabels: riskAnalysisChartOptions.dataLabels || {},
                  grid: riskAnalysisChartOptions.grid || {},
                  stroke: riskAnalysisChartOptions.stroke || {},
                  title: riskAnalysisChartOptions.title || {},
                  xaxis: riskAnalysisChartOptions.xaxis || {},
                }}
                series={riskAnalysisChartOptions.series || []}
                type={riskAnalysisChartOptions.chart.type || "scatter"}
                height={riskAnalysisChartOptions.chart.height || 350}
              />
            </div>
          )}
          {contentDetails?.tasklist?.map((imptsk) => (
            <>
              <table className="task-table mat-table">
                <thead
                  className="task-table-header"
                  style={{ display: "none" }}
                >
                  {/* Empty header */}
                </thead>
                <tbody className="task-table-body">
                  <tr className="task-table-row mat-row">
                    <td className="task-table-cell mat-cell">
                      <div className="task-header flex items-center">
                        <div className="task-id flex flex-col">
                          <span
                            className="task-id-text font-semibold text-xl leading-none"
                            style={{ fontSize: "20px" }}
                          >
                            Task #{imptsk?.id}
                          </span>
                        </div>
                        {AppActivity.canEdit && (
                          <div className="task-button ml-auto">
                            <button
                              className="task-mark-reviewed-button mat-stroked-button"
                              onClick={() => handelImpactreview(imptsk.id)}
                              disabled={
                                imptsk?.reviewd || clickedTasks[imptsk.id]
                              }
                            >
                              {imptsk?.reviewd || clickedTasks[imptsk.id] ? (
                                <span
                                  className="mat-button-wrapper"
                                  style={{
                                    backgroundColor: "rgba(220,252,231)",
                                  }}
                                >
                                  You have reviewed this just now
                                </span>
                              ) : (
                                <span className="mat-button-wrapper">
                                  Click here to mark as reviewed
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="task-details px-6 mt-2">
                        <div className="task-detail prose prose-sm max-w-5xl">
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              Impact
                            </span>
                            <span className="task-detail-value">
                              {imptsk.particularName +
                                ">" +
                                imptsk.particularSubName}
                            </span>
                          </div>
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              What is Task
                            </span>
                            <span className="task-detail-value">
                              {imptsk.actionWhat}
                            </span>
                          </div>
                          <div className="task-detail-item mt-5">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              How is Task done
                            </span>
                            <span className="task-detail-value">
                              {imptsk.actionHow}
                            </span>
                          </div>
                          <div
                            className="task-detail-item mt-5 flex "
                            style={{ justifyContent: "space-between" }}
                          >
                            <div>
                              <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                Assigned to
                              </span>
                              <span className="task-detail-value">
                                {imptsk.assignedStaff}
                              </span>
                              <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                                Due Date
                              </span>
                              <span className="task-detail-value">
                                {formatDates(imptsk.dueDate)}
                              </span>
                              <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                                Deadline
                              </span>
                              <span className="task-detail-value">
                                {imptsk?.deadlineDisplay}
                              </span>
                            </div>
                            <div>
                              {AppActivity.canEdit && (
                                <div style={{ float: "right" }}>
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              e.target.checked,
                                              {
                                                id: imptsk.id,
                                                impact:
                                                  imptsk.particularName +
                                                  ">" +
                                                  imptsk.particularSubName,
                                                task: imptsk.actionWhat,
                                                how: imptsk.actionHow,
                                                assignedTo:
                                                  imptsk.assignedStaff,
                                                dueDate: formatDates(
                                                  imptsk.dueDate
                                                ),
                                                deadline:
                                                  imptsk.deadlineDisplay,
                                                taskId: imptsk?.id,
                                              }
                                            )
                                          }
                                          id="check289-input"
                                          inputProps={{
                                            "aria-label": "primary checkbox",
                                          }}
                                          color="primary"
                                        />
                                      }
                                      label="Need External Consultation"
                                    />
                                  </FormGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {imptsk?.riskAnalysisList?.length !== 0 && (
                          <Paper style={{ margin: "10px" }}>
                            <div
                              _ngcontent-fyk-c288=""
                              class="flex items-center w-full   justify-between"
                              style={{
                                borderRadius: "20px",
                                backgroundColor: "rgb(241 248 255)",
                              }}
                            >
                              <h6
                                _ngcontent-fyk-c288=""
                                class="text-small font-semibold"
                                style={{ padding: "15px" }}
                              >
                                Risk Details
                              </h6>
                              <h6
                                _ngcontent-fyk-c288=""
                                class="text-1xl font-semibold"
                                style={{ padding: "10px" }}
                              >
                                Human Measures
                              </h6>
                              <h6
                                _ngcontent-fyk-c288=""
                                class="text-1xl font-semibold"
                                style={{ padding: "10px" }}
                              >
                                Technical Measures
                              </h6>
                              <h6
                                _ngcontent-fyk-c288=""
                                class="text-1xl font-semibold"
                                style={{ padding: "10px" }}
                              >
                                ORGANISATIONAL MEASURES
                              </h6>
                            </div>
                            <div>
                              <table className="min-w-full divide-y divide-gray-200">
                                <tbody>
                                  {contentDetails?.riskAnalysisList.map(
                                    (riskAnalysis, pIndex) => (
                                      <React.Fragment key={riskAnalysis.id}>
                                        {riskAnalysis.riskAnalysisSubTasks.map(
                                          (subTask, lIndex) => (
                                            <React.Fragment key={subTask.id}>
                                              {subTask.riskAnalysisHazardTypes
                                                .length > 0 ? (
                                                subTask.riskAnalysisHazardTypes.map(
                                                  (hazardType, mIndex) =>
                                                    hazardType.riskAnalysisHazardSituation.map(
                                                      (situation, fIndex) => (
                                                        <tr
                                                          key={situation.id}
                                                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                        >
                                                          <td
                                                            className="px-4 py-4"
                                                            style={{
                                                              width: "30%",
                                                            }}
                                                          >
                                                            <div
                                                              // className={`rounded text-white p-2 py-1 px-3 mb-1 inline-flex text-center text-sm font-semibold leading-2 `}
                                                              style={{
                                                                backgroundColor:
                                                                  situation.residualRiskClassificationDisplay ===
                                                                  "HighRisk"
                                                                    ? "red"
                                                                    : situation.residualRiskClassificationDisplay ===
                                                                        "LowRisk"
                                                                      ? "yellow"
                                                                      : situation.residualRiskClassificationDisplay ===
                                                                          "AverageRisk"
                                                                        ? "orange"
                                                                        : situation.residualRiskClassificationDisplay ===
                                                                            "SignificantRisk"
                                                                          ? "purple"
                                                                          : "green",
                                                                width: "35%",
                                                                padding: "3px",
                                                                color:
                                                                  situation.residualRiskClassificationDisplay ===
                                                                  "LowRisk"
                                                                    ? "#000"
                                                                    : "white",
                                                                borderRadius:
                                                                  "5px",
                                                                textAlign:
                                                                  "center",
                                                                fontSize:
                                                                  "12px",
                                                                fontWeight:
                                                                  situation.residualRiskClassificationDisplay ===
                                                                  "LowRisk"
                                                                    ? ""
                                                                    : "bold",
                                                              }}
                                                            >
                                                              {
                                                                situation.residualRiskClassificationDisplay
                                                              }
                                                            </div>
                                                            <div className="font-semibold">
                                                              {
                                                                subTask.subTaskName
                                                              }
                                                            </div>
                                                            <div>
                                                              -{" "}
                                                              {
                                                                hazardType.hazardTypeDisplay
                                                              }
                                                            </div>
                                                            <div>
                                                              -{" "}
                                                              {
                                                                situation.hazardousSituation
                                                              }
                                                            </div>
                                                          </td>
                                                          <td className="px-4 py-4">
                                                            {
                                                              situation.humanControlMeasure
                                                            }
                                                          </td>
                                                          <td className="px-4 py-4">
                                                            {
                                                              situation.technicalControlMeasure
                                                            }
                                                          </td>
                                                          <td className="px-4 py-4">
                                                            {
                                                              situation.organisationalControlMeasure
                                                            }
                                                          </td>
                                                        </tr>
                                                      )
                                                    )
                                                )
                                              ) : (
                                                <tr
                                                  key={subTask.id}
                                                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                  <td className="px-4 py-4">
                                                    <div className="font-semibold">
                                                      {subTask.subTaskName}
                                                    </div>
                                                    <div className="text-red-800 mt-1 text-sm font-semibold leading-2">
                                                      Risk analysis not done
                                                    </div>
                                                  </td>
                                                  <td className="px-4 py-4">
                                                    -
                                                  </td>
                                                  <td className="px-4 py-4">
                                                    -
                                                  </td>
                                                  <td className="px-4 py-4">
                                                    -
                                                  </td>
                                                </tr>
                                              )}
                                            </React.Fragment>
                                          )
                                        )}
                                      </React.Fragment>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </Paper>
                        )}
                        <div>&nbsp;</div>

                        {imptsk.changeImpactTaskReviews.length > 0 ? (
                          <div>
                            <Accordion
                              expanded={expanded == imptsk.id}
                              onChange={handleExpansionChange(imptsk.id)}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>
                                  <span className="text-brown">
                                    {imptsk?.changeImpactTaskReviews?.length}{" "}
                                    Reviews
                                  </span>{" "}
                                  {hasAddedComment(
                                    imptsk.changeImpactTaskReviews
                                  ) && (
                                    <span className="text-green">
                                      (You have added 1 review)
                                    </span>
                                  )}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {AppActivity.canEdit &&
                                  !hasAddedComment(
                                    imptsk.changeImpactTaskReviews
                                  ) && (
                                    <div className="mat-form-field-wrapper">
                                      <div className="mat-form-field-flex">
                                        <img
                                          src="/assets/images/etc/userpic.png"
                                          alt="Card cover image"
                                          className="rounded-full mr-4"
                                          style={{
                                            width: "5rem",
                                            height: "5rem",
                                          }}
                                        />
                                        <div className="mat-form-field-infix">
                                          <textarea
                                            rows="2"
                                            className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                            placeholder="Write a comment..."
                                            id="ImpTaskReview265"
                                            data-placeholder="Write a comment..."
                                            aria-invalid="false"
                                            aria-required="false"
                                            style={{ height: "36px" }}
                                            onChange={(e) =>
                                              setHandelCommentRemark(
                                                e.target.value
                                              )
                                            }
                                          ></textarea>
                                          <button
                                            className="mat-focus-indicator mat-raised-button mat-button-base"
                                            style={{ float: "right" }}
                                            onClick={() =>
                                              handelImpactCommentImp(
                                                imptsk.id,
                                                1
                                              )
                                            }
                                          >
                                            <span className="mat-button-wrapper">
                                              Save
                                            </span>
                                            <span className="mat-ripple mat-button-ripple"></span>
                                            <span className="mat-button-focus-overlay"></span>
                                          </button>
                                          <span className="mat-form-field-label-wrapper"></span>
                                        </div>
                                      </div>

                                      <div className="mat-form-field-subscript-wrapper">
                                        <div
                                          className="mat-form-field-hint-wrapper"
                                          style={{
                                            opacity: 1,
                                            transform: "translateY(0%)",
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                {imptsk.changeImpactTaskReviews?.map((rwx) => (
                                  <div className="mat-form-field-wrapper">
                                    <div className="mat-form-field-flex">
                                      <img
                                        src="/assets/images/etc/userpic.png"
                                        alt="Card cover image"
                                        className="rounded-full mr-4"
                                        style={{
                                          width: "3rem",
                                          height: "3rem",
                                        }}
                                      />
                                      {AppActivity.canEdit &&
                                      isMyComment(rwx) ? (
                                        <div className="mat-form-field-infix">
                                          <textarea
                                            rows="2"
                                            className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                            placeholder="Write a comment..."
                                            id="ImpTaskReview265"
                                            data-placeholder="Write a comment..."
                                            aria-invalid="false"
                                            aria-required="false"
                                            style={{ height: "36px" }}
                                            defaultValue={rwx?.remark}
                                            onChange={(e) =>
                                              setHandelCommentRemark(
                                                e.target.value
                                              )
                                            }
                                          ></textarea>

                                          <button
                                            className="mat-focus-indicator mat-raised-button mat-button-base"
                                            style={{ float: "right" }}
                                            onClick={() =>
                                              handelImpactCommentImp(
                                                imptsk.id,
                                                // itm.changeImpactTaskReviews[0]
                                                //   .id,
                                                2
                                              )
                                            }
                                          >
                                            <span className="mat-button-wrapper">
                                              Update
                                            </span>

                                            <span className="mat-ripple mat-button-ripple"></span>
                                            <span className="mat-button-focus-overlay"></span>
                                          </button>

                                          <span className="mat-form-field-label-wrapper"></span>
                                        </div>
                                      ) : (
                                        <div className="mat-form-field-infix">
                                          <span className="">
                                            {rwx?.createdByStaffName}
                                          </span>{" "}
                                          <span className="">
                                            {rwx?.remark}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "x-small",
                                        paddingLeft: "35px",
                                      }}
                                    >
                                      {" "}
                                      {imptsk.changeImpactTaskReviews[0]
                                        ?.updatedAt &&
                                        new Date(
                                          imptsk.changeImpactTaskReviews[0]?.updatedAt
                                        ).toLocaleString("en-US", {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          second: "numeric",
                                          hour12: true,
                                          timeZoneName: "short",
                                        })}
                                    </span>
                                    <div className="mat-form-field-subscript-wrapper">
                                      <div
                                        className="mat-form-field-hint-wrapper"
                                        style={{
                                          opacity: 1,
                                          transform: "translateY(0%)",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ) : (
                          <div className="mat-form-field-wrapper">
                            <div className="mat-form-field-flex">
                              <img
                                src="/assets/images/etc/userpic.png"
                                alt="Card cover image"
                                className="rounded-full mr-4"
                                style={{
                                  width: "5rem",
                                  height: "5rem",
                                }}
                              />
                              <div className="mat-form-field-infix">
                                <textarea
                                  rows="2"
                                  className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                  placeholder="Write a comment..."
                                  id="ImpTaskReview265"
                                  data-placeholder="Write a comment..."
                                  aria-invalid="false"
                                  aria-required="false"
                                  style={{ height: "36px" }}
                                  onChange={(e) =>
                                    setHandelCommentRemark(e.target.value)
                                  }
                                ></textarea>
                                <button
                                  className="mat-focus-indicator mat-raised-button mat-button-base"
                                  style={{ float: "right" }}
                                  onClick={() =>
                                    handelImpactCommentImp(imptsk.id, 1)
                                  }
                                >
                                  <span className="mat-button-wrapper">
                                    Save
                                  </span>
                                  <span className="mat-ripple mat-button-ripple"></span>
                                  <span className="mat-button-focus-overlay"></span>
                                </button>
                                <span className="mat-form-field-label-wrapper"></span>
                              </div>
                            </div>

                            <div className="mat-form-field-subscript-wrapper">
                              <div
                                className="mat-form-field-hint-wrapper"
                                style={{
                                  opacity: 1,
                                  transform: "translateY(0%)",
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot
                  className="task-table-footer"
                  style={{
                    display: "none",
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  {/* Empty footer */}
                </tfoot>
              </table>
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div>
            </>
          ))}
        </Paper>
      </SwipeableViews>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">
              External Consultations for Tasks
            </h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "15px" }}
              //   value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: "0px" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          {contentDetails?.externalconsultations?.map((imptsk) => (
            <>
              <table className="task-table mat-table">
                <thead
                  className="task-table-header"
                  style={{ display: "none" }}
                >
                  {/* Empty header */}
                </thead>
                <tbody className="task-table-body">
                  <tr className="task-table-row mat-row">
                    <td className="task-table-cell mat-cell">
                      <div className="task-header flex items-center">
                        <div className="task-id flex flex-col">
                          <span
                            className="task-id-text font-semibold text-xl leading-none"
                            style={{ fontSize: "20px" }}
                          >
                            Task #{imptsk?.taskIDs}
                          </span>
                          <span
                            className="task-id-text font-semibold leading-none"
                            style={{ font: "menu" }}
                          >
                            Initiated by {imptsk?.createdBy} on{" "}
                            {formatDatess(imptsk?.externalconsultationDate)}
                          </span>
                        </div>
                        <div className="task-button ml-auto">
                          <button className="task-mark-reviewed-button mat-stroked-button">
                            <span className="mat-button-wrapper">
                              {imptsk?.documents == 0
                                ? "No Responses"
                                : `${imptsk?.documents}Responses`}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="task-details px-6 mt-2">
                        <div className="task-detail prose prose-sm max-w-5xl">
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              Staff Email Ids
                            </span>
                            <span className="task-detail-value">
                              {imptsk.staffEmailIDs}
                            </span>
                          </div>
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              External Email Ids
                            </span>
                            <span className="task-detail-value">
                              {imptsk.externalEmailIDs}
                            </span>
                          </div>
                          <div className="task-detail-item">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              Comments
                            </span>
                            <span className="task-detail-value">
                              {imptsk.remark}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot
                  className="task-table-footer"
                  style={{
                    display: "none",
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  {/* Empty footer */}
                </tfoot>
              </table>
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div>
            </>
          ))}
        </Paper>
      </SwipeableViews>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>
          <div className="px-6 sm:px-6 mt-4" style={{ marginTop: "15px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Consultation Comment</TableCell>
                      </TableRow>
                    </TableHead>
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full  border-b justify-between"
                    ></div>
                    {AppActivity.canEdit && (
                      <TableBody>
                        {remarkRequest.map(
                          (remark, index) =>
                            remark.evaluationTypeString === "Consultaion" && (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    id={`tasks-comment-${index}`}
                                    label="Write your task comments..."
                                    multiline
                                    rows={1}
                                    fullWidth
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "auto",
                                      },
                                      "& .MuiInputBase-inputMultiline": {
                                        height: "100px", // Set desired height here
                                      },
                                    }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          position="end"
                                          style={{ height: "90px" }}
                                        >
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            style={{
                                              float: "right",
                                              backgroundColor: "blue",
                                              marginBottom: "3px",
                                            }}
                                            // Add functionality to update the comment here if needed
                                            onClick={() =>
                                              handleUpdateClick(
                                                index,
                                                remark.id
                                              )
                                            }
                                          >
                                            Update
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                    value={remark.remark}
                                    onChange={(event) =>
                                      handleRemarkChange(index, event)
                                    }
                                  />
                                  <h6 className="ps-4 pt-6 text-grey">
                                    {remark.createdBy +
                                      "-" +
                                      formatDates(remark.createdAt)}
                                  </h6>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                        <TableRow>
                          <TableCell>
                            <TextField
                              id="tasks-comment-new"
                              label="Write your Consultation comments..."
                              multiline
                              rows={1}
                              fullWidth
                              value={newRemark}
                              onChange={(event) =>
                                handleInputChange(event, "Consultaion")
                              }
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "auto",
                                },
                                "& .MuiInputBase-inputMultiline": {
                                  height: "100px", // Set desired height here
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    style={{ height: "90px" }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      style={{
                                        float: "right",
                                        backgroundColor: "blue",
                                        marginBottom: "3px",
                                      }}
                                      onClick={() =>
                                        handleSaveClick("Consultaion")
                                      }
                                    >
                                      Save
                                    </Button>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                    {!AppActivity.canEdit && (
                      <TableBody>
                        {remarkRequest.map(
                          (remark, index) =>
                            remark.evaluationTypeString === "Consultaion" && (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex">
                                    <img
                                      src="/assets/images/etc/userpic.png"
                                      alt="Card cover image"
                                      className="rounded-full mr-4"
                                      style={{
                                        width: "5rem",
                                        height: "5rem",
                                      }}
                                    />
                                    <h6 className="ps-4 pt-2 text-black">
                                      <b>{remark.createdBy}</b> {remark?.remark}
                                    </h6>
                                    {" -"}
                                    <h6 className="ps-5 pt-2 text-grey">
                                      {formatDates(remark.createdAt)}
                                    </h6>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                        {remarkRequest.length == 0 && (
                          <TableRow>
                            <TableCell>
                              <div className="flex">
                                <h5 className="ps-4 pt-2 text-black text-center">
                                  <b>No Comments</b>
                                </h5>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tasks Comment</TableCell>
                      </TableRow>
                    </TableHead>
                    <div className="flex items-center w-full border-b justify-between"></div>
                    {AppActivity.canEdit && (
                      <TableBody>
                        {remarkRequest.map(
                          (remark, index) =>
                            remark.evaluationTypeString === "ImpactTask" && (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    id={`impact-task-comment-${index}`}
                                    label="Write your task comments..."
                                    multiline
                                    rows={1}
                                    fullWidth
                                    value={remark.remark}
                                    onChange={(event) =>
                                      handleRemarkChange(index, event)
                                    }
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "auto",
                                      },
                                      "& .MuiInputBase-inputMultiline": {
                                        height: "100px",
                                      },
                                    }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          position="end"
                                          style={{ height: "90px" }}
                                        >
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            style={{
                                              float: "right",
                                              backgroundColor: "blue",
                                              marginBottom: "3px",
                                            }}
                                            onClick={() =>
                                              handleUpdateClick(
                                                index,
                                                remark.id
                                              )
                                            }
                                          >
                                            Update
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <h6 className="ps-4 pt-6 text-grey">
                                    {remark.createdBy +
                                      "-" +
                                      formatDates(remark.createdAt)}
                                  </h6>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                        <TableRow>
                          <TableCell>
                            <TextField
                              id="tasks-comment"
                              label="Write your task comments..."
                              multiline
                              rows={1}
                              fullWidth
                              value={newImpactTaskRemark}
                              onChange={(event) =>
                                handleInputChange(event, "ImpactTask")
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    style={{ height: "90px" }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      style={{
                                        float: "right",
                                        backgroundColor: "blue",
                                        marginBottom: "3px",
                                      }}
                                      onClick={() =>
                                        handleSaveClick("ImpactTask")
                                      }
                                    >
                                      Save
                                    </Button>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                    {!AppActivity.canEdit && (
                      <TableBody>
                        {remarkRequest.map(
                          (remark, index) =>
                            remark.evaluationTypeString === "ImpactTask" && (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex">
                                    <img
                                      src="/assets/images/etc/userpic.png"
                                      alt="Card cover image"
                                      className="rounded-full mr-4"
                                      style={{
                                        width: "5rem",
                                        height: "5rem",
                                      }}
                                    />
                                    <h6 className="ps-4 pt-2 text-black">
                                      <b>{remark.createdBy}</b> {remark?.remark}
                                    </h6>
                                    {" -"}
                                    <h6 className="ps-5 pt-2 text-grey">
                                      {formatDates(remark.createdAt)}
                                    </h6>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                        {remarkRequest.length == 0 && (
                          <TableRow>
                            <TableCell>
                              <div className="flex">
                                <h5 className="ps-4 pt-2 text-black text-center">
                                  <b>No Comments</b>
                                </h5>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>

          <div className="flex items-center w-full border-b justify-between"></div>
          <div>&nbsp;</div>

          {AppActivity?.canExecute && (
            <div className="flex justify-end">
              {AppActions.map((btn) => (
                <Button
                  key={btn.uid}
                  className="whitespace-nowrap ms-5"
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: "10px" }}
                  onClick={(e) =>
                    SubmitApprovelCreate(e, btn.uid, btn.name, btn.type)
                  }
                >
                  {btn.name}
                </Button>
              ))}
            </div>
          )}
          <div className="flex justify-start">
            <Button
              className="whitespace-nowrap mt-5"
              style={{
                border: "1px solid",
                backgroundColor: "transparent",
                color: "black",
                borderColor: "rgba(203,213,225)",
              }}
              variant="contained"
              color="warning"
              startIcon={
                <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
              }
            >
              Document
            </Button>
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default EvaluationApproval;
