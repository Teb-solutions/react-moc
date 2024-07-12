import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormHelperText,
  FormLabel,
  Step,
  StepContent,
  StepLabel,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import Box from "@mui/material/Box";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ToastContainer, toast } from "react-toastify";
import CourseProgress from "../CourseProgress";
import MocHeader from "../MocHeader";
import { apiAuth } from "src/utils/http";
// import AssetPhasesEnum from "../evaluation/course/docPhaseEnum";
import Initiation from "../components/Initiation";
import AssetPhasesEnum from "./assetPhaseEnum";
import InitiationApproval from "../components/InitiationApproval";
import InitiationComplete from "../components/initiationComplete";
import InitiationApprovalProceed from "../components/InitiationApproveProceed";
import EvaluationChange from "../components/EvaluationChange";
import EvaluationApproval from "../components/EvaluationApproval";
import ImplementationApproval from "../components/ImplementationApproval";
import ImplementationApprovalSite from "../components/ImplementationApprovalSite";

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * The Course page.
 */
const AssetCourse = () => {
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { assetEvaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});

  // const [AssetDetails, setAssetDetails] = useState({});
  const [currentSummeryById, setCurrentSummeryById] = useState({});
  const [changeEvaluationId, setChangeEvaluationId] = useState();
  const [TeamAssignmentList, setTeamAssignmentList] = useState([]);

  const [handelUrlChange, setHandelUrlChange] = useState({
    urlRemarks: "",
  });
  const [listDocument, setListDocument] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = (id) => {
    apiAuth
      .get(
        `DocumentManager/DocList/${id}/Task?changeRequestToken=${evaluationId}`
      )
      .then((response) => {
        setListDocument(response?.data?.data);
      });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [ChangeEvaluationDetail, setChangeEvaluationDetail] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [CheckLists, setCheckLists] = useState([]);
  const [evalActions, setEvalActions] = useState([]);
  const [evalActivity, setEvalActivity] = useState({});
  const [appActions, setAppActions] = useState([]);
  const [appActivity, setAppActivity] = useState({});
  const [impActions, setImpActions] = useState([]);
  const [impActivity, setImpActivity] = useState({});
  const [closeActions, setCloseActions] = useState([]);
  const [closeActivity, setCloseActivity] = useState({});
  const [addStake, setAddStake] = useState(false);
  const [docStaff, setDocStaff] = useState([]);
  const [particular, setParticular] = useState([]);
  const [particularSub, setParticularSub] = useState([]);
  const [impComments, setImpComments] = useState([]);
  const [currentActivityForm, setCurrentActivityForm] = useState({});
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [fileName, setFileName] = useState("");
  const [documentCounts, setDocumentCounts] = useState({});
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [errors, setErrors] = useState([]);
  const [errorsUrl, setErrorsUrl] = useState({});
  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [ApprovalManager, setApprovalManager] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");

  const handleExpansionChange = () => {
    setExpanded(!expanded);
  };
  const [forms, setForms] = useState([
    {
      id: Date.now(),
      data: { consultedDate: new Date(), consultedStaffId: "" },
    },
  ]);
  const [value, setValue] = useState(0);
  const [valueRemark, setValueRemark] = useState("");
  const [remarkRequest, setRemarkRequest] = useState([]);
  const [data, setData] = useState({
    consultedDate: null,
    consultedStaffId: "",
    changeEvaluationId: 0,
    changeRequestId: 0,
    comments: "",
    consultedStaffDesignationId: "",
    id: 0,
    isActive: true,
    isEditable: true,
    taskReviewId: "",
  });

  const [taskAdd, setTaskAdd] = useState({
    particular: 0,
    particularSubCategory: 0,
    impacHazards: "",
    taskassignedto: "",
    dueDate: new Date(),
    actionHow: "",
    actionWhat: "",
    audit: "",
    assignedStaffId: 1,
    otherDetail: "",
    changeImpactHazard: "",

    ChangeImapactId: 0,
    changeEvaluationId: 0,
    deadline: 1,
    hazardDetail: "",
    isShowDetail: "",
    parentId: "0",
  });

  const [openImplemntationTask, setOpenImplemntationTask] = useState(false);
  const [comments, setComments] = useState("");
  const [reviewed, setReviewed] = useState({});
  const [errorss, setErrorStake] = useState("");
  const [handelApprover, setHandelApprover] = useState({
    approver: "",
  });
  const [showApexAndContent, setShowApexAndContent] = useState(false);

  const handleOpenImplemntationTask = () => {
    setOpenImplemntationTask(true);
    apiAuth.get(`Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticular(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {});
  };

  const handleCloseImplemntationTask = () => setOpenImplemntationTask(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeApprover = (e) => {
    const { name, value } = e.target;
    setHandelApprover((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeAddTask = (e) => {
    const { name, value } = e.target;
    setTaskAdd((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errorsAddTask[name]) {
      setErrorsAddTask({ ...errorsAddTask, [name]: "" });
    }

    if (e.target.name == "particular") {
      apiAuth.get(`/LookupData/Lov/17/${e.target.value}`).then((resp) => {
        setParticularSub(resp.data.data);
      });
    }
  };

  const validateAddTask = () => {
    let tempErrors = {};

    if (!taskAdd.particular)
      tempErrors.particular = "Particular Name is required";
    if (!taskAdd.particularSubCategory)
      tempErrors.particularSubCategory = "particular SubCategory  is required";
    if (!taskAdd.impacHazards)
      tempErrors.impacHazards = "impact Hazards  is required";
    if (!taskAdd.actionHow) tempErrors.actionHow = "  Action How  is required";
    if (!taskAdd.actionWhat)
      tempErrors.actionWhat = "  Action What is required";
    if (!taskAdd.taskassignedto)
      tempErrors.taskassignedto = "Task Assigned Field is required";
    if (!taskAdd.dueDate) tempErrors.dueDate = "Date Field is required";
    if (!taskAdd.audit) tempErrors.audit = "Audit Field is required";

    // Add other validations here
    setErrorsAddTask(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handelTaskSubmit = (e) => {
    if (validateAddTask()) {
      apiAuth
        .put(`ChangeImpact/Create/Task/${evaluationId}`, taskAdd)
        .then((resp) => {
          setOpenImplemntationTask(false);
          setTaskAdd({
            particular: "",
            particularSubCategory: "",
            impacHazards: "",
            taskassignedto: "",
            dueDate: new Date(),
            actionHow: "",
            actionWhat: "",
            audit: "",
            assignedStaffId: "",
            otherDetail: "",
            changeImpactHazard: "",
          });
        });
      getRecords();
    }
  };

  const handleChangeRemark = (event) => {
    setValueRemark(event.target.value);
  };

  const handleChangeStaffDate = (id, date) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, data: { ...form.data, consultedDate: date } }
          : form
      )
    );
    setErrors((prevErrors) =>
      prevErrors.map((error, index) =>
        forms[index].id === id ? { ...error, consultedDate: "" } : error
      )
    );
  };

  const handleChangeTaskDate = (date) => {
    setTaskAdd((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const handleChangeStaff = (id, event) => {
    const { name, value } = event.target;
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, data: { ...form.data, [name]: value } }
          : form
      )
    );
    setErrors((prevErrors) =>
      prevErrors.map((error, index) =>
        forms[index].id === id ? { ...error, [name]: "" } : error
      )
    );
  };

  const validate = () => {
    let tempErrors = forms.map((form) => ({
      consultedDate: !form.data.consultedDate
        ? "Consulted Date is required"
        : "",
      consultedStaffId: !form.data.consultedStaffId ? "Staff is required" : "",
    }));

    setErrors(tempErrors);
    return tempErrors.every(
      (error) => !error.consultedDate && !error.consultedStaffId
    );
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formattedForms = forms.map((form) => {
        const date = form.data.consultedDate;
        let formattedDate = null;

        if (date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1); // Month is zero-based
          const year = date.getFullYear();
          formattedDate = `${month}/${day}/${year}`;
        }

        return {
          ...data, // Assuming 'data' contains common fields
          consultedDate: formattedDate,
          consultedStaffId: form.data.consultedStaffId,
        };
      });

      apiAuth
        .post(
          `/ChangeEvaluationConsultation/Create/${changeEvaluationId}/${evaluationId}`,
          formattedForms
        )
        .then((response) => {
          getRecords();
          apiAuth
            .get(
              `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${changeEvaluationId}`
            )
            .then((resp) => {
              setChangeEvaluationDetail(resp.data?.data);
              setAddStake(false);
            });
        })
        .catch((error) => {});
    }
  };

  const handleAddForm = () => {
    const newForms = [
      ...forms,
      { id: Date.now(), data: { consultedDate: null, consultedStaffId: "" } },
    ];
    setForms(newForms);
    if (newForms.length > 1) {
      setErrorStake("");
    }
  };

  const handleRemoveForm = (id) => {
    const newForms = forms.filter((form) => form.id !== id);
    setForms(newForms);
    if (newForms.length <= 1)
      setErrorStake("At least one stakeholder is required.");
  };

  const handelNewForm = () => {
    handleAddForm();
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

  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1100px",
    maxWidth: "80vw",
    height: "57%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  const styleImp = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxWidth: "80vw",
    height: "74%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
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
    transition: "right 0.3s ease", // Smooth transition for opening/closing
  });

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

  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

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
  }
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
            borderColor: "#000",
            fillColor: "#fe1919",
            opacity: 0.2,
          },
          {
            y: 200,
            y2: 400,
            borderColor: "#000",
            fillColor: "#FEB019",
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
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
              });
            break;
          case "InitiationApproval":
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
                      setApprovalManager(resp.data?.data);
                    });
                });
              });

            break;
          case "InitiationComplete":
            apiAuth
              .get(`/ChangeSummary/Get?id=${assetEvaluationId}`)
              .then((resp) => {
                setCurrentSummeryById(resp.data.data);
                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                });
              });

            break;
          case "InitiationApprovalProceed":
            apiAuth
              .get(`TeamAssignment/List?id=${assetEvaluationId}`)
              .then((resp) => {
                setTeamAssignmentList(resp.data.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                });
              });
            break;
          case "EvaluationChange":
            apiAuth
              .get(`TeamAssignment/List?id=${assetEvaluationId}`)
              .then((resp) => {
                setTeamAssignmentList(resp.data.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                });
              });
            break;
          case "EvaluationApproval":
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
                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "EvaluationApprovalCooprate":
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
                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "EvaluationApprovalVp":
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
                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "EvaluationApprovalVpHse":
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
                  setRemarkRequest(resp.data.data);
                });
            });
            break;
          case "ImplementationApproval":
            apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
              setAppActions(resp.data.data.actions);
              setAppActivity(resp.data.data.activity);
            });
            break;
          case "ImplementationApprovalSite":
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
                  setApprovalManager(resp.data?.data);
                });
            });

            break;
          case "ImplementationApprovalCoorp":
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

  // Update the onClick event to pass the necessary parameters
  const handleUrlChange = (event) => {
    setHandelUrlChange({
      ...handelUrlChange,
      urlRemarks: event.target.value,
    });
    setErrorsUrl({});
  };

  const validateUrl = () => {
    let tempErrors = {};

    // Add validation logic here
    if (!handelUrlChange.urlRemarks) {
      tempErrors.handelUrlChange = "Consolidated Document Url is required";
    }

    // Update the state with errors
    setErrorsUrl(tempErrors);

    // Return true if there are no errors
    return Object.keys(tempErrors).length === 0;
  };
  const handelUrlUpdate = (e) => {
    e.preventDefault();
    if (validateUrl()) {
      apiAuth
        .post(`/DocMoc/UpdateEvaluationDocumentDetails/${changeEvaluationId}`, {
          ConsolidatedDocumentUrl: handelUrlChange.urlRemarks,
        })
        .then((resp) => {
          toast.success("  Consolidated Document url successfully updated");
        });
    } else {
      toast.error("Concolidated Document Url is not valid");
    }
  };

  const SubmitApprovel = (e, uid) => {
    if (forms.length < 1) {
      toast.error("At least one stakeholder is required.");
    }
    apiAuth
      .get(
        `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${changeEvaluationId}`
      )
      .then((resp) => {
        const data = resp.data.data; // Assuming resp contains your data array
        // debugger;
        // Check if any object in data has an empty tasks array
        const hasEmptyComment = data.some((item) => item.comments === "");
        if (resp.data.data.length === 0) {
          toast.error("Minimum One stakeholders Required");
        } else {
          if (hasEmptyComment) {
            toast.error("All stakeholders must update the task");
          } else {
            apiAuth
              .post(
                `/DocMoc/EvaluationSubmitForApproval/${changeEvaluationId}`,
                {
                  actionUID: uid,
                  activityUID: evalActivity.uid,
                  formUID: changeEvaluationId,
                }
              )
              .then((resp) => {
                location.reload();
              });
          }
        }
      });
  };
  const SubmitApprovelCreate = (e, uid, name, type) => {
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
        setValueRemark("");
        getRecords();
      });
  };
  const SubmitImpCreate = (e, uid) => {
    apiAuth
      .get(`/ChangeImpact/ListTask?id=${assetEvaluationId}`)
      .then((resp) => {
        if (handelApprover.approver == "") {
          toast.error("Select an approver");
        } else {
          toast.success("MOC has Created");
          apiAuth
            .post(
              `/DocMoc/ImplementationSubmit/${assetEvaluationId}/${handelApprover.approver}`,
              {
                actionUID: uid,
                activityUID: impActivity.uid,

                formUID: impActivity.formUID,
              }
            )
            .then((resp) => {
              getRecords();
            });
        }
      });
  };

  const handelAddStake = () => {
    setErrorStake("");

    setAddStake(true);

    apiAuth
      .get(`/ApprovalManager/LOV/${assetEvaluationId}/1/Consultaion`)
      .then((resp) => {
        apiAuth.get(`/Staff/LOV`).then((resp) => {
          setDocStaff(resp.data.data);
          apiAuth.get(`/LookupData/Lov/5`).then((resp) => {});
        });
      });
  };

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
      notes: comments,
      submissionList: [impComments],
      ChangeEvaluationId: 0,
      ParentId: 0,
      taskStatus: 3,
    };

    apiAuth
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
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
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
        console.error(error);
      });
  };

  const handleCheckboxChange = (id) => {
    const updatedCheckList = CheckLists.map((item) => {
      if (item.id === id) {
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });
    setCheckLists(updatedCheckList);
  };

  const saveChanges = () => {
    apiAuth
      .post(
        `/DocMoc/UpdateImplementationChecklist/${assetEvaluationId}`,
        CheckLists
      )
      .then((response) => {
        toast.success("Checklist successfully updated");
        setOpen(false);
        console.log(response);
      });
  };
  const handelreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ImpReviewStatus/${assetEvaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        console.log(response);
      });
  };

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

  const handelCommentImp = (id) => {
    apiAuth
      .put(`/Task/ImpAddReview/${id}/IMPL_APPROVAL_VP_DIV`, {
        remark: handelCommentRemark,
      })
      .then((resp) => {
        setHandelCommentRemark("");
        getRecords();
      });
  };

  const handelCloseMoc = (uid) => {
    apiAuth
      .post(`/DocMoc/ImplementationSubmit/${assetEvaluationId}/22`, {
        actionUID: uid,
        activityUID: closeActivity.uid,

        formUID: closeActivity.formUID,
      })
      .then((resp) => {
        toast.success("MOC Successfully Closed");
        setTimeout(() => {
          getRecords();
        }, 3000);
      });
  };
  useEffect(() => {
    handleStepChange();
  }, []);

  return (
    <FusePageSimple
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />

          <div className="flex justify-center p-16 pb-64 sm:p-24 ">
            {currentPhase === "InitiationRequest" && (
              <Initiation
                contentDetails={contentDetails}
                assetEvaluationId={assetEvaluationId}
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
                contentDetails={contentDetails}
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
              />
            )}
            {currentPhase === "InitiationApprovalProceed" && (
              <InitiationApprovalProceed
                currentActivityForm={currentActivityForm}
                TeamAssignmentList={TeamAssignmentList}
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
              />
            )}
            {currentPhase === "EvaluationChange" && (
              <EvaluationChange
                TeamAssignmentList={TeamAssignmentList}
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
              />
            )}
            {currentPhase === "EvaluationApproval" && (
              <EvaluationApproval
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
                contentDetails={contentDetails}
                showRiskAnalysisChart={showRiskAnalysisChart}
                riskAnalysisChartOptions={riskAnalysisChartOptions}
                lastActCode={lastActCode}
                currentActivityForm={currentActivityForm}
                remarkRequest={remarkRequest}
                setRemarkRequest={setRemarkRequest}
              />
            )}
            {currentPhase === "EvaluationApprovalCooprate" && (
              <EvaluationApproval
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
                contentDetails={contentDetails}
                showRiskAnalysisChart={showRiskAnalysisChart}
                riskAnalysisChartOptions={riskAnalysisChartOptions}
                lastActCode={lastActCode}
                currentActivityForm={currentActivityForm}
                remarkRequest={remarkRequest}
                setRemarkRequest={setRemarkRequest}
              />
            )}
            {currentPhase === "EvaluationApprovalVp" && (
              <EvaluationApproval
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
                contentDetails={contentDetails}
                showRiskAnalysisChart={showRiskAnalysisChart}
                riskAnalysisChartOptions={riskAnalysisChartOptions}
                lastActCode={lastActCode}
                currentActivityForm={currentActivityForm}
                remarkRequest={remarkRequest}
                setRemarkRequest={setRemarkRequest}
              />
            )}
            {currentPhase === "EvaluationApprovalVpHse" && (
              <EvaluationApproval
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
                contentDetails={contentDetails}
                showRiskAnalysisChart={showRiskAnalysisChart}
                riskAnalysisChartOptions={riskAnalysisChartOptions}
                lastActCode={lastActCode}
                currentActivityForm={currentActivityForm}
                remarkRequest={remarkRequest}
                setRemarkRequest={setRemarkRequest}
              />
            )}
            {currentPhase === "ImplementationApproval" && (
              <ImplementationApproval
                AppActions={appActions}
                AppActivity={appActivity}
                assetEvaluationId={assetEvaluationId}
                currentActivityForm={currentActivityForm}
                lastActCode={lastActCode}
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
                ApprovalManager={ApprovalManager}
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

export default AssetCourse;
