import FusePageSimple from "@fuse/core/FusePageSimple";
import Stepper from "@mui/material/Stepper";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import { parseISO, format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuth } from "src/utils/http";

import FuseLoading from "@fuse/core/FuseLoading";

import RiskProgress from "../riskProgressBar";
import MocHeader from "../../moc/MocHeader";
import OrgPhasesEnum from "../../moc/orgEvaluation/orgPhaseEnum";
import MainComponent from "../../moc/components/mainContent";
import OrgImplementation from "../../moc/components/OrgImplementation";
import CustomStepIcon from "../../moc/CustomStepIcon";
import CourseProgress from "../../moc/CourseProgress";
import SwipeableViews from "react-swipeable-views";

const riskCourse = () => {
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { riskEvaluationId } = routeParams;
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
  const [content, setContent] = useState([]);

  console.log(content, "contenn");

  useEffect(() => {
    let lastIndex = -1;
    let lastActivity = null;

    // Find the last non-empty activity array
    for (let i = content?.length - 1; i >= 0; i--) {
      if (content[i].activities?.length > 0) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex !== -1) {
      const activities = content[lastIndex].activities;

      // Find the last activity that has canView as true
      for (let j = activities?.length - 1; j >= 0; j--) {
        if (activities[j].canView === true) {
          lastActivity = activities[j];
          break;
        }
      }

      // If no such activity is found, search through all activities in all arrays
      if (!lastActivity) {
        for (let i = content?.length - 1; i >= 0; i--) {
          for (let j = content[i].activities?.length - 1; j >= 0; j--) {
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
        lastActivity = activities[activities?.length - 1];
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

  function getRecords() {
    apiAuth
      .get(`/ChangeRequest/RequestDetails?id=${riskEvaluationId}`)
      .then((resp) => {
        setContentDetails(resp.data.data);
        apiAuth
          .get(`/Activity/RequestLifecycle/${riskEvaluationId}`)
          .then((resp) => {
            setIsLoading(false);

            setContent([
              {
                name: "Initiation",
                isActive: true,
                activities: [
                  {
                    uid: "b048206819da458f8da3de90e1649136",
                    name: "Fill Change Request form",
                    code: "START",
                    description: "",
                    form: 1,
                    formUID: "4a31c6d6-be0f-41bf-96dc-7ccdbf4d243a",
                    version: 1,
                    refVersion: 1,
                    actualStartDate: "2024-07-24T11:51:58.7692491",
                    actualEndDate: "2024-07-24T11:51:58.7692747",
                    isComplete: true,
                    status: "Completed",
                    canEdit: false,
                    canView: true,
                    canExecute: false,
                    canTransfer: false,
                    canReview: false,
                    targetUserIds: [14],
                    targetUsers: ["Sreenivas Sathyamurthy"],
                  },
                ],
              },
              {
                name: "Evaluation",
                isActive: true,
                activities: [
                  {
                    uid: "2e8434b87d6942b29967ed4b143611fd",
                    name: "Change Evaluation",
                    code: "IS_Change_NEEDED",
                    description: "",
                    form: 5,
                    formUID: "",
                    version: 1,
                    refVersion: 1,
                    actualStartDate: "2024-07-24T11:51:58.7692859",
                    actualEndDate: null,
                    isComplete: false,
                    status: "Pending",
                    canEdit: true,
                    canView: true,
                    canExecute: false,
                    canTransfer: false,
                    canReview: false,
                    targetUserIds: [22],
                    targetUsers: ["Girish KOTBAGI"],
                  },
                ],
              },
              {
                name: "Approval",
                isActive: true,
                activities: [],
              },
              {
                name: "Implementation",
                isActive: true,
                activities: [],
              },
            ]);
            setValueRemark("");
          });
      });
  }

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
    setCanEdits(canedit);

    const matchingPhase = content.find((phase) =>
      phase.activities.some((activity) => activity.uid === uid)
    );

    if (matchingPhase) {
      const matchingActivity = matchingPhase.activities.find(
        (activity) => activity.uid === uid
      );
      console.log(matchingActivity, "matchingActivity");
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
              .get(`/ChangeRequest/Get?id=${riskEvaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
              });
            setContentChanges(true);
            break;
          case "Implementation":
            apiAuth
              .get(`/OrgMoc/GetImplementation/${riskEvaluationId}`)
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
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const [value, setValue] = useState(0);
  const [AddCunsultation, setAddConsultation] = useState(false);
  const [AddImpact, setAddCImpact] = useState(false);
  const [editConsultation, setEditConsultation] = useState(false);

  const handleAddConsultation = () => {
    setAddConsultation(true);
  };
  const handleAddImpact = () => {
    setAddCImpact(true);
  };
  const handleChange = (newValue) => setValue(newValue);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageSimple
      header={<MocHeader risk={"risk"} activity={actName} reqno={reqNo} />}
      content={
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

          <div className="flex justify-center p-16 pb-64 sm:p-24 ">
            {currentActivityForm.code == "START" && (
              <div className="w-full">
                <SwipeableViews>
                  <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
                    <div>
                      <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
                        <h2 className="text-2xl font-semibold">
                          Risk Register Details
                        </h2>
                      </div>
                      <div className="p-30 pt-24 pb-24">
                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Request No
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              CHSEQMAH24282
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Date
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              24/2024
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Site In Charge
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Sreenivas Sathyamurthy
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Site
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Mumbai
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Division
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Test Risk
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Function
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Test Risk
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Type
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Routine
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Title
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Test Routine
                            </div>
                          </div>
                          <div className="my-6">
                            <div className="mt-3 leading-6 text-secondary">
                              Description
                            </div>
                            <div className="text-lg leading-6 font-medium">
                              Test Routine Description
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full p-30 pt-24 pb-24 border-t">
                        <div>
                          <Button
                            className="whitespace-nowrap"
                            style={{
                              border: "1px solid",
                              backgroundColor: "transparent",
                              color: "black",
                              borderColor: "rgba(203,213,225)",
                            }}
                            variant="contained"
                            color="warning"
                            startIcon={
                              <FuseSvgIcon size={20}>
                                heroicons-solid:upload
                              </FuseSvgIcon>
                            }
                          >
                            Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </SwipeableViews>
                <SwipeableViews>
                  <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
                    <div className="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between">
                      <h2 className="text-2xl font-semibold">
                        Team Assignment
                      </h2>
                    </div>
                    <div className="p-30 pt-24 pb-24">
                      <div
                        // Assuming there's a unique id for each list item
                        className="inventory-grid grid items-center gap-4 "
                        // style={{ width: "40%" }}
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
                              Sreeninivas Sathyamurthy
                            </span>
                            <span className="text-sm text-secondary leading-none pt-5">
                              Maintenance in chage
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        // Assuming there's a unique id for each list item
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "40%" }}
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
                              Giresh
                            </span>
                            <span className="text-sm text-secondary leading-none pt-5">
                              Operations In Charge
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        // Assuming there's a unique id for each list item
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        // style={{ width: "40%" }}
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
                              Tebs Dev Team
                            </span>
                            <span className="text-sm text-secondary leading-none pt-5">
                              Task Reoresentative
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </SwipeableViews>
              </div>
            )}
            {currentActivityForm.code == "IS_Change_NEEDED" && (
              <div className="w-full">
                <SwipeableViews>
                  <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
                    <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
                      <h2 className="text-2xl font-semibold">Evaluation</h2>
                      <div>
                        {currentActivityForm.canEdit && (
                          <Button
                            className="whitespace-nowrap mt-5"
                            style={{
                              border: "1px solid",
                              backgroundColor: "transparent",
                              color: "black",
                              borderColor: "rgba(203,213,225)",
                              marginRight: "5px",
                            }}
                            variant="contained"
                            color="warning"
                            startIcon={
                              <FuseSvgIcon size={20}>
                                heroicons-outline:user-add
                              </FuseSvgIcon>
                            }
                          >
                            <span>Create Session</span>
                          </Button>
                        )}
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
                            <FuseSvgIcon size={20}>
                              heroicons-outline:user-add
                            </FuseSvgIcon>
                          }
                        >
                          Session List
                        </Button>
                      </div>
                    </div>
                    <div className=" p-30 pt-24 pb-24">
                      {currentActivityForm.canEdit && (
                        <div className="ng-star-inserted mt-5">
                          <div className="ng-star-inserted">
                            <div
                              className="mt-4 py-2 px-5 rounded-lg bg-red-100 dark:bg-red-700"
                              style={{
                                backgroundColor: "rgb(255 196 202)",
                                padding: "5px",
                              }}
                            >
                              Please start session to make any changes.
                            </div>
                          </div>
                        </div>
                      )}
                      {/* )} */}
                      <Box sx={{ width: "100%", mt: 2 }} className="hello">
                        <Box sx={{ display: "flex" }}>
                          <Button
                            onClick={() => handleChange(0)}
                            variant={value === 0 ? "contained" : "outlined"}
                            sx={{
                              backgroundColor:
                                value === 0 ? "#e6e6e6" : "transparent",
                              color: value === 0 ? "black" : "black",
                              borderColor: "white",
                            }}
                          >
                            Add Tasks
                          </Button>
                          {/* <Button
                              onClick={() => handleChange(1)}
                              className="ms-5"
                              variant={value === 1 ? "contained" : "outlined"}
                              sx={{
                                backgroundColor:
                                  value === 1 ? "#e6e6e6" : "transparent",
                                color: value === 1 ? "black" : "black",
                                borderColor: "white",
                              }}
                            >
                              Change Evaluation Impacts
                            </Button> */}
                        </Box>

                        <CustomTabPanel value={value} index={0}>
                          <div className="flex justify-start">
                            <div
                              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                              style={{ marginTop: "15px" }}
                            >
                              {currentActivityForm.canEdit && (
                                <Button
                                  className="whitespace-nowrap"
                                  variant="contained"
                                  color="secondary"
                                  style={{ padding: "15px" }}
                                  onClick={handleAddConsultation}
                                  startIcon={
                                    <FuseSvgIcon size={20}>
                                      heroicons-outline:plus
                                    </FuseSvgIcon>
                                  }
                                >
                                  Add New Task
                                </Button>
                              )}
                            </div>
                          </div>
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={1}>
                          <Paper>
                            {AddImpact && (
                              <>
                                <div
                                  className="font-semibold ps-5"
                                  style={{ padding: "15px" }}
                                >
                                  <a
                                    rel="noopener noreferrer"
                                    onClick={handlebackImpactList}
                                  >
                                    Back to Impact View
                                  </a>
                                </div>
                                <div
                                  className="my-10"
                                  style={{ borderTopWidth: "2px" }}
                                ></div>

                                <Button
                                  className="whitespace-nowrap mt-5"
                                  style={{
                                    border: "1px solid",
                                    backgroundColor: "#0000",
                                    color: "black",
                                    borderColor: "rgba(203,213,225)",
                                    marginLeft: "30px",
                                  }}
                                  variant="contained"
                                  startIcon={
                                    <FuseSvgIcon size={20}>
                                      heroicons-outline:plus
                                    </FuseSvgIcon>
                                  }
                                  onClick={handleAddNewTask}
                                >
                                  Add New Task
                                </Button>
                                <div
                                  className="my-10"
                                  style={{ borderTopWidth: "2px" }}
                                ></div>
                                <div className="flex justify-end">
                                  <div
                                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                                    style={{ marginTop: "15px" }}
                                  >
                                    <Button
                                      className="whitespace-nowrap"
                                      variant="contained"
                                      color="secondary"
                                      style={{ margin: "15px" }}
                                      //   onClick={() => handleOpen(btn)}
                                      startIcon={
                                        <FuseSvgIcon size={20}>
                                          heroicons-outline:plus
                                        </FuseSvgIcon>
                                      }
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </Paper>
                          {currentActivityForm.canEdit && !AddImpact && (
                            <div className="flex justify-start">
                              <div
                                className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                                style={{ marginTop: "15px" }}
                              >
                                <Button
                                  className="whitespace-nowrap"
                                  variant="contained"
                                  color="secondary"
                                  style={{ padding: "15px" }}
                                  startIcon={
                                    <FuseSvgIcon size={20}>
                                      heroicons-outline:plus
                                    </FuseSvgIcon>
                                  }
                                  // onClick={handleAddImpact}
                                >
                                  Add New Impact
                                </Button>
                              </div>
                            </div>
                          )}
                        </CustomTabPanel>
                      </Box>
                      {AddCunsultation && !editConsultation && (
                        <>
                          {/* <div
                              className="my-10"
                              style={{ borderTopWidth: "2px", marginTop: "40px" }}
                            ></div> */}

                          {/* <div
                              className="flex justify-between items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                              style={{ marginTop: "15px" }}
                            >
                              <Button
                                className="whitespace-nowrap mt-5"
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "black",
                                  color: "white",
                                  marginLeft: "10px",
                                }}
                                variant="contained"
                                startIcon={
                                  <FuseSvgIcon size={20}>
                                    heroicons-outline:plus
                                  </FuseSvgIcon>
                                }
                                onClick={handleAddConsultation}
                              >
                                Add Stake
                              </Button>

                              <div className="flex items-center space-x-12">
                                <Button
                                  className="whitespace-nowrap mt-5"
                                  style={{
                                    border: "1px solid",
                                    backgroundColor: "#0000",
                                    color: "black",
                                    borderColor: "rgba(203,213,225)",
                                    marginLeft: "10px",
                                  }}
                                  variant="contained"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="whitespace-nowrap mt-12"
                                  variant="contained"
                                  color="secondary"
                                  style={{ padding: "15px" }}
                                >
                                  Submit
                                </Button>
                              </div>
                            </div> */}
                        </>
                      )}
                    </div>
                    <>
                      <div
                        className="my-10"
                        style={{ borderTopWidth: "2px" }}
                      ></div>

                      {/* <div className="flex justify-end"> */}
                      {/* <div
                          className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                          style={{ marginTop: "15px" }}
                        ></div> */}
                      <div
                        className="flex items-center justify-end p-30 pt-24 pb-24"
                        // style={{ marginTop: "15px" }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          //   key={btn.name}
                          // onClick={() => handleOpen(btn)}
                        >
                          submit for approval
                        </Button>
                      </div>
                      {/* </div> */}
                    </>
                  </Paper>
                </SwipeableViews>
              </div>
            )}
          </div>
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <>
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
                          cursor: "pointer!important",
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
                        {step.name} v{step.version}
                      </StepLabel>
                      <StepContent>
                        <CourseProgress
                          course={step.isComplete === true ? 100 : 0}
                        />
                      </StepContent>

                      <>
                        <StepContent
                          style={{ fontSize: "10px" }}
                          className="pt-4"
                        >
                          By{" "}
                          <b>
                            {step.targetUsers && step.targetUsers?.length > 0
                              ? step.targetUsers[0]
                              : ""}
                          </b>
                        </StepContent>
                        <StepContent style={{ fontSize: "10px" }}>
                          Started at <b>{formatDate(step.actualStartDate)}</b>
                        </StepContent>
                        <StepContent style={{ fontSize: "10px" }}>
                          {step.actualEndDate === null ? (
                            ""
                          ) : (
                            <>
                              {step.status} at{" "}
                              <b>{formatDate(step.actualEndDate)}</b>
                            </>
                          )}
                        </StepContent>
                      </>
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

export default riskCourse;
