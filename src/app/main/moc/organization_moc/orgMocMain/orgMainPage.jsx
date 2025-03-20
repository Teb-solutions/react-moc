import { useEffect, useRef, useState, useCallback } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Stepper from "@mui/material/Stepper";
import { Link, useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Backdrop from "@mui/material/Backdrop";

import { parseISO, format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Fade,
  FormControl,
  ListItemText,
  MenuItem,
  Modal,
  Step,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import CourseProgress from "../../homepage/CourseProgress";
import MocHeader from "../../MocHeader";
import { apiAuth } from "src/utils/http";
import Initiation from "../../common_components/Initiation";
import OrgPhasesEnum from "../orgPhaseEnum";
import MainComponent from "../../common_components/mainContent";
import OrgImplementation from "../implementation_components/OrgImplementationPage";
import FuseLoading from "@fuse/core/FuseLoading";
import CustomStepIcon from "../../homepage/CustomStepIcon";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const orgCourse = () => {
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { orgEvaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();
  const [currentActivityForm, setCurrentActivityForm] = useState({});

  const [currentPhase, setCurrentPhase] = useState("");
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [lastActCode, setlastActCode] = useState("");
  const [contentChanges, setContentChanges] = useState(false);
  const [impDetails, setImpDetails] = useState([]);
  const [appActivity, setAppActivity] = useState([]);
  const [appActions, setApActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verName, setVerName] = useState("");
  const feature = decryptFeature();

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
  const handelOpenSide = () => {
    setLeftSidebarOpen(true);
  };

  useEffect(() => {
    let lastIndex = -1;
    let lastActivity = null;

    // Find the last non-empty activity array
    for (let i = content.length - 1; i >= 0; i--) {
      if (content[i].activities.length > 0) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex !== -1) {
      const activities = content[lastIndex].activities;

      // Find the last activity that has canView as true
      for (let j = activities.length - 1; j >= 0; j--) {
        if (activities[j].canView === true) {
          lastActivity = activities[j];
          break;
        }
      }

      // If no such activity is found, search through all activities in all arrays
      if (!lastActivity) {
        for (let i = content.length - 1; i >= 0; i--) {
          for (let j = content[i].activities.length - 1; j >= 0; j--) {
            if (content[i].activities[j].canView === true) {
              lastIndex = i;
              lastActivity = content[i].activities[j];
              break;
            }
          }
          if (lastActivity) break;
        }
      }
      setlastActCode(lastActivity);
      // If still no such activity is found, fall back to the last activity in the lastIndex
      if (!lastActivity) {
        lastActivity = activities[activities.length - 1];
      }

      setActiveAccordionIndex(lastIndex);
      setExpandedAccordionIndex(lastIndex);
      handleStepChange(
        null,
        content[lastIndex].name,
        lastActivity.uid,
        lastActivity.code,
        lastActivity.version,
        lastActivity.refVersion,
        lastActivity.name,
        lastActivity.canEdit,
        lastActivity.canView
      );
    }
  }, [content]);

  const handleAccordionChange = (index, phaseName) => {
    if (expandedAccordionIndex === index) {
      setExpandedAccordionIndex(-1); // Collapse if already expanded
    } else {
      setExpandedAccordionIndex(index);
      // Expand if collapsed or different accordion
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      // Adjust this width as needed
      setLeftSidebarOpen(false);
    } else {
      setLeftSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    // Set initial state
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const [staffList, setStaffList] = useState([]);

  function getRecords() {
    apiAuth
      .get(`/ChangeRequest/RequestDetails?id=${orgEvaluationId}`)
      .then((resp) => {
        setContentDetails(resp.data.data);
        apiAuth
          .get(`/Activity/RequestLifecycle/${orgEvaluationId}`)
          .then((resp) => {
            setIsLoading(false);

            setContent(resp.data.data.phases);
            setValueRemark("");
          });
      });

    apiAuth.get(`/TeamAssignment/Create`).then((resp) => {
      setStaffList(resp.data?.data.staffData);
    });
  }
  const [editId, setEditId] = useState("");
  const [openApprover, setOpenApprover] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [siteInCharge, setSiteInCharge] = useState(null);
  const [editName, setEditName] = useState("");
  const [siteInId, setSiteInChargeId] = useState();

  const handleEditApprover = (step) => {
    // Find the matching staff based on targetUserIds
    const selectedApprover = staffList.find(
      (staff) => staff.value === step.targetUserIds[0] // Assuming only one targetUserId
    );

    // Set the selected approver in the state
    setSiteInChargeId(selectedApprover || null);
    setEditId(step.uid);
    setEditName(step.name);
    // Open the modal
    setOpenApprover(true);
    setValidationErrors({});
  };

  const handleSiteInChargeChange = (event, newValue) => {
    setSiteInCharge(newValue);
    setSiteInChargeId(newValue);
    if (newValue) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        siteInId: null,
      }));
    }
  };

  const updateActivityTargetUsers = () => {
    let errors = {};

    if (!siteInId) {
      errors.siteInId = "Staff is required.";
      setValidationErrors(errors);
    }

    apiAuth
      .post("/Activity/UpdateActivityTargetUsers", {
        activityUID: editId,
        activityName: editName,
        changeRequestToken: assetEvaluationId,
        targetUserIds: [siteInId.value],
      })
      .then((resp) => {
        toast.success("Successfully Updated");
        getRecords();

        setOpenApprover(false);
      });
  };

  const handleStepChange = (
    e,
    phaseName,
    uid,
    code,
    version,
    refVersion,
    activityname,
    canedit,
    canView
  ) => {
    if (!canView) {
      console.log("This activity cannot be viewed.");
      return;
    }
    setActName(activityname);
    setVerName(version);
    setCanEdits(canedit);

    const matchingPhase = content.find((phase) =>
      phase.activities.some((activity) => activity.uid === uid)
    );

    if (matchingPhase) {
      const matchingActivity = matchingPhase.activities.find(
        (activity) => activity.uid === uid
      );

      setCurrentActivityForm(matchingActivity);
      if (matchingActivity) {
        let actualPhaseName;

        switch (matchingActivity.form) {
          case OrgPhasesEnum.INITIATION:
            actualPhaseName = "InitiationRequest";
            break;
          case OrgPhasesEnum.IMPLEMENTATION:
            actualPhaseName = "Implementation";
            break;

          default:
            actualPhaseName = " ";
        }

        setCurrentPhase(actualPhaseName);
        setCurrentPhaseName(phaseName);
        switch (actualPhaseName) {
          case "InitiationRequest":
            apiAuth
              .get(`/ChangeRequest/Get?id=${orgEvaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
              });
            setContentChanges(true);
            break;
          case "Implementation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${orgEvaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
              });
            apiAuth
              .get(`/OrgMoc/GetImplementation/${orgEvaluationId}`)
              .then((resp) => {
                setImpDetails(resp.data?.data?.taskList);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActivity(resp.data?.data?.activity);
              setApActions(resp.data?.data?.actions);
            });
            break;

          default:
            console.log("No matching phase found");
            return;
        }
      }
    }
  };
  useEffect(() => {
    handleStepChange();
  }, []);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageSimple
      header={
        <MocHeader
          activity={actName}
          reqno={reqNo}
          verName={verName}
          sidemenu={true}
          setLeftSidebarOpen={setLeftSidebarOpen}
          leftSidebarOpen={leftSidebarOpen}
        />
      }
      content={
        <div className="w-full">
          {/* <ToastContainer className="toast-container" /> */}

          <div className="flex justify-center p-16 pb-64 sm:p-24 ">
            {currentPhase === "InitiationRequest" && (
              <MainComponent
                contentDetails={contentDetails}
                contentChanges={contentChanges}
              />
            )}
            {currentPhase === "Implementation" && (
              <OrgImplementation
                impDetails={impDetails}
                appActivity={appActivity}
                appActions={appActions}
                lastActCode={lastActCode}
                currentActivityForm={currentActivityForm}
                orgEvaluationId={orgEvaluationId}
                setImpDetails={setImpDetails}
              />
            )}
          </div>
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openApprover}
            onClose={() => setOpenApprover(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={openApprover}>
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
                      Edit Activity Assignee{""}
                    </span>
                    <span
                      onClick={() => setOpenApprover(false)}
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
                    sx={{ "& > :not(style)": { m: 1, marginTop: "30px" } }}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth>
                      <Autocomplete
                        id="siteInCharge"
                        options={staffList}
                        getOptionLabel={(option) => option.text}
                        value={siteInId}
                        onChange={handleSiteInChargeChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Staff*"
                            error={!!validationErrors.siteInId}
                            helperText={validationErrors.siteInId}
                          />
                        )}
                        renderOption={(props, option) => (
                          <MenuItem
                            {...props}
                            key={option.value}
                            value={option.value}
                          >
                            <ListItemText primary={option.text} />
                          </MenuItem>
                        )}
                      />
                    </FormControl>
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
                    onClick={() => setOpenApprover(false)}
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
                    onClick={updateActivityTargetUsers}
                  >
                    Update
                  </Button>
                </div>
              </Box>
            </Fade>
          </Modal>
          <div className="desktop_hide text-end p-30 pt-24 pb-24">
            <FuseSvgIcon
              className="text-48 cursor-pointer "
              size={24}
              style={{ display: "inline-block;" }}
              color="action"
              onClick={handelOpenSide}
            >
              heroicons-outline:menu
            </FuseSvgIcon>
          </div>
          {content.map((resp, respIndex) => (
            <Accordion
              key={respIndex}
              style={{ margin: "0px" }}
              expanded={respIndex === expandedAccordionIndex}
              onChange={() => handleAccordionChange(respIndex)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                style={{ minHeight: "60px" }}
              >
                {resp.name}
              </AccordionSummary>
              <AccordionDetails>
                <Stepper orientation="vertical">
                  {resp.activities.map((step, index) => (
                    <Step
                      key={index}
                      sx={{
                        "& .MuiStepLabel-root, & .MuiStepContent-root": {
                          cursor: step.canView
                            ? "pointer!important"
                            : "default!important",
                        },
                        "& .MuiStepContent-root": {
                          color: "text.secondary",
                          fontSize: 13,
                        },
                      }}
                      onClick={(e) =>
                        handleStepChange(
                          e,
                          resp.name,
                          step.uid,
                          step.code,
                          step.version,
                          step.refVersion,
                          step.name,
                          step.canEdit,
                          step.canView
                        )
                      }
                      expanded
                    >
                      <StepLabel
                        className="font-medium"
                        StepIconComponent={(props) => (
                          <CustomStepIcon
                            {...props}
                            index={index}
                            canView={step.canView}
                            isComplete={step.isComplete}
                            status={step.status}
                          />
                        )}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "background.default",
                            "& .MuiStepIcon-text": {
                              fill: (_theme) => _theme.palette.text.secondary,
                            },
                            "&.Mui-completed": {
                              color: "secondary.main",
                              "& .MuiStepIcon-text ": {
                                fill: (_theme) =>
                                  _theme.palette.secondary.contrastText,
                              },
                            },
                            "&.Mui-active": {
                              color: "secondary.main",
                              "& .MuiStepIcon-text ": {
                                fill: (_theme) =>
                                  _theme.palette.secondary.contrastText,
                              },
                            },
                          },
                        }}
                      >
                        <span
                          style={
                            currentActivityForm.uid == step.uid
                              ? { color: "rgb(79, 70, 229)" }
                              : {}
                          }
                        >
                          {step.name} v{step.version}
                        </span>
                      </StepLabel>
                      <StepContent>
                        <CourseProgress
                          course={step.isComplete === true ? 100 : 0}
                        />
                      </StepContent>
                      {step.code == "MOC_COMPLETED" ? (
                        <StepContent style={{ fontSize: "10px" }}>
                          Ended at <b>{formatDates(step.actualEndDate)}</b>
                        </StepContent>
                      ) : (
                        <>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                            className="pt-4"
                          >
                            <div className="d-flex justify-between">
                              <span>
                                <b>
                                  {step.targetUsers &&
                                  step.targetUsers.length > 0
                                    ? "By " + step.targetUsers[0]
                                    : ""}
                                </b>
                              </span>
                              {!step?.isComplete &&
                                feature.includes("REQD") && (
                                  <span className="cursor-pointer">
                                    <FuseSvgIcon
                                      size={20}
                                      onClick={() => handleEditApprover(step)}
                                    >
                                      heroicons-solid:pencil
                                    </FuseSvgIcon>
                                  </span>
                                )}
                            </div>
                          </StepContent>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                          >
                            Started at{" "}
                            <b>
                              {formatDates(step.actualStartDate, "yyyy-MM-dd")}
                            </b>
                          </StepContent>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                          >
                            {step.actualEndDate === null ? (
                              ""
                            ) : (
                              <>
                                {step.status} at{" "}
                                <b>
                                  {formatDates(
                                    step?.actualEndDate,
                                    "yyyy-MM-dd"
                                  )}
                                </b>
                              </>
                            )}
                          </StepContent>
                          {!step?.isComplete && (
                            <StepContent
                              style={
                                currentActivityForm.uid == step.uid
                                  ? { color: "blue", fontSize: "10px" }
                                  : { fontSize: "10px" }
                              }
                            >
                              <b> Pending</b>
                            </StepContent>
                          )}
                        </>
                      )}
                    </Step>
                  ))}
                </Stepper>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      }
      scroll="content"
      ref={pageLayout}
    />
  );
};

export default orgCourse;
