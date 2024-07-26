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
import { apiAuth } from "src/utils/http";
import CourseProgress from "../../../moc/CourseProgress";
import MocHeader from "../../MocHeader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DocPhasesEnum from "./docPhaseEnum";
import { ToastContainer, toast } from "react-toastify";
import FuseLoading from "@fuse/core/FuseLoading";
import CustomStepIcon from "../../CustomStepIcon";

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
function Course() {
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { evaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});
  const [contentDetailsIni, setContentDetailsIni] = useState({});

  const [changeEvaluationId, setChangeEvaluationId] = useState();
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
  const [isLoading, setIsLoading] = useState(true);

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

  const handleOpenImplemntationTask = () => {
    setOpenImplemntationTask(true);
    apiAuth.get(`Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticular(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {
      setParticularSub(resp.data.data);
    });
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
    apiAuth.get(`/Activity/RequestLifecycle/${evaluationId}`).then((resp) => {
      setIsLoading(false);
      setContent(resp.data.data.phases);
      setValueRemark("");
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
      setCurrentActivityForm(matchingActivity);

      if (matchingActivity) {
        let actualPhaseName;

        switch (matchingActivity.form) {
          case DocPhasesEnum.INITIATION:
            actualPhaseName = "Initiation";
            break;
          case DocPhasesEnum.EVALUATION:
            actualPhaseName = "Evaluation";
            break;
          case DocPhasesEnum.APPROVAL:
            actualPhaseName = "Approval";
            break;
          case DocPhasesEnum.IMPLEMENTATION:
            actualPhaseName = "Implementation";
            break;
          case DocPhasesEnum.DOCIMPLCLOSURE:
            actualPhaseName = "docimplclosure";
            break;
          default:
            actualPhaseName = "docimplclosure";
        }

        setCurrentPhase(actualPhaseName);
        setCurrentPhaseName(phaseName);

        switch (actualPhaseName) {
          case "Initiation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            break;
          case "Evaluation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/ChangeEvaluation/Get/${evaluationId}/${matchingActivity?.formUID ? matchingActivity?.formUID : null}/${matchingActivity.version}`
              )
              .then((resp) => {
                const evaluationIds = resp.data.data.id;
                setContentDetails(resp.data?.data);
                setChangeEvaluationId(resp.data?.data.id);
                setHandelUrlChange({
                  urlRemarks: resp.data?.data.remarks,
                });

                apiAuth
                  .get(
                    `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${evaluationIds}`
                  )
                  .then((resp) => {
                    setChangeEvaluationDetail(resp.data?.data);
                    apiAuth
                      .get(`/Activity/ActivityDetails/${uid}`)
                      .then((resp) => {
                        setEvalActions(resp.data.data.actions);
                        setEvalActivity(resp.data.data.activity);
                      });
                  });
              });
            break;
          case "Approval":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
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
          case "Implementation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setImpActions(resp.data.data.actions);
                  setImpActivity(resp.data.data.activity);
                });
                apiAuth.get(`/Staff/LOV`).then((resp) => {
                  setDocStaff(resp.data.data);
                  apiAuth
                    .get(`DocMoc/GetImplementation/${evaluationId}`)
                    .then((resp) => {
                      setTaskLists(resp.data.data.taskList);
                      setCheckLists(resp.data.data.checkList);
                    });
                });
              });
            break;
          case "docimplclosure":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setCloseActions(resp.data.data.actions);
                  setCloseActivity(resp.data.data.activity);
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
      .post(`/ApprovalManager/Create/${evaluationId}`, {
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
    apiAuth.get(`/ChangeImpact/ListTask?id=${evaluationId}`).then((resp) => {
      if (handelApprover.approver == "") {
        toast.error("Select an approver");
      } else {
        toast.success("MOC has Created");
        apiAuth
          .post(
            `/DocMoc/ImplementationSubmit/${evaluationId}/${handelApprover.approver}`,
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
      .get(`/ApprovalManager/LOV/${evaluationId}/1/Consultaion`)
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
      .post(`ChangeImpact/ActionTask?id=${evaluationId}`, updatedTask)
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
      .post(`ChangeImpact/ActionTask?id=${evaluationId}`, updatedTask)
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
      .post(`/DocMoc/UpdateImplementationChecklist/${evaluationId}`, CheckLists)
      .then((response) => {
        toast.success("Checklist successfully updated");
        setOpen(false);
        console.log(response);
      });
  };
  const handelreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ImpReviewStatus/${evaluationId}`, {
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
      .post(`/DocMoc/ImplementationSubmit/${evaluationId}/22`, {
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

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageSimple
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />
          <SwipeableViews>
            <>
              <div className=" p-16 pb-64 sm:p-24 ">
                <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
                  <div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                    >
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        MOC Document Request
                      </h2>
                    </div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="p-30 pt-24 pb-24 ng-star-inserted"
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                            {contentDetailsIni?.requestNo}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Date
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {formatDate(contentDetailsIni?.requestDate)}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Site In Charge
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.siteInChargeName}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Site
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.siteName}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Division
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.divisionName}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Function
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.functionName}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                            {contentDetailsIni?.typeString}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Name
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.projectName}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Description
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.projectDescription}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Type
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni.isNewDocument == true
                              ? "New"
                              : "Existing"}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Reason for New Document
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.reasonForNewDocument}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Doc Controller
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetailsIni?.docControllerName}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Url
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            <a
                              _ngcontent-fyk-c288=""
                              target="_blank"
                              class="text-blue-500 hover:text-blue-800"
                              style={{ background: "none", color: "blue" }}
                              href={contentDetailsIni?.documentUrl}
                            >
                              {contentDetailsIni?.documentUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>&nbsp;</div>

                    <div className="flex items-center justify-between w-full p-30 pt-24 pb-24 border-t">
                      <button className="ml-1 sm:inline-flex cursor-pointer mat-button mat-stroked-button mat-button-base">
                        <span className="mat-button-wrapper">
                          {/* <h1 className="mat-icon notranslate icon-size-4 mat-icon-no-color mr-3 justify-center" /> */}
                          <Button
                            className="whitespace-nowrap "
                            style={{
                              border: "1px solid",
                              backgroundColor: "#0000",
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
                            onClick={handleOpen}
                          >
                            Document
                          </Button>

                          {/* <Modal
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
                                    <Box sx={{ flex: 1 }}>
                                      <Box
                                        className="flex justify-between"
                                        style={{ margin: "30px" }}
                                      >
                                        <Typography
                                          id="transition-modal-title"
                                          variant="h6"
                                          component="h2"
                                          style={{
                                            fontSize: "3rem",
                                          }}
                                        >
                                          File Manager
                                        </Typography>
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
                        <h6>{doc?.name}</h6>
                        <h6>by {doc?.staffName}</h6>
                      </div>
                    </div>
                  ))}
                </Typography>
                 </Box>
                                    </Box>
                                  </Box>
                                </Fade>
                              </Modal> */}
                        </span>
                      </button>
                    </div>
                  </div>
                </Paper>

                {currentPhase === "Evaluation" && (
                  <>
                    <Paper
                      className="w-full mx-auto rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "0", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Evaluation
                        </h2>
                      </div>
                      <div className="p-30 pt-24 pb-0">
                        {!addStake ? (
                          <div className="mb-10">
                            <b>Stakeholders</b>
                          </div>
                        ) : (
                          <div className="font-semibold">
                            <a
                              rel="noopener noreferrer"
                              onClick={() => setAddStake(false)}
                            >
                              Back to Stakeholders List
                            </a>
                          </div>
                        )}
                        {canEdits &&
                          !addStake &&
                          ChangeEvaluationDetail.map((list) => (
                            <Accordion style={{ margin: "0px" }}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                style={{ minHeight: "60px" }}
                              >
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "40%" }}
                                >
                                  <div className="flex items-center">
                                    <img
                                      src="/assets/images/etc/userpic.png"
                                      alt="Card cover image"
                                      className="rounded-full mr-4"
                                      style={{ width: "4rem", height: "4rem" }}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-semibold leading-none">
                                        {list?.staff}
                                      </span>
                                      <span className="text-sm text-secondary leading-none pt-5">
                                        Consulted on{" "}
                                        {formatDate(list?.consultedDate)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                  <div className="flex items-center">
                                    <div
                                      className="py-0.5 px-3 rounded-full text-sm"
                                      style={{
                                        backgroundColor:
                                          list.comments == "" ||
                                          list.comments == null
                                            ? "rgba(252,165,165)"
                                            : "rgba(134,239,172)",
                                        padding: "5px",
                                      }}
                                    >
                                      {list.comments === ""
                                        ? "No Comments Added"
                                        : list.comments}
                                    </div>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stepper orientation="vertical">
                                  <Step>
                                    <div className="mat-expansion-panel-body ng-tns-c137-15">
                                      <div className="mt-2 ng-tns-c137-15">
                                        <div className="prose prose-sm max-w-5xl">
                                          <div className="ng-star-inserted">
                                            <span
                                              className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                              style={{
                                                padding: "10px",
                                              }}
                                            >
                                              {list.comments === ""
                                                ? "No Comments Added"
                                                : list.comments}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Step>
                                </Stepper>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        {!canEdits &&
                          ChangeEvaluationDetail.map((list) => (
                            <Accordion style={{ margin: "0px" }}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                style={{ minHeight: "60px" }}
                              >
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "40%" }}
                                >
                                  <div className="flex items-center">
                                    <img
                                      src="/assets/images/etc/userpic.png"
                                      alt="Card cover image"
                                      className="rounded-full mr-4"
                                      style={{ width: "4rem", height: "4rem" }}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-semibold leading-none">
                                        {list?.staff}
                                      </span>
                                      <span className="text-sm text-secondary leading-none pt-5">
                                        Consulted on{" "}
                                        {formatDate(list?.consultedDate)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                  <div className="flex items-center">
                                    <div
                                      className="py-0.5 px-3 rounded-full text-sm"
                                      style={{
                                        backgroundColor:
                                          list.comments == "" ||
                                          list.comments == null
                                            ? "rgba(252,165,165)"
                                            : "rgba(134,239,172)",
                                        padding: "5px",
                                      }}
                                    >
                                      {list.comments === ""
                                        ? "No Comments Added"
                                        : "Comments Added"}
                                    </div>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stepper orientation="vertical">
                                  <Step>
                                    <div className="mat-expansion-panel-body ng-tns-c137-15">
                                      <div className="mt-2 ng-tns-c137-15">
                                        <div className="prose prose-sm max-w-5xl">
                                          {list.comments ? (
                                            <div className="ng-star-inserted">
                                              <span
                                                className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                                style={{
                                                  backgroundColor:
                                                    "rgba(241,245,249)",
                                                  padding: "10px",
                                                }}
                                              >
                                                Comments
                                              </span>
                                              <span>complete</span>
                                            </div>
                                          ) : (
                                            <div className="ng-star-inserted">
                                              <span
                                                className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                                style={{
                                                  backgroundColor:
                                                    "rgba(241,245,249)",
                                                  padding: "10px",
                                                }}
                                              >
                                                No Comments Added
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Step>
                                </Stepper>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        {!ChangeEvaluationDetail.length && (
                          <div className="mt-5 mb-4 p-6 py-2">
                            <h5>
                              {errorss ? (
                                <b className="text-red">{errorss}</b>
                              ) : (
                                "No stakeholders added"
                              )}
                            </h5>
                          </div>
                        )}
                      </div>
                      {addStake &&
                        forms.map((form, index) => (
                          <div
                            style={{
                              marginTop: "30px",
                              justifyContent: "space-start",
                            }}
                            className="flex flex-row "
                            key={index}
                          >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <FormControl
                                sx={{
                                  marginLeft: "10px",
                                }}
                              >
                                <Box sx={{}}>
                                  <DatePicker
                                    label="Validity Expires On *"
                                    name="consultedDate"
                                    value={form.data.consultedDate}
                                    onChange={(date) =>
                                      handleChangeStaffDate(form.id, date)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        fullWidth
                                        {...params}
                                        error={!!errors[index]?.consultedDate}
                                      />
                                    )}
                                  />
                                </Box>
                                {errors[index]?.consultedDate && (
                                  <span style={{ color: "red" }}>
                                    {errors[index].consultedDate}
                                  </span>
                                )}
                              </FormControl>
                            </LocalizationProvider>
                            <Box
                              sx={{
                                width: 860,
                                maxWidth: "50%",
                                marginLeft: "5rem",
                              }}
                            >
                              <FormControl fullWidth>
                                <InputLabel id="division-label">
                                  Search Staff
                                </InputLabel>
                                <Select
                                  labelId="division-label"
                                  id="consultedStaffId"
                                  name="consultedStaffId"
                                  value={form.data.consultedStaffId}
                                  onChange={(event) =>
                                    handleChangeStaff(form.id, event)
                                  }
                                  error={!!errors[index]?.consultedStaffId}
                                >
                                  <MenuItem value="" disabled>
                                    <em>None</em>
                                  </MenuItem>
                                  {docStaff.map((option) => (
                                    <MenuItem
                                      key={option.id}
                                      value={option.value}
                                    >
                                      {option.text}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[index]?.consultedStaffId && (
                                  <span style={{ color: "red" }}>
                                    {errors[index].consultedStaffId}
                                  </span>
                                )}
                              </FormControl>
                            </Box>
                            <Button
                              className="whitespace-nowrap mt-5"
                              startIcon={
                                <FuseSvgIcon size={20}>
                                  heroicons-solid:trash
                                </FuseSvgIcon>
                              }
                              onClick={() => handleRemoveForm(form.id)}
                            ></Button>
                          </div>
                        ))}

                      {addStake && (
                        <>
                          <div
                            _ngcontent-fyk-c288=""
                            class="flex items-center w-full  border-b justify-between"
                          ></div>

                          <div className="flex justify-between">
                            <div>
                              <Button
                                className="whitespace-nowrap mt-5"
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "#0000",
                                  color: "black",
                                  borderColor: "rgba(203,213,225)",
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
                                variant="contained"
                                color="warning"
                                startIcon={
                                  <FuseSvgIcon size={20}>
                                    heroicons-solid:plus
                                  </FuseSvgIcon>
                                }
                                onClick={handelNewForm}
                              >
                                Add New
                              </Button>
                            </div>
                            <div>
                              <Button
                                className="whitespace-nowrap mt-5"
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "#0000",
                                  color: "black",
                                  borderColor: "rgba(203,213,225)",
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
                                variant="contained"
                                onClick={() => setAddStake(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="whitespace-nowrap  "
                                variant="contained"
                                color="secondary"
                                style={{
                                  marginLeft: " 10px",
                                  marginTop: "8px",
                                }}
                                onClick={handelSubmit}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>

                          <div
                            _ngcontent-fyk-c288=""
                            class="flex items-center w-full  border-b justify-between"
                          ></div>
                        </>
                      )}

                      {canEdits && (
                        <>
                          {!addStake && (
                            <Button
                              className="whitespace-nowrap mt-5"
                              style={{
                                border: "1px solid",
                                backgroundColor: "#0000",
                                color: "black",
                                borderColor: "rgba(203,213,225)",
                              }}
                              variant="contained"
                              color="warning"
                              startIcon={
                                <FuseSvgIcon size={20}>
                                  heroicons-solid:plus
                                </FuseSvgIcon>
                              }
                              onClick={handelAddStake}
                            >
                              Add Stakeholders
                            </Button>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                            }}
                          >
                            <FormControl
                              fullWidth
                              sx={{ m: 1 }}
                              error={!!errorsUrl.handelUrlChange}
                            >
                              <span> Consolidated Document Url *</span>
                              <OutlinedInput
                                id="documentUrl"
                                value={handelUrlChange.urlRemarks}
                                onChange={handleUrlChange}
                              />
                              {!!errorsUrl.handelUrlChange && (
                                <FormHelperText>
                                  {errorsUrl.handelUrlChange}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Box>
                          <Button
                            className="whitespace-nowrap ms-5 "
                            variant="contained"
                            color="secondary"
                            style={{
                              paddingLeft: " 40px",
                              paddingRight: "40px",
                            }}
                            onClick={handelUrlUpdate}
                          >
                            Update
                          </Button>

                          <div
                            _ngcontent-fyk-c288=""
                            class="flex items-center w-full  border-b justify-between"
                          ></div>
                          <div className="flex justify-end ">
                            {evalActions.map((btn) => (
                              <Button
                                className="whitespace-nowrap ms-5 "
                                variant="contained"
                                color="secondary"
                                style={{
                                  marginTop: "10px",
                                }}
                                onClick={(e) => SubmitApprovel(e, btn.uid)}
                              >
                                {btn.name}
                              </Button>
                            ))}
                          </div>
                        </>
                      )}
                      {!canEdits && (
                        <div className="p-30 pt-10 pb-24">
                          <div className="flex row">
                            <div className="ng-star-inserted">
                              <div>Consolidated Document Url</div>
                              <div className="font-semibold">
                                <a
                                  href="https://consolidatedurl.com"
                                  rel="noopener noreferrer"
                                >
                                  {contentDetails?.remarks}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Paper>
                    {canEdits && (
                      <Paper
                        className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                        style={{ width: "45%" }}
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full  border-b justify-between"
                        >
                          <h2 _ngcontent-fyk-c288="" class="">
                            Help
                          </h2>
                        </div>
                        <div className="prose">
                          <ul className="text-sm">
                            <li>
                              After stakeholders are added, a task is assigned
                              to each stakeholder to review the document.
                              Stakeholders can view the document by going to MOC
                              details from Tasks page which contains the
                              document share point link and they need to add
                              their comments in the document uploaded in share
                              point.
                            </li>
                            <li>
                              Once they have reviewed the document, each
                              stakeholder has to go to Tasks page and submit the
                              task as an acknowledgement.
                            </li>
                            <li>
                              Here information of each stakeholder having
                              reviewed the document is available.
                            </li>
                            <li>
                              Document author will call internal (Plant/office)
                              stakeholders and conduct session to review the
                              document uploaded in share point and confirm
                              review of document.
                            </li>
                            <li>
                              Document author will create clean version of the
                              document incorporating all modifications /
                              suggestions into same location in share point.
                            </li>
                            <li>
                              Document author has to update the new consolidated
                              document url here.
                            </li>
                            <li>
                              Document author can then submit for approval.
                            </li>
                          </ul>
                        </div>
                      </Paper>
                    )}
                  </>
                )}
                {currentPhase === "Approval" && (
                  <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                    >
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Summary Details
                      </h2>
                    </div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="p-30 pt-24 pb-24 mb-6 ng-star-inserted"
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                            {contentDetails?.requestDate}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
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
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Name
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetails?.projectName}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Description
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

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Type
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetails?.documentType}New
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Reason for New Document
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetails?.reasonForNewDocument}
                          </div>
                        </div>
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Doc Controller
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {contentDetails?.docControllerName}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                      >
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Validity Expiring On
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            {formatDate(contentDetails?.docOldValidityDate)}
                            New
                          </div>
                        </div>
                      </div>
                      <div _ngcontent-fyk-c288="" class="grid w-full">
                        <div className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Document Url
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            <a
                              _ngcontent-fyk-c288=""
                              target="_blank"
                              class="text-blue-500 hover:text-blue-800"
                              style={{ background: "none", color: "blue" }}
                              href={contentDetails?.consolidatedDocumentUrl}
                            >
                              {contentDetails?.consolidatedDocumentUrl}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div _ngcontent-fyk-c288="" class="grid  w-full">
                        <div _ngcontent-fyk-c288="" className="my-6">
                          <div
                            _ngcontent-fyk-c288=""
                            class="mt-3 leading-6 text-secondary"
                          >
                            Consolidated Document Url
                          </div>
                          <div
                            _ngcontent-fyk-c288=""
                            class="text-lg leading-6 font-medium"
                          >
                            {" "}
                            <a
                              _ngcontent-fyk-c288=""
                              target="_blank"
                              class="text-blue-500 hover:text-blue-800"
                              style={{ background: "none", color: "blue" }}
                              href={contentDetails?.documentUrl}
                            >
                              {contentDetails?.documentUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                )}

                {currentPhase === "Implementation" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "0", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Implementation
                        </h2>

                        <Button
                          className="whitespace-nowrap "
                          style={{
                            border: "1px solid",
                            backgroundColor: "#0000",
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
                          onClick={handleOpen}
                        >
                          Training Attendence Sheet
                        </Button>

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
                              <Box className="">
                                <Typography
                                  id="transition-modal-title"
                                  variant="h6"
                                  component="h2"
                                  className="p-30 pt-24 pb-24"
                                  style={{
                                    backgroundColor: "rgb(79, 70, 229)",
                                    borderTopLeftRadius: "16px",
                                    borderTopRightRadius: "16px",
                                    color: "white",
                                  }}
                                >
                                  File Manager
                                </Typography>
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
                                        <img
                                          src="/assets/images/etc/icon_N.png"
                                          style={{}}
                                        />
                                        <h6>{doc?.name}</h6>
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
                                      <FuseSvgIcon size={20}>
                                        heroicons-outline:close
                                      </FuseSvgIcon>
                                      x
                                    </Button>
                                  </div>

                                  <div className="text-center">
                                    <label htmlFor="fileInput">
                                      <div className=" ">
                                        <div
                                          // onClick={handelDetailDoc}
                                          style={{
                                            textAlign: "-webkit-center",
                                          }}
                                        >
                                          <img
                                            src="/assets/images/etc/icon_N.png"
                                            alt=""
                                          />
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
                                        label={
                                          <BoldLabel>Information</BoldLabel>
                                        }
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
                                        value={formatDate(
                                          selectedDocument.createdAt
                                        )}
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
                                        label={
                                          <BoldLabel>Description</BoldLabel>
                                        }
                                        name="Description"
                                        variant="standard"
                                        disabled
                                        value={selectedDocument.descritpion}
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
                                  </div>
                                </Box>
                              )}
                            </Box>
                          </Fade>
                        </Modal>
                      </div>

                      <Box sx={{ width: "100%" }} className="p-30 pt-24 pb-24">
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab label="Task" {...a11yProps(0)} />
                            <Tab label="Check List" {...a11yProps(1)} />
                          </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                          <div class="flex flex-col p-30 w-full border rounded">
                            <div
                              _ngcontent-fyk-c288=""
                              class="flex items-center w-full  border-b justify-between"
                            >
                              <div className="flex items-center">
                                <h2
                                  _ngcontent-fyk-c288=""
                                  class="text-2xl font-semibold"
                                  style={{ marginRight: "15px" }}
                                >
                                  {taskLists.length} Tasks
                                </h2>
                                {!impActivity.isComplete &&
                                  impActivity.status === "Pending" && (
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
                                      onClick={handleOpenImplemntationTask}
                                    >
                                      Add New Task
                                    </Button>
                                  )}
                                <Button
                                  className="whitespace-nowrap mt-5 mb-5 ms-5"
                                  style={{
                                    border: "1px solid",
                                    backgroundColor: "#0000",
                                    color: "black",
                                    borderColor: "rgba(203,213,225)",
                                  }}
                                  variant="contained"
                                  color="warning"
                                  onClick={handleOpen}
                                >
                                  Audits Lists
                                </Button>
                              </div>

                              <TextField
                                variant="filled"
                                fullWidth
                                placeholder="Search"
                                style={{
                                  marginBottom: "15px",
                                  backgroundColor: "white",
                                }}
                                value={searchTerm}
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
                            {taskLists.map((task) => (
                              <Accordion
                                key={task.id}
                                style={{ margin: "0px" }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`panel${task.id}-content`}
                                  id={`panel${task.id}-header`}
                                  style={{ minHeight: "60px" }}
                                  onClick={(e) => handelComments(e, task.id)}
                                >
                                  <div
                                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                    style={{ width: "17%" }}
                                  >
                                    <div className="flex items-center">
                                      Task #{task.id}
                                    </div>
                                  </div>

                                  <div
                                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                    style={{ width: "17%" }}
                                  >
                                    <div
                                      className="flex items-center"
                                      style={{}}
                                    >
                                      {task.isCompleted &&
                                      task.taskStatus === 3 ? (
                                        <span className="text-green">
                                          Approved
                                        </span>
                                      ) : task.isCompleted &&
                                        task.taskStatus !== 3 ? (
                                        <span className="text-red">
                                          Awaiting Approval
                                        </span>
                                      ) : (
                                        <span className="text-black">
                                          Not Completed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                    style={{ width: "17%" }}
                                  >
                                    <div className="flex items-center">
                                      No Risks
                                    </div>
                                  </div>
                                  <div
                                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                    style={{ width: "17%" }}
                                  >
                                    <div className="flex items-center">
                                      {task.assignedStaff}
                                    </div>
                                  </div>

                                  <div
                                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                    style={{ width: "17%" }}
                                  >
                                    <div className="flex items-center">
                                      {formatDate(task.dueDate)}
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
                                        onClick={handleOpen}
                                      >
                                        Audits
                                      </Button>
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
                                              backgroundColor: "#EBF8FF",
                                            }}
                                          >
                                            <b>{task?.assignedByStaff}</b>
                                            <p>
                                              What is the task :{" "}
                                              {task?.actionWhat}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-start mt-5">
                                          <div
                                            className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                            style={{
                                              padding: "20px",
                                              backgroundColor: "#EBF8FF",
                                            }}
                                          >
                                            <p>
                                              How is Task done :{" "}
                                              {task?.actionHow}
                                            </p>
                                          </div>
                                        </div>
                                        {task?.particularName &&
                                          task?.particularSubName && (
                                            <div className="flex flex-col items-start mt-5">
                                              <div
                                                className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                                style={{
                                                  padding: "20px",
                                                  backgroundColor: "#EBF8FF",
                                                }}
                                              >
                                                <p>
                                                  Impact :{" "}
                                                  {`${task?.particularName} > ${task?.particularSubName}`}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        <div className="flex flex-col items-start mt-5">
                                          <div
                                            className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                            style={{
                                              padding: "20px",
                                              backgroundColor: "#EBF8FF",
                                            }}
                                          >
                                            <p>
                                              Due Date :{" "}
                                              {formatDate(task.dueDate)}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-center my-3">
                                          <div className="flex-auto border-b"></div>
                                          <div
                                            className="flex-0 "
                                            style={{ fontSize: "xx-small" }}
                                          >
                                            <b>{task?.assignedByStaff}</b> has
                                            assigned task to{" "}
                                            <b>{task?.assignedStaff}</b> on{" "}
                                            {formatDate(task.assignedAt)}
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
                                                    {task.assignedStaff}{" "}
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
                                                        ? `Started on ${formatDates(msg.startedDate)}`
                                                        : msg.workInProgressDate &&
                                                            !msg.completedDate &&
                                                            !msg.dueDate
                                                          ? `Work in Progress since ${formatDates(msg.workInProgressDate)}`
                                                          : msg.dueDate &&
                                                              !msg.completedDate
                                                            ? `Due on ${formatDates(msg.dueDate)}`
                                                            : msg.completedDate
                                                              ? `Completed on ${formatDates(msg.completedDate)}`
                                                              : "Unknown"}
                                                    </small>
                                                  </div>
                                                </div>
                                                <button
                                                  className="icon-button"
                                                  onClick={() =>
                                                    handleOpen(msg.id)
                                                  }
                                                  style={{
                                                    top: "-15px",
                                                    right: "-20px",
                                                  }}
                                                >
                                                  <FuseSvgIcon size={20}>
                                                    heroicons-solid:document
                                                  </FuseSvgIcon>
                                                  <span className="count">
                                                    {documentCounts[msg.id]}
                                                  </span>
                                                </button>
                                              </div>
                                            )}
                                            {msg.comments && (
                                              <div className="flex flex-col items-start mt-5">
                                                <div
                                                  className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                                  style={{
                                                    padding: "10px",
                                                    backgroundColor: "#EBF8FF",
                                                  }}
                                                >
                                                  <div
                                                    className="font-semibold"
                                                    style={{
                                                      fontSize: "smaller",
                                                    }}
                                                  >
                                                    {" "}
                                                    {task.assignedByStaff}{" "}
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
                                                        ).toLocaleString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "2-digit",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true,
                                                          }
                                                        )}
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                        {task.isCompleted &&
                                          task.taskStatus !== 3 && (
                                            <>
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
                                                          setComments(
                                                            e.target.value
                                                          )
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
                                                    onClick={(e) =>
                                                      handelRejectImpl(e, task)
                                                    }
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
                                                      handelApproveImpl(e, task)
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
                        </CustomTabPanel>
                        {!impActivity.isComplete &&
                          impActivity.status === "Pending" &&
                          value == 0 && (
                            <div
                              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              style={{ width: "100%" }}
                            >
                              {currentActivityForm.canEdit && (
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
                                      Select Approver*
                                    </span>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <FormControl fullWidth sx={{ m: 1 }}>
                                        <Select
                                          labelId="functionName-label"
                                          id="approverId"
                                          name="approver"
                                          value={handelApprover.approver}
                                          onChange={handleChangeApprover}
                                          label="Document Controller *"
                                        >
                                          {docStaff.map((option) => (
                                            <MenuItem
                                              key={option.id}
                                              value={option.value}
                                            >
                                              {option.text}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Box>
                                  </FormControl>
                                </Box>
                              )}

                              <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                <div
                                  _ngcontent-fyk-c288=""
                                  class="flex items-center w-full  border-b justify-between"
                                ></div>
                              </div>
                              {currentActivityForm.canExecute && (
                                <div className="flex justify-end ">
                                  {impActions.map((btn) => (
                                    <Button
                                      className="whitespace-nowrap ms-5 "
                                      variant="contained"
                                      color="secondary"
                                      style={{
                                        marginTop: "10px",
                                      }}
                                      onClick={(e) =>
                                        SubmitImpCreate(e, btn.uid)
                                      }
                                    >
                                      {btn.name}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        <CustomTabPanel value={value} index={1}>
                          <div className="flex flex-col px-4 py-3 w-full border rounded">
                            <ul>
                              {CheckLists.map((item) => (
                                <li key={item.id} className="pb-5">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={item.isChecked}
                                      style={{
                                        margin: "5px",
                                        color:
                                          currentActivityForm.canEdit == false
                                            ? "grey"
                                            : "black",
                                      }}
                                      disabled={
                                        currentActivityForm.canEdit == false
                                      }
                                      onChange={() => {
                                        handleCheckboxChange(item.id);
                                      }}
                                    />
                                    <span
                                      style={{
                                        margin: "5px",
                                        color:
                                          currentActivityForm.canEdit == false
                                            ? "grey"
                                            : "black",
                                      }}
                                    >
                                      {item.item}
                                    </span>{" "}
                                  </label>
                                </li>
                              ))}
                              {!impActivity.isComplete &&
                                impActivity.status === "Pending" &&
                                value == 1 && (
                                  <Button
                                    className="whitespace-nowrap ms-5 "
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                      marginTop: "10px",
                                      width: "150px",
                                      marginBottom: "5px",
                                    }}
                                    onClick={saveChanges}
                                  >
                                    Save
                                  </Button>
                                )}
                            </ul>
                          </div>

                          {!impActivity.isComplete &&
                            impActivity.status === "Pending" &&
                            value == 1 && (
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
                                      Select Approver
                                    </span>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <FormControl fullWidth sx={{ m: 1 }}>
                                        <Select
                                          labelId="functionName-label"
                                          id="docControllerId"
                                          name="approver"
                                          value={handelApprover.approver}
                                          onChange={handleChangeApprover}
                                          label="Document Controller *"
                                        >
                                          {docStaff.map((option) => (
                                            <MenuItem
                                              key={option.id}
                                              value={option.value}
                                            >
                                              {option.text}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Box>
                                  </FormControl>
                                </Box>

                                <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                  <div
                                    _ngcontent-fyk-c288=""
                                    class="flex items-center w-full  border-b justify-between"
                                  ></div>
                                </div>
                                <div className="flex justify-end ">
                                  {impActions.map((btn) => (
                                    <Button
                                      className="whitespace-nowrap ms-5 "
                                      variant="contained"
                                      color="secondary"
                                      style={{
                                        marginTop: "10px",
                                      }}
                                      onClick={(e) =>
                                        SubmitImpCreate(e, btn.uid)
                                      }
                                    >
                                      {btn.name}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </CustomTabPanel>
                      </Box>
                    </Paper>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={openImplemntationTask}
                      onClose={handleCloseImplemntationTask}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={openImplemntationTask}>
                        <Box sx={styleImp}>
                          <Box>
                            <Typography
                              id="transition-modal-title"
                              variant="h6"
                              component="h2"
                              style={{
                                fontSize: "2rem",
                              }}
                            >
                              Add New Task
                            </Typography>
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
                                      margin: "15px",
                                    }}
                                    className="flex flex-row "
                                  >
                                    <FormControl
                                      sx={{
                                        width: 380,
                                        maxWidth: "48%",
                                      }}
                                      error={!!errorsAddTask.particular}
                                    >
                                      <FormLabel
                                        className="font-medium text-14"
                                        component="legend"
                                      >
                                        Impact Particular*
                                      </FormLabel>
                                      <Select
                                        variant="outlined"
                                        onChange={handleChangeAddTask}
                                        name="particular"
                                        value={taskAdd.particular}
                                      >
                                        {particular.map((option) => (
                                          <MenuItem
                                            key={option.id}
                                            value={option.value}
                                          >
                                            {option.text}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {!!errorsAddTask.particular && (
                                        <FormHelperText>
                                          {errorsAddTask.particular}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                    <FormControl
                                      sx={{
                                        width: 380,
                                        maxWidth: "48%",
                                      }}
                                      error={
                                        !!errorsAddTask.particularSubCategory
                                      }
                                    >
                                      <FormLabel
                                        className="font-medium text-14"
                                        component="legend"
                                      >
                                        Impact Particular Subcategory*
                                      </FormLabel>
                                      <Select
                                        variant="outlined"
                                        onChange={handleChangeAddTask}
                                        name="particularSubCategory"
                                        value={taskAdd.particularSubCategory}
                                      >
                                        {particularSub.map((option) => (
                                          <MenuItem
                                            key={option.id}
                                            value={option.value}
                                          >
                                            {option.text}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {!!errorsAddTask.particularSubCategory && (
                                        <FormHelperText>
                                          {errorsAddTask.particularSubCategory}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  </div>
                                </div>{" "}
                                <div className="flex flex-col-reverse">
                                  <div
                                    style={{
                                      marginTop: "30px",
                                      justifyContent: "space-between",
                                      margin: "15px",
                                    }}
                                    className="flex flex-row "
                                  >
                                    <Box
                                      sx={{
                                        width: 800,
                                        maxWidth: "100%",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="Impact Hazard Details *"
                                        name="impacHazards"
                                        onChange={handleChangeAddTask}
                                        value={taskAdd.impacHazards}
                                        error={!!errorsAddTask.impacHazards}
                                        helperText={errorsAddTask.impacHazards}
                                      />
                                    </Box>
                                  </div>
                                </div>
                                <div className="flex flex-col-reverse">
                                  <div
                                    style={{
                                      marginTop: "30px",
                                      justifyContent: "space-between",
                                      margin: "15px",
                                    }}
                                    className="flex flex-row "
                                  >
                                    <Box
                                      sx={{
                                        width: 380,
                                        maxWidth: "48%",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="What is the Task"
                                        name="actionWhat"
                                        onChange={handleChangeAddTask}
                                        value={taskAdd.actionWhat}
                                        error={!!errorsAddTask.actionWhat}
                                        helperText={errorsAddTask.actionWhat}
                                      />
                                    </Box>

                                    <Box
                                      sx={{
                                        width: 380,
                                        maxWidth: "48%",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="How is the task done"
                                        name="actionHow"
                                        onChange={handleChangeAddTask}
                                        value={taskAdd.actionHow}
                                        error={!!errorsAddTask.actionHow}
                                        helperText={errorsAddTask.actionHow}
                                      />
                                    </Box>
                                  </div>
                                </div>{" "}
                                <div className="flex flex-col-reverse">
                                  <div
                                    style={{
                                      marginTop: "30px",
                                      justifyContent: "space-between",
                                      margin: "15px",
                                    }}
                                    className="flex flex-row "
                                  >
                                    <FormControl
                                      sx={{
                                        width: 380,
                                        maxWidth: "48%",
                                      }}
                                      error={!!errorsAddTask.taskassignedto}
                                    >
                                      <FormLabel
                                        className="font-medium text-14"
                                        component="legend"
                                      >
                                        Task Assigned to*
                                      </FormLabel>
                                      <Select
                                        variant="outlined"
                                        onChange={handleChangeAddTask}
                                        value={taskAdd.taskassignedto}
                                        name="taskassignedto"
                                      >
                                        {docStaff.map((option) => (
                                          <MenuItem
                                            key={option.id}
                                            value={option.value}
                                          >
                                            {option.text}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {!!errorsAddTask.taskassignedto && (
                                        <FormHelperText>
                                          {errorsAddTask.taskassignedto}
                                        </FormHelperText>
                                      )}
                                    </FormControl>

                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <FormControl
                                        sx={{
                                          marginLeft: "10px",
                                        }}
                                        error={!!errorsAddTask.dueDate}
                                      >
                                        <FormLabel
                                          className="font-medium text-14"
                                          component="legend"
                                        >
                                          Due Date*
                                        </FormLabel>
                                        <Box sx={{}}>
                                          <DatePicker
                                            label="Validity Expires On *"
                                            name="dueDate"
                                            value={taskAdd.dueDate}
                                            onChange={(date) =>
                                              handleChangeTaskDate(date)
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                fullWidth
                                                {...params}
                                              />
                                            )}
                                          />
                                        </Box>
                                        {!!errorsAddTask.dueDate && (
                                          <FormHelperText>
                                            {errorsAddTask.dueDate}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </LocalizationProvider>
                                  </div>
                                </div>{" "}
                                <div className="flex flex-col-reverse">
                                  <div
                                    style={{
                                      marginTop: "30px",
                                      justifyContent: "space-between",
                                      margin: "15px",
                                    }}
                                    className="flex flex-row "
                                  >
                                    <Box
                                      sx={{
                                        width: 500,
                                        maxWidth: "100%",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="Audit Commnt"
                                        id="fullWidth"
                                        name="audit"
                                        onChange={handleChangeAddTask}
                                        value={taskAdd.audit}
                                        error={!!errorsAddTask.audit}
                                        helperText={errorsAddTask.audit}
                                      />
                                    </Box>
                                  </div>
                                </div>{" "}
                                <h6>
                                  If this task is based on Audit comments,
                                  please select the Audit comment
                                </h6>
                              </div>
                              <div className="flex justify-end ">
                                <Button
                                  className="whitespace-nowrap ms-5 "
                                  variant="contained"
                                  color="secondary"
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  onClick={handelTaskSubmit}
                                >
                                  Save
                                </Button>
                              </div>
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    </Modal>
                  </>
                )}
                {currentPhase === "docimplclosure" && (
                  <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                    >
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Closure by Doc Controller
                      </h2>
                    </div>
                    <Paper className="w-full">
                      <div
                        _ngcontent-fyk-c288=""
                        class="p-30 pt-24 pb-24 mb-0 ng-star-inserted"
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full mb-10 justify-between"
                        >
                          <h2
                            _ngcontent-fyk-c288=""
                            class="text-xl font-semibold"
                          >
                            Summary Details
                          </h2>
                        </div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
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
                          <div _ngcontent-fyk-c288="" className="my-6">
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
                          <div _ngcontent-fyk-c288="" className="my-6">
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
                              {contentDetails?.requestDate}
                            </div>
                          </div>
                        </div>

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
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
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Name
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.projectName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Description
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

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Type
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.documentType}New
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Reason for New Document
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.reasonForNewDocument}
                            </div>
                          </div>
                        </div>

                        <div _ngcontent-fyk-c288="" class="grid w-full">
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Url
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              <a
                                _ngcontent-fyk-c288=""
                                target="_blank"
                                class="text-blue-500 hover:text-blue-800"
                                href={contentDetails?.documentUrl}
                              >
                                {contentDetails?.documentUrl}
                              </a>
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Consolidated Document Url
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              <a
                                _ngcontent-fyk-c288=""
                                target="_blank"
                                class="text-blue-500 hover:text-blue-800"
                                href={contentDetails?.consolidatedDocumentUrl}
                              >
                                {contentDetails?.consolidatedDocumentUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>

                    {currentActivityForm.canEdit && (
                      <>
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full  border-b justify-between"
                        ></div>
                        <div className="flex justify-end ">
                          {closeActions.map((btn) => (
                            <Button
                              className="whitespace-nowrap ms-5 "
                              variant="contained"
                              color="secondary"
                              style={{
                                marginTop: "10px",
                              }}
                              onClick={(e) => handelCloseMoc(btn.uid)}
                            >
                              {btn.name}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </Paper>
                )}

                {currentPhase === "Approval" &&
                  currentPhaseName === "Approval" && (
                    <>
                      <Paper
                        className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
                        style={{ width: "100%" }}
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                        >
                          <h2
                            _ngcontent-fyk-c288=""
                            class="text-2xl font-semibold"
                          >
                            Stake Holders
                          </h2>
                          <TextField
                            variant="filled"
                            fullWidth
                            placeholder="Search"
                            value={searchTerm}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  style={{ marginTop: "0px" }}
                                >
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: 320 }}
                          />
                        </div>
                        <div
                          className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                          style={{ width: "40%" }}
                        >
                          <div className="flex items-center">
                            <img
                              src="/assets/images/etc/userpic.png"
                              alt="Card cover image"
                              className="rounded-full mr-4"
                              style={{ width: "4rem", height: "4rem" }}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold leading-none">
                                {contentDetails.initiatorName}
                              </span>
                              <span className="text-sm text-secondary leading-none pt-5">
                                Consulted on{" "}
                                {formatDate(contentDetails?.requestDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </>
                  )}
                {currentPhase === "Approval" &&
                  currentPhaseName == "Implementation" && (
                    <>
                      <Paper
                        className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
                        style={{ width: "100%" }}
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                        >
                          <h2
                            _ngcontent-fyk-c288=""
                            class="text-2xl font-semibold"
                          >
                            Implementation Tasks
                          </h2>
                          <TextField
                            variant="filled"
                            fullWidth
                            placeholder="Search"
                            style={{ marginBottom: "0" }}
                            value={searchTerm}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  style={{ marginTop: "0px" }}
                                >
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: 320 }}
                          />
                        </div>
                        <div className="p-30 pt-24 pb-24">
                          {contentDetails?.implementationTask?.map((imptsk) => (
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
                                    <div className="task-header flex items-center p-0">
                                      <div className="task-id flex flex-col">
                                        <span className="task-id-text font-semibold text-xl leading-none">
                                          Task #{imptsk?.id}
                                        </span>
                                      </div>
                                      {currentActivityForm.canEdit && (
                                        <div className="task-button ml-auto">
                                          <button
                                            className="task-mark-reviewed-button mat-stroked-button"
                                            onClick={() =>
                                              handelreview(imptsk.id)
                                            }
                                          >
                                            {reviewed[imptsk.id] ? (
                                              <span
                                                className="mat-button-wrapper"
                                                style={{
                                                  backgroundColor:
                                                    "rgba(220,252,231)",
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
                                    <div className="task-details p-0 mt-10">
                                      <div className="task-detail prose prose-sm max-w-5xl">
                                        <div className="task-detail-item mt-10 p-0">
                                          <span className="task-detail-label bg-default rounded d-inline-block text-secondary font-semibold">
                                            What is Task
                                          </span>
                                          <span className="task-detail-value d-inline-block">
                                            {imptsk.actionWhat}
                                          </span>
                                        </div>
                                        <div className="task-detail-item mt-10 p-0">
                                          <span className="task-detail-label bg-default rounded  d-inline-block d-inline-block text-secondary font-semibold">
                                            How is Task done
                                          </span>
                                          <span className="task-detail-value d-inline-block">
                                            {imptsk.actionHow}
                                          </span>
                                        </div>
                                        <div className="task-detail-item mt-10 p-0">
                                          <span className="task-detail-label bg-default rounded  d-inline-block text-secondary font-semibold">
                                            Assigned to
                                          </span>
                                          <span className="task-detail-value d-inline-block">
                                            {imptsk.assignedStaff}
                                          </span>
                                          <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                                            Due Date
                                          </span>
                                          <span className="task-detail-value">
                                            {formatDate(imptsk.dueDate)}
                                          </span>
                                          <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                                            Deadline
                                          </span>
                                          <span className="task-detail-value">
                                            {imptsk?.deadlineDisplay}
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="inventory-grid grid items-center gap-4 mt-10"
                                        style={{ width: "40%" }}
                                      >
                                        <div className="flex items-center mt-5">
                                          <img
                                            src="/assets/images/etc/userpic.png"
                                            alt="Card cover image"
                                            className="rounded-full mr-4"
                                            style={{
                                              width: "3rem",
                                              height: "3rem",
                                            }}
                                          />
                                          <div className="flex flex-col">
                                            <span
                                              className="font-semibold leading-none"
                                              style={{
                                                fontSize: "smaller",
                                                fontWeight: "400",
                                              }}
                                            >
                                              <b>{imptsk.assignedStaff}</b>{" "}
                                              {imptsk?.actionComments}
                                            </span>

                                            <span className="text-sm text-secondary leading-none pt-5">
                                              Completed on{" "}
                                              {/* {formatDates(imptsk?.completedAt)} */}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {currentActivityForm.canEdit &&
                                      !imptsk.implementationReviews.length ? (
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
                                                  handelCommentImp(imptsk.id)
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
                                      ) : (
                                        <div className="mt-10">
                                          <Accordion
                                            expanded={expanded}
                                            onChange={handleExpansionChange}
                                          >
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls="panel1a-content"
                                              id="panel1a-header"
                                            >
                                              <Typography>
                                                <span className="text-brown">
                                                  {
                                                    imptsk
                                                      ?.implementationReviews
                                                      ?.length
                                                  }{" "}
                                                  Reviews
                                                </span>{" "}
                                                <span className="text-green">
                                                  (You have added{" "}
                                                  {
                                                    imptsk
                                                      ?.implementationReviews
                                                      ?.length
                                                  }{" "}
                                                  review)
                                                </span>
                                              </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
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
                                                      value={
                                                        imptsk
                                                          .implementationReviews[0]
                                                          ?.remark
                                                      }
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
                                                        handelCommentImp(
                                                          imptsk.id
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
                                                </div>
                                                <span
                                                  style={{
                                                    fontSize: "x-small",
                                                    paddingLeft: "60px",
                                                  }}
                                                >
                                                  {" "}
                                                  {imptsk
                                                    .implementationReviews[0]
                                                    ?.updatedAt &&
                                                    new Date(
                                                      imptsk.implementationReviews[0]?.updatedAt
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
                                                      transform:
                                                        "translateY(0%)",
                                                    }}
                                                  ></div>
                                                </div>
                                              </div>
                                            </AccordionDetails>
                                          </Accordion>
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
                          ))}
                        </div>
                      </Paper>
                    </>
                  )}

                {currentPhase === "Approval" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "15px", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Approval
                        </h2>
                      </div>

                      {appActivity.isComplete &&
                      appActivity.status != "Pending" ? (
                        <div
                          className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                          style={{ width: "40%" }}
                        >
                          <span className="font-semibold leading-none">
                            Approver Comment: {ApprovalManager?.remark}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                          style={{ width: "100%" }}
                        >
                          {currentActivityForm.canEdit && (
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
                                  Comment
                                </span>
                                <OutlinedInput
                                  id="reasonForNewDocument"
                                  name="reasonForNewDocument"
                                  onChange={handleChangeRemark}
                                  label="Reason For Change*"
                                  className="mt-5"
                                  value={valueRemark}
                                />
                              </FormControl>
                            </Box>
                          )}
                          {currentActivityForm.canExecute && (
                            <div className="flex justify-end ">
                              {appActions.map((btn) => (
                                <Button
                                  className="whitespace-nowrap ms-5 "
                                  variant="contained"
                                  color="secondary"
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  onClick={(e) =>
                                    SubmitApprovelCreate(
                                      e,
                                      btn.uid,
                                      btn.name,
                                      btn.type
                                    )
                                  }
                                >
                                  {btn.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Paper>
                  </>
                )}
              </div>
            </>
          </SwipeableViews>
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
}

export default Course;
