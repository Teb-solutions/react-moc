import React, { useEffect, useRef, useState, useCallback } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";

import { withStyles } from "@mui/styles";
import AuditModal from "../../common_modal/audit_modals/AddAudit";
import AuditListModal from "../../common_modal/audit_modals/AuditList";
import RiskAnalysis from "../../common_components/RiskAnalysis";
import RiskAnalysisTableView from "../../common_components/RiskAnalysisTableView";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
import DocumentModal from "../../common_modal/documentModal";
import {
  CalculateFrequencyScoring,
  CalculatePotentialRisk,
  CalculateRiskClassification,
} from "../../common_components/RiskAnalysisCalculate";

function createData(
  index,

  Task,
  Audit,
  date,
  staff
) {
  return { index, Task, Audit, date, staff };
}

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

const Implementation = ({
  currentActivityForm,
  evaluationId,
  setIsLoading,
  getRecords,
  listDocument1,
  setListDocument,
  setListDocument1,
  listDocument,
  taskLists,
  impActivity,
  riskLists,
  impActions,
  docStaffs,
}) => {
  const [errors, setErrors] = useState({});
  const [errorMessageTask, setErrorMessageTask] = useState("");
  const [expanded2, setExpanded2] = useState(false);
  const [potentialFrequencyRiskDetails, setPotentialFrequencyRiskDetails] =
    useState([]);
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
  const [docStaff, setDocStaff] = useState([]);

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
    setSelectedFile({
      ...selectedFile,
      name: "",
      description: "",
    });
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const listDocu = () => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
      )
      .then((response) => {
        setListDocument1(response?.data?.data);
      });
  };
  useEffect(() => {
    listDocu();
  }, []);

  const HandleTraining = () => {
    setSelectedFile({
      ...selectedFile,
      descritpion: "",
    });
    listDocu();
    setOpenMoc(true);
  };

  const handelFileChange = (e) => {
    const file = e.target.files[0];
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: "",
    }));
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,
      descritpion: "",
      type: fileType,
      document: e.target.files[0],
      documentType: "DocImplTrSheet",
      documentId: evaluationId,
      changeRequestToken: evaluationId,
    });
  };

  const validateFormAsset = () => {
    let tempErrorsDoc = {};
    if (!selectedFile.name)
      tempErrorsDoc.name = "File is required";

    if (!selectedFile.descritpion)
      tempErrorsDoc.descritpion = "Description is required";

    setErrors(tempErrorsDoc);
    return Object.keys(tempErrorsDoc).length === 0;
  };

  const handleSubmitAsset = (e) => {
    // Validation: If file-related fields are empty

    if (!validateFormAsset()) {
      return;
    }

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
              setListDocument1(response?.data?.data);
              setOpenDrawer(false);
              setSelectedFile({
                ...selectedFile,
                name: "",
                descritpion: "",
              });
            });
        } else {
          toast.error(response.data.message);
          handleModalClose();
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

  const [particular, setParticular] = useState([]);
  const [auditSelectData, setAuditSelectData] = useState([]);
  const [particularSub, setParticularSub] = useState([]);
  const [impComments, setImpComments] = useState([]);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [fileName, setFileName] = useState("");
  const [documentCounts, setDocumentCounts] = useState({});
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [value, setValue] = useState(0);

  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "6px",
      right: "3px",
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
  const [currentAudit, setCurrentAudit] = useState([]);
  const [openAudit, setOpenAudit] = useState(false);
  const [openMoc, setOpenMoc] = useState(false);

  const [handelApprover, setHandelApprover] = useState({
    approver: null, // Store the entire selected object
  });

  const [openAuditComment, setOpenAuditComment] = useState(false);

  const [auditData, setAuditData] = useState({
    comments: "",
    isActive: true,
    auditsid: "",
  });
  const handelOpenAuditComment = (auditsid) => {
    setOpenAuditComment(true);
    setAuditData((prevState) => ({
      ...prevState,
      auditsid: auditsid,
      comments: "",
    }));
  };

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
        `/ChangeImplementation/Audit/?requestToken=${evaluationId}&&taskId=${auditData.auditsid}`,
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

  const handelOpenAuditList = async () => {
    apiAuth
      .get(`ChangeImplementation/AuditList/${evaluationId}`)
      .then(async (resp) => {
        const transformedData = await resp.data.data.map((item, index) =>
          createData(
            index + 1,
            item.task,
            item.comments,
            formatDate(item.donebydate),
            item.auditDoneBy
          )
        );
        setCurrentAudit(transformedData);
      });
    setOpenAudit(true);
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
    apiAuth.get(`ChangeImplementation/Lov?id=${evaluationId}`).then((resp) => {
      setAuditSelectData(resp.data.data);
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

    if (name === "audit") {
      // Check if the input source is a Select or a TextField
      if (typeof value === "string") {
        // It's coming from the TextField, store the string
        setTaskAdd((prevState) => ({
          ...prevState,
          audit: value,
        }));
      } else {
        // It's coming from the Select, store the object
        const selectedOption = auditSelectData.find(
          (option) => option.value === value
        );
        setTaskAdd((prevState) => ({
          ...prevState,
          audit: selectedOption
            ? {
              text: selectedOption.text,
              value: selectedOption.value,
              isReadOnly: selectedOption.isReadOnly,
            }
            : "",
        }));
      }
    } else {
      // Handle other inputs as usual
      setTaskAdd((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // Additional logic for particular field
      if (name === "particular") {
        apiAuth.get(`/LookupData/Lov/17/${value}`).then((resp) => {
          setParticularSub(resp.data.data);
        });
      }
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
    // if (!taskAdd.audit) tempErrors.audit = "Audit Field is required";

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
          setOpenImplemntationTask(false);
          setTimeout(() => {
            getRecords();
          }, 2000);

          setTaskAdd({
            ...taskAdd,
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
        })
        .catch((err) => {
          setIsLoading(false);
        });
      // getRecords();
    }
  };

  const handelTaskSubmitCancel = () => {
    handleCloseImplemntationTask();
    setErrorsAddTask({});

    setTaskAdd({
      ...taskAdd,
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
  };

  const handleChangeTaskDate = (date) => {
    setTaskAdd((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const [CreateNewRisk, setCreateNewRisk] = useState(false);
  const styleDoc = {
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
    p: 2,
  };

  const [viewrisk, setViewRisk] = useState(false);
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

  const SubmitImpCreate = (e, uid) => {
    let taskListApproved = taskLists?.filter((x) => x.taskStatus == 3);

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
                  toast?.success("Submitted Successfully");
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
      setErrorMessageTask("Comments are required.");
      return;
    }
    setErrorMessageTask("");
    setIsButtonDisabled(true);
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

        setIsButtonDisabled(false);
      })
      .catch((error) => {
        setOpen(false);
        setIsLoading(false);

        console.error(error);
      });
  };

  const handelRejectImpl = (e, task) => {
    if (comments.trim() === "") {
      setErrorMessageTask("Comments are required.");
      return;
    }
    setErrorMessageTask("");
    setIsButtonDisabled(true);
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

        setIsButtonDisabled(false);
      })
      .catch((error) => {
        setOpen(false);
        console.error(error);
      });
  };

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
    setFileName(doc.name);
  };

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
      setPotentialFrequencyRiskDetails(resp.data.data);
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
        CalculateRiskClassification(data?.residualRisk);

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
        ? CalculateFrequencyScoring(selectedOption.text)
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
      const potentialRisk = CalculatePotentialRisk(
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
          CalculateRiskClassification(data?.residualRisk);

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
        setPotentialFrequencyRiskDetails(resp.data.data);
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
      const selectedOption = potentialFrequencyRiskDetails.find(
        (option) => option.value === value
      );
      const frequencyScoring = selectedOption
        ? CalculateFrequencyScoring(selectedOption.text)
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
      const residualRisk = CalculatePotentialRisk(
        formValues.residualFrequencyScoring,
        likelihoodScoring,
        severityScoring
      );
      const { classification, classificationValue } =
        CalculateRiskClassification(residualRisk);

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
          `/DocumentManager/DocList/${docId}/DocImplTrSheet?changeRequestToken=${selectedDocument?.changeRequestToken}`
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

  const handleAccordionChange2 = (panel) => (event, isExpanded) => {
    event.preventDefault();
    setExpanded2(isExpanded ? panel : false);
  };

  return (
    <>
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
      []
      <DocumentModal
        open={openMoc}
        handleModalClose={handleModalClose}
        selectedDocument={selectedDocument}
        listDocument={listDocument1}
        selectedFile={selectedFile}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        toggleDrawer={toggleDrawer}
        errors={errors}
        setErrors={setErrors}
        handelDetailDoc={handelDetailDoc}
        handelFileDiscriptionChange={handelFileDiscriptionChange}
        handelFileChange={handelFileChange}
        handleSubmitDocument={handleSubmitAsset}
        handleDelete={handleDelete}
        canExecute={currentActivityForm.canExecute}
        formatDate={formatDate}
        documenDowToken={documenDowToken}
      />
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
      {CreateNewRisk ? (
        <RiskAnalysis
          goBack={goBack}
          viewrisk={viewrisk}
          subTaskDetail={subTaskDetail}
          handleChangeImpact={handleChangeImpact}
          TaskhazardRiskView={TaskhazardRiskView}
          TaskhazardRiskApi={TaskhazardRiskApi}
          TaskhazardRiskViewName={TaskhazardRiskViewName}
          generalGuidePdf={generalGuidePdf}
          setGeneralGuidePdf={setGeneralGuidePdf}
          formValues={formValues}
          hazaid={hazaid}
          subTaskhazardDetail={subTaskhazardDetail}
          handleInputChangeHazard={handleInputChangeHazard}
          errorsSub={errorsSub}
          handelRiskInputChange={handelRiskInputChange}
          potentialTimeDetails={potentialTimeDetails}
          potentialFrequencyDetails={potentialFrequencyDetails}
          potentialFrequencyRiskDetails={potentialFrequencyRiskDetails}
          likelihoodValues={likelihoodValues}
          handelResidualRiskInputChange={handelResidualRiskInputChange}
          Classifications={Classifications}
          setCreateNewRisk={setCreateNewRisk}
          editRiskAnalysDetail={editRiskAnalysDetail}
          handelRiskSubmit={handelRiskSubmit}
        />
      ) : (
        <Paper
          className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden"
          style={{ marginRight: "0", width: "100%" }}
        >
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
          >
            <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
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
                  <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                }
                onClick={HandleTraining}
              >
                Training Attendence Sheet
              </Button>
            </StyledBadge>
            <DocumentModal
              step={1}
              open={open}
              toggleDrawer={toggleDrawer}
              handleModalClose={handleClose}
              listDocument={listDocument}
              selectedDocument={selectedDocument}
              fileDetails={fileDetails}
              setFileDetails={setFileDetails}
              handelDetailDoc={handelDetailDoc}
              formatDate={formatDate}
              documenDowToken={documenDowToken}
            />
          </div>

          <Box sx={{ width: "100%" }} className="p-30 pt-24 pb-24">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Task" {...a11yProps(0)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0} className="task_accordians">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handelOpenAuditList();
                      }}
                    >
                      Audits Lists
                    </Button>
                  </div>

                  <TextField
                    variant="filled"
                    fullWidth
                    placeholder="Search"
                    style={{
                      // marginBottom: "15px",
                      backgroundColor: "white",
                    }}
                    // value={searchTerm}
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
                    (risk) => risk.changeImapactId === task.changeImapactId
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
                        onClick={(e) => handelComments(e, task.id)}
                      >
                        <div className="d-flex flex-wrap justify-between w-100">
                          <div className="inventory-grid grid items-center gap-4 m-0">
                            <div className="flex items-center">
                              Task #{task.id}
                            </div>
                          </div>

                          <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                            <div className="flex items-center">
                              {task.isCompleted && task.taskStatus === 3 ? (
                                <span className="text-green">Approved</span>
                              ) : task.isCompleted && task.taskStatus !== 3 ? (
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
                                    matchingRisks.length > 0 ? "brown" : "",
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
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                          // style={{ width: "17%" }}
                          >
                            <div className="flex items-center">
                              <StyledBadge badgeContent={task?.audits?.length}>
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
                                    handelOpenAudit(task.audits, "");
                                  }}
                                >
                                  Audits
                                </Button>
                              </StyledBadge>
                              {currentActivityForm?.canExecute && (
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
                                    handelOpenAuditComment(task.id);
                                  }}
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
                                  <p>What is the task : {task?.actionWhat}</p>
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
                                  <p>How is Task done : {task?.actionHow}</p>
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
                                    {new Date(task.dueDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
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
                                  <b>{task?.assignedByStaff}</b> has assigned
                                  task to <b>{task?.assignedStaff}</b> on{" "}
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
                                      {documentCounts[msg.id] ? (
                                        documentCounts[msg.id] != 0 && (
                                          <StyledBadge
                                            badgeContent={
                                              documentCounts[msg.id]
                                            }
                                          >
                                            <button
                                              className="icon-button"
                                              onClick={() => handleOpen(msg.id)}
                                              style={{
                                                top: "2px",
                                                right: "1px",
                                              }}
                                            >
                                              <FuseSvgIcon size={20}>
                                                heroicons-solid:document
                                              </FuseSvgIcon>
                                            </button>
                                          </StyledBadge>
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
                                              {msg.taskStatus == 3
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
                              {task.isCompleted && task.taskStatus !== 3 && (
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
                                            onChange={(e) => {
                                              setComments(e.target.value);
                                              if (
                                                e.target.value.trim() !== ""
                                              ) {
                                                setErrorMessageTask(""); // Clear error message on input change
                                              }
                                            }}
                                            label="Reason For Change*"
                                            className="mt-5"
                                          />
                                          {errorMessageTask && (
                                            <div className="text-red-500 text-sm mt-1">
                                              {errorMessageTask}
                                            </div>
                                          )}
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
                                          backgroundColor: "white",
                                          color: "black",
                                        }}
                                        onClick={(e) =>
                                          handelRejectImpl(e, task)
                                        }
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
                                          handelApproveImpl(e, task)
                                        }
                                        disabled={isButtonDisabled}
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {matchingRisks.length != 0 && (
                                <RiskAnalysisTableView
                                  Paper={Paper}
                                  matchingRisks={matchingRisks}
                                  currentActivityForm={currentActivityForm}
                                  handelRisk={handelRisk}
                                  handelViewDetails={handelViewDetails}
                                  handelEditRiskDetails={handelEditRiskDetails}
                                  handelRemoveDetails={handelRemoveDetails}
                                  showEditRemove={true}
                                />
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
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <FormControl fullWidth sx={{ m: 0, maxWidth: "100%" }}>
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
                              options={docStaffs}
                              getOptionLabel={(option) => option.text}
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
                          onClick={(e) => SubmitImpCreate(e, btn.uid)}
                        >
                          {btn.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                            <MenuItem key={option.id} value={option.value}>
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
                        error={!!errorsAddTask.particularSubCategory}
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
                              option.value === taskAdd.particularSubCategory
                          )}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
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
                            helperText={errorsAddTask.impacHazards}
                          />
                        </Box>
                      ) : (
                        <FormControl
                          fullWidth
                          error={!!errorsAddTask.changeImpactHazard}
                        >
                          <FormLabel
                            className="font-medium text-14"
                            component="legend"
                          >
                            Impact Hazard*
                          </FormLabel>

                          <Autocomplete
                            options={hazardImp}
                            getOptionLabel={(option) => option.text}
                            onChange={(event, newValue) =>
                              handleSubCategoryChange(
                                newValue,
                                "changeImpactHazard"
                              )
                            }
                            value={hazardImp.find(
                              (option) =>
                                option.value === taskAdd.changeImpactHazard
                            )}
                            renderInput={(params) => (
                              <TextField {...params} variant="outlined" />
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
                            <MenuItem key={option.id} value={option.value}>
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

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                              minDate={new Date()} // Prevents selection of past dates
                              onChange={(date) => handleChangeTaskDate(date)}
                              renderInput={(params) => (
                                <TextField fullWidth {...params} />
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
                        { }
                        {auditSelectData?.length ? (
                          <FormControl fullWidth error={!!errorsAddTask.audit}>
                            <FormLabel
                              className="font-medium text-14"
                              component="legend"
                            >
                              Audit Comment
                            </FormLabel>
                            <Select
                              variant="outlined"
                              onChange={handleChangeAddTask}
                              value={taskAdd.audit.value}
                              name="audit"
                            >
                              {auditSelectData.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                            {!!errorsAddTask.audit && (
                              <FormHelperText>
                                {errorsAddTask.audit}
                              </FormHelperText>
                            )}
                          </FormControl>
                        ) : (
                          <TextField
                            fullWidth
                            label="Audit Comment"
                            id="fullWidth"
                            name="audit"
                            onChange={handleChangeAddTask}
                            value={taskAdd.audit}
                          // error={!!errorsAddTask.audit}
                          // helperText={errorsAddTask.audit}
                          />
                        )}
                      </Box>
                    </div>
                  </div>{" "}
                  <h6>
                    If this task is based on Audit comments, please select the
                    Audit comment
                  </h6>
                </div>
                <div className="flex justify-end ">
                  <Button
                    className="whitespace-nowrap ms-5 "
                    variant="contained"
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={handelTaskSubmitCancel}
                  >
                    Cancel
                  </Button>
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
  );
};

export default Implementation;
