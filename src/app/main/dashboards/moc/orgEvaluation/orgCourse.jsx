import FusePageSimple from "@fuse/core/FusePageSimple";
import Stepper from "@mui/material/Stepper";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { parseISO, format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Step,
  StepContent,
  StepLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import CourseProgress from "../CourseProgress";
import MocHeader from "../MocHeader";
import { apiAuth } from "src/utils/http";
import Initiation from "../components/Initiation";
import OrgPhasesEnum from "./orgPhaseEnum";
import MainComponent from "../components/mainContent";
import OrgImplementation from "../components/OrgImplementation";
import FuseLoading from "@fuse/core/FuseLoading";
import CustomStepIcon from "../CustomStepIcon";

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
              .get(`/ChangeRequest/Get?id=${orgEvaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
              });
            setContentChanges(true);
            break;
          case "Implementation":
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
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />

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
              />
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
                            {step.targetUsers && step.targetUsers.length > 0
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

export default orgCourse;
