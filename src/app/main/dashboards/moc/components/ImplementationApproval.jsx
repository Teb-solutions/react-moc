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
import { ChangeDeadlineLabel } from "./ChangeDeadLineLabels";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TableContainer from "@mui/material/TableContainer";
import { styled } from "@mui/material/styles";
import Initiation from "./Initiation";
import FuseLoading from "@fuse/core/FuseLoading";
import { withStyles } from "@mui/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

import { display } from "@mui/system";
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
}) {
  const columns = [
    { id: "index", label: "#", minWidth: 50 },
    {
      id: "Task",
      label: "Task",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Audit",
      label: "Audit Comments",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: "Done By date",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "staff",
      label: "Done By staff",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const styleAudit = {
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
  const styleAuditCom = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
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
  const handleCloseAudit = () => setOpenAudit(false);
  const handleCloseAuditComment = () => setOpenAuditComment(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [currentAudit, setCurrentAudit] = useState([]);
  const [docStaff, setDocStaff] = useState([]);

  //modal part
  const [open, setOpen] = useState(false);
  const [deletes, setDeletes] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
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
        if (resp.data.statusCode == 400) {
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
        toast.success("PSSR List Added");
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
      setChecklistData(initialChecklistData);

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
  const handleCommentsChange = (childValue, newComment) => {
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
    setIsLoading(true);
    let taskListApproved = ImpDetails?.filter((x) => x.taskStatus == 3);

    if (ImpDetails?.length != taskListApproved?.length) {
      toast?.error("There are some pending Tasks to be reviewed.");
      setOpenSubmit(false);
      return;
    }

    let incompleteChecklists = PssrCheckListData?.childData?.filter((child) => {
      // Find matching entry in checklistData by 'particular' field
      const matchedEntry = checklistData.find(
        (item) => item.particular === child.value
      );

      // If there's no matching entry in checklistData, skip this child (do not mark it incomplete)
      if (!matchedEntry) {
        return false; // Skip items without matching IDs
      }

      // Check if the matched entry is missing any required field (remarks, checklistRevNiewStatus, documentId)
      return (
        !matchedEntry.remarks || // Remarks should not be empty
        !matchedEntry.checklistReviewStatus || // Review status should not be empty
        !matchedEntry.documentId // Document ID should not be empty
      );
    });

    // If any checklist from PssrCheckListData has missing fields, show error and prevent submission
    if (incompleteChecklists.length > 0) {
      toast?.error("Some items are not reviewed.");
      setOpenSubmit(false);
      return;
    }

    apiAuth
      .put(`/ImplementationPSSR/Create?id=${assetEvaluationId}`, checklistData)
      .then((resp) => {
        if (resp.data.statusCode == 200) {
          toast?.success("Checklist submitted successfully!");
          setShowPssrCheckList(false);
          setShowPssrEdit(false);
          setIsLoading(false);
        } else {
          toast?.error(resp.data.message);

          setIsLoading(false);
        }
        // Handle success response if needed
      })
      .catch((error) => {
        toast?.error("An error occurred while submitting the checklist.");
        // Handle error response
      });
  };
  const [showPssrEdit, setShowPssrEdit] = useState(false);

  const handlePssrEdit = () => {
    setShowPssrEdit(true);
  };

  console.log(checklistData, "checklistData");

  const [dueDateCommentValidation, setDueDateCommentValidation] =
    useState(null);
  const [dueDateValidation, setDueDateValidation] = useState(null);

  const handledateExtendopen = (e, task, show) => {
    e.preventDefault();
    if (show == "false") {
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

    if (value == "fullList") {
      const response = await apiAuth.get(
        `/ChangeImplementation/AuditList/${assetEvaluationId}`
      );
      console.log(response, "ressss");
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

    if (!taskAdd.actionWhat) tempErrors.actionWhat = "Action Name is required";
    if (!taskAdd.actionHow) tempErrors.actionHow = "Action Name is required";
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
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {});
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
      console.log(updatedTaskAdd, "updatedTaskAdd");
      apiAuth
        .put(`/Task/AddNewTask/${assetEvaluationId}`, updatedTaskAdd)
        .then((resp) => {
          setOpenImplemntationTask(false);
          getRecords();
        });
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handelAuditCommentSubmit = () => {
    apiAuth
      .put(
        `/ChangeImplementation/Audit/?requestToken=${assetEvaluationId}&&taskId=${auditData.auditsid}`,
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

  const ListDoc = (docu_id, id) => {
    apiAuth
      .get(`/DocumentManager/DocList/${docu_id}/Task?changeRequestToken=${id}`)
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };

  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
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

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedDocument.name); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  const handleCloseDelete = () => {
    setDeletes(false);
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
      (update) => update.taskdateupdateStatus == 1
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
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
        <Fade in={open}>
          <Box sx={style1}>
            <div
              className="flex justify-end "
              style={{ marginTop: "-16px", marginRight: "-16px" }}
            >
              <Button
                className=""
                variant="contained"
                style={{ backgroundColor: "white" }}
                onClick={handleModalClose}
              >
                <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
              </Button>
            </div>
            <Box sx={{ flex: 1 }}>
              <Box
                className="flex justify-between "
                sx={{
                  marginTop: "0 !important",
                  paddingTop: "0 !important",
                }}
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
                  <Typography id="transition-modal-subtitle" component="h2">
                    {listDocument.length} Files
                  </Typography>
                </Typography>
                <Box>
                  {/* <Button
                    className=""
                    variant="contained"
                    color="secondary"
                    onClick={toggleDrawer(true)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                    <span className="mx-4 sm:mx-8">Upload File</span>
                  </Button> */}
                </Box>
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
                        {doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        )}
                        <h6 className="truncate-text">{doc?.name}</h6>
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
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
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
                      <span className="mx-4 sm:mx-8">Upload File</span>
                    </Button>
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Information</BoldLabel>}
                      variant="standard"
                      disabled
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="selectedFileName"
                      label="Selecte File"
                      variant="standard"
                      disabled
                      value={selectedFile.name}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<>Description</>}
                      name="description"
                      variant="standard"
                      onChange={handelFileDiscriptionChange}
                      value={selectedFile.description}
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
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
                  </Button>
                </div>
                <div>&nbsp;</div>
                <div className="text-center">
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    disabled
                    // onChange={(e) => {
                    //   handelFileChange(e);
                    // }}
                  />
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        // onClick={handelDetailDoc}
                        style={{
                          textAlign: "-webkit-center",
                        }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument?.name}
                    </div>
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Information</BoldLabel>}
                      variant="standard"
                      disabled
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
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
                      "& > :not(style)": { m: 1, width: "25ch" },
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
                      value={formatDate(selectedDocument.createdAt)}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<>Description</>}
                      name="Description"
                      variant="standard"
                      disabled
                      value={
                        selectedDocument?.description === null
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
                  {/* <Button
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
                  </Button> */}
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAuditComment}
        onClose={handleCloseAuditComment}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAuditComment}>
          <Box sx={styleAuditCom}>
            <Box
              className="p-30 pt-24 pb-24"
              style={{
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h5 className="pt-12">Add Audit</h5>
              <Button className="" onClick={handleCloseAuditComment}>
                <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
              </Button>
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
                <div className="flex-auto">
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "10px",
                      }}
                      className="flex flex-row"
                    >
                      <Box sx={{ width: "100%" }}>
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Comments *
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="comments"
                          onChange={handleAddAuditComment}
                        />
                      </Box>
                    </div>
                  </div>{" "}
                </div>
                <div className="flex justify-end p-30 pt-24 pb-24">
                  <Button
                    className="whitespace-nowrap ms-5 me-12 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "5px",
                    }}
                    onClick={handelAuditCommentSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
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
                          Audit Commnt*
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAudit}
        onClose={handleCloseAudit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAudit}>
          <Box sx={styleAudit}>
            <Box
              className="p-30 pt-24 pb-24"
              style={{
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h5 className="pt-12">Audit List</h5>
              <Button className="" onClick={handleCloseAudit}>
                <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
              </Button>
            </Box>
            <div className="p-30 pt-24 pb-24">
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full border-b justify-end"
                style={{ marginTop: "10px" }}
              >
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Search"
                  style={{
                    marginBottom: "15px",
                    backgroundColor: "white",
                  }}
                  //   value={searchTerm}
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
              <Box sx={{ overflow: "auto" }}>
                <TableContainer style={{ marginTop: "15px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns?.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                            }}
                          >
                            {column?.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentAudit
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                              sx={{ padding: "default" }}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                      borderBottom: "1px solid #dddddd",
                                    }}
                                  >
                                    {column.render
                                      ? column.render(row) // Render custom actions
                                      : column.format &&
                                          typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  style={{ display: "flex", marginTop: "10px" }}
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={currentAudit.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSubmit}
        onClose={handleCloseSubmit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openSubmit}>
          <Box sx={style}>
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
                  Submit request
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
                    Once submited you will not be able to revert ! Are you sure
                    you want to continue ?
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
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={dateExtendopen}
        onClose={handlehandledateExtendClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={dateExtendopen}>
          <Box sx={styleExt}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                display: "flex",
                justifyContent: "end",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
              className="cursor-pointer"
              onClick={handlehandledateExtendClose}
            >
              {" "}
              <h4 className="pt-12">Extend Date</h4>
              <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
            </Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 30px 30px" }}>
              <Grid container spacing={2} className="mt-5">
                <Grid item xs={12}>
                  <Table
                    className="mat-elevatio demo-table col-span-12 mt-0 w-full"
                    sx={{ width: "100%" }}
                  >
                    <TableHead
                      sx={{
                        borderBottom: "2px solid silver",
                        fontSize: "medium",
                        border: "1px solid black",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Actual Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ width: "20%", border: "1px solid black" }}
                        >
                          Approved Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Approved Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task?.taskDateUpdates?.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.oldDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.requestComments}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.requestDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedComments || "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedDate
                              ? formatDates(update.approvedDate)
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.taskdateupdateStatus == 2
                              ? "Approved"
                              : update.taskdateupdateStatus == 3
                                ? "Rejected"
                                : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {task?.taskDateUpdates?.length != 0 && !ShowTask && (
                <Grid
                  container
                  spacing={2}
                  className="flex mt-5"
                  direction="row"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Old Due Date
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {formatDates(task?.taskDateUpdates?.[0]?.oldDate)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Date
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {formatDates(task?.taskDateUpdates?.[0]?.requestDate)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Comments
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {task?.taskDateUpdates?.[0]?.requestComments}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    className="flex mt-5"
                    direction="row"
                    alignItems="center"
                    paddingLeft="20px"
                  >
                    <Grid item xs={12} sm={12}>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        style={{ width: "100%" }}
                      >
                        <DatePicker
                          label="Request Date*"
                          value={reqDate}
                          onChange={(newValue) => {
                            setReqDate(newValue);
                            setDueDateValidation(null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={`${dueDateValidation ? "border border-red-500" : ""}`}
                              fullWidth
                              required
                            />
                          )}
                          minDate={new Date("2023-11-15")}
                        />
                      </LocalizationProvider>
                      <div>
                        <span className="text-xs text-red-500 text-grey">
                          {dueDateValidation}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12} className="mt-5">
                      <TextField
                        label="Remark"
                        multiline
                        rows={1}
                        fullWidth
                        required
                        value={commentss}
                        className={`${dueDateCommentValidation ? "error" : ""}`}
                        onChange={(e) => {
                          setCommentss(e.target.value);
                          setDueDateCommentValidation(
                            e.target.value.length > 0
                              ? ""
                              : "Please enter a reason for extension"
                          );
                        }}
                      />
                      <div>
                        <span className="text-xs text-red-500 text-grey">
                          {dueDateCommentValidation}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: "20px" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSubmits(task, 2)}
                        sx={{ float: "right" }}
                        className="mx-12"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSubmits(task, 3)}
                        sx={{ float: "right" }}
                        className="bg-red"
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
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

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={pssrSessionOpen}
        onClose={() => setPssrSessionOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={pssrSessionOpen}>
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
              onClick={() => setPssrSessionOpen(false)}
            >
              <h4 className="pt-12" style={{ fontSize: "17px" }}>
                PSSR Session
              </h4>
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
              {pssrsessionStatus == 0 && (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {pssrList.map((item) => (
                    <li
                      key={item.staffId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Checkbox
                        checked={checkedStaff.includes(item.staffId)}
                        onChange={() =>
                          handleCheckboxSessionChange(item.staffId)
                        }
                      />
                      <label
                        htmlFor={`pssr-${item.staffId}`}
                        style={{ marginLeft: "10px" }}
                      >
                        {item.staffName}
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <>
                {(pssrsessionStatus == 1 || pssrsessionStatus == 2) && (
                  <>
                    <h3 style={{ padding: "2rem" }}>
                      {pssrsessionStatus != 2 && " PSSR session created by "}
                      {pssrsessionStatus == 1 ||
                        (pssrsessionStatus == 2 && " PSSR session started by ")}
                      {""}
                      <b>{localStorage.getItem("username")} </b>
                      on{" "}
                      <b>
                        {new Date(activeSessiondata?.startedAt).toLocaleString(
                          "en-US",
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </b>
                    </h3>
                    <h3 style={{ paddingLeft: "2rem" }}>
                      {" "}
                      <b>TEAM</b>
                    </h3>
                  </>
                )}
                <ul style={{ paddingLeft: "2rem" }}>
                  {teamList.map((item) => (
                    <li
                      style={{
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.staffName}
                      {item.approvalStatus === 1 ? (
                        <span
                          style={{
                            color: "orangered",
                            fontSize: "14px",
                            marginLeft: "8px",
                          }}
                        >
                          Approval Pending
                        </span>
                      ) : item.approvalStatus === 2 ? (
                        <span
                          style={{
                            color: "green",
                            fontSize: "14px",
                            marginLeft: "8px",
                          }}
                        >
                          Approved
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                            fontSize: "14px",
                            marginLeft: "8px",
                          }}
                        >
                          Rejected
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {pssrsessionStatus == 2 && (
                  <div style={{ paddingLeft: "2rem" }}>
                    <textarea
                      placeholder="Comment *"
                      onChange={(e) => setStopComment(e.target.value)}
                    />
                  </div>
                )}

                {pssrsessionStatus == 2 && (
                  <div className="flex justify-end p-5 pt-24 pb-24">
                    <button
                      className="stop-session"
                      onClick={handleStopSession}
                      style={
                        stopComment == "" ? { backgroundColor: "#c5c5c5" } : {}
                      }
                      disabled={stopComment == ""}
                    >
                      Stop Session
                    </button>
                  </div>
                )}
              </>

              {pssrsessionStatus == 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ float: "right" }}
                  className="mx-12"
                  onClick={handlePssrSessionSave}
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Initiation
        contentDetailsT={contentDetails}
        contentDetailsini={contentDetailsini}
        assetEvaluationId={assetEvaluationId}
        contentDetailsDocu={contentDetails}
      />
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div class="border-b">
            <div className="flex items-center w-full border-b justify-between p-30 pt-24 pb-24">
              {showPssrCheckList ? (
                <div className="flex justify-between w-100">
                  <h2 className="text-2xl font-semibold pt-5">
                    PSSR Checklist
                  </h2>
                  {PssrCheckListData?.pssrData?.length && (
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
                {contentDetails?.isPssrRequired &&
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
                {contentDetails?.isPssrRequired &&
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

                      {console.log(pssrsessionStatus, "pssrsessionStatus")}
                    </Button>
                  )}
                {contentDetails?.isPssrRequired &&
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
              <Box className="p-30 pt-24 pb-24" sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps?.map((step, index) => {
                    const tasksForStep = ImpDetails.filter(
                      (detail) =>
                        ChangeDeadlineLabel.get(detail.deadline) === step.label
                    );

                    return (
                      <Step key={step?.label}>
                        <StepLabel
                          onClick={() => setActiveStep(index)}
                          StepIconProps={{
                            sx: {
                              "&.MuiStepIcon-root": { color: "blue" },
                              "&.MuiStepIcon-active": { color: "blue" },
                              "&.MuiStepIcon-completed": { color: "blue" },
                            },
                          }}
                          sx={{
                            backgroundColor:
                              activeStep === index ? "#f0f0f0" : "#f9f9f9",
                            padding: "15px",
                            borderRadius: "10px",
                            marginTop: "0",
                            cursor: "pointer",
                          }}
                        >
                          {step?.label}
                        </StepLabel>
                        <StepContent>
                          <div
                            _ngcontent-fyk-c288=""
                            class="flex flex-wrap items-center w-full justify-between pt-10 pb-10"
                          >
                            <div className="flex flex-wrap items-center">
                              <h2
                                _ngcontent-fyk-c288=""
                                class="text-lg font-semibold"
                                style={{ marginRight: "15px" }}
                              >
                                {tasksForStep.length} Tasks
                              </h2>
                              {!currentActivityForm.isComplete &&
                                currentActivityForm.status === "Pending" &&
                                currentActivityForm.canEdit && (
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
                            // onClick={handleOpen}
                          >
                            Audits Lists
                          </Button> */}
                            </div>

                            <TextField
                              variant="filled"
                              fullWidth
                              placeholder="Search"
                              className="mt-10 md:mt-0"
                              style={{
                                backgroundColor: "white",
                              }}
                              //   value={searchTerm}
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
                          {ImpDetails.map((detail) => {
                            const deadlineLabel = ChangeDeadlineLabel.get(
                              detail.deadline
                            );

                            if (deadlineLabel === step?.label) {
                              return (
                                <Accordion
                                  key={detail.id}
                                  expanded={expanded === detail.id}
                                  sx={{
                                    mt: 2,
                                    minHeight: "70px",
                                    transition: "height 0.3s",
                                    "&.Mui-expanded": {
                                      minHeight: "100px",
                                    },
                                    "@media (max-width: 600px)": {
                                      mt: 4,
                                    },
                                  }}
                                  onChange={handleAccordionChange(detail.id)}
                                >
                                  <AccordionSummary
                                    className="justify-content-Accordian_title"
                                    style={{ minHeight: "60px" }}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${index + 1}-content`}
                                    id={`panel${index + 1}-header`}
                                    onClick={(e) =>
                                      handelComments(e, detail.id)
                                    }
                                  >
                                    <div className="d-flex flex-wrap justify-between w-100 pr-10">
                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div className="flex items-center">
                                          <b>Task #{detail.id}</b>
                                        </div>
                                      </div>

                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div
                                          className="flex items-center"
                                          style={{}}
                                        >
                                          {detail.isCompleted &&
                                          detail.taskStatus === 3 ? (
                                            <span className="text-green">
                                              Approved
                                            </span>
                                          ) : detail.isCompleted &&
                                            detail.taskStatus !== 3 ? (
                                            <span className="text-red">
                                              Awaiting Approval
                                            </span>
                                          ) : (
                                            <span className="text-black">
                                              <b>Not Completed</b>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div className="flex items-center">
                                          No Risks
                                        </div>
                                      </div>
                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div className="flex items-center">
                                          {detail.assignedStaff}
                                        </div>
                                      </div>

                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div className="flex items-center">
                                          {formatDate(detail.dueDate)}
                                        </div>
                                      </div>
                                      <div
                                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                        // style={{ width: "17%" }}
                                      >
                                        <div className="flex items-center">
                                          <StyledBadge
                                            badgeContent={
                                              detail?.audits?.length
                                            }
                                          >
                                            <Button
                                              className="whitespace-nowrap"
                                              style={{
                                                border: "1px solid",
                                                backgroundColor: "#0000",
                                                color: "black",
                                                borderColor:
                                                  "rgba(203,213,225)",
                                              }}
                                              variant="contained"
                                              color="warning"
                                              onClick={() => {
                                                handelOpenAudit(
                                                  detail.audits,
                                                  ""
                                                );
                                                e.stopPropagation();
                                              }}
                                            >
                                              Audits
                                            </Button>
                                          </StyledBadge>
                                          {/* {currentActivityForm?.canEdit && ( */}
                                          <Button
                                            className="whitespace-nowrap ms-5"
                                            style={{
                                              border: "1px solid",
                                              backgroundColor: "#0000",
                                              color: "black",
                                              borderColor: "rgba(203,213,225)",
                                            }}
                                            variant="contained"
                                            color="warning"
                                            onClick={() => {
                                              handelOpenAuditComment(detail.id);
                                              e.stopPropagation();
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
                                          {/* )} */}
                                          {detail?.taskDateUpdates.length !==
                                            0 &&
                                            currentActivityForm?.canEdit &&
                                            (!detail.taskDateUpdates[
                                              detail.taskDateUpdates.length - 1
                                            ]?.approvedComments ? (
                                              <Button
                                                className="whitespace-nowrap ms-5"
                                                style={{
                                                  border: "1px solid",
                                                  backgroundColor: "#0000",
                                                  color: "black",
                                                  borderColor:
                                                    "rgba(203,213,225)",
                                                }}
                                                variant="contained"
                                                color="warning"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handledateExtendopen(
                                                    e,
                                                    detail,
                                                    "true"
                                                  );
                                                }}
                                              >
                                                <FuseSvgIcon
                                                  className="text-48"
                                                  size={24}
                                                  color="red"
                                                >
                                                  heroicons-outline:calendar
                                                </FuseSvgIcon>
                                              </Button>
                                            ) : (
                                              <Button
                                                className="whitespace-nowrap ms-5"
                                                style={{
                                                  border: "1px solid",
                                                  backgroundColor: "#0000",
                                                  color: "black",
                                                  borderColor:
                                                    "rgba(203,213,225)",
                                                }}
                                                variant="contained"
                                                color="warning"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handledateExtendopen(
                                                    e,
                                                    detail,
                                                    "false"
                                                  );
                                                }}
                                              >
                                                <FuseSvgIcon
                                                  className="text-48"
                                                  size={24}
                                                  color="action"
                                                >
                                                  heroicons-outline:calendar
                                                </FuseSvgIcon>
                                              </Button>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionSummary>

                                  <AccordionDetails>
                                    <Stepper orientation="vertical">
                                      <Step>
                                        <div
                                          style={{ alignItems: "flex-start" }}
                                        >
                                          <div className="flex flex-col items-start mb-08">
                                            <div
                                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                              style={{
                                                padding: "10px",
                                                backgroundColor: "#dbeafe",
                                              }}
                                            >
                                              <b>{detail?.assignedByStaff}</b>
                                              <p>
                                                What is the task :{" "}
                                                {detail?.actionWhat}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex flex-col items-start mb-08">
                                            <div
                                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                              style={{
                                                padding: "10px",
                                                backgroundColor: "#dbeafe",
                                              }}
                                            >
                                              <p>
                                                How is Task done :{" "}
                                                {detail?.actionHow}
                                              </p>
                                            </div>
                                          </div>
                                          {detail?.particularName &&
                                            detail?.particularSubName && (
                                              <div className="flex flex-col items-start mb-08">
                                                <div
                                                  className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                                  style={{
                                                    padding: "10px",
                                                    backgroundColor: "#dbeafe",
                                                  }}
                                                >
                                                  <p>
                                                    Impact :{" "}
                                                    {`${detail?.particularName} > ${detail?.particularSubName}`}
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          <div className="flex flex-col items-start mb-08">
                                            <div
                                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                              style={{
                                                padding: "10px",
                                                backgroundColor: "#dbeafe",
                                              }}
                                            >
                                              <p>
                                                Due Date :{" "}
                                                {formatDate(detail.dueDate)}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-center my-3">
                                            <div className="flex-auto border-b"></div>
                                            <div
                                              className="flex-0 mt-10 "
                                              style={{ fontSize: "xx-small" }}
                                            >
                                              <b>{detail?.assignedByStaff}</b>{" "}
                                              has assigned task to{" "}
                                              <b>{detail?.assignedStaff}</b> on{" "}
                                              {formatDate(detail.assignedAt)}
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
                                                  style={{
                                                    position: "relative",
                                                    justifyContent: "end",
                                                  }}
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
                                                      {
                                                        detail.assignedStaff
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
                                                          ? `Started on ${formatDate(msg.startedDate)}`
                                                          : msg.workInProgressDate &&
                                                              !msg.completedDate &&
                                                              !msg.dueDate
                                                            ? `Work in Progress since ${formatDate(msg.workInProgressDate)}`
                                                            : msg.dueDate &&
                                                                !msg.completedDate
                                                              ? `Due on ${formatDate(msg.dueDate)}`
                                                              : msg.completedDate
                                                                ? `Completed on ${formatDate(msg.completedDate)}`
                                                                : "Unknown"}
                                                      </small>
                                                    </div>
                                                  </div>
                                                  {documentCounts[msg.id] ? (
                                                    documentCounts[msg.id] !=
                                                      0 && (
                                                      <button
                                                        className="icon-button"
                                                        onClick={() =>
                                                          handleOpen(msg.id)
                                                        }
                                                        style={{
                                                          top: "-19px",
                                                          right: "10px",
                                                        }}
                                                      >
                                                        <StyledBadge
                                                          badgeContent={
                                                            documentCounts[
                                                              msg.id
                                                            ]
                                                          }
                                                        >
                                                          <button
                                                            className="icon-button"
                                                            onClick={() =>
                                                              handleOpen(msg.id)
                                                            }
                                                            style={{
                                                              top: "-0px",
                                                            }}
                                                          >
                                                            <FuseSvgIcon
                                                              size={20}
                                                            >
                                                              heroicons-solid:document
                                                            </FuseSvgIcon>
                                                          </button>
                                                        </StyledBadge>
                                                      </button>
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
                                                      backgroundColor:
                                                        "#dbeafe",
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
                                                        detail.assignedByStaff
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
                                                          {msg.taskStatus === 3
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
                                          {detail.isCompleted &&
                                            detail.taskStatus !== 3 && (
                                              <>
                                                <div className="flex flex-col shrink-0 mt-5 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
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
                                                          onChange={(e) => {
                                                            setComments(
                                                              e.target.value
                                                            );
                                                            if (
                                                              e.target.value.trim() !==
                                                              ""
                                                            ) {
                                                              setErrorMessage(
                                                                ""
                                                              ); // Clear error message on input change
                                                            }
                                                          }}
                                                          label="Reason For Change*"
                                                          className="mt-5"
                                                        />
                                                        {errorMessage && (
                                                          <div className="text-red-500 text-sm mt-1">
                                                            {errorMessage}
                                                          </div>
                                                        )}
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
                                                        backgroundColor:
                                                          "white",
                                                        color: "black",
                                                      }}
                                                      onClick={(e) =>
                                                        handelRejectImpl(
                                                          e,
                                                          detail
                                                        )
                                                      }
                                                      disabled={
                                                        isButtonDisabled
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
                                                          detail
                                                        )
                                                      }
                                                      disabled={
                                                        isButtonDisabled
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
                              );
                            }
                            return null;
                          })}
                          <div
                            className="flex mt-7 pt-24"
                            style={{ justifyContent: "end" }}
                          >
                            <Box>
                              <div>
                                <Button
                                  disabled={index === 0}
                                  onClick={handleBack}
                                  sx={{
                                    mr: 1,
                                    backgroundColor:
                                      index !== 0 ? "black" : "default",
                                    color: index !== 0 ? "white" : "default",
                                    "&:hover": {
                                      backgroundColor:
                                        index !== 0 ? "black" : "default",
                                    },
                                  }}
                                  style={{
                                    paddingLeft: "35px",
                                    paddingRight: "35px",
                                  }}
                                >
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mr: 1 }}
                                  style={{
                                    color: "white",
                                    backgroundColor: "blue",
                                    paddingLeft: "35px",
                                    paddingRight: "35px",
                                  }}
                                >
                                  {index === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                                </Button>
                              </div>
                            </Box>
                          </div>
                        </StepContent>
                      </Step>
                    );
                  })}
                </Stepper>

                {activeStep === steps.length && (
                  <Paper square elevation={0} className="pt-10 pb-10">
                    <Button
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1 }}
                      style={{
                        border: "1px solid",
                        backgroundColor: "#0000",
                        color: "black",
                        borderColor: "rgba(203,213,225)",
                      }}
                    >
                      Reset
                    </Button>
                  </Paper>
                )}
              </Box>
            )}
            {showPssrCheckList && (
              <Box className="p-30 pt-24 pb-24" sx={{ width: "100%" }}>
                {PssrCheckListData?.parentData?.map((parent) => {
                  // Filter childData based on the matching parentId
                  const matchingChildData =
                    PssrCheckListData?.childData?.filter(
                      (child) => child.parentId === parent.value
                    );

                  return (
                    <Box key={parent.value} mb={4}>
                      {/* Parent Section */}
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ backgroundColor: "rgba(241,245,249, 1)" }}
                        className="p-8"
                      >
                        {parent.text}
                      </Typography>

                      {/* Child Section */}
                      {matchingChildData.map((child) => {
                        // Find corresponding entry in pssrData
                        const matchingPssrData =
                          PssrCheckListData?.pssrData?.find(
                            (pssrItem) => pssrItem.particular === child.value
                          );
                        const documentCount =
                          documentCountsImp[matchingPssrData?.id] || 0;

                        return (
                          <Box
                            key={child.value}
                            mb={3}
                            p={2}
                            border={1}
                            borderColor="grey.300"
                            borderRadius={2}
                          >
                            <Typography variant="body1" gutterBottom>
                              {child.text}
                            </Typography>

                            {/* Radio buttons for Yes, No, N/A with default value from pssrData */}
                            <RadioGroup
                              row
                              value={
                                radioState[child.value] ||
                                matchingPssrData?.checklistReviewStatus ||
                                "" // Controlled by state
                              }
                              onChange={(e) =>
                                handleRadioChange(child.value, e.target.value)
                              }
                              disabled={!showPssrEdit}
                            >
                              <FormControlLabel
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                                disabled={!showPssrEdit}
                              />
                              <FormControlLabel
                                value="No"
                                control={<Radio />}
                                label="No"
                                disabled={!showPssrEdit}
                              />
                              <FormControlLabel
                                value="N/A"
                                control={<Radio />}
                                label="N/A"
                                disabled={!showPssrEdit}
                              />
                            </RadioGroup>

                            {/* Comment Section with default value from pssrData */}
                            {matchingPssrData?.remarks && !showPssrEdit ? (
                              <h4 className="p-8">
                                {matchingPssrData?.remarks}
                              </h4>
                            ) : (
                              <TextField
                                label="Add comments"
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={
                                  remarksState[child.value] ||
                                  matchingPssrData?.remarks ||
                                  "" /* Set the default value from state */
                                }
                                onChange={(e) =>
                                  handleCommentsChange(
                                    child.value,
                                    e.target.value
                                  )
                                }
                              />
                            )}

                            {/* Document upload button */}
                            <StyledBadge badgeContent={documentCount}>
                              <Button
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
                                onClick={() =>
                                  handleDocumentUpload(child.value)
                                }
                              >
                                Document
                              </Button>
                            </StyledBadge>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}

                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    justifyContent: "end",
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
                    onClick={() => {
                      setShowPssrCheckList(false);
                      setShowPssrEdit(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    style={{
                      padding: "23px",
                    }}
                    type="submit"
                    onClick={handleSubmitCheckList}
                  >
                    Save
                  </Button>
                </div>
              </Box>
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
          {lastActCode?.canExecute && !showPssrCheckList && (
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
