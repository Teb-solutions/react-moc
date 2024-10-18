import { useState, useEffect } from "react";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwipeableViews from "react-swipeable-views";
import { apiAuth } from "src/utils/http";
import { ChangeDeadlineLabel } from "../ChangeDeadLineLabels";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TableContainer from "@mui/material/TableContainer";
import { styled } from "@mui/material/styles";
import Initiation from "../../common_components/Initiation";
import FuseLoading from "@fuse/core/FuseLoading";
import { withStyles } from "@mui/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

import { display } from "@mui/system";
import AuditModal from "../../common_modal/audit_modals/AddAudit";
import AuditListModal from "../../common_modal/audit_modals/AuditList";
import ConfirmationModal from "../../common_modal/confirmation_modal/ConfirmationModal";
import DocumentModal from "../../common_modal/documentModal";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
import PssrCheckListPart from "./PssrChecklistpart";

import ImplementationView from "./ImplementationView";
import PssrSession from "./PssrSession";
import DateExtend from "./DateExtend";

// Adjust the path based on your project structure

function createData(
  index,

  Task,
  Audit,
  date,
  staff
) {
  return { Task, Audit, date, staff };
}

function ImplementationApproval({
  assetEvaluationId,
  currentActivityForm,
  lastActCode,
  AppActions,
  AppActivity,
  setContent,
  contentDetailsini,
  contentDetails,
  contentDetailsPssr,
}) {
  const steps = [
    {
      label: "RFQ",
    },
    {
      label: "Vendor Finalization",
    },
    {
      label: "Mobilization",
    },
    {
      label: "Closeout",
    },
    {
      label: "Handover",
    },
  ];
  const styleImp = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",
    maxWidth: "90%",
    boxShadow: 24,
  };
  const style = {
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
    p: 2,
  };
  const styleExt = {
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
  };
  const stylePssr = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "900px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);

  const [activeStep, setActiveStep] = useState(0);
  const [ImpDetails, setImpDetails] = useState([]);
  const [impComments, setImpComments] = useState([]);
  const [openImplemntationTask, setOpenImplemntationTask] = useState(false);
  const [openAudit, setOpenAudit] = useState(false);
  const [openAuditComment, setOpenAuditComment] = useState(false);
  const [countApprove, setCountApprove] = useState(0);
  const handleCloseImplemntationTask = () => setOpenImplemntationTask(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [currentAudit, setCurrentAudit] = useState([]);
  const [docStaff, setDocStaff] = useState([]);
  const [errors, setErrors] = useState({});
  //modal part
  const [open, setOpen] = useState(false);
  const [openPssR, setOpenPssR] = useState(false);
  const [deletes, setDeletes] = useState(false);
  const [deletesPssR, setDeletesPssR] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [listDocumentPssR, setListDocumentPssR] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerPssR, setOpenDrawerPssR] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [fileDetailsPssR, setFileDetailsPssR] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentPssR, setSelectedDocumentPssR] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [documenDowTokenPssR, setDocumenDowTokenPssR] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [openSubmit, setOpenSubmit] = useState(false);
  const [dateExtendopen, setDateExtendOpen] = useState(false);
  const [task, setTask] = useState({});
  const [ShowTask, setShowTask] = useState(false);
  const [reqDate, setReqDate] = useState(null);
  const [commentss, setCommentss] = useState("");
  const [pssrOpen, setPssrOpen] = useState(false);
  const [pssrSessionOpen, setPssrSessionOpen] = useState(false);

  const [pssrList, setPssrList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedStaff, setCheckedStaff] = useState([]);
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [startSessionButon, setStartSessionButton] = useState(false);
  const [pssrsessionStatus, setPssrsessionStatus] = useState(0); // Assuming status 0 initially
  const [activeSessiondata, setActiveSessionData] = useState(null);
  const [teamList, setteamList] = useState([]);
  const [docuPssR, setDocuPssR] = useState(0);
  const [selectedFilePssR, setSelectedFilePssR] = useState({
    name: "",

    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ImplPSSR",
    documentId: "",
    changeRequestToken: null,
  });

  const handleSessionCheck = () => {
    // Perform API call here to check session
    // Example: Using fetch or axios
    apiAuth
      .get(`/PssrSession/SessionData?id=${assetEvaluationId}`)
      .then((data) => {
        // Assuming data structure matches the API response
        if (data.data?.message === "team not created") {
          setStartSessionButton(false);
        } else {
          setStartSessionButton(true);
        }

        if (data.data && data.data?.data?.pssrSession) {
          const session = data.data?.data?.pssrSession;
          setActiveSessionData(session);
          setteamList(session.teamList);
          if (session.isActive || !session.isSessionEnded) {
            setPssrsessionStatus(session.status);
            setIsActiveSession(session.status === 2);
          } else {
            setIsActiveSession(false);
          }
        }
      })

      .catch((error) => {
        console.error("Error fetching session data:", error);
      });
  };

  useEffect(() => {
    handleSessionCheck();
  }, []);

  const [stopComment, setStopComment] = useState("");
  const [showPssrCheckList, setShowPssrCheckList] = useState(false);
  const [PssrCheckListData, setPssrCheckListData] = useState([]);

  const handleCheckboxSessionChange = (staffId) => {
    setCheckedStaff(
      (prevCheckedStaff) =>
        prevCheckedStaff.includes(staffId)
          ? prevCheckedStaff.filter((id) => id !== staffId) // Remove if unchecked
          : [...prevCheckedStaff, staffId] // Add if checked
    );
  };
  const handlePssrSessionSave = async () => {
    const selectedTeamList = pssrList
      .filter((item) => checkedStaff.includes(item.staffId)) // Get selected staff
      .map((item) => ({
        isActive: true,
        staffId: item.staffId,
        staffName: item.staffName,
        staffMail: item.staffName, // Adjust this if you have a different field for email
      }));

    const payload = { teamList: selectedTeamList };

    const response = await apiAuth
      .put(`/PssrSession/CreatePssrSession?id=${assetEvaluationId}`, payload)
      .then((resp) => {
        // Save the date when the session is created
        if (resp.data.statusCode === 400) {
          setPssrSessionOpen(false);

          toast.error(resp.data.message);
        } else {
          toast.success("PSSR Session List Added");
          setPssrSessionOpen(false);
          handleSessionCheck();
          getRecords();
        }
      });
  };

  const handelPssrTeamSession = async () => {
    setPssrSessionOpen(true);
    setIsLoading(true);
    const response1 = await apiAuth.get(
      `/PssrSession/List?id=${assetEvaluationId}`
    );
    const staffList = response1.data?.data;
    setPssrList(staffList);
    setIsLoading(false);
  };

  const handelPssrTeam = async () => {
    setPssrOpen(true);
    setIsLoading(true);

    // Fetch the list of all staff members
    const response = await apiAuth.get(`/Staff/LOV`);
    const staffList = response.data?.data;

    // Fetch the pre-selected PSSR team members
    const response1 = await apiAuth.get(
      `/PssrSession/List?id=${assetEvaluationId}`
    );
    const preSelectedTeam = response1.data?.data;

    // Set pssrList to the fetched staff list
    setPssrList(staffList);
    setIsLoading(false);
    handleSessionCheck();
    // Match pre-selected staff with the staff list
    const checkedStaff = staffList.filter((item) =>
      preSelectedTeam.some((preItem) => preItem.staffId === item.value)
    );

    // Set checked items based on the pre-selected team
    setCheckedItems(checkedStaff);
  };
  const handlePssrClose = () => {
    setPssrOpen(false);
  };

  const handleCheckboxChange = (event, item) => {
    const { checked } = event.target;

    if (checked) {
      setCheckedItems([...checkedItems, item]); // Add item to checkedItems array
    } else {
      setCheckedItems(checkedItems.filter((i) => i.value !== item.value)); // Remove item from checkedItems array
    }
  };
  const handlePssrSave = async () => {
    const payload = {
      pssrTeam: checkedItems.map((item) => ({
        isActive: true,
        staffId: item.value, // Assuming `value` is `staffId`
        staffName: item.text, // Set `staffName` to an empty string
      })),
    };

    const response = await apiAuth
      .put(`/PssrSession/TeamCreate?id=${assetEvaluationId}`, payload)
      .then((resp) => {
        toast.success("PSSR team updated successfully");
        setPssrOpen(false);
        handleSessionCheck();
      });
  };

  const handleStopSession = () => {
    setIsLoading(true);
    apiAuth
      .put(`/PssrSession/End/${assetEvaluationId}/${activeSessiondata.id}`, {
        comments: stopComment,
      })
      .then((resp) => {
        toast?.success("PSSR session has been stopped.");
        setIsLoading(false);
        getRecords();

        setPssrSessionOpen(false);
        setTimeout(() => location.reload(), 1000);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const [remarksState, setRemarksState] = useState({});
  const [radioState, setRadioState] = useState({});

  const handelPssrCheckLists = () => {
    setShowPssrCheckList(true);

    apiAuth.get(`/LookupData/PssrLov/26/${assetEvaluationId}`).then((resp) => {
      setPssrCheckListData(resp?.data?.data);
    });
  };

  const [checklistData, setChecklistData] = useState([]);
  const [documentCountsImp, setDocumentCountsImp] = useState({});
  useEffect(() => {
    if (PssrCheckListData?.pssrData) {
      // Initialize checklistData from PssrCheckListData
      const initialChecklistData = PssrCheckListData.pssrData.map((entry) => ({
        ...entry,
        documentId: entry.documentId || generateGUID(),
      }));
      PssrCheckListData.pssrData.forEach((e) => {
        if (!e.documentId) {
          e.documentId = generateGUID();
        }
      });

      setChecklistData(PssrCheckListData.pssrData);

      // Initialize radioState and remarksState from PssrCheckListData
      const radioInitialState = {};
      const remarksInitialState = {};

      PssrCheckListData.pssrData.forEach((item) => {
        radioInitialState[item.particular] = item.checklistReviewStatus;
        remarksInitialState[item.particular] = item.remarks;
      });

      setRadioState(radioInitialState);
      setRemarksState(remarksInitialState);

      // Fetch document counts based on IDs
      const fetchDocumentCounts = async () => {
        const ids = PssrCheckListData.pssrData.map((item) => item.id);

        try {
          const responses = await Promise.all(
            ids.map((id) =>
              apiAuth.get(
                `DocumentManager/DocumentCount?id=${id}&documentType=ImplPSSR`
              )
            )
          );

          const counts = responses.reduce((acc, response) => {
            const { data } = response.data;
            // Extract id from response URL
            const id = new URL(response.request.responseURL).searchParams.get(
              "id"
            );
            acc[id] = data; // Extract document count
            return acc;
          }, {});

          setDocumentCountsImp(counts);
        } catch (error) {
          console.error("Error fetching document counts:", error);
        }
      };

      fetchDocumentCounts();
    }
  }, [PssrCheckListData]);
  // Function to handle radio button change
  const handleRadioChange = (childId, value) => {
    setRadioState((prevState) => ({
      ...prevState,
      [childId]: value,
    }));
    updateChecklistData(childId, "checklistReviewStatus", value);
  };

  // Function to handle comments change
  const handleCommentsChange = (e, childValue, newComment) => {
    setRemarksState((prevState) => ({
      ...prevState,
      [childValue]: newComment,
    }));
    updateChecklistData(childValue, "remarks", newComment);
  };

  // Function to handle document upload (mock implementation for now)
  // const handleDocumentUpload = (childId) => {
  //   const documentId = generateGUID(); // Generate a new GUID
  //   updateFormState(childId, "documentId", documentId);
  // };

  const updateChecklistData = (childId, field, value) => {
    setChecklistData((prevData) => {
      const updatedData = [...prevData];
      const existingEntryIndex = updatedData.findIndex(
        (entry) => entry.particular === childId
      );

      if (existingEntryIndex !== -1) {
        updatedData[existingEntryIndex][field] = value;
      } else {
        const pssrEntry = PssrCheckListData?.pssrData.find(
          (pssrItem) => pssrItem.particular === childId
        );
        const newEntry = {
          id: 0, // Or any other unique identifier
          particluarCategory: PssrCheckListData?.parentData.find(
            (parent) =>
              parent.value ===
              PssrCheckListData?.childData.find(
                (child) => child.value === childId
              ).parentId
          )?.value,
          particular: childId,
          remarks: pssrEntry
            ? pssrEntry.remarks
            : field === "remarks"
              ? value
              : "",
          checklistReviewStatus: pssrEntry
            ? pssrEntry.checklistReviewStatus
            : field === "checklistReviewStatus"
              ? value
              : "",
          documentId: pssrEntry
            ? pssrEntry.documentId || generateGUID()
            : generateGUID(),
        };

        updatedData.push(newEntry);
      }

      return updatedData;
    });
  };

  const generateGUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleSubmitCheckList = () => {
    let validationPassed = true;
    let errorMessages = [];
    let taskListApproved = ImpDetails?.filter((x) => x.taskStatus == 3);
    if (ImpDetails?.length != taskListApproved?.length) {
      toast?.error("There are some pending Tasks to be reviewed.");
      setOpenSubmit(false);
      return;
    }
    // Iterate over each checklist item, but skip items with parentId === 0

    PssrCheckListData?.childData
      ?.filter((child) => child.parentId !== 0) // Filter out items where parentId is 0
      .forEach((child) => {
        const radioValue = radioState[child.value];
        const remarksValue = remarksState[child.value];

        // Validate if a radio option is selected for each child
        if (!radioValue) {
          validationPassed = false;
          errorMessages.push(`Please select an option for ${child.text}.`);
        }

        // Validate if comments are required and ensure they are not empty
        if (!remarksValue || remarksValue.trim() === "") {
          validationPassed = false;
          errorMessages.push(`Please provide remarks for ${child.text}.`);
        }
      });

    // If validation fails, display error messages
    if (!validationPassed) {
      toast?.error("Some items are not reviewed.");
      return; // Stop form submission if validation fails
    }

    setIsLoading(true);
    apiAuth
      .put(`/ImplementationPSSR/Create?id=${assetEvaluationId}`, checklistData)
      .then((resp) => {
        if (resp.data.statusCode === 200) {
          toast?.success("Checklist submitted successfully!");
          setShowPssrCheckList(false);
          setShowPssrEdit(false);
          setIsLoading(false);
        } else {
          toast?.error(resp.data.message);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        toast?.error("An error occurred while submitting the checklist.");
      });
  };

  const [showPssrEdit, setShowPssrEdit] = useState(false);

  const handlePssrEdit = () => {
    setShowPssrEdit(true);
  };

  const [dueDateCommentValidation, setDueDateCommentValidation] =
    useState(null);
  const [dueDateValidation, setDueDateValidation] = useState(null);

  const handledateExtendopen = (e, task, show) => {
    e.preventDefault();
    if (show === "false") {
      setShowTask(true);
    } else {
      setShowTask(false);
    }
    getRecords();
    setTask(task);

    setDateExtendOpen(true);
  };
  const handlehandledateExtendClose = () => {
    setDueDateValidation(false);

    setDueDateCommentValidation(false);
    setDateExtendOpen(false);
  };
  const handleCloseSubmit = () => setOpenSubmit(false);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
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
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });

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

  const handelOpenAudit = async (audits, value) => {
    setOpenAudit(true);

    if (value === "fullList") {
      const response = await apiAuth.get(
        `/ChangeImplementation/AuditList/${assetEvaluationId}`
      );

      const transformedData = response.data.data.map((item, index) =>
        createData(
          index + 1,
          item.task,
          item.comments,
          item.donebydate,
          item.auditDoneBy
        )
      );
      setCurrentAudit(transformedData);
    } else {
      const transformedData = audits.map((item, index) =>
        createData(
          index + 1,
          item.task,
          item.comments,
          item.donebydate,
          item.auditDoneBy
        )
      );
      setCurrentAudit(transformedData);
    }
  };

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

  const [taskAdd, setTaskAdd] = useState({
    showPreviousTasks: false,
    actionWhat: "",
    actionHow: "",
    assignedStaffId: "",
    dueDate: new Date(),
    audit: "",
  });

  const validateAddTask = () => {
    let tempErrors = {};

    if (!taskAdd.actionWhat) tempErrors.actionWhat = "This Field is required";
    if (!taskAdd.actionHow) tempErrors.actionHow = "This Field is required";
    if (!taskAdd.assignedStaffId)
      tempErrors.assignedStaffId = "Assigned Staff  is required";

    if (!taskAdd.dueDate) tempErrors.dueDate = "Date Field is required";

    // Add other validations here
    setErrorsAddTask(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChangeAddTask = (e) => {
    const { name, value } = e.target;
    setTaskAdd((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddAuditComment = (e) => {
    const { name, value } = e.target;
    setAuditData((prevState) => ({
      ...prevState,
      comments: value,
    }));
  };

  const [comments, setComments] = useState("");
  const [currentActiveStepLabel, setCurrentActiveStepLabel] = useState("");

  const getRecords = async () => {
    try {
      const response = await apiAuth.get(
        `/ChangeImpact/ListTask?id=${assetEvaluationId}`
      );
      setImpDetails(response.data?.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, [currentActiveStepLabel]);

  useEffect(() => {
    // Update current active step label whenever activeStep changes
    setCurrentActiveStepLabel(steps[activeStep]?.label);
  }, [activeStep, steps]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const [expanded, setExpanded] = useState(null); // State to track expanded Accordion

  const handleAccordionChange = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : null);
  };

  const handleChangeTaskDate = (date) => {
    setTaskAdd((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({});

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

  const handleOpenImplemntationTask = () => {
    setTaskAdd({
      ...taskAdd,
      showPreviousTasks: false,
      actionWhat: "",
      actionHow: "",
      assignedStaffId: "",
      dueDate: new Date(),
      audit: "",
    });
    setOpenImplemntationTask(true);
    apiAuth.get(`Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticular(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => { });
  };

  const handelApproveImpl = (e, task) => {
    if (comments.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsButtonDisabled(true);
    const updatedTask = {
      ...task,
      submissionList: impComments,
      comments: comments,
      parentId: 0,
      taskStatus: 3,
      changeEvaluationId: 0,
      changeImapactId: 0,
      taskStatusText: "Work In Progress",
    };

    apiAuth
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        handelComments(e, task.id);
        setIsButtonDisabled(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelRejectImpl = (e, task) => {
    if (comments.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsButtonDisabled(true);
    const updatedTask = {
      ...task,
      comments: comments,
      submissionList: impComments,
      ChangeEvaluationId: 0,
      changeImapactId: 0,

      ParentId: 0,
      taskStatus: 4,
    };
    apiAuth
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        handelComments(e, task.id);
        getRecords();
        setIsButtonDisabled(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelTaskSubmit = (e) => {
    if (validateAddTask()) {
      let deadlineValue;

      switch (currentActiveStepLabel) {
        case "RFQ":
          deadlineValue = 1;

          break;
        case "Vendor Finalization":
          deadlineValue = 2;
          break;
        case "Mobilization":
          deadlineValue = 3;
          break;
        case "Closeout":
          deadlineValue = 4;
          break;
        case "Handover":
          deadlineValue = 5;
          break;
        default:
          deadlineValue;
          break;
      }
      const updatedTaskAdd = {
        ...taskAdd,
        deadline: deadlineValue,
        changeEvaluationId: 0,
        ChangeImapactId: 0,
        parentId: 0,
        // Assuming you have a deadline property in taskAdd
      };

      apiAuth
        .put(`/Task/AddNewTask/${assetEvaluationId}`, updatedTaskAdd)
        .then((resp) => {
          setOpenImplemntationTask(false);
          getRecords();
        });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const cleanedComments = auditData?.comments?.replace(/\s+/g, ' ').trim();


    auditData.comments = cleanedComments;
    if (!cleanedComments)
      tempErrors.comments = "Comments is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handelAuditCommentSubmit = () => {

    if (!validateForm()) {
      return;
    }
    apiAuth
      .put(
        `/ChangeImplementation/Audit/?requestToken=${assetEvaluationId}&&taskId=${auditData.auditsid}`,
        {
          comments: auditData?.comments?.trim(),
          isActive: auditData.isActive,
        }
      )
      .then((resp) => {
        setOpenAuditComment(false);
        getRecords();
      });
  };

  const [selectedBtn, setSelectedBtn] = useState(null);
  const handlesumbitmodal = (btn) => {
    setSelectedBtn(btn);
    setOpenSubmit(true);
  };

  const SubmitApprovelCreate = () => {
    let taskListApproved = ImpDetails?.filter((x) => x.taskStatus == 3);
    if (ImpDetails?.length != taskListApproved?.length) {
      toast?.error("There are some pending Tasks to be approved.");
      setOpenSubmit(false);
      return;
    } else {
      setIsLoading(true);
      apiAuth
        .post(`/ChangeImplementation/ExecuteActivity/${assetEvaluationId}`, {
          activityUID: lastActCode.uid,
          actionUID: selectedBtn,
          formUID: lastActCode?.formUID,
        })
        .then((resp) => {
          setOpenSubmit(false);

          apiAuth
            .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
            .then((resp) => {
              setContent(resp.data.data.phases);
              setIsLoading(false);
            });
        });
    }
  };
  const toggleDrawerPssR = (open) => () => {
    setOpenDrawerPssR(open);
  };

  const ListDoc = (docu_id, id) => {
    apiAuth
      .get(`/DocumentManager/DocList/${docu_id}/Task?changeRequestToken=${id}`)
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };
  const ListDocPssR = (docu_id, id) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${docu_id}/ImplPSSR?changeRequestToken=${id}`
      )
      .then((Resp) => {
        setListDocumentPssR(Resp?.data?.data);
      });
  };

  const handleOpenPssR = (id) => {
    setOpenPssR(true);
    if (id) {
      ListDocPssR(id, assetEvaluationId);
    }
    setDocuPssR(id);
  };

  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
  };

  const handleModalClosePssR = () => {
    setOpenPssR(false);
    setOpenDrawerPssR(false);
    setFileDetailsPssR(false);
    setListDocumentPssR([]);
    setErrors({})
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
    setErrors({})
  };
  const handelDetailDocPssR = (doc) => {
    setSelectedDocumentPssR(doc);
    setFileDetailsPssR(true);
    setDocumenDowTokenPssR(doc.token);
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handelFileChangePssR = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: "",
    }));
    const file = e.target.files[0];

    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");

    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedFilePssR({
      ...selectedFilePssR,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: "ImplPSSR",
      documentId: docuPssR,
      changeRequestToken: assetEvaluationId,
    });
  };

  const handelFileDiscriptionChangePssR = (event) => {
    const { name, value } = event.target;
    setSelectedFilePssR((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const validateFormRes = () => {
    let tempErrorsDoc = {};
    if (!selectedFilePssR.name)
      tempErrorsDoc.name = "File is required";

    if (!selectedFilePssR.descritpion)
      tempErrorsDoc.descritpion = "Description is required";

    setErrors(tempErrorsDoc);
    return Object.keys(tempErrorsDoc).length === 0;
  };
  const handleSubmitAssetPssR = async (e) => {
    if (!validateFormRes()) {
      return;
    }
    const formData = new FormData();
    formData.append("name", selectedFilePssR.name);
    formData.append("descritpion", selectedFilePssR.descritpion);
    formData.append("type", selectedFilePssR.type);
    formData.append("document", selectedFilePssR.document);
    formData.append("documentType", selectedFilePssR.documentType);
    formData.append("documentId", selectedFilePssR.documentId);
    formData.append("changeRequestToken", selectedFilePssR.changeRequestToken);
    await apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          apiAuth

            .get(
              `/DocumentManager/DocList/${docuPssR}/ImplPSSR?changeRequestToken=${assetEvaluationId}`
            )

            .then((response) => {
              setOpenDrawerPssR(false);
              setListDocumentPssR(response?.data?.data);
              setSelectedFilePssR({
                ...selectedFilePssR,
                name: "",
                descritpion: "",
              });

              apiAuth
                .get(
                  `DocumentManager/DocumentCount?id=${docuPssR}&documentType=ImplPSSR`
                )
                .then((response) => {
                  setDocumentCountsImp({
                    ...documentCountsImp,
                    [docuPssR]: response.data.data,
                  });
                });
            });
        } else {
          toast.error(response.data.message);
          setOpenPssR(false);
          setOpenDrawerPssR(false);
          setSelectedFilePssR({
            ...selectedFilePssR,
            name: "",
            descritpion: "",
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
        setOpenPssR(false);
        setOpenDrawerPssR(false);
        setSelectedFilePssR({
          ...selectedFilePssR,
          name: "",
          descritpion: "",
        });
      });
  };


  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleDeletePssR = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletesPssR(true);
  };

  const handleCloseDelete = () => {
    setDeletes(false);
  };
  const handleCloseDeletePssR = () => {
    setDeletesPssR(false);
  };

  const handleSubmitDeletePssR = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth

        .get(
          `/DocumentManager/DocList/${docId}/ImplPSSR?changeRequestToken=${assetEvaluationId}`
        )

        .then((response) => {
          setOpenDrawerPssR(false);
          setListDocumentPssR(response?.data?.data);
          setDeletesPssR(false);
          setFileDetailsPssR(false);
          setSelectedDocumentPssR("");

          apiAuth
            .get(
              `DocumentManager/DocumentCount?id=${docuPssR}&documentType=ImplPSSR`
            )
            .then((response) => {
              setDocumentCountsImp({
                ...documentCountsImp,
                [docuPssR]: response.data.data,
              });
            });
        });
    });
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ChangeRequest?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };
  const handleSubmits = (task, value) => {
    if (!commentss || !reqDate) {
      if (!reqDate) setDueDateValidation("Due Date is required");
      if (!comments)
        setDueDateCommentValidation("Please provide a reason for extension");

      return;
    }
    let formattedReqDate = dayjs(reqDate).format("MM-DD-YYYY");
    let formattedOldDate = dayjs(task.dueDate).format("MM-DD-YYYY");

    const lastTaskDateUpdate = task.taskDateUpdates.filter(
      (update) => update.taskdateupdateStatus === 1
    );

    apiAuth
      .put(
        `/Task/ApproveTaskDateUpdate/?requestToken=${assetEvaluationId}&taskId=${task?.sourceTaskId}&updatedateID=${lastTaskDateUpdate[0].id}`,
        {
          OldDate: formattedOldDate,
          ApprovedComments: commentss,
          ApprovedDate: formattedReqDate,
          TaskdateupdateStatus: value == 2 ? "Approved" : "Rejected",
          updatedateID: lastTaskDateUpdate[0].id,
        }
      )
      .then((response) => {
        if (response.data.statusCode == 500) {
          getRecords();
          setDateExtendOpen(false);

          toast.error(response.data.message);
        } else {
          setDateExtendOpen(false);
          toast.success(response.data.message);
          setTimeout(() => location.reload(), 1000);

          setCommentss("");
          setReqDate(null);
          setTask({
            ...task,
            activeDateUpdateRequest: 1,
          });
        }
      })
      .catch((err) => {
        setDateExtendOpen(false);
        toast.error("Some error occured");
      });
  };

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
      <AuditModal
        open={openAuditComment}
        handleClose={() => { setOpenAuditComment(false), setErrors({}) }}
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

      <DeleteModal
        openDelete={deletesPssR}
        handleCloseDelete={handleCloseDeletePssR}
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
            onClick={handleCloseDeletePssR}
          >
            Cancel
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            style={{ padding: "23px", backgroundColor: "red" }}
            type="submit"
            onClick={handleSubmitDeletePssR}
          >
            Confirm
          </Button>
        </div>
      </DeleteModal>

      <DocumentModal
        open={open}
        handleModalClose={handleModalClose}
        selectedDocument={selectedDocument}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        selectedFile={selectedFile}
        listDocument={listDocument}
        step={1}
        handelFileDiscriptionChange={handelFileDiscriptionChange}
        handelDetailDoc={handelDetailDoc}

        formatDate={formatDate}
        documenDowToken={documenDowToken}
      />

      <DocumentModal
        open={openPssR}
        handleModalClose={handleModalClosePssR}
        selectedDocument={selectedDocumentPssR}
        openDrawer={openDrawerPssR}
        setOpenDrawer={setOpenDrawerPssR}
        fileDetails={fileDetailsPssR}
        handelFileChange={handelFileChangePssR}
        setFileDetails={setFileDetailsPssR}
        selectedFile={selectedFilePssR}
        listDocument={listDocumentPssR}
        toggleDrawer={toggleDrawerPssR}
        step={1}
        handelFileDiscriptionChange={handelFileDiscriptionChangePssR}
        handleSubmitDocument={handleSubmitAssetPssR}
        handelDetailDoc={handelDetailDocPssR}
        formatDate={formatDate}
        canExecute={lastActCode?.canExecute}
        handleDelete={handleDeletePssR}
        documenDowToken={documenDowTokenPssR}
      />

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
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              Add New Task
            </Box>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "4rem",
                  fontWeight: "800px !important",
                }}
              >
                <div className="flex-auto p-30 pt-24 pb-24 border-b">
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        // marginTop: "30px",
                        justifyContent: "space-between",
                        // margin: "15px",
                      }}
                      className="sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 sm:gap-24 w-full"
                    >
                      <Box
                        className="mt-10"
                        sx={{
                          width: "100%",
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
                          onChange={handleChangeAddTask}
                          value={taskAdd.actionWhat}
                          error={!!errorsAddTask.actionWhat}
                          helperText={errorsAddTask.actionWhat}
                        />
                      </Box>

                      <Box
                        className="mt-10"
                        sx={{
                          width: "100%",
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
                        // marginTop: "30px",
                        justifyContent: "space-between",
                        // margin: "15px",
                      }}
                      className="sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 sm:gap-24 w-full"
                    >
                      <FormControl
                        className="mt-10"
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <Box>
                          <FormLabel
                            className="font-medium text-14"
                            component="legend"
                          >
                            MOC Phase *
                          </FormLabel>
                          <TextField
                            fullWidth
                            name="deadline"
                            value={currentActiveStepLabel}
                            onChange={handleChangeAddTask}
                          />
                        </Box>
                      </FormControl>
                      <FormControl
                        className="mt-10"
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
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
                    </div>
                  </div>{" "}
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        // marginTop: "30px",
                        justifyContent: "space-between",
                        // margin: "15px",
                      }}
                      className="sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 sm:gap-24 w-full"
                    >
                      <Box
                        className="mt-10"
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <FormControl error={!!errorsAddTask.dueDate}>
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
                      </Box>
                      <Box
                        className="mt-10"
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Audit Comment
                        </FormLabel>
                        <TextField
                          fullWidth
                          id="fullWidth"
                          name="audit"
                          onChange={handleChangeAddTask}
                          value={taskAdd.audit}
                        // error={!!errorsAddTask.audit}
                        // helperText={errorsAddTask.audit}
                        />
                        <h6 className="text-grey">
                          If this task is based on Audit comments, please select
                          the Audit comment
                        </h6>
                      </Box>
                    </div>
                  </div>{" "}
                </div>
                <div className="flex justify-end p-30 pt-24 pb-24">
                  <Button
                    className="whitespace-nowrap ms-5 me-12 "
                    variant="contained"
                    color="secondary"
                    style={
                      {
                        // marginTop: "10px",
                      }
                    }
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
            onClick={SubmitApprovelCreate}
          >
            Submit
          </Button>
        </div>
      </ConfirmationModal>

      <DateExtend
        dateExtendopen={dateExtendopen}
        handlehandledateExtendClose={handlehandledateExtendClose}
        task={task}
        ShowTask={ShowTask}
        formatDates={formatDates}
        setCommentss={setCommentss}
        AdapterDateFns={AdapterDateFns}
        reqDate={reqDate}
        setReqDate={setReqDate}
        dueDateValidation={dueDateValidation}
        setDueDateValidation={setDueDateValidation}
        commentss={commentss}
        dueDateCommentValidation={dueDateCommentValidation}
        setDueDateCommentValidation={setDueDateCommentValidation}
        handleSubmits={handleSubmits}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={pssrOpen}
        onClose={handlePssrClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={pssrOpen}>
          <Box sx={stylePssr}>
            <Box
              style={{
                padding: "25px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                color: "white",
              }}
              className="cursor-pointer"
              onClick={handlePssrClose}
            >
              <h4 className="pt-12">PSSR Team</h4>
              <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
            </Box>
            <Box
              sx={{
                overflow: "auto",
                padding: "5px 30px 30px 30px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {pssrList.map((item) => (
                  <li
                    key={item.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Checkbox
                      checked={checkedItems.some((i) => i.value === item.value)}
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                    <label
                      htmlFor={`pssr-${item.value}`}
                      style={{ marginLeft: "10px" }}
                    >
                      {item.text}
                    </label>
                  </li>
                ))}
              </ul>
              <Button
                variant="contained"
                color="secondary"
                sx={{ float: "right" }}
                className="mx-12"
                onClick={handlePssrSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <PssrSession
        pssrSessionOpen={pssrSessionOpen}
        setPssrSessionOpen={setPssrSessionOpen}
        pssrsessionStatus={pssrsessionStatus}
        teamList={teamList}
        pssrList={pssrList}
        checkedStaff={checkedStaff}
        handleCheckboxSessionChange={handleCheckboxSessionChange}
        handlePssrSessionSave={handlePssrSessionSave}
        startedAt={activeSessiondata?.startedAt}
        handleStopSession={handleStopSession}
        stopComment={stopComment}
        setStopComment={setStopComment}
      />
      <Initiation
        contentDetailsT={contentDetails}
        contentDetailsini={contentDetailsini}
        assetEvaluationId={assetEvaluationId}
        contentDetailsDocu={contentDetails}
      />
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div className="border-b">
            <div className="flex items-center w-full border-b justify-between p-30 pt-24 pb-24">
              {showPssrCheckList ? (
                <div className="flex justify-between w-100">
                  <h2 className="text-2xl font-semibold pt-5">
                    PSSR Checklist
                  </h2>
                  {PssrCheckListData?.pssrData?.length > 0 && (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="primary"
                      style={{
                        padding: "10px",
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid grey",
                      }}
                      onClick={handlePssrEdit}
                    >
                      <FuseSvgIcon className="text-48" size={24} color="action">
                        heroicons-outline:pencil-alt
                      </FuseSvgIcon>
                      Edit
                    </Button>
                  )}
                </div>
              ) : (
                <h2 className="text-2xl font-semibold pt-5">Implementation</h2>
              )}

              <div>
                {contentDetailsPssr?.isPssrRequired &&
                  !isActiveSession &&
                  currentActivityForm.canEdit &&
                  !showPssrCheckList && (
                    <Button
                      className="whitespace-nowrap me-5"
                      style={{
                        border: "1px solid",
                        backgroundColor: "#0000",
                        color: "black",
                        borderColor: "rgba(203,213,225)",
                      }}
                      variant="contained"
                      color="warning"
                      onClick={handelPssrTeam}
                    >
                      <FuseSvgIcon className="text-48" size={24} color="action">
                        heroicons-outline:document-add
                      </FuseSvgIcon>
                      {!startSessionButon
                        ? "Add PSSR Team"
                        : "Update PSSR Team"}
                    </Button>
                  )}
                {contentDetailsPssr?.isPssrRequired &&
                  startSessionButon &&
                  currentActivityForm.canEdit &&
                  !showPssrCheckList && (
                    <Button
                      className="whitespace-nowrap me-5"
                      style={{
                        border: "1px solid",
                        backgroundColor: "#0000",
                        color: "black",
                        borderColor: "rgba(203,213,225)",
                      }}
                      variant="contained"
                      color="warning"
                      onClick={handelPssrTeamSession}
                    >
                      <FuseSvgIcon className="text-48" size={24} color="action">
                        heroicons-outline:document-add
                      </FuseSvgIcon>
                      {pssrsessionStatus === 0 && "Create PSSR Session"}
                      {pssrsessionStatus === 1 && "Start PSSR Session"}
                      {pssrsessionStatus === 2 && "Stop PSSR Session"}


                    </Button>
                  )}
                {contentDetailsPssr?.isPssrRequired &&
                  isActiveSession &&
                  currentActivityForm.canEdit &&
                  !showPssrCheckList && (
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
                      onClick={handelPssrCheckLists}
                    >
                      <FuseSvgIcon className="text-48" size={24} color="action">
                        heroicons-outline:document-add
                      </FuseSvgIcon>
                      PSSR Checklist
                    </Button>
                  )}
              </div>
            </div>

            {!showPssrCheckList && (
              <>
                <ImplementationView
                  steps={steps}
                  ImpDetails={ImpDetails}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  handleOpenImplemntationTask={handleOpenImplemntationTask}
                  handleAccordionChange={handleAccordionChange}
                  handleReset={handleReset}
                  isComplete={currentActivityForm.isComplete}
                  status={currentActivityForm.status}
                  canEdit={currentActivityForm.canEdit}
                  handleBack={handleBack}
                  handleNext={handleNext}
                  ChangeDeadlineLabel={ChangeDeadlineLabel}
                  expanded={expanded}
                  formatDate={formatDate}
                  impComments={impComments}
                  handelComments={handelComments}
                  handelOpenAuditComment={handelOpenAuditComment}
                  documentCounts={documentCounts}
                  handelOpenAudit={handelOpenAudit}
                  handleOpen={handleOpen}
                  errorMessage={errorMessage}
                  isButtonDisabled={isButtonDisabled}
                  handledateExtendopen={handledateExtendopen}
                  handelApproveImpl={handelApproveImpl}
                  setComments={setComments}
                  setErrorMessage={setErrorMessage}
                  handelRejectImpl={handelRejectImpl}
                />
              </>
            )}
            {showPssrCheckList && (
              <>
                <PssrCheckListPart
                  PssrCheckListData={PssrCheckListData}
                  checklistData={checklistData}
                  documentCountsImp={documentCountsImp}
                  radioState={radioState}
                  handleRadioChange={handleRadioChange}
                  showPssrEdit={showPssrEdit}
                  remarksState={remarksState}
                  handleCommentsChange={handleCommentsChange}
                  handleOpenPssR={handleOpenPssR}
                  handleSubmitCheckList={handleSubmitCheckList}
                  setShowPssrEdit={setShowPssrEdit}
                  setShowPssrCheckList={setShowPssrCheckList}
                />
              </>
            )}
          </div>

          {/* <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div> */}
          {!showPssrCheckList && (
            <div className="p-30 pt-24 pb-24 border-b">
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
                onClick={() => handelOpenAudit("", "fullList")}
              >
                <FuseSvgIcon className="text-48" size={24} color="action">
                  heroicons-outline:document-text
                </FuseSvgIcon>
                Audit Lists
              </Button>
            </div>
          )}
          {lastActCode?.canExecute &&
            !showPssrCheckList &&
            !isActiveSession && (
              <div className="flex justify-end p-30">
                {AppActions.map((btn) => (
                  <>
                    <Button
                      key={btn.uid}
                      className="whitespace-nowrap ms-5"
                      variant="contained"
                      color="secondary"
                      // style={{ marginTop: "10px" }}
                      onClick={() => handlesumbitmodal(btn.uid)}
                    // onClick={(e) => SubmitApprovelCreate(e, btn.uid)}
                    >
                      {btn.name}
                    </Button>
                  </>
                ))}
              </div>
            )}
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default ImplementationApproval;
