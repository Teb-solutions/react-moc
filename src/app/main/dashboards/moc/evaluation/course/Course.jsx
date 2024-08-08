import React, { useEffect, useRef, useState, useCallback } from "react";

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
  Autocomplete,
  FormHelperText,
  FormLabel,
  Step,
  Badge,
  StepContent,
  StepLabel,
  Grid,
  TableRow,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableBody,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import Box from "@mui/material/Box";

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
import { withStyles } from "@mui/styles";

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
  const [expanded2, setExpanded2] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [listDocument1, setListDocument1] = useState([]);
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
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [deletes, setDeletes] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "DocImplTrSheet",
    documentId: "",
    changeRequestToken: null,
  });

  const handleModalClose = () => {
    setOpenMoc(false);
    setOpenDrawer(false);
    setFileDetails(false);
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };
  const HandleTraining = () => {
    setSelectedFile({
      ...selectedFile,
      descritpion: "",
    });
    apiAuth
      .get(
        `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
      )
      .then((response) => {
        setListDocument1(response?.data?.data);
      });
    setOpenMoc(true);
  };

  const handelFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedFile({
      ...selectedFile,
      name: e.target.files[0].name,

      type: e.target.files[0].type,
      document: e.target.files[0],
      documentType: "DocImplTrSheet",
      documentId: evaluationId,
      changeRequestToken: evaluationId,
    });
  };

  const handleSubmitAsset = (e) => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.descritpion);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", selectedFile.documentType);
    formData.append("documentId", selectedFile.documentId);
    formData.append("changeRequestToken", selectedFile.changeRequestToken);

    apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                descritpion: "",
              });
            });
        } else {
          toast.error(response.data.message);
          setOpenMoc(false);
          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error uploading the document!", error);
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpenDocModal(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setFileDetails(false);
  };
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [ChangeEvaluationDetail, setChangeEvaluationDetail] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [riskLists, setRiskLists] = useState([]);
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
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "4px",
    },
  }))(Badge);

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

  const [taskAdd, setTaskAdd] = useState({
    particular: 0,
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

    ChangeImapactId: 0,
    changeEvaluationId: 0,
    deadline: 1,
    hazardDetail: "",
    isShowDetail: "",
    parentId: "0",
  });

  const [openImplemntationTask, setOpenImplemntationTask] = useState(false);
  const [comments, setComments] = useState("");
  const [hazardImp, setHazardImp] = useState([]);

  const [reviewed, setReviewed] = useState({});
  const [errorss, setErrorStake] = useState("");
  const [handelApprover, setHandelApprover] = useState({
    approver: null, // Store the entire selected object
  });

  const [openMoc, setOpenMoc] = useState(false);

  const handleOpenImplemntationTask = () => {
    setOpenImplemntationTask(true);
    apiAuth.get(`Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticular(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {
      // setParticularSub(resp.data.data);
    });
  };

  const handleCloseImplemntationTask = () => setOpenImplemntationTask(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeApprover = (event, newValue) => {
    setHandelApprover({ approver: newValue });
  };

  const handleChangeAddTask = (e) => {
    const { name, value } = e.target;

    setTaskAdd((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "particular") {
      apiAuth.get(`/LookupData/Lov/17/${value}`).then((resp) => {
        setParticularSub(resp.data.data);
      });
    }
  };

  const handleSubCategoryChange = (newValue, name) => {
    setTaskAdd((prevState) => ({
      ...prevState,
      [name]: newValue ? newValue.value : "",
    }));

    if (!!errorsAddTask[name]) {
      setErrorsAddTask({ ...errorsAddTask, [name]: "" });
    }

    apiAuth.get(`/LookupData/Lov/18/${newValue.value}`).then((resp) => {
      setHazardImp(resp.data.data);
    });
  };

  const handleOpenMoc = () => {
    setOpenMoc(true);
  };

  const validateAddTask = () => {
    let tempErrors = {};

    if (!taskAdd.particular)
      tempErrors.particular = "Particular Name is required";
    if (taskAdd.particular == 78) {
      if (!taskAdd.changeImpactHazard)
        tempErrors.changeImpactHazard = "changeImpactHazard Name is required";
    } else {
      if (!taskAdd.impacHazards)
        tempErrors.impacHazards = "impact Hazards  is required";
    }
    if (!taskAdd.particularSubCategory)
      tempErrors.particularSubCategory = "particular SubCategory  is required";

    if (!taskAdd.actionHow) tempErrors.actionHow = "  Action How  is required";
    if (!taskAdd.actionWhat)
      tempErrors.actionWhat = "  Action What is required";
    if (!taskAdd.assignedStaffId)
      tempErrors.assignedStaffId = "Task Assigned Field is required";
    if (!taskAdd.dueDate) tempErrors.dueDate = "Date Field is required";
    if (!taskAdd.audit) tempErrors.audit = "Audit Field is required";

    // Add other validations here
    setErrorsAddTask(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handelTaskSubmit = (e) => {
    if (validateAddTask()) {
      setIsLoading(true);

      apiAuth
        .put(`ChangeImpact/Create/Task/${evaluationId}`, taskAdd)
        .then((resp) => {
          handleCloseImplemntationTask();
          setTimeout(() => {
            getRecords();
            setIsLoading(false);
          }, 2000);

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
        })
        .catch((err) => {
          setIsLoading(false);
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
      setIsLoading(true);

      apiAuth
        .post(
          `/ChangeEvaluationConsultation/Create/${changeEvaluationId}/${evaluationId}`,
          formattedForms
        )
        .then((response) => {
          setIsLoading(false);

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
        .catch((error) => {
          setIsLoading(false);
        });
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
    setAddStake(false);
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
  const [CreateNewRisk, setCreateNewRisk] = useState(false);

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
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const [viewrisk, setViewRisk] = useState(false);

  const taskFormControlStyles = viewrisk
    ? {
        borderColor: "white",
        m: 1,
        maxWidth: "100%",
        border: "1px solid white",
      }
    : { m: 1, maxWidth: "100%" };

  const styleImp = {
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
    transition: "right 0.3s ease",
    overflow: "auto", // Smooth transition for opening/closing
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
                      setRiskLists(resp.data.data.riskAnalysisList);

                      setCheckLists(resp.data.data.checkList);
                      apiAuth
                        .get(
                          `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
                        )
                        .then((response) => {
                          setListDocument(response?.data?.data);
                        });
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
          toast?.success("  Consolidated Document url successfully updated");
        });
    } else {
      toast?.error("Concolidated Document Url is not valid");
    }
  };

  const SubmitApprovel = (e, uid) => {
    if (forms.length < 1) {
      toast?.error("At least one stakeholder is required.");
    } else {
      // setIsLoading(true);
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
          toast?.error("Minimum One stakeholders Required");
        } else {
          if (hasEmptyComment) {
            toast?.error("All stakeholders must update the task");
          } else {
            setIsLoading(true);

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
                getRecords();
                setIsLoading(false);
                // location.reload();
              })
              .catch((err) => {
                setIsLoading(false);
              });
          }
        }
      });
  };
  const SubmitApprovelCreate = (e, uid, name, type) => {
    setIsLoading(true);

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
        if (resp.data.statusCode != 400) {
          setValueRemark("");
          getRecords();
          setIsLoading(false);
        } else {
          toast?.error(resp.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const SubmitImpCreate = (e, uid) => {
    let taskListApproved = taskLists?.filter((x) => x.taskStatus == 3);
    console.log(taskListApproved, "taskListApproved");
    if (handelApprover.approver == "" || handelApprover.approver == null) {
      toast?.error("Please Select An Approver.");

      return;
    } else {
      if (taskLists?.length != taskListApproved?.length) {
        toast?.error("There are some pending Tasks to be approved.");
        return;
      } else {
        setIsLoading(true);
        apiAuth
          .get(`/ChangeImpact/ListTask?id=${evaluationId}`)
          .then((resp) => {
            if (handelApprover.approver == "") {
              toast?.error("Select an approver");
            } else {
              apiAuth
                .post(
                  `/DocMoc/ImplementationSubmit/${evaluationId}/${handelApprover.approver.value}`,
                  {
                    actionUID: uid,
                    activityUID: impActivity.uid,
                    formUID: impActivity.formUID,
                  }
                )
                .then((resp) => {
                  toast?.success("MOC has Created");
                  getRecords();
                  setIsLoading(false);
                })
                .catch((err) => {
                  setIsLoading(false);
                });
            }
          });
      }
    }
  };

  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
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
    setIsLoading(true);
    const updatedTask = {
      ...task,
      comments: comments,
      submissionList: [impComments],
      ChangeEvaluationId: 0,
      ParentId: 0,
      taskStatus: 3,
    };

    apiAuth
      .post(`ChangeImpact/ActionTask?id=${evaluationId}`, updatedTask)
      .then((response) => {
        handelComments(e, task.id);
        setComments("");
        getRecords();

        setIsLoading(false);

        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
        setIsLoading(false);

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
        handelComments(e, task.id);
        setComments("");
        getRecords();

        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
        console.error(error);
      });
  };

  const handleCheckboxChange = (id) => {
    console.log(id, "CheckLists");
    setCheckLists((prevCheckLists) =>
      prevCheckLists.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  console.log(CheckLists, "CheckLists");

  const saveChanges = () => {
    apiAuth
      .post(`/DocMoc/UpdateImplementationChecklist/${evaluationId}`, CheckLists)
      .then((response) => {
        toast?.success("Checklist successfully updated");
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
        setFileDetails(false);
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

  const handelCommentImp = (id, value) => {
    apiAuth
      .put(`/Task/ImpAddReview/${id}/IMPL_APPROVAL_VP_DIV`, {
        remark: handelCommentRemark,
      })
      .then((resp) => {
        if (value == 1) {
          toast?.success("Review successfully added");
        } else {
          toast?.success("Review successfully Updated");
        }
        setHandelCommentRemark("");
        getRecords();
      });
  };

  const handelCloseMoc = (uid) => {
    setIsLoading(true);
    apiAuth
      .post(`/DocMoc/ImplementationSubmit/${evaluationId}/22`, {
        actionUID: uid,
        activityUID: closeActivity.uid,

        formUID: closeActivity.formUID,
      })
      .then((resp) => {
        toast?.success("MOC Successfully Closed");

        setTimeout(() => {
          getRecords();
          setIsLoading(false);
        }, 3000);
      });
  };

  useEffect(() => {
    handleStepChange();
  }, []);
  const [TaskhazardRiskViewName, setSubTaskhazardRiskViewName] = useState("");
  const [hazardTypeValue, sethazardTypeValue] = useState("");
  const handelRisk = (id, type) => {
    setCreateNewRisk(true);
    setEditRiskAnalysDetail([]);
    setHazaId(0);
    setSubTaskhazardRiskView(false);

    setSubTaskhazardRiskViewName("");
    sethazardTypeValue(type);
    setCreateNewRisk(true);
    setFormValues({
      ...formValues,
      hazardType: "",
      hazardousSituation: "",
      consequence: "",
      time: "",
      frequencyDetails: "",
      frequencyScoring: "",
      likelihoodScoring: "",
      severityScoring: "",
      potentialRisk: "",
      humanControlMeasure: "",
      technicalControlMeasure: "",
      organisationalControlMeasure: "",
      modifiedTime: "",
      modifiedFrequencyDetails: "",
      residualFrequencyScoring: "",
      residualLikelihoodScoring: "",
      residualSeverityScoring: "",
      residualRisk: "",
      residualRiskClassification: "",
    });
    setHazaId("");

    apiAuth.get(`/RiskAnalysis/SubTaskDetail?id=${id}`).then((resp) => {
      setSubTaskDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/28`).then((resp) => {
      setSubTaskhazardDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/29`).then((resp) => {
      setPotentialTimeDetails(resp.data.data);
    });
  };
  const [errorsSub, setErrorsSub] = useState({});
  const [subTaskhazardDetail, setSubTaskhazardDetail] = useState([]);
  const [generalGuidePdf, setGeneralGuidePdf] = useState(null);
  const [subTaskDetail, setSubTaskDetail] = useState([]);
  const [potentialTimeDetails, setPotentialTimeDetails] = useState([]);
  const [potentialFrequencyDetails, setPotentialFrequencyDetails] = useState(
    []
  );
  const [editRiskAnalysDetail, setEditRiskAnalysDetail] = useState([]);
  const [Classifications, setClassification] = useState("");
  const [TaskhazardRiskView, setSubTaskhazardRiskView] = useState(false);

  const [TaskhazardRiskApi, setSubTaskhazardRiskApi] = useState([]);
  const likelihoodValues = Array.from({ length: 15 }, (_, i) => i + 1);
  const calculateFrequencyScoring = (text) => {
    if (["t < 2.4min", "t < 0.2h", "t < 0.8h", "t < 8.5h"].includes(text)) {
      return 0.5;
    } else if (
      [
        "2.4 <= t < 24min",
        "0.2 <= t < 2h",
        "0.8 <= t < 8h",
        "8.5 <= t < 85h",
      ].includes(text)
    ) {
      return 1;
    } else if (
      [
        "24min <= t < 1.6h",
        "2 <= t < 8h",
        "8 <= t < 32h",
        "85 <= t < 340h",
      ].includes(text)
    ) {
      return 2;
    } else if (
      [
        "1.6 <= t < 4h",
        "8 <= t < 20h",
        "32 <= t < 80h",
        "340 <= t < 850h",
      ].includes(text)
    ) {
      return 3;
    } else if (
      [
        "4 <= t < 6h",
        "20 <= t < 30h",
        "80 <= t < 120h",
        "850 <= t < 1275h",
      ].includes(text)
    ) {
      return 6;
    } else {
      return 10;
    }
  };
  const calculatePotentialRisk = (
    frequencyScoring,
    likelihoodScoring,
    severityScoring
  ) => {
    if (
      frequencyScoring &&
      likelihoodScoring &&
      severityScoring &&
      likelihoodScoring <= 15 &&
      likelihoodScoring > 0 &&
      severityScoring <= 15 &&
      severityScoring > 0
    ) {
      return frequencyScoring * likelihoodScoring * severityScoring;
    } else {
      return "";
    }
  };

  const calculateRiskClassification = (residualRisk) => {
    let classification = "";
    let classificationValue = "";

    if (residualRisk > 400) {
      classification = "HighRisk";
      classificationValue = "1";
    } else if (residualRisk > 200 && residualRisk <= 400) {
      classification = "SignificantRisk";
      classificationValue = "2";
    } else if (residualRisk > 70 && residualRisk <= 200) {
      classification = "AverageRisk";
      classificationValue = "3";
    } else if (residualRisk > 20 && residualRisk <= 70) {
      classification = "LowRisk";
      classificationValue = "4";
    } else if (residualRisk <= 20) {
      classification = "VeryLowRisk";
      classificationValue = "5";
    }

    return { classification, classificationValue };
  };
  const [formValues, setFormValues] = useState({
    task: "",
    subTask: "",
    hazardousSituation: "",
    consequence: "",
    time: "",
    frequencyDetails: "",
    frequencyScoring: "",
    likelihoodScoring: "",
    severityScoring: "",
    potentialRisk: "",
    humanControlMeasure: "",
    technicalControlMeasure: "",
    organisationalControlMeasure: "",
    modifiedTime: "",
    modifiedFrequencyDetails: "",
    residualFrequencyScoring: "",
    residualLikelihoodScoring: "",
    residualSeverityScoring: "",
    residualRisk: "",
    residualRiskClassification: "",
  });
  const handleGeneralGuideClick = () => {
    apiAuth
      .get(`/RiskAnalysis/downloadGeneral`, {
        responseType: "blob",
      })
      .then((resp) => {
        setGeneralGuidePdf(resp.data);
      });
  };
  const handelViewDetails = (id, subid) => {
    setPotentialFrequencyDetails([]);
    setFormValues({
      ...formValues,
      hazardType: "",
      hazardousSituation: "",
      consequence: "",
      time: "",
      frequencyDetails: "",
      frequencyScoring: "",
      likelihoodScoring: "",
      severityScoring: "",
      potentialRisk: "",
      humanControlMeasure: "",
      technicalControlMeasure: "",
      organisationalControlMeasure: "",
      modifiedTime: "",
      modifiedFrequencyDetails: "",
      residualFrequencyScoring: "",
      residualLikelihoodScoring: "",
      residualSeverityScoring: "",
      residualRisk: "",
    });
    setCreateNewRisk(true);
    setViewRisk(true);
    apiAuth.get(`/RiskAnalysis/SubTaskDetail?id=${subid}`).then((resp) => {
      setSubTaskDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/28`).then((resp) => {
      setSubTaskhazardDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/29`).then((resp) => {
      setPotentialTimeDetails(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/30/0`).then((resp) => {
      setPotentialFrequencyDetails(resp.data.data);
    });
    apiAuth.get(`/RiskAnalysis/RiskAnalysisDetail?id=${id}`).then((resp) => {
      const data = resp.data.data.riskAnalysisHazardSituation[0];
      setFormValues({
        ...formValues,
        hazardType: {
          value: resp?.data?.data?.hazardType,
        },
        // hazardType: resp?.data?.data?.hazardType,
        hazardousSituation: data?.hazardousSituation,
        consequence: data?.consequence,
        time: data?.time,
        frequencyDetails: data?.frequencyDetails,
        frequencyScoring: data?.frequencyScoring,
        likelihoodScoring: data?.likelihoodScoring,
        severityScoring: data?.severityScoring,
        potentialRisk: data?.potentialRisk,
        humanControlMeasure: data?.humanControlMeasure,
        technicalControlMeasure: data?.technicalControlMeasure,
        organisationalControlMeasure: data?.organisationalControlMeasure,
        modifiedTime: data?.modifiedTime,
        modifiedFrequencyDetails: data?.modifiedFrequencyDetails,
        residualFrequencyScoring: data?.residualFrequencyScoring,
        residualLikelihoodScoring: data?.residualLikelihoodScoring,
        residualSeverityScoring: data?.residualSeverityScoring,
        residualRisk: data?.residualRisk,
        residualRiskClassification: data?.residualRiskClassification,
      });

      const { classification, classificationValue } =
        calculateRiskClassification(data?.residualRisk);

      setClassification(classification);

      // if (data.time) {
      //   apiAuth.get(`/LookupData/Lov/30/${data.time}`).then((resp) => {
      //     setPotentialFrequencyDetails(resp.data.data);
      //   });
      // }
      // if (data.frequencyDetails) {
      //   apiAuth
      //     .get(`/LookupData/Lov/30/${data.frequencyDetails}`)
      //     .then((resp) => {
      //       setPotentialFrequencyDetails(resp.data.data);
      //     });
      // }
    });
  };

  const validateRisk = () => {
    const newErrors = {};

    // List of required fields
    const requiredFields = [
      "hazardousSituation",
      "consequence",
      "time",
      "frequencyDetails",
      "likelihoodScoring",
      "severityScoring",
      "humanControlMeasure",
      "technicalControlMeasure",
      "organisationalControlMeasure",
      "modifiedTime",
      "modifiedFrequencyDetails",
      "residualLikelihoodScoring",
      "residualSeverityScoring",
      "hazardType",
    ];

    // Check each field and set error if empty
    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrorsSub(newErrors);

    // If there are any errors, return false; otherwise, return true
    return Object.keys(newErrors).length === 0;
  };

  const handelRiskSubmit = (value) => {
    if (validateRisk()) {
      setIsLoading(true);
      if (value == "Submit") {
        setFormValues((prevValues) => ({
          ...prevValues,
          id: 0,
        }));
      }
      const payload = {
        riskAnalysisSubTaskId: subTaskDetail.id,
        hazardType: formValues.hazardType.value,
        riskAnalysisHazardSituation: [formValues],
      };
      console.log(payload, "payyy");
      let apiPath = "/RiskAnalysis/CreateAnalysis";

      if (value === "Update") {
        apiPath = "/RiskAnalysis/UpdateAnalysis";
      }
      apiAuth
        .post(apiPath, payload)
        .then((resp) => {
          setIsLoading(false);

          setCreateNewRisk(false);
          getRecords();
        })
        .catch((err) => {
          setIsLoading(true);
        });
      setFormValues({
        hazardType: "",
        hazardousSituation: "",
        consequence: "",
        time: "",
        frequencyDetails: "",
        frequencyScoring: "",
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
        humanControlMeasure: "",
        technicalControlMeasure: "",
        organisationalControlMeasure: "",
        modifiedTime: "",
        modifiedFrequencyDetails: "",
        residualFrequencyScoring: "",
        residualLikelihoodScoring: "",
        residualSeverityScoring: "",
        residualRisk: "",
        id: 0,
      });
    }
  };
  const handelRemoveDetails = (id, subId) => {
    setIsLoading(true);
    if (id) {
      apiAuth
        .delete(`/RiskAnalysis/${id}`)
        .then((resp) => {
          console.log(resp.message, "hhh");
          toast?.success("Deleted");
          setIsLoading(false);

          getRecords();
        })
        .catch((err) => setIsLoading(false));
    }
  };

  const handelRiskInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Clear error for the field being changed
    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "time") {
      apiAuth.get(`/LookupData/Lov/30/${value}`).then((resp) => {
        setPotentialFrequencyDetails(resp.data.data);
      });
      setFormValues((prevValues) => ({
        ...prevValues,
        frequencyScoring: "",
        frequencyDetails: "",
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
      }));
    }

    if (name === "frequencyDetails") {
      const selectedOption = potentialFrequencyDetails.find(
        (option) => option.value === value
      );
      const frequencyScoring = selectedOption
        ? calculateFrequencyScoring(selectedOption.text)
        : "";
      setFormValues((prevValues) => ({
        ...prevValues,
        frequencyScoring: frequencyScoring,
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
      }));
    }

    if (
      name === "frequencyDetails" ||
      name === "likelihoodScoring" ||
      name === "severityScoring"
    ) {
      const likelihoodScoring =
        name === "likelihoodScoring" ? value : formValues.likelihoodScoring;
      const severityScoring =
        name === "severityScoring" ? value : formValues.severityScoring;
      const potentialRisk = calculatePotentialRisk(
        formValues.frequencyScoring,
        likelihoodScoring,
        severityScoring
      );

      setFormValues((prevValues) => ({
        ...prevValues,
        potentialRisk: potentialRisk,
      }));
    }
  };
  const goBack = () => {
    setCreateNewRisk(false);
    setViewRisk(false);
    setPotentialFrequencyDetails([]);
    setFormValues({
      ...formValues,
      hazardType: "",
      hazardousSituation: "",
      consequence: "",
      time: "",
      frequencyDetails: "",
      frequencyScoring: "",
      likelihoodScoring: "",
      severityScoring: "",
      potentialRisk: "",
      humanControlMeasure: "",
      technicalControlMeasure: "",
      organisationalControlMeasure: "",
      modifiedTime: "",
      modifiedFrequencyDetails: "",
      residualFrequencyScoring: "",
      residualLikelihoodScoring: "",
      residualSeverityScoring: "",
      residualRisk: "",
    });
  };
  const [hazaid, setHazaId] = useState(0);
  const handelEditRiskDetails = useCallback(
    (id, subid) => {
      setPotentialFrequencyDetails([]);
      setFormValues({
        ...formValues,
        hazardType: "",
        hazardousSituation: "",
        consequence: "",
        time: "",
        frequencyDetails: "",
        frequencyScoring: "",
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
        humanControlMeasure: "",
        technicalControlMeasure: "",
        organisationalControlMeasure: "",
        modifiedTime: "",
        modifiedFrequencyDetails: "",
        residualFrequencyScoring: "",
        residualLikelihoodScoring: "",
        residualSeverityScoring: "",
        residualRisk: "",
      });
      setCreateNewRisk(true);
      apiAuth.get(`/RiskAnalysis/SubTaskDetail?id=${subid}`).then((resp) => {
        setSubTaskDetail(resp.data.data);
      });

      apiAuth.get(`/LookupData/Lov/29`).then((resp) => {
        setPotentialTimeDetails(resp.data.data);
      });
      apiAuth.get(`/LookupData/Lov/30/0`).then((resp) => {
        setPotentialFrequencyDetails(resp.data.data);
      });
      apiAuth.get(`/RiskAnalysis/RiskAnalysisDetail?id=${id}`).then((resp) => {
        setEditRiskAnalysDetail(resp.data.data.riskAnalysisHazardSituation);
        const data = resp.data.data.riskAnalysisHazardSituation[0];

        setHazaId(resp?.data?.data?.hazardType);
        setFormValues({
          ...formValues,
          hazardType: resp?.data?.data?.hazardType,
          hazardousSituation: data?.hazardousSituation,
          consequence: data?.consequence,
          time: data?.time,
          frequencyDetails: data?.frequencyDetails,
          frequencyScoring: data?.frequencyScoring,
          likelihoodScoring: data?.likelihoodScoring,
          severityScoring: data?.severityScoring,
          potentialRisk: data?.potentialRisk,
          humanControlMeasure: data?.humanControlMeasure,
          technicalControlMeasure: data?.technicalControlMeasure,
          organisationalControlMeasure: data?.organisationalControlMeasure,
          modifiedTime: data?.modifiedTime,
          modifiedFrequencyDetails: data?.modifiedFrequencyDetails,
          residualFrequencyScoring: data?.residualFrequencyScoring,
          residualLikelihoodScoring: data?.residualLikelihoodScoring,
          residualSeverityScoring: data?.residualSeverityScoring,
          residualRisk: data?.residualRisk,
          residualRiskClassification: data?.residualRiskClassification,
          id: data?.id,
        });
        apiAuth.get(`/LookupData/Lov/28`).then((resp0) => {
          setSubTaskhazardRiskView(true);
          setSubTaskhazardDetail(resp0.data.data);
          const result = resp0.data.data.find(
            (item) => item.value === resp?.data?.data?.hazardType
          );

          setSubTaskhazardRiskViewName(result.text);
        });
        const { classification, classificationValue } =
          calculateRiskClassification(data?.residualRisk);

        setClassification(classification);
        // if (data.time) {
        //   apiAuth.get(`/LookupData/Lov/30/${data.time}`).then((resp) => {
        //     setPotentialFrequencyDetails(resp.data.data);
        //   });
        // }
        // if (data.frequencyDetails) {
        //   apiAuth
        //     .get(`/LookupData/Lov/30/${data.frequencyDetails}`)
        //     .then((resp) => {
        //       setPotentialFrequencyDetails(resp.data.data);
        //     });
        // }
      });
    },
    [TaskhazardRiskViewName]
  );

  const handleChangeImpact = (e) => {
    const { name, value } = e.target;

    if (name === "particular") {
      apiAuth.get(`/LookupData/Lov/17/${value}`).then((resp) => {
        setParticularSubList(resp?.data.data);
      });
    }
    if (name === "particularSubCategory") {
      apiAuth.get(`/LookupData/Lov/18/${e.target.value}`).then((resp) => {
        setHazardList(resp?.data.data);
      });
    }
    setImpactForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleInputChangeHazard = (event, option) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      hazardType: {
        text: option.text,
        value: option.value,
        isReadOnly: option.isReadOnly,
      },
      task: subTaskDetail.taskName,
      subTask: subTaskDetail.subTaskName,
    }));

    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: "",
    }));

    apiAuth
      .get(`/RiskAnalysis/download/${option.text}`, {
        responseType: "blob",
      })
      .then((resp) => {
        setSubTaskhazardRiskApi(resp.data);
        console.log(resp.data, "daaaa");
        setSubTaskhazardRiskView(true);
        setSubTaskhazardRiskViewName(option.text);
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };

  const handelResidualRiskInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // Clear error for the field being changed
    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "modifiedTime") {
      apiAuth.get(`/LookupData/Lov/30/${value}`).then((resp) => {
        setPotentialFrequencyDetails(resp.data.data);
      });
      setFormValues((prevValues) => ({
        ...prevValues,
        residualFrequencyScoring: "",
        modifiedFrequencyDetails: "",
        residualSeverityScoring: "",
        residualLikelihoodScoring: "",
        residualRisk: "",
      }));
    }

    if (name === "modifiedFrequencyDetails") {
      const selectedOption = potentialFrequencyDetails.find(
        (option) => option.value === value
      );
      const frequencyScoring = selectedOption
        ? calculateFrequencyScoring(selectedOption.text)
        : "";
      const residualFrequencyScoring =
        name === "modifiedFrequencyDetails" ? frequencyScoring : "";
      setFormValues((prevValues) => ({
        ...prevValues,
        residualFrequencyScoring: residualFrequencyScoring,
        residualLikelihoodScoring: "",
        residualSeverityScoring: "",
        residualRisk: "",
      }));
    }

    if (
      name === "modifiedFrequencyDetails" ||
      name === "residualFrequencyScoring" ||
      name === "residualSeverityScoring"
    ) {
      const likelihoodScoring =
        name === "residualLikelihoodScoring"
          ? value
          : formValues.residualLikelihoodScoring;
      const severityScoring =
        name === "residualSeverityScoring"
          ? value
          : formValues.residualSeverityScoring;
      const residualRisk = calculatePotentialRisk(
        formValues.residualFrequencyScoring,
        likelihoodScoring,
        severityScoring
      );
      const { classification, classificationValue } =
        calculateRiskClassification(residualRisk);

      setClassification(classification);
      setFormValues((prevValues) => ({
        ...prevValues,
        residualRisk: residualRisk,
        residualRiskClassification: classificationValue,
      }));
    }
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
          setListDocument1(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  const handleAccordionChange2 = (panel) => (event, isExpanded) => {
    event.preventDefault();
    setExpanded2(isExpanded ? panel : false);
  };

  return (
    <FusePageSimple
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />
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

                    <div className="flex items-center justify-between w-full p-30 pt-24 pb-24 border-t">
                      <button className="ml-1 sm:inline-flex cursor-pointer mat-button mat-stroked-button mat-button-base">
                        <span className="mat-button-wrapper">
                          {/* <h1 className="mat-icon notranslate icon-size-4 mat-icon-no-color mr-3 justify-center" /> */}
                          {/* <Button
                            className="whitespace-nowrap"
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
                            onClick={handleOpenMoc}
                          >
                            Document
                          </Button> */}
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={openMoc}
                            onClose={handleModalClose}
                            closeAfterTransition
                            // Customize backdrop appearance
                            BackdropComponent={Backdrop}
                            // Props for backdrop customization
                            BackdropProps={{
                              timeout: 500, // Adjust as needed
                              style: {
                                // Add backdrop styles here
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                              },
                            }}
                          >
                            <Fade in={openMoc}>
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
                                      <Typography
                                        id="transition-modal-subtitle"
                                        component="h2"
                                      >
                                        {listDocument1.length} Files
                                      </Typography>
                                    </Typography>
                                    {currentActivityForm.canExecute && (
                                      <Box>
                                        <Button
                                          className=""
                                          variant="contained"
                                          color="secondary"
                                          onClick={toggleDrawer(true)}
                                        >
                                          <FuseSvgIcon size={20}>
                                            heroicons-outline:plus
                                          </FuseSvgIcon>
                                          <span className="mx-4 sm:mx-8">
                                            Upload File
                                          </span>
                                        </Button>
                                      </Box>
                                    )}
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
                                      {listDocument1.map((doc, index) => (
                                        <div className="content " key={index}>
                                          <div
                                            onClick={() => handelDetailDoc(doc)}
                                            style={{
                                              textAlign: "-webkit-center",
                                            }}
                                          >
                                            <img
                                              src="/assets/images/etc/icon_N.png"
                                              style={{}}
                                            />
                                            <h6 className="truncate-text">
                                              {doc?.name}
                                            </h6>
                                            <h6>by {doc?.staffName}</h6>
                                          </div>
                                        </div>
                                      ))}
                                    </Typography>
                                  </Box>
                                </Box>
                                {openDrawer && !fileDetails && (
                                  <Box sx={drawerStyle(openDrawer)}>
                                    <div className="flex justify-end">
                                      <Button
                                        className=""
                                        variant="contained"
                                        style={{ backgroundColor: "white" }}
                                        onClick={() => setOpenDrawer(false)}
                                      >
                                        <FuseSvgIcon size={20}>
                                          heroicons-outline:x
                                        </FuseSvgIcon>
                                      </Button>
                                    </div>
                                    <div>&nbsp;</div>

                                    <div className="text-center">
                                      <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                          handelFileChange(e);
                                        }}
                                      />
                                      <label htmlFor="fileInput">
                                        <Button
                                          className=""
                                          variant="contained"
                                          color="secondary"
                                          style={{
                                            backgroundColor: "#24a0ed",
                                            borderRadius: "5px",
                                            paddingLeft: "50px",
                                            paddingRight: "50px",
                                          }}
                                          component="span"
                                        >
                                          <FuseSvgIcon size={20}>
                                            heroicons-outline:plus
                                          </FuseSvgIcon>
                                          <span className="mx-4 sm:mx-8">
                                            Upload File
                                          </span>
                                        </Button>
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
                                          label="Selecte File"
                                          variant="standard"
                                          name="name"
                                          disabled
                                          value={selectedFile.name}
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
                                          name="descritpion"
                                          variant="standard"
                                          onChange={handelFileDiscriptionChange}
                                          value={selectedFile.descritpion}
                                        />
                                      </Box>
                                    </div>

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
                                          backgroundColor: "white",
                                          color: "black",
                                          border: "1px solid grey",
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="whitespace-nowrap"
                                        variant="contained"
                                        color="secondary"
                                        type="submit"
                                        onClick={handleSubmitAsset}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </Box>
                                )}

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
                                          heroicons-outline:x
                                        </FuseSvgIcon>
                                      </Button>
                                    </div>
                                    <div>&nbsp;</div>
                                    <div className="text-center">
                                      <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                          handelFileChange(e);
                                        }}
                                      />
                                      <label htmlFor="fileInput">
                                        <div className=" ">
                                          <div
                                            onClick={handelDetailDoc}
                                            style={{
                                              textAlign: "-webkit-center",
                                            }}
                                          >
                                            <img src="/assets/images/etc/icon_N.png" />
                                          </div>
                                          <h6>{selectedDocument?.name}</h6>
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
                                          name="description"
                                          variant="standard"
                                          disabled
                                          value={
                                            selectedDocument?.description ===
                                            null
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
                                        justifyContent: "end",
                                        backgroundColor: " rgba(248,250,252)",
                                        padding: "10px",
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
                                      {currentActivityForm.canExecute && (
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
                                      )}
                                    </div>
                                  </Box>
                                )}
                              </Box>
                            </Fade>
                          </Modal>
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
                        <h6 className="truncate-text">{doc?.name}</h6>
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
                      <div className="p-30 pt-24 pb-24">
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
                                          <div className="ng-star-inserted">
                                            <span
                                              className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                              style={{
                                                padding: "10px",
                                              }}
                                            >
                                              {list.comments === "" ? (
                                                "No Comments Added"
                                              ) : (
                                                <div className="mb-12">
                                                  <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                                    comments
                                                  </span>
                                                  <span className="task-detail-value">
                                                    {list.comments}
                                                  </span>
                                                </div>
                                              )}
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
                                              <span>{list?.comments}</span>
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
                          <div className="mt-5 mb-4 ">
                            <h5>
                              {errorss ? (
                                <b className="text-red">{errorss}</b>
                              ) : (
                                "No stakeholders added"
                              )}
                            </h5>
                          </div>
                        )}

                        {addStake &&
                          forms.map((form, index) => (
                            <div
                              style={{
                                // margin: "30px",
                                justifyContent: "space-start",
                              }}
                              className="flex flex-row pt-24 pb-24"
                              key={index}
                            >
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <FormControl
                                  sx={
                                    {
                                      // marginLeft: "10px",
                                    }
                                  }
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
                                  <Autocomplete
                                    id="consultedStaffId"
                                    options={docStaff}
                                    getOptionLabel={(option) =>
                                      option.text || ""
                                    }
                                    value={
                                      docStaff.find(
                                        (staff) =>
                                          staff.value ===
                                          form.data.consultedStaffId
                                      ) || null
                                    }
                                    onChange={(event, newValue) => {
                                      handleChangeStaff(form.id, {
                                        target: {
                                          name: "consultedStaffId",
                                          value: newValue ? newValue.value : "",
                                        },
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Search Staff"
                                        error={
                                          !!errors[index]?.consultedStaffId
                                        }
                                      />
                                    )}
                                  />
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

                            <div className="flex justify-between pt-24 pb-24">
                              <div>
                                <Button
                                  className="whitespace-nowrap"
                                  style={{
                                    border: "1px solid",
                                    backgroundColor: "#0000",
                                    color: "black",
                                    borderColor: "rgba(203,213,225)",
                                    // marginLeft: "10px",
                                    // marginTop: "10px",
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
                                  className="whitespace-nowrap "
                                  style={{
                                    border: "1px solid",
                                    backgroundColor: "#0000",
                                    color: "black",
                                    borderColor: "rgba(203,213,225)",
                                    marginLeft: "10px",
                                    // marginTop: "10px",
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
                                    // marginTop: "8px",
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
                                sx={{ mt: 1, mb: 1 }}
                                error={!!errorsUrl.handelUrlChange}
                              >
                                <span>
                                  {" "}
                                  Consolidated Document Url (Provide the link of
                                  SharePoint File)*
                                </span>
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
                              className="whitespace-nowrap mb-5 "
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
                              class="flex items-center w-full mb-10 mt-10  border-b justify-between"
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
                          <div className=" pt-10 pb-24">
                            <div className="flex row">
                              <div className="ng-star-inserted">
                                <div>
                                  Consolidated Document Url (Provide the link of
                                  SharePoint File)
                                </div>
                                <div className="font-semibold">
                                  <a
                                    href={contentDetails?.remarks}
                                    rel="noopener noreferrer"
                                    className="text-blue"
                                  >
                                    {contentDetails?.remarks}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Paper>
                    {canEdits && (
                      <Paper
                        className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden"
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
                            Help
                          </h2>
                        </div>
                        <div className="prose p-30 pt-24 pb-24">
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
                              href={contentDetails?.documentUrl}
                            >
                              {contentDetails?.documentUrl}
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
                              href={contentDetails?.consolidatedDocumentUrl}
                            >
                              {contentDetails?.consolidatedDocumentUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                )}

                {currentPhase === "Implementation" && (
                  <>
                    {CreateNewRisk ? (
                      <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
                        <div>
                          <div className="flex items-center w-full p-30 pt-24 pb-24 border-b pb-5 justify-between">
                            <h2 className="text-2xl font-semibold">
                              New Risk Analysis
                            </h2>
                          </div>
                          <div className="font-semibold p-30 pt-24 pb-0 ">
                            <Link
                              rel="noopener noreferrer"
                              onClick={goBack}
                              className="text-blue"
                            >
                              {viewrisk ? "Back to Impact List" : "Go Back"}
                            </Link>
                          </div>
                        </div>
                        <div className="p-30 pt-24 pb-24">
                          <Box
                            sx={{
                              // display: "flex",
                              // flexWrap: "wrap",
                              marginTop: "15px",
                            }}
                          >
                            <FormControl
                              fullWidth
                              sx={taskFormControlStyles}
                              className="m-0"
                            >
                              <FormLabel
                                htmlFor="hazardDetail"
                                className="font-semibold leading-none"
                              >
                                Task
                              </FormLabel>
                              {viewrisk ? (
                                <>
                                  <span>{subTaskDetail.taskName}</span>
                                </>
                              ) : (
                                <OutlinedInput
                                  id="hazardDetail"
                                  name="hazardDetail"
                                  value={subTaskDetail.taskName}
                                  onChange={handleChangeImpact}
                                  label="Reason For Change*"
                                  className="mt-5"
                                  disabled
                                />
                              )}
                            </FormControl>
                            <FormControl
                              fullWidth
                              sx={{ margin: "15px 0 0 0", maxWidth: "100%" }}
                            >
                              <FormLabel
                                htmlFor="hazardDetail"
                                className="font-semibold leading-none"
                              >
                                Sub Task
                              </FormLabel>
                              {viewrisk ? (
                                <>
                                  <span>{subTaskDetail.subTaskName}</span>
                                </>
                              ) : (
                                <OutlinedInput
                                  id="hazardDetail"
                                  name="hazardDetail"
                                  value={subTaskDetail.subTaskName}
                                  onChange={handleChangeImpact}
                                  label="Reason For Change*"
                                  className="mt-5"
                                  disabled
                                />
                              )}
                            </FormControl>

                            {viewrisk ? (
                              <Box
                                className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 w-full"
                                sx={{
                                  width: TaskhazardRiskView ? 818 : 600,
                                  maxWidth: "100%",
                                }}
                              >
                                <FormControl
                                  fullWidth
                                  sx={{ margin: "20px 0 0 0" }}
                                >
                                  <FormLabel
                                    htmlFor="Time"
                                    className="font-semibold leading-none"
                                  >
                                    Hazard Type
                                  </FormLabel>

                                  <Select
                                    labelId="time-select-label"
                                    id="time-select"
                                    label="hazardType *"
                                    name="hazardType"
                                    value={
                                      formValues.hazardType.value
                                        ? formValues.hazardType.value
                                        : hazaid
                                    }
                                    onChange={(e) => {
                                      const selectedOption =
                                        subTaskhazardDetail.find(
                                          (option) =>
                                            option.value === e.target.value
                                        );
                                      handleInputChangeHazard(
                                        e,
                                        selectedOption
                                      );
                                    }}
                                    error={!!errorsSub.hazardType}
                                    disabled
                                    sx={{
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none",
                                      },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          border: "none",
                                        },
                                      "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          border: "none",
                                        },
                                      "& .MuiSelect-icon": {
                                        display: "none",
                                      },
                                      "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                        {
                                          padding: "0px",
                                        },
                                    }}
                                  >
                                    <MenuItem value="" disabled>
                                      <em>None</em>
                                    </MenuItem>
                                    {subTaskhazardDetail.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.text}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {!!errorsSub.hazardType && (
                                    <FormHelperText error>
                                      {errorsSub.hazardType}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: TaskhazardRiskView ? 818 : 600,
                                }}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
                              >
                                <FormControl
                                  fullWidth
                                  sx={{ flexGrow: 1, margin: "20px 0 0 0" }}
                                >
                                  <InputLabel id="division-label">
                                    Hazard Type *
                                  </InputLabel>
                                  <Select
                                    labelId="division-label"
                                    name="hazardType"
                                    value={
                                      formValues?.hazardType?.value
                                        ? formValues?.hazardType?.value
                                        : hazaid
                                    }
                                    onChange={(e) => {
                                      const selectedOption =
                                        subTaskhazardDetail.find(
                                          (option) =>
                                            option.value === e.target.value
                                        );
                                      handleInputChangeHazard(
                                        e,
                                        selectedOption
                                      );
                                    }}
                                    error={!!errorsSub.hazardType}
                                  >
                                    <MenuItem value="" disabled>
                                      <em>None</em>
                                    </MenuItem>
                                    {subTaskhazardDetail.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.text}
                                      </MenuItem>
                                    ))}
                                  </Select>

                                  {!!errorsSub.hazardType && (
                                    <FormHelperText error>
                                      {errorsSub.hazardType}
                                    </FormHelperText>
                                  )}
                                </FormControl>

                                <Box
                                  sx={{
                                    margin: "15px 0 0 0",
                                    padding: "12px 0 0 0",
                                  }}
                                >
                                  {TaskhazardRiskView && (
                                    <>
                                      <a
                                        href={URL.createObjectURL(
                                          new Blob([TaskhazardRiskApi], {
                                            type: "application/pdf",
                                          })
                                        )}
                                        target="_blank"
                                        className="text-blue"
                                        rel="noopener noreferrer"
                                        style={{
                                          backgroundColor: "white",
                                          marginRight: "15px",
                                        }}
                                      >
                                        {TaskhazardRiskViewName}.pdf
                                      </a>
                                    </>
                                  )}

                                  <a
                                    href={URL.createObjectURL(
                                      new Blob([generalGuidePdf], {
                                        type: "application/pdf",
                                      })
                                    )}
                                    target="_blank"
                                    className="text-blue"
                                    rel="noopener noreferrer"
                                    style={{
                                      backgroundColor: "white",
                                      color: "blue",
                                    }}
                                    onClick={handleGeneralGuideClick}
                                  >
                                    General Guide
                                  </a>
                                </Box>
                              </Box>
                            )}
                          </Box>
                          <Box
                            sx={
                              {
                                // marginTop: "15px",
                              }
                            }
                          >
                            <div className="flex-auto">
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    // margin: "10px",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
                                >
                                  <Box
                                    sx={{
                                      width: 600,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column", // Stack items vertically
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Hazardous Situation
                                        </FormLabel>

                                        <span className="pt-5">
                                          {formValues.hazardousSituation}
                                        </span>
                                      </Box>
                                    ) : (
                                      <TextField
                                        fullWidth
                                        label="Hazardous Situation *"
                                        name="hazardousSituation"
                                        value={formValues.hazardousSituation}
                                        onChange={handelRiskInputChange}
                                        error={!!errorsSub.hazardousSituation}
                                        helperText={
                                          errorsSub.hazardousSituation
                                        }
                                      />
                                    )}
                                  </Box>
                                  <Box
                                    sx={{
                                      width: 600,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column", // Stack items vertically
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Consequence
                                        </FormLabel>
                                        <span className="pt-5">
                                          {formValues.consequence}
                                        </span>
                                      </Box>
                                    ) : (
                                      <TextField
                                        fullWidth
                                        label="Consequence *"
                                        name="consequence"
                                        value={formValues.consequence}
                                        onChange={handelRiskInputChange}
                                        error={!!errorsSub.consequence}
                                        helperText={errorsSub.consequence}
                                      />
                                    )}
                                  </Box>
                                </div>
                              </div>
                              <h3
                                style={{
                                  padding: "10px 0",
                                  margin: "15px 0 0 0",
                                }}
                              >
                                <b>Potential Risk</b>
                              </h3>
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    // margin: "15px 0 0 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                                >
                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            htmlFor="Time"
                                            className="font-semibold leading-none"
                                          >
                                            Time
                                          </FormLabel>

                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Time *"
                                            name="time"
                                            value={formValues.time}
                                            onChange={handelRiskInputChange}
                                            error={!!errorsSub.time}
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {potentialTimeDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {!!errorsSub.time && (
                                            <FormHelperText error>
                                              {errorsSub.time}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 380,
                                        maxWidth: "100%",
                                        margin: "15px 0 0 0",
                                      }}
                                    >
                                      <FormControl fullWidth>
                                        <InputLabel id="time-select-label">
                                          Time *
                                        </InputLabel>
                                        <Select
                                          labelId="time-select-label"
                                          id="time-select"
                                          label="Time *"
                                          name="time"
                                          value={formValues.time}
                                          onChange={handelRiskInputChange}
                                          error={!!errorsSub.time}
                                        >
                                          <MenuItem value="" disabled>
                                            <em>None</em>
                                          </MenuItem>
                                          {potentialTimeDetails.map(
                                            (option) => (
                                              <MenuItem
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.text}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                        {!!errorsSub.time && (
                                          <FormHelperText error>
                                            {errorsSub.time}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Box>
                                  )}

                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            htmlFor="Frequency"
                                            className="font-semibold leading-none"
                                          >
                                            Frequency
                                          </FormLabel>
                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Frequency *"
                                            name="frequencyDetails"
                                            value={formValues.frequencyDetails}
                                            onChange={handelRiskInputChange}
                                            error={!!errorsSub.frequencyDetails}
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            {potentialFrequencyDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {!!errorsSub.frequencyDetails && (
                                            <FormHelperText error>
                                              {errorsSub.frequencyDetails}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 380,
                                        maxWidth: "100%",
                                        margin: "15px 0 0 0",
                                      }}
                                    >
                                      <FormControl fullWidth>
                                        <InputLabel id="time-select-label">
                                          Frequency *
                                        </InputLabel>
                                        <Select
                                          labelId="time-select-label"
                                          id="time-select"
                                          label="Frequency *"
                                          name="frequencyDetails"
                                          value={formValues.frequencyDetails}
                                          onChange={handelRiskInputChange}
                                          error={!!errorsSub.frequencyDetails}
                                        >
                                          {potentialFrequencyDetails.map(
                                            (option) => (
                                              <MenuItem
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.text}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                        {!!errorsSub.frequencyDetails && (
                                          <FormHelperText error>
                                            {errorsSub.frequencyDetails}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Box>
                                  )}

                                  <Box
                                    sx={{
                                      width: 380,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column", // Stack items vertically
                                          }}
                                        >
                                          <FormLabel
                                            htmlFor="hazardDetail"
                                            className="font-semibold leading-none"
                                          >
                                            Frequency Scoring
                                          </FormLabel>
                                          &nbsp;&nbsp; &nbsp;&nbsp;
                                          <span style={{ color: "#a3a9b4" }}>
                                            {formValues.frequencyScoring}
                                          </span>
                                        </Box>
                                      </>
                                    ) : (
                                      <>
                                        <TextField
                                          fullWidth
                                          label="Frequency Scoring"
                                          name="frequencyScoring"
                                          value={formValues.frequencyScoring}
                                          disabled
                                        />
                                      </>
                                    )}
                                  </Box>
                                </div>
                              </div>{" "}
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    // margin: "15px 0 0 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full "
                                >
                                  <Box
                                    sx={{
                                      width: 380,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <>
                                        <FormControl fullWidth>
                                          <FormLabel
                                            htmlFor=" Likelihood Scoring"
                                            className="font-semibold leading-none"
                                          >
                                            Likelihood Scoring
                                          </FormLabel>
                                          <Select
                                            labelId="likelihood-select-label"
                                            id="likelihood-select"
                                            label="Likelihood Scoring"
                                            name="likelihoodScoring"
                                            onChange={handelRiskInputChange}
                                            value={formValues.likelihoodScoring}
                                            error={
                                              !!errorsSub.likelihoodScoring
                                            }
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.likelihoodScoring && (
                                            <FormHelperText error>
                                              {errorsSub.likelihoodScoring}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </>
                                    ) : (
                                      <>
                                        <FormControl fullWidth>
                                          <InputLabel id="likelihood-select-label">
                                            Likelihood Scoring
                                          </InputLabel>
                                          <Select
                                            labelId="likelihood-select-label"
                                            id="likelihood-select"
                                            label="Likelihood Scoring"
                                            name="likelihoodScoring"
                                            onChange={handelRiskInputChange}
                                            value={formValues.likelihoodScoring}
                                            error={
                                              !!errorsSub.likelihoodScoring
                                            }
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.likelihoodScoring && (
                                            <FormHelperText error>
                                              {errorsSub.likelihoodScoring}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </>
                                    )}
                                  </Box>
                                  <Box
                                    sx={{
                                      width: 380,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <>
                                        <FormLabel
                                          htmlFor="Frequency"
                                          className="font-semibold leading-none"
                                        >
                                          Frequency
                                        </FormLabel>
                                        <FormControl fullWidth>
                                          <Select
                                            labelId="severity-select-label"
                                            id="severity-select"
                                            label="Severity Scoring"
                                            name="severityScoring"
                                            value={formValues.severityScoring}
                                            onChange={handelRiskInputChange}
                                            error={!!errorsSub.severityScoring}
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.severityScoring && (
                                            <FormHelperText error>
                                              {errorsSub.severityScoring}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </>
                                    ) : (
                                      <>
                                        <FormControl fullWidth>
                                          <InputLabel id="severity-select-label">
                                            Severity Scoring
                                          </InputLabel>
                                          <Select
                                            labelId="severity-select-label"
                                            id="severity-select"
                                            label="Severity Scoring"
                                            name="severityScoring"
                                            value={formValues.severityScoring}
                                            onChange={handelRiskInputChange}
                                            error={!!errorsSub.severityScoring}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.severityScoring && (
                                            <FormHelperText error>
                                              {errorsSub.severityScoring}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </>
                                    )}
                                  </Box>
                                  <Box
                                    sx={{
                                      width: 380,
                                      maxWidth: "100%",
                                      margin: "15px 0 0 0",
                                    }}
                                  >
                                    {viewrisk ? (
                                      <>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column", // Stack items vertically
                                          }}
                                        >
                                          <FormLabel
                                            htmlFor="hazardDetail"
                                            className="font-semibold leading-none"
                                          >
                                            Potential Risk
                                          </FormLabel>
                                          &nbsp;&nbsp; &nbsp;&nbsp;
                                          <span style={{ color: "#a3a9b4" }}>
                                            {formValues.potentialRisk}
                                          </span>
                                        </Box>
                                      </>
                                    ) : (
                                      <>
                                        <TextField
                                          fullWidth
                                          label="Potential Risk"
                                          name="potentialRisk"
                                          value={formValues.potentialRisk}
                                          disabled
                                        />
                                      </>
                                    )}
                                  </Box>
                                </div>
                              </div>{" "}
                              <h3
                                style={{
                                  padding: "10px 0",
                                  margin: "15px 0 0 0",
                                }}
                              >
                                <b>Control Measures</b>
                              </h3>
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    // margin: "15px 0 0 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                                >
                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column", // Stack items vertically
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Human
                                        </FormLabel>
                                        &nbsp;&nbsp; &nbsp;&nbsp;
                                        <span>
                                          {formValues.humanControlMeasure}
                                        </span>
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        margin: "15px 0 0 0",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="Human * "
                                        name="humanControlMeasure"
                                        onChange={handelRiskInputChange}
                                        value={formValues.humanControlMeasure}
                                        error={errorsSub.humanControlMeasure}
                                        helperText={
                                          errorsSub.humanControlMeasure
                                        }
                                      />
                                    </Box>
                                  )}
                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column", // Stack items vertically
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Technical
                                        </FormLabel>
                                        &nbsp;&nbsp; &nbsp;&nbsp;
                                        <span>
                                          {formValues.technicalControlMeasure}
                                        </span>
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 480,
                                        maxWidth: "100%",
                                        margin: "15px 0 0 0",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="Technical *"
                                        name="technicalControlMeasure"
                                        onChange={handelRiskInputChange}
                                        value={
                                          formValues.technicalControlMeasure
                                        }
                                        error={
                                          errorsSub.technicalControlMeasure
                                        }
                                        helperText={
                                          errorsSub.technicalControlMeasure
                                        }
                                      />
                                    </Box>
                                  )}

                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          margin: "15px 0 0 0",
                                          flexDirection: "column", // Stack items vertically
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Organisational
                                        </FormLabel>
                                        &nbsp;&nbsp; &nbsp;&nbsp;
                                        <span>
                                          {
                                            formValues.organisationalControlMeasure
                                          }
                                        </span>
                                      </Box>
                                    </>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 380,
                                        maxWidth: "100%",
                                        margin: "15px 0 0 0",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        label="Organisational *"
                                        name="organisationalControlMeasure"
                                        onChange={handelRiskInputChange}
                                        value={
                                          formValues.organisationalControlMeasure
                                        }
                                        error={
                                          errorsSub.organisationalControlMeasure
                                        }
                                        helperText={
                                          errorsSub.organisationalControlMeasure
                                        }
                                      />
                                    </Box>
                                  )}
                                </div>
                              </div>{" "}
                              <h3
                                style={{
                                  padding: "10px 0",
                                  margin: "15px 0 0 0",
                                }}
                              >
                                <b>Residual Risk</b>
                              </h3>
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    // margin: "10px",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                                >
                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          margin: "15px 0 0 0",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            id="time-select-label"
                                            className="font-semibold leading-none"
                                          >
                                            Time
                                          </FormLabel>
                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Time * "
                                            name="modifiedTime"
                                            value={formValues.modifiedTime}
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={!!errorsSub.modifiedTime}
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {potentialTimeDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {errorsSub.modifiedTime && (
                                            <FormHelperText error>
                                              {errorsSub.modifiedTime}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="time-select-label">
                                            Time *
                                          </InputLabel>
                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Time * "
                                            name="modifiedTime"
                                            value={formValues.modifiedTime}
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={!!errorsSub.modifiedTime}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {potentialTimeDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {errorsSub.modifiedTime && (
                                            <FormHelperText error>
                                              {errorsSub.modifiedTime}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  )}

                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            id="time-select-label"
                                            className="font-semibold leading-none"
                                          >
                                            Frequency
                                          </FormLabel>
                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Frequency *"
                                            name="modifiedFrequencyDetails"
                                            value={
                                              formValues.modifiedFrequencyDetails
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.modifiedFrequencyDetails
                                            }
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {potentialFrequencyDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {errorsSub.modifiedFrequencyDetails && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.modifiedFrequencyDetails
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="time-select-label">
                                            Frequency *
                                          </InputLabel>
                                          <Select
                                            labelId="time-select-label"
                                            id="time-select"
                                            label="Frequency *"
                                            name="modifiedFrequencyDetails"
                                            value={
                                              formValues.modifiedFrequencyDetails
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.modifiedFrequencyDetails
                                            }
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {potentialFrequencyDetails.map(
                                              (option) => (
                                                <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.text}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {errorsSub.modifiedFrequencyDetails && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.modifiedFrequencyDetails
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  )}
                                  {viewrisk ? (
                                    <>
                                      {" "}
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="hazardDetail"
                                          className="font-semibold leading-none"
                                        >
                                          Frequency Scoring
                                        </FormLabel>
                                        &nbsp;&nbsp; &nbsp;&nbsp;
                                        <span style={{ color: "#a3a9b4" }}>
                                          {formValues.residualFrequencyScoring}
                                        </span>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <TextField
                                          fullWidth
                                          label="Frequency Scoring *"
                                          name="handelResidualRiskInputChange"
                                          value={
                                            formValues.residualFrequencyScoring
                                          }
                                          disabled
                                        />
                                      </Box>
                                    </>
                                  )}
                                </div>
                              </div>{" "}
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                                >
                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            id="time-select-label"
                                            className="font-semibold leading-none"
                                          >
                                            Likelihood Scoring
                                          </FormLabel>
                                          <Select
                                            labelId="likelihood-select-label"
                                            id="likelihood-select"
                                            label="Likelihood Scoring"
                                            name="residualLikelihoodScoring"
                                            value={
                                              formValues.residualLikelihoodScoring
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.residualLikelihoodScoring
                                            }
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.residualLikelihoodScoring && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.residualLikelihoodScoring
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="likelihood-select-label">
                                            Likelihood Scoring
                                          </InputLabel>
                                          <Select
                                            labelId="likelihood-select-label"
                                            id="likelihood-select"
                                            label="Likelihood Scoring"
                                            name="residualLikelihoodScoring"
                                            value={
                                              formValues.residualLikelihoodScoring
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.residualLikelihoodScoring
                                            }
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.residualLikelihoodScoring && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.residualLikelihoodScoring
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  )}

                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <FormLabel
                                            id="time-select-label"
                                            className="font-semibold leading-none"
                                          >
                                            Severity Scoring
                                          </FormLabel>
                                          <Select
                                            labelId="severity-select-label"
                                            id="severity-select"
                                            label="Residual Severity Scoring"
                                            name="residualSeverityScoring"
                                            value={
                                              formValues.residualSeverityScoring
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.residualSeverityScoring
                                            }
                                            disabled
                                            sx={{
                                              "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  border: "none",
                                                },
                                              "& .MuiSelect-icon": {
                                                display: "none",
                                              },
                                              "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                                {
                                                  padding: "0px",
                                                },
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.residualSeverityScoring && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.residualSeverityScoring
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="severity-select-label">
                                            Severity Scoring
                                          </InputLabel>
                                          <Select
                                            labelId="severity-select-label"
                                            id="severity-select"
                                            label="Residual Severity Scoring"
                                            name="residualSeverityScoring"
                                            value={
                                              formValues.residualSeverityScoring
                                            }
                                            onChange={(e) =>
                                              handelResidualRiskInputChange(e)
                                            }
                                            error={
                                              !!errorsSub.residualSeverityScoring
                                            }
                                          >
                                            <MenuItem value="" disabled>
                                              <em>None</em>
                                            </MenuItem>
                                            {likelihoodValues.map((value) => (
                                              <MenuItem
                                                key={value}
                                                value={value}
                                              >
                                                {value}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                          {errorsSub.residualSeverityScoring && (
                                            <FormHelperText error>
                                              {
                                                errorsSub.residualSeverityScoring
                                              }
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      </Box>
                                    </>
                                  )}

                                  {viewrisk ? (
                                    <>
                                      <Box
                                        sx={{
                                          width: 280,
                                          maxWidth: "100%",
                                          display: "flex",
                                          flexDirection: "column",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <FormLabel
                                          htmlFor="Residual Risk"
                                          className="font-semibold leading-none"
                                        >
                                          Residual Risk
                                        </FormLabel>
                                        &nbsp;&nbsp; &nbsp;&nbsp;
                                        <span style={{ color: "#a3a9b4" }}>
                                          {formValues.residualRisk}
                                        </span>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 380,
                                          maxWidth: "100%",
                                          margin: "15px 0 0 0",
                                        }}
                                      >
                                        <TextField
                                          fullWidth
                                          label="Residual Risk"
                                          name="residualRisk"
                                          value={formValues.residualRisk}
                                          disabled
                                        />
                                      </Box>
                                    </>
                                  )}
                                </div>
                              </div>{" "}
                            </div>
                          </Box>
                          <div
                            className="flex justify-end"
                            style={{
                              paddingLeft: "10px",
                              paddingBottom: "5px",
                              margin: "15px 0 0 0",
                            }}
                          >
                            <Button
                              variant="contained"
                              disabled
                              style={{
                                backgroundColor:
                                  formValues.residualRiskClassification == 1
                                    ? "red"
                                    : formValues.residualRiskClassification == 2
                                      ? "purple"
                                      : formValues.residualRiskClassification ==
                                          3
                                        ? "orange"
                                        : formValues.residualRiskClassification ==
                                            4
                                          ? "yellow"
                                          : formValues.residualRiskClassification ==
                                              5
                                            ? "green"
                                            : "",
                                borderRadius: "5px",
                                padding: "10px 20px",
                                fontSize: "14px",
                                color:
                                  formValues.residualRiskClassification == 4
                                    ? "#000"
                                    : "white",
                                cursor: "pointer",
                              }}
                            >
                              {Classifications}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center w-full border-b pb-5 justify-between"></div>
                        <div className="flex justify-end p-30 pt-24 pb-24">
                          {!viewrisk && (
                            <>
                              <Button
                                className="whitespace-nowrap"
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
                                className="whitespace-nowrap ms-5 "
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                  handelRiskSubmit(
                                    editRiskAnalysDetail.length
                                      ? "Update"
                                      : "Submit"
                                  )
                                }
                              >
                                {editRiskAnalysDetail.length
                                  ? "Update"
                                  : "Submit"}
                              </Button>
                            </>
                          )}
                          {viewrisk && (
                            <Button
                              className="whitespace-nowrap mt-5"
                              style={{
                                border: "1px solid",
                                backgroundColor: "#0000",
                                color: "black",
                                borderColor: "rgba(203,213,225)",
                                marginLeft: "10px",
                                // marginTop: "10px",
                              }}
                              variant="contained"
                              onClick={goBack}
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </Paper>
                    ) : (
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
                          <StyledBadge badgeContent={listDocument1.length}>
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
                              onClick={HandleTraining}
                            >
                              Training Attendence Sheet
                            </Button>
                          </StyledBadge>
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
                                      <Typography
                                        id="transition-modal-subtitle"
                                        component="h2"
                                      >
                                        {listDocument.length} Files
                                      </Typography>
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
                                            style={{
                                              textAlign: "-webkit-center",
                                            }}
                                          >
                                            <img
                                              src="/assets/images/etc/icon_N.png"
                                              style={{}}
                                            />
                                            <h6 className="truncate-text">
                                              {doc?.name}
                                            </h6>
                                            <h6>by {doc?.staffName}</h6>
                                          </div>
                                        </div>
                                      ))}
                                    </Typography>
                                  </Box>
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
                                          heroicons-outline:x
                                        </FuseSvgIcon>
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
                                          name="description"
                                          variant="standard"
                                          disabled
                                          value={
                                            selectedDocument?.description ===
                                            null
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
                                    </div>
                                  </Box>
                                )}
                              </Box>
                            </Fade>
                          </Modal>
                        </div>

                        <Box
                          sx={{ width: "100%" }}
                          className="p-30 pt-24 pb-24"
                        >
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                              value={value}
                              onChange={handleChange}
                              aria-label="basic tabs example"
                            >
                              <Tab label="Task" {...a11yProps(0)} />
                              <Tab label="Checklist" {...a11yProps(1)} />
                            </Tabs>
                          </Box>
                          <CustomTabPanel
                            value={value}
                            index={0}
                            className="task_accordians"
                          >
                            <div class="flex flex-col w-full border rounded ">
                              <div
                                _ngcontent-fyk-c288=""
                                class="flex items-center w-full p-10 border-b justify-between"
                                style={{
                                  paddingRight: "15px",
                                  paddingLeft: "15px",
                                }}
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
                                  {/* <Button
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
                                </Button> */}
                                </div>

                                <TextField
                                  variant="filled"
                                  fullWidth
                                  placeholder="Search"
                                  style={{
                                    // marginBottom: "15px",
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
                              {taskLists.map((task, index) => {
                                // Find matching risk analysis items
                                const matchingRisks = riskLists.filter(
                                  (risk) =>
                                    risk.changeImapactId ===
                                    task.changeImapactId
                                );

                                return (
                                  <Accordion
                                    key={task.id}
                                    expanded={expanded2 === task.id}
                                    onChange={handleAccordionChange2(task.id)}
                                    style={{ margin: "0px" }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls={`panel${task.id}-content`}
                                      id={`panel${task.id}-header`}
                                      style={{ minHeight: "60px" }}
                                      onClick={(e) =>
                                        handelComments(e, task.id)
                                      }
                                    >
                                      <div className="d-flex flex-wrap justify-between w-100">
                                        <div className="inventory-grid grid items-center gap-4 m-0">
                                          <div className="flex items-center">
                                            Task #{task.id}
                                          </div>
                                        </div>

                                        <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                          <div className="flex items-center">
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

                                        {/* Risk Count or No Risks */}
                                        <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                          <div className="flex items-center">
                                            <div
                                              className="rounded-full"
                                              style={{
                                                color:
                                                  matchingRisks.length > 0
                                                    ? "brown"
                                                    : "",
                                                paddingLeft: "10px",
                                                paddingRight: "10px",
                                              }}
                                            >
                                              {matchingRisks.length > 0
                                                ? `${matchingRisks.length} Risks`
                                                : "No Risks"}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                          <div className="flex items-center">
                                            {task.assignedStaff}
                                          </div>
                                        </div>

                                        <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                                          <div className="flex items-center">
                                            {formatDate(task.dueDate)}
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Stepper orientation="vertical">
                                        <Step>
                                          <div
                                            style={{
                                              alignItems: "flex-start",
                                            }}
                                          >
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
                                                      backgroundColor:
                                                        "#EBF8FF",
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
                                                style={{
                                                  fontSize: "xx-small",
                                                }}
                                              >
                                                <b>{task?.assignedByStaff}</b>{" "}
                                                has assigned task to{" "}
                                                <b>{task?.assignedStaff}</b> on{" "}
                                                {formatDate(task.assignedAt)}
                                              </div>
                                              <div className="flex-auto border-b"></div>
                                            </div>

                                            {impComments.map((msg) => (
                                              <div
                                                key={msg.id}
                                                className="flex flex-row flex-wrap mb-10"
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
                                                      style={{
                                                        padding: "10px",
                                                      }}
                                                    >
                                                      <div
                                                        className="font-semibold"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        {" "}
                                                        {
                                                          task.assignedStaff
                                                        }{" "}
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
                                                          sss
                                                        </small>
                                                      </div>
                                                    </div>
                                                    <StyledBadge
                                                      badgeContent={
                                                        documentCounts[msg.id]
                                                      }
                                                    >
                                                      <button
                                                        className="icon-button"
                                                        onClick={() =>
                                                          handleOpen(msg.id)
                                                        }
                                                        style={{
                                                          top: "-0px",
                                                          right: "-6px",
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
                                                        backgroundColor:
                                                          "#EBF8FF",
                                                      }}
                                                    >
                                                      <div
                                                        className="font-semibold"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        {" "}
                                                        {
                                                          task.assignedByStaff
                                                        }{" "}
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
                                                                minute:
                                                                  "numeric",
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
                                                <div className="mb-10">
                                                  <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                                    <div
                                                      _ngcontent-fyk-c288=""
                                                      class="flex items-center w-full  border-b justify-between"
                                                    ></div>
                                                  </div>
                                                  {currentActivityForm.canEdit && (
                                                    <div
                                                      className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                                      style={{
                                                        width: "100%",
                                                      }}
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
                                                    <div className="flex justify-start  ">
                                                      <Button
                                                        className="whitespace-nowrap ms-5 "
                                                        variant="contained"
                                                        color="secondary"
                                                        style={{
                                                          marginTop: "10px",
                                                          backgroundColor:
                                                            "white",
                                                          color: "black",
                                                        }}
                                                        onClick={(e) =>
                                                          handelRejectImpl(
                                                            e,
                                                            task
                                                          )
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
                                                          handelApproveImpl(
                                                            e,
                                                            task
                                                          )
                                                        }
                                                      >
                                                        Approve
                                                      </Button>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            {matchingRisks.length != 0 && (
                                              <TableContainer
                                                component={Paper}
                                                style={{
                                                  margin: "0 0 10px 0",
                                                }}
                                              >
                                                <Table>
                                                  <TableHead>
                                                    <TableRow
                                                      style={{
                                                        backgroundColor:
                                                          "rgb(241 248 255)",
                                                      }}
                                                    >
                                                      <TableCell
                                                      // style={{ padding: "15px" }}
                                                      >
                                                        Risk Details
                                                      </TableCell>
                                                      <TableCell
                                                      // style={{ padding: "10px" }}
                                                      >
                                                        Human Measures
                                                      </TableCell>
                                                      <TableCell
                                                      // style={{ padding: "10px" }}
                                                      >
                                                        Technical Measures
                                                      </TableCell>
                                                      <TableCell
                                                      // style={{ padding: "10px" }}
                                                      >
                                                        Organisational Measures
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {matchingRisks?.map(
                                                      (sub, index) =>
                                                        sub.riskAnalysisSubTasks.map(
                                                          (subItm) => (
                                                            <React.Fragment
                                                              key={index}
                                                            >
                                                              {subItm
                                                                .riskAnalysisHazardTypes
                                                                .length ===
                                                              0 ? (
                                                                <TableRow>
                                                                  <TableCell>
                                                                    <Grid
                                                                      container
                                                                      className="inventory-grid"
                                                                    >
                                                                      <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={4}
                                                                      >
                                                                        <Typography
                                                                          variant="h6"
                                                                          style={{
                                                                            paddingBottom:
                                                                              "5px",
                                                                          }}
                                                                          className="text-sm"
                                                                        >
                                                                          {
                                                                            subItm.subTaskName
                                                                          }
                                                                        </Typography>
                                                                      </Grid>
                                                                      <Grid
                                                                        item
                                                                        xs={12}
                                                                      >
                                                                        {currentActivityForm.canEdit && (
                                                                          <span
                                                                            className="text-white d-inline-block"
                                                                            style={{
                                                                              backgroundColor:
                                                                                "#2563eb",
                                                                              borderRadius:
                                                                                "5px",
                                                                              padding:
                                                                                "3px",
                                                                              fontSize:
                                                                                "10px",
                                                                              cursor:
                                                                                "pointer",
                                                                            }}
                                                                            onClick={() =>
                                                                              handelRisk(
                                                                                subItm.id
                                                                              )
                                                                            }
                                                                          >
                                                                            Create
                                                                            New
                                                                            Risk
                                                                            Analysis
                                                                          </span>
                                                                        )}
                                                                      </Grid>
                                                                    </Grid>
                                                                  </TableCell>
                                                                </TableRow>
                                                              ) : (
                                                                subItm.riskAnalysisHazardTypes?.map(
                                                                  (
                                                                    hazardType
                                                                  ) => (
                                                                    <React.Fragment
                                                                      key={
                                                                        hazardType.id
                                                                      }
                                                                    >
                                                                      {hazardType.riskAnalysisHazardSituation?.map(
                                                                        (
                                                                          situation
                                                                        ) => (
                                                                          <React.Fragment
                                                                            key={
                                                                              situation.id
                                                                            }
                                                                          >
                                                                            <TableRow>
                                                                              <TableCell
                                                                                style={{
                                                                                  padding:
                                                                                    "2px 16px",
                                                                                }}
                                                                              >
                                                                                <Typography
                                                                                  variant="body2"
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
                                                                                    width:
                                                                                      "auto",
                                                                                    padding:
                                                                                      "3px",
                                                                                    color:
                                                                                      situation.residualRiskClassificationDisplay ===
                                                                                      "LowRisk"
                                                                                        ? "#000"
                                                                                        : "white",
                                                                                    borderRadius:
                                                                                      "5px",
                                                                                    display:
                                                                                      "inline-block",
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
                                                                                </Typography>
                                                                              </TableCell>
                                                                              <TableCell>
                                                                                <Typography
                                                                                  variant="body2"
                                                                                  style={{
                                                                                    fontSize:
                                                                                      "12px",
                                                                                  }}
                                                                                >
                                                                                  {
                                                                                    situation.humanControlMeasure
                                                                                  }
                                                                                </Typography>
                                                                              </TableCell>
                                                                              <TableCell>
                                                                                <Typography
                                                                                  variant="body2"
                                                                                  style={{
                                                                                    fontSize:
                                                                                      "12px",
                                                                                  }}
                                                                                >
                                                                                  {
                                                                                    situation.technicalControlMeasure
                                                                                  }
                                                                                </Typography>
                                                                              </TableCell>
                                                                              <TableCell>
                                                                                <Typography
                                                                                  variant="body2"
                                                                                  style={{
                                                                                    fontSize:
                                                                                      "12px",
                                                                                  }}
                                                                                >
                                                                                  {
                                                                                    situation.organisationalControlMeasure
                                                                                  }
                                                                                </Typography>
                                                                              </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                              <TableCell
                                                                                style={{
                                                                                  padding:
                                                                                    "2px 16px",
                                                                                }}
                                                                              >
                                                                                <div className=" pt-0 pb-24">
                                                                                  <h6>
                                                                                    {
                                                                                      subItm.subTaskName
                                                                                    }
                                                                                  </h6>
                                                                                  <h6>
                                                                                    -{" "}
                                                                                    {
                                                                                      hazardType.hazardTypeDisplay
                                                                                    }
                                                                                  </h6>
                                                                                  <h6>
                                                                                    -{" "}
                                                                                    {
                                                                                      situation.hazardousSituation
                                                                                    }
                                                                                  </h6>
                                                                                  {currentActivityForm.canEdit && (
                                                                                    <div className="my-5">
                                                                                      <a
                                                                                        title="View Details"
                                                                                        className="inline-flex items-center leading-6 text-primary cursor-pointer hover:underline dark:hover:bg-hover"
                                                                                        onClick={() =>
                                                                                          handelViewDetails(
                                                                                            situation.id,
                                                                                            subItm.id
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                        <span className="inline-flex items-center">
                                                                                          <span
                                                                                            className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-2 bg-gray-200 text-black rounded"
                                                                                            style={{
                                                                                              fontSize:
                                                                                                "12px",
                                                                                            }}
                                                                                          >
                                                                                            View
                                                                                          </span>
                                                                                        </span>
                                                                                      </a>

                                                                                      <a
                                                                                        title="Edit"
                                                                                        className="inline-flex items-center leading-6 text-primary mx-5 cursor-pointer hover:underline dark:hover:bg-hover"
                                                                                        onClick={() =>
                                                                                          handelEditRiskDetails(
                                                                                            situation.id,
                                                                                            subItm.id
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                        <span className="inline-flex items-center">
                                                                                          <span
                                                                                            className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-2 bg-gray-200 text-black rounded"
                                                                                            style={{
                                                                                              fontSize:
                                                                                                "12px",
                                                                                            }}
                                                                                          >
                                                                                            Edit
                                                                                          </span>
                                                                                        </span>
                                                                                      </a>

                                                                                      <a
                                                                                        title="Remove"
                                                                                        className="inline-flex items-center leading-6 text-primary ml-2 cursor-pointer hover:underline dark:hover:bg-hover"
                                                                                        onClick={() =>
                                                                                          handelRemoveDetails(
                                                                                            situation.id,
                                                                                            subItm.id
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                        <span className="inline-flex items-center">
                                                                                          <span
                                                                                            className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-2 bg-gray-200 text-black rounded"
                                                                                            style={{
                                                                                              fontSize:
                                                                                                "12px",
                                                                                            }}
                                                                                          >
                                                                                            Remove
                                                                                          </span>
                                                                                        </span>
                                                                                      </a>
                                                                                    </div>
                                                                                  )}
                                                                                  {currentActivityForm.canEdit && (
                                                                                    <span
                                                                                      className="text-white d-inline-block"
                                                                                      style={{
                                                                                        backgroundColor:
                                                                                          "#2563eb",
                                                                                        borderRadius:
                                                                                          "5px",
                                                                                        padding:
                                                                                          "3px",
                                                                                        fontSize:
                                                                                          "10px",
                                                                                        cursor:
                                                                                          "pointer",
                                                                                      }}
                                                                                      onClick={() =>
                                                                                        handelRisk(
                                                                                          subItm.id,
                                                                                          hazardType.hazardType
                                                                                        )
                                                                                      }
                                                                                    >
                                                                                      Create
                                                                                      New
                                                                                      Risk
                                                                                      Analysis
                                                                                    </span>
                                                                                  )}
                                                                                </div>
                                                                              </TableCell>
                                                                            </TableRow>
                                                                          </React.Fragment>
                                                                        )
                                                                      )}
                                                                    </React.Fragment>
                                                                  )
                                                                )
                                                              )}
                                                            </React.Fragment>
                                                          )
                                                        )
                                                    )}
                                                  </TableBody>
                                                </Table>
                                              </TableContainer>
                                            )}
                                          </div>
                                        </Step>
                                      </Stepper>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                              })}
                            </div>
                          </CustomTabPanel>
                          {!impActivity.isComplete &&
                            impActivity.status === "Pending" &&
                            value == 0 && (
                              <div
                                className="inventory-grid grid items-center gap-4 p-0"
                                style={{ width: "100%" }}
                              >
                                {currentActivityForm.canEdit && (
                                  <Box
                                    sx={{ display: "flex", flexWrap: "wrap" }}
                                  >
                                    <FormControl
                                      fullWidth
                                      sx={{ m: 0, maxWidth: "100%" }}
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
                                        <FormControl fullWidth sx={{ m: 0 }}>
                                          <Autocomplete
                                            id="approverId"
                                            options={docStaff}
                                            getOptionLabel={(option) =>
                                              option.text
                                            }
                                            value={handelApprover.approver}
                                            onChange={handleChangeApprover}
                                            renderInput={(params) => (
                                              <TextField {...params} />
                                            )}
                                          />
                                        </FormControl>
                                      </Box>
                                    </FormControl>
                                  </Box>
                                )}

                                <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                  <div
                                    _ngcontent-fyk-c288=""
                                    class="flex items-center w-full mt-10 border-b justify-between"
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
                                        disabled={!currentActivityForm.canEdit}
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
                                  className="inventory-grid grid items-center gap-4 mt-24"
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
                                        m: 0,
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
                                        <FormControl fullWidth sx={{ m: 0 }}>
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
                                      class="flex items-center w-full mt-10 border-b justify-between"
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
                    )}
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
                                      <Autocomplete
                                        options={particularSub}
                                        getOptionLabel={(option) => option.text}
                                        onChange={(event, newValue) =>
                                          handleSubCategoryChange(
                                            newValue,
                                            "particularSubCategory"
                                          )
                                        }
                                        value={particularSub.find(
                                          (option) =>
                                            option.value ===
                                            taskAdd.particularSubCategory
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                          />
                                        )}
                                        name="particularSubCategory"
                                      />
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
                                    {taskAdd.particular != 78 ? (
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
                                          helperText={
                                            errorsAddTask.impacHazards
                                          }
                                        />
                                      </Box>
                                    ) : (
                                      <FormControl
                                        fullWidth
                                        error={
                                          !!errorsAddTask.changeImpactHazard
                                        }
                                      >
                                        <FormLabel
                                          className="font-medium text-14"
                                          component="legend"
                                        >
                                          Impact Hazard*
                                        </FormLabel>
                                        {console.log(hazardImp, "hazzzz")}
                                        <Autocomplete
                                          options={hazardImp}
                                          getOptionLabel={(option) =>
                                            option.text
                                          }
                                          onChange={(event, newValue) =>
                                            handleSubCategoryChange(
                                              newValue,
                                              "changeImpactHazard"
                                            )
                                          }
                                          value={hazardImp.find(
                                            (option) =>
                                              option.value ===
                                              taskAdd.changeImpactHazard
                                          )}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                            />
                                          )}
                                          name="changeImpactHazard"
                                        />
                                        {!!errorsAddTask.changeImpactHazard && (
                                          <FormHelperText>
                                            {errorsAddTask.changeImpactHazard}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    )}
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
                                      error={!!errorsAddTask.assignedStaffId}
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
                                        value={taskAdd.assignedStaffId}
                                        name="assignedStaffId"
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
                                      {!!errorsAddTask.assignedStaffId && (
                                        <FormHelperText>
                                          {errorsAddTask.assignedStaffId}
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
                    <Paper className="w-full box_reset">
                      <div
                        _ngcontent-fyk-c288=""
                        class="p-30 pt-24 pb-24  mb-0 ng-star-inserted"
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
                        <div className="flex justify-end p-30 pt-24 pb-24">
                          {closeActions.map((btn) => (
                            <Button
                              className="whitespace-nowrap"
                              variant="contained"
                              color="secondary"
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
                        {contentDetails?.consultaion?.map((itm) => (
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
                                  {itm.staff}
                                </span>
                                <span className="text-sm text-secondary leading-none pt-5">
                                  Consulted on {formatDate(itm?.consultedDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
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
                                            className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                                            onClick={() =>
                                              handelreview(imptsk.id)
                                            }
                                            style={{
                                              backgroundColor:
                                                reviewed[imptsk.id] &&
                                                "#7FFFD4",
                                            }}
                                          >
                                            {reviewed[imptsk.id] ? (
                                              <span className="mat-button-wrapper">
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
                                        <div className="flex items-center mt-10 pb-24">
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
                                            <div
                                              className="mat-form-field-infix"
                                              style={{
                                                position: "relative",
                                                width: "100%",
                                              }}
                                            >
                                              <textarea
                                                rows="2"
                                                className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                placeholder="Write a comment..."
                                                id="ImpTaskReview265"
                                                data-placeholder="Write a comment..."
                                                aria-invalid="false"
                                                aria-required="false"
                                                style={{
                                                  height: "40px",
                                                  width: "100%",
                                                  paddingRight: "100px",
                                                }}
                                                onChange={(e) =>
                                                  setHandelCommentRemark(
                                                    e.target.value
                                                  )
                                                }
                                              ></textarea>
                                              <button
                                                className="custom-update-button"
                                                style={{ float: "right" }}
                                                onClick={() =>
                                                  handelCommentImp(imptsk.id, 1)
                                                }
                                              >
                                                Save
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
                                              style={{
                                                display: "flex",
                                                justifyContent:
                                                  currentActivityForm.canEdit
                                                    ? "space-between"
                                                    : "flex-start",
                                              }}
                                            >
                                              {currentActivityForm.canEdit && (
                                                <button
                                                  className="custom-add-review-button"
                                                  style={{ marginRight: 16 }}
                                                >
                                                  Add Review
                                                </button>
                                              )}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  flexGrow: 1, // This makes the div take up remaining space
                                                  justifyContent:
                                                    currentActivityForm.canEdit
                                                      ? "flex-end"
                                                      : "flex-start",
                                                }}
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
                                                  {hasAddedComment(
                                                    imptsk?.implementationReviews
                                                  ) && (
                                                    <span className="text-green"></span>
                                                  )}
                                                </Typography>
                                              </div>
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
                                                  <div
                                                    className="mat-form-field-infix"
                                                    style={{
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <textarea
                                                      rows="2"
                                                      className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                      placeholder="Write a comment..."
                                                      id="ImpTaskReview265"
                                                      data-placeholder="Write a comment..."
                                                      aria-invalid="false"
                                                      aria-required="false"
                                                      style={{ height: "36px" }}
                                                      defaultValue={
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
                                                      className="custom-update-button"
                                                      style={{ float: "right" }}
                                                      onClick={() =>
                                                        handelCommentImp(
                                                          imptsk.id,
                                                          2
                                                        )
                                                      }
                                                    >
                                                      Update
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
                          <span className="leading-none">
                            <b>Approver Comment:</b> {ApprovalManager?.remark}
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

                      {step.code == "MOC_COMPLETED" ? (
                        <>
                          <StepContent style={{ fontSize: "10px" }}>
                            Ended at{" "}
                            <b>
                              {new Date(step.actualEndDate).toLocaleString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                  hour12: true,
                                }
                              )}
                            </b>
                          </StepContent>
                        </>
                      ) : (
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
                            Started at{" "}
                            <b>
                              {new Date(step.actualStartDate).toLocaleString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                  hour12: true,
                                }
                              )}
                            </b>
                          </StepContent>
                          <StepContent style={{ fontSize: "10px" }}>
                            {step.actualEndDate === null ? (
                              ""
                            ) : (
                              <>
                                {step.status} at{" "}
                                <b>
                                  {new Date(step.actualEndDate).toLocaleString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </b>
                              </>
                            )}
                          </StepContent>
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
}

export default Course;
