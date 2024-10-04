import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Step,
  Stepper,
  FormHelperText,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiAuth } from "src/utils/http";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../componentStyle.css";
import FuseLoading from "@fuse/core/FuseLoading";
import Initiation from "../../common_components/Initiation";
import RiskAnalysisTableView from "../../common_components/RiskAnalysisTableView";
import RiskAnalysis from "../../common_components/RiskAnalysis";
import ConfirmationModal from "../../common_modal/confirmation_modal/ConfirmationModal";
import SessionModal from "./SessionModal";
import SessionListModal from "./SessionListModal";
import CountdownTimer from "./CountdownTimer ";
import { CalculateFrequencyScoring, CalculatePotentialRisk, CalculateRiskClassification } from "../../common_components/RiskAnalysisCalculate";
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
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function EvaluationChange({
  AppActions,
  AppActivity,
  TeamAssignmentList,
  assetEvaluationId,
  setContent,
  currentActivityForm,
  contentDetails,
  contentDetailsT,
}) {
  const [open, setOpen] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [Session, setSession] = useState({});
  const [SessionList, setSessionList] = useState([]);
  const [sessionTime, setSessionTime] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [docStaff, setDocStaff] = useState([]);
  const [list, setIsList] = useState([]);
  const [impactList, setImpactList] = useState([]);
  const [errorsAdd, setErrorsAdd] = useState({});
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [errorsTask, setErrorsTask] = useState({});
  const [errorsSub, setErrorsSub] = useState({});
  const [errorsImpact, setErrorsImpact] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [remark, setRemark] = useState("");
  const [sessionTaskList, setSessionTaskList] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const handleChangeTask = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTasks(typeof value === "string" ? value.split(",") : value);
    setTaskError("");
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
    setRemarkError("");
  };

  const [value, setValue] = useState(0);

  const [timer, setTimer] = useState(null);
  const handleClose = () => setOpen(false);
  const handleCloseSession = () => setOpenSession(false);

  const handleOpen = () => {
    setOpen(true);
    apiAuth
      .get(`/ChangeEvaluationSession/List/${assetEvaluationId}`)
      .then((resp) => {
        const sessionList = resp.data?.data;
        const activeSessions = sessionList.filter(
          (session) => session.isActive
        );

        setSessionList(activeSessions);
        if (activeSessions[0]?.timeoutMin) {
          localStorage.setItem("timeoutMin", activeSessions[0].timeoutMin);
        }
        setSessionTime(activeSessions[0].timeoutMin);
      });
  };

  const handleOpenSession = () => {
    apiAuth
      .get(`/ChangeEvaluationSession/List/${assetEvaluationId}`)
      .then((resp) => {
        setSessionList(resp.data?.data);
      });

    setOpenSession(true);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
    if (newValue == 1) {
      setAddConsultation(false);
    } else {
      setAddConsultation(false);
      setEditConsultation(false);

      setForms([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getRecords = () => {
    apiAuth
      .get(
        `/ChangeEvaluation/Get/${assetEvaluationId}/${currentActivityForm.formUID ? currentActivityForm.formUID : null}/${currentActivityForm.version}`
      )
      .then((resp) => {
        setSession(resp.data?.data);
        const sessionList = resp.data?.data?.activeSession?.timeoutMin;
        const sessionListId = resp.data?.data?.id;
        if (resp.data.data.activeSession != null) {
          if (resp?.data?.data?.activeSession?.status == 2) {
            localStorage.setItem("isActiveSession", true);
          } else {
            localStorage.setItem("isActiveSession", false);
          }
        } else {
          localStorage.setItem("isActiveSession", false);
        }
        if (resp?.data?.data?.activeSession?.timeoutMin) {
          localStorage.setItem(
            "timeoutMin",
            resp.data?.data?.activeSession?.timeoutMin
          );
        }
        setSessionTime(sessionList);
        apiAuth
          .get(
            `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${sessionListId}`
          )
          .then((resp) => {
            setIsList(resp.data.data);
          });
        apiAuth
          .get(`/ChangeImpact/ImpactTask?id=${sessionListId}`)
          .then((resp) => {
            setSessionTaskList(resp.data?.data);
          });
        apiAuth.get(`/ChangeImpact/Get?id=${sessionListId}`).then((resp) => {
          setImpactList(resp.data?.data);
        });
      });
    apiAuth.get(`/Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
  };
  useEffect(() => {
    getRecords();
  }, [currentActivityForm]);

  const groupByRoleName = (teamAssignmentList) => {
    return teamAssignmentList.reduce((acc, item) => {
      if (!acc[item.roleName]) {
        acc[item.roleName] = [];
      }
      acc[item.roleName].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByRoleName(TeamAssignmentList);
  useEffect(() => {
    const defaultSelections = TeamAssignmentList.filter(
      (item) => item.roleName === "Change Leader" || item.roleName === "Hseq"
    ).map((item) => ({
      teamType: item.teamType,
      staffId: item.staffId,
      staffName: item.staffName,
    }));
    setSelectedItems(defaultSelections);
  }, [TeamAssignmentList]);

  const handleCheckboxChange = (teamType, staffId, staffName) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (item) => item.teamType === teamType && item.staffId === staffId
      );
      if (isSelected) {
        return prevSelectedItems.filter(
          (item) => !(item.teamType === teamType && item.staffId === staffId)
        );
      } else {
        return [...prevSelectedItems, { teamType, staffId, staffName }];
      }
    });
  };
  const timerRef = useRef();

  const handelCreateSession = () => {
    if (selectedItems.length < 3) {
      setOpen(false);
      toast?.error("Please select at least 3 members to start the session.");
      return; // Exit the function if validation fails
    }
    setIsLoading(true);
    apiAuth
      .post(
        `/ChangeEvaluationSession/Create/${Session.id}/${assetEvaluationId}`,
        { TeamList: selectedItems }
      )
      .then((resp) => {
        toast?.success("Evaluation session has been successfully created.");
        setIsLoading(false);

        getRecords();
        setOpen(false);
        setTimeout(() => localStorage.setItem("isActiveSession", false), 1000);

        if (Session.hasActiveSession == true) {
          if (timerRef.current) {
            timerRef.current.startTimer();
            // Start the timer when the API call is successful
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);

        console.error("Error creating session:", error);
      });
  };

  const [forms, setForms] = useState([]);

  const [AddCunsultation, setAddConsultation] = useState(false);
  const [AddImpact, setAddCImpact] = useState(false);

  const [editConsultation, setEditConsultation] = useState(false);
  const [editStaffName, setEditStaffName] = useState("");
  const [editStaffDate, setEditStaffDate] = useState("");
  const [editStaffId, setEditStaffId] = useState();
  const [editId, setEditId] = useState();
  const [particularList, setParticularList] = useState([]);
  const [particularSubList, setParticularSubList] = useState([]);
  const [hazardList, setHazardList] = useState([]);
  const [editRiskAnalysDetail, setEditRiskAnalysDetail] = useState([]);

  const [impactForm, setImpactForm] = useState({
    particular: "",
    particularSubCategory: "",
    hazardDetail: "",
    changeImpactTasks: [],
    changeImpactHazardList: [],
  });

  const validateAdd = () => {
    let tempErrors = {};
    forms.forEach((form) => {
      if (!form.consultedDate)
        tempErrors[form.id] = {
          ...tempErrors[form.id],
          consultedDate: "Consulted Date is required",
        };
      if (!form.consultedStaffId)
        tempErrors[form.id] = {
          ...tempErrors[form.id],
          consultedStaffId: "Staff is required",
        };
    });

    setErrorsAdd(tempErrors);
    return Object.keys(tempErrors).length === 0;
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

  const handleAddForm = () => {
    const newForm = {
      id: Date.now(), // Unique ID for each form
      consultedDate: null,
      consultedStaffId: "",
    };

    // Append the new form to the existing forms
    setForms((prevForms) => [...prevForms, newForm]);
  };

  const handleRemoveForm = (id) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    if (forms.length <= 1) {
      setAddConsultation(false);
    }
  };

  const handleAddConsultation = () => {
    if (validateAdd()) {
      setEditConsultation(false);
      handleAddForm();
      setAddConsultation(true);
    }
  };
  const handleAddImpact = () => {
    setImpactForm({
      particular: "",
      particularSubCategory: "",
      hazardDetail: "",
    });
    setHazardDetailsForm([]);
    handlebackImpactList();
    setAddTakForms([]);
    setEditSubTask([]);
    setAddCImpact(true);
    setEditCImpact(false);
  };

  const handlebackList = () => {
    setAddConsultation(false);
    setEditConsultation(false);

    setForms([]);
  };

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

    if (errorsAddTask[name]) {
      setErrorsAddTask((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlebackImpactList = () => {
    setAddCImpact(false);
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticularList(resp?.data.data);
    });
  };

  const handleInputChange = (id, name, value) => {
    const newForms = forms.map((form) =>
      form.id === id ? { ...form, [name]: value } : form
    );
    setForms(newForms);
    if (errorsAdd[id]?.[name]) {
      setErrorsAdd((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id][name];
        if (Object.keys(newErrors[id]).length === 0) {
          delete newErrors[id];
        }
        return newErrors;
      });
    }
  };
  const formatDates = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = () => {
    if (validateAdd()) {
      setForms([]);
      setIsLoading(true);
      const payload = forms.map((form) => ({
        id: 0,
        changeRequestId: 0,
        changeEvaluationId: 0,
        consultedDate: form.consultedDate
          ? formatDates(form.consultedDate)
          : null,
        consultedStaffDesignationId: "",
        consultedStaffId: form.consultedStaffId,
        taskReviewId: "",
        comments: "",
        isActive: true,
        isEditable: true,
      }));

      apiAuth
        .post(
          `/ChangeEvaluationConsultation/Create/${Session.id}/${assetEvaluationId}`,
          payload
        )
        .then((resp) => {
          setIsLoading(false);

          setAddConsultation(false);
          getRecords();
        })
        .catch((error) => {
          setIsLoading(false);

          console.error("Error submitting the form:", error);
        });
    }
  };
  const handelImpactSubmit = () => {
    if (!validateAddTask() || !validateTasks()) {
      // If there are validation errors, do not proceed with the submit
      return;
    }
    setIsLoading(true);
    const payload = [
      {
        changeImapactId:
          impactForm.changeImapactId != undefined
            ? impactForm.changeImapactId
            : 0,
        changeRequestId:
          impactForm.changeRequestId != undefined
            ? impactForm.changeRequestId
            : 0,
        changeEvaluationId:
          impactForm.changeEvaluationId != undefined
            ? impactForm.changeEvaluationId
            : 0,
        particular: impactForm.particular,
        particularSubCategory: impactForm.particularSubCategory,
        principle: "1",
        hazardDetail: impactForm.hazardDetail,
        otherDetail: "",
        changeImpactHazardList: hazardDetailsForm.map((detail) => ({
          id: detail.id,
          changeImpactHazard: detail.changeImpactHazard,
        })),
        documentStatus: "Pending",
        isShowDetail: true,
        changeImpactTasks: impactForm?.changeImpactTasks?.length
          ? impactForm.changeImpactTasks.map((task) => ({
            id: task.id,
            changeRequestId: task.changeRequestId,
            changeEvaluationId: task.changeEvaluationId,
            changeImapactId: task.changeImapactId,
            actionWhat: task.actionWhat,
            actionHow: task.actionHow,
            actionComments: "",
            deadline: task.deadline, // Replace with actual value if necessary
            assignedStaffId: task.assignedStaffId,
            taskReviewId: "",
            dueDate: formatDates(task.dueDate),
            isCompleted: false,
            completedAt: "",
            isActive: true,
            isEditable: true,
          }))
          : [],
      },
    ];

    apiAuth
      .put(`ChangeImpact/Create/${Session.id}/${assetEvaluationId}`, payload)
      .then((resp) => {
        if (resp.data.statusCode == 200) {
          setIsLoading(false);

          setHazardDetailsForm([]);
          setAddCImpact(false);
          apiAuth.get(`/ChangeImpact/Get?id=${Session.id}`).then((resp) => {
            setImpactList(resp.data?.data);
          });
        } else {
          toast.error(resp.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const [EditComments, setEditComments] = useState("");
  const handelEditConsultation = (staff, date, stffid, id, comments) => {
    setRemarkError("");
    setTaskError("");
    setAddConsultation(true);

    setEditConsultation(true);
    setEditComments(comments);

    setEditStaffName(staff);
    setEditStaffDate(new Date(date));
    setEditStaffId(stffid);
    setEditId(id);
  };

  const handleSave = () => {
    let hasError = false;
    setTaskError("");
    setRemarkError("");

    if (selectedTasks.length === 0) {
      setTaskError("Please select at least one task.");
      hasError = true;
    }

    if (remark.trim() === "") {
      setRemarkError("Remarks cannot be empty.");
      hasError = true;
    }

    if (hasError) {
      return; // Prevent the API call if there are validation errors
    }
    setIsLoading(true);
    const apiData = {
      consultedDate: editStaffDate,
      consultedStaffDesignationId: 0,
      consultedStaffId: editStaffId,
      comments: EditComments,
      impactTaskIds: selectedTasks,
      remark: remark,
    };
    apiAuth
      .put(`/ChangeEvaluationConsultation/UpdateList?id=${editId}`, apiData)
      .then((resp) => {
        setIsLoading(false);

        setEditConsultation(false);
        setAddConsultation(false);
        getRecords();
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // Send apiData to the API endpoint using fetch or any other method
  };
  const [addNewTask, setAddNewTask] = useState(false);
  const [AddTaskforms, setAddTakForms] = useState([]);
  const [EditImpact, setEditCImpact] = useState(false);
  const [EditSubTask, setEditSubTask] = useState([]);
  const [openSubmit, setOpenSubmit] = useState(false);

  const handleCloseSubmit = () => setOpenSubmit(false);

  const handelEditImpactTask = (
    hazard,
    impactTaaks,
    particular,
    particularSubCategory,
    impid,
    reqid,
    evalid
  ) => {
    handlebackImpactList();
    setAddCImpact(true);
    setHazardDetails(false);
    setImpactForm({
      particular: particular,
      particularSubCategory: particularSubCategory,
      hazardDetail: hazard,
      changeImapactId: impid,
      changeRequestId: reqid,
      changeEvaluationId: evalid,
    });
    setAddTakForms(impactTaaks || []);
    setAddNewTask(true);
    setEditCImpact(true);
    apiAuth.get(`/LookupData/Lov/17/${particular}`).then((resp) => {
      setParticularSubList(resp?.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {
      setMocPhase(resp.data.data);
    });

    apiAuth.get(`/LookupData/Lov/18/${particularSubCategory}`).then((resp) => {
      setHazardList(resp?.data.data);
    });
    apiAuth
      .get(`/RiskAnalysis/hazardList?id=${impid}`)
      .then((resp) => {
        setEditSubTask(resp.data.data);
      })
      .catch((error) => {
        console.error("Error creating session:", error);
      });
  };

  const handleTaskInputChange = (index, event) => {
    const { name, value } = event.target;

    const newTasks = [...AddTaskforms];
    newTasks[index][name] = value;
    setAddTakForms(newTasks);

    // Clear the error for this specific field if it exists
    const errorKey = `${name}_${index}`;
    if (errorsTask[errorKey]) {
      setErrorsTask((prevErrors) => ({
        ...prevErrors,
        [errorKey]: "",
      }));
    }

    // Update impactForm
    const updatedImpactForm = { ...impactForm, changeImpactTasks: newTasks };
    setImpactForm(updatedImpactForm);
  };

  const handleDateChange = (index, newValue) => {
    const newTasks = [...AddTaskforms];
    newTasks[index].dueDate = newValue;
    setAddTakForms(newTasks);

    // Clear the error for the due date field if it exists
    const errorKey = `dueDate_${index}`;
    if (errorsTask[errorKey]) {
      setErrorsTask((prevErrors) => ({
        ...prevErrors,
        [errorKey]: "",
      }));
    }

    // Update impactForm
    const updatedImpactForm = { ...impactForm, changeImpactTasks: newTasks };
    setImpactForm(updatedImpactForm);
  };

  const handleRemoveAddTaskForm = (index, id) => {
    apiAuth.delete(`/ChangeImpact/${id}/1`).then((resp) => { });
    const newTasks = AddTaskforms.filter((_, i) => i !== index);
    setAddTakForms(newTasks);

    // Update impactForm
    const updatedImpactForm = { ...impactForm, changeImpactTasks: newTasks };
    setImpactForm(updatedImpactForm);
  };

  const [mocPhase, setMocPhase] = useState([]);
  const [risk, setRisk] = useState(false);

  const validateAddTask = () => {
    const errors = {};
    if (!impactForm.particular) {
      errors.particular = "Particular is required";
    }
    if (!impactForm.particularSubCategory) {
      errors.particularSubCategory = "Particular Sub Category is required";
    }
    setErrorsAddTask(errors);

    return Object.keys(errors).length === 0;
  };

  const validateTasks = () => {
    const errors = {};
    AddTaskforms.forEach((task, index) => {
      if (!task.actionWhat) {
        errors[`actionWhat_${index}`] = "Task description is required";
      }
      if (!task.actionHow) {
        errors[`actionHow_${index}`] = "Task details are required";
      }
      if (!task.deadline) {
        errors[`deadline_${index}`] = "Deadline is required";
      }
      if (!task.assignedStaffId) {
        errors[`assignedStaffId_${index}`] = "Assigned Staff is required";
      }
      if (!task.dueDate) {
        errors[`dueDate_${index}`] = "Due Date is required";
      }
    });
    setErrorsTask(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddNewTask = () => {
    if (validateAddTask()) {
      setAddNewTask(true);
      if (validateTasks()) {
        apiAuth.get(`/LookupData/Lov/11`).then((resp) => {
          setMocPhase(resp.data.data);
        });
        const newTask = {
          actionWhat: "",
          actionHow: "",
          assignedStaffId: "",
          consultedDate: null,
          dueDate: null,
        };
        const newTasks = [...AddTaskforms, newTask];
        setAddTakForms(newTasks);

        // Update impactForm
        const updatedImpactForm = {
          ...impactForm,
          changeImpactTasks: newTasks,
        };
        setImpactForm(updatedImpactForm);
      }
    }
  };

  const [hazardDetailsForm, setHazardDetailsForm] = useState([]);
  const [hazardDetails, setHazardDetails] = useState(false);

  const handleRemoveHazardDetail = (index) => {
    const newTasks = hazardDetailsForm.filter((_, i) => i !== index);
    setHazardDetailsForm(newTasks);

    // Update impactForm
    const updatedImpactForm = {
      ...impactForm,
      changeImpactTasks: newTasks,
    };
    setImpactForm(updatedImpactForm);
  };

  const validateHazardDetails = () => {
    const errors = {};
    hazardDetailsForm.forEach((detail, index) => {
      if (!detail.changeImpactHazard) {
        errors[index] = "This field is required.";
      }
    });
    setErrorsImpact(errors);
    return Object.keys(errors).length === 0;
  };

  const handelAddHazardDetails = () => {
    setHazardDetails(true);
    if (validateHazardDetails()) {
      const newTask = {
        id: 0,
        changeImpactHazard: "",
      };
      const newTasks = [...hazardDetailsForm, newTask];
      setHazardDetailsForm(newTasks);

      // Update impactForm
      const updatedImpactForm = {
        ...impactForm,
        changeImpactHazardList: newTasks,
      };
      setImpactForm(updatedImpactForm);
    }
  };

  const handleHazardDetailChange = (index, event) => {
    const { name, value } = event.target;

    const newTasks = [...hazardDetailsForm];
    newTasks[index][name] = value;
    setHazardDetailsForm(newTasks);
    // Clear the error for the changed field
    const newErrors = { ...errorsImpact };
    delete newErrors[index];
    setErrorsImpact(newErrors);

    // Update impactForm
    const updatedImpactForm = {
      ...impactForm,
      changeImpactHazardList: newTasks,
    };
    setImpactForm(updatedImpactForm);
  };

  const [subTaskDetail, setSubTaskDetail] = useState([]);
  const [subTaskhazardDetail, setSubTaskhazardDetail] = useState([]);
  const [potentialTimeDetails, setPotentialTimeDetails] = useState([]);
  const [potentialFrequencyDetails, setPotentialFrequencyDetails] = useState(
    []
  );
  const [potentialFrequencyRiskDetails, setPotentialFrequencyRiskDetails] =
    useState([]);

  const [TaskhazardRiskApi, setSubTaskhazardRiskApi] = useState([]);
  const [TaskhazardRiskView, setSubTaskhazardRiskView] = useState(false);
  const [TaskhazardRiskViewName, setSubTaskhazardRiskViewName] = useState("");
  const [generalGuidePdf, setGeneralGuidePdf] = useState(null);
  const [hazardTypeValue, sethazardTypeValue] = useState("");
  const [Classifications, setClassification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handelRisk = (id, type) => {
    setEditRiskAnalysDetail([]);
    setHazaId(0);
    setSubTaskhazardRiskView(false);

    setSubTaskhazardRiskViewName("");
    sethazardTypeValue(type);
    setRisk(true);
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
  console.log(TaskhazardRiskApi, "ssssss");
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

  const likelihoodValues = Array.from({ length: 15 }, (_, i) => i + 1);

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

    // Fields that should not have leading whitespace
    const fieldsToCheckForWhitespace = [
      "hazardousSituation",
      "consequence",
      "humanControlMeasure",
      "technicalControlMeasure",
      "organisationalControlMeasure",
    ];

    // Check each field and set error if empty
    requiredFields.forEach((field) => {
      const value = formValues[field];
      if (
        !value ||
        (fieldsToCheckForWhitespace.includes(field) && value.trim() === "")
      ) {
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

          setRisk(false);
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

  const goBack = () => {
    setRisk(false);
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
  const [viewrisk, setViewRisk] = useState(false);

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

    setViewRisk(true);
    setRisk(true);
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
    });
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
      setRisk(true);
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
      });
    },
    [TaskhazardRiskViewName]
  );
  const [selectedBtn, setSelectedBtn] = useState(null);
  const handlesumbitmodal = (btn) => {
    setSelectedBtn(btn);
    setOpenSubmit(true);
  };
  const handelSubmitApproval = () => {
    setIsLoading(true);

    apiAuth
      .post(`/ChangeEvaluation/ExecuteActivity/${Session.id}`, {
        activityUID: AppActivity.uid,
        actionUID: selectedBtn.uid,
        formUID: `${Session.id}`,
      })
      .then((resp) => {
        setOpenSubmit(false);
        setIsLoading(false);

        toast?.success("Evaluation Submitted Successfully");
        apiAuth
          .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
          .then((resp) => {
            setContent(resp.data.data.phases);
          });
      })
      .catch((err) => {
        setIsLoading(false);

        toast?.error("Some Error Occured");
      });
  };

  const [stopComment, setStopComment] = useState("");
  const [isCommentValid, setIsCommentValid] = useState(false);
  const handleCommentChange = (e) => {
    const comment = e.target.value;
    setStopComment(comment);
    // Check if comment is not empty or just whitespace
    setIsCommentValid(comment.trim().length > 0);
  };

  const handleStopSession = () => {
    setIsLoading(true);

    apiAuth
      .put(
        `/ChangeEvaluationSession/End/${SessionList[0].changeEvaluationId}/${assetEvaluationId}/${SessionList[0].id}`,
        { comments: stopComment }
      )
      .then((resp) => {
        setIsLoading(false);
        localStorage.removeItem("currentSeconds");
        localStorage.removeItem("lastUpdate");
        toast?.success("Evaluation session has been stopped.");
        setOpen(false);
        localStorage.setItem("isActiveSession", false);
        getRecords();
        setTimeout(() => location.reload(), 1000);
        if (timerRef.current) {
          timerRef.current.stopTimer();
          // Stop the timer when the API call is successful
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveSubTask = (id, impid) => {
    apiAuth.get(`/RiskAnalysis/RemoveSubTask?id=${id}`).then((resp) => {
      apiAuth
        .get(`/RiskAnalysis/hazardList?id=${impid}`)
        .then((resp) => {
          setEditSubTask(resp.data.data);
        })
        .catch((error) => {
          console.error("Error creating session:", error);
        });
    });
  };
  const [expanded, setExpanded] = useState("panel1"); // Default to a static value

  // Static identifiers for each accordion section
  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [previousTasks, setPreviousTasks] = useState({});

  const toggleDetails = (impid) => {
    if (selectedTaskId === impid) {
      // If the clicked task is already selected, close it by setting selectedTaskId to null
      setSelectedTaskId(null);
    } else {
      // Fetch data and set the selected task ID
      apiAuth.get(`/Task/GetPreviousVersions/${impid}`).then((resp) => {
        setPreviousTasks((prev) => ({
          ...prev,
          [impid]: resp.data.data,
        }));
      });
      setSelectedTaskId(impid);
    }
  };

  const hasComments = list.some((item) => item.comments !== "");

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
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
      <Initiation
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
        contentDetailsT={contentDetailsT}
        contentDetailsDocu={contentDetails}
      />
      <SwipeableViews>
        {!risk ? (
          <Paper className="w-full mx-auto my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
            <div>
              <div className="flex items-center flex-wrap w-full border-b justify-between p-30 pt-24 pb-24">
                <h2 className="text-2xl font-semibold">Evaluation</h2>
                <div>
                  {AppActivity.canEdit && (
                    <Button
                      className="whitespace-nowrap my-5 sm:my-0 mr-5"
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
                          {Session?.activeSession?.status === 2
                            ? "heroicons-outline:x"
                            : "heroicons-outline:user-add"}
                        </FuseSvgIcon>
                      }
                      onClick={handleOpen}
                    >
                      {!Session?.activeSession && <span>Create Session</span>}
                      {Session?.activeSession?.status === 1 && (
                        <span>Session acceptance pending</span>
                      )}
                      <CountdownTimer ref={timerRef} Session={Session} />
                    </Button>
                  )}
                  <Button
                    className="whitespace-nowrap mt-0"
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
                    onClick={handleOpenSession}
                  >
                    Session List
                  </Button>
                </div>
              </div>
            </div>
            {AppActivity.canEdit && (
              <div className="ng-star-inserted p-30 pt-24 pb-0 ">
                <div className="ng-star-inserted ">
                  {Session?.activeSession?.status == 1 && (
                    <div
                      className="mt-4 py-2 px-5 rounded-lg bg-red-100 dark:bg-red-700"
                      style={{
                        backgroundColor: "rgb(255 196 202)",
                        padding: "5px",
                      }}
                    >
                      Session will be started after once all the team members
                      accepts
                    </div>
                  )}
                  {!Session?.hasActiveSession && (
                    <div
                      className="rounded-lg bg-red-100 dark:bg-red-700"
                      style={{
                        backgroundColor: "rgb(255 196 202)",
                        padding: "5px",
                      }}
                    >
                      Please start session to make any changes.
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* )} */}
            <Box sx={{ width: "100%" }} className="hello p-30 pt-12 pb-12">
              <Box className="sm:d-flex flex-wrap">
                <Button
                  onClick={() => handleChange(0)}
                  variant={value === 0 ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: value === 0 ? "#e6e6e6" : "transparent",
                    color: value === 0 ? "black" : "black",
                    borderColor: "white",
                  }}
                >
                  Change Evaluation Consultation
                </Button>
                <Button
                  onClick={() => handleChange(1)}
                  className="sm:ms-5 mt-4 sm:mt-0"
                  variant={value === 1 ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: value === 1 ? "#e6e6e6" : "transparent",
                    color: value === 1 ? "black" : "black",
                    borderColor: "white",
                  }}
                >
                  Change Evaluation Impacts
                </Button>
              </Box>

              <CustomTabPanel value={value} index={0}>
                {list.length && !AddCunsultation
                  ? list.map((itms) => (
                    <Accordion style={{ margin: "0px" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        style={{ minHeight: "60px" }}
                      >
                        <div className="flex flex-wrap w-full">
                          {/* User Info Section */}
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                            style={{ marginRight: "auto", width: "40%" }}
                          >
                            <div className="flex items-center">
                              <img
                                src="/assets/images/etc/userpic.png"
                                alt="Card cover image"
                                className="rounded-full mr-4"
                                style={{ width: "4rem", height: "4rem" }}
                              />
                              <div className="flex flex-col">
                                <span
                                  className="font-semibold leading-none"
                                  style={{
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {itms.staff}
                                </span>
                                <span className="text-sm text-secondary leading-none pt-5">
                                  Consulted on{" "}
                                  {new Date(
                                    itms.consultedDate
                                  ).toLocaleString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Comments Section */}
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                            style={{ width: "15%" }}
                          >
                            <div className="flex items-center">
                              <div
                                className="py-0.5 px-3 rounded-full text-sm"
                                style={{
                                  backgroundColor:
                                    itms.comments === "" ||
                                      itms.comments == null
                                      ? "rgba(252,165,165)"
                                      : "rgba(134,239,172)",
                                  padding: "5px",
                                }}
                              >
                                {itms.comments === ""
                                  ? "No Comments Added"
                                  : "Comments Added"}
                              </div>
                            </div>
                          </div>

                          {/* Tasks Section */}
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                            style={{ width: "15%" }}
                          >
                            <div className="flex items-center">
                              <div
                                className="py-0.5 px-3 rounded-full text-sm"
                                style={{
                                  backgroundColor:
                                    itms.tasks.length === 0
                                      ? "rgba(252,165,165)"
                                      : "rgba(134,239,172)",
                                  padding: "5px",
                                  marginLeft: "15px",
                                }}
                              >
                                {itms.tasks.length === 0
                                  ? "No Task Added"
                                  : `${itms.tasks.length} Task Added`}
                              </div>
                            </div>
                          </div>

                          {/* Reviews Section */}
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                            style={{ width: "15%" }}
                          >
                            <div className="flex items-center">
                              {itms.reviews.length !== 0 ? (
                                <div
                                  className="py-0.5 px-3 rounded-full text-sm"
                                  style={{
                                    backgroundColor: "rgba(252,165,165)",
                                    padding: "5px",
                                    marginLeft: "15px",
                                  }}
                                >
                                  {`${itms.reviews.length} Reviews Added`}
                                </div>
                              ) : (
                                <div
                                  className="py-0.5 px-3 rounded-full text-sm"
                                  style={{
                                    padding: "5px",
                                    marginLeft: "28px",
                                  }}
                                >
                                  No Reviews
                                </div>
                              )}
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
                                        paddingBottom: "10px",
                                      }}
                                    >
                                      {itms.comments == "" ? (
                                        <span
                                          className="inline-flex bg-default rounded  mr-5 mt-5 ms-5 text-secondary max-w-5xl"
                                          style={{
                                            paddingBottom: "10px",
                                          }}
                                        >
                                          No Comments Added.
                                        </span>
                                      ) : (
                                        <div className="mb-12">
                                          <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                            comments
                                          </span>
                                          <span className="task-detail-value">
                                            {itms.comments}
                                          </span>
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {itms?.remark != "" && itms.tasks[0] && (
                                <>
                                  <div className="">
                                    <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                      Task Added
                                    </span>
                                    <span className="task-detail-value">
                                      {itms.tasks[0]}
                                    </span>
                                  </div>
                                  <div
                                    className=""
                                    style={{ marginTop: "25px" }}
                                  >
                                    <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                      Remarks
                                    </span>
                                    <span className="task-detail-value">
                                      {itms.remark}
                                    </span>
                                  </div>
                                </>
                              )}
                              {itms?.reviews?.length == 0 && (
                                <span
                                  className="inline-flex bg-default rounded mt-5  ms-5 text-secondary "
                                  style={{
                                    paddingBottom: "10px",
                                  }}
                                >
                                  No reviews added.
                                </span>
                              )}
                              {itms?.reviews?.length != 0 && (
                                <Accordion
                                  expanded={expanded === "panel1"}
                                  onChange={handleExpansionChange("panel1")}
                                  className="mt-6"
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography>
                                      <span className="text-brown">
                                        {itms?.reviews?.length} Reviews
                                      </span>{" "}
                                    </Typography>
                                  </AccordionSummary>
                                  {itms?.reviews?.map((rivew) => (
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
                                          <div>
                                            <div className="mat-form-field-infix mt-12">
                                              <span className="">
                                                {rivew?.createdByStaffName}
                                              </span>
                                              -{" "}
                                              <span className="text-grey">
                                                {rivew?.remark}
                                              </span>
                                            </div>
                                            <p
                                              className="mat-form-field-infix text-grey"
                                              style={{
                                                fontSize: "smaller",
                                              }}
                                            >
                                              {rivew?.updatedAt}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionDetails>
                                  ))}
                                </Accordion>
                              )}
                              <div>
                                {AppActivity.canEdit &&
                                  JSON.parse(
                                    localStorage.getItem("isActiveSession")
                                  ) && (
                                    <Button
                                      className=" mt-5"
                                      variant="contained"
                                      sx={{
                                        backgroundColor: "white",
                                        color: "black",
                                        border: "1px solid black",
                                        marginTop: "8px",
                                      }}
                                      startIcon={
                                        <FuseSvgIcon size={20}>
                                          heroicons-outline:user-add
                                        </FuseSvgIcon>
                                      }
                                      onClick={() =>
                                        handelEditConsultation(
                                          itms.staff,
                                          itms.consultedDate,
                                          itms.consultedStaffId,
                                          itms.id,
                                          itms.comments
                                        )
                                      }
                                    >
                                      Edit Consultation
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </Step>
                        </Stepper>
                      </AccordionDetails>
                    </Accordion>
                  ))
                  : list.length == 0 && (
                    <Typography className="ps-5 pb-5">
                      No Evaluation Consultations added
                    </Typography>
                  )}
                {AppActivity.canEdit &&
                  Session.activeSession?.status == 2 &&
                  !AddCunsultation && (
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
                          onClick={handleAddConsultation}
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                          }
                        >
                          Add New Consultation
                        </Button>
                      </div>
                    </div>
                  )}
                {AddCunsultation && (
                  <div className="font-semibold ps-5 text-blue cursor-pointer">
                    <a rel="noopener noreferrer" onClick={handlebackList}>
                      Back to Consulataion list view
                    </a>
                  </div>
                )}

                {!editConsultation && (
                  <>
                    {AddCunsultation &&
                      forms.map((form, index) => (
                        <div
                          style={{
                            marginTop: "25px",
                            justifyContent: "space-start",
                          }}
                          className="flex flex-row "
                          key={form.id}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl
                              sx={{
                                marginLeft: "10px",
                              }}
                              error={!!errorsAdd[form.id]?.consultedDate}
                            >
                              <FormLabel
                                id={`consultedStaffId-label-${form.id}`}
                              >
                                <b className="text-black">Consulted On *</b>
                              </FormLabel>
                              <Box sx={{}}>
                                <DatePicker
                                  name="consultedDate"
                                  renderInput={(params) => (
                                    <TextField
                                      fullWidth
                                      {...params}
                                      error={
                                        !!errorsAdd[form.id]?.consultedDate
                                      }
                                    />
                                  )}
                                  minDate={new Date()} // Prevents selection of past dates
                                  value={form.consultedDate}
                                  onChange={(newValue) =>
                                    handleInputChange(
                                      form.id,
                                      "consultedDate",
                                      newValue
                                    )
                                  }
                                />
                              </Box>
                              {!!errorsAdd[form.id]?.consultedDate && (
                                <FormHelperText error>
                                  {errorsAdd[form.id].consultedDate}
                                </FormHelperText>
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
                              <FormLabel
                                id={`consultedStaffId-label-${form.id}`}
                              >
                                <b className="text-black">Staff *</b>
                              </FormLabel>
                              <Autocomplete
                                id={`consultedStaffId-${form.id}`}
                                options={docStaff}
                                getOptionLabel={(option) => option.text}
                                value={
                                  docStaff.find(
                                    (option) =>
                                      option.value === form.consultedStaffId
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  handleInputChange(
                                    form.id,
                                    "consultedStaffId",
                                    newValue ? newValue.value : ""
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={
                                      !!errorsAdd[form.id]?.consultedStaffId
                                    }
                                    helperText={
                                      errorsAdd[form.id]?.consultedStaffId
                                    }
                                  />
                                )}
                              />
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
                  </>
                )}
                {editConsultation && (
                  <>
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-start",
                      }}
                      className="flex flex-row "
                    >
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl
                          sx={{
                            marginLeft: "10px",
                          }}
                        >
                          <FormLabel component="legend" className="text-14">
                            Consulted On
                          </FormLabel>
                          <Box sx={{}}>
                            <DatePicker
                              name="consultedDate"
                              minDate={new Date()} // Prevents selection of past dates
                              renderInput={(params) => (
                                <TextField fullWidth {...params} />
                              )}
                              value={editStaffDate}
                              disabled
                            />
                          </Box>
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
                          <FormLabel component="legend" className="text-14">
                            Staff
                          </FormLabel>
                          <Select
                            labelId="division-label"
                            name="consultedStaffId"
                            id="consultedStaffId"
                            value={editStaffName} // Set the default value here
                            disabled
                          >
                            <MenuItem value={editStaffName} disabled>
                              {editStaffName} {/* Display the value */}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                    <div
                      className="py-0.5 px-3 rounded-full text-sm  mt-5"
                      style={{ paddingLeft: "10px", paddingTop: "10px" }}
                    ></div>
                    {hasComments ? (
                      <div className="mb-12 ms-8">
                        {EditComments === "" ? (
                          ""
                        ) : (
                          <>
                            <span className="task-detail-label bg-default rounded text-secondary font-semibold">
                              Comments by Staff
                            </span>
                            <span className="task-detail-value">
                              {EditComments}
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="mb-12 ms-8">
                        <span className=" bg-default rounded text-secondary font-semibold">
                          No Comments Added By staff
                        </span>
                      </div>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "5px",
                      }}
                    >
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="reasonForNewDocument"
                          className="font-semibold leading-none"
                        >
                          Tasks *
                        </FormLabel>
                        <Select
                          id="reasonForNewDocument"
                          name="reasonForNewDocument"
                          multiple
                          value={selectedTasks}
                          onChange={handleChangeTask}
                          className="mt-5"
                          displayEmpty
                          renderValue={(selected) =>
                            selected.length === 0 ? (
                              <em>None</em>
                            ) : (
                              selected
                                .map((taskId) => {
                                  const task = sessionTaskList.find(
                                    (option) => option.value === taskId
                                  );
                                  return task ? task.text : taskId;
                                })
                                .join(", ")
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {sessionTaskList.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                              <Checkbox
                                checked={
                                  selectedTasks.indexOf(option.value) > -1
                                }
                              />
                              <ListItemText primary={option.text} />
                            </MenuItem>
                          ))}
                        </Select>
                        {taskError && (
                          <div style={{ color: "red" }}>{taskError}</div>
                        )}
                      </FormControl>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="reasonForNewDocument"
                          className="font-semibold leading-none"
                        >
                          Remarks *
                        </FormLabel>
                        <OutlinedInput
                          id="reasonForNewDocument"
                          name="reasonForNewDocument"
                          onChange={handleRemarkChange}
                          label="Reason For Change*"
                          className="mt-5"
                          value={remark}
                        />
                        {remarkError && (
                          <div style={{ color: "red" }}>{remarkError}</div>
                        )}
                      </FormControl>
                    </Box>
                    <div
                      className="my-10"
                      style={{ borderTopWidth: "2px", marginTop: "40px" }}
                    ></div>
                    <div className="flex justify-end">
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{ marginTop: "15px" }}
                      ></div>
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{ marginTop: "15px" }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                      </div>
                    </div>

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
                          onClick={handleAddConsultation}
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                          }
                        >
                          Add New Consultation
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CustomTabPanel>

              <CustomTabPanel value={value} index={1}>
                <Paper>
                  {impactList.length && !AddImpact
                    ? impactList.map((itms, impactindex) => (
                      <Accordion style={{ margin: "0px" }} key={impactindex}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          style={{ minHeight: "60px" }}
                        >
                          <div className="flex flex-wrap w-100">
                            <div
                              className="inventory-grid grid grid_inventory_box items-center gap-4 py-3 px-2 md:px-2"
                              style={{ marginRight: "auto" }}
                            >
                              <div className="flex items-center">
                                <img
                                  src="/assets/images/etc/userpic.png"
                                  alt="Card cover image"
                                  className="rounded-full mr-4"
                                  style={{ width: "4rem", height: "4rem" }}
                                />
                                <div className="flex flex-col">
                                  <span
                                    className="font-semibold leading-none"
                                    style={{
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {itms.particularName}
                                  </span>
                                  <span className="text-sm text-secondary leading-none pt-5">
                                    {itms.particularSubName}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              style={{ width: "15%" }}
                            >
                              <div className="flex items-center">
                                <div
                                  className=" rounded-full text-sm"
                                  style={{
                                    backgroundColor:
                                      itms.riskCount > 0
                                        ? "rgba(252,165,165)"
                                        : "",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                  }}
                                >
                                  {itms.riskCount > 0
                                    ? `${itms?.riskCount} Risks`
                                    : "No Risks"}
                                </div>
                              </div>
                            </div>
                            <div
                              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              style={{ width: "10%" }}
                            >
                              <div className="flex items-center">
                                <div className="py-0.5 px-3 rounded-full text-sm">
                                  {itms.changeImpactTasks.length}
                                  {""}Tasks
                                </div>
                              </div>
                            </div>
                            <div
                              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              style={{ width: "10%" }}
                            >
                              <div className="flex items-center">
                                <div
                                  className="py-0.5 px-3 rounded-full text-sm"
                                  style={{
                                    backgroundColor:
                                      itms.reviewsCount > 0
                                        ? "rgba(252,165,165)"
                                        : "",
                                    padding: "5px",
                                    marginLeft: "15px",
                                  }}
                                >
                                  {itms.reviewsCount > 0
                                    ? `${itms?.reviewsCount} Reviews`
                                    : "No Reviews"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stepper orientation="vertical">
                            <Step>
                              <div className="mat-expansion-panel-body ng-tns-c137-15">
                                {itms?.hazardDetail &&
                                  itms?.riskAnalysisList?.length == 0 ? (
                                  <>
                                    <div className="task-detail-item mt-5">
                                      <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                        Detail of Hazard or How the
                                        Action/Task to be Achieved
                                      </span>
                                      <span className="task-detail-value">
                                        {itms.hazardDetail}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  itms?.riskAnalysisList?.length == 0 && (
                                    <div className="mt-2 ng-tns-c137-15">
                                      <div className="prose prose-sm max-w-5xl">
                                        <div className="ng-star-inserted">
                                          <span
                                            className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                            style={{
                                              padding: "10px",
                                            }}
                                          >
                                            "No Comments Added"
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}

                                {itms?.riskAnalysisList?.length !== 0 && (
                                  <RiskAnalysisTableView
                                    Paper={Paper}
                                    matchingRisks={itms?.riskAnalysisList}
                                    currentActivityForm={currentActivityForm}
                                    handelRisk={handelRisk}
                                    handelViewDetails={handelViewDetails}
                                    handelEditRiskDetails={
                                      handelEditRiskDetails
                                    }
                                    handelRemoveDetails={handelRemoveDetails}
                                    showEditRemove={true}
                                  />
                                )}

                                {itms?.changeImpactTasks?.map((imptsk) => (
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
                                          <div className="task-header px-0 flex items-center">
                                            <div className="task-id flex flex-col">
                                              <span className="task-id-text font-semibold text-xl leading-none">
                                                Task #{imptsk?.sourceTaskId}
                                              </span>
                                            </div>
                                          </div>
                                          {imptsk.sourceTaskId !==
                                            imptsk.id &&
                                            (!imptsk.showPreviousTasks ||
                                              imptsk.showPreviousTasks ===
                                              null) && (
                                              <span
                                                className="text-sm text-secondary text-blue-500 font-bold cursor-pointer leading-none mt-1 ms-12"
                                                onClick={() =>
                                                  toggleDetails(imptsk.id)
                                                }
                                              >
                                                {selectedTaskId !== imptsk.id
                                                  ? "Show previous versions"
                                                  : "Hide previous versions"}
                                              </span>
                                            )}
                                          {selectedTaskId === imptsk.id &&
                                            previousTasks[imptsk.id] &&
                                            previousTasks[imptsk.id].map(
                                              (itm) => (
                                                <div
                                                  className="task-details px-0 mt-0 pt-0 border"
                                                  key={itm.id}
                                                >
                                                  <div class="mt-3 ms-9 font-semibold">
                                                    V{itm.evaluationVersion}
                                                  </div>
                                                  <div className="task-detail prose prose-sm max-w-5xl mt-0 pt-0">
                                                    <div className="task-detail-item mt-0 pt-0">
                                                      <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                                        Impact
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {itm.particularName +
                                                          ">" +
                                                          itm.particularSubName}
                                                      </span>
                                                    </div>
                                                    <div className="task-detail-item mt-3">
                                                      <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                                        What is Task
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {itm.actionWhat}
                                                      </span>
                                                    </div>
                                                    <div className="task-detail-item mt-5">
                                                      <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                                        How is Task done
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {itm.actionHow}
                                                      </span>
                                                    </div>
                                                    <div className="task-detail-item mt-5">
                                                      <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                                        Assigned to
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {itm.assignedStaff}
                                                      </span>
                                                      <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-10 text-secondary font-semibold">
                                                        Due Date
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {new Date(
                                                          itm.dueDate
                                                        ).toLocaleString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                          }
                                                        )}
                                                      </span>
                                                      <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-10 text-secondary font-semibold">
                                                        Deadline
                                                      </span>
                                                      <span className="task-detail-value d-inline-block mt-10">
                                                        {itm?.deadlineDisplay}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div>&nbsp;</div>
                                                  {itm
                                                    ?.changeImpactTaskReviews
                                                    ?.length != 0 && (
                                                      <Accordion
                                                        expanded={
                                                          expanded === "panel2"
                                                        }
                                                        onChange={handleExpansionChange(
                                                          "panel2"
                                                        )}
                                                        className="mt-6"
                                                      >
                                                        <AccordionSummary
                                                          expandIcon={
                                                            <ExpandMoreIcon />
                                                          }
                                                          aria-controls="panel1a-content"
                                                          id="panel1a-header"
                                                        >
                                                          <Typography>
                                                            <span className="text-brown">
                                                              {
                                                                itm
                                                                  ?.changeImpactTaskReviews
                                                                  ?.length
                                                              }{" "}
                                                              Reviews
                                                            </span>{" "}
                                                          </Typography>
                                                        </AccordionSummary>
                                                        {itm?.changeImpactTaskReviews?.map(
                                                          (rivew) => (
                                                            <AccordionDetails>
                                                              <div className="mat-form-field-wrapper">
                                                                <div className="mat-form-field-flex">
                                                                  <img
                                                                    src="/assets/images/etc/userpic.png"
                                                                    alt="Card cover image"
                                                                    className="rounded-full mr-4"
                                                                    style={{
                                                                      width:
                                                                        "3rem",
                                                                      height:
                                                                        "3rem",
                                                                    }}
                                                                  />
                                                                  <div>
                                                                    <div className="mat-form-field-infix mt-12">
                                                                      <span className="">
                                                                        {
                                                                          rivew?.createdByStaffName
                                                                        }
                                                                      </span>
                                                                      -{" "}
                                                                      <span className="text-grey">
                                                                        {
                                                                          rivew?.remark
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                    <p
                                                                      className="mat-form-field-infix text-grey"
                                                                      style={{
                                                                        fontSize:
                                                                          "smaller",
                                                                      }}
                                                                    >
                                                                      {
                                                                        rivew?.updatedAt
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </AccordionDetails>
                                                          )
                                                        )}
                                                      </Accordion>
                                                    )}
                                                </div>
                                              )
                                            )}

                                          <div className="task-details pt-0 px-0 mt-0">
                                            <div className="task-detail prose prose-sm max-w-5xl mt-0">
                                              <div className="task-detail-item mt-0 p-0">
                                                <span className="task-detail-label bg-default rounded d-inline-block mt-10 text-secondary font-semibold">
                                                  What is Task
                                                </span>
                                                <span className="task-detail-value d-inline-block mt-10">
                                                  {imptsk.actionWhat}
                                                </span>
                                              </div>
                                              <div className="task-detail-item mt-0 p-0">
                                                <span className="task-detail-label bg-default rounded d-inline-block mt-5 text-secondary font-semibold">
                                                  How is Task done
                                                </span>
                                                <span className="task-detail-value d-inline-block mt-5">
                                                  {imptsk.actionHow}
                                                </span>
                                              </div>
                                              <div className="task-detail-item mt-0 p-0">
                                                <span className="task-detail-label bg-default rounded d-inline-block mt-5 text-secondary font-semibold">
                                                  Assigned to
                                                </span>
                                                <span className="task-detail-value d-inline-block mt-5 mr-3">
                                                  {imptsk.assignedStaff}
                                                </span>
                                                <span className="task-detail-label bg-default mt-5 rounded d-inline-block ml-2 text-secondary font-semibold">
                                                  Due Date
                                                </span>
                                                <span className="task-detail-value d-inline-block mt-5">
                                                  {new Date(
                                                    imptsk.dueDate
                                                  ).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                  })}
                                                </span>
                                                <span className="task-detail-label bg-default rounded mt-5 d-inline-block ml-2 text-secondary font-semibold">
                                                  Deadline
                                                </span>
                                                <span className="task-detail-value d-inline-block mt-5">
                                                  {imptsk?.deadlineDisplay}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          {imptsk?.changeImpactTaskReviews
                                            ?.length != 0 ? (
                                            <Accordion
                                              expanded={expanded === "panel3"}
                                              onChange={handleExpansionChange(
                                                "panel3"
                                              )}
                                              className="mt-6 m-5"
                                            >
                                              <AccordionSummary
                                                expandIcon={
                                                  <ExpandMoreIcon />
                                                }
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                              >
                                                <Typography>
                                                  <span className="text-brown">
                                                    {
                                                      imptsk
                                                        ?.changeImpactTaskReviews
                                                        ?.length
                                                    }{" "}
                                                    Reviews
                                                  </span>{" "}
                                                </Typography>
                                              </AccordionSummary>
                                              {imptsk?.changeImpactTaskReviews?.map(
                                                (rivew) => (
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
                                                        <div>
                                                          <div className="mat-form-field-infix mt-12">
                                                            <span className="">
                                                              {
                                                                rivew?.createdByStaffName
                                                              }
                                                            </span>
                                                            -{" "}
                                                            <span className="text-grey">
                                                              {rivew?.remark}
                                                            </span>
                                                          </div>
                                                          <p
                                                            className="mat-form-field-infix text-grey"
                                                            style={{
                                                              fontSize:
                                                                "smaller",
                                                            }}
                                                          >
                                                            {rivew?.updatedAt}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </AccordionDetails>
                                                )
                                              )}
                                            </Accordion>
                                          ) : (
                                            <span className="pl-10 py-10 d-inline-block">
                                              No Comments Added
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                ))}
                                {/* {itms?.remark !== "" &&
                              itms?.tasks.length !== 0 && (
                                <div style={{ alignItems: "flex-start" }}>
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                    }}
                                  >
                                    <p>
                                      <b>Task Added</b> : {itms.tasks[0]}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <p>
                                      <b>Remarks</b> : {itms.remark}{" "}
                                    </p>
                                  </div>
                                </div>
                              )} */}

                                {AppActivity.canEdit &&
                                  JSON.parse(
                                    localStorage.getItem("isActiveSession")
                                  ) && (
                                    <>
                                      <div
                                        _ngcontent-fyk-c288=""
                                        class="flex items-center w-full  border-b justify-between"
                                        style={{ marginTop: "5px" }}
                                      ></div>
                                      <Button
                                        className="ms-5 mt-10 mb-10"
                                        variant="contained"
                                        sx={{
                                          backgroundColor: "white",
                                          color: "black",
                                          border: "1px solid black",
                                        }}
                                        startIcon={
                                          <FuseSvgIcon size={20}>
                                            heroicons-outline:user-add
                                          </FuseSvgIcon>
                                        }
                                        onClick={() =>
                                          handelEditImpactTask(
                                            itms.hazardDetail,
                                            itms?.changeImpactTasks,
                                            itms?.particular,
                                            itms.particularSubCategory,
                                            itms?.changeImapactId,
                                            itms?.changeRequestId,
                                            itms?.changeEvaluationId
                                          )
                                        }
                                      >
                                        Edit Impact/Task
                                      </Button>
                                    </>
                                  )}
                              </div>
                            </Step>
                          </Stepper>
                        </AccordionDetails>
                      </Accordion>
                    ))
                    : ""}
                  {AddImpact && (
                    <>
                      <div
                        className="font-semibold ps-5 text-blue "
                        style={{ padding: "15px" }}
                      >
                        <a
                          rel="noopener noreferrer"
                          onClick={handlebackImpactList}
                          className="cursor-pointer"
                        >
                          Back to Impact View
                        </a>
                      </div>
                      <div
                        className="my-10"
                        style={{ borderTopWidth: "2px" }}
                      ></div>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          marginTop: "5px",
                          margin: "20px",
                        }}
                      >
                        <FormControl fullWidth sx={{ mb: 1, maxWidth: "100%" }}>
                          <FormLabel
                            htmlFor="particular"
                            className="font-semibold leading-none"
                          >
                            Particular *
                          </FormLabel>
                          <Select
                            id="particular"
                            name="particular"
                            value={impactForm.particular}
                            onChange={handleChangeImpact}
                            className="mt-5"
                            error={!!errorsAddTask.particular}
                            disabled={EditSubTask.length}
                          >
                            <MenuItem value="" disabled>
                              <em>None</em>
                            </MenuItem>
                            {particularList.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                <ListItemText primary={option.text} />
                              </MenuItem>
                            ))}
                          </Select>
                          {!!errorsAddTask?.particular && (
                            <FormHelperText error>
                              {errorsAddTask.particular}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 1, maxWidth: "100%" }}>
                          <FormLabel
                            htmlFor="particularSubCategory"
                            className="font-semibold leading-none m-4"
                          >
                            Particular Sub Category *
                          </FormLabel>
                          <Autocomplete
                            id="particularSubCategory"
                            name="particularSubCategory"
                            className="mt-4"
                            value={
                              particularSubList.find(
                                (option) =>
                                  option.value ===
                                  impactForm.particularSubCategory
                              ) || null
                            }
                            options={particularSubList}
                            getOptionLabel={(option) => option.text}
                            onChange={(event, newValue) => {
                              handleChangeImpact({
                                target: {
                                  name: "particularSubCategory",
                                  value: newValue.value,
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                error={!!errorsAddTask?.particularSubCategory}
                                helperText={
                                  errorsAddTask?.particularSubCategory
                                }
                                disabled={EditSubTask.length > 0}
                              />
                            )}
                          />
                        </FormControl>
                        {impactForm.particular == 78 ? (
                          <>
                            <div className="flex items-center w-full bg-gray-50 border-b mb-10 justify-between"></div>
                            <Box sx={{ width: "100%" }}>
                              <Grid
                                container
                                spacing={2}
                                className="inventory-grid m-0 w-100"
                                sx={{
                                  position: "sticky",
                                  top: 0,
                                  paddingY: 2,
                                  paddingX: { xs: 2, md: 3 },
                                  boxShadow: 1,
                                  backgroundColor: "grey.50",
                                  zIndex: 10,
                                }}
                              >
                                <Grid item xs={12} md={3}>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontWeight="fontWeightBold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Detail of Hazard or How the Action/Task to
                                    be Achieved
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontWeight="fontWeightBold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Risk Analysis Details
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontWeight="fontWeightBold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Human
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontWeight="fontWeightBold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Technical
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontWeight="fontWeightBold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Organisational
                                  </Typography>
                                </Grid>
                              </Grid>

                              {EditSubTask.map((task, index) =>
                                task.riskAnalysisSubTasks.map(
                                  (subTask, subTaskIndex) => (
                                    <React.Fragment key={subTaskIndex}>
                                      <Grid
                                        container
                                        spacing={2}
                                        className="inventory-grid"
                                        sx={{
                                          paddingY: 2,
                                          paddingX: { xs: 2, md: 3 },
                                        }}
                                      >
                                        <Grid item xs={12} md={3}>
                                          <Typography
                                            variant="body2"
                                            color="text.primary"
                                            fontWeight="fontWeightRegular"
                                          >
                                            {subTask.subTaskName}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                          {subTask.riskAnalysisHazardTypes
                                            .length ? (
                                            subTask.riskAnalysisHazardTypes.map(
                                              (
                                                riskAnalysisHazardType,
                                                hazardTypeIndex
                                              ) => (
                                                <React.Fragment
                                                  key={hazardTypeIndex}
                                                >
                                                  <Grid container spacing={2}>
                                                    <Grid item xs={12} md={3}>
                                                      <Typography
                                                        variant="body2"
                                                        color="text.primary"
                                                        fontWeight="fontWeightRegular"
                                                        className="text-center"
                                                      >
                                                        {
                                                          riskAnalysisHazardType.hazardTypeDisplay
                                                        }
                                                      </Typography>
                                                    </Grid>
                                                    {riskAnalysisHazardType.riskAnalysisHazardSituation.map(
                                                      (
                                                        riskHazardSituation,
                                                        situationIndex
                                                      ) => (
                                                        <Grid
                                                          container
                                                          spacing={2}
                                                          key={situationIndex}
                                                          alignItems="center"
                                                        >
                                                          <Grid
                                                            item
                                                            xs={12}
                                                            md={3}
                                                          >
                                                            <Typography
                                                              variant="body2"
                                                              color="text.primary"
                                                              fontWeight="fontWeightRegular"
                                                              className="text-center"
                                                            >
                                                              {
                                                                riskHazardSituation.hazardousSituation
                                                              }
                                                            </Typography>

                                                            <Typography
                                                              variant="body2"
                                                              color="text.primary"
                                                              fontWeight="fontWeightRegular"
                                                              className="text-center"
                                                              style={{
                                                                backgroundColor:
                                                                  riskHazardSituation.residualRiskClassificationDisplay ===
                                                                    "HighRisk"
                                                                    ? "red"
                                                                    : riskHazardSituation.residualRiskClassificationDisplay ===
                                                                      "LowRisk"
                                                                      ? "yellow"
                                                                      : riskHazardSituation.residualRiskClassificationDisplay ===
                                                                        "SignificantRisk"
                                                                        ? "brown"
                                                                        : riskHazardSituation.residualRiskClassificationDisplay ===
                                                                          "AverageRisk"
                                                                          ? "orange"
                                                                          : riskHazardSituation.residualRiskClassificationDisplay ===
                                                                            "VeryLowRisk"
                                                                            ? "green"
                                                                            : "initial",
                                                                color: "white",
                                                                padding: "5px",
                                                                borderRadius:
                                                                  "5px",
                                                                marginTop:
                                                                  "5px",
                                                              }}
                                                            >
                                                              {
                                                                riskHazardSituation.residualRiskClassificationDisplay
                                                              }
                                                            </Typography>
                                                          </Grid>
                                                          <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                          >
                                                            <Typography
                                                              variant="body2"
                                                              color="text.primary"
                                                              fontWeight="fontWeightRegular"
                                                              className="text-center"
                                                            >
                                                              {
                                                                riskHazardSituation.humanControlMeasure
                                                              }
                                                            </Typography>
                                                          </Grid>
                                                          <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                          >
                                                            <Typography
                                                              variant="body2"
                                                              color="text.primary"
                                                              fontWeight="fontWeightRegular"
                                                              className="text-center"
                                                            >
                                                              {
                                                                riskHazardSituation.technicalControlMeasure
                                                              }
                                                            </Typography>
                                                          </Grid>
                                                          <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                          >
                                                            <Typography
                                                              variant="body2"
                                                              color="text.primary"
                                                              fontWeight="fontWeightRegular"
                                                              className="text-center"
                                                            >
                                                              {
                                                                riskHazardSituation.organisationalControlMeasure
                                                              }
                                                            </Typography>
                                                          </Grid>
                                                        </Grid>
                                                      )
                                                    )}
                                                  </Grid>
                                                </React.Fragment>
                                              )
                                            )
                                          ) : (
                                            <Button
                                              className="whitespace-nowrap"
                                              startIcon={
                                                <FuseSvgIcon size={15}>
                                                  heroicons-solid:trash
                                                </FuseSvgIcon>
                                              }
                                              style={{
                                                color: "red",
                                              }}
                                              onClick={() =>
                                                handleRemoveSubTask(
                                                  subTask.id,
                                                  task.changeImapactId
                                                )
                                              }
                                            ></Button>
                                          )}
                                        </Grid>
                                      </Grid>
                                      <div className="flex items-center w-full bg-gray-50 border-b justify-between"></div>
                                    </React.Fragment>
                                  )
                                )
                              )}
                            </Box>

                            {hazardDetails &&
                              hazardDetailsForm.map((detail, index) => (
                                <>
                                  <FormControl
                                    fullWidth
                                    sx={{ mb: 1, maxWidth: "90%" }}
                                    key={detail.id}
                                  >
                                    <Select
                                      id="changeImpactHazard"
                                      name="changeImpactHazard"
                                      value={detail.value}
                                      onChange={(e) =>
                                        handleHazardDetailChange(index, e)
                                      }
                                      className="mt-5"
                                      error={!!errorsImpact[index]}
                                    >
                                      <MenuItem
                                        value="Select"
                                        name="changeImpactHazard"
                                      >
                                        <em>Select</em>
                                      </MenuItem>
                                      {hazardList.map((option) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.value}
                                        >
                                          <ListItemText primary={option.text} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errorsImpact[index] && (
                                      <FormHelperText error>
                                        {errorsImpact[index]}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                  <Button
                                    className="whitespace-nowrap mt-5"
                                    startIcon={
                                      <FuseSvgIcon size={15}>
                                        heroicons-solid:trash
                                      </FuseSvgIcon>
                                    }
                                    style={{ marginTop: "20px" }}
                                    onClick={() =>
                                      handleRemoveHazardDetail(index)
                                    }
                                  ></Button>
                                </>
                              ))}

                            {impactForm.particular == 78 ||
                              EditSubTask.length ? (
                              <Box sx={{ width: "100%", margin: "0" }}>
                                <div className="flex justify-end">
                                  <Button
                                    className="whitespace-nowrap mt-5"
                                    startIcon={
                                      <FuseSvgIcon size={20}>
                                        heroicons-solid:plus
                                      </FuseSvgIcon>
                                    }
                                    style={{
                                      marginTop: "20px",
                                      backgroundColor: "black",
                                      color: "white",
                                    }}
                                    onClick={handelAddHazardDetails}
                                  >
                                    Add Hazard Details
                                  </Button>
                                </div>
                              </Box>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <FormControl
                            fullWidth
                            sx={{ maxWidth: "100%" }}
                            className="mt-10"
                          >
                            <FormLabel
                              htmlFor="hazardDetail"
                              className="font-semibold leading-none"
                            >
                              Detail of Hazard or How the Action/Task to be
                              Achieved
                            </FormLabel>
                            <OutlinedInput
                              id="hazardDetail"
                              name="hazardDetail"
                              value={impactForm.hazardDetail}
                              onChange={handleChangeImpact}
                              label="Reason For Change*"
                              className="mt-5"
                            />
                          </FormControl>
                        )}
                      </Box>

                      <div
                        className="my-10"
                        style={{ borderTopWidth: "2px" }}
                      ></div>
                      {AddTaskforms &&
                        AddTaskforms.map((task, index) => (
                          <Paper style={{ margin: "20px" }}>
                            <div
                              _ngcontent-fyk-c288=""
                              class="flex items-center w-full bg-gray-50  border-b justify-between"
                            >
                              <h2
                                _ngcontent-fyk-c288=""
                                class="text-2xl font-semibold"
                                style={{ padding: "10px" }}
                              >
                                Task #{task.id}
                              </h2>
                              <Button
                                className="whitespace-nowrap mt-5 mb-5"
                                style={{
                                  backgroundColor: "#0000",
                                  color: "black",
                                }}
                                variant="contained"
                                color="warning"
                                onClick={() =>
                                  handleRemoveAddTaskForm(index, task.id)
                                }
                              >
                                <FuseSvgIcon size={20}>
                                  heroicons-solid:x
                                </FuseSvgIcon>
                              </Button>
                            </div>
                            <div className="flex-auto">
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    padding: "15px 15px 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
                                >
                                  <Box
                                    sx={{
                                      width: 560,
                                      maxWidth: "100%",
                                    }}
                                  >
                                    <FormLabel
                                      className="font-medium text-14"
                                      component="legend"
                                    >
                                      What is the Task *
                                    </FormLabel>
                                    <TextField
                                      fullWidth
                                      name="actionWhat"
                                      value={task.actionWhat}
                                      onChange={(e) =>
                                        handleTaskInputChange(index, e)
                                      }
                                      error={
                                        !!errorsTask[`actionWhat_${index}`]
                                      }
                                      helperText={
                                        errorsTask[`actionWhat_${index}`]
                                      }
                                    />
                                  </Box>

                                  <Box
                                    sx={{
                                      width: 560,
                                      maxWidth: "100%",
                                    }}
                                  >
                                    <FormLabel
                                      className="font-medium text-14"
                                      component="legend"
                                    >
                                      How is the task done *
                                    </FormLabel>
                                    <TextField
                                      fullWidth
                                      name="actionHow"
                                      value={task.actionHow}
                                      onChange={(e) =>
                                        handleTaskInputChange(index, e)
                                      }
                                      error={!!errorsTask[`actionHow_${index}`]}
                                      helperText={
                                        errorsTask[`actionHow_${index}`]
                                      }
                                    />
                                  </Box>
                                </div>
                              </div>{" "}
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    padding: "15px 15px 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
                                >
                                  <FormControl
                                    sx={{
                                      width: 560,
                                      maxWidth: "100%",
                                    }}
                                  >
                                    <FormLabel
                                      className="font-medium text-14"
                                      component="legend"
                                    >
                                      MOC phase *
                                    </FormLabel>
                                    <Select
                                      variant="outlined"
                                      name="deadline"
                                      value={task.deadline}
                                      onChange={(e) =>
                                        handleTaskInputChange(index, e)
                                      }
                                      error={!!errorsTask[`deadline_${index}`]}
                                    >
                                      {mocPhase.map((option) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.value}
                                        >
                                          {option.text}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {!!errorsTask[`deadline_${index}`] && (
                                      <FormHelperText error>
                                        {errorsTask[`deadline_${index}`]}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                  <FormControl
                                    sx={{
                                      width: 560,
                                      maxWidth: "100%",
                                    }}
                                  >
                                    <FormLabel
                                      className="font-medium text-14"
                                      component="legend"
                                    >
                                      Task Assigned To *
                                    </FormLabel>
                                    <Autocomplete
                                      id={`assignedStaffId-${index}`}
                                      options={docStaff}
                                      getOptionLabel={(option) => option.text}
                                      value={
                                        docStaff.find(
                                          (option) =>
                                            option.value ===
                                            task.assignedStaffId
                                        ) || null
                                      }
                                      onChange={(event, newValue) => {
                                        handleTaskInputChange(index, {
                                          target: {
                                            name: "assignedStaffId",
                                            value: newValue
                                              ? newValue.value
                                              : "",
                                          },
                                        });
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          error={
                                            !!errorsTask[
                                            `assignedStaffId_${index}`
                                            ]
                                          }
                                          helperText={
                                            errorsTask[
                                            `assignedStaffId_${index}`
                                            ]
                                          }
                                        />
                                      )}
                                      renderOption={(props, option) => (
                                        <MenuItem
                                          {...props}
                                          key={option.id}
                                          value={option.value}
                                        >
                                          {option.text}
                                        </MenuItem>
                                      )}
                                    />
                                  </FormControl>
                                </div>
                              </div>{" "}
                              <div className="flex flex-col-reverse">
                                <div
                                  style={{
                                    // marginTop: "30px",
                                    justifyContent: "space-between",
                                    padding: "15px 15px 0",
                                  }}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <FormControl
                                      sx={{
                                        width: 560,
                                        maxWidth: "100%",
                                      }}
                                      error={!!errorsTask[`dueDate_${index}`]}
                                    >
                                      <FormLabel
                                        className="font-medium text-14"
                                        component="legend"
                                      >
                                        Due Date *
                                      </FormLabel>
                                      <Box sx={{}}>
                                        <DatePicker
                                          name="dueDate"
                                          value={
                                            task.dueDate
                                              ? new Date(task.dueDate)
                                              : null
                                          }
                                          minDate={new Date()} // Prevents selection of past dates
                                          onChange={(newValue) =>
                                            handleDateChange(index, newValue)
                                          }
                                          renderInput={(params) => (
                                            <TextField fullWidth {...params} />
                                          )}
                                          error={
                                            !!errorsTask[`dueDate_${index}`]
                                          }
                                        />
                                      </Box>
                                      {!!errorsTask[`dueDate_${index}`] && (
                                        <FormHelperText error>
                                          {errorsTask[`dueDate_${index}`]}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="ng-star-inserted">
                              <span
                                className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                style={{
                                  padding: "15px",
                                }}
                              >
                                No Reviews Added
                              </span>
                            </div>
                          </Paper>
                        ))}
                      <div className=" pt-24 pb-24">
                        <Button
                          style={{
                            marginLeft: "20px",
                          }}
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                          }
                          onClick={handleAddNewTask}
                        >
                          Add New Task
                        </Button>
                      </div>
                      <div
                        className="my-10"
                        style={{ borderTopWidth: "2px" }}
                      ></div>
                      <div className="flex justify-end">
                        <div
                          className="flex items-center p-30 pt-24 pb-24 space-x-12"
                        // style={{ marginTop: "15px" }}
                        >
                          <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            // style={{ margin: "15px" }}
                            //   onClick={() => handleOpen(btn)}
                            startIcon={
                              <FuseSvgIcon size={20}>
                                heroicons-outline:plus
                              </FuseSvgIcon>
                            }
                            onClick={handelImpactSubmit}
                          >
                            Add Tasks
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Paper>
                {AppActivity.canEdit &&
                  Session.activeSession?.status == 2 &&
                  !AddImpact && (
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
                          //   onClick={() => handleOpen(btn)}
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                          }
                          onClick={handleAddImpact}
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
                <Button
                  className="whitespace-nowrap mb-5"
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "37px" }}
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                  }
                  onClick={handleAddConsultation}
                >
                  Add New Stakeholder
                </Button>
                <div
                  // className="my-10"
                  style={{ borderTopWidth: "2px" }}
                ></div>

                <div
                  className="flex justify-end items-center p-30 pb-24 pt-24 space-x-12"
                // style={{ marginTop: "15px" }}
                >
                  <div className="flex items-center space-x-12">
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
                      onClick={handlebackList}
                    >
                      Cancel
                    </Button>
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
                      onClick={handleSubmit}
                    >
                      Add Stakeholders
                    </Button>
                  </div>
                </div>
              </>
            )}
            {!JSON.parse(localStorage.getItem("isActiveSession")) &&
              AppActivity.canExecute && (
                <>
                  <div
                    className="my-10"
                    style={{ borderTopWidth: "2px", marginTop: "40px" }}
                  ></div>

                  <div className="flex justify-end">
                    <div className="flex items-center  sm:mt-0 sm:mx-8 space-x-12"></div>
                    <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12 p-30 pt-24 pb-24">
                      {AppActions.map((btn) => (
                        <Button
                          className="whitespace-nowrap "
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          key={btn.name}
                          onClick={() => handlesumbitmodal(btn)}
                        >
                          {btn.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </Paper>
        ) : (
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
            editRiskAnalysDetail={editRiskAnalysDetail}
            handelRiskSubmit={handelRiskSubmit}
            setRisk={setRisk}
          />
        )}
      </SwipeableViews>

      <SessionModal
        open={open}
        handleClose={handleClose}
        SessionList={SessionList}
        formatDate={formatDate}
        timer={timer}
        timerRef={timerRef}
        Session={Session}
        show={false}
        setStopComment={setStopComment}
        handleStopSession={handleStopSession}
        groupedData={groupedData}
        selectedItems={selectedItems}
        handleCheckboxChange={handleCheckboxChange}
        handelCreateSession={handelCreateSession}
        handleCommentChange={handleCommentChange}
        isCommentValid={isCommentValid}
      />
      <SessionListModal
        openSession={openSession}
        handleCloseSession={handleCloseSession}
        SessionList={SessionList}
        formatDate={formatDate}
      />

      <ConfirmationModal
        openSubmit={openSubmit}
        handleCloseSubmit={handleCloseSubmit}
        title="Submit request"
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
            onClick={handleCloseSubmit}
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
            onClick={handelSubmitApproval}
          >
            Submit
          </Button>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default EvaluationChange;
