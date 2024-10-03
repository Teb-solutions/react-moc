import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Stepper from "@mui/material/Stepper";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Tooltip,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseProgress from "../../homepage/CourseProgress";
import MocHeader from "../../MocHeader";
import { apiAuth } from "src/utils/http";
// import AssetPhasesEnum from "../evaluation/course/docPhaseEnum";
import Initiation from "../../common_components/Initiation";
import AssetPhasesEnum from "./assetPhaseEnum";
import InitiationApproval from "../initiation_components/Initiation_Approval";
import InitiationComplete from "../initiation_components/initiation_Change_Summary";
import InitiationApprovalProceed from "../initiation_components/Initiation_Team_Assignment";
import EvaluationChange from "../evaluation_components/Evaluation_Change";
import EvaluationApproval from "../approval_components/Evaluation_Approval";
import ImplementationApproval from "../implementaion_components/Implementation_Approval";
import ImplementationApprovalSite from "../implementaion_components/Implementation_Approval_Site";
import FuseLoading from "@fuse/core/FuseLoading";
import CustomStepIcon from "../../homepage/CustomStepIcon";
import { useCallback } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpModal from "../../common_modal/HelpModal";
const AssetCourse = () => {
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { assetEvaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});
  const [contentDetailsDocu, setContentDetailsDocu] = useState({});
  const [contentDetailsIni, setContentDetailsIni] = useState({});
  const [contentDetailsPssr, setContentDetailsPssr] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  // const [AssetDetails, setAssetDetails] = useState({});
  const [currentSummeryById, setCurrentSummeryById] = useState({});
  const [changeEvaluationId, setChangeEvaluationId] = useState();
  const [TeamAssignmentList, setTeamAssignmentList] = useState([]);

  const [handelUrlChange, setHandelUrlChange] = useState({
    urlRemarks: "",
  });
  const [listDocument, setListDocument] = useState([]);

  const [open, setOpen] = useState(false);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [verName, setVerName] = useState("");

  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();

  const [appActions, setAppActions] = useState([]);
  const [appActivity, setAppActivity] = useState({});

  const [currentActivityForm, setCurrentActivityForm] = useState({});
  const [errorsUrl, setErrorsUrl] = useState({});
  const [ApprovalManager, setApprovalManager] = useState({});

  const [valueRemark, setValueRemark] = useState("");
  const [remarkRequest, setRemarkRequest] = useState([]);

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

  const [CountApprove, setCountApprove] = useState();
  const [CountApprove1, setCountApprove1] = useState();
  const [CountApprove2, setCountApprove2] = useState();
  const [CountApprove3, setCountApprove3] = useState();
  const [CountApprove4, setCountApprove4] = useState();

  const [showApexAndContent, setShowApexAndContent] = useState(false);

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

  const handleChangeRemark = (event) => {
    setValueRemark(event.target.value);
    if (event.target.value.trim() !== "") {
      setErrorMessage(""); // Clear error message on input change
    }
  };

  const [currentPhase, setCurrentPhase] = useState("");
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [lastActCode, setlastActCode] = useState("");

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
      .get(`/ChangeRequest/RequestDetails?id=${assetEvaluationId}`)
      .then((resp) => {
        setContentDetails(resp.data.data);
        apiAuth
          .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
          .then((resp) => {
            setContent(resp.data.data.phases);
            setValueRemark("");
          });
      });
    apiAuth.get(`/TeamAssignment/Create`).then((resp) => {
      setStaffList(resp.data?.data.staffData);
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  const [tasks, setTasks] = useState([]);
  const [showRiskAnalysisChart, setShowRiskAnalysisChart] = useState(false);
  const [riskAnalysisChartOptions, setRiskAnalysisChartOptions] = useState({
    series: [],
    chart: {},
    annotations: {},
    dataLabels: {},
    stroke: {},
    title: {},
    xaxis: {},
    yaxis: {},
  });
  const loadRiskAnalysisChart = (tasks) => {
    let taskLabels = [];
    let taskResidualRisks = [];

    tasks.forEach((task) => {
      if (task.riskAnalysisList.length > 0) {
        taskLabels.push(task.sourceTaskId);
        let taskResidualRisk = 0;

        task.riskAnalysisList.forEach((ra) => {
          ra.riskAnalysisSubTasks.forEach((subTask) => {
            subTask.riskAnalysisHazardTypes.forEach((hazardType) => {
              hazardType.riskAnalysisHazardSituation.forEach((situation) => {
                let residualRisk = situation.residualRisk;
                if (residualRisk > taskResidualRisk) {
                  taskResidualRisk = residualRisk;
                }
              });
            });
          });
        });

        taskResidualRisks.push(taskResidualRisk);
      }
    });
    if (taskResidualRisks.length > 0) {
      setShowRiskAnalysisChart(true);
    }
    setRiskAnalysisChartOptions({
      series: [{ name: "Residual Risk", data: taskResidualRisks }],
      chart: {
        height: 350,
        type: "scatter",
        zoom: { enabled: false },
      },
      annotations: {
        yaxis: [
          {
            y: 400,
            y2: 800,
            borderColor: "#fff",
            fillColor: "#fff",
            opacity: 0.2,
          },
          {
            y: 200,
            y2: 400,
            borderColor: "#fff",
            fillColor: "#fff",
            opacity: 0.2,
          },
        ],
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: { text: "Risk Chart", align: "left" },
      xaxis: {
        title: { text: "Task ID" },
        categories: taskLabels,
      },
      yaxis: {
        title: { text: "Residual Risk" },
        min: 0,
        max: 850,
      },
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
      console.log(matchingActivity, "matchingActivity");
      setCurrentActivityForm(matchingActivity);
      if (matchingActivity) {
        let actualPhaseName;

        switch (matchingActivity.form) {
          case AssetPhasesEnum.INITIATIONREQUEST:
            actualPhaseName = "InitiationRequest";
            break;
          case AssetPhasesEnum.INITIATIONAPPROVAL:
            if (matchingActivity.code === "IS_MOC_NEEDED") {
              actualPhaseName = "InitiationApproval";
            } else if (matchingActivity.code === "EV_APPR_SITE_CH") {
              actualPhaseName = "EvaluationApproval";
            } else if (matchingActivity.code === "EV_APPR_COORP_HSE") {
              actualPhaseName = "EvaluationApprovalCooprate";
            } else if (matchingActivity.code === "EV_APPR_VP_DIV") {
              actualPhaseName = "EvaluationApprovalVp";
            } else if (matchingActivity.code === "EV_APPR_VP_HSE") {
              actualPhaseName = "EvaluationApprovalVpHse";
            } else if (matchingActivity.code === "IMPL_APPROVAL_SITE_CH") {
              actualPhaseName = "ImplementationApprovalSite";
            } else if (matchingActivity.code === "IMPL_APPROVAL_COORP_HSE") {
              actualPhaseName = "ImplementationApprovalCoorp";
            } else if (matchingActivity.code === "IMPL_APPROVAL_VP_DIV") {
              actualPhaseName = "ImplementationApprovalDiv";
            } else if (matchingActivity.code === "IMPL_APPROVAL_VP_HSE") {
              actualPhaseName = "ImplementationApprovalHse";
            }

            break;
          case AssetPhasesEnum.INITIATIONACOMPLETE:
            actualPhaseName = "InitiationComplete";
            break;
          case AssetPhasesEnum.INITIATIONAPPROVALAPROCEED:
            actualPhaseName = "InitiationApprovalProceed";
            break;
          case AssetPhasesEnum.EVALUATIONCHANGE:
            actualPhaseName = "EvaluationChange";
            break;
          case AssetPhasesEnum.IMPLEMENTATIONAPPROVAL:
            actualPhaseName = "ImplementationApproval";
            break;
          case AssetPhasesEnum.IMPTRANS:
            actualPhaseName = "ImplementationApproval";
            break;
          case AssetPhasesEnum.INITRANS:
            actualPhaseName = "InitiationRequest";
            break;

          default:
            actualPhaseName = " ";
        }

        setCurrentPhase(actualPhaseName);
        setCurrentPhaseName(phaseName);
        switch (actualPhaseName) {
          case "InitiationRequest":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
                // apiAuth
                //   .get(
                //     `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
                //   )
                //   .then((resp) => {
                //     setContentDetailsDocu(resp.data?.data);
                //   });
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
            });
            break;
          case "InitiationApproval":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);

                  apiAuth
                    .get(
                      `/ApprovalManager/Remark/${resp.data.data.activity.uid}`
                    )
                    .then((resp) => {
                      setIsLoading(false);

                      setApprovalManager(resp.data?.data);
                    });
                  apiAuth
                    .get(
                      `/DocumentManager/DocumentCount?id=${resp.data.data.activity.uid}&documentType=Approval`
                    )
                    .then((resp) => {
                      setCountApprove(resp.data.data);
                    });
                });
              });

            break;
          case "InitiationComplete":
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setIsLoading(false);

              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
            });
            apiAuth
              .get(
                `/DocumentManager/DocumentCount?id=${uid}&documentType=ChangeSummary`
              )
              .then((resp) => {
                setCountApprove2(resp.data.data);
              });
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`/ChangeSummary/Get?id=${assetEvaluationId}`)
              .then((resps) => {
                setCurrentSummeryById(resps.data.data);
                apiAuth
                  .get(
                    `/DocumentManager/DocumentCount?id=${resps.data.data.id}&documentType=ChangeSummary`
                  )
                  .then((resp) => {
                    setCountApprove2(resp.data.data);
                  });
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });

            break;
          case "InitiationApprovalProceed":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`TeamAssignment/List?id=${assetEvaluationId}`)
              .then((resp) => {
                setTeamAssignmentList(resp.data.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setIsLoading(false);

                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                });
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            break;
          case "EvaluationChange":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`TeamAssignment/List?id=${assetEvaluationId}`)
              .then((resp) => {
                setTeamAssignmentList(resp.data.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setIsLoading(false);

                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                });
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            break;
          case "EvaluationApproval":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
                if (resp.data?.data) {
                  const data = resp.data?.data;
                  if (data.requestTypeName !== "Document") {
                    const updatedTasks = data.tasklist.map((task) => {
                      task.showPreviousTasks = false;
                      task.riskAnalysisList = data.riskAnalysisList.filter(
                        (ra) => ra.changeImapactId === task.changeImapactId
                      );
                      return task;
                    });

                    setTasks(updatedTasks);
                    loadRiskAnalysisChart(updatedTasks);
                    apiAuth
                      .get(
                        `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                      )
                      .then((resp) => {
                        setCountApprove(resp.data.data);
                      });
                  }
                }
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(
                  `/ApprovalManager/RemarksbyRequest/${resp.data.data.activity.uid}`
                )
                .then((resp) => {
                  setIsLoading(false);

                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "EvaluationApprovalCooprate":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
                if (resp.data?.data) {
                  const data = resp.data?.data;
                  if (data.requestTypeName !== "Document") {
                    const updatedTasks = data.tasklist.map((task) => {
                      task.showPreviousTasks = false;
                      task.riskAnalysisList = data.riskAnalysisList.filter(
                        (ra) => ra.changeImapactId === task.changeImapactId
                      );
                      return task;
                    });

                    setTasks(updatedTasks);
                    loadRiskAnalysisChart(updatedTasks);

                    // https://mocapi.tebs.co.in/api/DocumentManager/DocumentCount?id=99ea4bdc97ee449183b3fd50a0aee88a&documentType=Approval
                    apiAuth
                      .get(
                        `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                      )
                      .then((resp) => {
                        setCountApprove1(resp.data.data);
                      });
                  }
                }
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(
                  `/ApprovalManager/RemarksbyRequest/${resp.data.data.activity.uid}`
                )
                .then((resp) => {
                  setIsLoading(false);

                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "EvaluationApprovalVp":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
                if (resp.data?.data) {
                  const data = resp.data?.data;
                  if (data.requestTypeName !== "Document") {
                    const updatedTasks = data.tasklist.map((task) => {
                      task.showPreviousTasks = false;
                      task.riskAnalysisList = data.riskAnalysisList.filter(
                        (ra) => ra.changeImapactId === task.changeImapactId
                      );
                      return task;
                    });

                    setTasks(updatedTasks);
                    loadRiskAnalysisChart(updatedTasks);
                    apiAuth
                      .get(
                        `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                      )
                      .then((resp) => {
                        setCountApprove3(resp.data.data);
                      });
                  }
                }
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(
                  `/ApprovalManager/RemarksbyRequest/${resp.data.data.activity.uid}`
                )
                .then((resp) => {
                  setIsLoading(false);

                  setRemarkRequest(resp.data.data);
                  apiAuth
                    .get(
                      `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                    )
                    .then((resp) => {
                      setCountApprove3(resp.data.data);
                    });
                });
            });
            break;
          case "EvaluationApprovalVpHse":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
                if (resp.data?.data) {
                  const data = resp.data?.data;
                  if (data.requestTypeName !== "Document") {
                    const updatedTasks = data.tasklist.map((task) => {
                      task.showPreviousTasks = false;
                      task.riskAnalysisList = data.riskAnalysisList.filter(
                        (ra) => ra.changeImapactId === task.changeImapactId
                      );
                      return task;
                    });

                    setTasks(updatedTasks);
                    loadRiskAnalysisChart(updatedTasks);
                    apiAuth
                      .get(
                        `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                      )
                      .then((resp) => {
                        setCountApprove4(resp.data.data);
                      });
                  }
                }
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(
                  `/ApprovalManager/RemarksbyRequest/${resp.data.data.activity.uid}`
                )
                .then((resp) => {
                  setIsLoading(false);

                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "ImplementationApproval":
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setIsLoading(false);

              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
            });
            apiAuth
              .get(`/ChangeRequest/RequestDetails?id=${assetEvaluationId}`)
              .then((resp) => {
                setContentDetailsPssr(resp.data.data);
              });
            break;
          case "ImplementationApprovalSite":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(`/ApprovalManager/Remark/${resp.data.data.activity.uid}`)
                .then((resp) => {
                  setIsLoading(false);

                  setApprovalManager(resp.data?.data);
                });
            });

            break;
          case "ImplementationApprovalCoorp":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(`/ApprovalManager/Remark/${resp.data.data.activity.uid}`)
                .then((resp) => {
                  setIsLoading(false);

                  setApprovalManager(resp.data?.data);
                  apiAuth
                    .get(
                      `/DocumentManager/DocumentCount?id=${uid}&documentType=Approval`
                    )
                    .then((resp) => {
                      setCountApprove(resp.data.data);
                    });
                });
            });

            break;
          case "ImplementationApprovalDiv":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(`/ApprovalManager/Remark/${resp.data.data.activity.uid}`)
                .then((resp) => {
                  setIsLoading(false);

                  setApprovalManager(resp.data?.data);
                });
            });

            break;
          case "ImplementationApprovalHse":
            apiAuth
              .get(`/ChangeRequest/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setIsLoading(false);

                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp?.data?.data);
              });
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
              apiAuth
                .get(`/ApprovalManager/Remark/${resp.data.data.activity.uid}`)
                .then((resp) => {
                  setIsLoading(false);

                  setApprovalManager(resp.data?.data);
                });
            });

            break;

          default:
            console.log("No matching phase found");
            return;
        }
      }
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const SubmitApprovelCreate = (e, uid, name, type) => {
    if (valueRemark.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    apiAuth
      .post(`/ApprovalManager/Create/${assetEvaluationId}`, {
        actionUID: uid,
        activityUID: uid,
        formUID: changeEvaluationId,
        actionName: name,
        actionType: type,
        activityCode: appActivity.code,
        activityId: appActivity.uid,
        consultaioncomment: "",
        formType: appActivity.form,
        remark: valueRemark,
        taskscomment: "",
        version: appActivity.version,
      })
      .then((resp) => {
        setIsLoading(false);

        setValueRemark("");
        getRecords();
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleStepChange();
  }, []);

  const handelOpenSide = () => {
    setLeftSidebarOpen(true);
  };

  const [openTeamAssignment, setOpenTeamAssignment] = useState(false);

  const [siteInCharge, setSiteInCharge] = useState(null);
  const [changeLeader, setChangeLeader] = useState(null);
  const [others, setSelectedOthersStaffs] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [hseq, setHseq] = useState(null);
  const [siteInId, setSiteInChargeId] = useState();
  const [editId, setEditId] = useState("");
  const [openApprover, setOpenApprover] = useState(false);

  const handleEditApproverClose = () => {
    setOpenApprover(fasle);
  };

  const handleEditApprover = (step) => {
    // Find the matching staff based on targetUserIds
    const selectedApprover = staffList.find(
      (staff) => staff.value === step.targetUserIds[0] // Assuming only one targetUserId
    );

    // Set the selected approver in the state
    setSiteInChargeId(selectedApprover || null);
    setEditId(step.uid);
    // Open the modal
    setOpenApprover(true);
    setValidationErrors({});
  };

  const handleEdit = () => {
    setOpenTeamAssignment(true);
    apiAuth
      .get(`/ChangeRequest/TeamList?id=${assetEvaluationId}`)
      .then((resp) => {
        const team = resp.data.data;

        team.forEach((member) => {
          switch (member.teamType) {
            case 1:
              setChangeLeader(
                staffList.find((option) => option.value === member.staffId) ||
                  null
              );
              break;
            case 2:
              setHseq(
                staffList.find((option) => option.value === member.staffId) ||
                  null
              );
              break;
            case 3:
              const teams = resp.data.data;

              setSelectedOthersStaffs(
                teams
                  .filter((t) => t.teamType === 3)
                  .map((t) =>
                    staffList.find((staff) => staff.value === t.staffId)
                  )
                  .filter(Boolean) // To remove any undefined values
                  .reduce((uniqueStaffs, currentStaff) => {
                    if (
                      !uniqueStaffs.some(
                        (staff) => staff.value === currentStaff.value
                      )
                    ) {
                      uniqueStaffs.push(currentStaff);
                    }
                    return uniqueStaffs;
                  }, [])
              );
            case 4:
              setSiteInCharge(
                staffList.find((option) => option.value === member.staffId) ||
                  null
              );
              break;
            default:
              break;
          }
        });
      });
  };

  const handleCloseTeam = () => {
    setOpenTeamAssignment(false);
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
        targetUserIds: [siteInId.value],
      })
      .then((resp) => {
        toast.success("Successfully Updated");
        getRecords();

        setOpenApprover(false);
      });
  };

  const handleChangeLeaderChange = (event, newValue) => {
    setChangeLeader(newValue);

    // Clear validation error for Change Leader if the input is valid
    if (newValue) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        changeLeader: null,
      }));
    }
  };
  const handleHseqChange = (event, newValue) => {
    setHseq(newValue);

    // Clear validation error for HSEQ if the input is valid
    if (newValue) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        hseq: null,
      }));
    }
  };

  const handleOthersChange = (event, newValue) => {
    setSelectedOthersStaffs(newValue);
    if (newValue.length > 0) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        others: null,
      }));
    }
  };

  const handelUpdateTeam = () => {
    let errors = {};

    if (!siteInCharge) {
      errors.siteInCharge = "Site In Charge is required.";
    }
    if (!changeLeader) {
      errors.changeLeader = "Change Leader is required.";
    }
    if (!hseq) {
      errors.hseq = "HSEQ is required.";
    }
    if (others.length === 0) {
      errors.others = "At least one 'Others' selection is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop the API call if there are validation errors
    }
    const teamData = [];
    const addedStaffIds = new Set();
    // Collect data from Site In Charge (teamType 4)
    if (siteInCharge) {
      teamData.push({
        teamType: 4,
        staffId: siteInCharge.value,
      });
    }

    // Collect data from Change Leader (teamType 1)
    if (changeLeader) {
      teamData.push({
        teamType: 1,
        staffId: changeLeader.value,
      });
    }
    if (hseq) {
      teamData.push({
        teamType: 2,
        staffId: hseq.value,
      });
    }

    // Collect data from HSEQ (teamType 3, multiple selections)
    others.forEach((staff) => {
      if (!addedStaffIds.has(staff.value)) {
        teamData.push({
          teamType: 3,
          staffId: staff.value,
        });
        addedStaffIds.add(staff.value);
      }
    });

    apiAuth
      .put(`/ChangeRequest/EditTeam?id=${assetEvaluationId}`, teamData)
      .then((resp) => {
        setOpenTeamAssignment(false);
        setSelectedOthersStaffs([]);
        // Handle the response if needed
        toast.success("Team updated successfully");
        console.log("Team updated successfully:", resp.data);
      })
      .catch((error) => {
        toast.success("Error updating team");
        console.error("Error updating team:", error);
      });
  };
  const [showHelpmodal, setShowHelpModal] = useState(false);
  const [activityName, setActivityName] = useState("");

  const handelHelpModalOpen = (name) => {
    setActivityName(name);
    setShowHelpModal(true);
  };
  const handelHelpModalClose = () => {
    setShowHelpModal(false);
  };

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
          name={contentDetails?.projectName}
          sidemenu={true}
          setLeftSidebarOpen={setLeftSidebarOpen}
          leftSidebarOpen={leftSidebarOpen}
        />
      }
      content={
        <div className="w-full">
          {/* <ToastContainer className="toast-container" /> */}
          <>
            <div className=" p-16 pb-64 sm:p-24 ">
              {currentPhase === "InitiationRequest" && (
                <Initiation
                  contentDetails={contentDetailsIni}
                  assetEvaluationId={assetEvaluationId}
                  appActivity={appActivity}
                  contentDetailsDocu={contentDetailsIni}
                />
              )}
              {currentPhase === "InitiationApproval" && (
                <InitiationApproval
                  ApprovalDetails={contentDetails}
                  ApprovalManager={ApprovalManager}
                  Actions={appActions}
                  Activity={appActivity}
                  currentActivityForm={currentActivityForm}
                  SubmitApprovelCreate={SubmitApprovelCreate}
                  handleChangeRemark={handleChangeRemark}
                  valueRemark={valueRemark}
                  assetEvaluationId={assetEvaluationId}
                  CountApprove={CountApprove}
                  contentDetails={contentDetailsIni}
                  errorMessage={errorMessage}
                />
              )}
              {currentPhase === "InitiationComplete" && (
                <InitiationComplete
                  assetEvaluationId={assetEvaluationId}
                  AppActions={appActions}
                  AppActivity={appActivity}
                  AssetDetails={contentDetails}
                  currentActivityForm={currentActivityForm}
                  currentSummeryById={currentSummeryById}
                  setContent={setContent}
                  CountApprove={CountApprove2}
                  contentDetails={contentDetailsIni}
                  contentDetailsT={contentDetails}
                />
              )}
              {currentPhase === "InitiationApprovalProceed" && (
                <InitiationApprovalProceed
                  currentActivityForm={currentActivityForm}
                  TeamAssignmentList={TeamAssignmentList}
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  setContent={setContent}
                  contentDetails={contentDetailsIni}
                  contentDetailsT={contentDetails}
                />
              )}
              {currentPhase === "EvaluationChange" && (
                <EvaluationChange
                  TeamAssignmentList={TeamAssignmentList}
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  setContent={setContent}
                  currentActivityForm={currentActivityForm}
                  contentDetails={contentDetailsIni}
                  contentDetailsT={contentDetails}
                />
              )}
              {currentPhase === "EvaluationApproval" && (
                <EvaluationApproval
                  contentDetails={contentDetails}
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  setContentDetails={setContentDetails}
                  showRiskAnalysisChart={showRiskAnalysisChart}
                  riskAnalysisChartOptions={riskAnalysisChartOptions}
                  lastActCode={lastActCode}
                  currentActivityForm={currentActivityForm}
                  remarkRequest={remarkRequest}
                  setRemarkRequest={setRemarkRequest}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove}
                  contentDetailsT={contentDetails}
                />
              )}
              {currentPhase === "EvaluationApprovalCooprate" && (
                <EvaluationApproval
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  setContentDetails={setContentDetails}
                  contentDetails={contentDetails}
                  showRiskAnalysisChart={showRiskAnalysisChart}
                  riskAnalysisChartOptions={riskAnalysisChartOptions}
                  lastActCode={lastActCode}
                  currentActivityForm={currentActivityForm}
                  remarkRequest={remarkRequest}
                  setRemarkRequest={setRemarkRequest}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove1}
                />
              )}
              {currentPhase === "EvaluationApprovalVp" && (
                <EvaluationApproval
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  contentDetails={contentDetails}
                  setContentDetails={setContentDetails}
                  showRiskAnalysisChart={showRiskAnalysisChart}
                  riskAnalysisChartOptions={riskAnalysisChartOptions}
                  lastActCode={lastActCode}
                  currentActivityForm={currentActivityForm}
                  remarkRequest={remarkRequest}
                  setRemarkRequest={setRemarkRequest}
                  handleStepChange={handleStepChange()}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove3}
                />
              )}
              {currentPhase === "EvaluationApprovalVpHse" && (
                <EvaluationApproval
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  contentDetails={contentDetails}
                  setContentDetails={setContentDetails}
                  showRiskAnalysisChart={showRiskAnalysisChart}
                  riskAnalysisChartOptions={riskAnalysisChartOptions}
                  lastActCode={lastActCode}
                  currentActivityForm={currentActivityForm}
                  remarkRequest={remarkRequest}
                  setRemarkRequest={setRemarkRequest}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove4}
                />
              )}
              {currentPhase === "ImplementationApproval" && (
                <ImplementationApproval
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  currentActivityForm={currentActivityForm}
                  lastActCode={lastActCode}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  contentDetails={contentDetails}
                  contentDetailsPssr={contentDetailsPssr}
                />
              )}
              {currentPhase === "ImplementationApprovalSite" && (
                <ImplementationApprovalSite
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  currentActivityForm={currentActivityForm}
                  lastActCode={lastActCode}
                  showApexAndContent={showApexAndContent}
                  contentDetails={contentDetails}
                  ApprovalManager={ApprovalManager}
                  setContent={setContent}
                  setContentDetails={setContentDetails}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove}
                />
              )}
              {currentPhase === "ImplementationApprovalCoorp" && (
                <ImplementationApprovalSite
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  currentActivityForm={currentActivityForm}
                  lastActCode={lastActCode}
                  showApexAndContent={showApexAndContent}
                  contentDetails={contentDetails}
                  setContentDetails={setContentDetails}
                  ApprovalManager={ApprovalManager}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove}
                />
              )}
              {currentPhase === "ImplementationApprovalDiv" && (
                <ImplementationApprovalSite
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  currentActivityForm={currentActivityForm}
                  lastActCode={lastActCode}
                  showApexAndContent={showApexAndContent}
                  contentDetails={contentDetails}
                  setContentDetails={setContentDetails}
                  ApprovalManager={ApprovalManager}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove}
                />
              )}

              {currentPhase === "ImplementationApprovalHse" && (
                <ImplementationApprovalSite
                  AppActions={appActions}
                  AppActivity={appActivity}
                  assetEvaluationId={assetEvaluationId}
                  currentActivityForm={currentActivityForm}
                  lastActCode={lastActCode}
                  showApexAndContent={showApexAndContent}
                  contentDetails={contentDetails}
                  setContentDetails={setContentDetails}
                  ApprovalManager={ApprovalManager}
                  setContent={setContent}
                  contentDetailsini={contentDetailsIni}
                  CountApprove={CountApprove}
                />
              )}
            </div>
          </>
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <>
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
                {resp.name != "Approval" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "end",
                    }}
                  >
                    <Tooltip
                      title="Help"
                      arrow
                      onClick={() => handelHelpModalOpen(resp.name)}
                    >
                      <HelpOutlineIcon
                        style={{ color: "#607d8b", marginLeft: "8px" }}
                      />{" "}
                      Help
                    </Tooltip>
                  </div>
                )}
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
                              {/* {!step?.isComplete && (
                                <span className="cursor-pointer">
                                  <FuseSvgIcon
                                    size={20}
                                    onClick={() => handleEditApprover(step)}
                                  >
                                    heroicons-solid:pencil
                                  </FuseSvgIcon>
                                </span>
                              )} */}
                              {console.log(step.name, "looooooooooo")}
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
          {/* <Accordion
            style={{ margin: "0px" }}
            expanded={false} // This keeps the Accordion from expanding
          >
            <AccordionSummary
              style={{ minHeight: "60px" }}
              onClick={(event) => event.stopPropagation()} // Prevents the default expand behavior
            >
              <FuseSvgIcon size={20} onClick={() => handleEdit()}>
                heroicons-solid:pencil
              </FuseSvgIcon>
            </AccordionSummary>
          </Accordion> */}

          <HelpModal
            showHelpmodal={showHelpmodal}
            handelHelpModalClose={handelHelpModalClose}
            activityName={activityName}
          />

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openTeamAssignment}
            onClose={handleCloseTeam}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={openTeamAssignment}>
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
                      Edit Team {""}
                    </span>
                    <span
                      onClick={handleCloseTeam}
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
                        value={siteInCharge}
                        onChange={
                          handleSiteInChargeChange
                          // (event, newValue) => setSiteInCharge(newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Site In Charge"
                            error={!!validationErrors.siteInCharge}
                            helperText={validationErrors.siteInCharge}
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
                  <Box
                    component="form"
                    sx={{ "& > :not(style)": { m: 1, marginTop: "30px" } }}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth>
                      <Autocomplete
                        id="changeLeader"
                        options={staffList}
                        getOptionLabel={(option) => option.text}
                        value={changeLeader}
                        onChange={handleChangeLeaderChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Change Leader"
                            error={!!validationErrors.changeLeader}
                            helperText={validationErrors.changeLeader}
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

                  <Box
                    component="form"
                    sx={{ "& > :not(style)": { m: 1, marginTop: "30px" } }}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth>
                      <Autocomplete
                        id="hseq"
                        options={staffList}
                        getOptionLabel={(option) => option.text}
                        value={hseq}
                        onChange={
                          handleHseqChange
                          // (event, newValue) => setHseq(newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="HSEQ"
                            error={!!validationErrors.hseq}
                            helperText={validationErrors.hseq}
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

                  <Box
                    component="form"
                    sx={{ "& > :not(style)": { m: 1, marginTop: "30px" } }}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth>
                      <Autocomplete
                        multiple
                        id="hseq-autocomplete"
                        options={staffList}
                        getOptionLabel={(option) => option.text}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        value={others}
                        onChange={
                          handleOthersChange
                          //   (event, newValue) => {
                          //   setSelectedOthersStaffs(newValue);
                          // }
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Others"
                            fullWidth
                            error={!!validationErrors.others}
                            helperText={validationErrors.others}
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} key={option.value}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option.text} />
                          </li>
                        )}
                        renderTags={(value) => {
                          const selectedNames = value
                            .map((option) => option.text)
                            .join(", ");
                          return <span>{selectedNames}</span>;
                        }}
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
                    onClick={handleCloseTeam}
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
                    onClick={handelUpdateTeam}
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
        </>
      }
      scroll="content"
      ref={pageLayout}
    />
  );
};

export default AssetCourse;
